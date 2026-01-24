-- Fix for the ambiguous booking_code column reference error
-- This replaces the existing generate_booking_code function

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS trigger_set_booking_code ON bookings;
DROP FUNCTION IF EXISTS set_booking_code();
DROP FUNCTION IF EXISTS generate_booking_code();

-- Fixed function to generate unique booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  new_booking_code TEXT;  -- Renamed variable to avoid conflict
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Get next sequence number for the year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(b.booking_code FROM 9) AS INTEGER)  -- Use table alias
  ), 0) + 1
  INTO sequence_num
  FROM bookings b  -- Add table alias
  WHERE b.booking_code LIKE 'BK-' || year_part || '-%';
  
  -- Format: BK-2026-000123
  new_booking_code := 'BK-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN new_booking_code;
END;
$$ LANGUAGE plpgsql;

-- Fixed trigger function
CREATE OR REPLACE FUNCTION set_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
    NEW.booking_code := generate_booking_code();
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_set_booking_code
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_code();