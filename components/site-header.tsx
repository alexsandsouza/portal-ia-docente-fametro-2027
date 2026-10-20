import Image from "next/image";
import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

const sections = [
  ["/", "Início"],
  ["/inscricao", "Inscrição"],
  ["/materiais", "Materiais"],
  ["/certificado", "Certificado"],
];

export function SiteHeader() {
  return (
    <header>
      <div className="utility-bar">
        <nav className="mx-auto flex w-[min(72rem,calc(100%-2rem))] flex-wrap gap-x-4 gap-y-2 py-2" aria-label="Atalhos">
          {sections.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="brand-bar">
        <div className="mx-auto flex w-[min(72rem,calc(100%-2rem))] items-center justify-between gap-4 py-4">
          <Link href="/" className="inline-flex items-center no-underline" aria-label="FAMETRO Centro Universitário">
            <Image src="/fametro-logo.png" alt="" width={176} height={58} priority />
          </Link>
          <p className="text-right text-sm font-semibold text-[var(--fametro-navy)]">{messages.formation}</p>
        </div>
      </div>
    </header>
  );
}
