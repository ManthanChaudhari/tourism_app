'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  Check,
  X,
  Phone,
  Mail,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Home
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BookingForm from "@/components/BookingForm"

export default function PackageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const packageSlug = params.slug
  
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    fetchPackageData()
  }, [packageSlug])

  const fetchPackageData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/packages/slug/${packageSlug}?public=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Package not found')
        } else {
          throw new Error('Failed to fetch package details')
        }
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setPackageData(data.package)
      } else {
        setError(data.error || 'Failed to fetch package details')
      }
    } catch (error) {
      console.error('Error fetching package:', error)
      setError('Failed to load package details')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: packageData.title,
          text: `Check out this amazing travel package: ${packageData.title}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const nextImage = () => {
    if (packageData?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === packageData.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (packageData?.images?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? packageData.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading package details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
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

  const images = packageData.images || []
  const hasImages = images.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold text-gray-900">{packageData.title}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{packageData.destination}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{packageData.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={`border-gray-300 ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-700'} hover:bg-gray-50`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            {hasImages && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={images[currentImageIndex]}
                        alt={packageData.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop"
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
                          {currentImageIndex + 1} / {images.length}
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
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                currentImageIndex === index 
                                  ? 'border-orange-500' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${packageData.title} ${index + 1}`}
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
            )}

            {/* Package Overview */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{packageData.title}</h2>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-5 w-5" />
                        <span className="text-lg">{packageData.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span className="text-lg">{packageData.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-5 w-5" />
                        <span className="text-lg">Per Person</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-sm">Category:</span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                        {packageData.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    {packageData.originalPrice && packageData.originalPrice !== packageData.discountedPrice && (
                      <div className="text-lg text-gray-500 line-through">
                        ₹{packageData.originalPrice?.toLocaleString()}
                      </div>
                    )}
                    <div className="text-3xl font-bold text-orange-600">
                      ₹{packageData.discountedPrice?.toLocaleString() || packageData.price?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">per person</div>
                    {packageData.discount && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Save {packageData.discount}%
                      </div>
                    )}
                  </div>
                </div>

                {packageData.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Package</h3>
                    <p className="text-gray-700 leading-relaxed">{packageData.description}</p>
                  </div>
                )}

                {/* Package Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {packageData.pickupLocation && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pickup Location</h4>
                      <p className="text-gray-700">{packageData.pickupLocation}</p>
                    </div>
                  )}
                  {packageData.dropLocation && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Drop Location</h4>
                      <p className="text-gray-700">{packageData.dropLocation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Detailed Itinerary</h3>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                            {day.day}
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900">{day.title}</h4>
                        </div>
                        <p className="text-gray-700 leading-relaxed ml-11">{day.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              {packageData.inclusions && packageData.inclusions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                    <div className="space-y-3">
                      {packageData.inclusions.map((inclusion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{inclusion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Exclusions */}
              {packageData.exclusions && packageData.exclusions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Not Included</h3>
                    <div className="space-y-3">
                      {packageData.exclusions.map((exclusion, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{exclusion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{packageData.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Destination</span>
                    <span className="font-medium">{packageData.destination}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{packageData.category}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Days</span>
                    <span className="font-medium">{packageData.days}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Nights</span>
                    <span className="font-medium">{packageData.nights}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Form */}
            <BookingForm packageData={packageData} />

            {/* Quick Facts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">Duration: {packageData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">Destination: {packageData.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-700">Suitable for all ages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">Instant confirmation</span>
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