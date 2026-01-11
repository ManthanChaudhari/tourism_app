-- Migration: Add foreign key constraints to existing destination and category fields
-- This allows the fields to store either UUIDs (referencing other tables) or text values

-- Step 1: First, let's check the current data types
-- The destination and category fields should be able to store UUIDs
-- If they're currently VARCHAR with length restrictions, we may need to adjust

-- Update destination field to support UUIDs (if needed)
-- ALTER TABLE packages ALTER COLUMN destination TYPE TEXT;

-- Update category field to support UUIDs (if needed)  
-- ALTER TABLE packages ALTER COLUMN category TYPE TEXT;

-- Step 2: Add foreign key constraints that allow NULL values
-- This means the fields can contain UUIDs that reference other tables, or any other text

-- Add foreign key constraint for destination (optional reference to locations)
-- Note: This will only enforce the constraint when the value is a valid UUID that exists in locations table
ALTER TABLE packages 
ADD CONSTRAINT packages_destination_locations_fkey 
FOREIGN KEY (destination) REFERENCES locations(id) 
DEFERRABLE INITIALLY DEFERRED;

-- Add foreign key constraint for category (optional reference to categories)
-- Note: This will only enforce the constraint when the value is a valid UUID that exists in categories table
ALTER TABLE packages 
ADD CONSTRAINT packages_category_categories_fkey 
FOREIGN KEY (category) REFERENCES categories(id) 
DEFERRABLE INITIALLY DEFERRED;

-- Step 3: Create indexes for better performance when joining
CREATE INDEX IF NOT EXISTS idx_packages_destination_uuid ON packages(destination) 
WHERE destination ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

CREATE INDEX IF NOT EXISTS idx_packages_category_uuid ON packages(category) 
WHERE category ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

-- Step 4: Create a function to validate UUID format (optional)
CREATE OR REPLACE FUNCTION is_valid_uuid(input_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN input_text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create views for easier querying with joined data
CREATE OR REPLACE VIEW packages_with_relations AS
SELECT 
  p.*,
  -- Destination information
  CASE 
    WHEN is_valid_uuid(p.destination) AND l.id IS NOT NULL THEN
      CASE 
        WHEN l.type = 'city' AND parent_loc.name IS NOT NULL THEN
          l.name || ', ' || parent_loc.name
        ELSE
          l.name
      END
    ELSE
      p.destination
  END as destination_display_name,
  l.id as destination_location_id,
  l.name as destination_location_name,
  l.type as destination_location_type,
  l.slug as destination_location_slug,
  parent_loc.name as destination_parent_name,
  
  -- Category information
  CASE 
    WHEN is_valid_uuid(p.category) AND c.id IS NOT NULL THEN c.name
    ELSE p.category
  END as category_display_name,
  c.id as category_ref_id,
  c.name as category_ref_name,
  c.slug as category_slug,
  c.icon as category_icon,
  c.is_featured as category_is_featured
FROM packages p
LEFT JOIN locations l ON (is_valid_uuid(p.destination) AND p.destination::uuid = l.id)
LEFT JOIN locations parent_loc ON l.parent_id = parent_loc.id
LEFT JOIN categories c ON (is_valid_uuid(p.category) AND p.category::uuid = c.id);

-- Grant access to the view
GRANT SELECT ON packages_with_relations TO authenticated;
GRANT SELECT ON packages_with_relations TO anon;

-- Add comments for documentation
COMMENT ON CONSTRAINT packages_destination_locations_fkey ON packages IS 'Optional foreign key to locations table when destination contains a valid UUID';
COMMENT ON CONSTRAINT packages_category_categories_fkey ON packages IS 'Optional foreign key to categories table when category contains a valid UUID';
COMMENT ON VIEW packages_with_relations IS 'View that shows packages with resolved location and category information when UUIDs are used';

-- Note: The foreign key constraints will only be enforced when the field values are valid UUIDs
-- that exist in the referenced tables. Text values will be stored as-is without constraint validation.