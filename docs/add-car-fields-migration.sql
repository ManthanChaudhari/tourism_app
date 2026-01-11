-- Migration script to add new fields to existing cars table
-- Run this if you already have a cars table and need to add the new fields

-- Add new columns to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS min_booking_hours INTEGER CHECK (min_booking_hours >= 0);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS min_booking_days INTEGER CHECK (min_booking_days >= 0);
ALTER TABLE cars ADD COLUMN IF NOT EXISTS fuel_policy TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS cancellation_policy TEXT;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS allow_one_way BOOLEAN DEFAULT false;
ALTER TABLE cars ADD COLUMN IF NOT EXISTS driver_included BOOLEAN DEFAULT false;

-- Add indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_cars_min_booking_hours ON cars(min_booking_hours);
CREATE INDEX IF NOT EXISTS idx_cars_min_booking_days ON cars(min_booking_days);
CREATE INDEX IF NOT EXISTS idx_cars_allow_one_way ON cars(allow_one_way);
CREATE INDEX IF NOT EXISTS idx_cars_driver_included ON cars(driver_included);

-- Add comments for documentation
COMMENT ON COLUMN cars.min_booking_hours IS 'Minimum booking duration in hours';
COMMENT ON COLUMN cars.min_booking_days IS 'Minimum booking duration in days';
COMMENT ON COLUMN cars.fuel_policy IS 'Fuel policy description (e.g., full-to-full, same-to-same)';
COMMENT ON COLUMN cars.cancellation_policy IS 'Cancellation policy terms and conditions';
COMMENT ON COLUMN cars.allow_one_way IS 'Whether one-way rentals are allowed';
COMMENT ON COLUMN cars.driver_included IS 'Whether driver is included in the rental';

-- Update existing records with default values (optional)
-- UPDATE cars SET 
--   min_booking_hours = 4,
--   min_booking_days = 1,
--   fuel_policy = 'full-to-full',
--   allow_one_way = false,
--   driver_included = false
-- WHERE min_booking_hours IS NULL;