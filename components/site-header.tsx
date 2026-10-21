import Image from "next/image";
import Link from "next/link";
import { SiteMenu } from "@/components/site-menu";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";

export async function SiteHeader() {
  const session = await readSession();
  return (
    <header className="brand-bar">
      <div className="brand-inner">
        <Link href="/" className="inline-flex items-center no-underline" aria-label="FAMETRO Centro Universitário">
          <Image src="/fametro-logo.png" alt="" width={156} height={52} priority />
        </Link>
        <SiteMenu signedIn={Boolean(session)} />
      </div>
      <p className="sr-only">{messages.homeTitle}</p>
    </header>
  );
}
