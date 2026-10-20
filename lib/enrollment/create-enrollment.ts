import { randomUUID } from "node:crypto";
import { createOpaqueCode } from "@/lib/check-in/code";
import { messages } from "@/lib/messages/pt-br";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createEnrollment as createLocalEnrollment, forgetEnrollment, type Enrollment, type Participant } from "@/lib/store/memory";

type Created = { ok: true; participant: Participant; enrollment: Enrollment };
type Rejected = { ok: false; field?: "fullName" | "email"; message: string };

export async function createEnrollment(input: { fullName: string; email: string; now?: number }): Promise<Created | Rejected> {
  const supabase = createSupabaseAdminClient();
  const ids = supabase
    ? {
        participantId: randomUUID(),
        enrollmentId: randomUUID(),
        code: createOpaqueCode(),
        accessToken: createOpaqueCode(),
      }
    : undefined;
  const created = createLocalEnrollment({ ...input, ids });
  if (!created.ok || !supabase || !ids) return created;

  const participant = created.participant;
  const enrollment = created.enrollment;
  const participantInsert = await supabase.from("participant").insert({
    id: participant.id,
    full_name: participant.fullName,
    email: participant.email,
    access_link_version: participant.accessLinkVersion,
    created_at: participant.createdAt,
  });
  if (participantInsert.error) {
    forgetEnrollment(participant.email);
    return { ok: false, field: "email", message: remoteMessage(participantInsert.error.code) };
  }

  const enrollmentInsert = await supabase.from("enrollment").insert({
    id: enrollment.id,
    participant_id: participant.id,
    status: enrollment.status,
    created_at: enrollment.createdAt,
    confirmed_at: enrollment.confirmedAt,
    confirmed_by: enrollment.confirmedBy,
  });
  if (enrollmentInsert.error) {
    await supabase.from("participant").delete().eq("id", participant.id);
    forgetEnrollment(participant.email);
    return { ok: false, message: remoteMessage(enrollmentInsert.error.code) };
  }

  const codeInsert = await supabase.from("check_in_code").insert({
    enrollment_id: enrollment.id,
    code: ids.code,
    created_at: enrollment.confirmedAt,
  });
  if (codeInsert.error) {
    await supabase.from("enrollment").delete().eq("id", enrollment.id);
    await supabase.from("participant").delete().eq("id", participant.id);
    forgetEnrollment(participant.email);
    return { ok: false, message: messages.databaseUnavailable };
  }

  await supabase.from("operational_action").insert([
    {
      actor_id: participant.email,
      action: "confirm",
      target_type: "enrollment",
      target_id: enrollment.id,
    },
    {
      actor_id: participant.email,
      action: "access-link",
      target_type: String(participant.accessLinkVersion),
      target_id: participant.accessToken,
    },
  ]);
  return created;
}

function remoteMessage(code: string | undefined) {
  return code === "23505" ? messages.duplicate : messages.databaseUnavailable;
}
