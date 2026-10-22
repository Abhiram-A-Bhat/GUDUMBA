"use client";

import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { useWishlist } from "@/lib/wishlist-context";
import type { ProductItem } from "@/lib/data-service";

export default function WishlistClient({ products }: { products: ProductItem[] }) {
  const { ids, hydrated } = useWishlist();
  const savedProducts = products.filter((product) => ids.includes(product.id));

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#100f0d] pt-24">
      <main className="mx-auto w-full max-w-[1400px] px-6 pb-24">
        <header className="mb-10 border-b border-[#8d744f]/50 pb-6">
          <span className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[#b59a68]"><Heart size={13} /> YOUR SAVED PIECES</span>
          <h1 className="g-display text-5xl text-[#f2f0ed] sm:text-7xl">WISHLIST</h1>
          <p className="mt-3 font-mono text-xs text-[#89847a]">{hydrated ? `${savedProducts.length} ${savedProducts.length === 1 ? "piece" : "pieces"} saved` : "LOADING SAVED PIECES…"}</p>
        </header>

        {!hydrated ? null : savedProducts.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="border border-[#8d744f]/30 bg-[#141310] px-6 py-16 text-center sm:py-24">
            <Heart size={24} className="mx-auto mb-5 text-[#b59a68]" />
            <h2 className="g-display text-3xl text-[#f2f0ed] sm:text-4xl">NOTHING SAVED YET.</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#89847a]">Tap the heart on any piece to keep it close. Your wishlist stays saved on this device.</p>
            <Link href="/shop" className="btn-primary mt-7 inline-flex items-center gap-3 text-xs">Explore the archive <ArrowRight size={15} /></Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
