import Link from "next/link";
import { Receipt } from "@/app/inscricao/receipt";
import { readSession } from "@/lib/auth/session";
import { accessPath } from "@/lib/auth/send-access-link";
import { messages } from "@/lib/messages/pt-br";
import { recordFor } from "@/lib/records/participant-record";
import { loadRemoteRecord } from "@/lib/store/remote-portal";

export default async function ComprovantePage() {
  const session = await readSession();
  const local = session?.role === "participant" ? recordFor(session.email) : null;
  const record = local?.enrollment ? local : session?.role === "participant" ? await loadRemoteRecord(session.email) : null;
  return (
    <main className="page">
      <h1 className="text-4xl">Comprovante</h1>
      {!record?.enrollment ? (
        <>
          <p className="mt-4">Abra o vínculo enviado ao seu e-mail para ver o comprovante.</p>
          <p>
            <Link href="/inscricao">Voltar à inscrição</Link>
          </p>
        </>
      ) : (
        <Receipt
          id={record.enrollment.id}
          status={record.enrollment.status}
          link={record.participant.accessToken ? accessPath(record.participant) : "/ficha"}
          nome={record.participant.fullName}
          destino={record.participant.email}
          quando={record.enrollment.createdAt}
          email="enviado"
        />
      )}
      <p className="mt-6 text-sm text-[var(--fametro-muted)]">{messages.formation}</p>
    </main>
  );
}
