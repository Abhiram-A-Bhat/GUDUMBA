"use client";
import React, { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export interface ProductVariant {
  id: string;
  size: string;
  inventory_count: number;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  tagline?: string;
  price: number;
  compare_at_price?: number;
  primary_image?: string;
  hover_image?: string;
  category_name?: string;
  category_slug?: string;
  variants?: ProductVariant[];
}

export default function FeaturedProducts({ products }: { products: ProductSummary[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredProducts = activeTab === "all"
    ? products
    : products.filter(p => p.category_slug === activeTab);

  return (
    <section className="py-28 px-6 sm:px-12 max-w-[1600px] mx-auto" id="collection">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#151515] gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#666] block mb-3">
            GUDUMBA / FIRST RELEASE
          </span>
          <h2
            className="font-display text-4xl sm:text-6xl text-[#f5f5f5]"
          >
            THE COLLECTION
          </h2>
        </div>

        {/* Minimalist Filter Text Links (Represent style) */}
        <div className="flex items-center gap-6 text-[11px] font-mono tracking-[0.2em] uppercase">
          <button
            onClick={() => setActiveTab("all")}
            className={`transition-colors ${
              activeTab === "all" ? "text-white border-b border-white pb-0.5" : "text-[#555] hover:text-[#999]"
            }`}
          >
            All [{products.length}]
          </button>
          <button
            onClick={() => setActiveTab("tees")}
            className={`transition-colors ${
              activeTab === "tees" ? "text-white border-b border-white pb-0.5" : "text-[#555] hover:text-[#999]"
            }`}
          >
            Tees
          </button>
          <button
            onClick={() => setActiveTab("hoodies")}
            className={`transition-colors ${
              activeTab === "hoodies" ? "text-white border-b border-white pb-0.5" : "text-[#555] hover:text-[#999]"
            }`}
          >
            Hoodies
          </button>
          <button
            onClick={() => setActiveTab("drop-01-chaos")}
            className={`transition-colors ${
              activeTab === "drop-01-chaos" ? "text-white border-b border-white pb-0.5" : "text-[#555] hover:text-[#999]"
            }`}
          >
            Outerwear
          </button>
        </div>
      </div>

      {/* Spacious 4-Column Grid with Generous Gutter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Understated View All Link */}
      <div className="mt-20 text-center">
        <Link href="/shop" className="btn-luxury-outline">
          VIEW FULL ARCHIVE
        </Link>
      </div>
    </section>
  );
}
