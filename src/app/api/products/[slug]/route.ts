import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = db.prepare(`
      SELECT p.*,
        c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ? AND p.is_archived = 0
    `).get(slug) as Record<string, unknown> | undefined;

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const images = db.prepare(
      "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order"
    ).all(product.id);

    const variants = db.prepare(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'XS' THEN 1 WHEN 'S' THEN 2 WHEN 'M' THEN 3 WHEN 'L' THEN 4 WHEN 'XL' THEN 5 WHEN 'XXL' THEN 6 ELSE 7 END"
    ).all(product.id);

    return NextResponse.json({
      product: {
        ...product,
        images,
        variants,
        details: product.details ? JSON.parse(product.details as string) : [],
      },
    });
  } catch (e) {
    console.error("Product detail API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
