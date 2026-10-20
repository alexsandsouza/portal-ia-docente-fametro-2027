import { readSession } from "@/lib/auth/session";
import { isOperationalEmail } from "@/lib/auth/operational";
import { getState, recordFor } from "@/lib/store/memory";

export default async function RegistroPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const session = await readSession();
  const query = await searchParams;
  const own = session?.role === "participant" ? recordFor(session.email) : null;
  const staff = session?.role === "operational" && isOperationalEmail(session.email);
  const looked = staff && query.email ? recordFor(query.email) : null;
  const record = looked ?? own;
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Registro</h1>
      {!record ? <p>Não há registro visível para esta sessão.</p> : null}
      {record ? (
        <ol>
          <li>Inscrição em {record.enrollment?.createdAt}</li>
          {record.enrollment?.confirmedAt ? <li>Confirmação em {record.enrollment.confirmedAt}</li> : null}
          {record.checkIn ? <li>Check-in em {record.checkIn.checkedInAt}</li> : null}
          {record.challenges
            .filter((item) => item.progress?.status === "completed")
            .map((item) => (
              <li key={item.challenge.id}>
                Desafio {item.challenge.position} concluído em {item.progress?.completedAt}
              </li>
            ))}
          {record.certificate ? <li>Certificado emitido em {record.certificate.issuedAt}</li> : null}
        </ol>
      ) : null}
      {staff ? (
        <form className="mt-4 grid gap-2">
          <label htmlFor="email">E-mail da inscrição</label>
          <input className="rounded border border-slate-400 px-3 py-2" id="email" name="email" type="email" />
          <button className="w-fit rounded border border-slate-400 px-3 py-2" type="submit">
            Consultar
          </button>
        </form>
      ) : null}
      {staff ? <p className="mt-4">Ações registradas: {getState().actions.length}</p> : null}
    </main>
  );
}
