import { enterOperation } from "@/app/operacao/actions";
import { isOperationalEmail } from "@/lib/auth/operational";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";

export default async function OperationLayout({ children }: { children: React.ReactNode }) {
  const session = await readSession();
  const allowed = session?.role === "operational" && isOperationalEmail(session.email);
  if (!allowed) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">{messages.accessDenied}</h1>
        <p>Esta área é só da equipe operacional.</p>
        <form action={enterOperation} className="mt-4 grid gap-2">
          <label htmlFor="email">E-mail operacional</label>
          <input className="rounded border border-slate-400 px-3 py-2" id="email" name="email" type="email" autoComplete="email" />
          <button className="rounded bg-blue-800 px-3 py-2 text-white" type="submit">
            Entrar
          </button>
        </form>
      </main>
    );
  }
  return <>{children}</>;
}
