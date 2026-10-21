"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/sair/actions";

const sections = [
  ["/", "Início"],
  ["/o-portal", "O Portal"],
  ["/formacoes", "Formações"],
  ["/programacao", "Programação"],
  ["/orientacoes", "Orientações"],
  ["/contato", "Fale conosco"],
];

export function SiteMenu({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="site-menu">
      <button
        ref={buttonRef}
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="menu-principal"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{open ? "Fechar menu" : "Abrir menu"}</span>
        <span className="menu-icon" aria-hidden="true" />
      </button>
      <nav id="menu-principal" className={open ? "site-nav open" : "site-nav"} aria-label="Atalhos">
        {sections.map(([href, label]) => (
          <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>
            {label}
          </Link>
        ))}
        <div className="site-nav-actions">
          {signedIn ? (
            <>
              <Link className="header-enter" href="/conta">Minha área</Link>
              <form action={signOut}>
                <button className="header-exit" type="submit">Sair</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/entrar">Entrar</Link>
              <Link className="header-enter" href="/inscricao">Cadastrar</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
