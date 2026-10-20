"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { accessPath } from "@/lib/auth/send-access-link";
import { createEnrollment } from "@/lib/enrollment/create-enrollment";
import { sendAccessEmail } from "@/lib/mail/gmail";

export async function submitEnrollment(formData: FormData) {
  const result = await createEnrollment({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
  });
  if (!result.ok) {
    const params = new URLSearchParams({ erro: result.message });
    redirect(`/inscricao?${params.toString()}`);
  }
  const path = accessPath(result.participant);
  const sent = await sendAccessEmail({
    to: result.participant.email,
    fullName: result.participant.fullName,
    url: `${await publicOrigin()}${path}`,
  });
  const params = new URLSearchParams({
    id: result.enrollment.id,
    estado: result.enrollment.status,
    vinculo: path,
    email: sent.ok ? "enviado" : sent.reason === "failed" ? "falhou" : "pendente",
  });
  redirect(`/inscricao?${params.toString()}`);
}

async function publicOrigin() {
  if (process.env.PORTAL_PUBLIC_URL) return process.env.PORTAL_PUBLIC_URL.replace(/\/$/, "");
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}
