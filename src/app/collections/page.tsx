import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getCategories } from "@/lib/data-service";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections & Drops — GUDUMBA®",
  description: "Explore curated Gudumba® streetwear drops. Limited runs, oversized silhouettes, raw graphic statements.",
};

const CATEGORY_IMAGES: Record<string, string> = {
  tees: "/brand/brand_asset_3.jpeg",
  hoodies: "/brand/brand_asset_5.jpeg",
  bottoms: "/brand/brand_asset_4.jpeg",
  "drop-01-chaos": "/brand/brand_asset_0.jpeg",
};

export default async function CollectionsPage() {
  const categories = await getCategories();

  return (
    <div className="pt-24 min-h-screen bg-[#100f0d] flex flex-col justify-between">
      <div className="max-w-[1400px] mx-auto px-6 py-8 w-full">
        <div className="mb-16 border-b border-[#23201a] pb-8">
          <span className="text-[#b59a68] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
            Archive Chapters
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="g-display text-5xl md:text-8xl text-[#f2f0ed]">
              COLLECTIONS
            </h1>
            <p className="text-sm text-[#777] max-w-sm">
              Curated drops engineered for those who refuse to blend in. Limited batch cut-and-sew releases.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((col) => (
            <Link
              key={col.id}
              href={`/shop?category=${col.slug}`}
              className="group relative h-[480px] rounded-xs overflow-hidden border border-[#23201a] bg-[#141310] flex flex-col justify-end p-8"
            >
              <Image
                src={col.image_url || CATEGORY_IMAGES[col.slug] || "/brand/brand_asset_3.jpeg"}
                alt={col.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              <div className="relative z-20">
                <span className="text-[#b59a68] text-xs font-mono uppercase tracking-widest block font-bold mb-1">
                  CHAPTER DROP
                </span>
                <h2 className="g-display text-3xl text-white mb-2 group-hover:text-[#b59a68] transition-colors">
                  {col.name}
                </h2>
                <p className="text-xs text-[#aaa] line-clamp-2 mb-4 font-light">
                  {col.description || "Limited edition heavyweight streetwear tailored for effortless drape."}
                </p>
                <span className="text-xs text-white font-mono uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Drop →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
