import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { messages } from "@/lib/messages/pt-br";
import "./globals.css";

export const metadata: Metadata = { title: messages.homeTitle };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          {messages.skip}
        </a>
        <SiteHeader />
        <div id="conteudo">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
