import { messages } from "@/lib/messages/pt-br";

const axes = [
  "Inovação pedagógica e metodologias de aprendizagem.",
  "Tecnologias digitais e inteligência artificial na educação.",
  "Planejamento, avaliação e acompanhamento da aprendizagem.",
  "Inclusão, acessibilidade e diversidade educacional.",
  "Pesquisa, extensão e desenvolvimento da prática docente.",
];

export default function PortalPage() {
  return (
    <main className="page">
      <p className="hero-kicker">O Portal</p>
      <h1 className="mt-5 max-w-3xl text-4xl">Formação contínua para uma educação em transformação</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--fametro-muted)]">
        O {messages.institution} reúne neste portal suas ações de formação continuada docente. A iniciativa busca apoiar a atualização profissional, o diálogo entre pares e a adoção responsável de práticas pedagógicas e tecnologias educacionais, contribuindo para a qualidade das experiências de ensino e aprendizagem.
      </p>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl">Missão do portal</h2>
        <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
          Facilitar o acesso a oportunidades de desenvolvimento docente, organizando informações, participação, materiais e certificação em um ambiente único.
        </p>
      </section>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl">Compromisso</h2>
        <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
          Valorizar a docência, a inovação pedagógica, a inclusão, a ética e a melhoria contínua.
        </p>
      </section>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl">Eixos em proposta</h2>
        <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
          Estes eixos ainda dependem de aprovação institucional. Eles não são a programação da edição.
        </p>
        <ul className="objective-list">
          {axes.map((axis) => (
            <li key={axis}>{axis}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
