-- Insert sample apartments into public schema
INSERT INTO public.apartments (name, address) VALUES
  ('Skyline Towers', '123 Main Street, Downtown'),
  ('Green Valley Apartments', '456 Oak Avenue, Westside'),
  ('Riverside Complex', '789 River Road, East District'),
  ('Sunset Heights', '321 Sunset Boulevard, North Side'),
  ('Palm Gardens', '654 Palm Drive, South Beach')
ON CONFLICT DO NOTHING;
