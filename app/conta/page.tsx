import Link from "next/link";
import QRCode from "qrcode";
import { saveCpf } from "@/app/conta/actions";
import { Receipt } from "@/app/inscricao/receipt";
import { PhotoUpload } from "@/components/photo-upload";
import { readSession } from "@/lib/auth/session";
import { accessPath } from "@/lib/auth/send-access-link";
import { messages } from "@/lib/messages/pt-br";
import { recordFor, codeByEnrollment } from "@/lib/store/memory";
import { loadRemoteRecord } from "@/lib/store/remote-portal";
import { maskCpf } from "@/lib/validation/cpf";

function initials(given: string, family: string) {
  return `${given.charAt(0)}${family.charAt(0)}`.trim().toUpperCase() || "FD";
}

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
  const remoteCode = "code" in record && typeof record.code === "string" ? record.code : null;
  const registrationCode = codeByEnrollment(record.enrollment.id)?.code ?? remoteCode;
  const qr = registrationCode
    ? await QRCode.toDataURL(registrationCode, { margin: 1, width: 280, errorCorrectionLevel: "M" })
    : null;
  return (
    <main className="page">
      <article className="credential">
        <PhotoUpload current={record.participant.photo} initials={initials(record.participant.givenName, record.participant.familyName)} />
        <div className="credential-body">
          <p className="hero-kicker">{messages.formation}</p>
          <h1>{record.participant.fullName}</h1>
          <p className="credential-place">{messages.institution}</p>
          <dl className="credential-meta">
            <div>
              <dt>E-mail</dt>
              <dd>{record.participant.email}</dd>
            </div>
            <div>
              <dt>CPF</dt>
              <dd>{cpf || "Não informado"}</dd>
            </div>
            <div>
              <dt>Inscrição</dt>
              <dd>Confirmada</dd>
            </div>
          </dl>
        </div>
        {qr ? (
          <div className="credential-qr">
            <img src={qr} alt="QR Code do registro da inscrição" width={148} height={148} />
            <p>Registro da inscrição</p>
          </div>
        ) : null}
      </article>
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
      {query.erro && cpf ? <p className="mt-4 text-red-800">{query.erro}</p> : null}
      <section className="account-grid">
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
