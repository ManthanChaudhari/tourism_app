import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/hotels/[id] - Get single hotel
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params

    const { data: hotel, error } = await supabase
      .from('hotels')
      .select(`
        *,
        destination:locations(id, name),
        rooms:hotel_rooms(*)
      `)
      .eq('id', id)
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

    return NextResponse.json({
      success: true,
      hotel
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/hotels/[id] - Update hotel
export async function PUT(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params
    const body = await request.json()
    
    const {
      name,
      destination_id,
      address,
      star_rating,
      status,
      short_description,
      check_in_time,
      check_out_time,
      contact_number,
      email,
      thumbnail_image,
      gallery_images,
      amenities,
      cancellation_policy,
      house_rules
    } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Hotel name is required' },
        { status: 400 }
      )
    }

    if (!destination_id) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      )
    }

    if (!address?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      )
    }

    // Update hotel
    const { data: hotel, error } = await supabase
      .from('hotels')
      .update({
        name: name.trim(),
        destination_id,
        address: address.trim(),
        star_rating: parseInt(star_rating) || 3,
        status: status || 'draft',
        short_description: short_description?.trim() || null,
        check_in_time: check_in_time || '14:00:00',
        check_out_time: check_out_time || '11:00:00',
        contact_number: contact_number?.trim() || null,
        email: email?.trim() || null,
        thumbnail_image: thumbnail_image?.trim() || null,
        gallery_images: gallery_images || [],
        amenities: amenities || [],
        cancellation_policy: cancellation_policy?.trim() || null,
        house_rules: house_rules?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
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
        { success: false, error: 'Failed to update hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/hotels/[id] - Partial update (e.g., status toggle)
export async function PATCH(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params
    const body = await request.json()

    // Update hotel with provided fields
    const { data: hotel, error } = await supabase
      .from('hotels')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
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
        { success: false, error: 'Failed to update hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/hotels/[id] - Delete hotel
export async function DELETE(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params

    // Delete hotel (rooms will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('hotels')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Hotel deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}