import HeroSectionClassic from "@/components/home-classic/HeroSectionClassic";
import MarqueeBandClassic from "@/components/home-classic/MarqueeBandClassic";
import FeaturedProductsClassic from "@/components/home-classic/FeaturedProductsClassic";
import AttitudeAudioPlayerClassic from "@/components/home-classic/AttitudeAudioPlayerClassic";
import SocialProofStripClassic from "@/components/home-classic/SocialProofStripClassic";
import BrandManifesto from "@/components/home/BrandManifesto";
import ScrollCampaign from "@/components/home/ScrollCampaign";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/data-service";
import type { ProductSummary } from "@/components/home/FeaturedProducts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GUDUMBA® — Classic Underground Streetwear",
  description: "Experience the original underground streetwear vision of GUDUMBA®. 100% heavyweight drops, raw attitude, zero apologies.",
};

export default async function ClassicPage() {
  const products = await getProducts({ featuredOnly: true, limit: 4 });

  return (
    <div className="bg-[#100f0d] min-h-screen text-[#f5f5f5]">
      {/* 1. Cinematic Luxury Hero (Clean Full-Screen Campaign Film with Sigil Insignia) */}
      <HeroSectionClassic />

      {/* 2. Understated Typographic Marquee Divider */}
      <MarqueeBandClassic />

      {/* 3. Spacious Editorial Product Showcase */}
      <FeaturedProductsClassic products={products as ProductSummary[]} />

      {/* 4. Interactive Drop Attitude Audio Player */}
      <AttitudeAudioPlayerClassic />

      {/* 5. Bold Typography Manifesto */}
      <BrandManifesto />

      {/* 6. Editorial Lookbook Scroll Campaign */}
      <ScrollCampaign />

      {/* 7. Community Social Proof / Testimonials Strip */}
      <SocialProofStripClassic />

      {/* 8. VIP Newsletter Signup */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
