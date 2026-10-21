"use server";

import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { setParticipantCpf } from "@/lib/store/memory";
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
