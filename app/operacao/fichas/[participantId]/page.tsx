import { isOperationalEmail } from "@/lib/auth/operational";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { getState, recordFor } from "@/lib/store/memory";

export default async function OperationalRecordPage({ params }: { params: Promise<{ participantId: string }> }) {
  const session = await readSession();
  if (!session || session.role !== "operational" || !isOperationalEmail(session.email)) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">{messages.accessDenied}</h1>
      </main>
    );
  }
  const { participantId } = await params;
  const participant = getState().participants.find((item) => item.id === participantId);
  const record = participant ? recordFor(participant.email) : null;
  const actions = getState().actions.filter((item) => item.targetId === participantId || item.targetId === record?.enrollment?.id);
  if (!record) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Ficha</h1>
        <p>Inscrição não encontrada.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Ficha de {record.participant.fullName}</h1>
      <p>Estado: {record.enrollment?.status === "confirmed" ? messages.confirmed : messages.pending}</p>
      <h2 className="mt-4 text-lg font-semibold">Histórico</h2>
      <ul>
        {actions.map((item) => (
          <li key={item.id}>
            {item.createdAt} — {item.actorId} — {item.action}
          </li>
        ))}
      </ul>
    </main>
  );
}
