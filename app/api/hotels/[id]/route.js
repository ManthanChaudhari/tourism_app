import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/hotels/[id] - Get single hotel details for public display
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params

    const { data: hotel, error } = await supabase
      .from('hotels')
      .select(`
        id,
        name,
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
      .eq('id', id)
      .eq('status', 'published') // Only show published hotels
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Hotel not found or not published' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hotel' },
        { status: 500 }
      )
    }

    // Process hotel data
    const processedHotel = {
      id: hotel.id,
      name: hotel.name,
      location: hotel.destination?.name || 'Location not specified',
      address: hotel.address,
      rating: hotel.star_rating || 0,
      description: hotel.short_description,
      checkIn: hotel.check_in_time,
      checkOut: hotel.check_out_time,
      contact: hotel.contact_number,
      email: hotel.email,
      image: hotel.thumbnail_image,
      gallery: hotel.gallery_images || [],
      amenities: hotel.amenities || [],
      cancellationPolicy: hotel.cancellation_policy,
      houseRules: hotel.house_rules,
      rooms: hotel.rooms || [],
      destination: hotel.destination,
      created_at: hotel.created_at
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