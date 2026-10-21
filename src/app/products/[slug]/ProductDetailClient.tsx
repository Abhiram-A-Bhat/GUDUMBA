"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/Toaster";
import ProductCard from "@/components/ProductCard";
import type { ProductCardProps } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import CatalogPreviewNotice from "@/components/CatalogPreviewNotice";
import { ShoppingBag, Check, ShieldCheck, RefreshCw, Truck, Heart } from "lucide-react";

interface Variant {
  id: string;
  size: string;
  inventory_count: number;
}

interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductDetailProps {
  product: {
    id: string;
    slug: string;
    name: string;
    subtitle?: string;
    tagline?: string;
    description?: string;
    price: number;
    compare_at_price?: number;
    category_name?: string;
    category_slug?: string;
    details?: string[];
    images: ProductImage[];
    variants: Variant[];
    related: ProductCardProps["product"][];
  };
}

export default function ProductDetailClient({ product }: ProductDetailProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || "L");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  const activeImage = product.images[activeImgIndex] || product.images[0];
  const discountPct = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const chosenVariant = product.variants.find(v => v.size === selectedSize) || product.variants[0];

  const handleAddToCart = () => {
    dispatch({
      type: "ADD",
      item: {
        id: chosenVariant ? chosenVariant.id : `${product.id}-${selectedSize}`,
        productId: product.id,
        productSlug: product.slug,
        name: product.name,
        subtitle: product.subtitle || "Limited Drop",
        size: selectedSize,
        price: product.price,
        image: product.images[0]?.url || "/brand/brand_asset_3.jpeg",
        quantity: quantity,
      },
    });

    setIsAdded(true);
    toast(`Added ${quantity}x ${product.name} (${selectedSize}) to bag`, "success");
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#100f0d]">
      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-2 text-xs text-[#666] tracking-wider uppercase font-mono">
        <Link href="/" className="hover:text-[#f2f0ed]">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-[#f2f0ed]">Shop</Link>
        <span>/</span>
        <span className="text-[#f2f0ed]">{product.name}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6"><CatalogPreviewNotice /></div>

      {/* Main product area */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails strip */}
            {product.images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 shrink-0 scrollbar-none">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`relative w-20 h-24 shrink-0 rounded-xs overflow-hidden border-2 transition-all ${
                      activeImgIndex === i
                        ? "border-[#c8410a]"
                        : "border-[#222] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage */}
            <div className="relative aspect-[3/4] w-full bg-[#121212] rounded-xs overflow-hidden border border-[#222]">
              <Image
                src={activeImage.url}
                alt={activeImage.alt || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />

              {/* Tag badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-[#100f0d]/90 backdrop-blur-xs text-[#f2f0ed] text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-bold border border-[#333]">
                  {product.category_name || "Drop 01"}
                </span>
                {discountPct && (
                  <span className="bg-[#c8410a] text-white text-[10px] uppercase tracking-[0.14em] px-2.5 py-0.5 font-bold">
                    SAVE {discountPct}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Info & Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-[#c8410a] text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-2">
              {product.subtitle || "GUDUMBA® HEAVYWEIGHT"}
            </span>

            <h1 className="g-display text-4xl sm:text-5xl text-[#f2f0ed] leading-[0.95] mb-3">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-sm text-[#888] italic mb-6 font-serif">
                &quot;{product.tagline}&quot;
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4 py-4 border-y border-[#26231d] mb-6">
              <span className="text-3xl font-bold text-[#f2f0ed]">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-base text-[#666] line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
              <span className="text-xs text-[#888] font-mono uppercase">
                Tax and shipping details not confirmed
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-[#aaa] leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#f2f0ed]">
                  Select Cut / Size
                </span>
                <span className="text-xs text-[#888] underline cursor-pointer hover:text-white">
                  Size guide pending
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedSize(v.size)}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all ${
                      selectedSize === v.size
                        ? "border-[#c8410a] bg-[#c8410a] text-white"
                        : "border-[#2a2a2a] bg-[#121212] text-[#ccc] hover:border-[#555]"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center border border-[#2a2a2a] bg-[#121212] rounded-xs px-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-3 text-[#888] hover:text-white text-base"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-2 py-3 text-[#888] hover:text-white text-base"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className="flex-1 btn-primary text-xs tracking-[0.18em]"
              >
                {isAdded ? (
                  <>
                    <Check size={16} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Bag — {formatPrice(product.price * quantity)}
                  </>
                )}
              </button>

              <button
                onClick={() => setWishlist(!wishlist)}
                aria-label="Save to Wishlist"
                className={`p-3 border rounded-xs transition-colors ${
                  wishlist
                    ? "border-[#c8410a] bg-[#c8410a]/10 text-[#c8410a]"
                    : "border-[#2a2a2a] bg-[#121212] text-[#888] hover:text-white"
                }`}
              >
                <Heart size={18} fill={wishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-[#26231d] text-[11px] text-[#888] font-mono">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#c8410a] shrink-0" />
                <span>Shipping not confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw size={14} className="text-[#c8410a] shrink-0" />
                <span>Returns policy pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#c8410a] shrink-0" />
                <span>Details unverified</span>
              </div>
            </div>

            {/* Bullets / Details */}
            {product.details && product.details.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#26231d]">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-[#f2f0ed] mb-4">
                  Garment Specifications
                </h3>
                <ul className="space-y-2 text-xs text-[#888]">
                  {product.details.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#c8410a] mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Drops */}
        {product.related && product.related.length > 0 && (
          <div className="mt-28 pt-12 border-t border-[#26231d]">
            <h2 className="g-display text-3xl sm:text-5xl text-[#f2f0ed] mb-8">
              COMPLETE THE FIT
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
