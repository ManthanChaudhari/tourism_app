-- Simple migration to add position column
-- Run this if the main migration fails

-- Step 1: Add the position column
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Step 2: Create index
CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(position);

-- Step 3: Update positions manually (run one of these depending on your table structure)

-- Option A: If you have display_order column
-- UPDATE public.categories SET position = display_order WHERE position = 0;

-- Option B: If you don't have display_order, use sequential numbering
-- This approach assigns positions 1, 2, 3, etc. based on creation date
UPDATE public.categories 
SET position = subquery.row_num
FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
    FROM public.categories
    WHERE position = 0 OR position IS NULL
) AS subquery
WHERE public.categories.id = subquery.id
AND (public.categories.position = 0 OR public.categories.position IS NULL);

-- Step 4: Add comment
COMMENT ON COLUMN public.categories.position IS 'Position for drag and drop ordering (lower numbers first)';

-- Verify the migration
SELECT id, name, position, created_at FROM public.categories ORDER BY position ASC;