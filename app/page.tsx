import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

const links = [
  ["/inscricao", "Inscrição", "Nome e e-mail. Os dados ficam registrados."],
  ["/ficha", "Minha ficha", "Estado da inscrição e eventos já ocorridos."],
  ["/materiais", "Materiais", "Liberados ao final do evento, com destino no Google Drive."],
  ["/check-in/codigo", "Check-in", "Código em texto e em QR Code."],
  ["/certificado", "Certificado", "PDF para baixar e enviar ao e-mail cadastrado."],
  ["/meus-dados", "Meus dados", "Acesso, correção do nome ou pedido de exclusão."],
  ["/operacao", "Painel operacional", "Área restrita à equipe."],
];

export default function HomePage() {
  return (
    <main className="page">
      <p className="hero-kicker">Formação docente · 2027</p>
      <h1 className="mt-5 max-w-3xl text-4xl sm:text-5xl">{messages.homeTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--fametro-muted)]">
        Inscrição da formação, materiais ao final do evento e certificado do {messages.institution}.
      </p>
      <p className="mt-4 max-w-2xl text-sm text-[var(--fametro-muted)]">
        {process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.PORTAL_DATA !== "local"
          ? messages.databaseMode
          : messages.localMode}
      </p>
      <nav className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Seções do portal">
        {links.map(([href, label, detail]) => (
          <Link key={href} className="portal-card" href={href}>
            <span className="block text-lg font-extrabold">{label}</span>
            <span className="mt-1 block text-sm font-medium text-[var(--fametro-muted)]">{detail}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
