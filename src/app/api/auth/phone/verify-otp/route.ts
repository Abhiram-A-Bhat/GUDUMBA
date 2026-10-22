import { NextRequest, NextResponse } from "next/server";
import { allowAuthAttempt } from "@/lib/rate-limit";
import { createSession, sessionCookieOptions, sessionConfigurationIsValid } from "@/lib/session";
import { getSupabase } from "@/lib/supabase";

function normalizeIndianPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = value.replace(/\D/g, "");
  const national = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(national) ? `+91${national}` : null;
}

export async function POST(request: NextRequest) {
  if (!sessionConfigurationIsValid()) {
    return NextResponse.json({ error: "Server session configuration is missing." }, { status: 503 });
  }
  if (!allowAuthAttempt(request, "login", 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many verification attempts. Try again in 15 minutes." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const phone = normalizeIndianPhone(body?.phone);
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    if (!phone || !/^\d{6}$/.test(token)) {
      return NextResponse.json({ error: "Enter a valid phone number and 6-digit code." }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Phone sign-in is unavailable because Supabase is not configured." }, { status: 503 });
    }

    const { data, error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || "The verification code could not be confirmed." }, { status: 401 });
    }

    const name = data.user.user_metadata?.full_name || "Gudumba Collector";
    const session = createSession({
      id: data.user.id,
      email: data.user.email || "",
      phone,
      name,
      role: "customer",
    });
    const response = NextResponse.json({
      user: { id: data.user.id, email: data.user.email || undefined, phone, name, role: "customer" },
    });
    response.cookies.set("gudumba_token", session, sessionCookieOptions());
    return response;
  } catch (error) {
    console.error("Phone OTP verification failed:", error);
    return NextResponse.json({ error: "Could not reach the phone sign-in service. Please try again." }, { status: 502 });
  }
}
