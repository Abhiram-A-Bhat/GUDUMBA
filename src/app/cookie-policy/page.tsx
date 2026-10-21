import React from "react";
import Footer from "@/components/Footer";

export default function CookiePolicyPage() {
  return (
    <div className="pt-28 min-h-screen bg-[#100f0d] text-[#ccc]">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.2em] font-semibold block mb-2">
          Tracking Transparency
        </span>
        <h1 className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-8">
          COOKIE POLICY
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-[#999]">
          <p>
            Draft disclosure. The application uses a necessary HttpOnly session cookie for signed-in accounts and local browser storage for the shopping bag and cookie preferences. No analytics or advertising scripts are currently installed.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">1. Strictly Necessary Cookies</h2>
          <p>
            The session cookie is used for authentication. The cart and consent choice are stored in browser local storage. Checkout is not active. Add the production provider cookie names and retention periods before launch.
          </p>

          <h2 className="text-lg font-bold text-[#f2f0ed] pt-4">2. Performance & Preference Cookies</h2>
          <p>
            Optional analytics and marketing cookies are not active. The banner records a preference locally, but a persistent settings control still needs to be added before launch.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
