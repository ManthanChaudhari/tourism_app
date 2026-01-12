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
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Users,
  DollarSign,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DestinationDropdown from '@/components/admin/DestinationDropdown'

export default function NewHotelPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [expandedRooms, setExpandedRooms] = useState({})

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    destination_id: '',
    address: '',
    star_rating: 3,
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

  // File upload states
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [galleryPreviews, setGalleryPreviews] = useState([])

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

  // Available amenities grouped
  const amenityGroups = {
    'Connectivity': ['Free WiFi', 'Business Center'],
    'Recreation': ['Swimming Pool', 'Gym/Fitness Center', 'Spa Services', 'Beach Access'],
    'Services': ['Restaurant', 'Room Service', 'Laundry Service', 'Concierge', 'Airport Shuttle'],
    'Facilities': ['Parking', 'Elevator', 'Safe', 'Bar/Lounge'],
    'Room Features': ['Air Conditioning', 'Balcony/Terrace', 'Kitchen/Kitchenette'],
    'Policies': ['Breakfast Included', 'Pet Friendly']
  }

  const bedTypes = [
    'Single Bed', 'Twin Beds', 'Double Bed', 'Queen Bed', 'King Bed', 
    'Sofa Bed', 'Bunk Bed', 'Murphy Bed'
  ]

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'media', label: 'Media', icon: Upload },
    { id: 'amenities', label: 'Amenities', icon: Star },
    { id: 'rooms', label: 'Rooms', icon: Bed },
    { id: 'policies', label: 'Policies', icon: FileText }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate slug from name if slug is empty
    if (field === 'name' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: autoSlug
      }));
    }
  }

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setThumbnailPreview(e.target.result)
      reader.readAsDataURL(file)
      // Clear URL input when file is selected
      setFormData(prev => ({ ...prev, thumbnail_image: '' }))
    }
  }

  const handleThumbnailUrlChange = (url) => {
    setFormData(prev => ({ ...prev, thumbnail_image: url }))
    if (url) {
      // Clear file input when URL is entered
      setThumbnailFile(null)
      setThumbnailPreview('')
    }
  }

  const handleGalleryFilesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setGalleryFiles(prev => [...prev, ...files])
      
      // Create previews
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setGalleryPreviews(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            file: file,
            isFile: true
          }])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeGalleryFile = (index, isFile = false) => {
    if (isFile) {
      setGalleryFiles(prev => prev.filter((_, i) => i !== index))
      setGalleryPreviews(prev => prev.filter(item => !item.isFile || item.file !== galleryFiles[index]))
    } else {
      handleGalleryImageRemove(index)
    }
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
      // Add to previews for URL images
      setGalleryPreviews(prev => [...prev, {
        id: Date.now(),
        url: url.trim(),
        isFile: false
      }])
    }
  }

  const handleGalleryImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }))
    // Remove from previews for URL images
    setGalleryPreviews(prev => prev.filter((item, i) => item.isFile || i !== index))
  }

  const handleRoomChange = (roomId, field, value) => {
    setRooms(prev => prev.map(room => 
      room.id === roomId 
        ? { ...room, [field]: value }
        : room
    ))
  }

  const addRoom = () => {
    const newRoom = {
      id: Date.now(),
      room_name: '',
      max_guests: 2,
      price_per_night: '',
      room_size: '',
      bed_type: ''
    }
    setRooms(prev => [...prev, newRoom])
    setExpandedRooms(prev => ({ ...prev, [newRoom.id]: true }))
  }

  const removeRoom = (roomId) => {
    if (rooms.length > 1) {
      setRooms(prev => prev.filter(room => room.id !== roomId))
      setExpandedRooms(prev => {
        const newExpanded = { ...prev }
        delete newExpanded[roomId]
        return newExpanded
      })
    }
  }

  const toggleRoomExpansion = (roomId) => {
    setExpandedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }))
  }

  const getRoomSummary = (room) => {
    const parts = []
    if (room.room_name) parts.push(room.room_name)
    if (room.price_per_night) parts.push(`₹${room.price_per_night}/night`)
    if (room.max_guests) parts.push(`${room.max_guests} guests`)
    return parts.length > 0 ? parts.join(' • ') : 'New Room'
  }

  const handleSubmit = async (status = 'draft') => {
    setError('')
    
    // Validation
    if (!formData.name.trim()) {
      setError('Hotel name is required')
      setActiveTab('basic')
      return
    }

    if (!formData.destination_id) {
      setError('Destination is required')
      setActiveTab('basic')
      return
    }

    if (!formData.address.trim()) {
      setError('Address is required')
      setActiveTab('basic')
      return
    }

    // Validate rooms
    const validRooms = rooms.filter(room => 
      room.room_name.trim() && room.price_per_night && parseFloat(room.price_per_night) > 0
    )

    if (validRooms.length === 0) {
      setError('At least one valid room is required')
      setActiveTab('rooms')
      return
    }

    setLoading(true)

    try {
      // Prepare form data for file upload
      const submitFormData = new FormData()
      
      // Add basic hotel data
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          submitFormData.append(key, JSON.stringify(formData[key]))
        } else if (key !== 'thumbnail_image' && key !== 'gallery_images') {
          submitFormData.append(key, formData[key] || '')
        }
      })
      
      submitFormData.append('status', status)
      submitFormData.append('star_rating', formData.star_rating.toString())

      // Add thumbnail file or URL
      if (thumbnailFile) {
        submitFormData.append('thumbnailImage', thumbnailFile)
      } else if (formData.thumbnail_image) {
        submitFormData.append('thumbnail_image', formData.thumbnail_image)
      }

      // Add gallery files
      galleryFiles.forEach(file => {
        submitFormData.append('galleryImages', file)
      })

      // Add gallery URLs if any
      if (formData.gallery_images.length > 0) {
        submitFormData.append('gallery_images', JSON.stringify(formData.gallery_images))
      }

      // Create hotel
      const hotelResponse = await fetch('/api/admin/hotels', {
        method: 'POST',
        body: submitFormData // Don't set Content-Type header, let browser set it
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

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Hotel Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter hotel name"
              className="h-9"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug
            </label>
            <Input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="hotel-url-slug"
              className="h-9"
            />
            <p className="text-xs text-gray-500 mt-1">
              URL-friendly version of the hotel name. Leave empty to auto-generate.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <DestinationDropdown
              value={formData.destination_id}
              onChange={(value) => handleInputChange('destination_id', value)}
              placeholder="Select destination"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <Input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              className="h-9"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              placeholder="Brief description of the hotel"
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
            />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Settings & Contact</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Star Rating
              </label>
              <select
                value={formData.star_rating}
                onChange={(e) => handleInputChange('star_rating', e.target.value)}
                className="w-full h-9 border border-gray-300 rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {[1, 2, 3, 4, 5].map(rating => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Time
              </label>
              <Input
                type="time"
                value={formData.check_in_time}
                onChange={(e) => handleInputChange('check_in_time', e.target.value)}
                className="h-9"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Time
              </label>
              <Input
                type="time"
                value={formData.check_out_time}
                onChange={(e) => handleInputChange('check_out_time', e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <Input
              type="tel"
              value={formData.contact_number}
              onChange={(e) => handleInputChange('contact_number', e.target.value)}
              placeholder="Enter contact number"
              className="h-9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className="h-9"
            />
          </div>
        </div>
      </Card>
    </div>
  )

  const renderMedia = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Thumbnail Image</h3>
        <div className="space-y-4">
          {/* File Upload Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload from Device
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                />
              </label>
            </div>
          </div>

          {/* URL Input Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Image URL
            </label>
            <Input
              type="url"
              value={formData.thumbnail_image}
              onChange={(e) => handleThumbnailUrlChange(e.target.value)}
              placeholder="Enter thumbnail image URL"
              className="h-9"
              disabled={!!thumbnailFile}
            />
          </div>

          <p className="text-xs text-gray-500">
            Main image displayed in hotel listings
          </p>

          {/* Preview */}
          {(thumbnailPreview || formData.thumbnail_image) && (
            <div className="mt-3">
              <img
                src={thumbnailPreview || formData.thumbnail_image}
                alt="Thumbnail preview"
                className="w-full h-32 object-cover rounded-md border"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setThumbnailFile(null)
                  setThumbnailPreview('')
                  setFormData(prev => ({ ...prev, thumbnail_image: '' }))
                }}
                className="mt-2 text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Gallery Images</h3>
        <div className="space-y-4">
          {/* File Upload Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Multiple Images
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-3 pb-3">
                  <Upload className="w-6 h-6 mb-1 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Upload gallery images</span>
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryFilesChange}
                />
              </label>
            </div>
          </div>

          {/* URL Input Option */}
          <div>
            <Button
              type="button"
              variant="outline"
              onClick={handleGalleryImageAdd}
              className="w-full border-dashed py-2"
            >
              <Plus className="h-3 w-3 mr-2" />
              Add Image URL
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Add multiple images to showcase your hotel
          </p>
          
          {/* Gallery Previews */}
          {(galleryPreviews.length > 0 || formData.gallery_images.length > 0) && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {/* File previews */}
              {galleryPreviews.filter(item => item.isFile).map((preview, index) => (
                <div key={preview.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                  <img
                    src={preview.url}
                    alt={`Gallery preview ${index + 1}`}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{preview.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(preview.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeGalleryFile(galleryFiles.indexOf(preview.file), true)}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {/* URL previews */}
              {formData.gallery_images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <Input
                    type="url"
                    value={image}
                    onChange={(e) => {
                      const newImages = [...formData.gallery_images]
                      newImages[index] = e.target.value
                      handleInputChange('gallery_images', newImages)
                    }}
                    placeholder="Image URL"
                    className="flex-1 h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleGalleryImageRemove(index)}
                    className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {(galleryFiles.length > 0 || formData.gallery_images.length > 0) && (
            <div className="p-2 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>{galleryFiles.length + formData.gallery_images.length}</strong> gallery images added
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )

  const renderAmenities = () => (
    <div className="space-y-6">
      {Object.entries(amenityGroups).map(([groupName, amenities]) => (
        <Card key={groupName} className="p-4">
          <h3 className="font-medium text-gray-900 mb-3">{groupName}</h3>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  formData.amenities.includes(amenity)
                    ? 'bg-orange-100 text-orange-800 border border-orange-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </Card>
      ))}
      
      {formData.amenities.length > 0 && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <h3 className="font-medium text-orange-900 mb-2">Selected Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  )

  const renderRooms = () => (
    <div className="space-y-4">
      {rooms.map((room, index) => (
        <Card key={room.id} className="overflow-hidden">
          <div
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleRoomExpansion(room.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bed className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Room {index + 1}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getRoomSummary(room)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {rooms.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRoom(room.id)
                    }}
                    className="text-red-600 hover:text-red-700 h-8 px-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
                {expandedRooms[room.id] ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {expandedRooms[room.id] && (
            <div className="px-4 pb-4 border-t bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Name *
                  </label>
                  <Input
                    type="text"
                    value={room.room_name}
                    onChange={(e) => handleRoomChange(room.id, 'room_name', e.target.value)}
                    placeholder="e.g., Deluxe Room"
                    className="h-8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Guests *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={room.max_guests}
                    onChange={(e) => handleRoomChange(room.id, 'max_guests', e.target.value)}
                    className="h-8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night *
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₹</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={room.price_per_night}
                      onChange={(e) => handleRoomChange(room.id, 'price_per_night', e.target.value)}
                      placeholder="0.00"
                      className="h-8 pl-6"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Size
                  </label>
                  <Input
                    type="text"
                    value={room.room_size}
                    onChange={(e) => handleRoomChange(room.id, 'room_size', e.target.value)}
                    placeholder="e.g., 25 sqm"
                    className="h-8"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bed Type
                  </label>
                  <select
                    value={room.bed_type}
                    onChange={(e) => handleRoomChange(room.id, 'bed_type', e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded-md px-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select bed type</option>
                    {bedTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addRoom}
        className="w-full border-dashed py-3 text-gray-600 hover:text-gray-800"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Room
      </Button>
    </div>
  )

  const renderPolicies = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">Cancellation Policy</h3>
        <div className="space-y-3">
          <textarea
            value={formData.cancellation_policy}
            onChange={(e) => handleInputChange('cancellation_policy', e.target.value)}
            placeholder="Describe the cancellation policy (e.g., Free cancellation up to 24 hours before check-in)"
            rows={6}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
          <p className="text-xs text-gray-500">
            Clearly state your cancellation terms and any applicable fees
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium text-gray-900 mb-4">House Rules</h3>
        <div className="space-y-3">
          <textarea
            value={formData.house_rules}
            onChange={(e) => handleInputChange('house_rules', e.target.value)}
            placeholder="List the house rules (e.g., No smoking, No pets allowed, Quiet hours: 10 PM - 7 AM)"
            rows={6}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
          />
          <p className="text-xs text-gray-500">
            Set clear expectations for guest behavior and property usage
          </p>
        </div>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo()
      case 'media':
        return renderMedia()
      case 'amenities':
        return renderAmenities()
      case 'rooms':
        return renderRooms()
      case 'policies':
        return renderPolicies()
      default:
        return renderBasicInfo()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/hotels">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Hotels
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Hotel</h1>
            <p className="text-gray-600 mt-0.5">Create a new hotel with rooms and amenities</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      <form className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {renderTabContent()}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600">
            Make sure all required fields are filled before saving the hotel
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/hotels">
              <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2">
                Cancel
              </Button>
            </Link>
            <Button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              variant="outline"
              className="border-gray-600 text-gray-700 hover:bg-gray-50 px-6 py-2 min-w-[140px] font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-2" />
                  Save as Draft
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => handleSubmit('published')}
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 min-w-[140px] font-medium"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Save className="h-3 w-3 mr-2" />
                  Save & Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}