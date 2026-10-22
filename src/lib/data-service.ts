import { getSupabase } from "@/lib/supabase";

export interface ProductVariant {
  id: string;
  size: string;
  color?: string;
  inventory_count: number;
  sku?: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  price: number;
  compare_at_price?: number;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  is_featured?: boolean | number;
  primary_image: string;
  hover_image?: string;
  images?: { id: string; url: string; alt?: string; display_order?: number }[];
  variants: ProductVariant[];
  details: string[];
}

export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
}

// Fallback products in case DB is unreachable
const STATIC_FALLBACK_PRODUCTS: ProductItem[] = [
  {
    id: "prod-01",
    slug: "gudumba-chaos-drop-tee-black",
    name: "GUDUMBA® Chaos & Character Heavyweight Tee",
    subtitle: "Limited Drop 01 • Midnight Noir",
    tagline: "A little chaos. A lot of character. Everyday streetwear.",
    description: "Engineered with 280 GSM premium French terry combed cotton. Signature Gudumba insignia emblazoned across spine.",
    price: 1899,
    compare_at_price: 2499,
    category_name: "Heavy Graphic Tees",
    category_slug: "tees",
    primary_image: "/brand/brand_asset_3.jpeg",
    hover_image: "/brand/brand_asset_8.jpeg",
    images: [{ id: "img-1", url: "/brand/brand_asset_3.jpeg" }, { id: "img-2", url: "/brand/brand_asset_8.jpeg" }],
    variants: [
      { id: "var-1-s", size: "S", inventory_count: 15 },
      { id: "var-1-m", size: "M", inventory_count: 25 },
      { id: "var-1-l", size: "L", inventory_count: 40 },
      { id: "var-1-xl", size: "XL", inventory_count: 20 },
    ],
    details: ["280 GSM 100% Combed Cotton", "Boxy oversized cut", "Pre-shrunk fabric"],
  },
  {
    id: "prod-02",
    slug: "gudumba-unapologetic-acid-wash-tee",
    name: "GUDUMBA® Unapologetic Acid Wash Oversized Tee",
    subtitle: "Distressed Series • Vintage Smoke",
    tagline: "No validation. No imitation. No apologies.",
    description: "Custom vintage mineral wash streetwear tee with distressed ribbing and signature typography.",
    price: 1999,
    compare_at_price: 2699,
    category_name: "Heavy Graphic Tees",
    category_slug: "tees",
    primary_image: "/brand/brand_asset_7.jpeg",
    hover_image: "/brand/brand_asset_1.jpeg",
    images: [{ id: "img-3", url: "/brand/brand_asset_7.jpeg" }, { id: "img-4", url: "/brand/brand_asset_1.jpeg" }],
    variants: [
      { id: "var-2-s", size: "S", inventory_count: 10 },
      { id: "var-2-m", size: "M", inventory_count: 30 },
      { id: "var-2-l", size: "L", inventory_count: 35 },
      { id: "var-2-xl", size: "XL", inventory_count: 15 },
    ],
    details: ["300 GSM Heavyweight Cotton", "Mineral Acid Wash finish", "Custom distressing"],
  },
  {
    id: "prod-03",
    slug: "gudumba-iconic-chaos-heavyweight-hoodie",
    name: "GUDUMBA® Chaos Heavyweight Boxy Hoodie",
    subtitle: "Heavy Fleece Drop • Obsidian Black",
    tagline: "Born different. Stay unapologetic.",
    description: "Ultra-heavyweight 450 GSM French Terry cotton hoodie with custom metal aglets and embroidered insignia.",
    price: 3899,
    compare_at_price: 4999,
    category_name: "Oversized Hoodies",
    category_slug: "hoodies",
    primary_image: "/brand/brand_asset_5.jpeg",
    hover_image: "/brand/brand_asset_6.jpeg",
    images: [{ id: "img-5", url: "/brand/brand_asset_5.jpeg" }, { id: "img-6", url: "/brand/brand_asset_6.jpeg" }],
    variants: [
      { id: "var-3-s", size: "S", inventory_count: 8 },
      { id: "var-3-m", size: "M", inventory_count: 20 },
      { id: "var-3-l", size: "L", inventory_count: 25 },
      { id: "var-3-xl", size: "XL", inventory_count: 12 },
    ],
    details: ["450 GSM Luxury French Terry", "Double-layered hood", "Seamless kangaroo pocket"],
  },
  {
    id: "prod-04",
    slug: "gudumba-phantom-tactical-cargo",
    name: "GUDUMBA® Tactical Parachute Cargos",
    subtitle: "Utilitarian Drop • Raw Charcoal",
    tagline: "Engineered for movement. Built for chaos.",
    description: "Heavyweight ripstop nylon tactical cargos with adjustable bungee cords and custom gunmetal hardware.",
    price: 3499,
    compare_at_price: 4299,
    category_name: "Tactical Cargos",
    category_slug: "bottoms",
    primary_image: "/brand/brand_asset_4.jpeg",
    hover_image: "/brand/brand_asset_2.jpeg",
    images: [{ id: "img-7", url: "/brand/brand_asset_4.jpeg" }, { id: "img-8", url: "/brand/brand_asset_2.jpeg" }],
    variants: [
      { id: "var-4-s", size: "S", inventory_count: 12 },
      { id: "var-4-m", size: "M", inventory_count: 18 },
      { id: "var-4-l", size: "L", inventory_count: 22 },
      { id: "var-4-xl", size: "XL", inventory_count: 14 },
    ],
    details: ["Durable ripstop weave", "6 tactical utility pockets", "Adjustable ankle cuffs"],
  },
];

const STATIC_CATEGORIES: CategoryItem[] = [
  { id: "cat-tees", slug: "tees", name: "Heavyweight Graphic Tees" },
  { id: "cat-hoodies", slug: "hoodies", name: "Oversized Hoodies" },
  { id: "cat-bottoms", slug: "bottoms", name: "Tactical Cargos" },
  { id: "cat-drop-01", slug: "drop-01-chaos", name: "Drop 01 Archive" },
];

/**
 * Fetch all products with filtering and sorting
 */
export async function getProducts(params?: {
  category?: string;
  q?: string;
  sort?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProductItem[]> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      let query = supabase
        .from("products")
        .select(`
          *,
          categories (name, slug),
          product_images (id, url, alt, display_order),
          product_variants (id, size, color, inventory_count, sku)
        `)
        .eq("is_archived", false);

      if (params?.featuredOnly) {
        query = query.eq("is_featured", true);
      }

      if (params?.category && params.category !== "all") {
        // Query category ID or join
        const { data: catData } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", params.category)
          .single();
        if (catData?.id) {
          query = query.eq("category_id", catData.id);
        }
      }

      if (params?.q) {
        query = query.or(`name.ilike.%${params.q}%,description.ilike.%${params.q}%`);
      }

      // Sorting
      if (params?.sort === "price_asc") {
        query = query.order("price", { ascending: true });
      } else if (params?.sort === "price_desc") {
        query = query.order("price", { ascending: false });
      } else {
        query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((p: any) => {
          const images = (p.product_images || []).sort(
            (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
          );
          const variants = (p.product_variants || []).sort((a: any, b: any) => {
            const order: Record<string, number> = { S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
            return (order[a.size] || 99) - (order[b.size] || 99);
          });

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            subtitle: p.subtitle || "",
            tagline: p.tagline || "",
            description: p.description || "",
            price: Number(p.price),
            compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : undefined,
            category_id: p.category_id,
            category_name: p.categories?.name || "Streetwear",
            category_slug: p.categories?.slug || "all",
            is_featured: !!p.is_featured,
            primary_image: images[0]?.url || "/brand/brand_asset_0.jpeg",
            hover_image: images[1]?.url || images[0]?.url || "/brand/brand_asset_0.jpeg",
            images,
            variants,
            details: Array.isArray(p.details) ? p.details : [],
          };
        });
      }
    }
  } catch (supaErr) {
    console.warn("Supabase fetch failed, trying local DB fallback:", supaErr);
  }

  // Local SQLite fallback
  try {
    const dbModule = await import("@/lib/db");
    const db = dbModule.default;
    if (db) {
      let queryStr = `
        SELECT p.*, c.name as category_name, c.slug as category_slug,
          (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as primary_image,
          (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1 OFFSET 1) as hover_image
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.is_archived = 0
      `;
      const queryParams: any[] = [];

      if (params?.category && params.category !== "all") {
        queryStr += " AND c.slug = ?";
        queryParams.push(params.category);
      }
      if (params?.featuredOnly) {
        queryStr += " AND p.is_featured = 1";
      }
      if (params?.q) {
        queryStr += " AND (p.name LIKE ? OR p.description LIKE ?)";
        queryParams.push(`%${params.q}%`, `%${params.q}%`);
      }
      if (params?.sort === "price_asc") {
        queryStr += " ORDER BY p.price ASC";
      } else if (params?.sort === "price_desc") {
        queryStr += " ORDER BY p.price DESC";
      } else {
        queryStr += " ORDER BY p.is_featured DESC, p.created_at DESC";
      }
      if (params?.limit) {
        queryStr += ` LIMIT ${params.limit}`;
      }

      const rows = db.prepare(queryStr).all(...queryParams) as any[];
      if (rows && rows.length > 0) {
        return rows.map((p) => {
          const variants = db
            .prepare(
              "SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 WHEN 'XXL' THEN 5 ELSE 6 END"
            )
            .all(p.id) as ProductVariant[];
          const images = db
            .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order")
            .all(p.id) as any[];

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            subtitle: p.subtitle || "",
            tagline: p.tagline || "",
            description: p.description || "",
            price: Number(p.price),
            compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : undefined,
            category_id: p.category_id,
            category_name: p.category_name || "Streetwear",
            category_slug: p.category_slug || "all",
            is_featured: !!p.is_featured,
            primary_image: p.primary_image || "/brand/brand_asset_0.jpeg",
            hover_image: p.hover_image || p.primary_image || "/brand/brand_asset_0.jpeg",
            images,
            variants,
            details: p.details ? (typeof p.details === "string" ? JSON.parse(p.details) : p.details) : [],
          };
        });
      }
    }
  } catch (sqliteErr) {
    console.warn("SQLite fetch failed:", sqliteErr);
  }

  // Ultimate static fallback (never crashes)
  return STATIC_FALLBACK_PRODUCTS;
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (name, slug),
          product_images (id, url, alt, display_order),
          product_variants (id, size, color, inventory_count, sku)
        `)
        .eq("slug", slug)
        .eq("is_archived", false)
        .single();

      if (!error && data) {
        const images = (data.product_images || []).sort(
          (a: any, b: any) => (a.display_order ?? 0) - (b.display_order ?? 0)
        );
        const variants = (data.product_variants || []).sort((a: any, b: any) => {
          const order: Record<string, number> = { S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
          return (order[a.size] || 99) - (order[b.size] || 99);
        });

        return {
          id: data.id,
          slug: data.slug,
          name: data.name,
          subtitle: data.subtitle || "",
          tagline: data.tagline || "",
          description: data.description || "",
          price: Number(data.price),
          compare_at_price: data.compare_at_price ? Number(data.compare_at_price) : undefined,
          category_id: data.category_id,
          category_name: data.categories?.name || "Streetwear",
          category_slug: data.categories?.slug || "all",
          is_featured: !!data.is_featured,
          primary_image: images[0]?.url || "/brand/brand_asset_0.jpeg",
          hover_image: images[1]?.url || images[0]?.url || "/brand/brand_asset_0.jpeg",
          images,
          variants,
          details: Array.isArray(data.details) ? data.details : [],
        };
      }
    }
  } catch (supaErr) {
    console.warn("Supabase product slug fetch error:", supaErr);
  }

  // SQLite fallback
  try {
    const dbModule = await import("@/lib/db");
    const db = dbModule.default;
    if (db) {
      const p = db
        .prepare(`
          SELECT p.*, c.name as category_name, c.slug as category_slug
          FROM products p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE p.slug = ? AND p.is_archived = 0
        `)
        .get(slug) as any;

      if (p) {
        const images = db
          .prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order")
          .all(p.id) as any[];
        const variants = db
          .prepare(
            "SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 WHEN 'XXL' THEN 5 ELSE 6 END"
          )
          .all(p.id) as ProductVariant[];

        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          subtitle: p.subtitle || "",
          tagline: p.tagline || "",
          description: p.description || "",
          price: Number(p.price),
          compare_at_price: p.compare_at_price ? Number(p.compare_at_price) : undefined,
          category_id: p.category_id,
          category_name: p.category_name || "Streetwear",
          category_slug: p.category_slug || "all",
          is_featured: !!p.is_featured,
          primary_image: images[0]?.url || "/brand/brand_asset_0.jpeg",
          hover_image: images[1]?.url || images[0]?.url || "/brand/brand_asset_0.jpeg",
          images,
          variants,
          details: p.details ? (typeof p.details === "string" ? JSON.parse(p.details) : p.details) : [],
        };
      }
    }
  } catch (sqliteErr) {
    console.warn("SQLite slug fetch error:", sqliteErr);
  }

  return STATIC_FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch {
    // fallback
  }

  try {
    const dbModule = await import("@/lib/db");
    const db = dbModule.default;
    if (db) {
      const cats = db.prepare("SELECT * FROM categories ORDER BY name").all() as CategoryItem[];
      if (cats && cats.length > 0) return cats;
    }
  } catch {
    // fallback
  }

  return STATIC_CATEGORIES;
}
