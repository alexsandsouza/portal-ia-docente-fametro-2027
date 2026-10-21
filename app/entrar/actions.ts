"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { issueAccessLink } from "@/lib/auth/send-access-link";
import { sendAccessEmail } from "@/lib/mail/gmail";
import { messages } from "@/lib/messages/pt-br";
import { renewRemoteAccessLink } from "@/lib/store/remote-portal";
import { normalizeEmail } from "@/lib/validation/email";

export async function requestAccess(formData: FormData) {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  if (!email) redirect("/entrar?erro=" + encodeURIComponent(messages.emailInvalid));
  const remote = await renewRemoteAccessLink(email);
  const local = remote ? null : issueAccessLink(email);
  const person = remote?.participant ?? local?.participant;
  const path = remote?.path ?? local?.path;
  if (person && path) {
    await sendAccessEmail({ to: person.email, fullName: person.fullName, url: `${await publicOrigin()}${path}` });
  }
  redirect("/entrar?aviso=" + encodeURIComponent("Se houver inscrição neste e-mail, enviamos o link para entrar."));
}

async function publicOrigin() {
  if (process.env.PORTAL_PUBLIC_URL) return process.env.PORTAL_PUBLIC_URL.replace(/\/$/, "");
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
