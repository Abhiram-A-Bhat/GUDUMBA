import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { createSession, sessionCookieOptions } from "@/lib/session";
import { allowAuthAttempt } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    if (!allowAuthAttempt(req, "login", 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many sign-in attempts. Try again in 15 minutes." }, { status: 429 });
    }
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(String(email).trim().toLowerCase()) as Record<string, unknown> | undefined;
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    let passwordMatch = false;
    try {
      const bcrypt = await import("bcryptjs");
      passwordMatch = typeof user.password_hash === "string" && await bcrypt.compare(password, user.password_hash);
    } catch { passwordMatch = false; }

    if (!passwordMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = createSession({ id: user.id as string, email: user.email as string, name: user.name as string });

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
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
