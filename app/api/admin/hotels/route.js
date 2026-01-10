import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"


export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const rating = searchParams.get('rating') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('hotels')
      .select(`
        *,
        destination:locations(id, name),
        room_count:hotel_rooms(count)
      `)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (rating && rating !== 'all') {
      query = query.eq('star_rating', parseInt(rating))
    }

    // Get total count for pagination
    const { count: totalItems } = await supabase
      .from('hotels')
      .select('*', { count: 'exact', head: true })

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    const { data: hotels, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hotels' },
        { status: 500 }
      )
    }

    // Process hotels data
    const processedHotels = hotels.map(hotel => ({
      ...hotel,
      room_count: hotel.room_count?.[0]?.count || 0
    }))

    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      success: true,
      hotels: processedHotels,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
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

// POST /api/admin/hotels - Create new hotel
export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
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

    // Create hotel
    const { data: hotel, error } = await supabase
      .from('hotels')
      .insert({
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
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel created successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}