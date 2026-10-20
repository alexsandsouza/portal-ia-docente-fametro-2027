import { requireOperationalEmail } from "@/lib/auth/require-operational";
import { publishMaterial } from "@/lib/materials/publish-material";

export async function POST(request: Request) {
  const actor = await requireOperationalEmail();
  if (actor instanceof Response) return actor;
  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    description?: string;
    destinationUrl?: string;
    published?: boolean;
  };
  const result = publishMaterial({
    title: body.title ?? "",
    description: body.description ?? "",
    destinationUrl: body.destinationUrl ?? "",
    published: Boolean(body.published),
    actorEmail: actor,
  });
  return Response.json(result, { status: result.ok ? 200 : 400 });
}
