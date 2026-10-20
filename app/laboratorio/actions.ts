"use server";

import { revalidatePath } from "next/cache";
import { readSession } from "@/lib/auth/session";
import { completeChallenge } from "@/lib/challenges/complete-challenge";

export async function markComplete(formData: FormData) {
  const session = await readSession();
  if (!session || session.role !== "participant") return;
  completeChallenge(session.email, Number(formData.get("position")));
  revalidatePath("/laboratorio");
}
