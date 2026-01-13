import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/packages/slug/[slug] - Get single package details by slug for public display
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { slug } = await params

    const { data: packageData, error } = await supabase
      .from('packages')
      .select(`
        id,
        title,
        slug,
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
        updated_at
      `)
      .eq('slug', slug)
      .eq('status', 'published') // Only show published packages
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Package not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch package' },
        { status: 500 }
      )
    }

    // Helper function to check if a string is a UUID
    const isUUID = (str) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str)
    
    // Fetch location and category data if UUIDs
    let destinationName = packageData.destination
    let categoryName = packageData.category
    
    if (isUUID(packageData.destination)) {
      const { data: location } = await supabase
        .from('locations')
        .select('id, name, slug, type, parent:parent_id(name)')
        .eq('id', packageData.destination)
        .single()
      
      if (location) {
        if (location.type === 'city' && location.parent) {
          destinationName = `${location.name}, ${location.parent.name}`
        } else {
          destinationName = location.name
        }
      }
    }
    
    if (isUUID(packageData.category)) {
      const { data: category } = await supabase
        .from('categories')
        .select('id, name, slug, icon, is_featured')
        .eq('id', packageData.category)
        .single()
      
      if (category) {
        categoryName = category.name
      }
    }

    // Format package for public consumption
    const formattedPackage = {
      id: packageData.id,
      title: packageData.title,
      slug: packageData.slug,
      destination: destinationName,
      category: categoryName,
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

    return NextResponse.json({
      success: true,
      package: formattedPackage
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}