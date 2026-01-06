-- Create sellers table (separate from auth.users)
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  service_provider_name TEXT NOT NULL,
  seller_type TEXT CHECK (seller_type IN ('products', 'services')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update shops table to support both apartment references and seller info
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES public.sellers(id) ON DELETE CASCADE;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS available_days TEXT[];
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS available_time_start TIME;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS available_time_end TIME;
ALTER TABLE public.shops ADD COLUMN IF NOT EXISTS service_provider_name TEXT;

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shop_apartments junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.shop_apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  apartment_id UUID REFERENCES public.apartments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shop_id, apartment_id)
);

-- Enable Row Level Security
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_apartments ENABLE ROW LEVEL SECURITY;

-- Full CRUD policies For Technicians
CREATE POLICY "sellers_select_all" ON public.sellers FOR SELECT USING (true);
CREATE POLICY "sellers_insert_all" ON public.sellers FOR INSERT WITH CHECK (true);
CREATE POLICY "sellers_update_all" ON public.sellers FOR UPDATE USING (true);
CREATE POLICY "sellers_delete_all" ON public.sellers FOR DELETE USING (true);

-- Full CRUD policies for services
CREATE POLICY "services_select_all" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_insert_all" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "services_update_all" ON public.services FOR UPDATE USING (true);
CREATE POLICY "services_delete_all" ON public.services FOR DELETE USING (true);

-- Full CRUD policies for shop_apartments
CREATE POLICY "shop_apartments_select_all" ON public.shop_apartments FOR SELECT USING (true);
CREATE POLICY "shop_apartments_insert_all" ON public.shop_apartments FOR INSERT WITH CHECK (true);
CREATE POLICY "shop_apartments_update_all" ON public.shop_apartments FOR UPDATE USING (true);
CREATE POLICY "shop_apartments_delete_all" ON public.shop_apartments FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sellers_phone ON public.sellers(phone);
CREATE INDEX IF NOT EXISTS idx_services_shop_id ON public.services(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_apartments_shop_id ON public.shop_apartments(shop_id);
CREATE INDEX IF NOT EXISTS idx_shop_apartments_apartment_id ON public.shop_apartments(apartment_id);
CREATE INDEX IF NOT EXISTS idx_shops_seller_id ON public.shops(seller_id);
