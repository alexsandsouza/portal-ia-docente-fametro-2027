import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth/session";
import { confirmLink } from "@/lib/store/memory";
import { confirmRemoteLink } from "@/lib/store/remote-portal";
import { messages } from "@/lib/messages/pt-br";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") ?? "";
  const version = Number(url.searchParams.get("version") ?? "0");
  const token = url.searchParams.get("token") ?? "";
  const session = confirmLink(email, version, token) ?? (await confirmRemoteLink(email, version, token));
  if (!session) {
    return new NextResponse(messages.linkReplaced, { status: 403, headers: { "content-type": "text/plain; charset=utf-8" } });
  }
  const headers = new Headers();
  headers.set("location", "/ficha");
  headers.append("set-cookie", `${COOKIE}=${session.id}; Path=/; HttpOnly; SameSite=Lax`);
  return new NextResponse(null, { status: 303, headers });
}
