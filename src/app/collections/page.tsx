import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import db from "@/lib/db";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections & Drops — GUDUMBA®",
  description: "Explore curated Gudumba® streetwear drops. Limited runs, oversized silhouettes, raw graphic statements.",
};

async function getCategoriesWithCounts() {
  const cats = db.prepare(`
    SELECT c.*, COUNT(p.id) as product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_archived = 0
    GROUP BY c.id
  `).all() as { id: string; slug: string; name: string; image_url: string | null; description: string | null; product_count: number }[];
  return cats;
}

export default async function CollectionsPage() {
  const collections = await getCategoriesWithCounts();

  return (
    <div className="pt-24 min-h-screen bg-[#100f0d] flex flex-col justify-between">
      <div className="max-w-[1400px] mx-auto px-6 py-8 w-full">
        <div className="mb-16 border-b border-[#222] pb-8">
          <span className="text-[#c8410a] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
            Archive Chapters
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="g-display text-5xl md:text-8xl text-[#f2f0ed]">
              COLLECTIONS
            </h1>
            <p className="text-sm text-[#777] max-w-sm">
              Preview collections. Product availability and production details are pending owner confirmation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/shop?category=${col.slug}`}
              className="group relative h-[520px] rounded-xs overflow-hidden border border-[#222] bg-[#141310] flex flex-col justify-end p-8"
            >
              <Image
                src={col.image_url || "/brand/brand_asset_3.jpeg"}
                alt={col.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              <div className="relative z-20">
                <span className="text-[#c8410a] text-xs font-mono uppercase tracking-widest block font-bold mb-1">
                  {col.product_count} Pieces
                </span>
                <h2
                  className="g-display text-3xl sm:text-4xl text-[#f2f0ed] mb-2 group-hover:text-[#c8410a] transition-colors"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {col.name}
                </h2>
                {col.description && (
                  <p className="text-xs text-[#aaa] line-clamp-2 mb-4 leading-relaxed">
                    {col.description}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#f2f0ed]">
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
