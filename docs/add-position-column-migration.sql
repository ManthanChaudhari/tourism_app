-- Migration: Add position column for drag and drop ordering
-- This adds a position column to replace display_order for drag and drop functionality

-- Add position column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'position') THEN
        ALTER TABLE public.categories ADD COLUMN position INTEGER DEFAULT 0;
        
        -- Create index for performance
        CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);
        
        -- Update existing records with position based on display_order if it exists
        -- If display_order doesn't exist, use created_at for ordering
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'display_order') THEN
            -- Use a subquery with ROW_NUMBER to assign positions
            WITH numbered_categories AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY display_order ASC, created_at ASC) as new_position
                FROM public.categories
            )
            UPDATE public.categories 
            SET position = numbered_categories.new_position
            FROM numbered_categories
            WHERE public.categories.id = numbered_categories.id;
        ELSE
            -- Use created_at for ordering if display_order doesn't exist
            WITH numbered_categories AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_position
                FROM public.categories
            )
            UPDATE public.categories 
            SET position = numbered_categories.new_position
            FROM numbered_categories
            WHERE public.categories.id = numbered_categories.id;
        END IF;
        
        -- Add comment
        COMMENT ON COLUMN public.categories.position IS 'Position for drag and drop ordering (lower numbers first)';
    END IF;
END $$;

-- Create or replace function to add position column (for API use)
CREATE OR REPLACE FUNCTION add_position_column_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'position') THEN
        ALTER TABLE public.categories ADD COLUMN position INTEGER DEFAULT 0;
        CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);
        
        -- Initialize positions using proper subquery approach
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'display_order') THEN
            WITH numbered_categories AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY display_order ASC, created_at ASC) as new_position
                FROM public.categories
            )
            UPDATE public.categories 
            SET position = numbered_categories.new_position
            FROM numbered_categories
            WHERE public.categories.id = numbered_categories.id;
        ELSE
            WITH numbered_categories AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_position
                FROM public.categories
            )
            UPDATE public.categories 
            SET position = numbered_categories.new_position
            FROM numbered_categories
            WHERE public.categories.id = numbered_categories.id;
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;