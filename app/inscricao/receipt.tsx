import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

export function Receipt(props: { id: string; status: string; link: string }) {
  const statusLabel = props.status === "pending" ? messages.pending : props.status;
  return (
    <section className="mt-6 rounded border border-slate-300 bg-white p-4" aria-live="polite">
      <h2 className="text-xl font-semibold">Comprovante</h2>
      <p>Identificador: {props.id}</p>
      <p>Estado: {statusLabel}</p>
      <p className="mt-3">Em modo local, o vínculo de acesso aparece aqui porque não há envio de e-mail configurado.</p>
      <p>
        <Link href={props.link}>Abrir o vínculo vigente</Link>
      </p>
    </section>
  );
}
