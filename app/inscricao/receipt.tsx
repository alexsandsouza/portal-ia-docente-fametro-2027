import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

export function Receipt(props: { id: string; status: string; link: string; email?: string }) {
  const statusLabel = props.status === "confirmed" || props.status === "confirmado" ? messages.confirmed : messages.pending;
  const sent = props.email === "enviado";
  return (
    <section className="mt-6 rounded border border-slate-300 bg-white p-4" aria-live="polite">
      <h2 className="text-xl font-semibold">Comprovante</h2>
      <p>Identificador: {props.id}</p>
      <p>Estado: {statusLabel}</p>
      <p className="mt-3">A inscrição foi registrada. Os materiais serão liberados ao final do evento. O certificado, quando emitido, poderá ser baixado e enviado ao e-mail cadastrado.</p>
      {sent ? <p>O vínculo de acesso foi enviado ao e-mail cadastrado.</p> : null}
      {props.email === "falhou" ? <p>Não foi possível enviar o vínculo pelo Gmail. O link continua disponível abaixo.</p> : null}
      {!sent ? (
        <>
          {props.email === "pendente" || !props.email ? (
            <p>O vínculo aparece aqui porque a conta Gmail que envia as mensagens ainda não está configurada.</p>
          ) : null}
          <p>
            <Link href={props.link}>Abrir o vínculo vigente</Link>
          </p>
        </>
      ) : null}
    </section>
  );
}
