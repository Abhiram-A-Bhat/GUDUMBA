import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
// @ts-ignore - paytmchecksum is a commonjs library
import PaytmChecksum from "paytmchecksum";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Fetch order from DB
    const order = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?").get(orderId, orderId) as any;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const mid = process.env.PAYTM_MID || "eluSCy54226242613261";
    const mkey = process.env.PAYTM_MERCHANT_KEY || "m8KtDYfUxi71LksK";
    const website = process.env.PAYTM_WEBSITE || "WEBSTAGING";
    const industryTypeId = process.env.PAYTM_INDUSTRY_TYPE_ID || "Retail";
    const channelId = process.env.PAYTM_CHANNEL_ID || "WEB";
    const isStaging = process.env.PAYTM_ENV !== "production";

    // Determine public app URL for callback
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
    const callbackUrl = `${appUrl}/api/payments/paytm/callback`;

    // Paytm parameters for Redirection checkout flow
    const paytmParams: Record<string, string> = {
      MID: mid,
      WEBSITE: website,
      INDUSTRY_TYPE_ID: industryTypeId,
      CHANNEL_ID: channelId,
      ORDER_ID: order.order_number,
      CUST_ID: order.user_id || `CUST_${order.id.slice(-8)}`,
      MOBILE_NO: order.customer_phone.replace(/\D/g, "").slice(-10) || "9999999999",
      EMAIL: order.customer_email,
      TXN_AMOUNT: Number(order.total_amount).toFixed(2),
      CALLBACK_URL: callbackUrl,
    };

    const checksum = await PaytmChecksum.generateSignature(paytmParams, mkey);
    paytmParams.CHECKSUMHASH = checksum;

    const actionUrl = isStaging
      ? "https://securegw-stage.paytm.in/order/process"
      : "https://securegw.paytm.in/order/process";

    return NextResponse.json({
      success: true,
      actionUrl,
      params: paytmParams,
    });
  } catch (error: any) {
    console.error("Paytm initiate error:", error);
    return NextResponse.json({ error: error.message || "Failed to initiate payment" }, { status: 500 });
  }
}
