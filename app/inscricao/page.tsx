import { Receipt } from "@/app/inscricao/receipt";
import { submitEnrollment } from "@/app/inscricao/actions";
import { messages } from "@/lib/messages/pt-br";

export default async function InscricaoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Inscrição</h1>
      <form action={submitEnrollment} className="mt-6 grid gap-4">
        <label className="grid gap-1" htmlFor="fullName">
          Nome completo
          <input className="rounded border border-slate-400 px-3 py-2" id="fullName" name="fullName" autoComplete="name" required />
        </label>
        <label className="grid gap-1" htmlFor="email">
          E-mail
          <input className="rounded border border-slate-400 px-3 py-2" id="email" name="email" type="email" autoComplete="email" required />
        </label>
        <button className="rounded bg-blue-800 px-4 py-2 text-white" type="submit">
          Enviar inscrição
        </button>
      </form>
      {query.erro ? <p className="mt-4 text-red-800">{query.erro}</p> : null}
      {query.id && query.estado && query.vinculo ? (
        <Receipt id={query.id} status={query.estado} link={query.vinculo} email={query.email} />
      ) : null}
      <p className="mt-6 text-sm text-slate-600">{messages.formation}</p>
    </main>
  );
}
