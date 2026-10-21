import { NextRequest } from "next/server";
import { getAuthUserFromToken, type AuthPayload } from "@/lib/session";

export function getAuthUser(req: NextRequest): AuthPayload | null {
  return getAuthUserFromToken(req.cookies.get("gudumba_token")?.value);
}

export function requireAuth(req: NextRequest): { user: AuthPayload; error: null } | { user: null; error: string } {
  const user = getAuthUser(req);
  if (!user) return { user: null, error: "Unauthorized" };
  return { user, error: null };
}

export function requireAdmin(req: NextRequest): { user: AuthPayload; error: null } | { user: null; error: string } {
  const user = getAuthUser(req);
  if (!user) return { user: null, error: "Unauthorized" };
  if (user.role !== "admin") return { user: null, error: "Forbidden" };
  return { user, error: null };
}
