import { isOperationalEmail } from "@/lib/auth/operational";
import { readSession } from "@/lib/auth/session";
import { messages } from "@/lib/messages/pt-br";

export async function requireOperationalEmail(): Promise<string | Response> {
  const session = await readSession();
  if (!session || session.role !== "operational" || !isOperationalEmail(session.email)) {
    return new Response(messages.accessDenied, { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  return session.email;
}
