import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/bookings/guest/[booking_code] - Get booking details by booking code (for guest access)
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { booking_code } = params
    
    if (!booking_code) {
      return NextResponse.json(
        { error: 'Booking code is required' },
        { status: 400 }
      )
    }
    
    // Parse query parameters for additional verification
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    
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
    
    // For guest bookings, verify email or phone if provided
    if (email || phone) {
      const primaryCustomer = booking.customers?.find(c => c.is_primary)
      
      if (!primaryCustomer) {
        return NextResponse.json(
          { error: 'Booking verification failed' },
          { status: 403 }
        )
      }
      
      const emailMatch = !email || primaryCustomer.email?.toLowerCase() === email.toLowerCase()
      const phoneMatch = !phone || primaryCustomer.phone === phone
      
      if (!emailMatch && !phoneMatch) {
        return NextResponse.json(
          { error: 'Booking verification failed' },
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