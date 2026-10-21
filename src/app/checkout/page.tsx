"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function CheckoutPage() {
  const { state, total } = useCart();

  return (
    <div className="pt-24 min-h-screen bg-[#050505] flex flex-col justify-between">
      <main className="max-w-[1200px] mx-auto px-6 py-8 w-full">
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs text-[#888] hover:text-white font-mono uppercase tracking-wider mb-8">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-10">CHECKOUT</h1>

        {state.items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <h2 className="g-display text-4xl text-[#f2f0ed] mb-4">YOUR BAG IS EMPTY.</h2>
            <p className="text-sm text-[#888] mb-8">Browse the current Gudumba preview collection.</p>
            <Link href="/shop" className="btn-primary">Shop Collection →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <section className="lg:col-span-7 space-y-6" aria-labelledby="checkout-status">
              <div className="p-6 border border-[#5c321b] bg-[#1a100b] rounded-xs">
                <h2 id="checkout-status" className="flex items-center gap-2 text-sm font-bold text-[#f2f0ed] mb-2">
                  <ShieldAlert size={17} className="text-[#e88347]" /> Checkout is offline
                </h2>
                <p className="text-sm text-[#b7a89c] leading-relaxed">
                  Secure payment processing has not been configured. No order or payment can be placed, and no personal or delivery details are being requested. Your bag stays saved in this browser.
                </p>
              </div>
              <p className="text-xs text-[#666]">Product prices and availability in this preview have not been confirmed by the store owner.</p>
              <Link href="/shop" className="btn-ghost">Continue browsing</Link>
            </section>

            <aside className="lg:col-span-5 p-6 bg-[#0e0e0e] border border-[#222] rounded-xs h-fit" aria-label="Bag summary">
              <h2 className="text-sm uppercase tracking-widest font-bold text-[#f2f0ed] mb-6 border-b border-[#1c1c1c] pb-3">
                Bag Summary ({state.items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-18 bg-[#161616] rounded-xs overflow-hidden shrink-0 border border-[#222]">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#f2f0ed] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#777] font-mono mt-0.5">SIZE: {item.size} · QTY: {item.quantity}</p>
                      <p className="text-xs font-bold text-[#f2f0ed] mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 border-t border-[#1c1c1c] pt-4 font-mono text-xs">
                <div className="flex justify-between text-[#888]"><span>SUBTOTAL</span><span>{formatPrice(total)}</span></div>
                <div className="flex justify-between text-[#f2f0ed] text-sm font-bold border-t border-[#222] pt-3"><span>PREVIEW SUBTOTAL</span><span className="text-[#c8410a]">{formatPrice(total)}</span></div>
                <p className="text-[10px] text-[#777] pt-2">Shipping and taxes are not available in this preview.</p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
