import Link from "next/link";

const steps = [
  "Entre no portal com o acesso enviado ao seu e-mail.",
  "Consulte a formação e as regras de participação.",
  "Faça sua inscrição, quando disponível.",
  "Acompanhe sua situação e os comunicados oficiais.",
  "Consulte materiais e certificados após liberação.",
];

export default function OrientacoesPage() {
  return (
    <main className="page">
      <p className="hero-kicker">Orientações</p>
      <h1 className="mt-5 text-4xl">Como participar</h1>
      <ol className="path-list max-w-3xl">
        {steps.map((step, index) => (
          <li key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
      <section className="mt-12 max-w-3xl">
        <h2 className="text-2xl">Certificados</h2>
        <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
          A emissão depende do atendimento aos critérios definidos pela organização para cada ação formativa. A disponibilidade será informada na área do participante. O certificado estará disponível após a conclusão das verificações previstas para esta atividade.
        </p>
      </section>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl">Materiais</h2>
        <p className="mt-3 leading-7 text-[var(--fametro-muted)]">
          Recursos publicados pela equipe responsável, observadas as permissões de acesso e os direitos de uso. Os materiais da Formação Docente 2027 serão liberados ao final do evento.
        </p>
      </section>
      <p className="mt-8 flex flex-wrap gap-4">
        <Link className="button-link" href="/inscricao">Inscreva-se</Link>
        <Link href="/conta">Minha área</Link>
      </p>
    </main>
  );
}
