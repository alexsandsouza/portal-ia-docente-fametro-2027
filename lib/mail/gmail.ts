import { messages } from "@/lib/messages/pt-br";

type Mail = {
  to: string;
  subject: string;
  text: string;
  attachments?: Array<{ filename: string; content: Buffer; contentType: string }>;
};

export function gmailReady() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.EMAIL_FROM);
}

export async function sendGmail(message: Mail) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS?.replace(/\s/g, "");
  const from = process.env.EMAIL_FROM;
  if (!user || !pass || !from) return { ok: false as const, reason: "not_configured" as const };

  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || "587");
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transport.sendMail({
      from,
      to: message.to,
      subject: message.subject,
      text: message.text,
      attachments: message.attachments,
    });
    return { ok: true as const };
  } catch {
    return { ok: false as const, reason: "failed" as const };
  }
}

export async function sendAccessEmail(input: { to: string; fullName: string; url: string }) {
  return sendGmail({
    to: input.to,
    subject: `Acesso — ${messages.formation}`,
    text: `Olá, ${input.fullName}.\n\nSua inscrição na ${messages.formation} foi registrada.\nAbra o vínculo para ver a ficha:\n${input.url}\n\nOs materiais serão liberados ao final do evento. O certificado, quando emitido, será enviado para este e-mail.`,
  });
}
