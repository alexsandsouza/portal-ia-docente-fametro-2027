import { readSession } from "@/lib/auth/session";
import { completeChallenge } from "@/lib/challenges/complete-challenge";
import { messages } from "@/lib/messages/pt-br";

export async function POST(_request: Request, context: { params: Promise<{ position: string }> }) {
  const session = await readSession();
  if (!session || session.role !== "participant") {
    return new Response(messages.accessDenied, { status: 403 });
  }
  const { position } = await context.params;
  const result = completeChallenge(session.email, Number(position));
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
