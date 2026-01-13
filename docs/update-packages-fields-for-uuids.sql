-- Migration: Update packages table fields to support UUIDs
-- This allows the destination and category fields to store either UUIDs or text

-- Step 1: Update field types to TEXT to support UUIDs (if they're currently VARCHAR with length limits)
ALTER TABLE packages ALTER COLUMN destination TYPE TEXT;
ALTER TABLE packages ALTER COLUMN category TYPE TEXT;

-- Step 2: Create conditional indexes for better performance when fields contain UUIDs
CREATE INDEX IF NOT EXISTS idx_packages_destination_uuid ON packages(destination) 
WHERE destination ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

CREATE INDEX IF NOT EXISTS idx_packages_category_uuid ON packages(category) 
WHERE category ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

-- Step 3: Create a helper function to check if a value is a valid UUID
CREATE OR REPLACE FUNCTION is_valid_uuid(input_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN input_text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
END;
$$ LANGUAGE plpgsql;

-- Step 4: Add comments for documentation
COMMENT ON COLUMN packages.destination IS 'Can store location UUID (referencing locations table) or plain text for backward compatibility';
COMMENT ON COLUMN packages.category IS 'Can store category UUID (referencing categories table) or plain text for backward compatibility';

-- Note: No foreign key constraints are added to maintain flexibility
-- The API will handle UUID detection and data resolution automatically