import { EventList } from "@/components/event-list";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { recordFor } from "@/lib/records/participant-record";

export default async function FichaPage() {
  const session = await readSession();
  const record = session?.role === "participant" ? recordFor(session.email) : null;
  if (!record?.enrollment) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Minha ficha</h1>
        <p>Abra o vínculo vigente da inscrição para ver a sua ficha.</p>
      </main>
    );
  }
  const status = record.enrollment.status === "pending" ? messages.pending : messages.confirmed;
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Minha ficha</h1>
      <p>Nome: {record.participant.fullName}</p>
      <p>E-mail: {record.participant.email}</p>
      <p>Identificador: {record.enrollment.id}</p>
      <p>Estado: {status}</p>
      <h2 className="mt-4 text-lg font-semibold">Eventos</h2>
      <EventList
        events={[
          record.enrollment.createdAt ? `Inscrição em ${record.enrollment.createdAt}` : "",
          record.enrollment.confirmedAt ? `Confirmação em ${record.enrollment.confirmedAt}` : "",
          record.checkIn ? `Check-in em ${record.checkIn.checkedInAt}` : "",
          ...record.challenges
            .filter((item) => item.progress?.completedAt)
            .map((item) => `Desafio ${item.challenge.position} concluído em ${item.progress?.completedAt}`),
        ].filter((item) => item.length > 0)}
      />
    </main>
  );
}
