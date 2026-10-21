"use server";

import { redirect } from "next/navigation";
import { contactSubjects } from "@/lib/contact/subjects";
import { gmailReady, sendGmail } from "@/lib/mail/gmail";
import { normalizeEmail } from "@/lib/validation/email";
import { normalizeName } from "@/lib/validation/name";

export async function sendContact(formData: FormData) {
  const name = normalizeName(String(formData.get("name") ?? ""));
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const subject = String(formData.get("subject") ?? "");
  const message = String(formData.get("message") ?? "").trim().slice(0, 4000);
  const allowed = contactSubjects.includes(subject as (typeof contactSubjects)[number]);
  if (!name || !email || !allowed || message.length < 10) {
    redirect("/contato?erro=" + encodeURIComponent("Preencha nome, e-mail, assunto e uma mensagem."));
  }
  const destination = (process.env.OPERATIONAL_EMAILS ?? "").split(",").map((item) => item.trim()).find(Boolean) || process.env.EMAIL_FROM;
  if (!destination || !gmailReady()) {
    redirect("/contato?erro=" + encodeURIComponent("Não foi possível enviar agora. Tente novamente mais tarde."));
  }
  const sent = await sendGmail({
    to: destination,
    replyTo: email,
    subject: `Fale conosco — ${subject}`,
    text: `Nome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\n${message}`,
  });
  if (!sent.ok) redirect("/contato?erro=" + encodeURIComponent("Não foi possível enviar agora. Tente novamente mais tarde."));
  redirect("/contato?enviado=1");
}
