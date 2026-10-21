import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

export default function FormacoesPage() {
  return (
    <main className="page">
      <p className="hero-kicker">Formações</p>
      <h1 className="mt-5 text-4xl">Edições</h1>
      <p className="mt-3 max-w-2xl leading-7 text-[var(--fametro-muted)]">
        Cada edição reúne a própria inscrição. As atividades de cada edição aparecem na programação, quando forem confirmadas.
      </p>
      <article className="goal-card mt-8 max-w-xl">
        <p className="hero-kicker">Inscrições abertas</p>
        <h2 className="mt-4 text-2xl">{messages.formation}</h2>
        <p className="mt-3 leading-7 text-[var(--fametro-muted)]">Edição inaugural do portal. Período, modalidade e vagas serão informados quando a instituição confirmar.</p>
        <p className="mt-4 flex flex-wrap gap-4">
          <Link href="/inscricao">Inscreva-se</Link>
          <Link href="/programacao">Ver programação</Link>
        </p>
      </article>
    </main>
  );
}
