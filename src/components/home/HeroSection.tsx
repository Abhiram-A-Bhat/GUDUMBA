"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

export default function HeroSection() {
  const [muted, setMuted] = useState(true);

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen bg-[#100f0d] overflow-hidden border-b border-[#23201a] flex flex-col justify-end">
      {/* Background Campaign Video */}
      <video
        src="/brand/campaign_hero.mp4"
        poster="/brand/brand_asset_0.jpeg"
        autoPlay
        loop
        muted={muted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] contrast-[1.1]"
      />

      {/* Subtle luxury vignette gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#100f0d] via-[#100f0d]/20 to-[#100f0d]/40" />

      {/* Floating Audio Toggle in Bottom Right */}
      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-10 right-6 sm:right-12 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-[#333] hover:border-[#888] text-[#ccc] hover:text-white px-3.5 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all"
        aria-label="Toggle Soundtrack"
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-[#c8410a]" />}
        <span className="hidden sm:inline">Soundtrack // {muted ? "Muted" : "Playing"}</span>
      </button>

      {/* Editorial Content Container with Generous Top Padding & Balanced Responsive Fonts */}
      <div className="relative z-20 max-w-[1600px] mx-auto w-full px-6 sm:px-12 pt-32 pb-16 sm:pb-24">
        <div className="max-w-3xl">
          {/* Official Sigil Emblem Floating Crest in Hero */}
          <div className="relative w-14 h-14 sm:w-18 sm:h-18 mb-5 drop-shadow-2xl">
            <Image
              src="/brand/gudumba-sigil-only.png"
              alt="Gudumba Insignia Emblem"
              fill
              className="object-contain filter brightness-125"
            />
          </div>

          <span className="text-[#888] text-[10px] sm:text-[11px] font-mono tracking-[0.35em] uppercase block mb-3">
            COLLECTION VOL. 01 — RUNWAY / STREET
          </span>

          {/* Carefully Scaled Display Typography that never overflows viewport boundaries */}
          <h1
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f5f5f5] tracking-tight leading-[0.92] mb-6 max-w-full"
            style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
          >
            BORN DIFFERENT.<br />
            STAY UNAPOLOGETIC.
          </h1>

          <p className="text-xs sm:text-sm text-[#aaa] font-light tracking-wide leading-relaxed mb-8 sm:mb-10 max-w-lg">
            A brand engineered for the ones who refuse to blend in. Custom cut-and-sew heavyweight silhouettes, drop-shoulder geometry, and raw luxury materials.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link href="/shop" className="btn-luxury-primary">
              EXPLORE DROP 01
            </Link>
            <Link href="/our-story" className="btn-luxury-outline">
              READ MANIFESTO
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
