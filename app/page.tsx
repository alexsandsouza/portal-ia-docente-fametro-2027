import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

const facts = [
  ["Inscrição", "Nome, sobrenome, CPF e e-mail ficam registrados na hora."],
  ["Comprovante", "O professor abre o perfil e vê a própria inscrição."],
  ["Certificado", "Quando emitido, pode ser baixado e chega no e-mail cadastrado."],
];

const steps = [
  ["01", "Inscreva-se", "Informe nome, sobrenome, CPF e e-mail. A inscrição já nasce confirmada."],
  ["02", "Guarde o comprovante", "A Minha área mostra o perfil e o comprovante, sem precisar procurar o e-mail."],
  ["03", "Acesse os materiais", "Eles aparecem ao final do evento, quando a equipe publicar."],
  ["04", "Receba o certificado", "O documento fica disponível para baixar e é enviado ao e-mail da inscrição."],
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <img src="/professores-hero.jpg" alt="" />
        <div className="home-hero-copy">
          <div>
            <p className="hero-kicker">Formação docente · 2027</p>
            <h1 className="mt-5">
              Sistema de
              <br />
              Formação Docente
              <br />
              <span>FAMETRO 2027</span>
            </h1>
            <p className="home-hero-place">{messages.institution}</p>
            <p className="home-hero-lead">
              Um registro único para o professor se inscrever, acompanhar a participação e receber o certificado.
            </p>
            <p className="home-hero-actions">
              <Link className="button-link" href="/inscricao">Inscreva-se agora</Link>
              <Link className="button-link ghost" href="#percurso">Ver o percurso</Link>
            </p>
          </div>
          <aside className="hero-facts">
            <p className="hero-facts-kicker">O que fica com o professor</p>
            <h2>Da inscrição ao certificado</h2>
            <ul>
              {facts.map(([title, text]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <Link href="/conta">Já me inscrevi</Link>
          </aside>
        </div>
      </section>

      <section className="story-band">
        <h2>Uma formação feita para o professor</h2>
        <div className="story-card">
          <p>
            A Formação Docente 2027 deixa de ser um recado solto. A inscrição vira comprovante, com caminho claro até os materiais e o certificado.
          </p>
          <p>
            Para o professor, o perfil guarda nome, contato e o estado da participação. Para a FAMETRO, a formação fica reunida num único registro, do cadastro à emissão do documento.
          </p>
          <p className="story-place">{messages.institution}</p>
        </div>
      </section>

      <div className="page">
        <section id="percurso">
          <h2 className="text-3xl">O percurso</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--fametro-muted)]">
            Quatro passos, do cadastro ao certificado. Os materiais entram somente quando a equipe publicar, ao final do evento.
          </p>
          <ol className="path-list">
            {steps.map(([index, title, text]) => (
              <li key={index}>
                <span>{index}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl">O que o sistema faz</h2>
          <div className="goal-grid">
            {facts.map(([title, text]) => (
              <article key={title} className="goal-card">
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="closing">
        <h2>Garanta sua inscrição</h2>
        <p>Nome, sobrenome, CPF e e-mail. Em seguida, o comprovante fica na sua área.</p>
        <Link className="button-link" href="/inscricao">Inscreva-se</Link>
      </section>
    </main>
  );
}
