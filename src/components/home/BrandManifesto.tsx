import React from "react";
import Link from "next/link";

export default function BrandManifesto() {
  return (
    <section className="py-28 px-6 sm:px-12 bg-[#151411] border-y border-[#302d27] relative">
      <div className="max-w-[1200px] mx-auto text-center">
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#666] block mb-8">
          BRAND ETHOS & PHILOSOPHY
        </span>

        <h2
          className="font-display text-4xl sm:text-7xl md:text-8xl text-[#f0eee8] leading-[0.92] max-w-4xl mx-auto mb-10"
        >
          A MAN SHOULD NEVER HAVE TO CHANGE WHO HE IS TO FIT IN.
        </h2>

        <p className="text-sm sm:text-base text-[#888] font-light leading-relaxed max-w-2xl mx-auto mb-16">
          The world will always have an opinion. Too loud. Too bold. Too confident. Too different.
          We say — so what? Gudumba is designed for those who walk their own path, carry themselves with conviction, and dress to represent themselves.
        </p>

        {/* 3 Pillars Clean Horizontal Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-[#1a1a1a] text-left">
          <div>
            <span className="text-[11px] font-mono text-[#444] block mb-2">01 // CODE</span>
            <h3 className="font-display text-2xl text-white tracking-wider mb-3">
              NO VALIDATION.
            </h3>
            <p className="text-xs text-[#777] leading-relaxed">
              Never ask for permission to stand tall. Carry yourself with the respect and presence you know you command.
            </p>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#444] block mb-2">02 // SILHOUETTE</span>
            <h3 className="font-display text-2xl text-white tracking-wider mb-3">
              NO IMITATION.
            </h3>
            <p className="text-xs text-[#777] leading-relaxed">
              Original to the core. Relaxed silhouettes leave room for movement and a point of view of your own.
            </p>
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#444] block mb-2">03 // ATTITUDE</span>
            <h3 className="font-display text-2xl text-white tracking-wider mb-3">
              NO APOLOGIES.
            </h3>
            <p className="text-xs text-[#777] leading-relaxed">
              Never shrink yourself to make others comfortable. Stand tall. Take risks. Own your choices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
