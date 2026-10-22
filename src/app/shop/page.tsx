import { getProducts, getCategories, ProductItem, CategoryItem } from "@/lib/data-service";
import ShopClient from "./ShopClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections — GUDUMBA®",
  description: "Browse the full Gudumba® catalog. Heavyweight tees, oversized drop hoodies, and runway streetwear engineered for men who walk their own path.",
};

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
      initialProducts={products as any}
      categories={categories}
      currentCategory={params.category || "all"}
      currentSort={params.sort || "featured"}
      searchQuery={params.q || ""}
    />
  );
}
