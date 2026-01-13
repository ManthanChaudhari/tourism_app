-- Migration: Add category_id field to packages table
-- This migration adds a foreign key reference to the categories table

-- Step 1: Add new category_id column
ALTER TABLE packages 
ADD COLUMN category_id UUID REFERENCES categories(id);

-- Step 2: Create index for the new foreign key
CREATE INDEX idx_packages_category_id ON packages(category_id);

-- Step 3: Add foreign key constraint with proper name
ALTER TABLE packages 
ADD CONSTRAINT packages_category_fkey 
FOREIGN KEY (category_id) REFERENCES categories(id);

-- Step 4: Optional - Migrate existing text categories to category IDs
-- This is a manual process since we need to match text categories to actual category records
-- You can run queries like this to help with the migration:

-- Example: Find packages with text categories that might match category records
-- UPDATE packages 
-- SET category_id = (
--   SELECT id FROM categories 
--   WHERE LOWER(categories.name) = LOWER(packages.category)
--   LIMIT 1
-- )
-- WHERE category_id IS NULL AND category IS NOT NULL;

-- Step 5: After manual migration of data, you can optionally drop the old column
-- WARNING: Only do this after ensuring all data is properly migrated!
-- ALTER TABLE packages DROP COLUMN category;

-- Step 6: Rename the new column to replace the old one (optional)
-- ALTER TABLE packages RENAME COLUMN category_id TO category;

-- Alternative approach: Keep both columns for backward compatibility
-- This allows gradual migration and fallback to text when category ID is not available

-- Create a view that shows category information for easier querying
CREATE OR REPLACE VIEW packages_with_categories AS
SELECT 
  p.*,
  CASE 
    WHEN c.id IS NOT NULL THEN c.name
    ELSE p.category
  END as category_display_name,
  c.id as category_ref_id,
  c.name as category_ref_name,
  c.slug as category_slug,
  c.icon as category_icon,
  c.is_featured as category_is_featured
FROM packages p
LEFT JOIN categories c ON p.category_id = c.id;

-- Grant access to the view
GRANT SELECT ON packages_with_categories TO authenticated;
GRANT SELECT ON packages_with_categories TO anon;

-- Update RLS policies to work with the new structure
-- The existing policies should continue to work, but you may want to update them
-- to use the new category_id field for better performance

-- Example: Policy for filtering by category
-- CREATE POLICY "Allow filtering by category" ON packages
-- FOR SELECT TO public
-- USING (
--   status = 'published' AND 
--   (category_id IS NULL OR category_id IN (
--     SELECT id FROM categories WHERE status = 'active'
--   ))
-- );

COMMENT ON COLUMN packages.category_id IS 'Foreign key reference to categories table. When set, takes precedence over category text field.';
COMMENT ON COLUMN packages.category IS 'Legacy text field for category. Used as fallback when category_id is NULL.';
COMMENT ON VIEW packages_with_categories IS 'View that combines packages with category information, showing proper category names.';