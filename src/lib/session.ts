import { sign, verify } from "jsonwebtoken";

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
  phone?: string;
}

export function createSession(user: { id: string; email: string; name: string; role?: "customer" | "admin"; phone?: string }) {
  const role = user.role || "customer";
  return sign({ userId: user.id, email: user.email, name: user.name, role, phone: user.phone }, getSecret(), {
    expiresIn: role === "admin" ? "8h" : "7d",
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
    }) as { userId?: unknown; email?: unknown; name?: unknown; role?: unknown; phone?: unknown };
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      (payload.role !== "customer" && payload.role !== "admin")
    ) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      ...(typeof payload.phone === "string" ? { phone: payload.phone } : {}),
    };
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
