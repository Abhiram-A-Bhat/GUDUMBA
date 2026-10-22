import HeroSection from "@/components/home/HeroSection";
import MarqueeBand from "@/components/home/MarqueeBand";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BrandManifesto from "@/components/home/BrandManifesto";
import ScrollCampaign from "@/components/home/ScrollCampaign";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/data-service";
import type { ProductSummary } from "@/components/home/FeaturedProducts";

export default async function HomePage() {
  const products = await getProducts({ featuredOnly: true, limit: 4 });

  return (
    <div className="bg-[#100f0d] min-h-screen text-[#f5f5f5]">
      {/* 1. Cinematic Luxury Hero (Clean Full-Screen Campaign Film) */}
      <HeroSection />

      {/* 2. Understated Typographic Marquee Divider */}
      <MarqueeBand />

      {/* 3. Spacious Editorial Product Showcase (Represent Style) */}
      <FeaturedProducts products={products as ProductSummary[]} />

      {/* 4. Bold Typography Manifesto */}
      <BrandManifesto />

      {/* 5. Editorial Lookbook Scroll Campaign */}
      <ScrollCampaign />

      {/* 6. Underground VIP Access Newsletter */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
