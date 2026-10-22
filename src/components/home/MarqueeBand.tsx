import React from "react";

export default function MarqueeBand() {
  const words = [
    "BORN DIFFERENT",
    "STAY UNAPOLOGETIC",
    "NO VALIDATION",
    "NO IMITATION",
    "NO APOLOGIES",
    "GUDUMBA · COLLECTION 01",
    "DROP 01 ARCHIVE",
  ];

  return (
    <div className="relative select-none overflow-hidden border-y border-[#8d744f]/50 bg-[#0d0c0a] py-3.5">
      <div className="luxury-marquee flex items-center gap-12 font-mono text-[9px] uppercase tracking-[0.32em] text-[#b59a68]/80">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-12 shrink-0 hover:text-[#999] transition-colors">
            <span>{w}</span>
            <span className="text-[#5e5039]">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
