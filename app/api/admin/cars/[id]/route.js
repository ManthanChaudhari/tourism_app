import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/lib/supabase/server"


// GET - Fetch single car
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params;

    const { data: car, error } = await supabase
      .from('cars')
      .select(`
        *,
        categories:category_id(id, name),
        locations:location_id(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
      }
      console.error('Error fetching car:', error);
      return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error in GET /api/admin/cars/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update car
export async function PUT(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'brand', 'model', 'year', 'category_id', 'location_id', 'seating_capacity', 'price_per_day'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if car exists
    const { data: existingCar, error: fetchError } = await supabase
      .from('cars')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
      }
      console.error('Error checking car existence:', fetchError);
      return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
    }

    // Prepare car data
    const carData = {
      name: body.name.trim(),
      brand: body.brand.trim(),
      model: body.model.trim(),
      year: parseInt(body.year),
      category_id: body.category_id, // UUID, no parsing needed
      location_id: body.location_id, // UUID, no parsing needed
      seating_capacity: parseInt(body.seating_capacity),
      luggage_capacity: body.luggage_capacity?.trim() || null,
      fuel_type: body.fuel_type || 'petrol',
      transmission: body.transmission || 'manual',
      ac_available: Boolean(body.ac_available),
      price_per_day: parseFloat(body.price_per_day),
      price_per_hour: body.price_per_hour ? parseFloat(body.price_per_hour) : null,
      extra_km_price: body.extra_km_price ? parseFloat(body.extra_km_price) : null,
      driver_charge_per_day: body.driver_charge_per_day ? parseFloat(body.driver_charge_per_day) : null,
      security_deposit: body.security_deposit ? parseFloat(body.security_deposit) : null,
      min_booking_hours: body.min_booking_hours ? parseInt(body.min_booking_hours) : null,
      min_booking_days: body.min_booking_days ? parseInt(body.min_booking_days) : null,
      fuel_policy: body.fuel_policy?.trim() || null,
      cancellation_policy: body.cancellation_policy?.trim() || null,
      allow_one_way: Boolean(body.allow_one_way),
      driver_included: Boolean(body.driver_included),
      thumbnail_image: body.thumbnail_image || null,
      gallery_images: body.gallery_images || [],
      is_active: Boolean(body.is_active),
      updated_at: new Date().toISOString()
    };

    // Validate year range
    const currentYear = new Date().getFullYear();
    if (carData.year < 1990 || carData.year > currentYear + 1) {
      return NextResponse.json(
        { error: `Year must be between 1990 and ${currentYear + 1}` },
        { status: 400 }
      );
    }

    // Validate positive numbers
    const numericFields = ['price_per_day', 'price_per_hour', 'extra_km_price', 'driver_charge_per_day', 'security_deposit', 'min_booking_hours', 'min_booking_days'];
    for (const field of numericFields) {
      if (carData[field] !== null && carData[field] < 0) {
        return NextResponse.json(
          { error: `${field} must be a positive number` },
          { status: 400 }
        );
      }
    }

    const { data: car, error } = await supabase
      .from('cars')
      .update(carData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating car:', error);
      return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error in PUT /api/admin/cars/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete car
export async function DELETE(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params;

    // Check if car exists
    const { data: existingCar, error: fetchError } = await supabase
      .from('cars')
      .select('id, name')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Car not found' }, { status: 404 });
      }
      console.error('Error checking car existence:', fetchError);
      return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
    }

    // TODO: Check if car has active bookings before deletion
    // This would require a bookings table to be implemented

    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting car:', error);
      return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/admin/cars/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}