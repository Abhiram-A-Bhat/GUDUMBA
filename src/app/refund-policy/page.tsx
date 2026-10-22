import React from "react";
import Footer from "@/components/Footer";

export default function RefundPolicyPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#100f0d] text-[#ccc]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <span className="text-[#b59a68] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
          Customer Assurance
        </span>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">
          REFUND & EXCHANGE POLICY
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-[#999]">
          <p>Draft for owner and legal review. Checkout and payments are not currently active, so no order or refund can be placed through this website.</p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">1. Returns and exchanges</h2>
          <p>
            The return and exchange window, item condition requirements, process, and exclusions have not been confirmed by the business owner. Replace this draft with the actual policy before accepting orders.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">2. Damaged or Defective Items</h2>
          <p>
            Provide a verified support contact and the actual process for damaged or incorrect items before launch. No support email address or response deadline has been confirmed.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">3. Refund Processing Timelines</h2>
          <p>
            Refund eligibility, payment method, and processing times depend on the payment provider and business policy. No refund timeline is promised by this draft.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
