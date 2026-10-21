import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

/**
 * Sign in with Google OAuth popup / redirect
 */
export async function signInWithGoogle() {
  const client = getSupabase();
  if (!client) {
    return {
      data: null,
      error: { message: "Supabase credentials are not configured in .env yet." },
    };
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined,
    },
  });
  return { data, error };
}

/**
 * Send Phone OTP (+91 for India)
 */
export async function sendPhoneOtp(phone: string) {
  const client = getSupabase();
  if (!client) {
    return {
      data: null,
      error: { message: "Supabase credentials are not configured in .env yet." },
    };
  }

  const formatted = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
  const { data, error } = await client.auth.signInWithOtp({
    phone: formatted,
  });
  return { data, error };
}

/**
 * Verify Phone OTP code
 */
export async function verifyPhoneOtp(phone: string, token: string) {
  const client = getSupabase();
  if (!client) {
    return {
      data: null,
      error: { message: "Supabase credentials are not configured in .env yet." },
    };
  }

  const formatted = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;
  const { data, error } = await client.auth.verifyOtp({
    phone: formatted,
    token,
    type: "sms",
  });
  return { data, error };
}
