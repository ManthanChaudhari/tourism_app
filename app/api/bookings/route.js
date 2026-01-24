import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Helper function to validate booking data
function validateBookingData(data) {
  const errors = []
  
  if (!data.booking_type || !['package', 'hotel', 'car'].includes(data.booking_type)) {
    errors.push('Invalid booking type')
  }
  
  if (!data.service_id) {
    errors.push('Service ID is required')
  }
  
  if (!data.service_title) {
    errors.push('Service title is required')
  }
  
  if (!data.start_date || !data.end_date) {
    errors.push('Start date and end date are required')
  }
  
  if (new Date(data.start_date) >= new Date(data.end_date)) {
    errors.push('End date must be after start date')
  }
  
  if (!data.adults_count || data.adults_count < 1) {
    errors.push('At least 1 adult is required')
  }
  
  if (data.children_count < 0) {
    errors.push('Children count cannot be negative')
  }
  
  if (data.booking_type === 'hotel' && (!data.rooms_count || data.rooms_count < 1)) {
    errors.push('At least 1 room is required for hotel bookings')
  }
  
  if (data.booking_type === 'car' && (!data.vehicles_count || data.vehicles_count < 1)) {
    errors.push('At least 1 vehicle is required for car bookings')
  }
  
  if (!data.total_amount || data.total_amount <= 0) {
    errors.push('Total amount must be greater than 0')
  }
  
  if (!data.customers || !Array.isArray(data.customers) || data.customers.length === 0) {
    errors.push('At least one customer is required')
  }
  
  // Validate primary customer
  const primaryCustomer = data.customers?.find(c => c.is_primary)
  if (!primaryCustomer) {
    errors.push('A primary customer is required')
  } else {
    if (!primaryCustomer.full_name) {
      errors.push('Primary customer name is required')
    }
    if (!primaryCustomer.email) {
      errors.push('Primary customer email is required')
    }
    if (!primaryCustomer.phone) {
      errors.push('Primary customer phone is required')
    }
  }
  
  return errors
}

// Helper function to calculate duration
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// POST /api/bookings - Create a new booking
export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const bookingData = await request.json()
    
    // Validate booking data
    const validationErrors = validateBookingData(bookingData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }
    
    // Get user if authenticated (optional for guest bookings)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Calculate duration
    const duration = calculateDuration(bookingData.start_date, bookingData.end_date)
    
    // Prepare booking record
    const booking = {
      booking_type: bookingData.booking_type,
      service_id: bookingData.service_id,
      service_title: bookingData.service_title,
      user_id: user?.id || null,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      duration_days: duration,
      adults_count: bookingData.adults_count,
      children_count: bookingData.children_count || 0,
      rooms_count: bookingData.booking_type === 'hotel' ? bookingData.rooms_count : null,
      vehicles_count: bookingData.booking_type === 'car' ? bookingData.vehicles_count : null,
      total_amount: bookingData.total_amount,
      currency: bookingData.currency || 'INR',
      booking_status: 'pending',
      payment_status: 'pending'
    }
    
    // Start transaction
    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert([booking])
      .select()
      .single()
    
    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }
    
    // Insert customers
    const customers = bookingData.customers.map(customer => ({
      booking_id: newBooking.id,
      full_name: customer.full_name,
      email: customer.email || null,
      phone: customer.phone || null,
      age: customer.age || null,
      customer_type: customer.customer_type || 'adult',
      is_primary: customer.is_primary || false
    }))
    
    const { error: customersError } = await supabase
      .from('booking_customers')
      .insert(customers)
    
    if (customersError) {
      console.error('Customers creation error:', customersError)
      // Rollback booking
      await supabase.from('bookings').delete().eq('id', newBooking.id)
      return NextResponse.json(
        { error: 'Failed to create booking customers' },
        { status: 500 }
      )
    }
    
    // Insert meta data if provided
    if (bookingData.meta && Object.keys(bookingData.meta).length > 0) {
      const metaEntries = Object.entries(bookingData.meta).map(([key, value]) => ({
        booking_id: newBooking.id,
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value)
      }))
      
      const { error: metaError } = await supabase
        .from('booking_meta')
        .insert(metaEntries)
      
      if (metaError) {
        console.error('Meta data creation error:', metaError)
        // Continue without meta data - not critical
      }
    }
    
    // Fetch complete booking data for response
    const { data: completeBooking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers:booking_customers(*),
        meta:booking_meta(*)
      `)
      .eq('id', newBooking.id)
      .single()
    
    if (fetchError) {
      console.error('Fetch complete booking error:', fetchError)
      return NextResponse.json(
        { error: 'Booking created but failed to fetch details' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      booking: completeBooking,
      message: 'Booking created successfully'
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/bookings - Get user's bookings (authenticated users only)
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    }
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const booking_type = searchParams.get('booking_type') || ''
    const status = searchParams.get('status') || ''
    
    // Validate pagination
    const validatedPage = Math.max(1, page)
    const validatedLimit = Math.min(Math.max(1, limit), 50)
    const offset = (validatedPage - 1) * validatedLimit
    
    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customers:booking_customers(*),
        payments:booking_payments(*),
        meta:booking_meta(*)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (booking_type && booking_type !== 'all') {
      query = query.eq('booking_type', booking_type)
    }
    
    if (status && status !== 'all') {
      query = query.eq('booking_status', status)
    }
    
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
    
    // Calculate pagination metadata
    const totalItems = count || 0
    const totalPages = Math.ceil(totalItems / validatedLimit)
    
    return NextResponse.json({
      success: true,
      bookings: bookings || [],
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        itemsPerPage: validatedLimit,
        hasNextPage: validatedPage < totalPages,
        hasPrevPage: validatedPage > 1
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