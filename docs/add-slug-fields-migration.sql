-- Migration: Add slug fields to packages, hotels, and cars tables
-- This adds URL-friendly slug fields that can be auto-generated or manually set

-- Add slug field to packages table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'packages' AND column_name = 'slug') THEN
        ALTER TABLE public.packages ADD COLUMN slug TEXT;
        
        -- Create unique index for slug
        CREATE UNIQUE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug) WHERE slug IS NOT NULL;
        
        -- Add comment
        COMMENT ON COLUMN public.packages.slug IS 'URL-friendly identifier for the package (auto-generated from title or manually set)';
    END IF;
END $$;

-- Add slug field to hotels table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'hotels' AND column_name = 'slug') THEN
        ALTER TABLE public.hotels ADD COLUMN slug TEXT;
        
        -- Create unique index for slug
        CREATE UNIQUE INDEX IF NOT EXISTS idx_hotels_slug ON public.hotels(slug) WHERE slug IS NOT NULL;
        
        -- Add comment
        COMMENT ON COLUMN public.hotels.slug IS 'URL-friendly identifier for the hotel (auto-generated from name or manually set)';
    END IF;
END $$;

-- Add slug field to cars table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'cars' AND column_name = 'slug') THEN
        ALTER TABLE public.cars ADD COLUMN slug TEXT;
        
        -- Create unique index for slug
        CREATE UNIQUE INDEX IF NOT EXISTS idx_cars_slug ON public.cars(slug) WHERE slug IS NOT NULL;
        
        -- Add comment
        COMMENT ON COLUMN public.cars.slug IS 'URL-friendly identifier for the car (auto-generated from name or manually set)';
    END IF;
END $$;

-- Create a function to generate slugs from text
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        TRIM(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    REGEXP_REPLACE(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
                    '\s+', '-', 'g'
                ),
                '-+', '-', 'g'
            ),
            '-'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Create functions to ensure unique slugs for each table
CREATE OR REPLACE FUNCTION ensure_unique_package_slug(base_slug TEXT, package_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT := base_slug;
    counter INTEGER := 1;
BEGIN
    WHILE EXISTS (
        SELECT 1 FROM public.packages 
        WHERE slug = final_slug 
        AND (package_id IS NULL OR id != package_id)
    ) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_unique_hotel_slug(base_slug TEXT, hotel_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT := base_slug;
    counter INTEGER := 1;
BEGIN
    WHILE EXISTS (
        SELECT 1 FROM public.hotels 
        WHERE slug = final_slug 
        AND (hotel_id IS NULL OR id != hotel_id)
    ) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION ensure_unique_car_slug(base_slug TEXT, car_id UUID DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    final_slug TEXT := base_slug;
    counter INTEGER := 1;
BEGIN
    WHILE EXISTS (
        SELECT 1 FROM public.cars 
        WHERE slug = final_slug 
        AND (car_id IS NULL OR id != car_id)
    ) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Optional: Generate initial slugs for existing records
-- Uncomment and run these if you want to populate slugs for existing data

-- Generate slugs for existing packages
-- UPDATE public.packages 
-- SET slug = ensure_unique_package_slug(generate_slug(title), id)
-- WHERE slug IS NULL AND title IS NOT NULL;

-- Generate slugs for existing hotels
-- UPDATE public.hotels 
-- SET slug = ensure_unique_hotel_slug(generate_slug(name), id)
-- WHERE slug IS NULL AND name IS NOT NULL;

-- Generate slugs for existing cars
-- UPDATE public.cars 
-- SET slug = ensure_unique_car_slug(generate_slug(name), id)
-- WHERE slug IS NULL AND name IS NOT NULL;