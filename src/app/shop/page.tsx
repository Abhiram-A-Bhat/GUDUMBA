import db from "@/lib/db";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";
import type { ProductCardProps } from "@/components/ProductCard";

type ShopProduct = Omit<ProductCardProps["product"], "variants"> & { details: string | null };
interface Category { id: string; slug: string; name: string; description?: string | null; image_url?: string | null }

export const metadata: Metadata = {
  title: "Shop All Collections — GUDUMBA®",
  description: "Browse the full Gudumba® catalog. Heavyweight tees, oversized drop hoodies, and runway streetwear engineered for men who walk their own path.",
};

async function getProducts(searchParams: { category?: string; q?: string; sort?: string }) {
  let query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as primary_image,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1 OFFSET 1) as hover_image
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_archived = 0
  `;
  const params: (string | number)[] = [];

  if (searchParams.category && searchParams.category !== "all") {
    query += " AND c.slug = ?";
    params.push(searchParams.category);
  }

  if (searchParams.q) {
    query += " AND (p.name LIKE ? OR p.description LIKE ? OR p.tagline LIKE ?)";
    params.push(`%${searchParams.q}%`, `%${searchParams.q}%`, `%${searchParams.q}%`);
  }

  // Sorting
  switch (searchParams.sort) {
    case "price_asc":
      query += " ORDER BY p.price ASC";
      break;
    case "price_desc":
      query += " ORDER BY p.price DESC";
      break;
    case "newest":
      query += " ORDER BY p.created_at DESC";
      break;
    default:
      query += " ORDER BY p.is_featured DESC, p.created_at DESC";
  }

  const products = db.prepare(query).all(...params) as (ShopProduct & { details: string | null })[];

  return products.map(p => ({
    ...p,
    details: p.details ? JSON.parse(p.details) : [],
    variants: db.prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 WHEN 'XXL' THEN 5 ELSE 6 END").all(p.id) as NonNullable<ProductCardProps["product"]["variants"]>
  }));
}

async function getCategories() {
  return db.prepare("SELECT * FROM categories ORDER BY name").all() as Category[];
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <ShopClient
      initialProducts={products}
      categories={categories}
      currentCategory={params.category || "all"}
      currentSort={params.sort || "featured"}
      searchQuery={params.q || ""}
    />
  );
}
