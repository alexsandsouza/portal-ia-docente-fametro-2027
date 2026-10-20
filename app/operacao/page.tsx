import { certificateAction, checkInAction, confirmAction, materialAction, withdrawAction } from "@/app/operacao/actions";
import { getState } from "@/lib/store/memory";

export default async function OperationPage({
  searchParams,
}: {
  searchParams: Promise<{ aviso?: string }>;
}) {
  const state = getState();
  const query = await searchParams;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Painel operacional</h1>
      {query.aviso ? <p>{query.aviso}</p> : null}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Confirmar inscrição</h2>
        <ul className="mt-2 grid gap-2">
          {state.enrollments
            .filter((item) => item.status === "pending")
            .map((item) => {
              const person = state.participants.find((participant) => participant.id === item.participantId);
              return (
                <li key={item.id}>
                  <form action={confirmAction} className="flex items-center gap-3">
                    <input type="hidden" name="enrollmentId" value={item.id} />
                    <span>
                      {person?.fullName} — {item.id}
                    </span>
                    <button className="rounded border border-slate-400 px-3 py-1" type="submit">
                      Confirmar {person?.fullName}
                    </button>
                  </form>
                </li>
              );
            })}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Check-in</h2>
        <form action={checkInAction} className="mt-2 grid gap-2">
          <label htmlFor="code">Código</label>
          <input className="rounded border border-slate-400 px-3 py-2" id="code" name="code" />
          <button className="w-fit rounded bg-blue-800 px-3 py-2 text-white" type="submit">
            Registrar
          </button>
        </form>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Material</h2>
        <form action={materialAction} className="mt-2 grid gap-2">
          <label htmlFor="title">Título</label>
          <input className="rounded border border-slate-400 px-3 py-2" id="title" name="title" />
          <label htmlFor="description">Descrição</label>
          <input className="rounded border border-slate-400 px-3 py-2" id="description" name="description" />
          <label htmlFor="destinationUrl">Destino no Drive</label>
          <input className="rounded border border-slate-400 px-3 py-2" id="destinationUrl" name="destinationUrl" />
          <label className="flex gap-2">
            <input name="published" type="checkbox" /> Publicado
          </label>
          <button className="w-fit rounded bg-blue-800 px-3 py-2 text-white" type="submit">
            Guardar
          </button>
        </form>
        <ul className="mt-3">
          {state.materials.map((item) => (
            <li key={item.id}>
              {item.title} — {item.published ? "publicado" : "oculto"}
              <form action={withdrawAction} className="inline">
                <input type="hidden" name="materialId" value={item.id} />
                <button className="ml-2 underline" type="submit">
                  Retirar {item.title}
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Autorizar certificado</h2>
        <ul className="mt-2 grid gap-2">
          {state.participants.map((person) => (
            <li key={person.id}>
              <form action={certificateAction} className="flex items-center gap-3">
                <input type="hidden" name="participantId" value={person.id} />
                <span>{person.fullName}</span>
                <button className="rounded border border-slate-400 px-3 py-1" type="submit">
                  Autorizar
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Auditoria</h2>
        <ul>
          {state.actions.map((item) => (
            <li key={item.id}>
              {item.createdAt} — {item.actorId} — {item.action} — {item.targetId}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
