import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <img src="/professores-hero.jpg" alt="" />
        <div className="home-hero-copy">
          <div>
            <p className="hero-kicker">Desenvolvimento profissional docente</p>
            <h1 className="mt-5">Portal de Formação Continuada Docente</h1>
            <p className="home-hero-place">{messages.institution}</p>
            <p className="home-hero-lead">
              Um ambiente institucional para aprender, compartilhar experiências e fortalecer práticas pedagógicas ao longo da trajetória docente.
            </p>
            <p className="home-hero-actions">
              <Link className="button-link" href="/formacoes">Explorar formações</Link>
              <Link className="button-link ghost" href="/conta">Acessar minha área</Link>
            </p>
          </div>
          <aside className="hero-facts">
            <p className="hero-facts-kicker">{messages.formation}</p>
            <h2>Edição inaugural do portal</h2>
            <p>Consulte a programação e as orientações de inscrição quando divulgadas. A inscrição desta edição já pode ser feita.</p>
            <p className="mt-4">
              <Link href="/inscricao">Inscreva-se na edição 2027</Link>
            </p>
          </aside>
        </div>
      </section>

      <section className="story-band">
        <h2>Conheça as formações</h2>
        <div className="story-card">
          <p>
            Participe das atividades e acompanhe sua jornada de desenvolvimento profissional. O portal reúne informações, inscrição, materiais e certificação em um ambiente único.
          </p>
          <p className="story-place">A programação será publicada neste espaço assim que estiver confirmada.</p>
        </div>
      </section>

      <div className="page">
        <section>
          <h2 className="text-3xl">Por onde começar</h2>
          <div className="goal-grid">
            <article className="goal-card">
              <strong>O Portal</strong>
              <p>A missão da formação continuada e o compromisso com a docência.</p>
              <p className="mt-3"><Link href="/o-portal">Ler</Link></p>
            </article>
            <article className="goal-card">
              <strong>Formações</strong>
              <p>A Formação Docente 2027 é a primeira edição, com inscrições abertas.</p>
              <p className="mt-3"><Link href="/formacoes">Ver edições</Link></p>
            </article>
            <article className="goal-card">
              <strong>Orientações</strong>
              <p>Como participar, quando os materiais aparecem e como o certificado é liberado.</p>
              <p className="mt-3"><Link href="/orientacoes">Consultar</Link></p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
