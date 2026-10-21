"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("gudumba_cookie_consent");
      if (!consent) {
        setVisible(true);
      }
    } catch {}
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("gudumba_cookie_consent", "accepted");
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and cookies"
      className="fixed bottom-6 right-6 z-50 max-w-sm p-5 bg-[#0a0a0a]/95 backdrop-blur-md border border-[#222] shadow-2xl text-xs text-[#888] font-mono leading-relaxed"
    >
      <p className="mb-4 text-[#aaa]">
        We use essential cookies to maintain bag persistence and session security.{" "}
        <Link href="/privacy" className="text-white underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 py-2 bg-white text-black font-bold uppercase tracking-wider text-[10px] hover:bg-[#e0e0e0] transition-colors"
        >
          Acknowledge
        </button>
      </div>
    </aside>
  );
}
