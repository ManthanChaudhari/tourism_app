import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/destinations - Get all destinations for public use
export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit')) || 50

    // Build query
    let query = supabase
      .from('locations')
      .select('id, name, state, country, created_at')
      .order('name', { ascending: true })
      .limit(limit)

    // Apply search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,state.ilike.%${search}%`)
    }

    const { data: destinations, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch destinations' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      destinations: destinations || []
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}