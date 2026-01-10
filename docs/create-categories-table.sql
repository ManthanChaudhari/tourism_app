-- Create categories table for package category management
-- Run this script in your Supabase SQL editor

-- Create the categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- icon name or image url
  banner_image TEXT, -- category banner
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_status ON public.categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON public.categories(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_status_featured ON public.categories(status, is_featured);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_update_categories_updated_at ON public.categories;
CREATE TRIGGER trigger_update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_categories_updated_at();

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read active categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin read all categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin delete categories" ON public.categories;

-- Create RLS policies
-- Allow public to read active categories
CREATE POLICY "Allow public read active categories" ON public.categories
FOR SELECT TO public
USING (status = 'active');

-- Allow admins to read all categories
CREATE POLICY "Allow admin read all categories" ON public.categories
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
));

-- Allow admins to insert categories
CREATE POLICY "Allow admin insert categories" ON public.categories
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
));

-- Allow admins to update categories
CREATE POLICY "Allow admin update categories" ON public.categories
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
));

-- Allow admins to delete categories
CREATE POLICY "Allow admin delete categories" ON public.categories
FOR DELETE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM public.profiles WHERE role = 'admin'
));

-- Insert sample categories data
INSERT INTO public.categories (name, slug, description, icon, display_order, is_featured, status) VALUES 
('Adventure', 'adventure', 'Thrilling outdoor experiences and adrenaline-pumping activities', '🏔️', 1, true, 'active'),
('Honeymoon', 'honeymoon', 'Romantic getaways perfect for couples and newlyweds', '💕', 2, true, 'active'),
('Family', 'family', 'Fun-filled vacations suitable for families with children', '👨‍👩‍👧‍👦', 3, true, 'active'),
('Beach', 'beach', 'Relaxing coastal destinations with sun, sand, and sea', '🏖️', 4, false, 'active'),
('Cultural', 'cultural', 'Immersive experiences exploring local traditions and heritage', '🏛️', 5, false, 'active'),
('Luxury', 'luxury', 'Premium travel experiences with top-tier accommodations', '✨', 6, false, 'active'),
('Budget', 'budget', 'Affordable travel options without compromising on experience', '💰', 7, false, 'active'),
('Wildlife', 'wildlife', 'Safari adventures and wildlife observation tours', '🦁', 8, false, 'active')
ON CONFLICT (slug) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.categories TO authenticated;
GRANT SELECT ON public.categories TO anon;

-- Add comments for documentation
COMMENT ON TABLE public.categories IS 'Package categories for organizing travel packages';
COMMENT ON COLUMN public.categories.name IS 'Display name of the category';
COMMENT ON COLUMN public.categories.slug IS 'URL-friendly identifier for the category';
COMMENT ON COLUMN public.categories.description IS 'Detailed description of what this category includes';
COMMENT ON COLUMN public.categories.icon IS 'Emoji or image URL for category icon';
COMMENT ON COLUMN public.categories.banner_image IS 'Banner image URL for category pages';
COMMENT ON COLUMN public.categories.display_order IS 'Order in which categories should be displayed (lower numbers first)';
COMMENT ON COLUMN public.categories.is_featured IS 'Whether this category should be featured prominently';
COMMENT ON COLUMN public.categories.status IS 'Active or inactive status of the category';