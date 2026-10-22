"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

export default function HeroSection() {
  const [muted, setMuted] = useState(true);

  return (
    <section className="relative overflow-hidden border-b border-[#8d744f]/60 bg-[#0b0a08] text-[#eee9df]">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[1.03fr_1fr_76px]">
        <div className="relative flex min-h-[500px] flex-col justify-center border-b border-[#8d744f]/50 px-6 py-16 sm:px-12 lg:min-h-[570px] lg:border-b-0 lg:border-r lg:py-14 xl:px-20">
          <div className="absolute left-6 top-7 h-9 w-9 border-l border-t border-[#b59a68]/80 sm:left-12" aria-hidden="true" />
          <div className="mb-6 flex items-center gap-3 font-mono text-[9px] tracking-[0.3em] text-[#b59a68] sm:text-[10px]">
            <span>COLLECTION VOL. 01</span><span className="h-px w-10 bg-[#b59a68]/70" /><span>RUNWAY / STREET</span>
          </div>
          <h1 className="max-w-[760px] font-display text-[clamp(3.55rem,8.2vw,7.25rem)] leading-[0.79] tracking-[-0.055em] text-[#f0ece4]">
            BORN<br />DIFFERENT.<br />STAY<br />UNAPOLOGETIC.
          </h1>
          <p className="mt-6 max-w-[460px] font-mono text-[9px] leading-[1.9] tracking-[0.2em] text-[#b5b0a8] sm:text-[10px]">
            A BRAND ENGINEERED FOR THE ONES WHO MOVE DIFFERENTLY. HEAVYWEIGHT SILHOUETTES, DROP-SHOULDER CUTS AND CONSIDERED MATERIALS.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <Link href="/shop" className="group inline-flex items-center gap-5 bg-[#b59a68] px-6 py-3.5 font-mono text-[10px] tracking-[0.22em] text-[#100e0a] transition-colors hover:bg-[#d0b47d]">
              SHOP THE DROP <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/our-story" className="border-b border-[#b59a68]/60 pb-2 font-mono text-[10px] tracking-[0.22em] text-[#e7e1d7] transition-colors hover:text-[#b59a68]">EXPLORE JOURNAL</Link>
          </div>
          <span className="absolute bottom-5 right-6 font-mono text-[9px] tracking-[0.24em] text-[#5e574d]">GDM / 001</span>
        </div>

        <div className="relative min-h-[440px] overflow-hidden bg-[#141310] lg:min-h-[570px]">
          <video src="/brand/campaign_hero.mp4" poster="/brand/brand_asset_3.jpeg" autoPlay loop muted={muted} playsInline preload="metadata" aria-label="GUDUMBA Collection 01 campaign film" className="absolute inset-0 h-full w-full object-cover object-center brightness-[0.76] contrast-[1.12]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a08]/20 via-transparent to-[#0b0a08]/25" />
          <div className="absolute left-0 top-0 hidden h-full items-center border-r border-[#b59a68]/50 px-2 [writing-mode:vertical-rl] lg:flex">
            <span className="rotate-180 font-mono text-[8px] tracking-[0.35em] text-[#d4b77e]">GUDUMBA &nbsp; / &nbsp; VOL. 01 &nbsp; / &nbsp; STREET</span>
          </div>
          <div className="absolute left-5 top-5 border border-[#b59a68]/70 px-2.5 py-1 font-mono text-[10px] tracking-widest text-[#d5b579] lg:hidden">01 / CAMPAIGN</div>
          <button onClick={() => setMuted(!muted)} className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 border border-white/40 bg-black/50 px-3 py-2 font-mono text-[9px] tracking-[0.16em] text-white backdrop-blur-sm transition hover:border-[#d5b579]" aria-label={muted ? "Enable campaign soundtrack" : "Mute campaign soundtrack"}>
            {muted ? <VolumeX size={13} /> : <Volume2 size={13} className="text-[#d5b579]" />}<span>{muted ? "SOUND OFF" : "SOUND ON"}</span>
          </button>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#b59a68]/80" />
        </div>

        <aside className="hidden flex-col items-center justify-between border-l border-[#8d744f]/50 py-7 lg:flex">
          <span className="bg-[#b7482c] px-2 py-1 font-mono text-lg leading-none tracking-wider text-[#130d09]">01</span>
          <span className="[writing-mode:vertical-rl] font-mono text-[8px] leading-[1.8] tracking-[0.3em] text-[#c4bdb1]">GUDUMBA COLLECTION VOL. 01 — RUNWAY / STREET</span>
          <span className="font-display text-3xl text-[#b59a68]">G</span>
        </aside>
      </div>
    </section>
  );
}
