import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/hotels - Get published hotels for public display
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 12
    const search = searchParams.get('search')
    const rating = searchParams.get('rating')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const location = searchParams.get('locationId');
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('hotels')
      .select(`
        id,
        name,
        slug,
        address,
        star_rating,
        short_description,
        thumbnail_image,
        gallery_images,
        amenities,
        created_at,
        destination:locations(id, name),
        rooms:hotel_rooms(
          id,
          room_name,
          max_guests,
          price_per_night,
          room_size,
          bed_type
        )
      `)
      .eq('status', 'published') // Only show published hotels
      .order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,short_description.ilike.%${search}%`)
    }

    if(location){
      query = query.eq('destination_id', location);
    }

    if (rating) {
      query = query.gte('star_rating', parseInt(rating))
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: hotels, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hotels' },
        { status: 500 }
      )
    }

    // Process hotels data to add calculated fields
    const processedHotels = hotels.map(hotel => {
      // Calculate minimum room price
      const validRooms = hotel.rooms && hotel.rooms.length > 0 
        ? hotel.rooms.filter(room => room.price_per_night && room.price_per_night > 0)
        : []

      const minPrice = validRooms.length > 0 
        ? Math.min(...validRooms.map(room => room.price_per_night))
        : null

      // Calculate average room price for original price display
      const avgPrice = validRooms.length > 0
        ? validRooms.reduce((sum, room) => sum + room.price_per_night, 0) / validRooms.length
        : null

      // Calculate discount percentage (if you want to show discounts)
      const discount = avgPrice && minPrice && avgPrice > minPrice
        ? Math.round(((avgPrice - minPrice) / avgPrice) * 100)
        : null

      return {
        id: hotel.id,
        name: hotel.name,
        slug: hotel.slug,
        location: hotel.destination?.name || 'Location not specified',
        address: hotel.address,
        rating: hotel.star_rating || 0,
        description: hotel.short_description,
        image: hotel.thumbnail_image || '/images/hotel-placeholder.jpg',
        gallery: hotel.gallery_images || [],
        amenities: hotel.amenities || [],
        price: minPrice,
        originalPrice: discount && discount > 5 ? avgPrice : null, // Only show original price if discount is meaningful
        discount: discount && discount > 5 ? discount : null, // Only show discount if it's meaningful
        roomCount: validRooms.length,
        rooms: hotel.rooms || [],
        created_at: hotel.created_at
      }
    })

    // Get total count for pagination (if needed)
    const { count: totalCount } = await supabase
      .from('hotels')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')

    return NextResponse.json({
      success: true,
      hotels: processedHotels,
      pagination: {
        page,
        limit,
        totalItems: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasNext: page * limit < (totalCount || 0),
        hasPrev: page > 1
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}