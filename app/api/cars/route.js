import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET - Fetch cars for public display
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const category = searchParams.get('category');
    const location = searchParams.get('locationId');
    const search = searchParams.get('search');

    let query = supabase
      .from('cars')
      .select(`
        *,
        categories:category_id(id, name),
        locations:location_id(id, name)
      `)
      .eq('is_active', true) // Only show active cars
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .limit(limit);

    // Apply filters if provided
    if (category) {
      query = query.eq('category_id', category);
    }

    if (location) {
      query = query.eq('location_id', location);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%`);
    }

    const { data: cars, error } = await query;

    if (error) {
      console.error('Error fetching cars:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch cars' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cars: cars || []
    });
  } catch (error) {
    console.error('Error in GET /api/cars:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}