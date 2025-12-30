-- Add delivery address fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS apartment_name TEXT,
ADD COLUMN IF NOT EXISTS flat_number TEXT,
ADD COLUMN IF NOT EXISTS door_number TEXT;

-- Add index for apartment_name for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_apartment_name ON public.bookings(apartment_name);
