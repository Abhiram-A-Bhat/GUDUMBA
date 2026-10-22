import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data-service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (e: any) {
    console.error("Product detail API error:", e);
    return NextResponse.json({ error: e.message || "Server error" }, { status: 500 });
  }
}
