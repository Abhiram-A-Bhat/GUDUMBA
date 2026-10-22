import React from "react";
import { Star } from "lucide-react";

export default function SocialProofStripClassic() {
  const reviews = [
    {
      user: "VIKRAM R.",
      city: "MUMBAI",
      quote: "The 450 GSM hoodie holds its structured silhouette like Balenciaga. Zero droop at collar.",
      item: "Unapologetic Heavy Hoodie",
      rating: 5,
    },
    {
      user: "ARJUN K.",
      city: "HYDERABAD",
      quote: "Combed cotton quality is beyond Snitch or Zara. Thick fabric, true oversized drop-shoulder fit.",
      item: "Chaos & Character Tee",
      rating: 5,
    },
    {
      user: "SAMEER D.",
      city: "BANGALORE",
      quote: "Finally an Indian brand with genuine subculture character instead of cheap polyester prints.",
      item: "Runway Bomber Jacket",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#0a0a0a] border-b border-[#222]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#ff4800] text-xs font-mono font-bold tracking-[0.2em] uppercase block mb-1">
              STREET CREDIBILITY
            </span>
            <h2
              className="font-heading text-4xl sm:text-5xl text-white"
              style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
            >
              COMMUNITY TESTIMONIALS
            </h2>
          </div>
          <p className="text-xs text-[#888] font-mono">
            4.9/5 RATING ACROSS 1,200+ DELIVERED ORDERS
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 bg-[#121212] border border-[#222] rounded-xs flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#ff4800] mb-4">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={14} className="fill-[#ff4800]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#ccc] leading-relaxed mb-6 font-medium">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#26231d] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-white font-bold block">{r.user}</span>
                  <span className="text-[#666] text-[10px]">{r.city} • VERIFIED BUYER</span>
                </div>
                <span className="text-[10px] text-[#ff4800] font-bold uppercase tracking-wider">
                  {r.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
