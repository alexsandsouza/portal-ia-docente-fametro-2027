import Image from "next/image";
import Link from "next/link";
import { messages } from "@/lib/messages/pt-br";

const sections = [
  ["/", "Início"],
  ["/inscricao", "Inscrição"],
];

export function SiteHeader() {
  return (
    <header className="brand-bar">
      <div className="mx-auto flex w-[min(72rem,calc(100%-2rem))] flex-wrap items-center justify-between gap-4 py-4">
        <Link href="/" className="inline-flex items-center no-underline" aria-label="FAMETRO Centro Universitário">
          <Image src="/fametro-logo.png" alt="" width={156} height={52} priority />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Atalhos">
          {sections.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
          <Link className="header-enter" href="/conta">
            Minha área
          </Link>
        </nav>
      </div>
      <p className="sr-only">{messages.homeTitle}</p>
    </header>
  );
}
