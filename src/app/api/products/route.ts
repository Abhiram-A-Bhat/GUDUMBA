import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 100);

    let query = `
      SELECT p.*,
        c.name as category_name, c.slug as category_slug,
        (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as primary_image,
        (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1 OFFSET 1) as hover_image
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.is_archived = 0
    `;
    const params: (string | number)[] = [];

    if (category) { query += " AND c.slug = ?"; params.push(category); }
    if (featured === "true") { query += " AND p.is_featured = 1"; }
    if (q) { query += " AND (p.name LIKE ? OR p.description LIKE ?)"; params.push(`%${q}%`, `%${q}%`); }

    query += " ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ?";
    params.push(limit);

    const products = db.prepare(query).all(...params) as Record<string, unknown>[];

    // Attach variants per product
    const withVariants = products.map((p) => {
      const variants = db.prepare(
        "SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'XS' THEN 1 WHEN 'S' THEN 2 WHEN 'M' THEN 3 WHEN 'L' THEN 4 WHEN 'XL' THEN 5 WHEN 'XXL' THEN 6 ELSE 7 END"
      ).all(p.id);
      return { ...p, variants, details: p.details ? JSON.parse(p.details as string) : [] };
    });

    return NextResponse.json({ products: withVariants });
  } catch (e) {
    console.error("Products API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
