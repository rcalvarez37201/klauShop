import { env } from "@/env.mjs";

import { CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient({
  cookieStore,
  isAdmin = false,
}: {
  cookieStore: ReturnType<typeof cookies>;
  isAdmin?: boolean;
}) {
  // If the "admin" client accidentally uses the anon key (or a missing env var),
  // Supabase will enforce RLS and you'll see errors like:
  // "new row violates row-level security policy" during Storage uploads/inserts.
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey =
    (process.env.DATABASE_SERVICE_ROLE ||
      // optional alternate name some setups use
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      (env as any).DATABASE_SERVICE_ROLE) ??
    "";

  if (isAdmin) {
    if (!serviceRoleKey) {
      throw new Error(
        "Missing DATABASE_SERVICE_ROLE env var. Set it to your Supabase project's service_role key (server-only) and restart the dev server.",
      );
    }
    if (serviceRoleKey === anonKey) {
      throw new Error(
        "DATABASE_SERVICE_ROLE is incorrectly set to the anon key. Replace it with the Supabase service_role key (server-only).",
      );
    }
  }

  // IMPORTANT:
  // When using service role, we MUST NOT attach the end-user session (cookies),
  // otherwise the client will send `Authorization: Bearer <user_access_token>`
  // and RLS will still apply (common cause of Storage upload failures).
  const cookieHandlers = isAdmin
    ? {
        get(_name: string) {
          return undefined;
        },
        set(_name: string, _value: string, _options: CookieOptions) {
          // no-op
        },
        remove(_name: string, _options: CookieOptions) {
          // no-op
        },
      }
    : {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      };

  return createServerClient(
    `https://${env.NEXT_PUBLIC_SUPABASE_PROJECT_REF}.supabase.co`,
    isAdmin ? serviceRoleKey : anonKey,
    {
      cookies: {
        get: cookieHandlers.get,
        set: cookieHandlers.set,
        remove: cookieHandlers.remove,
      },
    },
  );
}

export default createClient;
