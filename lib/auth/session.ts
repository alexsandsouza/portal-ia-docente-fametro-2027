import { cookies } from "next/headers";
import { getSessionById, type Session } from "@/lib/store/memory";
import { readRemoteSession } from "@/lib/store/remote-portal";

const COOKIE = "portal_sid";

export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (!id) return null;
  return getSessionById(id) ?? (await readRemoteSession(id));
}

export async function writeSession(sessionId: string) {
  const jar = await cookies();
  jar.set(COOKIE, sessionId, { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export { COOKIE };
