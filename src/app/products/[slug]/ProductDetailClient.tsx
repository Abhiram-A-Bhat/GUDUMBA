"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/components/ui/Toaster";
import ProductCard from "@/components/ProductCard";
import type { ProductCardProps } from "@/components/ProductCard";
import Footer from "@/components/Footer";
import CatalogPreviewNotice from "@/components/CatalogPreviewNotice";
import { ShoppingBag, Check, ShieldCheck, RefreshCw, Truck, Heart, X, ChevronLeft, ChevronRight, Ruler } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";

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
  const { hasSaved, toggle, recent, trackViewed } = useWishlist();

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.variants.find((variant) => variant.inventory_count > 0)?.size || product.variants[0]?.size || "L");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const wishlist = hasSaved(product.id);

  const activeImage = product.images[activeImgIndex] || product.images[0];
  const discountPct = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null;

  const chosenVariant = product.variants.find(v => v.size === selectedSize);
  const canAdd = !!chosenVariant && chosenVariant.inventory_count > 0;

  useEffect(() => {
    trackViewed({
      id: product.id, slug: product.slug, name: product.name, subtitle: product.subtitle,
      price: product.price, compare_at_price: product.compare_at_price,
      primary_image: product.images[0]?.url, category_name: product.category_name,
      category_slug: product.category_slug, variants: product.variants,
    });
  }, [product, trackViewed]);

  useEffect(() => {
    if (!lightboxOpen && !sizeGuideOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxOpen(false);
        setSizeGuideOpen(false);
      }
      if (lightboxOpen && event.key === "ArrowRight") setActiveImgIndex((index) => (index + 1) % product.images.length);
      if (lightboxOpen && event.key === "ArrowLeft") setActiveImgIndex((index) => (index - 1 + product.images.length) % product.images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, sizeGuideOpen, product.images.length]);

  const handleAddToCart = () => {
    if (!canAdd || !chosenVariant) {
      toast("Choose an available size to continue", "error");
      return;
    }
    dispatch({
      type: "ADD",
      item: {
        id: chosenVariant.id,
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
                        ? "border-[#b59a68]"
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
              <button type="button" onClick={() => setLightboxOpen(true)} aria-label="Open product image viewer" className="absolute inset-0 z-[1] cursor-zoom-in" />
              <span className="absolute bottom-3 right-3 z-10 border border-white/35 bg-black/55 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-white">View details</span>

              {/* Tag badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-[#100f0d]/90 backdrop-blur-xs text-[#f2f0ed] text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-bold border border-[#333]">
                  {product.category_name || "Drop 01"}
                </span>
                {discountPct && (
                  <span className="bg-[#b59a68] text-white text-[10px] uppercase tracking-[0.14em] px-2.5 py-0.5 font-bold">
                    SAVE {discountPct}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Info & Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span className="text-[#b59a68] text-xs font-mono uppercase tracking-[0.25em] font-semibold mb-2">
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
                <button type="button" onClick={() => setSizeGuideOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-[#b59a68] underline underline-offset-4 hover:text-white"><Ruler size={13} /> Size guide</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedSize(v.size)}
                    disabled={v.inventory_count <= 0}
                    aria-pressed={selectedSize === v.size}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xs border transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
                      selectedSize === v.size
                        ? "border-[#b59a68] bg-[#b59a68] text-white"
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
                disabled={isAdded || !canAdd}
                className="flex-1 btn-primary text-xs tracking-[0.18em]"
              >
                {!canAdd ? (
                  "Currently unavailable"
                ) : isAdded ? (
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
                onClick={() => toggle({ id: product.id, slug: product.slug, name: product.name, price: product.price, compare_at_price: product.compare_at_price, primary_image: product.images[0]?.url, category_name: product.category_name, category_slug: product.category_slug, subtitle: product.subtitle, variants: product.variants })}
                aria-label={wishlist ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={wishlist}
                className={`p-3 border rounded-xs transition-colors ${
                  wishlist
                    ? "border-[#b59a68] bg-[#b59a68]/10 text-[#b59a68]"
                    : "border-[#2a2a2a] bg-[#121212] text-[#888] hover:text-white"
                }`}
              >
                <Heart size={18} fill={wishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-[#26231d] text-[11px] text-[#888] font-mono">
              <div className="flex items-center gap-1.5">
                <Truck size={14} className="text-[#b59a68] shrink-0" />
                <span>Shipping not confirmed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw size={14} className="text-[#b59a68] shrink-0" />
                <span>Returns policy pending</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#b59a68] shrink-0" />
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
                      <span className="text-[#b59a68] mt-0.5">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {recent.filter((item) => item.id !== product.id).length > 0 && (
          <section className="mt-20 border-t border-[#26231d] pt-10" aria-labelledby="recently-viewed-title">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div><span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#b59a68]">YOUR TRAIL</span><h2 id="recently-viewed-title" className="g-display mt-1 text-3xl text-[#f2f0ed] sm:text-4xl">RECENTLY VIEWED</h2></div>
              <span className="font-mono text-[9px] text-[#6f6a60]">SAVED ON THIS DEVICE</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
              {recent.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </section>
        )}

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

      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) setSizeGuideOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="size-guide-title" className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-[#8d744f]/60 bg-[#100f0d] p-6 sm:p-8">
            <button type="button" onClick={() => setSizeGuideOpen(false)} aria-label="Close size guide" className="absolute right-4 top-4 p-2 text-[#aaa] hover:text-white"><X size={18} /></button>
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#b59a68]">FIT REFERENCE / CM</span>
            <h2 id="size-guide-title" className="g-display mt-2 text-4xl text-[#f2f0ed]">FIND YOUR CUT</h2>
            <p className="mt-3 max-w-lg text-xs leading-relaxed text-[#928d82]">Use your body chest measurement as a starting point. This is a general fit reference; garment measurements can vary by style. If you prefer a roomier fit, consider sizing up.</p>
            <div className="mt-6 overflow-x-auto border-y border-[#38342c]">
              <table className="w-full min-w-[360px] text-left font-mono text-xs">
                <thead><tr className="text-[9px] uppercase tracking-widest text-[#b59a68]"><th className="py-3 pr-4">Size</th><th className="py-3 pr-4">Chest</th><th className="py-3">Fit note</th></tr></thead>
                <tbody className="divide-y divide-[#26231d] text-[#d6d0c5]">
                  {[["S", "91–97", "Regular"], ["M", "97–102", "Relaxed"], ["L", "102–107", "Roomy"], ["XL", "107–112", "Oversized"], ["XXL", "112–117", "Extra roomy"]].map(([size, chest, fit]) => <tr key={size}><th scope="row" className="py-3 pr-4 font-semibold">{size}</th><td className="py-3 pr-4">{chest} cm</td><td className="py-3 text-[#928d82]">{fit}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="mt-4 font-mono text-[9px] leading-relaxed text-[#68645c]">MEASURE AROUND THE FULLEST PART OF YOUR CHEST. WHEN BETWEEN SIZES, CHOOSE THE LARGER SIZE FOR A ROOMIER SILHOUETTE.</p>
          </section>
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#080807]/95 p-4 backdrop-blur-md sm:p-8" role="dialog" aria-modal="true" aria-label={`${product.name} image viewer`}>
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <span className="max-w-[75%] truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[#d6d0c5]">{product.name} &nbsp; / &nbsp; {activeImgIndex + 1} OF {product.images.length}</span>
            <button type="button" onClick={() => setLightboxOpen(false)} aria-label="Close image viewer" className="p-2 text-white hover:text-[#d4bd8b]"><X size={21} /></button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center py-5">
            <Image src={activeImage.url} alt={activeImage.alt || product.name} fill sizes="100vw" priority className="object-contain" />
            {product.images.length > 1 && <>
              <button type="button" onClick={() => setActiveImgIndex((index) => (index - 1 + product.images.length) % product.images.length)} aria-label="Previous product image" className="absolute left-0 z-10 grid h-12 w-12 place-items-center border border-white/20 bg-black/50 text-white hover:border-[#b59a68]"><ChevronLeft /></button>
              <button type="button" onClick={() => setActiveImgIndex((index) => (index + 1) % product.images.length)} aria-label="Next product image" className="absolute right-0 z-10 grid h-12 w-12 place-items-center border border-white/20 bg-black/50 text-white hover:border-[#b59a68]"><ChevronRight /></button>
            </>}
          </div>
          {product.images.length > 1 && <div className="flex justify-center gap-2 overflow-x-auto border-t border-white/15 pt-3">{product.images.map((image, index) => <button key={`${image.url}-${index}`} type="button" onClick={() => setActiveImgIndex(index)} aria-label={`View image ${index + 1}`} aria-current={activeImgIndex === index} className={`relative h-14 w-12 shrink-0 overflow-hidden border ${activeImgIndex === index ? "border-[#b59a68]" : "border-white/20 opacity-60"}`}><Image src={image.url} alt="" fill sizes="48px" className="object-cover" /></button>)}</div>}
        </div>
      )}

      <Footer />
    </div>
  );
}
