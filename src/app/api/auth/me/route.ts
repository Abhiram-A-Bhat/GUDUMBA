import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = getAuthUserFromToken(req.cookies.get("gudumba_token")?.value);
  return NextResponse.json({ user: user ? { id: user.userId, email: user.email || undefined, phone: user.phone, name: user.name, role: user.role } : null });
}
