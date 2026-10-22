"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("gudumba-cookie-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("gudumba-cookie-consent", callback);
  };
};
const getSnapshot = () => {
  try { return localStorage.getItem("gudumba_cookie_consent") === null; } catch { return false; }
};
const getServerSnapshot = () => false;

export default function CookieBanner() {
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const accept = () => {
    try {
      localStorage.setItem("gudumba_cookie_consent", "accepted");
    } catch {}
    window.dispatchEvent(new Event("gudumba-cookie-consent"));
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Privacy and cookies"
      className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm p-5 bg-[#0a0a0a]/95 backdrop-blur-md border border-[#222] shadow-2xl text-xs text-[#888] font-mono leading-relaxed"
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
