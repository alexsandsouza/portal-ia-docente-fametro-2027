import { requireOperationalEmail } from "@/lib/auth/require-operational";
import { recordCheckIn } from "@/lib/check-in/record-check-in";

export async function POST(request: Request) {
  const actor = await requireOperationalEmail();
  if (actor instanceof Response) return actor;
  const body = (await request.json().catch(() => ({}))) as { code?: string };
  const result = recordCheckIn(body.code ?? "", actor);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
