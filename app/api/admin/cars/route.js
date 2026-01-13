import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/lib/supabase/server"

// Helper function to generate slug from text
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to ensure unique slug
async function ensureUniqueSlug(supabase, baseSlug, carId = null) {
  let finalSlug = baseSlug;
  let counter = 1;
  
  while (true) {
    const { data: existingCar } = await supabase
      .from('cars')
      .select('id')
      .eq('slug', finalSlug)
      .neq('id', carId || '')
      .single();
    
    if (!existingCar) {
      break;
    }
    
    finalSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
}


export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: cars, error } = await supabase
      .from('cars')
      .select(`
        *,
        categories:category_id(id, name),
        locations:location_id(id, name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cars:', error);
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error in GET /api/admin/cars:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new car
export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
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

    // Generate slug if not provided
    const baseSlug = body.slug && body.slug.trim() ? body.slug.trim() : generateSlug(body.name);
    const finalSlug = await ensureUniqueSlug(supabase, baseSlug);

    // Prepare car data
    const carData = {
      name: body.name.trim(),
      slug: finalSlug,
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
      created_at: new Date().toISOString(),
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
      .insert([carData])
      .select()
      .single();

    if (error) {
      console.error('Error creating car:', error);
      return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
    }

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/cars:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}