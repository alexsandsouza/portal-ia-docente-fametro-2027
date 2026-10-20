import QRCode from "qrcode";
import { readSession } from "@/lib/auth/session";
import { codeByEnrollment } from "@/lib/check-in/issue-code";
import { enrollmentByParticipant, participantByEmail } from "@/lib/store/memory";
import { loadRemoteRecord } from "@/lib/store/remote-portal";

export default async function CodigoPage() {
  const session = await readSession();
  const participant = session?.role === "participant" ? participantByEmail(session.email) : null;
  const enrollment = participant ? enrollmentByParticipant(participant.id) : null;
  const localCode = enrollment?.status === "confirmed" ? codeByEnrollment(enrollment.id) : null;
  const remote = !localCode && session?.role === "participant" ? await loadRemoteRecord(session.email) : null;
  const code = localCode ?? (remote?.code ? { code: remote.code } : null);
  if (!code) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Check-in</h1>
        <p>O código aparece depois da confirmação da inscrição.</p>
      </main>
    );
  }
  const image = await QRCode.toDataURL(code.code, { margin: 1 });
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Check-in</h1>
      <img alt="Código QR do check-in" src={image} width={220} height={220} />
      <p>Código em texto: {code.code}</p>
    </main>
  );
}
