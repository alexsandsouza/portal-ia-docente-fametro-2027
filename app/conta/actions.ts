"use server";

import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { setParticipantCpf, setParticipantPhoto } from "@/lib/store/memory";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { normalizeCpf } from "@/lib/validation/cpf";

export async function saveCpf(formData: FormData) {
  const session = await readSession();
  if (!session || session.role !== "participant") redirect("/inscricao");
  const cpf = normalizeCpf(String(formData.get("cpf") ?? ""));
  if (!cpf) redirect("/conta?erro=" + encodeURIComponent(messages.cpfInvalid));

  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const existing = await supabase.from("participant").select("email").eq("cpf", cpf).maybeSingle();
    if (existing.data && existing.data.email !== session.email) {
      redirect("/conta?erro=" + encodeURIComponent(messages.duplicateCpf));
    }
    const updated = await supabase.from("participant").update({ cpf }).eq("email", session.email);
    if (updated.error) redirect("/conta?erro=" + encodeURIComponent(messages.databaseUnavailable));
  }

  const local = setParticipantCpf(session.email, cpf);
  if (!local.ok && local.duplicate) redirect("/conta?erro=" + encodeURIComponent(messages.duplicateCpf));
  redirect("/conta");
}

export async function savePhoto(formData: FormData): Promise<{ ok: true } | { error: string }> {
  const session = await readSession();
  if (!session || session.role !== "participant") redirect("/inscricao");
  const photo = String(formData.get("photo") ?? "");
  if (!photo.startsWith("data:image/jpeg;base64,") || photo.length > 180_000) {
    return { error: "Escolha uma foto mais leve. O retrato é ajustado automaticamente." };
  }
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const person = await supabase.from("participant").select("id").eq("email", session.email).maybeSingle();
    const bytes = Buffer.from(photo.slice(photo.indexOf(",") + 1), "base64");
    const uploaded = person.data
      ? await supabase.storage.from("avatars").upload(`${person.data.id}.jpg`, bytes, { contentType: "image/jpeg", upsert: true })
      : { error: { message: "ausente" } };
    if (uploaded.error) return { error: messages.databaseUnavailable };
  } else {
    setParticipantPhoto(session.email, photo);
  }
  return { ok: true };
}
