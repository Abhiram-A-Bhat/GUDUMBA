"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

const shopLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=tees", label: "Heavy Graphic Tees" },
  { href: "/shop?category=hoodies", label: "Fleece Hoodies" },
  { href: "/shop?category=bottoms", label: "Tactical Cargos" },
  { href: "/collections", label: "Archive Chapters" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
    } catch {
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#050505] text-[#888] border-t border-[#151515] pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-[#151515]">
          {/* Brand Column with Sigil Logo Artwork */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="relative w-16 h-16 mb-6">
                <Image
                  src="/brand/gudumba-sigil-only.png"
                  alt="Gudumba Crest"
                  fill
                  className="object-contain filter brightness-110"
                />
              </div>

              <span
                className="font-display text-4xl text-white tracking-[0.25em] block mb-3"
                style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
              >
                GUDUMBA
              </span>
              <p className="text-xs text-[#666] font-mono uppercase tracking-widest max-w-sm leading-relaxed mb-6">
                BORN DIFFERENT. STAY UNAPOLOGETIC.
                <br />
                NO VALIDATION. NO IMITATION. NO APOLOGIES.
              </p>
            </div>

            <div className="text-[11px] font-mono text-[#555]">
              <p>HYDERABAD • MUMBAI • LONDON</p>
              <p className="mt-1">D2C CUT & SEW STREETWEAR ARCHIVE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#444] block mb-6">
              COLLECTION
            </span>
            <ul className="space-y-3.5 text-xs font-mono">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Disclosures */}
          <div className="md:col-span-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#444] block mb-6">
              CLIENT SERVICES
            </span>
            <ul className="space-y-3.5 text-xs font-mono">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Data Deletion Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* VIP Drop Alerts */}
          <div className="md:col-span-3">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#444] block mb-6">
              SUBSCRIBE TO DROPS
            </span>
            <p className="text-xs text-[#777] mb-4 leading-relaxed font-light">
              Receive private drop coordinates, limited inventory alerts, and lookbook styling access.
            </p>

            {subscribed ? (
              <span className="text-xs font-mono text-white block py-2 border-b border-white">
                ✓ YOU ARE ON THE PRIVATE LIST.
              </span>
            ) : (
              <form onSubmit={handleSubscribe} className="flex border-b border-[#2a2a2a] focus-within:border-white transition-colors pb-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER EMAIL ADDRESS"
                  required
                  className="bg-transparent text-xs text-white placeholder:text-[#555] font-mono outline-none flex-1 py-1"
                />
                <button type="submit" disabled={loading} className="text-[#888] hover:text-white pl-2">
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                </button>
              </form>
            )}

            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://instagram.com/only.gudumba"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#666] hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
              >
                <InstagramIcon size={16} />
                <span>@only.gudumba</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#444] gap-4">
          <p>© 2026 GUDUMBA® APPAREL INC. ALL RIGHTS RESERVED.</p>
          <p>STREETWEAR ARCHITECTURE // BUILT WITH UNCOMPROMISED QUALITY.</p>
        </div>
      </div>
    </footer>
  );
}
