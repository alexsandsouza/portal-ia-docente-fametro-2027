import Link from "next/link";
import { saveCpf } from "@/app/conta/actions";
import { Receipt } from "@/app/inscricao/receipt";
import { readSession } from "@/lib/auth/session";
import { accessPath } from "@/lib/auth/send-access-link";
import { recordFor } from "@/lib/records/participant-record";
import { loadRemoteRecord } from "@/lib/store/remote-portal";
import { maskCpf } from "@/lib/validation/cpf";

export default async function ContaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  const session = await readSession();
  const local = session?.role === "participant" ? recordFor(session.email) : null;
  const record = local?.enrollment ? local : session?.role === "participant" ? await loadRemoteRecord(session.email) : null;
  if (!record?.enrollment) {
    return (
      <main className="page">
        <h1 className="text-4xl">Minha jornada docente</h1>
        <p className="mt-4 max-w-xl leading-7 text-[var(--fametro-muted)]">
          Acompanhe suas inscrições, materiais disponíveis e certificados emitidos. Faça a inscrição ou abra o vínculo enviado ao seu e-mail.
        </p>
        <p className="mt-6">
          <Link className="button-link" href="/inscricao">Fazer inscrição</Link>
        </p>
      </main>
    );
  }
  const cpf = record.participant.cpf ? maskCpf(record.participant.cpf) : "Não informado";
  return (
    <main className="page">
      <h1 className="text-4xl">Minha jornada docente</h1>
      <p className="mt-3 max-w-2xl leading-7 text-[var(--fametro-muted)]">
        Acompanhe suas inscrições, registros de participação, materiais disponíveis e certificados emitidos.
      </p>
      <section className="inscricao-card mt-8 max-w-xl">
        <h2>Perfil</h2>
        <dl className="profile-list">
          <dt>Nome</dt>
          <dd>{record.participant.givenName}</dd>
          <dt>Sobrenome</dt>
          <dd>{record.participant.familyName || "—"}</dd>
          <dt>CPF</dt>
          <dd>{cpf}</dd>
          <dt>E-mail</dt>
          <dd>{record.participant.email}</dd>
        </dl>
        {record.participant.cpf ? null : (
          <form action={saveCpf} className="mt-4 grid gap-2">
            <label className="grid gap-1" htmlFor="cpf">
              Informar CPF
              <input id="cpf" name="cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" required />
            </label>
            <button type="submit">Guardar CPF</button>
            {query.erro ? <p className="text-red-800">{query.erro}</p> : null}
          </form>
        )}
      </section>
      <Receipt
        id={record.enrollment.id}
        status={record.enrollment.status}
        link={record.participant.accessToken ? accessPath(record.participant) : "/ficha"}
        nome={record.participant.fullName}
        destino={record.participant.email}
        quando={record.enrollment.createdAt}
      />
      <p className="mt-8 flex flex-wrap gap-4">
        <Link href="/materiais">Materiais</Link>
        <Link href="/certificado">Certificado</Link>
        <Link href="/ficha">Ficha</Link>
      </p>
    </main>
  );
}
