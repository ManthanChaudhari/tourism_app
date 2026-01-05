import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const publicAccess = searchParams.get('public') === 'true'
    
    // For public access, we don't require authentication
    if (!publicAccess) {
      // Verify user session for admin access
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
    }

    const awaitedParams = await params;
    const packageId = awaitedParams.id;

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('packages')
      .select(publicAccess ? `
        id,
        title,
        destination,
        category,
        days,
        nights,
        price_per_person,
        discount,
        description,
        thumbnail_image_url,
        gallery_image_urls,
        inclusions,
        exclusions,
        itinerary,
        pickup_location,
        drop_location,
        created_at,
        updated_at,
        destination_location:locations(id, name, slug, type, parent:parent_id(name))
      ` : `
        *,
        destination_location:locations(id, name, slug, type, parent:parent_id(name))
      `)
      .eq('id', packageId)

    // For public access, only show published packages
    if (publicAccess) {
      query = query.eq('status', 'published')
    }

    const { data: packageData, error: fetchError } = await query.single()

    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch package' },
        { status: 500 }
      )
    }

    // Format package for public consumption if needed
    let formattedPackage = packageData
    if (publicAccess) {
      // Get destination name - prefer location data over text field
      let destinationName = packageData.destination
      if (packageData.destination_location) {
        if (packageData.destination_location.type === 'city' && packageData.destination_location.parent) {
          destinationName = `${packageData.destination_location.name}, ${packageData.destination_location.parent.name}`
        } else {
          destinationName = packageData.destination_location.name
        }
      }

      formattedPackage = {
        id: packageData.id,
        title: packageData.title,
        destination: destinationName,
        category: packageData.category,
        duration: `${packageData.days} days, ${packageData.nights} nights`,
        days: packageData.days,
        nights: packageData.nights,
        price: packageData.price_per_person,
        originalPrice: packageData.discount ? packageData.price_per_person : null,
        discountedPrice: packageData.discount ? 
          Math.round(packageData.price_per_person - (packageData.price_per_person * packageData.discount / 100)) : 
          packageData.price_per_person,
        discount: packageData.discount,
        description: packageData.description,
        image: packageData.thumbnail_image_url,
        images: packageData.gallery_image_urls || [],
        inclusions: packageData.inclusions || [],
        exclusions: packageData.exclusions || [],
        itinerary: packageData.itinerary || [],
        pickupLocation: packageData.pickup_location,
        dropLocation: packageData.drop_location,
        createdAt: packageData.created_at,
        updatedAt: packageData.updated_at
      }
    } else {
      // For admin access, also format destination names
      let destinationName = packageData.destination
      if (packageData.destination_location) {
        if (packageData.destination_location.type === 'city' && packageData.destination_location.parent) {
          destinationName = `${packageData.destination_location.name}, ${packageData.destination_location.parent.name}`
        } else {
          destinationName = packageData.destination_location.name
        }
      }

      formattedPackage = {
        ...packageData,
        destination_name: destinationName
      }
    }

    return NextResponse.json({
      success: true,
      package: formattedPackage
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
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

    const awaitedParam = await params;
    const packageId  = awaitedParam.id;

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    // Check if package exists
    const { data: existingPackage, error: checkError } = await supabase
      .from('packages')
      .select('id')
      .eq('id', packageId)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Package not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to verify package' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    
    const packageData = {
      title: formData.get('title'),
      destination: formData.get('destination'), // This will now be a location ID or text
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
      updated_at: new Date().toISOString()
    }

    // Handle destination field - check if it's a UUID (location ID) or text
    const destinationValue = formData.get('destination')
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(destinationValue)
    
    if (isUUID) {
      packageData.destination = destinationValue
    }

    if (!packageData.title || !destinationValue || !packageData.days || 
        !packageData.nights || !packageData.price_per_person || !packageData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let thumbnailImageUrl = null
    let galleryImageUrls = []

    const thumbnailImage = formData.get('thumbnailImage')
    const keepExistingThumbnail = formData.get('keepExistingThumbnail') === 'true'
    
    if (thumbnailImage && thumbnailImage.size > 0) {
      const thumbnailFileName = `packages/${Date.now()}-${thumbnailImage.name}`
      
      const { error: thumbnailError } = await supabase.storage
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
    } else if (keepExistingThumbnail) {
      delete packageData.thumbnail_image_url
    }

    const galleryImages = formData.getAll('galleryImages')
    const keepExistingGallery = formData.get('keepExistingGallery') === 'true'
    
    if (galleryImages.length > 0 && galleryImages[0].size > 0) {
      for (const image of galleryImages) {
        if (image && image.size > 0) {
          const galleryFileName = `packages/gallery/${Date.now()}-${image.name}`
          
          const { error: galleryError } = await supabase.storage
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
    } else if (keepExistingGallery) {
      delete packageData.gallery_image_urls
    }

    if (thumbnailImageUrl) {
      packageData.thumbnail_image_url = thumbnailImageUrl
    }
    if (galleryImageUrls.length > 0) {
      packageData.gallery_image_urls = galleryImageUrls
    }

    const { data: updatedPackage, error: updateError } = await supabase
      .from('packages')
      .update(packageData)
      .eq('id', packageId)
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update package' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      package: updatedPackage
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

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

    const awaitedParams = await params
    const packageId = awaitedParams.id;

    if (!packageId) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      )
    }

    // Delete the package
    const { error: deleteError } = await supabase
      .from('packages')
      .delete()
      .eq('id', packageId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete package' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}