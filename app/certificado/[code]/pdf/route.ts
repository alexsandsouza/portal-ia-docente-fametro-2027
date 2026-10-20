import { readSession } from "@/lib/auth/session";
import { renderCertificatePdf } from "@/lib/certificates/render-pdf";
import { messages } from "@/lib/messages/pt-br";
import { getState } from "@/lib/store/memory";

export async function GET(_request: Request, context: { params: Promise<{ code: string }> }) {
  const session = await readSession();
  const { code } = await context.params;
  const state = getState();
  const certificate = state.certificates.find((item) => item.authenticityCode === code);
  const participant = certificate ? state.participants.find((item) => item.id === certificate.participantId) : null;
  if (!session || session.role !== "participant" || !certificate || !participant || session.email !== participant.email) {
    return new Response(messages.notAuthorizedCertificate, { status: 403 });
  }
  const pdf = await renderCertificatePdf({
    fullName: participant.fullName,
    issuedAt: certificate.issuedAt,
    code: certificate.authenticityCode,
  });
  return new Response(Buffer.from(pdf), {
    headers: { "content-type": "application/pdf", "content-disposition": "attachment; filename=certificado.pdf" },
  });
}
