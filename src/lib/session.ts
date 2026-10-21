import { sign, verify } from "jsonwebtoken";
import db from "@/lib/db";

const SESSION_COOKIE = "gudumba_token";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be set to a random value of at least 32 characters.");
  }
  return secret;
}

export function sessionConfigurationIsValid() {
  try { getSecret(); return true; } catch { return false; }
}

export interface AuthPayload {
  userId: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

export function createSession(user: { id: string; email: string; name: string }) {
  return sign({ userId: user.id, email: user.email, name: user.name }, getSecret(), {
    expiresIn: "7d",
    issuer: "gudumba",
    audience: "gudumba-storefront",
  });
}

export function getAuthUserFromToken(token?: string): AuthPayload | null {
  if (!token) return null;
  try {
    const payload = verify(token, getSecret(), {
      issuer: "gudumba",
      audience: "gudumba-storefront",
      algorithms: ["HS256"],
    }) as { userId?: unknown };
    if (typeof payload.userId !== "string") return null;
    const user = db.prepare("SELECT id, email, name, role FROM users WHERE id = ?").get(payload.userId) as
      | { id: string; email: string; name: string; role: string }
      | undefined;
    if (!user || (user.role !== "customer" && user.role !== "admin")) return null;
    return { userId: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  };
}
