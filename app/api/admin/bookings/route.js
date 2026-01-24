import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Helper function to build filter conditions
function buildFilterQuery(query, filters) {
  // Booking type filter
  if (filters.booking_type && filters.booking_type !== 'all') {
    query = query.eq('booking_type', filters.booking_type)
  }
  
  // Booking status filter
  if (filters.booking_status && filters.booking_status !== 'all') {
    query = query.eq('booking_status', filters.booking_status)
  }
  
  // Payment status filter
  if (filters.payment_status && filters.payment_status !== 'all') {
    query = query.eq('payment_status', filters.payment_status)
  }
  
  // Booking code search
  if (filters.booking_code) {
    query = query.ilike('booking_code', `%${filters.booking_code}%`)
  }
  
  // Date range filters
  if (filters.created_from) {
    query = query.gte('created_at', filters.created_from)
  }
  
  if (filters.created_to) {
    query = query.lte('created_at', filters.created_to)
  }
  
  if (filters.travel_from) {
    query = query.gte('start_date', filters.travel_from)
  }
  
  if (filters.travel_to) {
    query = query.lte('start_date', filters.travel_to)
  }
  
  return query
}

// GET /api/admin/bookings - Get all bookings for admin (read-only)
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    
    // Filter parameters
    const filters = {
      booking_type: searchParams.get('booking_type') || '',
      booking_status: searchParams.get('booking_status') || '',
      payment_status: searchParams.get('payment_status') || '',
      booking_code: searchParams.get('booking_code') || '',
      customer_search: searchParams.get('customer_search') || '',
      created_from: searchParams.get('created_from') || '',
      created_to: searchParams.get('created_to') || '',
      travel_from: searchParams.get('travel_from') || '',
      travel_to: searchParams.get('travel_to') || ''
    }
    
    // Validate pagination
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), 100)
    const offset = (validatedPage - 1) * validatedLimit
    
    // Validate sort parameters
    const validSortFields = ['created_at', 'booking_code', 'booking_type', 'booking_status', 'payment_status', 'start_date', 'total_amount']
    const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    const validatedSortOrder = ['asc', 'desc'].includes(sortOrder) ? sortOrder : 'desc'
    
    // Build base query using the admin view
    let query = supabase
      .from('bookings')
      .select(`
        id,
        booking_code,
        booking_type,
        service_title,
        booking_status,
        payment_status,
        start_date,
        end_date,
        duration_days,
        adults_count,
        children_count,
        rooms_count,
        vehicles_count,
        total_amount,
        currency,
        created_at,
        customers:booking_customers!inner(
          full_name,
          email,
          phone,
          is_primary
        )
      `, { count: 'exact' })
    
    // Apply filters
    query = buildFilterQuery(query, filters)
    
    // Customer search filter (search in customer name, email, phone)
    if (filters.customer_search) {
      query = query.or(
        `customers.full_name.ilike.%${filters.customer_search}%,` +
        `customers.email.ilike.%${filters.customer_search}%,` +
        `customers.phone.ilike.%${filters.customer_search}%`
      )
    }
    
    // Apply sorting
    query = query.order(validatedSortBy, { ascending: validatedSortOrder === 'asc' })
    
    // Apply pagination
    query = query.range(offset, offset + validatedLimit - 1)
    
    const { data: bookings, error: fetchError, count } = await query
    
    if (fetchError) {
      console.error('Fetch bookings error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }
    
    // Format bookings for admin display
    const formattedBookings = (bookings || []).map(booking => {
      // Get primary customer
      const primaryCustomer = booking.customers?.find(c => c.is_primary) || booking.customers?.[0]
      
      return {
        id: booking.id,
        booking_code: booking.booking_code,
        booking_type: booking.booking_type,
        service_name: booking.service_title,
        customer_name: primaryCustomer?.full_name || 'N/A',
        customer_email: primaryCustomer?.email || 'N/A',
        customer_phone: primaryCustomer?.phone || 'N/A',
        adults_children: `${booking.adults_count}A${booking.children_count > 0 ? ` / ${booking.children_count}C` : ''}`,
        travel_dates: `${booking.start_date} to ${booking.end_date}`,
        duration: `${booking.duration_days} days`,
        rooms_vehicles: booking.rooms_count || booking.vehicles_count || 'N/A',
        total_amount: booking.total_amount,
        currency: booking.currency,
        payment_status: booking.payment_status,
        booking_status: booking.booking_status,
        created_at: booking.created_at
      }
    })
    
    // Calculate pagination metadata
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / validatedLimit)
    
    return NextResponse.json({
      success: true,
      bookings: formattedBookings,
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        itemsPerPage: validatedLimit,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1
      },
      filters: {
        ...filters,
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

// POST method not allowed - admin is read-only
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed - Admin panel is read-only' },
    { status: 405 }
  )
}

// PUT method not allowed - admin is read-only
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed - Admin panel is read-only' },
    { status: 405 }
  )
}

// DELETE method not allowed - admin is read-only
export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed - Admin panel is read-only' },
    { status: 405 }
  )
}