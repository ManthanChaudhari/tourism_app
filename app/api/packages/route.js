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

    // Store destination and category values directly (can be UUID or text)
    const destinationValue = formData.get('destination')
    const categoryValue = formData.get('category')
    
    packageData.destination = destinationValue
    packageData.category = categoryValue

    if (!packageData.title || !destinationValue || !packageData.days || 
        !packageData.nights || !packageData.price_per_person || !categoryValue) {
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
    }

    const galleryImages = formData.getAll('galleryImages')
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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
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

    // Validate pagination parameters
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), publicAccess ? 50 : 100)
    const offset = (validatedPage - 1) * validatedLimit

    // Validate sort parameters
    const validSortFields = ['created_at', 'updated_at', 'title', 'destination', 'price_per_person', 'status']
    const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc'

    // Build the query
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
        created_at,
        updated_at
      ` : `*`, { count: 'exact' })

    // For public access, only show published packages
    if (publicAccess) {
      query = query.eq('status', 'published')
    } else {
      // Apply status filter for admin access
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,destination.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply sorting
    query = query.order(validatedSortBy, { ascending: validatedSortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + validatedLimit - 1)

    const { data: packages, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch packages' },
        { status: 500 }
      )
    }

    // Format packages for public consumption if needed
    let formattedPackages = packages || []
    
    // Helper function to check if a string is a UUID
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)
    
    // Fetch location and category data for UUIDs
    const locationIds = [...new Set(packages.filter(pkg => isUUID(pkg.destination)).map(pkg => pkg.destination))]
    const categoryIds = [...new Set(packages.filter(pkg => isUUID(pkg.category)).map(pkg => pkg.category))]
    
    let locationsMap = {}
    let categoriesMap = {}
    
    if (locationIds.length > 0) {
      const { data: locations } = await supabase
        .from('locations')
        .select('id, name, slug, type, parent:parent_id(name)')
        .in('id', locationIds)
      
      if (locations) {
        locationsMap = locations.reduce((acc, loc) => {
          acc[loc.id] = loc
          return acc
        }, {})
      }
    }
    
    if (categoryIds.length > 0) {
      const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug, icon, is_featured')
        .in('id', categoryIds)
      
      if (categories) {
        categoriesMap = categories.reduce((acc, cat) => {
          acc[cat.id] = cat
          return acc
        }, {})
      }
    }

    if (publicAccess) {
      formattedPackages = packages.map(pkg => {
        // Get destination name
        let destinationName = pkg.destination
        if (isUUID(pkg.destination) && locationsMap[pkg.destination]) {
          const location = locationsMap[pkg.destination]
          if (location.type === 'city' && location.parent) {
            destinationName = `${location.name}, ${location.parent.name}`
          } else {
            destinationName = location.name
          }
        }

        // Get category name
        let categoryName = pkg.category
        if (isUUID(pkg.category) && categoriesMap[pkg.category]) {
          categoryName = categoriesMap[pkg.category].name
        }

        return {
          id: pkg.id,
          title: pkg.title,
          destination: destinationName,
          category: categoryName,
          duration: `${pkg.days} days, ${pkg.nights} nights`,
          days: pkg.days,
          nights: pkg.nights,
          price: pkg.price_per_person,
          originalPrice: pkg.discount ? pkg.price_per_person : null,
          discountedPrice: pkg.discount ? pkg.price_per_person - (pkg.price_per_person * pkg.discount / 100) : pkg.price_per_person,
          discount: pkg.discount,
          description: pkg.description,
          image: pkg.thumbnail_image_url,
          images: pkg.gallery_image_urls || [],
          createdAt: pkg.created_at,
          updatedAt: pkg.updated_at
        }
      })
    } else {
      // For admin access, also format destination and category names
      formattedPackages = packages.map(pkg => {
        let destinationName = pkg.destination
        if (isUUID(pkg.destination) && locationsMap[pkg.destination]) {
          const location = locationsMap[pkg.destination]
          if (location.type === 'city' && location.parent) {
            destinationName = `${location.name}, ${location.parent.name}`
          } else {
            destinationName = location.name
          }
        }

        let categoryName = pkg.category
        if (isUUID(pkg.category) && categoriesMap[pkg.category]) {
          categoryName = categoriesMap[pkg.category].name
        }

        return {
          ...pkg,
          destination_name: destinationName,
          category_name: categoryName
        }
      })
    }

    // Calculate pagination metadata
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / validatedLimit)
    const hasNextPage = validatedPage < totalPages
    const hasPrevPage = validatedPage > 1

    return NextResponse.json({
      success: true,
      packages: formattedPackages,
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        itemsPerPage: validatedLimit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? validatedPage + 1 : null,
        prevPage: hasPrevPage ? validatedPage - 1 : null
      },
      filters: {
        search,
        status: status || 'all',
        category: category || 'all',
        sortBy: validatedSortBy,
        sortOrder: validatedSortOrder
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}