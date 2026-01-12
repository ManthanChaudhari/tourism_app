import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function PUT(request) {
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
    const { categoryIds } = body

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Category IDs array is required' },
        { status: 400 }
      )
    }

    // Add position field to categories table if it doesn't exist
    // This is a temporary solution - in production, you should run a proper migration
    try {
      await supabase.rpc('add_position_column_if_not_exists')
    } catch (error) {
      // Column might already exist, continue
      console.log('Position column check:', error.message)
    }

    // Update positions for all categories using a more robust approach
    const updates = categoryIds.map((categoryId, index) => ({
      id: categoryId,
      position: index + 1,
      updated_at: new Date().toISOString()
    }))

    // Use individual updates to ensure compatibility
    const updatePromises = updates.map(async (update) => {
      const { error } = await supabase
        .from('categories')
        .update({ 
          position: update.position,
          updated_at: update.updated_at 
        })
        .eq('id', update.id)
      
      if (error) {
        throw error
      }
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'Category order updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}