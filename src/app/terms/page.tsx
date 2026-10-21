import React from "react";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#050505] text-[#ccc]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
          Terms & Conditions
        </span>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">
          TERMS OF SERVICE
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-[#999]">
          <p>
            Draft for owner and legal review. The operator&apos;s legal name, jurisdiction, contact details, and final terms have not been confirmed. Checkout is not active and this website does not currently accept purchases.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">1. Limited Drop Inventory</h2>
          <p>
            Product copy and inventory shown in the local sample catalogue are unverified. Replace it with approved item details and available stock before publishing for sale.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">2. Intellectual Property</h2>
          <p>
            Confirm the legal rights and ownership for uploaded logos, photography, video, typography, and product imagery before publication.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">3. Governing Jurisdiction</h2>
          <p>
            The applicable law and dispute forum have not been confirmed. Add them only after review by the business owner and legal counsel.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
