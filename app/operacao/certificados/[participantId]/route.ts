import { requireOperationalEmail } from "@/lib/auth/require-operational";
import { authorizeCertificate } from "@/lib/certificates/authorize-certificate";

export async function POST(_request: Request, context: { params: Promise<{ participantId: string }> }) {
  const actor = await requireOperationalEmail();
  if (actor instanceof Response) return actor;
  const { participantId } = await context.params;
  const result = authorizeCertificate(participantId, actor);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
