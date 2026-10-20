import { requestAccess, requestCorrection, requestDeletion } from "@/app/meus-dados/actions";
import { readSession } from "@/lib/auth/session";
import { recordFor } from "@/lib/records/participant-record";

export default async function MeusDadosPage() {
  const session = await readSession();
  const record = session?.role === "participant" ? recordFor(session.email) : null;
  if (!record) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Meus dados</h1>
        <p>Abra o vínculo vigente da inscrição para consultar ou corrigir os seus dados.</p>
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Meus dados</h1>
      <p>Nome armazenado: {record.participant.fullName}</p>
      <p>E-mail armazenado: {record.participant.email}</p>
      <form action={requestAccess} className="mt-4">
        <button className="rounded border border-slate-400 px-3 py-2" type="submit">
          Registrar pedido de acesso
        </button>
      </form>
      <form action={requestCorrection} className="mt-4 grid gap-2">
        <label htmlFor="fullName">Novo nome</label>
        <input className="rounded border border-slate-400 px-3 py-2" id="fullName" name="fullName" />
        <button className="rounded border border-slate-400 px-3 py-2" type="submit">
          Corrigir nome
        </button>
      </form>
      <form action={requestDeletion} className="mt-4">
        <button className="rounded border border-slate-400 px-3 py-2" type="submit">
          Pedir exclusão
        </button>
      </form>
      <h2 className="mt-6 text-lg font-semibold">Pedidos</h2>
      <ul>
        {record.requests.map((item) => (
          <li key={item.id}>
            {item.kind} em {new Date(item.createdAt).toLocaleString("pt-BR")}
            {item.kind === "deletion" && !item.executedAt ? " — pendente de autorização institucional" : ""}
          </li>
        ))}
      </ul>
    </main>
  );
}
