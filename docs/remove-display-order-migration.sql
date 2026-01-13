-- Migration: Remove display_order field from categories table
-- This migration removes the display_order field since we're implementing drag and drop functionality
-- for category ordering in the admin interface.

-- Remove the display_order column and its index
DROP INDEX IF EXISTS idx_categories_display_order;
ALTER TABLE public.categories DROP COLUMN IF EXISTS display_order;

-- Update any existing queries or views that might reference display_order
-- Note: Make sure to update any application code that references this field before running this migration

-- Optional: If you want to add a new ordering system later, you could add a position field
-- ALTER TABLE public.categories ADD COLUMN position INTEGER DEFAULT 0;
-- CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);

-- Update the table comment to reflect the change
COMMENT ON TABLE public.categories IS 'Package categories with drag-and-drop ordering support';