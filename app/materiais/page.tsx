import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";
import { publishedMaterials, participantByEmail } from "@/lib/store/memory";

export default async function MateriaisPage() {
  const session = await readSession();
  const participant = session?.role === "participant" ? participantByEmail(session.email) : null;
  if (!participant) {
    return (
      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Materiais</h1>
        <p>Abra o vínculo vigente da inscrição para ver os materiais.</p>
      </main>
    );
  }
  const items = publishedMaterials();
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Materiais</h1>
      {items.length === 0 ? <p>{messages.emptyMaterials}</p> : null}
      <ul className="mt-4 grid gap-4">
        {items.map((item) => (
          <li key={item.id} className="rounded border border-slate-300 bg-white p-4">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p>{item.description}</p>
            <a href={item.destinationUrl}>Abrir no Google Drive</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
