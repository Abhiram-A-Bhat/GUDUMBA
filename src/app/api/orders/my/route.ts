import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = db.prepare(`
      SELECT id, order_number, subtotal, shipping_fee, total_amount,
        payment_status, fulfillment_status, refund_status, created_at
      FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100
    `).all(auth.user.userId) as Array<Record<string, unknown>>;
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Unable to load orders." }, { status: 500 });
  }
}
