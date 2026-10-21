import { GoogleButton } from "@/app/inscricao/google-button";
import { Receipt } from "@/app/inscricao/receipt";
import { resendAccess, submitEnrollment } from "@/app/inscricao/actions";
import { messages } from "@/lib/messages/pt-br";

export default async function InscricaoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  const ready = Boolean(query.id && query.estado && query.vinculo);
  return (
    <main className="page">
      <p className="hero-kicker">Formação docente · 2027</p>
      <h1 className="mt-5 text-4xl">Inscrição</h1>
      <p className="mt-3 max-w-2xl text-[var(--fametro-muted)]">
        Cadastre-se com a conta do Google ou com nome e e-mail. O comprovante fica disponível para quem conclui a inscrição.
      </p>
      {ready ? (
        <Receipt
          id={query.id!}
          status={query.estado!}
          link={query.vinculo!}
          nome={query.nome}
          destino={query.destino}
          quando={query.quando}
          email={query.email}
        />
      ) : (
        <div className="inscricao-layout">
          <section className="inscricao-card">
            <h2>Entrar com Google</h2>
            <p>Use a conta Google do e-mail em que deseja receber o comprovante e o certificado.</p>
            <GoogleButton />
          </section>
          <section className="inscricao-card">
            <h2>Cadastrar com e-mail</h2>
            <form action={submitEnrollment} className="mt-4 grid gap-4">
              <label className="grid gap-1" htmlFor="fullName">
                Nome completo
                <input id="fullName" name="fullName" autoComplete="name" required />
              </label>
              <label className="grid gap-1" htmlFor="email">
                E-mail
                <input id="email" name="email" type="email" autoComplete="email" required />
              </label>
              <button type="submit">Enviar inscrição</button>
            </form>
          </section>
        </div>
      )}
      {query.erro ? <p className="mt-4 text-red-800">{query.erro}</p> : null}
      {query.aviso ? <p className="mt-4">{query.aviso}</p> : null}
      {query.erro === messages.duplicate ? (
        <form action={resendAccess} className="inscricao-card mt-4 grid gap-3">
          <h2>Ver o comprovante</h2>
          <p>Informe o e-mail da inscrição. Se ele estiver cadastrado, enviamos o acesso sem mostrar os dados nesta tela.</p>
          <label className="grid gap-1" htmlFor="reenvio">
            E-mail da inscrição
            <input id="reenvio" name="email" type="email" autoComplete="email" required />
          </label>
          <button type="submit">Receber o comprovante por e-mail</button>
        </form>
      ) : null}
    </main>
  );
}
