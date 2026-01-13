'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Bed, 
  ArrowLeft,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Calendar,
  CreditCard,
  Shield,
  Home,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HotelDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hotelSlug = params.slug
  
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Fetch hotel details by slug
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/hotels/slug/${hotelSlug}?public=true`)
        const data = await response.json()
        
        if (data.success) {
          setHotel(data.hotel)
        } else {
          setError(data.error || 'Hotel not found')
        }
      } catch (error) {
        console.error('Error fetching hotel:', error)
        setError('Failed to load hotel details')
      } finally {
        setLoading(false)
      }
    }

    if (hotelSlug) {
      fetchHotel()
    }
  }, [hotelSlug])

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase()
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />
    if (amenityLower.includes('parking') || amenityLower.includes('car')) return <Car className="h-4 w-4" />
    if (amenityLower.includes('restaurant') || amenityLower.includes('dining') || amenityLower.includes('cuisine')) return <Utensils className="h-4 w-4" />
    if (amenityLower.includes('pool')) return <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <div className="h-4 w-4 bg-green-500 rounded-sm"></div>
    if (amenityLower.includes('spa')) return <div className="h-4 w-4 bg-purple-500 rounded-full"></div>
    return <Coffee className="h-4 w-4" />
  }

  const generateReviewsCount = (rating) => {
    const baseReviews = Math.floor(rating * 200)
    const randomFactor = Math.floor(Math.random() * 500) + 100
    return baseReviews + randomFactor
  }

  const getMinPrice = () => {
    if (!hotel?.rooms || hotel.rooms.length === 0) return null
    const validRooms = hotel.rooms.filter(room => room.price_per_night && room.price_per_night > 0)
    return validRooms.length > 0 ? Math.min(...validRooms.map(room => room.price_per_night)) : null
  }

  const getAllImages = () => {
    const images = []
    if (hotel?.thumbnail_image) images.push(hotel.thumbnail_image)
    if (hotel?.gallery_images && hotel.gallery_images.length > 0) {
      images.push(...hotel.gallery_images)
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop']
  }

  const nextImage = () => {
    const images = getAllImages()
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = getAllImages()
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading hotel details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => router.back()} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Link href="/">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const images = getAllImages()
  const minPrice = getMinPrice()
  const reviewsCount = generateReviewsCount(hotel.star_rating || 4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{hotel.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={images[selectedImageIndex]}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                      }}
                    />
                    
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="p-4 bg-white">
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                              selectedImageIndex === index 
                                ? 'border-orange-500' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`${hotel.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hotel Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{hotel.name}</h2>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(hotel.star_rating || 4)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-lg font-semibold text-gray-900">{hotel.star_rating || 4}</span>
                        <span className="text-gray-600">({reviewsCount} reviews)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{hotel.address}</span>
                    </div>
                  </div>
                  
                  {minPrice && (
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Starting from</div>
                      <div className="text-3xl font-bold text-orange-600">₹{Math.round(minPrice).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">per night</div>
                    </div>
                  )}
                </div>

                {hotel.short_description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Hotel</h3>
                    <p className="text-gray-700 leading-relaxed">{hotel.short_description}</p>
                  </div>
                )}

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-3">
                      {hotel.contact_number && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{hotel.contact_number}</span>
                        </div>
                      )}
                      {hotel.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">{hotel.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Check-in Information</h3>
                    <div className="space-y-3">
                      {hotel.check_in_time && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">Check-in: {hotel.check_in_time}</span>
                        </div>
                      )}
                      {hotel.check_out_time && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-700">Check-out: {hotel.check_out_time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hotel.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {getAmenityIcon(amenity)}
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Policies */}
            {(hotel.cancellation_policy || hotel.house_rules) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies & Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotel.cancellation_policy && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Cancellation Policy
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{hotel.cancellation_policy}</p>
                      </div>
                    )}
                    {hotel.house_rules && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          House Rules
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{hotel.house_rules}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Star Rating</span>
                    <div className="flex items-center gap-1">
                      {[...Array(hotel.star_rating || 4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Rooms</span>
                    <span className="font-medium">{hotel.rooms?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">{hotel.check_in_time || '2:00 PM'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Check-out</span>
                    <span className="font-medium">{hotel.check_out_time || '11:00 AM'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Book Your Stay</h3>
                  {minPrice && (
                    <div className="text-right">
                      <div className="text-xs text-gray-600">from</div>
                      <div className="text-xl font-bold text-orange-600">₹{Math.round(minPrice).toLocaleString()}</div>
                      <div className="text-xs text-gray-600">per night</div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>1 Guest</option>
                        <option>2 Guests</option>
                        <option>3 Guests</option>
                        <option>4 Guests</option>
                        <option>5+ Guests</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold mb-4">
                  Check Availability
                </Button>

                <div className="space-y-2 text-center text-xs text-gray-500">
                  <p>✓ Free cancellation</p>
                  <p>✓ No booking fees</p>
                  <p>✓ Instant confirmation</p>
                </div>

                {/* Contact Options */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                  <div className="space-y-2">
                    {hotel.contact_number && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        onClick={() => window.open(`tel:${hotel.contact_number}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Hotel
                      </Button>
                    )}
                    {hotel.email && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        onClick={() => window.open(`mailto:${hotel.email}`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email Hotel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rooms */}
            {hotel.rooms && hotel.rooms.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rooms</h3>
                  <div className="space-y-4">
                    {hotel.rooms.map((room, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{room.room_name}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>Up to {room.max_guests} guests</span>
                              </div>
                              {room.bed_type && (
                                <div className="flex items-center gap-1">
                                  <Bed className="h-4 w-4" />
                                  <span>{room.bed_type}</span>
                                </div>
                              )}
                              {room.room_size && (
                                <div className="flex items-center gap-1">
                                  <div className="h-4 w-4 border border-gray-400 rounded"></div>
                                  <span>{room.room_size}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Wifi className="h-4 w-4" />
                                <span>Free WiFi</span>
                              </div>
                            </div>
                          </div>
                          {room.price_per_night && (
                            <div className="text-right ml-4">
                              <div className="text-lg font-bold text-orange-600">
                                ₹{Math.round(room.price_per_night).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-600">per night</div>
                              <div className="text-xs text-gray-500 mt-1">+ taxes & fees</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-green-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Available</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6"
                          >
                            Select Room
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}