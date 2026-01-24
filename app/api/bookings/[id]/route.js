import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/bookings/[id] - Get booking details
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
    
    // Get user if authenticated (for ownership check)
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
      .eq('id', id)
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
    // 1. User owns the booking
    // 2. User is admin
    // 3. Guest booking (no user_id) - will be handled by booking_code verification in frontend
    if (booking.user_id && user?.id !== booking.user_id) {
      // Check if user is admin
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