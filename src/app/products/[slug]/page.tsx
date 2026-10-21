import db from "@/lib/db";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ProductDetailProps } from "./ProductDetailClient";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  subtitle: string | null;
  tagline: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_name: string | null;
  category_slug: string | null;
  details: string | null;
}
interface ImageRow { url: string; alt: string | null }
interface VariantRow { id: string; size: string; inventory_count: number; color: string | null }
type RelatedProduct = ProductDetailProps["product"]["related"][number] & { details?: string | null };

async function getProduct(slug: string) {
  const product = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = ? AND p.is_archived = 0
  `).get(slug) as ProductRow | undefined;

  if (!product) return null;

  const images = db.prepare(
    "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC"
  ).all(product.id) as ImageRow[];

  const variants = db.prepare(
    "SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 WHEN 'XXL' THEN 5 ELSE 6 END"
  ).all(product.id) as VariantRow[];

  // Related products
  const related = db.prepare(`
    SELECT p.*, c.name as category_name,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id != ? AND p.is_archived = 0
    LIMIT 4
  `).all(product.id) as RelatedProduct[];

  return {
    ...product,
    details: product.details ? JSON.parse(product.details) : [],
    subtitle: product.subtitle ?? undefined,
    tagline: product.tagline ?? undefined,
    description: product.description ?? undefined,
    compare_at_price: product.compare_at_price ?? undefined,
    category_name: product.category_name ?? undefined,
    category_slug: product.category_slug ?? undefined,
    images: images.length > 0 ? images.map((image) => ({ ...image, alt: image.alt ?? undefined })) : [{ url: "/brand/brand_asset_3.jpeg", alt: product.name }],
    variants,
    related: related.map(r => ({
      ...r,
      variants: db.prepare("SELECT * FROM product_variants WHERE product_id = ?").all(r.id) as VariantRow[]
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — GUDUMBA®`,
    description: product.description || "Gudumba® premium streetwear piece.",
    ...(process.env.NEXT_PUBLIC_SITE_URL ? {
      openGraph: { images: [{ url: product.images[0]?.url || "/brand/gudumba-logo.jpg" }] },
    } : {}),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
