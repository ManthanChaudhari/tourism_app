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
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PackageDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    fetchPackageData()
  }, [params.id])

  const fetchPackageData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/packages/${params.id}?public=true`, {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-gray-200 rounded-xl"></div>
                <div className="h-48 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Package not found' ? 'Package Not Found' : 'Error Loading Package'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Package not found' 
              ? "The package you're looking for doesn't exist or is no longer available." 
              : error
            }
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Link href="/">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!packageData) {
    return null
  }

  const allImages = [
    ...(packageData.image ? [packageData.image] : []),
    ...(packageData.images || [])
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        {allImages.length > 0 ? (
          <>
            <img
              src={allImages[currentImageIndex]}
              alt={packageData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop"
              }}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <div className="text-center text-white">
              <MapPin className="h-16 w-16 mx-auto mb-4 opacity-80" />
              <h1 className="text-3xl font-bold">{packageData.title}</h1>
            </div>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsLiked(!isLiked)}
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                onClick={handleShare}
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">{packageData.destination}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{packageData.title}</h1>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{packageData.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Perfect for groups</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8 (124 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Package</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {packageData.description || 'Discover an amazing travel experience with this carefully crafted package. Enjoy breathtaking destinations, comfortable accommodations, and unforgettable memories that will last a lifetime.'}
                </p>
              </CardContent>
            </Card>

            {/* Itinerary */}
            {packageData.itinerary && packageData.itinerary.length > 0 && (
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
                  <div className="space-y-6">
                    {packageData.itinerary.map((day, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                            {day.day}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{day.title}</h3>
                          <p className="text-gray-600">{day.description}</p>
                        </div>
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      What's Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.inclusions.map((inclusion, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{inclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Exclusions */}
              {packageData.exclusions && packageData.exclusions.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <X className="h-5 w-5 text-red-600 mr-2" />
                      What's Not Included
                    </h3>
                    <ul className="space-y-3">
                      {packageData.exclusions.map((exclusion, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{exclusion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {packageData.discount ? (
                      <>
                        <span className="text-2xl text-gray-500 line-through">${packageData.originalPrice}</span>
                        <span className="text-3xl font-bold text-orange-600">${packageData.discountedPrice}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-orange-600">${packageData.price}</span>
                    )}
                  </div>
                  <p className="text-gray-600">per person</p>
                  {packageData.discount && (
                    <div className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mt-2">
                      Save {packageData.discount}%
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">{packageData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium capitalize">{packageData.category}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Group Size</span>
                    <span className="font-medium">2-15 people</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold">
                    Book Now
                  </Button>
                  <Button variant="outline" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 py-3">
                    Contact Us
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>info@travel.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Professional guide included</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Highly rated experience</span>
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