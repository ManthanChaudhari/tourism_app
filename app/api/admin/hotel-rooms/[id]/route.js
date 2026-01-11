import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/hotel-rooms/[id] - Get single room
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params

    const { data: room, error } = await supabase
      .from('hotel_rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      room
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/hotel-rooms/[id] - Update room
export async function PUT(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params
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

    // Update room
    const { data: room, error } = await supabase
      .from('hotel_rooms')
      .update({
        hotel_id,
        room_name: room_name.trim(),
        max_guests: parseInt(max_guests),
        price_per_night: parseFloat(price_per_night),
        room_size: room_size?.trim() || null,
        bed_type: bed_type?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Room not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      room,
      message: 'Room updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/hotel-rooms/[id] - Delete room
export async function DELETE(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params

    // Delete room
    const { error } = await supabase
      .from('hotel_rooms')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete room' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Room deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}