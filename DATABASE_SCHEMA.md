# Database Schema for Tour Packages

## Required Tables

### 1. packages
Main table for storing tour package information.

```sql
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  destination TEXT, -- Can store location UUID or text
  category TEXT, -- Can store category UUID or text  
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

-- Create indexes for better performance when the fields contain UUIDs
CREATE INDEX idx_packages_destination_uuid ON packages(destination) 
WHERE destination ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

CREATE INDEX idx_packages_category_uuid ON packages(category) 
WHERE category ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
```

### 2. categories
Category management table for package categories.

```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- icon name or image url
  banner_image TEXT, -- category banner
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_categories_status ON categories(status);
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_featured ON categories(is_featured);
CREATE INDEX idx_categories_status_featured ON categories(status, is_featured);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_categories_updated_at();
```

### 3. locations
Location management table for states and cities.

```sql
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('state', 'city')),
  parent_id UUID REFERENCES locations(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_city_has_parent CHECK (
    (type = 'city' AND parent_id IS NOT NULL) OR 
    (type = 'state' AND parent_id IS NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_locations_type ON locations(type);
CREATE INDEX idx_locations_parent_id ON locations(parent_id);
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_active ON locations(is_active);
CREATE INDEX idx_locations_type_active ON locations(type, is_active);

-- Function to auto-generate slug from name
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(trim(input_text), '[^a-zA-Z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug if not provided
CREATE OR REPLACE FUNCTION set_location_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_location_slug
  BEFORE INSERT OR UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION set_location_slug();
```

### 4. profiles (if not exists)
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

### categories table policies

```sql
-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public to read active categories
CREATE POLICY "Allow public read active categories" ON categories
FOR SELECT TO public
USING (status = 'active');

-- Allow admins to read all categories
CREATE POLICY "Allow admin read all categories" ON categories
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to insert categories
CREATE POLICY "Allow admin insert categories" ON categories
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to update categories
CREATE POLICY "Allow admin update categories" ON categories
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to delete categories
CREATE POLICY "Allow admin delete categories" ON categories
FOR DELETE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));
```

### locations table policies

```sql
-- Enable RLS
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow public to read active locations
CREATE POLICY "Allow public read active locations" ON locations
FOR SELECT TO public
USING (is_active = true);

-- Allow admins to read all locations
CREATE POLICY "Allow admin read all locations" ON locations
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to insert locations
CREATE POLICY "Allow admin insert locations" ON locations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to update locations
CREATE POLICY "Allow admin update locations" ON locations
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Prevent deletion of locations (use is_active instead)
CREATE POLICY "Prevent location deletion" ON locations
FOR DELETE TO authenticated
USING (false);
```

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

-- Sample categories data
INSERT INTO categories (name, slug, description, icon, display_order, is_featured, status) VALUES 
('Adventure', 'adventure', 'Thrilling outdoor experiences and adrenaline-pumping activities', '🏔️', 1, true, 'active'),
('Honeymoon', 'honeymoon', 'Romantic getaways perfect for couples and newlyweds', '💕', 2, true, 'active'),
('Family', 'family', 'Fun-filled vacations suitable for families with children', '👨‍👩‍👧‍👦', 3, true, 'active'),
('Beach', 'beach', 'Relaxing coastal destinations with sun, sand, and sea', '🏖️', 4, false, 'active'),
('Cultural', 'cultural', 'Immersive experiences exploring local traditions and heritage', '🏛️', 5, false, 'active'),
('Luxury', 'luxury', 'Premium travel experiences with top-tier accommodations', '✨', 6, false, 'active'),
('Budget', 'budget', 'Affordable travel options without compromising on experience', '💰', 7, false, 'active'),
('Wildlife', 'wildlife', 'Safari adventures and wildlife observation tours', '🦁', 8, false, 'active');

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
8. **Flexible Field Storage**: The `destination` and `category` fields can store either UUIDs (referencing locations/categories tables) or plain text for backward compatibility.
9. **Smart API Resolution**: The APIs automatically detect if field values are UUIDs and fetch related data accordingly, falling back to displaying the raw text value.
10. **Location Integration**: The admin forms use a searchable dropdown that pulls from the locations table, storing the location ID directly in the `destination` field.
11. **Category Integration**: The admin forms use a searchable dropdown that pulls from the categories table, storing the category ID directly in the `category` field.
12. **Backward Compatibility**: Existing packages with text destinations and categories continue to work seamlessly alongside new UUID-based entries.