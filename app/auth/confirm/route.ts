import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth/session";
import { confirmLink } from "@/lib/store/memory";
import { messages } from "@/lib/messages/pt-br";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const session = confirmLink(
    url.searchParams.get("email") ?? "",
    Number(url.searchParams.get("version") ?? "0"),
    url.searchParams.get("token") ?? "",
  );
  if (!session) {
    return new NextResponse(messages.linkReplaced, { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  const headers = new Headers();
  headers.set("location", "/ficha");
  headers.append("set-cookie", `${COOKIE}=${session.id}; Path=/; HttpOnly; SameSite=Lax`);
  return new NextResponse(null, { status: 303, headers });
}
