import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"


export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const hotelId = searchParams.get('hotel_id')

    if (!hotelId) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID is required' },
        { status: 400 }
      )
    }

    const { data: rooms, error } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('hotel_id', hotelId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch rooms' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      rooms
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/hotel-rooms - Create new room
export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const body = await request.json()
    
    const {
      hotel_id,
      room_name,
      max_guests,
      price_per_night,
      room_size,
      bed_type
    } = body

    // Validation
    if (!hotel_id) {
      return NextResponse.json(
        { success: false, error: 'Hotel ID is required' },
        { status: 400 }
      )
    }

    if (!room_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Room name is required' },
        { status: 400 }
      )
    }

    if (!max_guests || max_guests < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid max guests is required' },
        { status: 400 }
      )
    }

    if (!price_per_night || price_per_night <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid price per night is required' },
        { status: 400 }
      )
    }

    // Create room
    const { data: room, error } = await supabase
      .from('hotel_rooms')
      .insert({
        hotel_id,
        room_name: room_name.trim(),
        max_guests: parseInt(max_guests),
        price_per_night: parseFloat(price_per_night),
        room_size: room_size?.trim() || null,
        bed_type: bed_type?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      room,
      message: 'Room created successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}