import { lookupCertificate } from "@/lib/certificates/authorize-certificate";

export default async function PublicCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = lookupCertificate(code);
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Autenticidade</h1>
      {result.ok ? (
        <>
          <p>Certificado autêntico.</p>
          <p>{result.formation}</p>
          <p>{result.institution}</p>
          <p>Data de emissão: {new Date(result.issuedAt).toLocaleDateString("pt-BR")}</p>
        </>
      ) : (
        <p>{result.message}</p>
      )}
    </main>
  );
}
