"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isOperationalEmail } from "@/lib/auth/operational";
import { readSession, writeSession } from "@/lib/auth/session";
import { normalizeEmail } from "@/lib/validation/email";
import { renderCertificatePdf } from "@/lib/certificates/render-pdf";
import { sendCertificateEmail } from "@/lib/certificates/send-certificate";
import { openOperationalSession, confirmEnrollment, recordCheckIn, publishMaterial, withdrawMaterial, authorizeCertificate, getState, markCertificateEmail } from "@/lib/store/memory";

async function actor() {
  const session = await readSession();
  if (!session || session.role !== "operational" || !isOperationalEmail(session.email)) return null;
  return session.email;
}

export async function enterOperation(formData: FormData) {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email || !isOperationalEmail(email)) return;
  const session = openOperationalSession(email);
  if (!session) return;
  await writeSession(session.id);
  revalidatePath("/operacao");
}

export async function confirmAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  confirmEnrollment(String(formData.get("enrollmentId") ?? ""), email);
  revalidatePath("/operacao");
}

export async function checkInAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  const result = recordCheckIn(String(formData.get("code") ?? ""), email);
  const params = new URLSearchParams({ aviso: result.ok ? "Check-in registrado." : result.message });
  redirect(`/operacao?${params.toString()}`);
}

export async function materialAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  const result = publishMaterial({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    destinationUrl: String(formData.get("destinationUrl") ?? ""),
    published: formData.get("published") === "on",
    actorEmail: email,
  });
  const params = new URLSearchParams({ aviso: result.ok ? "Material guardado." : result.message });
  redirect(`/operacao?${params.toString()}`);
}

export async function withdrawAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  withdrawMaterial(String(formData.get("materialId") ?? ""), email);
  redirect("/operacao?aviso=Material+retirado.");
}

export async function certificateAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  const participantId = String(formData.get("participantId") ?? "");
  const result = authorizeCertificate(participantId, email);
  if (!result.ok) {
    redirect(`/operacao?aviso=${encodeURIComponent(result.message)}`);
  }
  const participant = getState().participants.find((item) => item.id === participantId);
  const pdf = await renderCertificatePdf({
    fullName: participant?.fullName ?? "",
    issuedAt: result.certificate.issuedAt,
    code: result.certificate.authenticityCode,
  });
  const sent = participant
    ? await sendCertificateEmail({ to: participant.email, fullName: participant.fullName, pdf })
    : { ok: false as const, reason: "failed" as const };
  markCertificateEmail(participantId, sent.ok ? "sent" : sent.reason);
  const aviso = sent.ok
    ? "Certificado autorizado e enviado ao e-mail cadastrado."
    : sent.reason === "not_configured"
      ? "Certificado autorizado. O envio por e-mail ainda não está configurado."
      : "Certificado autorizado. O download está disponível, mas o e-mail não foi enviado.";
  redirect(`/operacao?aviso=${encodeURIComponent(aviso)}`);
}
