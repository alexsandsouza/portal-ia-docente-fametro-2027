import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { messages } from "@/lib/messages/pt-br";

export async function renderCertificatePdf(input: {
  fullName: string;
  issuedAt: string;
  code: string;
}): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const date = new Date(input.issuedAt).toLocaleDateString("pt-BR");
  const lines = [
    messages.institution,
    messages.formation,
    "Certificado",
    input.fullName,
    `Data de emissão: ${date}`,
    `Código de autenticidade: ${input.code}`,
  ];
  let y = 760;
  for (const line of lines) {
    page.drawText(line, { x: 56, y, size: 16, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 36;
  }
  return doc.save();
}
