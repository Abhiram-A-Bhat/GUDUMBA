"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, ShieldCheck, CreditCard, Truck, AlertCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, total, dispatch } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"PAYTM" | "COD">("PAYTM");

  const shippingFee = total >= 2000 ? 0 : 99;
  const finalTotal = total + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !phone || !addressLine1 || !city || !stateName || !pincode) {
      setError("Please fill out all required shipping and contact fields.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setError("Please provide a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: {
            line1: addressLine1,
            line2: addressLine2,
            city,
            state: stateName,
            postalCode: pincode,
            country: "India",
          },
          paymentMethod,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Order creation failed.");
      }

      // 2. Handle payment flow
      if (paymentMethod === "PAYTM") {
        // Initiate Paytm transaction
        const paytmRes = await fetch("/api/payments/paytm/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderData.orderId }),
        });

        const paytmData = await paytmRes.json();

        if (!paytmRes.ok || !paytmData.success) {
          throw new Error(paytmData.error || "Failed to initiate Paytm gateway.");
        }

        // Clear cart in local storage before redirecting
        dispatch({ type: "CLEAR" });

        // Auto-create form and submit to Paytm
        const form = document.createElement("form");
        form.method = "POST";
        form.action = paytmData.actionUrl;

        Object.entries(paytmData.params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // Cash on delivery
        dispatch({ type: "CLEAR" });
        router.push(`/checkout/success?orderNumber=${encodeURIComponent(orderData.orderNumber)}&status=cod`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during checkout.");
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[#100f0d] flex flex-col justify-between">
      <main className="max-w-[1200px] mx-auto px-6 py-8 w-full">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs text-[#888] hover:text-white font-mono uppercase tracking-wider mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Shop
        </Link>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-10">CHECKOUT</h1>

        {state.items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <h2 className="g-display text-4xl text-[#f2f0ed] mb-4">YOUR BAG IS EMPTY.</h2>
            <p className="text-sm text-[#888] mb-8">Browse the current Gudumba drop and secure your fit.</p>
            <Link href="/shop" className="btn-primary">
              Shop The Drop →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Customer & Shipping Details */}
            <div className="lg:col-span-7 space-y-8">
              {error && (
                <div className="p-4 bg-red-950/60 border border-red-800 rounded-sm flex items-start gap-3 text-red-200 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Contact Information */}
              <div className="p-6 bg-[#141310] border border-[#222] rounded-xs space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-bold text-[#f2f0ed] border-b border-[#26231d] pb-3">
                  1. Contact Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Abhiram Bhat"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="order updates & receipt"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-6 bg-[#141310] border border-[#222] rounded-xs space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-bold text-[#f2f0ed] border-b border-[#26231d] pb-3">
                  2. Shipping Address (Pan-India)
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House / Flat No., Street, Area"
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                      Apartment, Landmark, Suite (Optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Near landmark..."
                      className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#999] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="560001"
                        className="w-full bg-[#141414] border border-[#2a2a2a] focus:border-[#c8410a] rounded-xs px-3.5 py-2.5 text-xs text-white outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="p-6 bg-[#141310] border border-[#222] rounded-xs space-y-4">
                <h2 className="text-xs uppercase tracking-widest font-bold text-[#f2f0ed] border-b border-[#26231d] pb-3">
                  3. Select Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Paytm Gateway Option */}
                  <div
                    onClick={() => setPaymentMethod("PAYTM")}
                    className={`cursor-pointer p-4 rounded-xs border transition-all ${
                      paymentMethod === "PAYTM"
                        ? "border-[#c8410a] bg-[#1a0f0a]"
                        : "border-[#222] bg-[#121212] hover:border-[#333]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-[#c8410a]" />
                        <span className="text-xs font-bold text-white tracking-wide">
                          Paytm / UPI / Cards
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-blue-950 text-blue-400 border border-blue-800 text-[9px] font-mono rounded">
                        INSTANT
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888] leading-relaxed">
                      Pay securely via Google Pay, PhonePe, Paytm UPI, Net Banking, or Credit/Debit Cards.
                    </p>
                  </div>

                  {/* Cash on Delivery Option */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`cursor-pointer p-4 rounded-xs border transition-all ${
                      paymentMethod === "COD"
                        ? "border-[#c8410a] bg-[#1a0f0a]"
                        : "border-[#222] bg-[#121212] hover:border-[#333]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-[#c8410a]" />
                        <span className="text-xs font-bold text-white tracking-wide">
                          Cash on Delivery
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-mono rounded">
                        COD
                      </span>
                    </div>
                    <p className="text-[11px] text-[#888] leading-relaxed">
                      Pay with cash or UPI directly to the courier agent upon doorstep delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Connecting to Paytm Gateway...</span>
                  </>
                ) : paymentMethod === "PAYTM" ? (
                  `Pay ${formatPrice(finalTotal)} with Paytm →`
                ) : (
                  `Confirm COD Order (${formatPrice(finalTotal)}) →`
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#666]">
                <ShieldCheck size={14} className="text-[#c8410a]" />
                <span>256-bit encrypted checkout · Official Paytm Merchant Verified</span>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <aside
              className="lg:col-span-5 p-6 bg-[#141310] border border-[#222] rounded-xs h-fit space-y-6"
              aria-label="Bag summary"
            >
              <h2 className="text-xs uppercase tracking-widest font-bold text-[#f2f0ed] border-b border-[#23201a] pb-3">
                Bag Summary ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {state.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-18 bg-[#161616] rounded-xs overflow-hidden shrink-0 border border-[#222]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#f2f0ed] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#777] font-mono mt-0.5">
                        SIZE: {item.size} · QTY: {item.quantity}
                      </p>
                      <p className="text-xs font-bold text-[#f2f0ed] mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5 border-t border-[#23201a] pt-4 font-mono text-xs">
                <div className="flex justify-between text-[#888]">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>Delivery (India)</span>
                  <span>{shippingFee === 0 ? "FREE" : formatPrice(shippingFee)}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-[#e88347]">
                    Add {formatPrice(2000 - total)} more to unlock free shipping.
                  </p>
                )}
                <div className="flex justify-between text-sm font-bold text-[#f2f0ed] border-t border-[#23201a] pt-3">
                  <span>Total Amount</span>
                  <span className="text-[#e88347]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#121212] border border-[#222] rounded-xs text-[11px] text-[#777] space-y-1">
                <p className="text-white font-medium">⚡ Gudumba Express Fulfillment</p>
                <p>Dispatched in 24-48 hours. Delivered in 3-5 days across India with 7-day hassle-free exchange.</p>
              </div>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}
