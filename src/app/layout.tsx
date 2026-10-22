import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from "@/components/ui/Toaster";
import SupportChatWidget from "@/components/SupportChatWidget";
import VersionSwitcher from "@/components/VersionSwitcher";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const metadataBase = configuredSiteUrl ? new URL(configuredSiteUrl) : undefined;

export const metadata: Metadata = {
  ...(metadataBase ? { metadataBase } : {}),
  title: {
    default: "GUDUMBA® — Born Different. Stay Unapologetic.",
    template: "%s | GUDUMBA®",
  },
  description:
    "Gudumba® is a premium Indian streetwear brand built for men who walk their own path. Bold silhouettes, raw energy, unapologetic attitude. Shop the drop.",
  keywords: ["gudumba", "streetwear", "indian streetwear", "oversized tee", "mens fashion", "born different"],
  authors: [{ name: "Gudumba®" }],
  creator: "Gudumba®",
  publisher: "Gudumba®",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "GUDUMBA®",
    title: "GUDUMBA® — Born Different. Stay Unapologetic.",
    description:
      "Premium Indian men's streetwear. Bold silhouettes. Raw energy. No apologies.",
    ...(metadataBase ? { images: [
      {
        url: "/brand/gudumba-logo.jpg",
        alt: "GUDUMBA® Streetwear",
      },
    ] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "GUDUMBA® — Born Different. Stay Unapologetic.",
    description: "Premium Indian men's streetwear. No rules. No repeats.",
    ...(metadataBase ? { images: ["/brand/gudumba-logo.jpg"] } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bebasNeue.variable}`}
    >
      <body className="min-h-screen bg-[#100f0d] text-[#f2f0ed] antialiased">
        {/* Film grain overlay */}
        <div className="grain-overlay" aria-hidden="true" />

        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <CartDrawer />
                <main id="main-content">{children}</main>
                <CookieBanner />
                <Toaster />
                <SupportChatWidget />
                <VersionSwitcher />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
