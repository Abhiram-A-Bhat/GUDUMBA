"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertTriangle, ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "GDM-OFFLINE";
  const status = searchParams.get("status") || "success";
  const txnId = searchParams.get("txnid");
  const reason = searchParams.get("reason");

  const isSuccess = status === "success" || status === "cod";

  useEffect(() => {
    if (isSuccess) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c8410a", "#f2f0ed", "#333333", "#e88347"],
        });
      } catch {
        // Confetti fallback
      }
    }
  }, [isSuccess]);

  if (!isSuccess) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h1 className="g-display text-4xl sm:text-5xl text-[#f2f0ed] mb-3">PAYMENT FAILED</h1>
        <p className="text-xs text-[#888] mb-6 leading-relaxed">
          {reason || "The payment could not be completed by the bank. Your bag is still intact."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout" className="btn-primary">
            Retry Checkout
          </Link>
          <Link href="/shop" className="btn-ghost">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} />
      </div>

      <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#c8410a] mb-2 block">
        BORN DIFFERENT · STAY UNAPOLOGETIC
      </span>

      <h1 className="g-display text-5xl sm:text-7xl text-[#f2f0ed] mb-4">
        DROP SECURED.
      </h1>

      <p className="text-xs text-[#888] max-w-md mx-auto mb-8 leading-relaxed">
        {status === "cod"
          ? "Your Cash on Delivery order is confirmed and queued for packing. Have cash or UPI ready at doorstep."
          : "Payment verified via Paytm Gateway. Your heavyweight Gudumba streetwear piece is officially locked in."}
      </p>

      {/* Order Details Card */}
      <div className="p-6 bg-[#141310] border border-[#222] rounded-xs text-left font-mono text-xs space-y-3 mb-8">
        <div className="flex justify-between border-b border-[#23201a] pb-2.5">
          <span className="text-[#666]">ORDER NUMBER</span>
          <span className="text-[#f2f0ed] font-bold">{orderNumber}</span>
        </div>
        <div className="flex justify-between border-b border-[#23201a] pb-2.5">
          <span className="text-[#666]">PAYMENT STATUS</span>
          <span className={status === "cod" ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
            {status === "cod" ? "PENDING (COD)" : "VERIFIED (PAYTM)"}
          </span>
        </div>
        {txnId && (
          <div className="flex justify-between border-b border-[#23201a] pb-2.5">
            <span className="text-[#666]">PAYTM TXN ID</span>
            <span className="text-[#aaa] truncate max-w-[200px]">{txnId}</span>
          </div>
        )}
        <div className="flex justify-between pt-1">
          <span className="text-[#666]">ESTIMATED DISPATCH</span>
          <span className="text-[#e88347]">Within 24-48 Hours</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account" className="btn-primary flex items-center justify-center gap-2">
          <PackageCheck size={16} /> View Order Status
        </Link>
        <Link href="/shop" className="btn-ghost flex items-center justify-center gap-2">
          <ShoppingBag size={16} /> Continue Exploring <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#100f0d] flex flex-col justify-between">
      <main className="w-full">
        <Suspense fallback={<div className="text-center py-20 text-xs text-[#888]">Loading confirmation...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
