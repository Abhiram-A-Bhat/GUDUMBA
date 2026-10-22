import { NextRequest, NextResponse } from "next/server";
import { allowAuthAttempt } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

function normalizeIndianPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  const national = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : null;
}

export async function POST(request: NextRequest) {
  if (!allowAuthAttempt(request, "login", 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many OTP requests. Try again in 15 minutes." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const phone = normalizeIndianPhone(body?.phone);
    if (!phone) return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Phone sign-in is unavailable because Supabase is not configured." }, { status: 503 });
    }

    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) {
      console.error("Supabase phone OTP request failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Phone OTP request failed:", error);
    return NextResponse.json({ error: "Could not reach the phone sign-in service. Please try again." }, { status: 502 });
  }
}
