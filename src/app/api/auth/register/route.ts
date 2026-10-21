import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import bcrypt from "bcryptjs";
import { createSession, sessionCookieOptions, sessionConfigurationIsValid } from "@/lib/session";
import { allowAuthAttempt } from "@/lib/rate-limit";

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

    // Check if email already exists
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = generateId();

    // Insert user
    db.prepare(`
      INSERT INTO users (id, email, phone, name, password_hash, role, marketing_consent)
      VALUES (?, ?, ?, ?, ?, 'customer', ?)
    `).run(
      userId,
      email.toLowerCase(),
      typeof phone === "string" && phone.trim().length <= 32 ? phone.trim() || null : null,
      name.trim(),
      passwordHash,
      0
    );

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as Record<string, unknown>;

    const token = createSession({ id: user.id as string, email: user.email as string, name: user.name as string });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatar_url,
      },
    }, { status: 201 });

    response.cookies.set("gudumba_token", token, sessionCookieOptions());

    return response;
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
