import Link from "next/link";
import { redirect } from "next/navigation";
import { requestAccess } from "@/app/entrar/actions";
import { readSession } from "@/lib/auth/session";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  const session = await readSession();
  if (session?.role === "participant") redirect("/conta");
  return (
    <main className="page">
      <h1 className="text-4xl">Entrar</h1>
      <p className="mt-3 max-w-xl leading-7 text-[var(--fametro-muted)]">
        Informe o e-mail da inscrição. Enviamos um link para abrir a sua área, sem senha.
      </p>
      <form action={requestAccess} className="inscricao-card mt-8 grid max-w-xl gap-4">
        <label className="grid gap-1" htmlFor="email">
          E-mail
          <input id="email" name="email" type="email" autoComplete="email" required />
        </label>
        <button type="submit">Enviar link de acesso</button>
      </form>
      {query.erro ? <p className="mt-4 text-red-800">{query.erro}</p> : null}
      {query.aviso ? <p className="mt-4 max-w-xl">{query.aviso}</p> : null}
      <p className="mt-6">
        Ainda não tem cadastro? <Link href="/inscricao">Cadastrar</Link>
      </p>
    </main>
  );
}
