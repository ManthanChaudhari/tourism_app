import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || adminProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params

    // Fetch location with parent data
    const { data: location, error: fetchError } = await supabase
      .from('locations')
      .select(`
        *,
        parent:parent_id(id, name, slug, type)
      `)
      .eq('id', id)
      .single()

    if (fetchError || !location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      location
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || adminProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { name, slug, type, parent_id, is_active } = body

    // Get existing location
    const { data: existingLocation, error: existingError } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()

    if (existingError || !existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!type || !['state', 'city'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "state" or "city"' },
        { status: 400 }
      )
    }

    // Validate business rules
    if (type === 'city' && !parent_id) {
      return NextResponse.json(
        { error: 'City must have a parent state' },
        { status: 400 }
      )
    }

    if (type === 'state' && parent_id) {
      return NextResponse.json(
        { error: 'State cannot have a parent' },
        { status: 400 }
      )
    }

    // Generate slug if not provided or changed
    const finalSlug = slug && slug.trim() ? slug.trim() : generateSlug(name.trim())

    // Check if slug is unique (excluding current location)
    if (finalSlug !== existingLocation.slug) {
      const { data: existingSlugLocation, error: slugCheckError } = await supabase
        .from('locations')
        .select('id')
        .eq('slug', finalSlug)
        .neq('id', id)
        .single()

      if (existingSlugLocation) {
        return NextResponse.json(
          { error: 'Slug must be unique. This slug already exists.' },
          { status: 400 }
        )
      }
    }

    // If city, verify parent exists and is a state
    if (type === 'city') {
      const { data: parentLocation, error: parentError } = await supabase
        .from('locations')
        .select('id, type, is_active')
        .eq('id', parent_id)
        .single()

      if (parentError || !parentLocation) {
        return NextResponse.json(
          { error: 'Parent state not found' },
          { status: 400 }
        )
      }

      if (parentLocation.type !== 'state') {
        return NextResponse.json(
          { error: 'Parent must be a state' },
          { status: 400 }
        )
      }

      if (!parentLocation.is_active) {
        return NextResponse.json(
          { error: 'Parent state must be active' },
          { status: 400 }
        )
      }
    }

    // Check if changing from state to city would break existing relationships
    if (existingLocation.type === 'state' && type === 'city') {
      const { data: childLocations, error: childError } = await supabase
        .from('locations')
        .select('id')
        .eq('parent_id', id)
        .limit(1)

      if (childLocations && childLocations.length > 0) {
        return NextResponse.json(
          { error: 'Cannot change state to city: this location has child cities' },
          { status: 400 }
        )
      }
    }

    // Update location
    const updateData = {
      name: name.trim(),
      slug: finalSlug,
      type,
      parent_id: type === 'city' ? parent_id : null,
      is_active: is_active !== undefined ? is_active : existingLocation.is_active,
      updated_at: new Date().toISOString()
    }

    const { data: updatedLocation, error: updateError } = await supabase
      .from('locations')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        parent:parent_id(id, name, slug, type)
      `)
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update location' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location: updatedLocation
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Toggle active status
export async function PATCH(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (adminError || adminProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { is_active } = body

    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'is_active must be a boolean value' },
        { status: 400 }
      )
    }

    // Get existing location
    const { data: existingLocation, error: existingError } = await supabase
      .from('locations')
      .select('*')
      .eq('id', id)
      .single()

    if (existingError || !existingLocation) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      )
    }

    // If deactivating a state, check if it has active cities
    if (!is_active && existingLocation.type === 'state') {
      const { data: activeCities, error: cityError } = await supabase
        .from('locations')
        .select('id')
        .eq('parent_id', id)
        .eq('is_active', true)
        .limit(1)

      if (activeCities && activeCities.length > 0) {
        return NextResponse.json(
          { error: 'Cannot deactivate state: it has active cities. Deactivate cities first.' },
          { status: 400 }
        )
      }
    }

    // Update active status
    const { data: updatedLocation, error: updateError } = await supabase
      .from('locations')
      .update({ 
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        parent:parent_id(id, name, slug, type)
      `)
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update location status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location: updatedLocation
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}