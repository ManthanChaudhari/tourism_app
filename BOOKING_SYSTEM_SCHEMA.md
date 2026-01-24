# Unified Booking Management System - Database Schema

## Overview
This document outlines the database schema for a unified booking management system that handles Packages, Hotels, and Cars bookings. The system supports client-side booking creation with admin read-only access.

## Core Tables

### 1. bookings (Main Booking Table)
```sql
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code VARCHAR(20) UNIQUE NOT NULL, -- Format: BK-2026-000123
  booking_type VARCHAR(10) NOT NULL CHECK (booking_type IN ('package', 'hotel', 'car')),
  
  -- Service Reference
  service_id UUID NOT NULL, -- References packages.id, hotels.id, or cars.id
  service_title VARCHAR(255) NOT NULL, -- Snapshot of service name at booking time
  
  -- User Reference (nullable for guest bookings)
  user_id UUID REFERENCES auth.users(id),
  
  -- Booking Status
  booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  
  -- Date Information
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INTEGER NOT NULL,
  
  -- Guest Information
  adults_count INTEGER NOT NULL DEFAULT 1 CHECK (adults_count > 0),
  children_count INTEGER NOT NULL DEFAULT 0 CHECK (children_count >= 0),
  
  -- Service-Specific Counts (nullable)
  rooms_count INTEGER CHECK (rooms_count > 0), -- Hotel bookings only
  vehicles_count INTEGER CHECK (vehicles_count > 0), -- Car bookings only
  
  -- Pricing
  total_amount DECIMAL(12,2) NOT NULL CHECK (total_amount > 0),
  currency VARCHAR(3) DEFAULT 'INR',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_hotel_rooms CHECK (
    (booking_type = 'hotel' AND rooms_count IS NOT NULL) OR 
    (booking_type != 'hotel' AND rooms_count IS NULL)
  ),
  CONSTRAINT check_car_vehicles CHECK (
    (booking_type = 'car' AND vehicles_count IS NOT NULL) OR 
    (booking_type != 'car' AND vehicles_count IS NULL)
  ),
  CONSTRAINT check_date_order CHECK (end_date >= start_date)
);

-- Indexes for performance
CREATE INDEX idx_bookings_booking_code ON bookings(booking_code);
CREATE INDEX idx_bookings_type ON bookings(booking_type);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_service ON bookings(booking_type, service_id);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX idx_bookings_admin_filter ON bookings(booking_type, booking_status, payment_status, created_at DESC);

-- Function to generate unique booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  booking_code TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  -- Get next sequence number for the year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(booking_code FROM 9) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM bookings 
  WHERE booking_code LIKE 'BK-' || year_part || '-%';
  
  -- Format: BK-2026-000123
  booking_code := 'BK-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN booking_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking code
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

CREATE TRIGGER trigger_set_booking_code
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_code();
```

### 2. booking_customers (Customer Information)
```sql
CREATE TABLE booking_customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Customer Details
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  age INTEGER CHECK (age > 0 AND age <= 120),
  
  -- Customer Classification
  customer_type VARCHAR(10) NOT NULL CHECK (customer_type IN ('adult', 'child')),
  is_primary BOOLEAN DEFAULT false, -- Main contact person
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_primary_customer_details CHECK (
    (is_primary = true AND email IS NOT NULL AND phone IS NOT NULL) OR 
    (is_primary = false)
  )
);

-- Indexes
CREATE INDEX idx_booking_customers_booking_id ON booking_customers(booking_id);
CREATE INDEX idx_booking_customers_primary ON booking_customers(booking_id, is_primary);
CREATE INDEX idx_booking_customers_email ON booking_customers(email);
CREATE INDEX idx_booking_customers_phone ON booking_customers(phone);

-- Ensure only one primary customer per booking
CREATE UNIQUE INDEX idx_booking_customers_unique_primary 
ON booking_customers(booking_id) 
WHERE is_primary = true;
```

### 3. booking_payments (Payment Tracking)
```sql
CREATE TABLE booking_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Payment Gateway Information
  payment_gateway VARCHAR(20) NOT NULL CHECK (payment_gateway IN ('razorpay', 'stripe', 'cashfree', 'payu')),
  transaction_id VARCHAR(255),
  payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'upi', 'netbanking', 'wallet', 'emi')),
  
  -- Payment Details
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'INR',
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'success', 'failed', 'cancelled')),
  
  -- Timestamps
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Gateway Response (for debugging and reconciliation)
  raw_response JSONB,
  
  -- Additional fields for refunds
  refund_amount DECIMAL(12,2) DEFAULT 0,
  refund_status VARCHAR(20) CHECK (refund_status IN ('none', 'partial', 'full')),
  refunded_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_booking_payments_booking_id ON booking_payments(booking_id);
CREATE INDEX idx_booking_payments_transaction_id ON booking_payments(transaction_id);
CREATE INDEX idx_booking_payments_status ON booking_payments(payment_status);
CREATE INDEX idx_booking_payments_gateway ON booking_payments(payment_gateway);
CREATE INDEX idx_booking_payments_paid_at ON booking_payments(paid_at DESC);
```

### 4. booking_meta (Flexible Service-Specific Data)
```sql
CREATE TABLE booking_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Key-Value Storage
  key VARCHAR(100) NOT NULL,
  value TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique key per booking
  UNIQUE(booking_id, key)
);

-- Indexes
CREATE INDEX idx_booking_meta_booking_id ON booking_meta(booking_id);
CREATE INDEX idx_booking_meta_key ON booking_meta(key);
CREATE INDEX idx_booking_meta_booking_key ON booking_meta(booking_id, key);
```

## Common Booking Meta Keys

### Package Bookings
- `pickup_location` - Pickup point
- `drop_location` - Drop-off point  
- `meal_plan` - Meal preferences
- `special_requests` - Additional requests

### Hotel Bookings
- `room_type` - Type of room booked
- `room_ids` - JSON array of specific room IDs
- `meal_plan` - Meal plan selected
- `special_requests` - Special accommodation requests
- `check_in_time` - Preferred check-in time
- `check_out_time` - Preferred check-out time

### Car Bookings
- `pickup_location` - Pickup address/location
- `drop_location` - Drop-off address/location
- `car_model` - Specific car model
- `driver_required` - Boolean for self-drive vs chauffeur
- `pickup_time` - Preferred pickup time
- `additional_driver` - Additional driver details

## Row Level Security (RLS) Policies

### bookings table
```sql
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own bookings
CREATE POLICY "Users can read own bookings" ON bookings
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Allow guest users to read bookings they created (via session or email)
CREATE POLICY "Allow booking access via session" ON bookings
FOR SELECT TO anon
USING (true); -- Will be filtered by booking_code in application

-- Allow admins to read all bookings
CREATE POLICY "Admins can read all bookings" ON bookings
FOR SELECT TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Allow authenticated users to create bookings
CREATE POLICY "Users can create bookings" ON bookings
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Allow anonymous users to create guest bookings
CREATE POLICY "Allow guest bookings" ON bookings
FOR INSERT TO anon
WITH CHECK (user_id IS NULL);

-- Prevent updates and deletes (bookings are immutable after creation)
CREATE POLICY "Prevent booking modifications" ON bookings
FOR UPDATE TO authenticated
USING (false);

CREATE POLICY "Prevent booking deletions" ON bookings
FOR DELETE TO authenticated
USING (false);
```

### booking_customers table
```sql
ALTER TABLE booking_customers ENABLE ROW LEVEL SECURITY;

-- Allow access based on booking access
CREATE POLICY "Access via booking ownership" ON booking_customers
FOR ALL TO authenticated
USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  )
);

-- Allow anonymous access for guest bookings
CREATE POLICY "Allow guest booking customers" ON booking_customers
FOR ALL TO anon
USING (true); -- Will be filtered by booking ownership in application
```

### booking_payments table
```sql
ALTER TABLE booking_payments ENABLE ROW LEVEL SECURITY;

-- Similar policies as booking_customers
CREATE POLICY "Access via booking ownership" ON booking_payments
FOR ALL TO authenticated
USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  )
);

CREATE POLICY "Allow guest booking payments" ON booking_payments
FOR ALL TO anon
USING (true);
```

### booking_meta table
```sql
ALTER TABLE booking_meta ENABLE ROW LEVEL SECURITY;

-- Similar policies as other booking-related tables
CREATE POLICY "Access via booking ownership" ON booking_meta
FOR ALL TO authenticated
USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  )
);

CREATE POLICY "Allow guest booking meta" ON booking_meta
FOR ALL TO anon
USING (true);
```

## Views for Admin Dashboard

### Admin Booking List View
```sql
CREATE VIEW admin_booking_list AS
SELECT 
  b.id,
  b.booking_code,
  b.booking_type,
  b.service_title,
  b.booking_status,
  b.payment_status,
  b.start_date,
  b.end_date,
  b.duration_days,
  b.adults_count,
  b.children_count,
  b.rooms_count,
  b.vehicles_count,
  b.total_amount,
  b.currency,
  b.created_at,
  
  -- Primary customer details
  pc.full_name as customer_name,
  pc.email as customer_email,
  pc.phone as customer_phone,
  
  -- Payment details
  p.payment_gateway,
  p.payment_method,
  p.paid_at
  
FROM bookings b
LEFT JOIN booking_customers pc ON b.id = pc.booking_id AND pc.is_primary = true
LEFT JOIN booking_payments p ON b.id = p.booking_id AND p.payment_status = 'success'
ORDER BY b.created_at DESC;
```

## Sample Data
```sql
-- Sample booking
INSERT INTO bookings (
  booking_type, service_id, service_title, user_id,
  start_date, end_date, duration_days,
  adults_count, children_count, rooms_count,
  total_amount
) VALUES (
  'hotel', 
  'hotel-uuid-here', 
  'Grand Palace Hotel - Deluxe Room',
  'user-uuid-here',
  '2026-03-15',
  '2026-03-18',
  3,
  2,
  1,
  1,
  15000.00
);

-- Sample customer
INSERT INTO booking_customers (
  booking_id, full_name, email, phone, age, customer_type, is_primary
) VALUES (
  'booking-uuid-here',
  'John Doe',
  'john@example.com',
  '+91-9876543210',
  35,
  'adult',
  true
);

-- Sample meta data
INSERT INTO booking_meta (booking_id, key, value) VALUES 
('booking-uuid-here', 'room_type', 'Deluxe'),
('booking-uuid-here', 'meal_plan', 'Breakfast Included'),
('booking-uuid-here', 'check_in_time', '14:00'),
('booking-uuid-here', 'special_requests', 'High floor room preferred');
```

## Notes
1. **Immutable Bookings**: Once created, bookings cannot be modified to maintain data integrity
2. **Flexible Meta Storage**: Service-specific data is stored in key-value format for maximum flexibility
3. **Guest Bookings**: System supports both authenticated user bookings and guest bookings
4. **Audit Trail**: All timestamps are preserved for tracking and reporting
5. **Payment Tracking**: Complete payment lifecycle tracking with gateway integration
6. **Admin Read-Only**: Admin panel can only view and filter, no modifications allowed
7. **Scalable Design**: Schema supports high-volume bookings with proper indexing
8. **Data Consistency**: Foreign key constraints and check constraints ensure data integrity