# Database Schema for Tour Packages

## Required Tables

### 1. packages
Main table for storing tour package information.

```sql
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  price_per_person DECIMAL(10,2) NOT NULL,
  discount DECIMAL(5,2), -- percentage discount (0-100)
  description TEXT,
  pickup_location VARCHAR(255),
  drop_location VARCHAR(255),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  thumbnail_image_url TEXT,
  gallery_image_urls TEXT[], -- array of image URLs
  inclusions TEXT[], -- array of inclusion strings
  exclusions TEXT[], -- array of exclusion strings
  itinerary JSONB, -- array of {day, title, description} objects
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. profiles (if not exists)
User profiles table to store user roles and additional information.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Alternative: Database Trigger Approach
You can also create a database trigger to automatically create profiles when users are created:

```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Storage Buckets

### package-images
Supabase Storage bucket for package images.

```sql
-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('package-images', 'package-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'package-images');

-- Allow public access to view images
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'package-images');

-- Allow admins to delete images
CREATE POLICY "Allow admin deletes" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'package-images' AND auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));
```

## Row Level Security (RLS)

### packages table policies

```sql
-- Enable RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Allow public to read published packages
CREATE POLICY "Allow public read published packages" ON packages
FOR SELECT TO public
USING (status = 'published');

-- Allow admins to read all packages
CREATE POLICY "Allow admin read all packages" ON packages
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to insert packages
CREATE POLICY "Allow admin insert packages" ON packages
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to update packages
CREATE POLICY "Allow admin update packages" ON packages
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to delete packages
CREATE POLICY "Allow admin delete packages" ON packages
FOR DELETE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));
```

### profiles table policies

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile (except role)
CREATE POLICY "Allow users to update own profile" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Allow admins to read all profiles
CREATE POLICY "Allow admin read all profiles" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to update user roles
CREATE POLICY "Allow admin update user roles" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));
```

## Indexes for Performance

```sql
-- Index on status for filtering published packages
CREATE INDEX idx_packages_status ON packages(status);

-- Index on category for filtering by package type
CREATE INDEX idx_packages_category ON packages(category);

-- Index on created_at for sorting
CREATE INDEX idx_packages_created_at ON packages(created_at DESC);

-- Index on destination for search
CREATE INDEX idx_packages_destination ON packages(destination);

-- Composite index for admin queries
CREATE INDEX idx_packages_admin ON packages(status, created_at DESC);
```

## Sample Data

```sql
-- Create an admin user profile (replace with actual user ID)
INSERT INTO profiles (id, email, role) VALUES 
('your-admin-user-id', 'admin@example.com', 'admin');

-- Sample package data
INSERT INTO packages (
  title, destination, category, days, nights, price_per_person, 
  description, status, inclusions, exclusions, itinerary, created_by
) VALUES (
  'Bali Adventure Package',
  'Bali, Indonesia',
  'adventure',
  7,
  6,
  1299.00,
  'Experience the magic of Bali with our comprehensive adventure package.',
  'published',
  ARRAY['Round-trip airport transfers', '6 nights accommodation', 'Daily breakfast'],
  ARRAY['International flights', 'Travel insurance', 'Personal expenses'],
  '[
    {"day": 1, "title": "Arrival in Denpasar", "description": "Airport pickup and hotel transfer"},
    {"day": 2, "title": "Ubud Cultural Tour", "description": "Visit temples and rice terraces"}
  ]'::jsonb,
  'your-admin-user-id'
);
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (if needed for admin operations)
```

## Notes

1. The `created_by` field links packages to the admin user who created them
2. Image URLs are stored as text/array - actual files are in Supabase Storage
3. Itinerary is stored as JSONB for flexibility
4. RLS policies ensure only admins can manage packages
5. Public users can only view published packages
6. The discount field stores percentage values (0-100)
7. Categories are stored as lowercase strings for consistency