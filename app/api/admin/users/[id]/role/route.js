import { createSupabaseServerClient } from "@/lib/supabase/server"
import { updateUserRole } from "@/lib/auth-utils"
import { NextResponse } from "next/server"

export async function PUT(request, { params }) {
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

    const { role } = await request.json()
    const { id: targetUserId } = params

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "user" or "admin"' },
        { status: 400 }
      )
    }

    // Update user role using utility function
    const result = await updateUserRole(targetUserId, role, user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error.includes('Unauthorized') ? 403 : 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
      profile: result.profile
    })

  } catch (error) {
    console.error('Role update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request, { params }) {
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

    const { id: targetUserId } = params

    // Get user profile
    const { data: userProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: userProfile
    })

  } catch (error) {
    console.error('Get user profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}