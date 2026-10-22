"use client";
import React, { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
      } else {
        setErrorMsg(data.error || "Subscription failed. Please try again.");
      }
    } catch {
      setErrorMsg("We could not save your email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-[#141310] border-t border-[#1a1a1a]">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-[#b59a68] text-xs uppercase tracking-[0.25em] font-semibold block mb-3">
          Inner Circle
        </span>
        <h2
          className="g-display text-4xl sm:text-6xl text-[#f2f0ed] mb-4"
          style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
        >
          BE FIRST TO THE DROP.
        </h2>
        <p className="text-sm text-[#888] mb-8 leading-relaxed">
          Receive private drop coordinates, limited inventory alerts, and lookbook styling access.
        </p>

        {subscribed ? (
          <div className="p-6 bg-[#161616] border border-[#222] rounded-xs flex items-center justify-center gap-3 text-[#f2f0ed]">
            <CheckCircle className="text-[#b59a68]" size={20} />
            <span className="text-sm font-medium">
              You&apos;re in. Welcome to Gudumba. Keep an eye on your inbox.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER YOUR EMAIL..."
              aria-label="Email address for newsletter"
              required
              className="flex-1 bg-[#161616] border border-[#2a2a2a] focus:border-[#b59a68] text-[#f2f0ed] px-4 py-3 text-xs tracking-wider uppercase placeholder:text-[#555] outline-none transition-colors rounded-xs"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap text-xs"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Join Drop <span>→</span>
                </>
              )}
            </button>
          </form>
        )}

        {errorMsg && (
          <p className="text-xs text-red-500 mt-3">{errorMsg}</p>
        )}

        <p className="text-[11px] text-[#555] mt-4">
          Read our{" "}
          <a href="/privacy" className="underline hover:text-[#888]">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </section>
  );
}
