import { createSupabaseServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Helper function to generate slug from name
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

    const awaitedParams = await params
    const categoryId = awaitedParams.id

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single()

    if (fetchError) {
      console.error('Database fetch error:', fetchError)
      
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      category
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    const awaitedParams = await params
    const categoryId = awaitedParams.id

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id, slug')
      .eq('id', categoryId)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to verify category' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { 
      name, 
      slug, 
      description, 
      icon, 
      banner_image, 
      is_featured, 
      status 
    } = body

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (status && !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either "active" or "inactive"' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug && slug.trim() ? slug.trim() : generateSlug(name.trim())

    // Check if slug is unique (excluding current category)
    if (finalSlug !== existingCategory.slug) {
      const { data: slugConflict, error: slugCheckError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', finalSlug)
        .neq('id', categoryId)
        .single()

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Slug must be unique. This slug already exists.' },
          { status: 400 }
        )
      }
    }

    // Update category
    const categoryData = {
      name: name.trim(),
      slug: finalSlug,
      description: description?.trim() || null,
      icon: icon?.trim() || null,
      banner_image: banner_image?.trim() || null,
      is_featured: is_featured !== undefined ? Boolean(is_featured) : undefined,
      status: status || undefined,
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key] === undefined) {
        delete categoryData[key]
      }
    })

    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', categoryId)
      .select()
      .single()

    if (updateError) {
      console.error('Database update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
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

    const awaitedParams = await params
    const categoryId = awaitedParams.id

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const { data: existingCategory, error: checkError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', categoryId)
      .single()

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to verify category' },
        { status: 500 }
      )
    }

    // Check if category is being used by any packages
    const { data: packagesUsingCategory, error: packagesCheckError } = await supabase
      .from('packages')
      .select('id')
      .eq('category', existingCategory.name.toLowerCase())
      .limit(1)

    if (packagesCheckError) {
      console.error('Packages check error:', packagesCheckError)
      return NextResponse.json(
        { error: 'Failed to check category usage' },
        { status: 500 }
      )
    }

    if (packagesUsingCategory && packagesUsingCategory.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that is being used by packages. Please update or delete those packages first.' },
        { status: 400 }
      )
    }

    // Delete the category
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}