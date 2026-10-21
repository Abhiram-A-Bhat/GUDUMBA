import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { consumeRateLimit } from "@/lib/db";

export function allowAuthAttempt(request: NextRequest, action: "login" | "register", limit: number, windowMs: number) {
  // Hosting proxies should overwrite these headers. Hash the address before storing it.
  const address = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const digest = createHash("sha256").update(`${action}:${address}`).digest("hex");
  return consumeRateLimit(`${action}:${digest}`, limit, windowMs);
}
