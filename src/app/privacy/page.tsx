import React from "react";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#050505] text-[#ccc]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
          Legal Disclosures
        </span>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">
          PRIVACY POLICY
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-[#999]">
          <p>
            Draft for review. This page describes the data the current Gudumba website is designed to handle. The business owner must add the legal operator name, jurisdiction, contact details, and retention periods before launch.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">1. Information We Collect</h2>
          <p>
            Account registration stores the name, email address, optional phone number, and a password hash. A checkout form is present, but payment processing is not configured and the site does not currently accept or confirm orders. Do not enter payment credentials on this site.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">2. Usage of Customer Data</h2>
          <p>
            The application currently has no configured email, analytics, advertising, or payment provider. Newsletter, order fulfillment, and support workflows are not active. Optional tracking scripts are not installed.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">3. Data Retention and Deletion</h2>
          <p>
            Signed-in customers can submit a deletion request from the account page. The request is recorded for administrator review; it does not itself delete data. Add and verify a real privacy contact address and define retention rules before publication.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
