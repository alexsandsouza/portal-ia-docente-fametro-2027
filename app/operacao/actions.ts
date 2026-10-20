"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isOperationalEmail } from "@/lib/auth/operational";
import { readSession, writeSession } from "@/lib/auth/session";
import { normalizeEmail } from "@/lib/validation/email";
import { openOperationalSession, confirmEnrollment, recordCheckIn, publishMaterial, withdrawMaterial, updateChallenge, authorizeCertificate } from "@/lib/store/memory";

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

export async function challengeAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  const result = updateChallenge(Number(formData.get("position")), String(formData.get("title") ?? ""), String(formData.get("statement") ?? ""), email);
  const params = new URLSearchParams({ aviso: result.ok ? "Desafio atualizado." : result.message });
  redirect(`/operacao?${params.toString()}`);
}

export async function certificateAction(formData: FormData) {
  const email = await actor();
  if (!email) return;
  authorizeCertificate(String(formData.get("participantId") ?? ""), email);
  revalidatePath("/operacao");
  revalidatePath("/certificado");
}
