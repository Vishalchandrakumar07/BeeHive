-- Create tables in public schema with full CRUD permissions for testing

-- Create apartments table
CREATE TABLE IF NOT EXISTS public.apartments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT,
  phone TEXT NOT NULL,
  apartment_id UUID REFERENCES public.apartments(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_phone TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  flat_number TEXT,
  apartment_id UUID REFERENCES public.apartments(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- PERMISSIVE RLS Policies - Allow full CRUD for all authenticated and anonymous users

-- Apartments: Full access for everyone (for testing/development)
CREATE POLICY "apartments_select_all" ON public.apartments FOR SELECT USING (true);
CREATE POLICY "apartments_insert_all" ON public.apartments FOR INSERT WITH CHECK (true);
CREATE POLICY "apartments_update_all" ON public.apartments FOR UPDATE USING (true);
CREATE POLICY "apartments_delete_all" ON public.apartments FOR DELETE USING (true);

-- Shops: Full access for everyone
CREATE POLICY "shops_select_all" ON public.shops FOR SELECT USING (true);
CREATE POLICY "shops_insert_all" ON public.shops FOR INSERT WITH CHECK (true);
CREATE POLICY "shops_update_all" ON public.shops FOR UPDATE USING (true);
CREATE POLICY "shops_delete_all" ON public.shops FOR DELETE USING (true);

-- Products: Full access for everyone
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_insert_all" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_all" ON public.products FOR UPDATE USING (true);
CREATE POLICY "products_delete_all" ON public.products FOR DELETE USING (true);

-- Orders: Full access for everyone
CREATE POLICY "orders_select_all" ON public.orders FOR SELECT USING (true);
CREATE POLICY "orders_insert_all" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_update_all" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "orders_delete_all" ON public.orders FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shops_apartment_id ON public.shops(apartment_id);
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_products_shop_id ON public.products(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_shop_id ON public.orders(shop_id);
CREATE INDEX IF NOT EXISTS idx_orders_apartment_id ON public.orders(apartment_id);
