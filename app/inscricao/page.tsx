import Link from "next/link";
import { GoogleButton } from "@/app/inscricao/google-button";
import { resendAccess, submitEnrollment } from "@/app/inscricao/actions";
import { messages } from "@/lib/messages/pt-br";

export default async function InscricaoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  return (
    <main className="page">
      <h1 className="text-4xl">Inscrição</h1>
      <p className="mt-3 max-w-xl leading-7 text-[var(--fametro-muted)]">
        Informe nome, sobrenome, CPF e e-mail. Depois do envio, a sua área mostra o perfil e o comprovante.
      </p>
      <p className="mt-3">
        Já tem cadastro? <Link href="/entrar">Entrar</Link>
      </p>
      <form action={submitEnrollment} className="inscricao-card mt-8 grid max-w-xl gap-4">
        <label className="grid gap-1" htmlFor="givenName">
          Nome
          <input id="givenName" name="givenName" autoComplete="given-name" required />
        </label>
        <label className="grid gap-1" htmlFor="familyName">
          Sobrenome
          <input id="familyName" name="familyName" autoComplete="family-name" required />
        </label>
        <label className="grid gap-1" htmlFor="cpf">
          CPF
          <input id="cpf" name="cpf" inputMode="numeric" autoComplete="off" placeholder="000.000.000-00" required />
        </label>
        <label className="grid gap-1" htmlFor="email">
          E-mail
          <input id="email" name="email" type="email" autoComplete="email" required />
        </label>
        <button type="submit">Enviar inscrição</button>
      </form>
      <div className="mt-6 max-w-xl">
        <p className="text-sm text-[var(--fametro-muted)]">Ou entre com a conta do Google. O CPF continua sendo pedido no formulário acima.</p>
        <div className="mt-3">
          <GoogleButton />
        </div>
      </div>
      {query.erro ? <p className="mt-4 text-red-800">{query.erro}</p> : null}
      {query.aviso ? <p className="mt-4 max-w-xl">{query.aviso}</p> : null}
      {query.erro === messages.duplicate || query.erro === messages.duplicateCpf ? (
        <form action={resendAccess} className="inscricao-card mt-4 grid max-w-xl gap-3">
          <h2>Abrir o comprovante</h2>
          <p>Informe o e-mail da inscrição. Se ele estiver cadastrado, enviamos o acesso sem mostrar os dados aqui.</p>
          <label className="grid gap-1" htmlFor="reenvio">
            E-mail da inscrição
            <input id="reenvio" name="email" type="email" autoComplete="email" required />
          </label>
          <button className="quiet" type="submit">Receber o comprovante por e-mail</button>
        </form>
      ) : null}
    </main>
  );
}
