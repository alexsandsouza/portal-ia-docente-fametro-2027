import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth/session";
import { createEnrollment } from "@/lib/enrollment/create-enrollment";
import { confirmLink } from "@/lib/store/memory";
import { loadRemoteRecord, openParticipantSession } from "@/lib/store/remote-portal";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const origin = `${url.protocol}//${url.host}`;
  if (!code) return fail(origin, "Não foi possível entrar com o Google.");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !key) return fail(origin, "A entrada com Google ainda não está disponível.");

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) cookieStore.set(cookie.name, cookie.value, cookie.options);
      },
    },
  });
  const exchanged = await supabase.auth.exchangeCodeForSession(code);
  const user = exchanged.data.user;
  if (exchanged.error || !user?.email) return fail(origin, "A entrada com Google não foi concluída.");

  const email = user.email;
  const fullName = String(user.user_metadata?.full_name || user.user_metadata?.name || email);
  const created = await createEnrollment({ fullName, email });
  const version = created.ok ? created.participant.accessLinkVersion : (await loadRemoteRecord(email))?.participant.accessLinkVersion ?? 1;
  const local = created.ok ? confirmLink(email, created.participant.accessLinkVersion, created.participant.accessToken) : null;
  const session = local ?? (await openParticipantSession(email, version));
  if (!session) return fail(origin, created.ok ? "A inscrição foi registrada, mas o comprovante não abriu." : created.message);

  const headers = new Headers();
  headers.set("location", "/inscricao/comprovante");
  headers.append("set-cookie", `${COOKIE}=${session.id}; Path=/; HttpOnly; SameSite=Lax`);
  return new NextResponse(null, { status: 303, headers });
}

function fail(origin: string, message: string) {
  return NextResponse.redirect(`${origin}/inscricao?erro=${encodeURIComponent(message)}`);
}
