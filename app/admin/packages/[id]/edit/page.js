'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Tag,
  Percent,
  Image as ImageIcon,
  Navigation
} from 'lucide-react'
import Link from 'next/link'
import DestinationDropdown from '@/components/admin/DestinationDropdown'
import CategoryDropdown from '@/components/admin/CategoryDropdown'

const PACKAGE_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'published', label: 'Published', color: 'green' }
]

export default function EditPackagePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    destination: '',
    category: '',
    days: '',
    nights: '',
    pricePerPerson: '',
    discount: '',
    pickupLocation: '',
    dropLocation: '',
    description: '',
    thumbnailImage: null,
    galleryImages: [],
    itinerary: [{ day: 1, title: '', description: '' }],
    inclusions: [''],
    exclusions: [''],
    status: 'draft'
  })

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await fetch(`/api/packages/${params.id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch package')
        }

        const data = result.package
        setFormData({
          title: data.title || '',
          slug: data.slug || '',
          destination: data.destination || '', // Use location ID if available, fallback to text
          category: data.category || '', // Use the category field directly
          days: data.days?.toString() || '',
          nights: data.nights?.toString() || '',
          pricePerPerson: data.price_per_person?.toString() || '',
          discount: data.discount?.toString() || '',
          pickupLocation: data.pickup_location || '',
          dropLocation: data.drop_location || '',
          description: data.description || '',
          thumbnailImage: null, // Don't load existing files, just show URLs
          galleryImages: [],
          itinerary: data.itinerary || [{ day: 1, title: '', description: '' }],
          inclusions: data.inclusions || [''],
          exclusions: data.exclusions || [''],
          status: data.status || 'draft',
          // Store existing image URLs for display
          existingThumbnailUrl: data.thumbnail_image_url,
          existingGalleryUrls: data.gallery_image_urls || []
        })
      } catch (error) {
        console.error('Fetch error:', error)
        setSubmitError(error.message || 'Failed to load package data')
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [params.id])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate slug from title if slug is empty
    if (field === 'title' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: autoSlug
      }));
    }
  }

  const handleFileChange = (field, files) => {
    if (field === 'thumbnailImage') {
      setFormData(prev => ({
        ...prev,
        [field]: files[0] || null
      }))
    } else if (field === 'galleryImages') {
      setFormData(prev => ({
        ...prev,
        [field]: Array.from(files)
      }))
    }
  }

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary]
    newItinerary[index][field] = value
    setFormData(prev => ({
      ...prev,
      itinerary: newItinerary
    }))
  }

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { 
        day: prev.itinerary.length + 1, 
        title: '', 
        description: '' 
      }]
    }))
  }

  const removeItineraryDay = (index) => {
    if (formData.itinerary.length > 1) {
      const newItinerary = formData.itinerary.filter((_, i) => i !== index)
      // Renumber days
      newItinerary.forEach((item, i) => {
        item.day = i + 1
      })
      setFormData(prev => ({
        ...prev,
        itinerary: newItinerary
      }))
    }
  }

  const handleListChange = (field, index, value) => {
    const newList = [...formData[field]]
    newList[index] = value
    setFormData(prev => ({
      ...prev,
      [field]: newList
    }))
  }

  const addListItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeListItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }))
    }
  }

  const calculateDiscountedPrice = () => {
    if (!formData.pricePerPerson || !formData.discount) return null
    const price = parseFloat(formData.pricePerPerson)
    const discount = parseFloat(formData.discount)
    return price - (price * discount / 100)
  }

  const handleSubmit = async (status) => {
    // Basic validation
    if (!formData.title || !formData.destination || !formData.days || !formData.nights || !formData.pricePerPerson || !formData.category) {
      setSubmitError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Create FormData for file uploads
      const submitFormData = new FormData()
      
      // Add basic fields
      submitFormData.append('title', formData.title)
      if (formData.slug) {
        submitFormData.append('slug', formData.slug)
      }
      submitFormData.append('destination', formData.destination)
      submitFormData.append('category', formData.category)
      submitFormData.append('days', formData.days)
      submitFormData.append('nights', formData.nights)
      submitFormData.append('pricePerPerson', formData.pricePerPerson)
      if (formData.discount) {
        submitFormData.append('discount', formData.discount)
      }
      submitFormData.append('description', formData.description || '')
      if (formData.pickupLocation) {
        submitFormData.append('pickupLocation', formData.pickupLocation)
      }
      if (formData.dropLocation) {
        submitFormData.append('dropLocation', formData.dropLocation)
      }
      submitFormData.append('status', status)

      // Add arrays as JSON strings
      const filteredInclusions = formData.inclusions.filter(item => item.trim() !== '')
      const filteredExclusions = formData.exclusions.filter(item => item.trim() !== '')
      const filteredItinerary = formData.itinerary.filter(item => item.title.trim() !== '' || item.description.trim() !== '')
      
      submitFormData.append('inclusions', JSON.stringify(filteredInclusions))
      submitFormData.append('exclusions', JSON.stringify(filteredExclusions))
      submitFormData.append('itinerary', JSON.stringify(filteredItinerary))

      // Add images if new ones are selected
      if (formData.thumbnailImage) {
        submitFormData.append('thumbnailImage', formData.thumbnailImage)
      } else {
        // Keep existing thumbnail
        submitFormData.append('keepExistingThumbnail', 'true')
      }
      
      if (formData.galleryImages.length > 0) {
        formData.galleryImages.forEach((image) => {
          submitFormData.append('galleryImages', image)
        })
      } else {
        // Keep existing gallery
        submitFormData.append('keepExistingGallery', 'true')
      }

      // Submit to API
      const response = await fetch(`/api/packages/${params.id}`, {
        method: 'PUT',
        body: submitFormData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update package')
      }

      // Success - redirect to package view
      router.push(`/admin/packages/${params.id}?success=updated`)
      
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError(error.message || 'Failed to update package. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/packages/${params.id}`}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Package</h1>
            <p className="text-gray-600 mt-2">Update package information</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {submitError && (
            <div className="flex-1 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{submitError}</p>
            </div>
          )}
          <button
            onClick={() => handleSubmit(formData.status)}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2 inline" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Eye className="h-5 w-5 mr-2 inline" />
            {isSubmitting ? 'Publishing...' : (formData.status === 'published' ? 'Update & Keep Published' : 'Save & Publish')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Package Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter package title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="package-url-slug"
                />
                <p className="text-xs text-gray-500 mt-2">
                  URL-friendly version of the package title. Leave empty to auto-generate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Destination *
                  </label>
                  <DestinationDropdown
                    value={formData.destination}
                    onChange={(value) => handleInputChange('destination', value)}
                    placeholder="Select destination..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Category / Package Type *
                  </label>
                  <CategoryDropdown
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                    placeholder="Select category..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Days *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.days}
                    onChange={(e) => handleInputChange('days', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="7"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Nights *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.nights}
                    onChange={(e) => handleInputChange('nights', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="6"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <DollarSign className="h-4 w-4 inline mr-2" />
                    Price per Person (USD) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerPerson}
                    onChange={(e) => handleInputChange('pricePerPerson', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="1299.00"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Percent className="h-4 w-4 inline mr-2" />
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="10"
                  />
                  {formData.discount && formData.pricePerPerson && (
                    <p className="text-sm text-green-600 mt-2">
                      Discounted price: ${calculateDiscountedPrice()?.toFixed(2)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Package Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    {PACKAGE_STATUS_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Navigation className="h-4 w-4 inline mr-2" />
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Airport, Hotel, City Center"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Navigation className="h-4 w-4 inline mr-2" />
                    Drop Location
                  </label>
                  <input
                    type="text"
                    value={formData.dropLocation}
                    onChange={(e) => handleInputChange('dropLocation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="e.g., Airport, Hotel, City Center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Describe your package, highlight key features and what makes it special..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  This description will be shown to customers on the package details page.
                </p>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
              <button
                onClick={addItineraryDay}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1 inline" />
                Add Day
              </button>
            </div>

            <div className="space-y-4">
              {formData.itinerary.map((day, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">Day {day.day}</h3>
                    {formData.itinerary.length > 1 && (
                      <button
                        onClick={() => removeItineraryDay(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Day title"
                    />
                    <textarea
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Day description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Thumbnail Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <ImageIcon className="h-5 w-5 inline mr-2" />
              Thumbnail Image *
            </h2>
            
            {/* Show existing thumbnail */}
            {formData.existingThumbnailUrl && !formData.thumbnailImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current thumbnail:</p>
                <div className="aspect-video w-full max-w-xs bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={formData.existingThumbnailUrl} 
                    alt="Current thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                    <ImageIcon className="h-8 w-8" />
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {formData.thumbnailImage ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    New image selected: {formData.thumbnailImage.name}
                  </div>
                  <button
                    onClick={() => handleInputChange('thumbnailImage', null)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove New Image
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    {formData.existingThumbnailUrl ? 'Upload new thumbnail image' : 'Upload main package image'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('thumbnailImage', e.target.files)}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Choose Image
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.existingThumbnailUrl && !formData.thumbnailImage 
                ? 'Leave empty to keep current image, or upload a new one to replace it.'
                : 'This will be the main image displayed for your package.'
              }
            </p>
          </div>

          {/* Gallery Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images</h2>
            
            {/* Show existing gallery */}
            {formData.existingGalleryUrls && formData.existingGalleryUrls.length > 0 && formData.galleryImages.length === 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current gallery ({formData.existingGalleryUrls.length} images):</p>
                <div className="grid grid-cols-2 gap-2">
                  {formData.existingGalleryUrls.slice(0, 4).map((url, index) => (
                    <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
                {formData.existingGalleryUrls.length > 4 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{formData.existingGalleryUrls.length - 4} more images
                  </p>
                )}
              </div>
            )}
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {formData.galleryImages.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    {formData.galleryImages.length} new image(s) selected
                  </div>
                  <div className="text-xs text-gray-500">
                    {formData.galleryImages.map(img => img.name).join(', ')}
                  </div>
                  <button
                    onClick={() => handleInputChange('galleryImages', [])}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove New Images
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">
                    {formData.existingGalleryUrls && formData.existingGalleryUrls.length > 0 
                      ? 'Upload new gallery images' 
                      : 'Upload additional images'
                    }
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange('galleryImages', e.target.files)}
                    className="hidden"
                    id="gallery-upload"
                  />
                  <label
                    htmlFor="gallery-upload"
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Choose Images
                  </label>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.existingGalleryUrls && formData.existingGalleryUrls.length > 0 && formData.galleryImages.length === 0
                ? 'Leave empty to keep current images, or upload new ones to add to the gallery.'
                : 'Additional images to showcase your package (optional).'
              }
            </p>
          </div>

          {/* Inclusions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Inclusions</h2>
              <button
                onClick={() => addListItem('inclusions')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={inclusion}
                    onChange={(e) => handleListChange('inclusions', index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's included"
                  />
                  {formData.inclusions.length > 1 && (
                    <button
                      onClick={() => removeListItem('inclusions', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Exclusions</h2>
              <button
                onClick={() => addListItem('exclusions')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={exclusion}
                    onChange={(e) => handleListChange('exclusions', index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="What's not included"
                  />
                  {formData.exclusions.length > 1 && (
                    <button
                      onClick={() => removeListItem('exclusions', index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}