-- Hotel Images Storage Bucket Policies
-- This file contains the RLS policies for the hotel-images storage bucket in Supabase

-- =====================================================
-- STORAGE BUCKET POLICIES FOR HOTEL-IMAGES
-- =====================================================

-- Enable RLS on the storage.objects table (if not already enabled)
-- This is usually enabled by default in Supabase
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 1. PUBLIC READ ACCESS
-- Allow anyone to view/download hotel images (for public website)
-- =====================================================

CREATE POLICY "Public Access for Hotel Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotel-images');

-- =====================================================
-- 2. ADMIN UPLOAD ACCESS
-- Allow authenticated admin users to upload hotel images
-- =====================================================

CREATE POLICY "Admin Upload Hotel Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- =====================================================
-- 3. ADMIN UPDATE ACCESS
-- Allow authenticated admin users to update hotel images
-- =====================================================

CREATE POLICY "Admin Update Hotel Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- =====================================================
-- 4. ADMIN DELETE ACCESS
-- Allow authenticated admin users to delete hotel images
-- =====================================================

CREATE POLICY "Admin Delete Hotel Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- =====================================================
-- ALTERNATIVE SIMPLER POLICIES (if user roles are not in metadata)
-- Use these if you don't store admin role in user metadata
-- =====================================================

-- If you have a separate admin_users table or use email-based admin check:

/*
-- Admin Upload (Email-based check)
CREATE POLICY "Admin Upload Hotel Images - Email Based"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND auth.email() IN (
    'admin@yourdomain.com',
    'manager@yourdomain.com'
    -- Add more admin emails as needed
  )
);

-- Admin Update (Email-based check)
CREATE POLICY "Admin Update Hotel Images - Email Based"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND auth.email() IN (
    'admin@yourdomain.com',
    'manager@yourdomain.com'
  )
)
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND auth.email() IN (
    'admin@yourdomain.com',
    'manager@yourdomain.com'
  )
);

-- Admin Delete (Email-based check)
CREATE POLICY "Admin Delete Hotel Images - Email Based"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
  AND auth.email() IN (
    'admin@yourdomain.com',
    'manager@yourdomain.com'
  )
);
*/

-- =====================================================
-- BUCKET CONFIGURATION
-- =====================================================

-- Create the bucket with proper configuration (run this in Supabase SQL editor)
/*
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hotel-images',
  'hotel-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
*/

-- =====================================================
-- POLICY EXPLANATIONS
-- =====================================================

/*
POLICY BREAKDOWN:

1. PUBLIC READ ACCESS:
   - Allows anyone (authenticated or not) to view hotel images
   - Essential for public website functionality
   - Only applies to SELECT operations (viewing/downloading)

2. ADMIN UPLOAD ACCESS:
   - Restricts image uploads to authenticated admin users only
   - Checks user role in metadata or email whitelist
   - Prevents unauthorized users from uploading images

3. ADMIN UPDATE ACCESS:
   - Allows admins to update existing images (replace files)
   - Same authentication checks as upload
   - Useful for updating hotel images

4. ADMIN DELETE ACCESS:
   - Allows admins to delete hotel images
   - Important for managing storage space
   - Prevents accidental deletions by non-admin users

SECURITY CONSIDERATIONS:
- Public read access is necessary for website functionality
- All write operations (INSERT/UPDATE/DELETE) require admin authentication
- File size and type restrictions are enforced at bucket level
- Consider implementing additional logging for audit trails
*/

-- =====================================================
-- TESTING THE POLICIES
-- =====================================================

/*
To test these policies:

1. Test public read access:
   - Visit any hotel image URL in browser (should work)
   - Try accessing from unauthenticated API call (should work)

2. Test admin upload:
   - Try uploading as admin user (should work)
   - Try uploading as regular user (should fail)
   - Try uploading as unauthenticated user (should fail)

3. Test admin delete:
   - Try deleting as admin user (should work)
   - Try deleting as regular user (should fail)

Example test queries:
SELECT * FROM storage.objects WHERE bucket_id = 'hotel-images';
*/