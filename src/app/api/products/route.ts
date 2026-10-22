import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/data-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";
    const q = searchParams.get("q") || undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 100);

    const products = await getProducts({
      category,
      featuredOnly: featured,
      q,
      limit,
    });

    return NextResponse.json({ products });
  } catch (e: any) {
    console.error("Products API error:", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
