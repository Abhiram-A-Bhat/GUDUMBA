import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-helpers";

// Checkout is deliberately unavailable until the server-side payment gateway,
// verified callbacks, and refund lifecycle are configured. Never create a
// pretend order or decrement inventory before payment has been verified.
export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.user) {
    return NextResponse.json({ error: "Sign in before checkout." }, { status: 401 });
  }
  return NextResponse.json(
    { error: "Checkout is temporarily unavailable while secure payment processing is being configured. Your bag is unchanged." },
    { status: 503 }
  );
}
