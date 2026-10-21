"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { Search, X } from "lucide-react";
import CatalogPreviewNotice from "@/components/CatalogPreviewNotice";

interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

interface Product {
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
  variants?: { id: string; size: string; inventory_count: number }[];
}

export default function ShopClient({
  initialProducts,
  categories,
  currentCategory,
  currentSort,
  searchQuery,
}: {
  initialProducts: Product[];
  categories: Category[];
  currentCategory: string;
  currentSort: string;
  searchQuery: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);

  const updateFilters = (cat: string, srt: string, q: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.set("category", cat);
    if (srt && srt !== "featured") params.set("sort", srt);
    if (q) params.set("q", q);
    router.push(`/shop?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters(currentCategory, currentSort, search);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#050505] flex flex-col justify-between">
      <div className="max-w-[1400px] mx-auto px-6 w-full pb-24">
        {/* Header */}
        <div className="mb-12 border-b border-[#222] pb-8">
          <span className="text-[#c8410a] text-xs uppercase tracking-[0.25em] font-semibold block mb-2">
            The Complete Archive
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="g-display text-5xl md:text-8xl text-[#f2f0ed]">
              THE SHOP
            </h1>
            <p className="text-sm text-[#777] max-w-sm">
              Engineered luxury streetwear with attitude. Pure attitude, no repeats, no compromises.
            </p>
          </div>
        </div>

        <div className="mb-8"><CatalogPreviewNotice /></div>

        {/* Controls: Search, Categories, Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => updateFilters("all", currentSort, search)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] rounded-xs transition-colors whitespace-nowrap ${
                currentCategory === "all"
                  ? "bg-[#c8410a] text-white"
                  : "bg-[#121212] text-[#888] hover:text-[#f2f0ed] border border-[#222]"
              }`}
            >
              All Drops ({initialProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilters(cat.slug, currentSort, search)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] rounded-xs transition-colors whitespace-nowrap ${
                  currentCategory === cat.slug
                    ? "bg-[#c8410a] text-white"
                    : "bg-[#121212] text-[#888] hover:text-[#f2f0ed] border border-[#222]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right: Search & Sort */}
          <div className="flex items-center gap-4">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH ARCHIVE..."
                className="w-full bg-[#121212] border border-[#262626] focus:border-[#c8410a] text-[#f2f0ed] px-3 py-2 text-xs uppercase tracking-wider rounded-xs outline-none pl-8"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666]" />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    updateFilters(currentCategory, currentSort, "");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#f2f0ed]"
                >
                  <X size={12} />
                </button>
              )}
            </form>

            {/* Sort Select */}
            <select
              value={currentSort}
              onChange={(e) => updateFilters(currentCategory, e.target.value, search)}
              aria-label="Sort products by"
              className="bg-[#121212] border border-[#262626] text-[#888] hover:text-[#f2f0ed] focus:border-[#c8410a] text-xs uppercase tracking-wider px-3 py-2 rounded-xs outline-none cursor-pointer"
            >
              <option value="featured">Featured Drops</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {initialProducts.length === 0 ? (
          <div className="py-24 text-center border border-[#1a1a1a] bg-[#0c0c0c] rounded-xs">
            <p className="text-[#888] text-sm mb-4">
              No garments found matching your filter criteria.
            </p>
            <button
              onClick={() => updateFilters("all", "featured", "")}
              className="btn-ghost text-xs"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {initialProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
