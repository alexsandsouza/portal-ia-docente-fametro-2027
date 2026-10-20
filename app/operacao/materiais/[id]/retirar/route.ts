import { requireOperationalEmail } from "@/lib/auth/require-operational";
import { withdrawMaterial } from "@/lib/materials/publish-material";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const actor = await requireOperationalEmail();
  if (actor instanceof Response) return actor;
  const { id } = await context.params;
  const result = withdrawMaterial(id, actor);
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
