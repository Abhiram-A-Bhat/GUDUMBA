"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2, AlertTriangle, ArrowRight, PackageCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function SuccessContent({ orderNumber, status, isSuccess }: { orderNumber: string; status: string; isSuccess: boolean }) {
  const { dispatch } = useCart();
  useEffect(() => {
    if (!isSuccess) return;
    dispatch({ type: "CLEAR" });
    try {
      confetti({ particleCount: 100, spread: 75, origin: { y: 0.6 }, colors: ["#b59a68", "#f2f0ed", "#333333"] });
    } catch {
      // Confetti is decorative and may be unavailable in some browsers.
    }
  }, [isSuccess, dispatch]);

  if (!isSuccess) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-800 text-red-400 flex items-center justify-center mx-auto mb-6"><AlertTriangle size={32} /></div>
        <h1 className="g-display text-4xl sm:text-5xl text-[#f2f0ed] mb-3">ORDER NOT VERIFIED</h1>
        <p className="text-xs text-[#888] mb-6 leading-relaxed">
          {orderNumber ? "We could not verify this order or its payment. Check your order details or return to checkout." : "No order reference was provided. Your bag is still available at checkout."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout" className="btn-primary">Return to Checkout</Link>
          <Link href="/shop" className="btn-ghost">Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={32} /></div>
      <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-[#b59a68] mb-2 block">BORN DIFFERENT · STAY UNAPOLOGETIC</span>
      <h1 className="g-display text-5xl sm:text-7xl text-[#f2f0ed] mb-4">DROP SECURED.</h1>
      <p className="text-xs text-[#888] max-w-md mx-auto mb-8 leading-relaxed">
        {status === "cod"
          ? "Your Cash on Delivery order is confirmed and queued for packing. Have cash or UPI ready at doorstep."
          : status === "youpi"
          ? "Direct UPI payment verified via YouPI-PG. Your heavyweight Gudumba streetwear piece is officially locked in."
          : "Payment verified via Paytm Gateway. Your heavyweight Gudumba streetwear piece is officially locked in."}
      </p>
      <div className="p-6 bg-[#141310] border border-[#23201a] rounded-xs text-left font-mono text-xs space-y-3 mb-8">
        <div className="flex justify-between border-b border-[#23201a] pb-2.5"><span className="text-[#666]">ORDER NUMBER</span><span className="text-[#f2f0ed] font-bold">{orderNumber}</span></div>
        <div className="flex justify-between border-b border-[#23201a] pb-2.5"><span className="text-[#666]">PAYMENT STATUS</span><span className={status === "cod" ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>{status === "cod" ? "PENDING (COD)" : "VERIFIED"}</span></div>
        <div className="flex justify-between pt-1"><span className="text-[#666]">ESTIMATED DISPATCH</span><span className="text-[#b59a68]">Within 24-48 Hours</span></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account" className="btn-primary flex items-center justify-center gap-2"><PackageCheck size={16} /> View Order Status</Link>
        <Link href="/shop" className="btn-ghost flex items-center justify-center gap-2"><ShoppingBag size={16} /> Continue Exploring <ArrowRight size={14} /></Link>
      </div>
    </div>
  );
}
