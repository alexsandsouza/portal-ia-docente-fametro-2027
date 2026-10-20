import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeEmail } from "@/lib/validation/email";
import type { Certificate, Enrollment, Participant, Session } from "@/lib/store/memory";

type RemoteRecord = {
  participant: Participant;
  enrollment: Enrollment | null;
  checkIn: { id: string; enrollmentId: string; recordedBy: string; checkedInAt: string } | null;
  challenges: [];
  requests: [];
  certificate: Certificate | null;
  code: string | null;
};

export async function confirmRemoteLink(email: string, version: number, token: string): Promise<Session | null> {
  const supabase = createSupabaseAdminClient();
  const normalized = normalizeEmail(email);
  if (!supabase || !normalized || !token) return null;
  const { data } = await supabase
    .from("operational_action")
    .select("target_type,target_id")
    .eq("action", "access-link")
    .eq("actor_id", normalized)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data || data.target_type !== String(version) || data.target_id !== token) return null;
  const session: Session = { id: randomUUID(), email: normalized, role: "participant", version };
  await supabase.from("operational_action").insert({
    actor_id: normalized,
    action: "session",
    target_type: `participant:${version}`,
    target_id: session.id,
  });
  return session;
}

export async function readRemoteSession(sessionId: string): Promise<Session | null> {
  const supabase = createSupabaseAdminClient();
  if (!supabase || !sessionId) return null;
  const { data } = await supabase
    .from("operational_action")
    .select("actor_id,target_type,target_id")
    .eq("action", "session")
    .eq("target_id", sessionId)
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  const [role, version] = String(data.target_type).split(":");
  return {
    id: sessionId,
    email: data.actor_id,
    role: role === "operational" ? "operational" : "participant",
    version: Number(version || "0"),
  };
}

export async function loadRemoteRecord(email: string): Promise<RemoteRecord | null> {
  const supabase = createSupabaseAdminClient();
  const normalized = normalizeEmail(email);
  if (!supabase || !normalized) return null;
  const { data: person } = await supabase.from("participant").select("id,full_name,email,access_link_version,created_at").eq("email", normalized).maybeSingle();
  if (!person) return null;
  const participant: Participant = {
    id: person.id,
    fullName: person.full_name,
    email: person.email,
    accessLinkVersion: person.access_link_version,
    accessToken: "",
    createdAt: person.created_at,
  };
  const { data: enrollmentRow } = await supabase
    .from("enrollment")
    .select("id,participant_id,status,created_at,confirmed_at,confirmed_by")
    .eq("participant_id", person.id)
    .maybeSingle();
  const enrollment: Enrollment | null = enrollmentRow
    ? {
        id: enrollmentRow.id,
        participantId: enrollmentRow.participant_id,
        status: enrollmentRow.status,
        createdAt: enrollmentRow.created_at,
        confirmedAt: enrollmentRow.confirmed_at,
        confirmedBy: enrollmentRow.confirmed_by,
      }
    : null;
  const { data: checkInRow } = enrollment
    ? await supabase.from("check_in").select("id,enrollment_id,recorded_by,checked_in_at").eq("enrollment_id", enrollment.id).maybeSingle()
    : { data: null };
  const { data: codeRow } = enrollment
    ? await supabase.from("check_in_code").select("code").eq("enrollment_id", enrollment.id).maybeSingle()
    : { data: null };
  const { data: certificateRow } = await supabase
    .from("certificate")
    .select("id,participant_id,authenticity_code,issued_at,authorized_by")
    .eq("participant_id", person.id)
    .maybeSingle();
  return {
    participant,
    enrollment,
    checkIn: checkInRow
      ? { id: checkInRow.id, enrollmentId: checkInRow.enrollment_id, recordedBy: checkInRow.recorded_by, checkedInAt: checkInRow.checked_in_at }
      : null,
    challenges: [],
    requests: [],
    certificate: certificateRow
      ? {
          id: certificateRow.id,
          participantId: certificateRow.participant_id,
          authenticityCode: certificateRow.authenticity_code,
          issuedAt: certificateRow.issued_at,
          authorizedBy: certificateRow.authorized_by,
          emailStatus: "pending",
          emailSentAt: null,
        }
      : null,
    code: codeRow?.code ?? null,
  };
}

export async function loadPublishedMaterials() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("material")
    .select("id,title,description,destination_url,published,updated_by,updated_at")
    .eq("published", true);
  return (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    destinationUrl: item.destination_url,
    published: item.published,
    updatedBy: item.updated_by,
    updatedAt: item.updated_at,
  }));
}
