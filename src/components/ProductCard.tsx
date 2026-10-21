"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/Toaster";

export interface ProductCardProps {
  product: {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const variants = product.variants || [];
  const [isHovered, setIsHovered] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    const chosen = variants.find((v) => v.size === size) || variants[0];

    dispatch({
      type: "ADD",
      item: {
        id: chosen ? chosen.id : `${product.id}-${size}`,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        subtitle: product.subtitle || "Limited Drop",
        size: size,
        price: product.price,
        image: product.primary_image || "/brand/brand_asset_3.jpeg",
        quantity: 1,
      },
    });

    toast(`Added ${product.name} (Size: ${size}) to Bag`, "success");
  };

  return (
    <div
      className="group relative flex flex-col bg-[#050505] transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Editorial Visual Ratio (Represent 3:4 Aspect) */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#0d0d0d] block">
        {/* Primary Image */}
        <Image
          src={product.primary_image || "/brand/brand_asset_3.jpeg"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-all duration-700 ${
            isHovered && product.hover_image ? "opacity-0 scale-102" : "opacity-100 scale-100"
          }`}
        />

        {/* Second Angle Lookbook Image */}
        {product.hover_image && (
          <Image
            src={product.hover_image}
            alt={`${product.name} secondary view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-700 absolute inset-0 ${
              isHovered ? "opacity-100 scale-102" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Clean Luxury Hover Size Strip (Appears gracefully on desktop hover) */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 transition-all duration-300 flex flex-col gap-1.5 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0 pointer-events-none"
          }`}
        >
          <span className="text-[9px] font-mono tracking-widest text-[#888] uppercase text-center">
            Quick Add Size
          </span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => handleQuickAdd(e, v.size)}
                className="w-8 h-8 bg-black/80 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase border border-[#2a2a2a] transition-all flex items-center justify-center"
              >
                {v.size}
              </button>
            ))}
          </div>
        </div>
      </Link>

      {/* Product Meta Typography (Spacious, Understated Luxury) */}
      <div className="pt-4 flex flex-col gap-1">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#555] uppercase">
          {product.category_name || "COLLECTION 01"}
        </span>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-xs font-semibold text-[#e5e5e5] group-hover:text-white transition-colors tracking-wide">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-xs font-mono font-medium text-[#f5f5f5]">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && (
            <span className="text-[11px] font-mono text-[#555] line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
