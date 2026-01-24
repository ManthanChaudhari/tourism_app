import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// GET /api/admin/bookings/stats - Get booking statistics for admin dashboard
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
    
    // Parse query parameters for date range
    const { searchParams } = new URL(request.url)
    const dateFrom = searchParams.get('from') || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0] // Start of current year
    const dateTo = searchParams.get('to') || new Date().toISOString().split('T')[0] // Today
    
    // Get overall statistics
    const { data: totalStats, error: totalStatsError } = await supabase
      .from('bookings')
      .select('booking_type, booking_status, payment_status, total_amount, currency')
      .gte('created_at', dateFrom)
      .lte('created_at', dateTo + 'T23:59:59.999Z')
    
    if (totalStatsError) {
      console.error('Total stats error:', totalStatsError)
      return NextResponse.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      )
    }
    
    // Calculate summary statistics
    const stats = {
      total_bookings: totalStats.length,
      total_revenue: totalStats.reduce((sum, booking) => sum + parseFloat(booking.total_amount || 0), 0),
      
      // By booking type
      by_type: {
        package: totalStats.filter(b => b.booking_type === 'package').length,
        hotel: totalStats.filter(b => b.booking_type === 'hotel').length,
        car: totalStats.filter(b => b.booking_type === 'car').length
      },
      
      // By booking status
      by_booking_status: {
        pending: totalStats.filter(b => b.booking_status === 'pending').length,
        confirmed: totalStats.filter(b => b.booking_status === 'confirmed').length,
        cancelled: totalStats.filter(b => b.booking_status === 'cancelled').length,
        completed: totalStats.filter(b => b.booking_status === 'completed').length
      },
      
      // By payment status
      by_payment_status: {
        pending: totalStats.filter(b => b.payment_status === 'pending').length,
        paid: totalStats.filter(b => b.payment_status === 'paid').length,
        failed: totalStats.filter(b => b.payment_status === 'failed').length,
        refunded: totalStats.filter(b => b.payment_status === 'refunded').length
      },
      
      // Revenue by type
      revenue_by_type: {
        package: totalStats.filter(b => b.booking_type === 'package').reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
        hotel: totalStats.filter(b => b.booking_type === 'hotel').reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
        car: totalStats.filter(b => b.booking_type === 'car').reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0)
      },
      
      // Paid revenue only
      paid_revenue: totalStats.filter(b => b.payment_status === 'paid').reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0)
    }
    
    // Get daily booking trends for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const { data: dailyStats, error: dailyStatsError } = await supabase
      .from('bookings')
      .select('created_at, booking_type, total_amount, payment_status')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at', { ascending: true })
    
    if (dailyStatsError) {
      console.error('Daily stats error:', dailyStatsError)
    }
    
    // Process daily trends
    const dailyTrends = {}
    if (dailyStats) {
      dailyStats.forEach(booking => {
        const date = booking.created_at.split('T')[0]
        if (!dailyTrends[date]) {
          dailyTrends[date] = {
            date,
            bookings: 0,
            revenue: 0,
            paid_revenue: 0,
            package: 0,
            hotel: 0,
            car: 0
          }
        }
        
        dailyTrends[date].bookings += 1
        dailyTrends[date].revenue += parseFloat(booking.total_amount || 0)
        
        if (booking.payment_status === 'paid') {
          dailyTrends[date].paid_revenue += parseFloat(booking.total_amount || 0)
        }
        
        dailyTrends[date][booking.booking_type] += 1
      })
    }
    
    // Get recent bookings (last 10)
    const { data: recentBookings, error: recentError } = await supabase
      .from('bookings')
      .select(`
        id,
        booking_code,
        booking_type,
        service_title,
        booking_status,
        payment_status,
        total_amount,
        currency,
        created_at,
        customers:booking_customers!inner(full_name, is_primary)
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (recentError) {
      console.error('Recent bookings error:', recentError)
    }
    
    // Format recent bookings
    const formattedRecentBookings = (recentBookings || []).map(booking => {
      const primaryCustomer = booking.customers?.find(c => c.is_primary)
      return {
        id: booking.id,
        booking_code: booking.booking_code,
        booking_type: booking.booking_type,
        service_title: booking.service_title,
        customer_name: primaryCustomer?.full_name || 'N/A',
        booking_status: booking.booking_status,
        payment_status: booking.payment_status,
        total_amount: booking.total_amount,
        currency: booking.currency,
        created_at: booking.created_at
      }
    })
    
    // Calculate conversion rates
    const conversionRates = {
      booking_confirmation: stats.total_bookings > 0 
        ? ((stats.by_booking_status.confirmed + stats.by_booking_status.completed) / stats.total_bookings * 100).toFixed(2)
        : 0,
      payment_success: stats.total_bookings > 0 
        ? (stats.by_payment_status.paid / stats.total_bookings * 100).toFixed(2)
        : 0
    }
    
    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        conversion_rates: conversionRates,
        date_range: {
          from: dateFrom,
          to: dateTo
        }
      },
      daily_trends: Object.values(dailyTrends).sort((a, b) => a.date.localeCompare(b.date)),
      recent_bookings: formattedRecentBookings
    })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}