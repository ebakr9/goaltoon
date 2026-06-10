import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;
let _anon: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("Supabase env vars not set (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
    _admin = createClient(url, key);
  }
  return _admin;
}

export function getSupabase(): SupabaseClient {
  if (!_anon) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars not set (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)");
    _anon = createClient(url, key);
  }
  return _anon;
}

// Legacy exports — kept for any existing imports
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get: (_, prop) => getSupabaseAdmin()[prop as keyof SupabaseClient],
});

export const supabase = new Proxy({} as SupabaseClient, {
  get: (_, prop) => getSupabase()[prop as keyof SupabaseClient],
});
