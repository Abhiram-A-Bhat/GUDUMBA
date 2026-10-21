"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { count, dispatch } = useCart();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "SHOP ALL", href: "/shop" },
    { label: "TEES", href: "/shop?category=tees" },
    { label: "HOODIES", href: "/shop?category=hoodies" },
    { label: "CARGOS", href: "/shop?category=bottoms" },
    { label: "BOMBERS", href: "/shop?category=drop-01-chaos" },
    { label: "OUR STORY", href: "/our-story" },
  ];

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#100f0d] text-[#777] border-b border-[#23201a] text-[10px] uppercase font-mono tracking-[0.25em] py-2 px-6 text-center select-none">
        <span>COMPLIMENTARY PAN-INDIA SHIPPING ON ORDERS OVER ₹1,999 • DROP 01 ARCHIVE</span>
      </div>

      {/* 3-Column Luxury Navigation Bar (Represent / Fear of God architecture) */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-[#100f0d]/95 backdrop-blur-md border-[#1a1a1a] py-3"
            : "bg-[#100f0d] border-[#23201a] py-4"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 grid grid-cols-3 items-center">
          {/* Column 1 (Left): Category Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] font-semibold tracking-[0.18em] text-[#888] hover:text-[#f5f5f5] transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Left Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 text-[#888] hover:text-white"
              aria-label="Open Navigation"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Column 2 (Center): Perfectly Centered GUDUMBA Brand Emblem + Wordmark */}
          <div className="flex items-center justify-center">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                <Image
                  src="/brand/gudumba-sigil-only.png"
                  alt="GUDUMBA Insignia"
                  fill
                  className="object-contain filter brightness-110 group-hover:scale-105 transition-transform"
                />
              </div>
              <span
                className="font-display text-2xl sm:text-3xl tracking-[0.25em] text-[#f5f5f5] transition-opacity group-hover:opacity-80 block whitespace-nowrap"
                style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
              >
                GUDUMBA
              </span>
            </Link>
          </div>

          {/* Column 3 (Right): Clean Utilities */}
          <div className="flex items-center justify-end gap-5 sm:gap-6 text-[#888]">
            <Link
              href="/shop"
              className="hover:text-white transition-colors hidden sm:block p-1"
              aria-label="Search Collection"
            >
              <Search size={17} strokeWidth={1.5} />
            </Link>

            <Link
              href={user ? "/account" : "/login"}
              className="hover:text-white transition-colors p-1"
              aria-label={user ? "Account" : "Sign In"}
            >
              <User size={17} strokeWidth={1.5} />
            </Link>

            <button
              onClick={() => dispatch({ type: "OPEN_DRAWER" })}
              className="hover:text-white transition-colors flex items-center gap-1.5 p-1"
              aria-label={`Cart (${count})`}
            >
              <ShoppingBag size={17} strokeWidth={1.5} />
              <span className="text-[11px] font-mono tracking-widest text-[#f5f5f5]">
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

          <div className="flex flex-col gap-7 py-12">
            {navLinks.map((item) => (
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
            <p>© 2026 GUDUMBA® APPAREL LTD.</p>
          </div>
        </div>
      )}
    </>
  );
}
