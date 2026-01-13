import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/cars/slug/[slug] - Get single car details by slug for public display
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { slug } = await params

    const { data: car, error } = await supabase
      .from('cars')
      .select(`
        id,
        name,
        slug,
        brand,
        model,
        year,
        category_id,
        location_id,
        seating_capacity,
        luggage_capacity,
        fuel_type,
        transmission,
        ac_available,
        price_per_day,
        price_per_hour,
        extra_km_price,
        driver_charge_per_day,
        security_deposit,
        min_booking_hours,
        min_booking_days,
        fuel_policy,
        cancellation_policy,
        allow_one_way,
        driver_included,
        thumbnail_image,
        gallery_images,
        is_active,
        created_at,
        updated_at,
        categories:category_id(
          id,
          name,
          slug
        ),
        locations:location_id(
          id,
          name,
          slug,
          type,
          parent:parent_id(name)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true) // Only show active cars
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Car not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch car' },
        { status: 500 }
      )
    }

    // Process car data to add calculated fields
    const processedCar = {
      ...car,
      // Format category name
      category: car.categories ? car.categories.name : null,
      // Format location name
      location: car.locations 
        ? (car.locations.type === 'city' && car.locations.parent 
            ? `${car.locations.name}, ${car.locations.parent.name}`
            : car.locations.name)
        : null
    }

    return NextResponse.json({
      success: true,
      car: processedCar
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}