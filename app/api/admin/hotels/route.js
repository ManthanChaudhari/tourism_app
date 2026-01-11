import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from "@/lib/supabase/server"


export async function GET(request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const rating = searchParams.get('rating') || ''
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('hotels')
      .select(`
        *,
        destination:locations(id, name),
        room_count:hotel_rooms(count)
      `)

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`)
    }

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (rating && rating !== 'all') {
      query = query.eq('star_rating', parseInt(rating))
    }

    // Get total count for pagination
    const { count: totalItems } = await supabase
      .from('hotels')
      .select('*', { count: 'exact', head: true })

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    const { data: hotels, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch hotels' },
        { status: 500 }
      )
    }

    // Process hotels data
    const processedHotels = hotels.map(hotel => ({
      ...hotel,
      room_count: hotel.room_count?.[0]?.count || 0
    }))

    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json({
      success: true,
      hotels: processedHotels,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/hotels - Create new hotel
export async function POST(request) {
  try {
    const supabase = await createSupabaseServerClient()
    
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
      if (thumbnailImage && thumbnailImage.size > 0) {
        try {
          const thumbnailFileName = `hotels/${Date.now()}-${thumbnailImage.name}`
          
          console.log('Attempting to upload thumbnail:', {
            fileName: thumbnailFileName,
            fileSize: thumbnailImage.size,
            fileType: thumbnailImage.type
          })

          const { error: thumbnailError } = await supabase.storage
            .from('hotel-images')
            .upload(thumbnailFileName, thumbnailImage, {
              cacheControl: '3600',
              upsert: false
            })

          if (thumbnailError) {
            console.error('Thumbnail upload error:', thumbnailError)
            return NextResponse.json(
              { 
                success: false, 
                error: 'Failed to upload thumbnail image',
                details: thumbnailError.message,
                code: thumbnailError.statusCode || thumbnailError.status
              },
              { status: 500 }
            )
          }

          const { data: { publicUrl } } = supabase.storage
            .from('hotel-images')
            .getPublicUrl(thumbnailFileName)
          
          thumbnailImageUrl = publicUrl
          console.log('Thumbnail uploaded successfully:', publicUrl)
        } catch (uploadError) {
          console.error('Thumbnail upload exception:', uploadError)
          return NextResponse.json(
            { 
              success: false, 
              error: 'Failed to upload thumbnail image',
              details: uploadError.message
            },
            { status: 500 }
          )
        }
      }

      // Handle gallery images upload
      const galleryImages = formData.getAll('galleryImages')
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

    // Clean up data
    const cleanedData = {
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
      thumbnail_image: hotelData.thumbnail_image || null,
      gallery_images: hotelData.gallery_images || [],
      amenities: hotelData.amenities || [],
      cancellation_policy: hotelData.cancellation_policy?.trim() || null,
      house_rules: hotelData.house_rules?.trim() || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Create hotel
    const { data: hotel, error } = await supabase
      .from('hotels')
      .insert(cleanedData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to create hotel' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      hotel,
      message: 'Hotel created successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}