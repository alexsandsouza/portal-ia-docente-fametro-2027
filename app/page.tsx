import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

const objectives = [
  ["Registrar", "Guardar o nome, o CPF e o e-mail de cada professor inscrito."],
  ["Formar", "Liberar os materiais ao final do evento, quando a equipe publicar."],
  ["Certificar", "Entregar o certificado para baixar e enviar ao e-mail cadastrado."],
];

export default function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <img src="/professores-hero.jpg" alt="" />
        <div className="home-hero-copy">
          <p className="hero-kicker">Formação docente · 2027</p>
          <h1 className="mt-5">{messages.homeTitle}</h1>
          <p className="home-hero-lead">
            Um espaço simples para o professor se inscrever, acompanhar a própria participação e receber o certificado do {messages.institution}.
          </p>
          <p className="home-hero-actions">
            <Link className="button-link" href="/inscricao">Fazer inscrição</Link>
            <Link href="/conta">Já me inscrevi</Link>
          </p>
        </div>
      </section>

      <div className="page">
        <section className="max-w-2xl">
          <h2 className="text-2xl">Objetivo</h2>
          <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
            Organizar a Formação Docente 2027 do início ao certificado: a inscrição fica registrada, os materiais aparecem ao final do evento e o comprovante permanece com o professor.
          </p>
          <ol className="objective-list">
            {objectives.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 max-w-2xl">
          <h2 className="text-2xl">Por que importa</h2>
          <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
            Para o professor, a inscrição deixa de ser um recado solto e passa a ser um comprovante, com caminho claro até o certificado. Para a FAMETRO, a formação fica reunida num único registro, com nome, contato e emissão do documento no mesmo lugar.
          </p>
        </section>
      </div>
    </main>
  );
}
