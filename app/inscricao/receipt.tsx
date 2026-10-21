import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

export function Receipt(props: {
  id: string;
  status: string;
  link: string;
  nome?: string;
  destino?: string;
  quando?: string;
  email?: string;
}) {
  const statusLabel = props.status === "confirmed" || props.status === "confirmado" ? messages.confirmed : messages.pending;
  const when = props.quando ? new Date(props.quando).toLocaleString("pt-BR") : "";
  return (
    <section className="comprovante" aria-live="polite">
      <p className="hero-kicker">Inscrição registrada</p>
      <h2>Comprovante de inscrição</h2>
      <p className="comprovante-lead">
        {messages.formation}
        <br />
        {messages.institution}
      </p>
      <dl>
        {props.nome ? (
          <>
            <dt>Nome</dt>
            <dd>{props.nome}</dd>
          </>
        ) : null}
        {props.destino ? (
          <>
            <dt>E-mail</dt>
            <dd>{props.destino}</dd>
          </>
        ) : null}
        <dt>Identificador</dt>
        <dd>{props.id}</dd>
        <dt>Estado</dt>
        <dd>Estado: {statusLabel}</dd>
        {when ? (
          <>
            <dt>Data</dt>
            <dd>{when}</dd>
          </>
        ) : null}
      </dl>
      <p>Os materiais serão liberados ao final do evento. O certificado, quando emitido, poderá ser baixado e enviado ao e-mail cadastrado.</p>
      {props.email === "enviado" ? <p>O vínculo de acesso foi enviado ao e-mail cadastrado.</p> : null}
      {props.email === "falhou" ? <p>Não foi possível enviar o vínculo pelo Gmail. Use o link abaixo.</p> : null}
      <p>
        <Link href={props.link}>Abrir o vínculo vigente</Link>
      </p>
    </section>
  );
}
