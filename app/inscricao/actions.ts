"use server";

import { redirect } from "next/navigation";
import { accessPath } from "@/lib/auth/send-access-link";
import { createEnrollment } from "@/lib/enrollment/create-enrollment";

export async function submitEnrollment(formData: FormData) {
  const result = createEnrollment({
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
  });
  if (!result.ok) {
    const params = new URLSearchParams({ erro: result.message });
    redirect(`/inscricao?${params.toString()}`);
  }
  const params = new URLSearchParams({
    id: result.enrollment.id,
    estado: result.enrollment.status,
    vinculo: accessPath(result.participant),
  });
  redirect(`/inscricao?${params.toString()}`);
}
