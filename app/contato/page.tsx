import { sendContact } from "@/app/contato/actions";
import { contactSubjects } from "@/lib/contact/subjects";
import { messages } from "@/lib/messages/pt-br";

const topics = [
  ["Informações sobre a formação", "Datas, local, programação e participação."],
  ["Inscrição e comprovante", "Cadastro, acesso à área e comprovante."],
  ["Certificado e materiais", "Liberação dos materiais e emissão do certificado."],
  ["Outros assuntos", "Qualquer outra dúvida sobre o portal."],
];

export default async function ContatoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const query = await searchParams;
  return (
    <main className="page">
      <h1 className="text-4xl">Fale conosco</h1>
      <p className="mt-3 max-w-2xl leading-7 text-[var(--fametro-muted)]">
        A equipe do {messages.institution} responde pelo e-mail informado no formulário.
      </p>
      <div className="contact-layout">
        <section>
          <h2 className="text-xl">Como podemos ajudar?</h2>
          <ul className="contact-topics">
            {topics.map(([title, text]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </section>
        {query.enviado ? (
          <p className="inscricao-card" role="status">Mensagem enviada. A resposta chega no e-mail que você informou.</p>
        ) : (
          <form action={sendContact} className="inscricao-card grid gap-4">
            <label className="grid gap-1" htmlFor="name">
              Nome
              <input id="name" name="name" autoComplete="name" required />
            </label>
            <label className="grid gap-1" htmlFor="email">
              E-mail
              <input id="email" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="grid gap-1" htmlFor="subject">
              Assunto
              <select id="subject" name="subject" required defaultValue="">
                <option value="" disabled>Selecione um assunto</option>
                {contactSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1" htmlFor="message">
              Mensagem
              <textarea id="message" name="message" rows={6} maxLength={4000} required placeholder="Escreva sua mensagem..." />
            </label>
            <button type="submit">Enviar mensagem</button>
            {query.erro ? <p className="text-red-800">{query.erro}</p> : null}
          </form>
        )}
      </div>
    </main>
  );
}
