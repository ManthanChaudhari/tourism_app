-- SIMPLE HOTEL IMAGES STORAGE POLICIES FOR TESTING
-- Use these policies first to test the upload functionality

-- =====================================================
-- STEP 1: Create the bucket (if not exists)
-- =====================================================
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

-- =====================================================
-- STEP 2: Drop existing policies (if any)
-- =====================================================
DROP POLICY IF EXISTS "Public Access for Hotel Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Hotel Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Hotel Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Hotel Images" ON storage.objects;

-- =====================================================
-- STEP 3: Create simple policies for testing
-- =====================================================

-- Allow public read access
CREATE POLICY "Public Read Hotel Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hotel-images');

-- Allow authenticated users to upload (temporary - for testing)
CREATE POLICY "Authenticated Upload Hotel Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update (temporary - for testing)
CREATE POLICY "Authenticated Update Hotel Images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete (temporary - for testing)
CREATE POLICY "Authenticated Delete Hotel Images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'hotel-images' 
  AND auth.role() = 'authenticated'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'hotel-images';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'objects' AND policyname LIKE '%Hotel Images%';

-- Check current user
SELECT auth.uid(), auth.role(), auth.email();