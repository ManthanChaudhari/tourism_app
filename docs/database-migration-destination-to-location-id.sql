-- Migration: Update packages.destination from text to location ID reference
-- This migration converts the destination field from VARCHAR to UUID foreign key

-- Step 1: Add new destination_id column
ALTER TABLE packages 
ADD COLUMN destination_id UUID REFERENCES locations(id);

-- Step 2: Create index for the new foreign key
CREATE INDEX idx_packages_destination_id ON packages(destination_id);

-- Step 3: Optional - Migrate existing text destinations to location IDs
-- This is a manual process since we need to match text destinations to actual locations
-- You can run queries like this to help with the migration:

-- Example: Find packages with text destinations that might match locations
-- SELECT p.id, p.title, p.destination, l.id as location_id, l.name, l.type
-- FROM packages p
-- LEFT JOIN locations l ON (
--   LOWER(p.destination) LIKE '%' || LOWER(l.name) || '%' OR
--   LOWER(l.name) LIKE '%' || LOWER(p.destination) || '%'
-- )
-- WHERE p.destination_id IS NULL
-- ORDER BY p.destination, l.name;

-- Step 4: After manual migration of data, you can optionally drop the old column
-- WARNING: Only do this after ensuring all data is properly migrated!
-- ALTER TABLE packages DROP COLUMN destination;

-- Step 5: Rename the new column to replace the old one (optional)
-- ALTER TABLE packages RENAME COLUMN destination_id TO destination;

-- Alternative approach: Keep both columns for backward compatibility
-- This allows gradual migration and fallback to text when location ID is not available

-- Update the foreign key constraint name for better organization
ALTER TABLE packages 
ADD CONSTRAINT packages_destination_fkey 
FOREIGN KEY (destination_id) REFERENCES locations(id);

-- Create a view that shows destination information for easier querying
CREATE OR REPLACE VIEW packages_with_destinations AS
SELECT 
  p.*,
  CASE 
    WHEN l.id IS NOT NULL THEN
      CASE 
        WHEN l.type = 'city' AND parent_loc.name IS NOT NULL THEN
          l.name || ', ' || parent_loc.name
        ELSE
          l.name
      END
    ELSE
      p.destination
  END as destination_display_name,
  l.id as location_id,
  l.name as location_name,
  l.type as location_type,
  l.slug as location_slug,
  parent_loc.name as parent_location_name
FROM packages p
LEFT JOIN locations l ON p.destination_id = l.id
LEFT JOIN locations parent_loc ON l.parent_id = parent_loc.id;

-- Grant access to the view
GRANT SELECT ON packages_with_destinations TO authenticated;
GRANT SELECT ON packages_with_destinations TO anon;

-- Update RLS policies to work with the new structure
-- The existing policies should continue to work, but you may want to update them
-- to use the new destination_id field for better performance

-- Example: Policy for filtering by location
-- CREATE POLICY "Allow filtering by location" ON packages
-- FOR SELECT TO public
-- USING (
--   status = 'published' AND 
--   (destination_id IS NULL OR destination_id IN (
--     SELECT id FROM locations WHERE is_active = true
--   ))
-- );

COMMENT ON COLUMN packages.destination_id IS 'Foreign key reference to locations table. When set, takes precedence over destination text field.';
COMMENT ON COLUMN packages.destination IS 'Legacy text field for destination. Used as fallback when destination_id is NULL.';
COMMENT ON VIEW packages_with_destinations IS 'View that combines packages with location information, showing proper destination names.';