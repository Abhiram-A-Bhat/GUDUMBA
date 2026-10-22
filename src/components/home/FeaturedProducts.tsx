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
    <section className="mx-auto max-w-[1600px] px-6 py-20 sm:px-12 lg:py-24" id="collection">
      {/* Editorial Section Header */}
      <div className="mb-8 flex flex-col gap-6 border-b border-[#8d744f]/60 pb-5 md:mb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.3em] text-[#b59a68]">
            THE COLLECTION &nbsp; — &nbsp; VOL. 01
          </span>
          <h2 className="font-display text-4xl leading-none tracking-tight text-[#f0ece4] sm:text-5xl">
            VOL. 01 — RUNWAY / STREET
          </h2>
        </div>

        {/* Minimalist Filter Text Links (Represent style) */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[9px] uppercase tracking-[0.17em] sm:gap-x-6 sm:text-[10px]">
          <button
            onClick={() => setActiveTab("all")}
            className={`transition-colors ${
              activeTab === "all" ? "border-b border-[#b59a68] pb-1 text-[#d3b77e]" : "text-[#777168] hover:text-[#e3ded4]"
            }`}
          >
            All [{products.length}]
          </button>
          <button
            onClick={() => setActiveTab("tees")}
            className={`transition-colors ${
              activeTab === "tees" ? "border-b border-[#b59a68] pb-1 text-[#d3b77e]" : "text-[#777168] hover:text-[#e3ded4]"
            }`}
          >
            Tees
          </button>
          <button
            onClick={() => setActiveTab("hoodies")}
            className={`transition-colors ${
              activeTab === "hoodies" ? "border-b border-[#b59a68] pb-1 text-[#d3b77e]" : "text-[#777168] hover:text-[#e3ded4]"
            }`}
          >
            Hoodies
          </button>
          <button
            onClick={() => setActiveTab("drop-01-chaos")}
            className={`transition-colors ${
              activeTab === "drop-01-chaos" ? "border-b border-[#b59a68] pb-1 text-[#d3b77e]" : "text-[#777168] hover:text-[#e3ded4]"
            }`}
          >
            Outerwear
          </button>
        </div>
      </div>

      {/* Spacious 4-Column Grid with Generous Gutter */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-6">
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
