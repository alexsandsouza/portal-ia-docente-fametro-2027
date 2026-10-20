import { markComplete } from "@/app/laboratorio/actions";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { recordFor } from "@/lib/records/participant-record";

export default async function LaboratorioPage() {
  const session = await readSession();
  const record = session?.role === "participant" ? recordFor(session.email) : null;
  if (!record) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Laboratório</h1>
        <p>Abra o vínculo vigente da inscrição para ver os cinco desafios.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Laboratório</h1>
      <ol className="mt-4 grid gap-4">
        {record.challenges.map(({ challenge, progress }) => (
          <li key={challenge.id} className="rounded border border-slate-300 bg-white p-4">
            <h2 className="text-lg font-semibold">
              {challenge.position}. {challenge.title}
            </h2>
            <p>{challenge.statement ?? messages.waitingContent}</p>
            <p>Estado: {progress?.status === "completed" ? "concluído" : progress?.status === "not_started" ? "não iniciado" : messages.waitingContent}</p>
            {record.enrollment?.status === "confirmed" && challenge.statement && progress?.status !== "completed" ? (
              <form action={markComplete} className="mt-3">
                <input type="hidden" name="position" value={challenge.position} />
                <button className="rounded bg-blue-800 px-3 py-2 text-white" type="submit">
                  Marcar como concluído
                </button>
              </form>
            ) : null}
          </li>
        ))}
      </ol>
    </main>
  );
}
