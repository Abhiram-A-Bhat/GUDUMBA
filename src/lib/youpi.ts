import crypto from "crypto";
import QRCode from "qrcode";

export interface CreateYoupiPaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  returnUrl?: string;
}

export interface YoupiPaymentResult {
  orderId: string;
  orderNumber: string;
  amount: number;
  upiString: string;
  qrCodeDataUrl: string;
  checkoutUrl?: string;
  vpa: string;
}

/**
 * Generate standard NPCI UPI Intent string (compatible with all Indian UPI apps)
 */
export function generateUpiString(params: {
  vpa: string;
  name: string;
  amount: number;
  orderNumber: string;
  txnRef?: string;
}): string {
  const { vpa, name, amount, orderNumber, txnRef } = params;
  const am = amount.toFixed(2);
  const pn = encodeURIComponent(name);
  const tn = encodeURIComponent(`GUDUMBA ${orderNumber}`);
  const tr = encodeURIComponent(txnRef || orderNumber);

  return `upi://pay?pa=${vpa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}&tr=${tr}`;
}

/**
 * Initialize payment with YouPI-PG gateway (with local fallback if gateway server is offline)
 */
export async function createYoupiPayment(
  params: CreateYoupiPaymentParams
): Promise<YoupiPaymentResult> {
  const { orderId, orderNumber, amount, customerName, customerEmail, customerPhone, returnUrl } = params;

  const apiUrl = process.env.YOUPI_API_URL || "";
  const merchantId = process.env.YOUPI_MERCHANT_ID || "gudumba-apparel";
  const vpa = process.env.YOUPI_MERCHANT_VPA || "gudumba@upi";

  const standardUpiString = generateUpiString({
    vpa,
    name: "GUDUMBA® APPAREL",
    amount,
    orderNumber,
    txnRef: orderId,
  });

  let checkoutUrl: string | undefined = undefined;
  let finalUpiString = standardUpiString;

  // Attempt communication with external YouPI-PG core instance if configured
  if (apiUrl && !apiUrl.includes("example.com")) {
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-merchant-id": merchantId,
        },
        body: JSON.stringify({
          orderId: orderNumber,
          amount: amount.toFixed(2),
          currency: "INR",
          customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          },
          returnUrl: returnUrl || `/checkout/success?orderNumber=${orderNumber}`,
          metadata: { orderId },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) checkoutUrl = data.checkoutUrl;
        if (data.upiString) finalUpiString = data.upiString;
      }
    } catch (err) {
      console.warn("YouPI-PG server connection warning (falling back to direct UPI):", err);
    }
  }

  // Generate crisp QR code data URL
  const qrCodeDataUrl = await QRCode.toDataURL(finalUpiString, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 320,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return {
    orderId,
    orderNumber,
    amount,
    upiString: finalUpiString,
    qrCodeDataUrl,
    checkoutUrl,
    vpa,
  };
}

/**
 * Verify HMAC-SHA256 webhook signature from YouPI-PG server
 */
export function verifyYoupiWebhookSignature(
  rawBody: string,
  signatureHeader?: string | null
): boolean {
  const secret = process.env.YOUPI_WEBHOOK_SECRET || "youpi_secret_gudumba_2026_dev";
  if (!signatureHeader || !secret) return false;

  try {
    // Expected header format: "sha256=abcdef..." or raw hex hash
    const cleanSignature = signatureHeader.startsWith("sha256=")
      ? signatureHeader.slice(7)
      : signatureHeader;

    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedHash, "hex");
    const receivedBuffer = Buffer.from(cleanSignature, "hex");

    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch (err) {
    console.error("YouPI webhook signature verification exception:", err);
    return false;
  }
}
