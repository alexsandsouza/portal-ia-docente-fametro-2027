import { requireOperationalEmail } from "@/lib/auth/require-operational";
import { confirmEnrollment } from "@/lib/enrollment/confirm-enrollment";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireOperationalEmail();
  if (actor instanceof Response) return actor;
  const { id } = await context.params;
  const result = confirmEnrollment(id, actor);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
