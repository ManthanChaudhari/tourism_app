import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// POST /api/admin/setup-storage - Create storage buckets and check setup
export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get current user for debugging
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('Setup storage - Current user:', {
      id: user?.id,
      email: user?.email,
      role: user?.role,
      metadata: user?.user_metadata,
      rawMetadata: user?.raw_user_meta_data
    })

    // Check if hotel-images bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json(
        { success: false, error: 'Failed to check storage buckets', details: listError.message },
        { status: 500 }
      )
    }

    console.log('Available buckets:', buckets?.map(b => b.name))

    const hotelImagesBucketExists = buckets.some(bucket => bucket.name === 'hotel-images')
    let bucketCreated = false

    if (!hotelImagesBucketExists) {
      console.log('Creating hotel-images bucket...')
      
      // Create hotel-images bucket
      const { error: createError } = await supabase.storage.createBucket('hotel-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 10485760 // 10MB
      })

      if (createError) {
        console.error('Error creating hotel-images bucket:', createError)
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to create hotel-images storage bucket',
            details: createError.message
          },
          { status: 500 }
        )
      }
      bucketCreated = true
      console.log('Bucket created successfully')
    } else {
      console.log('Bucket already exists')
    }

    // Test upload permissions
    let canUpload = false
    let uploadError = null
    
    try {
      // Try to upload a small test file
      const testFile = new Blob(['test'], { type: 'text/plain' })
      const testFileName = `test/${Date.now()}-test.txt`
      
      const { error: testUploadError } = await supabase.storage
        .from('hotel-images')
        .upload(testFileName, testFile)
      
      if (!testUploadError) {
        canUpload = true
        // Clean up test file
        await supabase.storage
          .from('hotel-images')
          .remove([testFileName])
      } else {
        uploadError = testUploadError.message
      }
    } catch (error) {
      uploadError = error.message
    }

    return NextResponse.json({
      success: true,
      message: bucketCreated 
        ? 'Storage bucket created successfully. You may need to apply storage policies manually.'
        : 'Storage setup completed successfully',
      buckets: {
        'hotel-images': hotelImagesBucketExists ? 'exists' : 'created'
      },
      permissions: {
        canUpload,
        uploadError
      },
      user: {
        authenticated: !!user,
        email: user?.email,
        hasAdminRole: user?.raw_user_meta_data?.role === 'admin'
      },
      note: !canUpload 
        ? 'Upload permissions not working. Please run the SQL policies from docs/simple-hotel-images-policies.sql in your Supabase SQL editor.'
        : 'Upload permissions working correctly.'
    })

  } catch (error) {
    console.error('Storage setup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET /api/admin/setup-storage - Check current storage setup
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    // Check buckets
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    const hotelImagesBucket = buckets?.find(bucket => bucket.name === 'hotel-images')

    // Test permissions
    const { data: objects, error: listObjectsError } = await supabase.storage
      .from('hotel-images')
      .list('', { limit: 1 })

    return NextResponse.json({
      success: true,
      user: {
        authenticated: !!user,
        email: user?.email,
        role: user?.role,
        adminRole: user?.raw_user_meta_data?.role
      },
      storage: {
        bucketExists: !!hotelImagesBucket,
        bucketPublic: hotelImagesBucket?.public,
        canListObjects: !listObjectsError,
        listError: listObjectsError?.message
      }
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}