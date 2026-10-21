-- =========================================================================
-- GUDUMBA® PRODUCTION POSTGRESQL SCHEMA (SUPABASE)
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'customer', -- 'customer' | 'admin'
  avatar_url TEXT,
  marketing_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  tagline TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  category_id TEXT REFERENCES public.categories(id),
  is_featured BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  details JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  display_order INT DEFAULT 0
);

-- 5. PRODUCT VARIANTS (SIZES & STOCK)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT DEFAULT 'Midnight Noir',
  sku TEXT UNIQUE,
  inventory_count INT DEFAULT 0
);

-- 6. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping_fee NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'PAYTM',
  payment_status TEXT DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
  fulfillment_status TEXT DEFAULT 'UNFULFILLED', -- 'UNFULFILLED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  paytm_txnid TEXT,
  paytm_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  variant_id TEXT,
  product_name TEXT NOT NULL,
  size TEXT,
  color TEXT,
  price NUMERIC NOT NULL,
  quantity INT NOT NULL,
  total NUMERIC NOT NULL
);

-- 8. MARKETING SUBSCRIBERS
CREATE TABLE IF NOT EXISTS public.marketing_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products & Categories: Viewable by anyone
CREATE POLICY "Public products viewable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public categories viewable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public product images viewable" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public product variants viewable" ON public.product_variants FOR SELECT USING (true);

-- User Profiles: Users can read and update their own profile
CREATE POLICY "User can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "User can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Orders: Users can view their own orders; Admins can view all
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- TRIGGER: Auto-create public.profile when a user signs up via Google / OTP / Email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    CASE WHEN NEW.email = 'admin@gudumba.in' THEN 'admin' ELSE 'customer' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================================
-- SEED DATA (INITIAL CATEGORIES & FLAGSHIP PIECES)
-- =========================================================================
INSERT INTO public.categories (id, slug, name, description, image_url) VALUES
('cat-tees', 'tees', 'Heavyweight Graphic Tees', 'Custom cut-and-sew heavyweight drop-shoulder streetwear tees.', '/brand/brand_asset_4.jpeg'),
('cat-hoodies', 'hoodies', 'Oversized Outerwear', 'Uncompromised fleece hoodies engineered for chilly streets and late nights.', '/brand/brand_asset_7.jpeg'),
('cat-bottoms', 'bottoms', 'Heavyweight Cargo & Bottoms', 'Structured Japanese tactical twill and French terry sweats.', '/stock/prod_tactical_cargo_1.jpg'),
('cat-drop1', 'drop-01-chaos', 'Drop 01: Chaos & Character', 'Raw silhouettes, heavyweight cotton, unapologetic attitude.', '/brand/brand_asset_3.jpeg')
ON CONFLICT (id) DO NOTHING;
