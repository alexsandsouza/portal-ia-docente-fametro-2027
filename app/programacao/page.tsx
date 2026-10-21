export default function ProgramacaoPage() {
  return (
    <main className="page">
      <p className="hero-kicker">Programação</p>
      <h1 className="mt-5 text-4xl">Atividades confirmadas</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8">A programação será publicada neste espaço assim que estiver confirmada.</p>
      <p className="mt-4 max-w-2xl leading-7 text-[var(--fametro-muted)]">
        Quando houver atividades, esta página mostrará data, horário no fuso de Manaus, local ou link, modalidade, responsável e estado. Nada disso será exibido antes da confirmação.
      </p>
    </main>
  );
}
