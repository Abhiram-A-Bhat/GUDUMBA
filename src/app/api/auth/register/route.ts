import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession, sessionCookieOptions, sessionConfigurationIsValid } from "@/lib/session";
import { allowAuthAttempt } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

function generateId(): string {
  return `usr-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    if (!sessionConfigurationIsValid()) {
      return NextResponse.json({ error: "Server session configuration is missing." }, { status: 503 });
    }
    if (!allowAuthAttempt(req, "register", 5, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many account creation attempts. Try again later." }, { status: 429 });
    }
    const body = await req.json();
    const { name, email, password, phone } = body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
    };

    // Validate required fields
    if (typeof name !== "string" || !name.trim() || name.length > 100) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (typeof email !== "string" || email.length > 254 || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 200) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = name.trim();
    let userId = generateId();

    // 1. Supabase Signup
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: supaUser, error: supaErr } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanName, phone: phone || "" },
          },
        });
        if (supaUser.user?.id) {
          userId = supaUser.user.id;
        }
      } catch (err) {
        console.warn("Supabase signup warning:", err);
      }
    }

    // 2. Hash password & SQLite store if available
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      db.prepare(`
        INSERT OR IGNORE INTO users (id, email, phone, name, password_hash, role, marketing_consent)
        VALUES (?, ?, ?, ?, ?, 'customer', 0)
      `).run(userId, cleanEmail, phone?.trim() || null, cleanName, passwordHash);
    } catch {}

    const token = createSession({ id: userId, email: cleanEmail, name: cleanName });

    const response = NextResponse.json({
      user: {
        id: userId,
        email: cleanEmail,
        name: cleanName,
        role: "customer",
      },
    }, { status: 201 });

    response.cookies.set("gudumba_token", token, sessionCookieOptions());
    return response;
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
