"use server";

import { revalidatePath } from "next/cache";
import { readSession } from "@/lib/auth/session";
import { recordDataRequest } from "@/lib/privacy/data-subject-request";

export async function requestAccess() {
  const session = await readSession();
  if (!session || session.role !== "participant") return;
  recordDataRequest(session.email, "access");
  revalidatePath("/meus-dados");
}

export async function requestCorrection(formData: FormData) {
  const session = await readSession();
  if (!session || session.role !== "participant") return;
  recordDataRequest(session.email, "correction", String(formData.get("fullName") ?? ""));
  revalidatePath("/meus-dados");
  revalidatePath("/ficha");
}

export async function requestDeletion() {
  const session = await readSession();
  if (!session || session.role !== "participant") return;
  recordDataRequest(session.email, "deletion");
  revalidatePath("/meus-dados");
}
