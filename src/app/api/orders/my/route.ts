import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSupabase } from "@/lib/supabase";
import { requireAuth } from "@/lib/auth-helpers";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("orders")
        .select("id, order_number, subtotal, shipping_fee, total_amount, payment_status, fulfillment_status, created_at")
        .eq("user_id", auth.user.userId)
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) return NextResponse.json({ orders: data });
    }

    const orders = db.prepare(`
      SELECT id, order_number, subtotal, shipping_fee, total_amount,
        payment_status, fulfillment_status, refund_status, created_at
      FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100
    `).all(auth.user.userId) as Array<Record<string, unknown>>;
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ orders: [] });
  }
}
