import type { Metadata } from "next";
import { getProducts } from "@/lib/data-service";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Your Wishlist — GUDUMBA®",
  description: "Return to the GUDUMBA pieces you have saved.",
};

export default async function WishlistPage() {
  const products = await getProducts({ limit: 100 });
  return <WishlistClient products={products} />;
}
