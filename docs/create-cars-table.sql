-- Cars table for car rental management
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  location_id UUID REFERENCES locations(id) ON DELETE SET NULL,
  seating_capacity INTEGER NOT NULL CHECK (seating_capacity > 0),
  luggage_capacity VARCHAR(100),
  fuel_type VARCHAR(20) DEFAULT 'petrol' CHECK (fuel_type IN ('petrol', 'diesel', 'ev')),
  transmission VARCHAR(20) DEFAULT 'manual' CHECK (transmission IN ('manual', 'automatic')),
  ac_available BOOLEAN DEFAULT true,
  price_per_day DECIMAL(10,2) NOT NULL CHECK (price_per_day >= 0),
  price_per_hour DECIMAL(10,2) CHECK (price_per_hour >= 0),
  extra_km_price DECIMAL(10,2) CHECK (extra_km_price >= 0),
  driver_charge_per_day DECIMAL(10,2) CHECK (driver_charge_per_day >= 0),
  security_deposit DECIMAL(10,2) CHECK (security_deposit >= 0),
  min_booking_hours INTEGER CHECK (min_booking_hours >= 0),
  min_booking_days INTEGER CHECK (min_booking_days >= 0),
  fuel_policy TEXT,
  cancellation_policy TEXT,
  allow_one_way BOOLEAN DEFAULT false,
  driver_included BOOLEAN DEFAULT false,
  thumbnail_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_cars_category_id ON cars(category_id);
CREATE INDEX idx_cars_location_id ON cars(location_id);
CREATE INDEX idx_cars_is_active ON cars(is_active);
CREATE INDEX idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX idx_cars_transmission ON cars(transmission);
CREATE INDEX idx_cars_seating_capacity ON cars(seating_capacity);
CREATE INDEX idx_cars_price_per_day ON cars(price_per_day);
CREATE INDEX idx_cars_created_at ON cars(created_at DESC);
CREATE INDEX idx_cars_min_booking_hours ON cars(min_booking_hours);
CREATE INDEX idx_cars_min_booking_days ON cars(min_booking_days);
CREATE INDEX idx_cars_allow_one_way ON cars(allow_one_way);
CREATE INDEX idx_cars_driver_included ON cars(driver_included);

-- Composite indexes for common queries
CREATE INDEX idx_cars_active_category ON cars(is_active, category_id);
CREATE INDEX idx_cars_active_location ON cars(is_active, location_id);
CREATE INDEX idx_cars_active_price ON cars(is_active, price_per_day);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_cars_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_cars_updated_at();

-- Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Allow public to read active cars
CREATE POLICY "Allow public read active cars" ON cars
FOR SELECT TO public
USING (is_active = true);

-- Allow admins to read all cars
CREATE POLICY "Allow admin read all cars" ON cars
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to insert cars
CREATE POLICY "Allow admin insert cars" ON cars
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to update cars
CREATE POLICY "Allow admin update cars" ON cars
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to delete cars
CREATE POLICY "Allow admin delete cars" ON cars
FOR DELETE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Sample data (optional - replace with actual category and location UUIDs)
-- INSERT INTO cars (
--   name, brand, model, year, category_id, location_id, 
--   seating_capacity, luggage_capacity, fuel_type, transmission, 
--   ac_available, price_per_day, price_per_hour, extra_km_price, 
--   driver_charge_per_day, security_deposit, is_active
-- ) VALUES 
-- (
--   'Swift Dzire', 'Maruti Suzuki', 'Dzire', 2023, 'uuid-here', 'uuid-here',
--   4, '2 large bags', 'petrol', 'manual',
--   true, 2500.00, 300.00, 12.00,
--   800.00, 5000.00, true
-- );

-- Storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Storage policies for car images
CREATE POLICY "Allow authenticated uploads to car-images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'car-images');

CREATE POLICY "Allow public access to car-images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'car-images');

CREATE POLICY "Allow admin deletes from car-images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'car-images' AND auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Comments for documentation
COMMENT ON TABLE cars IS 'Car rental inventory management table';
COMMENT ON COLUMN cars.name IS 'Display name for the car (e.g., Swift Dzire)';
COMMENT ON COLUMN cars.brand IS 'Car manufacturer (e.g., Maruti Suzuki)';
COMMENT ON COLUMN cars.model IS 'Car model (e.g., Dzire)';
COMMENT ON COLUMN cars.year IS 'Manufacturing year';
COMMENT ON COLUMN cars.category_id IS 'Foreign key to categories table';
COMMENT ON COLUMN cars.location_id IS 'Foreign key to locations table (base city)';
COMMENT ON COLUMN cars.seating_capacity IS 'Number of seats available';
COMMENT ON COLUMN cars.luggage_capacity IS 'Luggage capacity description';
COMMENT ON COLUMN cars.fuel_type IS 'Fuel type: petrol, diesel, or ev';
COMMENT ON COLUMN cars.transmission IS 'Transmission type: manual or automatic';
COMMENT ON COLUMN cars.ac_available IS 'Whether AC is available';
COMMENT ON COLUMN cars.price_per_day IS 'Daily rental price in currency';
COMMENT ON COLUMN cars.price_per_hour IS 'Hourly rental price (optional)';
COMMENT ON COLUMN cars.extra_km_price IS 'Price per extra kilometer';
COMMENT ON COLUMN cars.driver_charge_per_day IS 'Daily driver charge';
COMMENT ON COLUMN cars.security_deposit IS 'Security deposit amount';
COMMENT ON COLUMN cars.min_booking_hours IS 'Minimum booking duration in hours';
COMMENT ON COLUMN cars.min_booking_days IS 'Minimum booking duration in days';
COMMENT ON COLUMN cars.fuel_policy IS 'Fuel policy description (e.g., full-to-full, same-to-same)';
COMMENT ON COLUMN cars.cancellation_policy IS 'Cancellation policy terms and conditions';
COMMENT ON COLUMN cars.allow_one_way IS 'Whether one-way rentals are allowed';
COMMENT ON COLUMN cars.driver_included IS 'Whether driver is included in the rental';
COMMENT ON COLUMN cars.thumbnail_image IS 'Main car image URL';
COMMENT ON COLUMN cars.gallery_images IS 'JSON array of additional car images';
COMMENT ON COLUMN cars.is_active IS 'Whether the car is available for booking';