import { createSupabaseServerClient } from "@/lib/supabase/server"


export async function getOrCreateUserProfile(userData, additionalData = {}) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // First, try to get existing profile
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.id)
      .single()

    if (existingProfile && !fetchError) {
      return { success: true, profile: existingProfile, created: false }
    }

    // If profile doesn't exist, create it
    const createResult = await createUserProfile(userData, additionalData)
    
    if (createResult.success) {
      return { success: true, profile: createResult.profile, created: true }
    }

    return createResult
  } catch (error) {
    console.error('Get or create profile error:', error)
    return { success: false, error: error.message }
  }
}


export async function updateUserRole(userId, newRole, adminUserId) {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verify admin permissions
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminUserId)
      .single()

    if (adminError || adminProfile?.role !== 'admin') {
      return { success: false, error: 'Unauthorized - Admin access required' }
    }

    // Update user role
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Role update error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, profile: data }
  } catch (error) {
    console.error('Role update error:', error)
    return { success: false, error: error.message }
  }
}