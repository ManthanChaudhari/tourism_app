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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const featured = searchParams.get('featured') || ''
    const sortBy = searchParams.get('sortBy') || 'display_order'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    const publicAccess = searchParams.get('public') === 'true'

    // For public access, we don't require authentication
    if (!publicAccess) {
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
    }

    // Validate pagination parameters
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), publicAccess ? 50 : 100)
    const offset = (validatedPage - 1) * validatedLimit

    // Validate sort parameters
    const validSortFields = ['name', 'display_order', 'status', 'created_at', 'updated_at']
    const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'display_order'
    const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'asc'

    // Build the query
    let query = supabase
      .from('categories')
      .select('*', { count: 'exact' })

    // For public access, only show active categories
    if (publicAccess) {
      query = query.eq('status', 'active')
    } else {
      // Apply status filter for admin access
      if (status && ['active', 'inactive'].includes(status)) {
        query = query.eq('status', status)
      }
    }

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    } else if (featured === 'false') {
      query = query.eq('is_featured', false)
    }

    // Apply sorting
    if (validatedSortBy === 'display_order') {
      query = query.order('display_order', { ascending: validatedSortOrder === 'asc' })
      query = query.order('name', { ascending: true }) // Secondary sort by name
    } else {
      query = query.order(validatedSortBy, { ascending: validatedSortOrder === 'asc' })
    }

    // Apply pagination
    query = query.range(offset, offset + validatedLimit - 1)

    const { data: categories, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
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
      categories: categories || [],
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
        status: status || 'all',
        featured: featured || 'all',
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
    const { 
      name, 
      slug, 
      description, 
      icon, 
      banner_image, 
      display_order = 0, 
      is_featured = false, 
      status = 'active' 
    } = body

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug && slug.trim() ? slug.trim() : generateSlug(name.trim())

    // Check if slug is unique
    const { data: existingCategory, error: slugCheckError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', finalSlug)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Slug must be unique. This slug already exists.' },
        { status: 400 }
      )
    }

    // Create category
    const categoryData = {
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      banner_image: banner_image?.trim() || null,
      display_order: parseInt(display_order) || 0,
      is_featured: Boolean(is_featured),
      status
    }

    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      category: newCategory
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}