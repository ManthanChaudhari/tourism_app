import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"

// GET /api/admin/hotels/[id] - Get single hotel
export async function GET(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params

    const { data: hotel, error } = await supabase
      .from('hotels')
      .select(`
        *,
        destination:locations(id, name),
        rooms:hotel_rooms(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Hotel not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/hotels/[id] - Update hotel
export async function PUT(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params
    
    // Check if request is FormData (file upload) or JSON
    const contentType = request.headers.get('content-type')
    let hotelData
    let thumbnailImageUrl = null
    let galleryImageUrls = []

    if (contentType?.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData()
      
      hotelData = {
        name: formData.get('name'),
        destination_id: formData.get('destination_id'),
        address: formData.get('address'),
        star_rating: parseInt(formData.get('star_rating')) || 3,
        status: formData.get('status') || 'draft',
        short_description: formData.get('short_description'),
        check_in_time: formData.get('check_in_time') || '14:00:00',
        check_out_time: formData.get('check_out_time') || '11:00:00',
        contact_number: formData.get('contact_number'),
        email: formData.get('email'),
        amenities: JSON.parse(formData.get('amenities') || '[]'),
        cancellation_policy: formData.get('cancellation_policy'),
        house_rules: formData.get('house_rules')
      }

      // Handle thumbnail image upload
      const thumbnailImage = formData.get('thumbnailImage')
      const keepExistingThumbnail = formData.get('keepExistingThumbnail') === 'true'
      
      if (thumbnailImage && thumbnailImage.size > 0) {
        const thumbnailFileName = `hotels/${Date.now()}-${thumbnailImage.name}`
        
        const { error: thumbnailError } = await supabase.storage
          .from('hotel-images')
          .upload(thumbnailFileName, thumbnailImage, {
            cacheControl: '3600',
            upsert: false
          })

        if (thumbnailError) {
          console.error('Thumbnail upload error:', thumbnailError)
          return NextResponse.json(
            { success: false, error: 'Failed to upload thumbnail image' },
            { status: 500 }
          )
        }

        const { data: { publicUrl } } = supabase.storage
          .from('hotel-images')
          .getPublicUrl(thumbnailFileName)
        
        thumbnailImageUrl = publicUrl
      } else if (keepExistingThumbnail) {
        // Keep existing thumbnail, don't update it
        delete hotelData.thumbnail_image
      }

      // Handle gallery images upload
      const galleryImages = formData.getAll('galleryImages')
      const keepExistingGallery = formData.get('keepExistingGallery') === 'true'
      
      if (galleryImages.length > 0 && galleryImages[0].size > 0) {
        for (const image of galleryImages) {
          if (image && image.size > 0) {
            const galleryFileName = `hotels/gallery/${Date.now()}-${image.name}`
            
            const { error: galleryError } = await supabase.storage
              .from('hotel-images')
              .upload(galleryFileName, image, {
                cacheControl: '3600',
                upsert: false
              })

            if (!galleryError) {
              const { data: { publicUrl } } = supabase.storage
                .from('hotel-images')
                .getPublicUrl(galleryFileName)
              
              galleryImageUrls.push(publicUrl)
            }
          }
        }
      } else if (keepExistingGallery) {
        // Keep existing gallery, don't update it
        delete hotelData.gallery_images
      }

      // Set image URLs
      if (thumbnailImageUrl) {
        hotelData.thumbnail_image = thumbnailImageUrl
      }
      if (galleryImageUrls.length > 0) {
        hotelData.gallery_images = galleryImageUrls
      }

      // Handle existing gallery URLs from form
      const existingGalleryUrls = formData.get('gallery_images')
      if (existingGalleryUrls) {
        try {
          const parsedUrls = JSON.parse(existingGalleryUrls)
          if (Array.isArray(parsedUrls)) {
            hotelData.gallery_images = [...(hotelData.gallery_images || []), ...parsedUrls]
          }
        } catch (e) {
          console.error('Error parsing gallery URLs:', e)
        }
      }
    } else {
      // Handle JSON request (backward compatibility)
      const body = await request.json()
      
      const {
        name,
        destination_id,
        address,
        star_rating,
        status,
        short_description,
        check_in_time,
        check_out_time,
        contact_number,
        email,
        thumbnail_image,
        gallery_images,
        amenities,
        cancellation_policy,
        house_rules
      } = body

      hotelData = {
        name,
        destination_id,
        address,
        star_rating: parseInt(star_rating) || 3,
        status: status || 'draft',
        short_description,
        check_in_time: check_in_time || '14:00:00',
        check_out_time: check_out_time || '11:00:00',
        contact_number,
        email,
        thumbnail_image,
        gallery_images: gallery_images || [],
        amenities: amenities || [],
        cancellation_policy,
        house_rules
      }
    }

    // Validation
    if (!hotelData.name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Hotel name is required' },
        { status: 400 }
      )
    }

    if (!hotelData.destination_id) {
      return NextResponse.json(
        { success: false, error: 'Destination is required' },
        { status: 400 }
      )
    }

    if (!hotelData.address?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Address is required' },
        { status: 400 }
      )
    }

    // Clean up data for update
    const updateData = {
      name: hotelData.name.trim(),
      destination_id: hotelData.destination_id,
      address: hotelData.address.trim(),
      star_rating: hotelData.star_rating,
      status: hotelData.status,
      short_description: hotelData.short_description?.trim() || null,
      check_in_time: hotelData.check_in_time,
      check_out_time: hotelData.check_out_time,
      contact_number: hotelData.contact_number?.trim() || null,
      email: hotelData.email?.trim() || null,
      amenities: hotelData.amenities || [],
      cancellation_policy: hotelData.cancellation_policy?.trim() || null,
      house_rules: hotelData.house_rules?.trim() || null,
      updated_at: new Date().toISOString()
    }

    // Only update image fields if they were provided
    if (hotelData.hasOwnProperty('thumbnail_image')) {
      updateData.thumbnail_image = hotelData.thumbnail_image
    }
    if (hotelData.hasOwnProperty('gallery_images')) {
      updateData.gallery_images = hotelData.gallery_images
    }

    // Update hotel
    const { data: hotel, error } = await supabase
      .from('hotels')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Hotel not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/hotels/[id] - Partial update (e.g., status toggle)
export async function PATCH(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params
    const body = await request.json()

    // Update hotel with provided fields
    const { data: hotel, error } = await supabase
      .from('hotels')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Hotel not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel updated successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/hotels/[id] - Delete hotel
export async function DELETE(request, { params }) {
  try {
    const supabase = await createSupabaseServerClient()
    const { id } = await params

    // Delete hotel (rooms will be deleted automatically due to CASCADE)
    const { error } = await supabase
      .from('hotels')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Hotel deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}