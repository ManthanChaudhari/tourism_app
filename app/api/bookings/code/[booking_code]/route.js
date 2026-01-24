import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/bookings/code/[booking_code] - Get booking details by booking code (authenticated or guest)
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { booking_code } = await params
    
    if (!booking_code) {
      return NextResponse.json(
        { error: 'Booking code is required' },
        { status: 400 }
      )
    }
    
    // Get user if authenticated (optional)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch booking with all related data
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        customers:booking_customers(*),
        payments:booking_payments(*),
        meta:booking_meta(*)
      `)
      .eq('booking_code', booking_code)
      .single()
    
    if (fetchError) {
      console.error('Fetch booking error:', fetchError)
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check access permissions
    // Allow access if:
    // 1. User owns the booking (authenticated user)
    // 2. Guest booking (no user_id)
    // 3. User is admin
    if (booking.user_id && user?.id !== booking.user_id) {
      // Check if user is admin
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        
        if (!profile || profile.role !== 'admin') {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          )
        }
      } else {
        // For guest bookings, we could add additional verification here
        // For now, we'll allow access to any booking without user_id
        if (booking.user_id) {
          return NextResponse.json(
            { error: 'Access denied' },
            { status: 403 }
          )
        }
      }
    }
    
    // Format meta data as key-value object
    const metaData = {}
    if (booking.meta && booking.meta.length > 0) {
      booking.meta.forEach(item => {
        metaData[item.key] = item.value
      })
    }
    
    // Format response
    const formattedBooking = {
      ...booking,
      meta: metaData
    }
    
    return NextResponse.json({
      success: true,
      booking: formattedBooking
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}