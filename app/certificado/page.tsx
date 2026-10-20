import Link from "next/link";
import { readSession } from "@/lib/auth/session";
import { recordFor } from "@/lib/records/participant-record";
import { loadRemoteRecord } from "@/lib/store/remote-portal";

export default async function CertificadoPage() {
  const session = await readSession();
  const local = session?.role === "participant" ? recordFor(session.email) : null;
  const record = local?.participant ? local : session?.role === "participant" ? await loadRemoteRecord(session.email) : null;
  const certificate = record?.certificate;
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Certificado</h1>
      {!certificate ? (
        <p>O certificado será gerado ao final do evento. Quando isso acontecer, ele poderá ser baixado aqui e enviado ao e-mail cadastrado na inscrição.</p>
      ) : null}
      {certificate ? (
        <>
          <p>
            <Link href={`/certificado/${certificate.authenticityCode}/pdf`}>Baixar PDF</Link>
          </p>
          {certificate.emailStatus === "sent" ? <p>O PDF foi enviado para {record?.participant.email}.</p> : null}
          {certificate.emailStatus === "not_configured" || certificate.emailStatus === "pending" ? (
            <p>O download está disponível. O envio para o e-mail cadastrado ainda não está configurado.</p>
          ) : null}
          {certificate.emailStatus === "failed" ? (
            <p>O download está disponível. Não foi possível enviar o PDF para o e-mail cadastrado.</p>
          ) : null}
        </>
      ) : null}
    </main>
  );
}
