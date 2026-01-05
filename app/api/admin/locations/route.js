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

export async function GET(request) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || ''
    const status = searchParams.get('status') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Validate pagination parameters
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), 100)
    const offset = (validatedPage - 1) * validatedLimit

    // Validate sort parameters
    const validSortFields = ['name', 'type', 'created_at', 'updated_at']
    const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'name'
    const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc'

    // Build the query with parent location data
    let query = supabase
      .from('locations')
      .select(`
        *,
        parent:parent_id(id, name, slug, type)
      `, { count: 'exact' })

    // Apply filters
    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (type && ['state', 'city'].includes(type)) {
      query = query.eq('type', type)
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'inactive') {
      query = query.eq('is_active', false)
    }

    // Apply sorting with special handling for hierarchical display
    if (validatedSortBy === 'name') {
      // Custom sorting: states first, then cities grouped by parent
      query = query.order('type', { ascending: true })
      query = query.order('parent_id', { ascending: true, nullsFirst: true })
      query = query.order('name', { ascending: validatedSortOrder === 'asc' })
    } else {
      query = query.order(validatedSortBy, { ascending: validatedSortOrder === 'asc' })
    }

    // Apply pagination
    query = query.range(offset, offset + validatedLimit - 1)

    const { data: locations, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch locations' },
        { status: 500 }
      )
    }

    // Calculate pagination metadata
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / validatedLimit)
    const hasNextPage = validatedPage < totalPages
    const hasPrevPage = validatedPage > 1

    return NextResponse.json({
      success: true,
      locations: locations || [],
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        itemsPerPage: validatedLimit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? validatedPage + 1 : null,
        prevPage: hasPrevPage ? validatedPage - 1 : null
      },
      filters: {
        search,
        type: type || 'all',
        status: status || 'all',
        sortBy: validatedSortBy,
        sortOrder: validatedSortOrder
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
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

    const body = await request.json()
    const { name, slug, type, parent_id, is_active = true } = body

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

    // Generate slug if not provided
    const finalSlug = slug && slug.trim() ? slug.trim() : generateSlug(name.trim())

    // Check if slug is unique
    const { data: existingLocation, error: slugCheckError } = await supabase
      .from('locations')
      .select('id')
      .eq('slug', finalSlug)
      .single()

    if (existingLocation) {
      return NextResponse.json(
        { error: 'Slug must be unique. This slug already exists.' },
        { status: 400 }
      )
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

    // Create location
    const locationData = {
      name: name.trim(),
      slug: finalSlug,
      type,
      parent_id: type === 'city' ? parent_id : null,
      is_active
    }

    const { data: newLocation, error: insertError } = await supabase
      .from('locations')
      .insert([locationData])
      .select(`
        *,
        parent:parent_id(id, name, slug, type)
      `)
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create location' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      location: newLocation
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}