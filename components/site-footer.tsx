import { messages } from "@/lib/messages/pt-br";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="mx-auto flex w-[min(72rem,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 py-5">
        <p className="font-semibold text-[var(--fametro-navy)]">{messages.institution}</p>
        <p>Conhecimento que transforma</p>
      </div>
    </footer>
  );
}
