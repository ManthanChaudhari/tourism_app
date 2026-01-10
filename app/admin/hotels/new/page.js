'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  Save, 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Star,
  Bed,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DestinationDropdown from '@/components/admin/DestinationDropdown'

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    destination_id: '',
    address: '',
    star_rating: 3,
    status: 'draft',
    short_description: '',
    check_in_time: '14:00',
    check_out_time: '11:00',
    contact_number: '',
    email: '',
    thumbnail_image: '',
    gallery_images: [],
    amenities: [],
    cancellation_policy: '',
    house_rules: ''
  })

  // Room management
  const [rooms, setRooms] = useState([
    {
      id: Date.now(),
      room_name: '',
      max_guests: 2,
      price_per_night: '',
      room_size: '',
      bed_type: ''
    }
  ])

  // Available amenities
  const availableAmenities = [
    'Free WiFi', 'Swimming Pool', 'Parking', 'Breakfast Included', 'Air Conditioning',
    'Gym/Fitness Center', 'Spa Services', 'Restaurant', 'Room Service', 'Laundry Service',
    'Business Center', 'Pet Friendly', 'Airport Shuttle', 'Concierge', 'Bar/Lounge',
    'Beach Access', 'Balcony/Terrace', 'Kitchen/Kitchenette', 'Safe', 'Elevator'
  ]

  const bedTypes = [
    'Single Bed', 'Twin Beds', 'Double Bed', 'Queen Bed', 'King Bed', 
    'Sofa Bed', 'Bunk Bed', 'Murphy Bed'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleGalleryImageAdd = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        gallery_images: [...prev.gallery_images, url.trim()]
      }))
    }
  }

  const handleGalleryImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }))
  }

  const handleRoomChange = (roomId, field, value) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, [field]: value }
        : room
    ))
  }

  const addRoom = () => {
    setRooms(prev => [...prev, {
      id: Date.now(),
      room_name: '',
      max_guests: 2,
      price_per_night: '',
      room_size: '',
      bed_type: ''
    }])
  }

  const removeRoom = (roomId) => {
    if (rooms.length > 1) {
      setRooms(prev => prev.filter(room => room.id !== roomId))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.name.trim()) {
      setError('Hotel name is required')
      return
    }

    if (!formData.destination_id) {
      setError('Destination is required')
      return
    }

    if (!formData.address.trim()) {
      setError('Address is required')
      return
    }

    // Validate rooms
    const validRooms = rooms.filter(room => 
      room.room_name.trim() && room.price_per_night && parseFloat(room.price_per_night) > 0
    )

    if (validRooms.length === 0) {
      setError('At least one valid room is required')
      return
    }

    setLoading(true)

    try {
      // Create hotel
      const hotelResponse = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          star_rating: parseInt(formData.star_rating)
        })
      })

      const hotelResult = await hotelResponse.json()

      if (!hotelResponse.ok) {
        throw new Error(hotelResult.error || 'Failed to create hotel')
      }

      // Create rooms
      const hotelId = hotelResult.hotel.id
      const roomPromises = validRooms.map(room => 
        fetch('/api/admin/hotel-rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            hotel_id: hotelId,
            room_name: room.room_name.trim(),
            max_guests: parseInt(room.max_guests),
            price_per_night: parseFloat(room.price_per_night),
            room_size: room.room_size.trim() || null,
            bed_type: room.bed_type || null
          })
        })
      )

      await Promise.all(roomPromises)

      // Redirect to hotels list
      router.push('/admin/hotels')
      
    } catch (error) {
      console.error('Create hotel error:', error)
      setError(error.message || 'Failed to create hotel. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/hotels">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Hotel</h1>
            <p className="text-gray-600 mt-1">Create a new hotel with rooms and amenities</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Hotel Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter hotel name"
                  className="w-full"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Destination *
                </label>
                <DestinationDropdown
                  value={formData.destination_id}
                  onChange={(value) => handleInputChange('destination_id', value)}
                  placeholder="Select destination"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter full address"
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Star Rating
                </label>
                <select
                  value={formData.star_rating}
                  onChange={(e) => handleInputChange('star_rating', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                placeholder="Brief description of the hotel"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Check-in Time
                </label>
                <Input
                  type="time"
                  value={formData.check_in_time}
                  onChange={(e) => handleInputChange('check_in_time', e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Check-out Time
                </label>
                <Input
                  type="time"
                  value={formData.check_out_time}
                  onChange={(e) => handleInputChange('check_out_time', e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <Input
                  type="tel"
                  value={formData.contact_number}
                  onChange={(e) => handleInputChange('contact_number', e.target.value)}
                  placeholder="Enter contact number"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email (Optional)
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-orange-600" />
              Media & Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Thumbnail Image
              </label>
              <Input
                type="url"
                value={formData.thumbnail_image}
                onChange={(e) => handleInputChange('thumbnail_image', e.target.value)}
                placeholder="Enter thumbnail image URL (e.g., https://example.com/hotel-main.jpg)"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Main image that will be displayed in hotel listings
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Gallery Images
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Add multiple images to showcase different areas of your hotel
                </p>
              </div>
              
              <div className="space-y-3">
                {formData.gallery_images.map((image, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex-1">
                      <Input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.gallery_images]
                          newImages[index] = e.target.value
                          handleInputChange('gallery_images', newImages)
                        }}
                        placeholder="Image URL"
                        className="w-full"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleGalleryImageRemove(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGalleryImageAdd}
                  className="w-full border-dashed border-2 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gallery Image
                </Button>
                
                {formData.gallery_images.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>{formData.gallery_images.length}</strong> gallery images added
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              Amenities
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Available Amenities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-start space-x-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                        className="mt-0.5 rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 leading-5">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formData.amenities.length > 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                  <p className="text-sm text-orange-800">
                    <strong>{formData.amenities.length}</strong> amenities selected: {formData.amenities.slice(0, 3).join(', ')}
                    {formData.amenities.length > 3 && ` and ${formData.amenities.length - 3} more`}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Room Management */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-orange-600" />
              Room Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {rooms.map((room, index) => (
              <div key={room.id} className="p-5 border border-gray-200 rounded-xl space-y-5 bg-gray-50 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900 text-lg">Room {index + 1}</h4>
                  {rooms.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRoom(room.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Room Name *
                    </label>
                    <Input
                      type="text"
                      value={room.room_name}
                      onChange={(e) => handleRoomChange(room.id, 'room_name', e.target.value)}
                      placeholder="e.g., Deluxe Room"
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Max Guests *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={room.max_guests}
                      onChange={(e) => handleRoomChange(room.id, 'max_guests', e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Price per Night *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={room.price_per_night}
                        onChange={(e) => handleRoomChange(room.id, 'price_per_night', e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Room Size
                    </label>
                    <Input
                      type="text"
                      value={room.room_size}
                      onChange={(e) => handleRoomChange(room.id, 'room_size', e.target.value)}
                      placeholder="e.g., 25 sqm"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Bed Type
                    </label>
                    <select
                      value={room.bed_type}
                      onChange={(e) => handleRoomChange(room.id, 'bed_type', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select bed type</option>
                      {bedTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addRoom}
              className="w-full border-dashed border-2 py-4 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Room
            </Button>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Policies & Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Cancellation Policy
              </label>
              <textarea
                value={formData.cancellation_policy}
                onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
                placeholder="Describe the cancellation policy (e.g., Free cancellation up to 24 hours before check-in, 50% refund for cancellations within 24 hours)"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
              />
              <p className="text-xs text-gray-500">
                Clearly state your cancellation terms and any applicable fees
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                House Rules
              </label>
              <textarea
                value={formData.house_rules}
                onChange={(e) => handleInputChange('house_rules', e.target.value)}
                placeholder="List the house rules (e.g., No smoking, No pets allowed, Quiet hours: 10 PM - 7 AM, Check-in after 2 PM)"
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none text-sm"
              />
              <p className="text-xs text-gray-500">
                Set clear expectations for guest behavior and property usage
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Make sure all required fields are filled before creating the hotel
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/hotels">
                <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 min-w-[160px] font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Hotel
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}