import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LookbookItem {
  image: string;
  title: string;
  subtitle: string;
  category: string;
}

const items: LookbookItem[] = [
  {
    image: "/stock/lookbook_1.jpg",
    title: "THE MONOCHROME STANCE",
    subtitle: "500 GSM Loopback Fleece & Oversized Twill",
    category: "Campaign Look 01",
  },
  {
    image: "/stock/lookbook_2.jpg",
    title: "TACTICAL NOIR & CARGO",
    subtitle: "Japanese 340 GSM 3D Gusset Construction",
    category: "Campaign Look 02",
  },
  {
    image: "/stock/lookbook_3.jpg",
    title: "VINTAGE MINERAL ARCHIVE",
    subtitle: "Enzyme Acid Wash 300 GSM Heavy Cotton",
    category: "Campaign Look 03",
  },
];

export default function ScrollCampaign() {
  return (
    <section className="py-32 px-6 sm:px-12 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 pb-6 border-b border-[#23201a] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#666] block mb-3">
            EDITORIAL LOOKBOOK // VOL. 01
          </span>
          <h2
            className="font-display text-4xl sm:text-6xl text-[#f5f5f5]"
            style={{ fontFamily: "var(--font-bebas), impact, sans-serif" }}
          >
            THE EDITORIAL
          </h2>
        </div>
        <span className="text-[11px] font-mono tracking-widest text-[#555] uppercase">
          STYLING ARCHIVE 2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <Link
            key={idx}
            href="/shop"
            className="group relative flex flex-col bg-[#080808] border border-[#23201a] overflow-hidden"
          >
            {/* Aspect Ratio 4:5 Large Campaign Picture */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0d0d0d]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-103 filter brightness-[0.9] contrast-[1.05]"
              />
            </div>

            <div className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#666] tracking-[0.25em] uppercase block mb-1">
                  {item.category}
                </span>
                <h3
                  className="font-display text-2xl text-[#f5f5f5] group-hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {item.title}
                </h3>
              </div>
              <span className="text-xs text-[#888] font-mono mt-3">
                {item.subtitle}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
