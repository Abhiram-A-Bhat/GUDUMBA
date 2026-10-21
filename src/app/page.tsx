import HeroSection from "@/components/home/HeroSection";
import MarqueeBand from "@/components/home/MarqueeBand";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandManifesto from "@/components/home/BrandManifesto";
import ScrollCampaign from "@/components/home/ScrollCampaign";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/Footer";
import db from "@/lib/db";

async function getFeaturedProducts() {
  const products = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1) as primary_image,
      (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order LIMIT 1 OFFSET 1) as hover_image
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.is_archived = 0
    ORDER BY p.is_featured DESC, p.created_at DESC
  `).all() as any[];

  return products.map(p => ({
    ...p,
    details: p.details ? JSON.parse(p.details) : [],
    variants: db.prepare("SELECT * FROM product_variants WHERE product_id = ? ORDER BY CASE size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 WHEN 'XXL' THEN 5 ELSE 6 END").all(p.id)
  }));
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-[#050505] min-h-screen text-[#f5f5f5]">
      {/* 1. Cinematic Luxury Hero (Clean Full-Screen Campaign Film) */}
      <HeroSection />

      {/* 2. Understated Typographic Marquee Divider */}
      <MarqueeBand />

      {/* 3. Spacious Editorial Product Showcase (Represent Style) */}
      <FeaturedProducts products={products} />

      {/* 4. Luxury Brand Creed & Manifesto */}
      <BrandManifesto />

      {/* 5. High-Production Lookbook Campaign */}
      <ScrollCampaign />

      {/* 6. VIP Drop Alerts */}
      <NewsletterSection />

      {/* 7. Minimalist D2C Footer */}
      <Footer />
    </div>
  );
}
