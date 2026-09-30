import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Persistence Foundation
 *
 * Planned for storing:
 * - Verification cases & investigation reports
 * - Decomposed atomic claims & statuses
 * - Harvested evidence sources & search grounding citations
 * - Media metadata & upload assets (Supabase Storage)
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[ContextLock Warning] Supabase credentials (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing in environment."
    );
  }
}

// Client instance initialized safely with fallback mock-friendly dummy values if env not yet populated
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (null as unknown as ReturnType<typeof createClient>);

export function getSupabaseClient() {
  if (!supabase) {
    throw new Error(
      "Supabase client is not configured. Please supply NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return supabase;
}
