import { requireOperationalEmail } from "@/lib/auth/require-operational";
import { updateChallenge } from "@/lib/challenges/complete-challenge";

export async function POST(request: Request, context: { params: Promise<{ position: string }> }) {
  const actor = await requireOperationalEmail();
  if (actor instanceof Response) return actor;
  const { position } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { title?: string; statement?: string };
  const result = updateChallenge(Number(position), body.title ?? "", body.statement ?? "", actor);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
