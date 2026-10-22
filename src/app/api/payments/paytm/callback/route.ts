import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSupabase } from "@/lib/supabase";
// @ts-ignore
import PaytmChecksum from "paytmchecksum";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const paytmParams: Record<string, string> = {};

    formData.forEach((value, key) => {
      paytmParams[key] = value.toString();
    });

    const mkey = process.env.PAYTM_MERCHANT_KEY;
    if (!mkey) return NextResponse.redirect(new URL("/checkout?error=payment_unavailable", req.url));
    const checksum = paytmParams.CHECKSUMHASH;

    delete paytmParams.CHECKSUMHASH;

    let isSignatureValid = false;
    if (checksum) {
      isSignatureValid = await PaytmChecksum.verifySignature(paytmParams, mkey, checksum);
    }

    const orderNumber = paytmParams.ORDERID;
    const status = paytmParams.STATUS; // TXN_SUCCESS or TXN_FAILURE
    const txnId = paytmParams.TXNID || "";
    const respMsg = paytmParams.RESPMSG || "";

    if (!isSignatureValid || !orderNumber) {
      console.warn("Rejected Paytm callback with invalid signature or missing order number");
      return NextResponse.redirect(new URL("/checkout?error=payment_verification_failed", req.url));
    }
    const isSuccess = status === "TXN_SUCCESS";

    // Update SQLite
    try {
      db.prepare(`
        UPDATE orders 
        SET payment_status = ?, paytm_txnid = ?, updated_at = CURRENT_TIMESTAMP
        WHERE order_number = ?
      `).run(isSuccess ? "COMPLETED" : "FAILED", txnId, orderNumber);
    } catch (e) {
      console.warn("SQLite update order error:", e);
    }

    // Mirror to Supabase
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase
          .from("orders")
          .update({
            payment_status: isSuccess ? "COMPLETED" : "FAILED",
            paytm_txnid: txnId,
            updated_at: new Date().toISOString(),
          })
          .eq("order_number", orderNumber);
      }
    } catch (e) {
      console.warn("Supabase update order error:", e);
    }

    // Determine public redirect URL
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    const targetUrl = isSuccess
      ? `${appUrl}/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&status=success&txnid=${encodeURIComponent(txnId)}`
      : `${appUrl}/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}&status=failed&reason=${encodeURIComponent(respMsg)}`;

    // Return HTML auto-redirect
    const html = `<!DOCTYPE html>
<html>
  <head>
    <title>GUDUMBA® — Processing Order</title>
    <meta http-equiv="refresh" content="0; url=${targetUrl}" />
    <style>
      body { background: #100f0d; color: #f2f0ed; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    </style>
  </head>
  <body>
    <p>Processing your Gudumba order... redirecting...</p>
      <script>window.location.replace(${JSON.stringify(targetUrl)});</script>
  </body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    console.error("Paytm callback error:", error);
    return NextResponse.redirect(new URL("/checkout?error=payment_failed", req.url));
  }
}
