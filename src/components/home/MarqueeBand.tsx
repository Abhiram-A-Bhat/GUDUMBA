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
    <div className="bg-[#171613] border-y border-[#302d27] py-4 overflow-hidden relative select-none">
      <div className="luxury-marquee flex items-center gap-12 font-mono text-[10px] tracking-[0.35em] text-[#555] uppercase">
        {[...words, ...words].map((w, i) => (
          <span key={i} className="flex items-center gap-12 shrink-0 hover:text-[#999] transition-colors">
            <span>{w}</span>
            <span className="text-[#333]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
