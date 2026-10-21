"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { writeSession } from "@/lib/auth/session";
import { issueAccessLink, accessPath } from "@/lib/auth/send-access-link";
import { createEnrollment } from "@/lib/enrollment/create-enrollment";
import { sendAccessEmail } from "@/lib/mail/gmail";
import { confirmLink } from "@/lib/store/memory";
import { openParticipantSession, renewRemoteAccessLink } from "@/lib/store/remote-portal";
import { normalizeEmail } from "@/lib/validation/email";

export async function submitEnrollment(formData: FormData) {
  const result = await createEnrollment({
    givenName: String(formData.get("givenName") ?? ""),
    familyName: String(formData.get("familyName") ?? ""),
    cpf: String(formData.get("cpf") ?? ""),
    email: String(formData.get("email") ?? ""),
  });
  if (!result.ok) {
    const params = new URLSearchParams({ erro: result.message });
    redirect(`/inscricao?${params.toString()}`);
  }
  const path = accessPath(result.participant);
  await sendAccessEmail({
    to: result.participant.email,
    fullName: result.participant.fullName,
    url: `${await publicOrigin()}${path}`,
  });
  const local = confirmLink(result.participant.email, result.participant.accessLinkVersion, result.participant.accessToken);
  const remote = await openParticipantSession(result.participant.email, result.participant.accessLinkVersion);
  const session = remote ?? local;
  if (session) await writeSession(session.id);
  redirect("/conta");
}

export async function resendAccess(formData: FormData) {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const remote = email ? await renewRemoteAccessLink(email) : null;
  const local = !remote && email ? issueAccessLink(email) : null;
  const person = remote?.participant ?? local?.participant;
  const path = remote?.path ?? local?.path;
  if (person && path) {
    await sendAccessEmail({ to: person.email, fullName: person.fullName, url: `${await publicOrigin()}${path}` });
  }
  redirect("/inscricao?aviso=" + encodeURIComponent("Se houver inscrição neste e-mail, enviamos o acesso para abrir o comprovante."));
}

async function publicOrigin() {
  if (process.env.PORTAL_PUBLIC_URL) return process.env.PORTAL_PUBLIC_URL.replace(/\/$/, "");
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
