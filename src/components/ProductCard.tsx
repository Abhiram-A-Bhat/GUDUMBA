"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/Toaster";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

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
  const { hasSaved, toggle } = useWishlist();
  const variants = product.variants || [];
  const [isHovered, setIsHovered] = useState(false);
  const isSaved = hasSaved(product.id);

  const handleWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(product);
    toast(isSaved ? "Removed from wishlist" : "Saved to wishlist", "success");
  };

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    const chosen = variants.find((v) => v.size === size);
    if (!chosen || chosen.inventory_count <= 0) return;

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
      className="group relative flex flex-col bg-transparent transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Editorial Visual Ratio (Represent 3:4 Aspect) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#151411]">
       <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} className="absolute inset-0 block">
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

       </Link>
        <button type="button" onClick={handleWishlist} aria-pressed={isSaved} aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`} className="absolute right-3 top-3 z-30 grid h-9 w-9 place-items-center border border-white/40 bg-black/55 text-white backdrop-blur-sm transition hover:border-[#b59a68] hover:text-[#d4bd8b]">
          <Heart size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-[#d4bd8b]" : ""} />
        </button>
        {variants.length > 0 && <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 transition-all duration-300 flex flex-col gap-1.5 sm:translate-y-2 sm:opacity-0 sm:pointer-events-none sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-hover:pointer-events-auto sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-focus-within:pointer-events-auto">
          <span className="text-[9px] font-mono tracking-widest text-[#aaa] uppercase text-center">Quick add size</span>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {variants.map((v) => <button key={v.id} type="button" disabled={v.inventory_count <= 0} aria-label={`Add ${product.name}, size ${v.size}${v.inventory_count <= 0 ? ", sold out" : ""}`} onClick={(e) => handleQuickAdd(e, v.size)} className="min-w-9 h-9 px-2 bg-black/80 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase border border-[#555] transition-all disabled:opacity-40 disabled:cursor-not-allowed">{v.size}</button>)}
          </div>
        </div>}
      </div>

      {/* Product Meta Typography (Spacious, Understated Luxury) */}
      <div className="mt-2 flex flex-col gap-1 border-t border-[#8d744f]/55 pt-2.5">
        <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8f8065]">
          {product.category_name || "COLLECTION 01"}
        </span>

        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#e5e0d7] transition-colors group-hover:text-white sm:text-[11px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="font-mono text-[10px] font-medium text-[#c5a970]">
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
