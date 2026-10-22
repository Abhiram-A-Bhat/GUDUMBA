import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("orderNumber") || searchParams.get("orderId");

    if (!orderNumber) {
      return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
    }

    let order: any = null;

    // 1. Check Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("orders")
        .select("order_number, payment_status, paytm_txnid, total_amount")
        .eq("order_number", orderNumber)
        .single();
      if (data) order = data;
    }

    // 2. Check SQLite
    if (!order) {
      try {
        order = db
          .prepare("SELECT order_number, payment_status, paytm_txnid, total_amount FROM orders WHERE order_number = ?")
          .get(orderNumber);
      } catch {}
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      orderNumber: order.order_number,
      paymentStatus: order.payment_status,
      isPaid: order.payment_status === "COMPLETED",
      utr: order.paytm_txnid,
      amount: order.total_amount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Status check failed" }, { status: 500 });
  }
}
