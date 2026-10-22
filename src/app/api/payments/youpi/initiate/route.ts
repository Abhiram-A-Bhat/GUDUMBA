import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import db from "@/lib/db";
import { createYoupiPayment } from "@/lib/youpi";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    let order: any = null;

    // 1. Try Supabase
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .single();
      if (data) order = data;
    }

    // 2. Try SQLite fallback
    if (!order) {
      try {
        order = db
          .prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?")
          .get(orderId, orderId);
      } catch {}
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const returnUrl = `${protocol}://${host}/checkout/success?orderNumber=${encodeURIComponent(order.order_number)}`;

    const payment = await createYoupiPayment({
      orderId: order.id,
      orderNumber: order.order_number,
      amount: Number(order.total_amount),
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      returnUrl,
    });

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error: any) {
    console.error("YouPI initiate error:", error);
    return NextResponse.json({ error: error.message || "Failed to initiate YouPI payment" }, { status: 500 });
  }
}
