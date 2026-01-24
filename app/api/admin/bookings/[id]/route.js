import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/admin/bookings/[id] - Get detailed booking information for admin
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
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
    
    // Fetch complete booking details
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers:booking_customers(*),
        payments:booking_payments(*),
        meta:booking_meta(*)
      `)
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Fetch booking error:', fetchError)
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Format meta data as key-value object
    const metaData = {}
    if (booking.meta && booking.meta.length > 0) {
      booking.meta.forEach(item => {
        metaData[item.key] = item.value
      })
    }
    
    // Separate customers by type
    const adults = booking.customers?.filter(c => c.customer_type === 'adult') || []
    const children = booking.customers?.filter(c => c.customer_type === 'child') || []
    const primaryCustomer = booking.customers?.find(c => c.is_primary)
    
    // Format detailed booking response for admin
    const detailedBooking = {
      // Basic booking info
      id: booking.id,
      booking_code: booking.booking_code,
      booking_type: booking.booking_type,
      service_id: booking.service_id,
      service_title: booking.service_title,
      user_id: booking.user_id,
      
      // Status information
      booking_status: booking.booking_status,
      payment_status: booking.payment_status,
      
      // Date and duration
      start_date: booking.start_date,
      end_date: booking.end_date,
      duration_days: booking.duration_days,
      
      // Guest counts
      adults_count: booking.adults_count,
      children_count: booking.children_count,
      rooms_count: booking.rooms_count,
      vehicles_count: booking.vehicles_count,
      
      // Pricing
      total_amount: booking.total_amount,
      currency: booking.currency,
      
      // Timestamps
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      
      // Customer details
      primary_customer: primaryCustomer ? {
        id: primaryCustomer.id,
        full_name: primaryCustomer.full_name,
        email: primaryCustomer.email,
        phone: primaryCustomer.phone,
        age: primaryCustomer.age,
        customer_type: primaryCustomer.customer_type
      } : null,
      
      adults: adults.map(adult => ({
        id: adult.id,
        full_name: adult.full_name,
        email: adult.email,
        phone: adult.phone,
        age: adult.age,
        is_primary: adult.is_primary
      })),
      
      children: children.map(child => ({
        id: child.id,
        full_name: child.full_name,
        age: child.age
      })),
      
      // Payment history
      payments: (booking.payments || []).map(payment => ({
        id: payment.id,
        payment_gateway: payment.payment_gateway,
        transaction_id: payment.transaction_id,
        payment_method: payment.payment_method,
        amount: payment.amount,
        currency: payment.currency,
        payment_status: payment.payment_status,
        paid_at: payment.paid_at,
        created_at: payment.created_at,
        refund_amount: payment.refund_amount,
        refund_status: payment.refund_status,
        refunded_at: payment.refunded_at
      })),
      
      // Service-specific metadata
      meta: metaData,
      
      // Formatted display fields
      display: {
        guest_summary: `${booking.adults_count} Adult${booking.adults_count > 1 ? 's' : ''}${booking.children_count > 0 ? `, ${booking.children_count} Child${booking.children_count > 1 ? 'ren' : ''}` : ''}`,
        date_range: `${booking.start_date} to ${booking.end_date}`,
        duration_text: `${booking.duration_days} day${booking.duration_days > 1 ? 's' : ''}`,
        service_summary: booking.booking_type === 'hotel' 
          ? `${booking.rooms_count} Room${booking.rooms_count > 1 ? 's' : ''}`
          : booking.booking_type === 'car'
          ? `${booking.vehicles_count} Vehicle${booking.vehicles_count > 1 ? 's' : ''}`
          : 'Package',
        amount_formatted: `${booking.currency} ${booking.total_amount.toLocaleString()}`,
        status_badge: {
          booking: booking.booking_status,
          payment: booking.payment_status,
          booking_color: booking.booking_status === 'confirmed' ? 'green' : 
                        booking.booking_status === 'cancelled' ? 'red' : 
                        booking.booking_status === 'completed' ? 'blue' : 'yellow',
          payment_color: booking.payment_status === 'paid' ? 'green' : 
                        booking.payment_status === 'failed' ? 'red' : 
                        booking.payment_status === 'refunded' ? 'orange' : 'yellow'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      booking: detailedBooking
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST, PUT, DELETE methods not allowed - admin is read-only
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed - Admin panel is read-only' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed - Admin panel is read-only' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed - Admin panel is read-only' },
    { status: 405 }
  )
}