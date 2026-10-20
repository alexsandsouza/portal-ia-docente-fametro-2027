import { messages } from "@/lib/messages/pt-br";
import { sendGmail } from "@/lib/mail/gmail";

export async function sendCertificateEmail(input: { to: string; fullName: string; pdf: Uint8Array }) {
  return sendGmail({
    to: input.to,
    subject: `Certificado — ${messages.formation}`,
    text: `Olá, ${input.fullName}.\n\nSegue o certificado da ${messages.formation}, do ${messages.institution}.\nO mesmo arquivo também pode ser baixado no portal.`,
    attachments: [
      {
        filename: "certificado.pdf",
        content: Buffer.from(input.pdf),
        contentType: "application/pdf",
      },
    ],
  });
}
