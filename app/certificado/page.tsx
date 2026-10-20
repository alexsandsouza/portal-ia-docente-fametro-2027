import Link from "next/link";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { recordFor } from "@/lib/records/participant-record";

export default async function CertificadoPage() {
  const session = await readSession();
  const record = session?.role === "participant" ? recordFor(session.email) : null;
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Certificado</h1>
      {!record?.certificate ? <p>{messages.notAuthorizedCertificate}</p> : null}
      {record?.certificate ? (
        <p>
          <Link href={`/certificado/${record.certificate.authenticityCode}/pdf`}>Baixar PDF</Link>
        </p>
      ) : null}
    </main>
  );
}
