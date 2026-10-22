import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import db from "@/lib/db";
import { verifyYoupiWebhookSignature } from "@/lib/youpi";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature =
      req.headers.get("x-gateway-signature") ||
      req.headers.get("x-youpi-signature") ||
      req.headers.get("x-signature");

    const isValid = verifyYoupiWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.warn("YouPI webhook signature mismatch:", { signature });
      return NextResponse.json({ error: "Invalid cryptographic signature" }, { status: 401 });
    }

    let payload: any = {};
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const event = (payload.event || payload.status || payload.type || "").toUpperCase();
    const orderNumber = payload.orderId || payload.orderNumber || payload.data?.orderId;
    const utr = payload.utr || payload.rrn || payload.data?.utr || "";
    const txnId = payload.txnId || payload.transactionId || payload.data?.txnId || "";

    if (!orderNumber) {
      return NextResponse.json({ error: "Missing orderId in payload" }, { status: 400 });
    }

    const isSuccess = event === "SUCCESS" || event === "PAYMENT_SUCCESS" || event === "PAID";
    const newStatus = isSuccess ? "COMPLETED" : "FAILED";

    // 1. Update Supabase
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase
          .from("orders")
          .update({
            payment_status: newStatus,
            paytm_txnid: utr || txnId, // store UTR / gateway txn reference
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", orderNumber);
      }
    } catch (e) {
      console.warn("Supabase order update warning from YouPI webhook:", e);
    }

    // 2. Update SQLite
    try {
      db.prepare(`
        UPDATE orders 
        SET payment_status = ?, paytm_txnid = ?, updated_at = CURRENT_TIMESTAMP
        WHERE order_number = ?
      `).run(newStatus, utr || txnId, orderNumber);
    } catch (e) {
      console.warn("SQLite order update warning from YouPI webhook:", e);
    }

    return NextResponse.json({
      received: true,
      orderNumber,
      status: newStatus,
      utr,
    });
  } catch (err: any) {
    console.error("YouPI webhook processing error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
