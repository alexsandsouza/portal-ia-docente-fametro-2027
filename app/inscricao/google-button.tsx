"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function GoogleButton() {
  async function start() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      window.location.href = "/inscricao?erro=" + encodeURIComponent("A entrada com Google ainda não está disponível.");
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      window.location.href = "/inscricao?erro=" + encodeURIComponent("A entrada com Google ainda não está disponível. Use nome e e-mail.");
    }
  }

  return (
    <button className="quiet google-button" type="button" onClick={start}>
      Continuar com Google
    </button>
  );
}
