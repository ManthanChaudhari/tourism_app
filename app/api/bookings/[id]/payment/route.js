import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// POST /api/bookings/[id]/payment - Process payment for a booking
export async function POST(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = params
    const paymentData = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    // Validate payment data
    if (!paymentData.payment_gateway || !paymentData.amount) {
      return NextResponse.json(
        { error: 'Payment gateway and amount are required' },
        { status: 400 }
      )
    }
    
    // Get user if authenticated (optional for guest bookings)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch booking to verify ownership and status
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('Fetch booking error:', fetchError)
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Check access permissions (user owns booking or guest booking)
    if (booking.user_id && (!user || user.id !== booking.user_id)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
    
    // Check if booking is in valid state for payment
    if (booking.booking_status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot process payment for cancelled booking' },
        { status: 400 }
      )
    }
    
    if (booking.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Booking is already paid' },
        { status: 400 }
      )
    }
    
    // Validate payment amount matches booking amount
    if (parseFloat(paymentData.amount) !== parseFloat(booking.total_amount)) {
      return NextResponse.json(
        { error: 'Payment amount does not match booking amount' },
        { status: 400 }
      )
    }
    
    // Create payment record
    const payment = {
      booking_id: id,
      payment_gateway: paymentData.payment_gateway,
      transaction_id: paymentData.transaction_id || null,
      payment_method: paymentData.payment_method || null,
      amount: paymentData.amount,
      currency: paymentData.currency || booking.currency || 'INR',
      payment_status: paymentData.payment_status || 'pending',
      paid_at: paymentData.payment_status === 'success' ? new Date().toISOString() : null,
      raw_response: paymentData.raw_response || null
    }
    
    // Insert payment record
    const { data: newPayment, error: paymentError } = await supabase
      .from('booking_payments')
      .insert([payment])
      .select()
      .single()
    
    if (paymentError) {
      console.error('Payment creation error:', paymentError)
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      )
    }
    
    // Update booking status if payment is successful
    if (paymentData.payment_status === 'success') {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'paid',
          booking_status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
      
      if (updateError) {
        console.error('Booking update error:', updateError)
        // Don't fail the request, payment is already recorded
      }
    } else if (paymentData.payment_status === 'failed') {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          payment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
      
      if (updateError) {
        console.error('Booking update error:', updateError)
      }
    }
    
    return NextResponse.json({
      success: true,
      payment: newPayment,
      message: paymentData.payment_status === 'success' 
        ? 'Payment processed successfully' 
        : 'Payment record created'
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/bookings/[id]/payment - Get payment history for a booking
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
    
    // Get user if authenticated
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fetch booking to verify ownership
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id')
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
    if (booking.user_id && (!user || user.id !== booking.user_id)) {
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
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }
    }
    
    // Fetch payment history
    const { data: payments, error: paymentsError } = await supabase
      .from('booking_payments')
      .select('*')
      .eq('booking_id', id)
      .order('created_at', { ascending: false })
    
    if (paymentsError) {
      console.error('Fetch payments error:', paymentsError)
      return NextResponse.json(
        { error: 'Failed to fetch payment history' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      payments: payments || []
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}