-- QUICK FIX: Run this in your Supabase SQL editor to fix the booking_code ambiguity error

-- Step 1: Drop existing functions and trigger
DROP TRIGGER IF EXISTS trigger_set_booking_code ON bookings;
DROP FUNCTION IF EXISTS set_booking_code();
DROP FUNCTION IF EXISTS generate_booking_code();

-- Step 2: Create fixed booking code generation function
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  new_booking_code TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Get next sequence number for the year (using table alias to avoid ambiguity)
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(b.booking_code FROM 9) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM bookings b
  WHERE b.booking_code LIKE 'BK-' || year_part || '-%';
  
  -- Format: BK-2026-000123
  new_booking_code := 'BK-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN new_booking_code;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create fixed trigger function
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

-- Step 4: Recreate the trigger
CREATE TRIGGER trigger_set_booking_code
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_code();

-- Step 5: Test the fix (optional)
-- This should work without errors now
-- INSERT INTO bookings (booking_type, service_id, service_title, start_date, end_date, adults_count, children_count, total_amount) 
-- VALUES ('package', 'test-id', 'Test Package', '2026-03-15', '2026-03-18', 2, 0, 15000.00);