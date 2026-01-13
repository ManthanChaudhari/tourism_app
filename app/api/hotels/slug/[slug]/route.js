import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/hotels/slug/[slug] - Get single hotel details by slug for public display
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { slug } = await params

    const { data: hotel, error } = await supabase
      .from('hotels')
      .select(`
        id,
        name,
        slug,
        destination_id,
        address,
        star_rating,
        short_description,
        check_in_time,
        check_out_time,
        contact_number,
        email,
        thumbnail_image,
        gallery_images,
        amenities,
        cancellation_policy,
        house_rules,
        created_at,
        updated_at,
        destination:locations(
          id,
          name,
          slug,
          type,
          parent:parent_id(name)
        ),
        rooms:hotel_rooms(
          id,
          room_name,
          max_guests,
          price_per_night,
          room_size,
          bed_type
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published') // Only show published hotels
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Hotel not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hotel' },
        { status: 500 }
      )
    }

    // Process hotel data to add calculated fields
    const processedHotel = {
      ...hotel,
      // Calculate minimum room price
      minPrice: hotel.rooms && hotel.rooms.length > 0 
        ? Math.min(...hotel.rooms.filter(room => room.price_per_night > 0).map(room => room.price_per_night))
        : null,
      // Format destination name
      location: hotel.destination 
        ? (hotel.destination.type === 'city' && hotel.destination.parent 
            ? `${hotel.destination.name}, ${hotel.destination.parent.name}`
            : hotel.destination.name)
        : null
    }

    return NextResponse.json({
      success: true,
      hotel: processedHotel
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}