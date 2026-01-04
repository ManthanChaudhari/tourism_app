import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can customize this logic based on your user roles)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    
    // Extract form fields
    const packageData = {
      title: formData.get('title'),
      destination: formData.get('destination'),
      category: formData.get('category'),
      days: parseInt(formData.get('days')),
      nights: parseInt(formData.get('nights')),
      price_per_person: parseFloat(formData.get('pricePerPerson')),
      discount: formData.get('discount') ? parseFloat(formData.get('discount')) : null,
      description: formData.get('description'),
      pickup_location: formData.get('pickupLocation') || null,
      drop_location: formData.get('dropLocation') || null,
      status: formData.get('status') || 'draft',
      inclusions: JSON.parse(formData.get('inclusions') || '[]'),
      exclusions: JSON.parse(formData.get('exclusions') || '[]'),
      itinerary: JSON.parse(formData.get('itinerary') || '[]'),
      created_by: user.id
    }

    if (!packageData.title || !packageData.destination || !packageData.days || 
        !packageData.nights || !packageData.price_per_person || !packageData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let thumbnailImageUrl = null
    let galleryImageUrls = []

    const thumbnailImage = formData.get('thumbnailImage')
    if (thumbnailImage && thumbnailImage.size > 0) {
      const thumbnailFileName = `packages/${Date.now()}-${thumbnailImage.name}`
      
      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from('package-images')
        .upload(thumbnailFileName, thumbnailImage, {
          cacheControl: '3600',
          upsert: false
        })

      if (thumbnailError) {
        console.error('Thumbnail upload error:', thumbnailError)
        return NextResponse.json(
          { error: 'Failed to upload thumbnail image' },
          { status: 500 }
        )
      }

      const { data: { publicUrl } } = supabase.storage
        .from('package-images')
        .getPublicUrl(thumbnailFileName)
      
      thumbnailImageUrl = publicUrl
    }

    const galleryImages = formData.getAll('galleryImages')
    for (const image of galleryImages) {
      if (image && image.size > 0) {
        const galleryFileName = `packages/gallery/${Date.now()}-${image.name}`
        
        const { data: galleryData, error: galleryError } = await supabase.storage
          .from('package-images')
          .upload(galleryFileName, image, {
            cacheControl: '3600',
            upsert: false
          })

        if (!galleryError) {
          const { data: { publicUrl } } = supabase.storage
            .from('package-images')
            .getPublicUrl(galleryFileName)
          
          galleryImageUrls.push(publicUrl)
        }
      }
    }

    packageData.thumbnail_image_url = thumbnailImageUrl
    packageData.gallery_image_urls = galleryImageUrls

    const { data: newPackage, error: insertError } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create package' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      package: newPackage
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    // Get all packages
    const { data: packages, error: fetchError } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch packages' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      packages
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}