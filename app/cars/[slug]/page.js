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
  ArrowLeft,
  Fuel,
  Settings,
  Car,
  Calendar,
  CreditCard,
  Shield,
  Home,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Luggage
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const carSlug = params.slug
  
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Fetch car details by slug
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/cars/slug/${carSlug}?public=true`)
        const data = await response.json()
        
        if (data.success) {
          setCar(data.car)
        } else {
          setError(data.error || 'Car not found')
        }
      } catch (error) {
        console.error('Error fetching car:', error)
        setError('Failed to load car details')
      } finally {
        setLoading(false)
      }
    }

    if (carSlug) {
      fetchCar()
    }
  }, [carSlug])

  const getAllImages = () => {
    const images = []
    if (car?.thumbnail_image) images.push(car.thumbnail_image)
    if (car?.gallery_images && car.gallery_images.length > 0) {
      images.push(...car.gallery_images)
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop']
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
              <p className="text-gray-600 text-lg">Loading car details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
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
              <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{car.location}</span>
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
                      alt={car.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=600&fit=crop"
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
                              alt={`${car.name} ${index + 1}`}
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

            {/* Car Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{car.name}</h2>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-lg text-gray-600">{car.brand} {car.model}</span>
                      <span className="text-lg text-gray-600">• {car.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="h-5 w-5" />
                      <span className="text-lg">{car.location}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Starting from</div>
                    <div className="text-3xl font-bold text-orange-600">₹{Math.round(car.price_per_day).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">per day</div>
                    {car.price_per_hour && (
                      <div className="text-sm text-gray-500 mt-1">₹{Math.round(car.price_per_hour)} per hour</div>
                    )}
                  </div>
                </div>

                {/* Car Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Seating</div>
                    <div className="font-semibold">{car.seating_capacity} People</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Fuel className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Fuel Type</div>
                    <div className="font-semibold capitalize">{car.fuel_type}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Settings className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Transmission</div>
                    <div className="font-semibold capitalize">{car.transmission}</div>
                  </div>
                  {car.luggage_capacity && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Luggage className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Luggage</div>
                      <div className="font-semibold">{car.luggage_capacity}</div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${car.ac_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-700">Air Conditioning</span>
                    </div>
                    {car.driver_included && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Driver Included</span>
                      </div>
                    )}
                    {car.allow_one_way && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">One-Way Rental</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Per Day</span>
                        <span className="font-medium">₹{Math.round(car.price_per_day).toLocaleString()}</span>
                      </div>
                      {car.price_per_hour && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Per Hour</span>
                          <span className="font-medium">₹{Math.round(car.price_per_hour).toLocaleString()}</span>
                        </div>
                      )}
                      {car.extra_km_price && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Extra KM</span>
                          <span className="font-medium">₹{Math.round(car.extra_km_price)}/km</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {car.driver_charge_per_day && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Driver Charge</span>
                          <span className="font-medium">₹{Math.round(car.driver_charge_per_day).toLocaleString()}/day</span>
                        </div>
                      )}
                      {car.security_deposit && (
                        <div className="flex justify-between py-2 border-b border-gray-200">
                          <span className="text-gray-600">Security Deposit</span>
                          <span className="font-medium">₹{Math.round(car.security_deposit).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Policies */}
            {(car.fuel_policy || car.cancellation_policy) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Policies & Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {car.fuel_policy && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Fuel className="h-4 w-4" />
                          Fuel Policy
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed capitalize">{car.fuel_policy.replace('-', ' ')}</p>
                      </div>
                    )}
                    {car.cancellation_policy && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Cancellation Policy
                        </h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{car.cancellation_policy}</p>
                      </div>
                    )}
                  </div>

                  {/* Booking Terms */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Booking Terms</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      {car.min_booking_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          <span>Minimum booking: {car.min_booking_hours} hours</span>
                        </div>
                      )}
                      {car.min_booking_days && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-600" />
                          <span>Minimum booking: {car.min_booking_days} days</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Valid driving license required</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span>Security deposit refundable</span>
                      </div>
                    </div>
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
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{car.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Year</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Fuel Type</span>
                    <span className="font-medium capitalize">{car.fuel_type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Transmission</span>
                    <span className="font-medium capitalize">{car.transmission}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Book This Car</h3>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">from</div>
                    <div className="text-xl font-bold text-orange-600">₹{Math.round(car.price_per_day).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">per day</div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                      <option>{car.location}</option>
                      <option>Airport Pickup</option>
                      <option>Hotel Pickup</option>
                      <option>Custom Location</option>
                    </select>
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold mb-4">
                  Book Now
                </Button>

                <div className="space-y-2 text-center text-xs text-gray-500">
                  <p>✓ Instant confirmation</p>
                  <p>✓ Free cancellation up to 24 hours</p>
                  <p>✓ 24/7 roadside assistance</p>
                </div>

                {/* Contact Options */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => window.open('tel:+1234567890')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-left"
                      onClick={() => window.open('mailto:support@example.com')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}