import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/test-auth - Test current user authentication and permissions
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      return NextResponse.json({
        success: false,
        error: 'Authentication error',
        details: userError.message
      }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No authenticated user found'
      }, { status: 401 })
    }

    // Check storage buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    // Check if hotel-images bucket exists
    const hotelImagesBucket = buckets?.find(bucket => bucket.name === 'hotel-images')

    // Test storage permissions by trying to list objects
    const { data: objects, error: objectsError } = await supabase.storage
      .from('hotel-images')
      .list()

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        metadata: user.user_metadata,
        rawMetadata: user.raw_user_meta_data,
        appMetadata: user.app_metadata
      },
      storage: {
        bucketsAvailable: buckets?.length || 0,
        hotelImagesBucketExists: !!hotelImagesBucket,
        hotelImagesBucketConfig: hotelImagesBucket,
        canListObjects: !objectsError,
        objectsError: objectsError?.message,
        objectsCount: objects?.length || 0
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Auth test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}