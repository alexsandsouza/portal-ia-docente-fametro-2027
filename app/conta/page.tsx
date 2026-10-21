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
        <p className="hero-kicker">Área exclusiva</p>
        <h1 className="mt-5 text-4xl">Minha jornada docente</h1>
        <p className="mt-4 max-w-xl leading-7 text-[var(--fametro-muted)]">
          Este espaço mostra o perfil, a inscrição, os materiais e o certificado de quem já se cadastrou. O acesso chega pelo vínculo enviado ao e-mail da inscrição.
        </p>
        <p className="mt-6 flex flex-wrap gap-4">
          <Link className="button-link" href="/inscricao">Fazer inscrição</Link>
          <Link href="/contato">Fale conosco</Link>
        </p>
      </main>
    );
  }
  const cpf = record.participant.cpf ? maskCpf(record.participant.cpf) : "";
  return (
    <main className="page">
      <section className="account-banner">
        <p>Bem-vindo</p>
        <h1>{record.participant.fullName}</h1>
        <p>{record.participant.email}</p>
      </section>
      {cpf ? null : (
        <section className="account-alert">
          <h2>Perfil incompleto</h2>
          <p>Informe o CPF para completar o cadastro. Ele fica visível só para você, de forma mascarada.</p>
          <form action={saveCpf} className="mt-3 grid max-w-sm gap-2">
            <label className="grid gap-1" htmlFor="cpf">
              CPF
              <input id="cpf" name="cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" required />
            </label>
            <button type="submit">Completar perfil</button>
            {query.erro ? <p className="text-red-800">{query.erro}</p> : null}
          </form>
        </section>
      )}
      <section className="account-grid">
        <article className="goal-card">
          <h2>Perfil</h2>
          <dl className="profile-list">
            <dt>Nome</dt>
            <dd>{record.participant.givenName}</dd>
            <dt>Sobrenome</dt>
            <dd>{record.participant.familyName || "—"}</dd>
            <dt>CPF</dt>
            <dd>{cpf || "Não informado"}</dd>
            <dt>E-mail</dt>
            <dd>{record.participant.email}</dd>
          </dl>
        </article>
        <article className="goal-card">
          <h2>Minha inscrição</h2>
          <p>A Formação Docente 2027 está registrada neste e-mail. O comprovante completo fica abaixo.</p>
          <p className="mt-3"><Link href="#comprovante">Ver comprovante</Link></p>
        </article>
        <Link className="portal-card" href="/programacao">
          <span className="block text-lg font-extrabold">Programação</span>
          <span className="mt-1 block text-sm font-medium text-[var(--fametro-muted)]">A programação será publicada assim que estiver confirmada.</span>
        </Link>
        <Link className="portal-card" href="/materiais">
          <span className="block text-lg font-extrabold">Materiais</span>
          <span className="mt-1 block text-sm font-medium text-[var(--fametro-muted)]">Liberados ao final do evento.</span>
        </Link>
        <Link className="portal-card" href="/certificado">
          <span className="block text-lg font-extrabold">Certificado</span>
          <span className="mt-1 block text-sm font-medium text-[var(--fametro-muted)]">Disponível depois da autorização da equipe.</span>
        </Link>
        <Link className="portal-card" href="/contato">
          <span className="block text-lg font-extrabold">Fale conosco</span>
          <span className="mt-1 block text-sm font-medium text-[var(--fametro-muted)]">Dúvidas sobre inscrição, materiais ou certificado.</span>
        </Link>
      </section>
      <div id="comprovante">
        <Receipt
          id={record.enrollment.id}
          status={record.enrollment.status}
          link={record.participant.accessToken ? accessPath(record.participant) : "/ficha"}
          nome={record.participant.fullName}
          destino={record.participant.email}
          quando={record.enrollment.createdAt}
        />
      </div>
    </main>
  );
}
