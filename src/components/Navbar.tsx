"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { count, dispatch, state } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopNavLinks = [
    { label: "SHOP", href: "/shop" },
    { label: "COLLECTIONS", href: "/collections" },
    { label: "OUR STORY", href: "/our-story" },
  ];

  const mobileNavLinks = [
    { label: "SHOP ALL", href: "/shop" },
    { label: "TEES", href: "/shop?category=tees" },
    { label: "HOODIES", href: "/shop?category=hoodies" },
    { label: "CARGOS", href: "/shop?category=bottoms" },
    { label: "BOMBERS", href: "/shop?category=drop-01-chaos" },
    { label: "COLLECTIONS", href: "/collections" },
    { label: "OUR STORY", href: "/our-story" },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="border-b border-[#8d744f]/40 bg-[#0b0a08] px-4 py-2 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-[#c4ad7c] select-none sm:text-[9px] sm:tracking-[0.27em]">
        <span>COMPLIMENTARY PAN-INDIA SHIPPING ON ORDERS OVER ₹1,999 • DROP 01 ARCHIVE</span>
      </div>

      {/* 3-Zone Luxury Navigation Bar (Strict Anti-Collision Architecture) */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#0b0a08]/95 backdrop-blur-md border-[#8d744f]/50 py-3"
            : "bg-[#0b0a08] border-[#8d744f]/50 py-3.5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 flex items-center justify-between">
          {/* Zone 1 (Left): Curated Desktop Category Links / Mobile Hamburger */}
          <div className="flex-1 flex items-center justify-start min-w-0">
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {desktopNavLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                className="whitespace-nowrap font-mono text-[9px] tracking-[0.22em] text-[#c5bfb4] transition-colors hover:text-[#c5a970]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-1.5 text-[#888] hover:text-white transition-colors"
                aria-label="Open Navigation"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Zone 2 (Center): Perfectly Centered GUDUMBA Brand Emblem + Wordmark */}
          <div className="shrink-0 px-6 sm:px-10 flex items-center justify-center">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src="/brand/gudumba-sigil-only.png"
                  alt="GUDUMBA Insignia"
                  fill
                  className="object-contain filter brightness-110 group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="block whitespace-nowrap font-display text-[22px] tracking-[-0.045em] text-[#f0ece4] transition-opacity group-hover:opacity-80 sm:text-[27px]">
                GUDUMBA
              </span>
            </Link>
          </div>

          {/* Zone 3 (Right): Clean Utilities */}
          <div className="flex-1 flex items-center justify-end gap-3 text-[#c5bfb4] sm:gap-5">
            <Link
              href="/shop"
                className="hidden p-1 transition-colors hover:text-[#c5a970] sm:block"
              aria-label="Search Collection"
            >
              <Search size={17} strokeWidth={1.5} />
            </Link>

            <Link
              href={user ? "/account" : "/login"}
              className="p-1 transition-colors hover:text-[#c5a970]"
              aria-label={user ? "Account" : "Sign In"}
            >
              <User size={17} strokeWidth={1.5} />
            </Link>

            <button
              type="button"
              onClick={() => dispatch({ type: "OPEN_DRAWER" })}
              className="flex items-center gap-1.5 p-1 transition-colors hover:text-[#c5a970]"
              aria-label={`Cart (${count})`}
              aria-controls="cart-drawer"
              aria-expanded={state.isOpen}
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              <span className="font-mono text-[9px] tracking-widest text-[#d1bd91]">
                [{count}]
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#100f0d] flex flex-col p-8 animate-fadeIn">
          <div className="flex items-center justify-between pb-8 border-b border-[#23201a]">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7">
                <Image
                  src="/brand/gudumba-sigil-only.png"
                  alt="GUDUMBA Insignia"
                  fill
                  className="object-contain"
                />
              </div>
              <span
                className="font-display text-2xl tracking-[0.25em] text-white"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                GUDUMBA
              </span>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 text-[#888] hover:text-white"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex flex-col gap-6 py-10 overflow-y-auto">
            {mobileNavLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-3xl tracking-[0.15em] text-[#ccc] hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-[#23201a] flex flex-col gap-4 font-mono text-[11px] text-[#666]">
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="text-white hover:underline uppercase tracking-widest"
            >
              {user ? "CUSTOMER PORTAL" : "ACCOUNT / SIGN IN"}
            </Link>
            <p>© 2026 GUDUMBA®</p>
          </div>
        </div>
      )}
    </>
  );
}
