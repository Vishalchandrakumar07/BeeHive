-- Create bookings table to track service bookings submitted via WhatsApp
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE,
  customer_phone TEXT,
  customer_name TEXT,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Full CRUD policies for bookings
CREATE POLICY "bookings_select_all" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert_all" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update_all" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "bookings_delete_all" ON public.bookings FOR DELETE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_shop_id ON public.bookings(shop_id);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
