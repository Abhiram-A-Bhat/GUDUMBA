import { getProductBySlug, getProducts } from "@/lib/data-service";
import ProductDetailClient from "./ProductDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found — GUDUMBA®" };

  return {
    title: `${product.name} — GUDUMBA®`,
    description: product.description || "Gudumba® premium streetwear piece.",
    ...(process.env.NEXT_PUBLIC_SITE_URL
      ? {
          openGraph: { images: [{ url: product.primary_image || "/brand/gudumba-logo.jpg" }] },
        }
      : {}),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  // Fetch related products
  const allProducts = await getProducts({ limit: 5 });
  const related = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      subtitle: p.subtitle,
      price: p.price,
      compare_at_price: p.compare_at_price,
      primary_image: p.primary_image,
      category_name: p.category_name,
      variants: p.variants.map((v) => ({
        id: v.id,
        size: v.size,
        inventory_count: v.inventory_count,
        color: v.color || null,
      })),
    }));

  const formattedProduct = {
    ...product,
    images: (product.images && product.images.length > 0)
      ? product.images.map((img) => ({ url: img.url, alt: img.alt || product.name }))
      : [{ url: product.primary_image, alt: product.name }],
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      inventory_count: v.inventory_count,
      color: v.color || null,
    })),
    related,
  };

  return <ProductDetailClient product={formattedProduct as any} />;
}
