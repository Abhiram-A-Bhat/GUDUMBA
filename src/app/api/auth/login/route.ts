import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { createSession, sessionCookieOptions, sessionConfigurationIsValid } from "@/lib/session";
import { allowAuthAttempt } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    if (!sessionConfigurationIsValid()) {
      return NextResponse.json({ error: "Server session configuration is missing." }, { status: 503 });
    }
    if (!allowAuthAttempt(req, "login", 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, { status: 429 });
    }
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const normalizedEmail = String(email).trim().toLowerCase();

    // 1. Direct Admin Credential Check
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPass && normalizedEmail === adminEmail && password === adminPass) {
      const token = createSession({ id: "admin-master", email: adminEmail, name: "Gudumba Executive", role: "admin" });
      const response = NextResponse.json({
        user: {
          id: "admin-master",
          email: adminEmail,
          name: "Gudumba Executive",
          role: "admin",
        },
      });
      response.cookies.set("gudumba_token", token, sessionCookieOptions());
      return response;
    }

    // 2. Supabase Auth Check
    const supabase = getSupabase();
    if (supabase) {
      const { data: supaAuth, error: supaErr } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (!supaErr && supaAuth.user) {
        const u = supaAuth.user;
        const token = createSession({
          id: u.id,
          email: u.email || normalizedEmail,
          name: u.user_metadata?.full_name || "Gudumba Collector",
          role: "customer",
        });

        const response = NextResponse.json({
          user: {
            id: u.id,
            email: u.email,
            name: u.user_metadata?.full_name || "Gudumba Collector",
            role: "customer",
          },
        });
        response.cookies.set("gudumba_token", token, sessionCookieOptions());
        return response;
      }
    }

    // 3. Local SQLite check fallback
    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(normalizedEmail) as Record<string, unknown> | undefined;
      if (user) {
        let passwordMatch = false;
        try {
          const bcrypt = await import("bcryptjs");
          passwordMatch = typeof user.password_hash === "string" && await bcrypt.compare(password, user.password_hash);
        } catch { passwordMatch = false; }

        if (passwordMatch) {
          const token = createSession({
            id: user.id as string,
            email: user.email as string,
            name: user.name as string,
            role: user.role === "admin" ? "admin" : "customer",
          });
          const response = NextResponse.json({
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              avatarUrl: user.avatar_url,
            },
          });
          response.cookies.set("gudumba_token", token, sessionCookieOptions());
          return response;
        }
      }
    } catch {}

    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
