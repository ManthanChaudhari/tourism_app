import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET - Fetch locations (public endpoint)
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const limit = parseInt(searchParams.get('limit')) || 100;
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Build the query with parent location data
    let query = supabase
      .from('locations')
      .select(`
        id,
        name,
        slug,
        type,
        is_active,
        parent:parent_id(id, name, slug, type)
      `);

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (type && ['state', 'city'].includes(type)) {
      query = query.eq('type', type);
    }

    // Only show active locations by default
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    // Apply sorting: states first, then cities grouped by parent
    query = query
      .order('type', { ascending: true })
      .order('parent_id', { ascending: true, nullsFirst: true })
      .order('name', { ascending: true });

    // Apply limit
    query = query.limit(limit);

    const { data: locations, error: fetchError } = await query;

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      );
    }

    // Group locations by type for better organization
    const groupedLocations = {
      states: [],
      cities: []
    };

    locations?.forEach(location => {
      if (location.type === 'state') {
        groupedLocations.states.push(location);
      } else if (location.type === 'city') {
        groupedLocations.cities.push(location);
      }
    });

    return NextResponse.json({
      success: true,
      locations: locations || [],
      grouped: groupedLocations,
      total: locations?.length || 0
    });

  } catch (error) {
    console.error('Error in GET /api/locations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}