'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Wifi, Car, Coffee, Utensils, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PopularHotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/hotels?limit=9&sortBy=created_at&sortOrder=desc')
        const data = await response.json()
        
        if (data.success) {
          setHotels(data.hotels || [])
        } else {
          setError(data.error || 'Failed to fetch hotels')
        }
      } catch (error) {
        console.error('Error fetching hotels:', error)
        setError('Failed to load hotels')
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-3 w-3" />
    if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car')) return <Car className="h-3 w-3" />
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('dining') || amenity.toLowerCase().includes('cuisine')) return <Utensils className="h-3 w-3" />
    return <Coffee className="h-3 w-3" />
  }

  // Generate mock reviews count based on hotel rating and creation date
  const generateReviewsCount = (rating, createdAt) => {
    const baseReviews = Math.floor(rating * 200)
    const randomFactor = Math.floor(Math.random() * 500) + 100
    return baseReviews + randomFactor
  }

  // Get hotels for single row display (up to 9 hotels)
  const getHotelsForDisplay = () => {
    return hotels.slice(0, 9)
  }

  if (loading) {
    return (
      <section className="pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Hotels</h2>
            <Link href="/hotels">
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading popular hotels...</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Hotels</h2>
            <Link href="/hotels">
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Unable to load hotels at the moment.</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (hotels.length === 0) {
    return (
      <section className="pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Hotels</h2>
            <Link href="/hotels">
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No hotels available at the moment.</p>
            <p className="text-sm text-gray-500">Check back later for amazing hotel deals!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <section className="pb-12 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <defs>
              <pattern id="hotelPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" />
                <circle cx="10" cy="10" r="0.5" fill="currentColor" />
                <circle cx="50" cy="50" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hotelPattern)" className="text-gray-400" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          {/* Single Row Display */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Hotels</h2>
            <Link href="/hotels">
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {getHotelsForDisplay().map((hotel) => {
                const reviewsCount = generateReviewsCount(hotel.rating, hotel.created_at)
                
                return (
                  <Link key={hotel.id} href={`/hotels/${hotel.slug || hotel.id}`}>
                    <Card className="group overflow-hidden flex-shrink-0 w-72 h-96 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-0 relative h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                          <img
                            src={hotel.image}
                            alt={hotel.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                            }}
                          />
                          {/* Discount Badge */}
                          {hotel.discount && hotel.discount > 0 && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              -{hotel.discount}%
                            </div>
                          )}
                          {/* Rating Badge */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">{hotel.rating}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-white to-gray-50 group-hover:from-orange-50 group-hover:to-white transition-all duration-500 flex-1 flex flex-col">
                          <div className="flex-1 min-h-0">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-3 h-3 text-orange-600" />
                              </div>
                              <span className="text-sm font-semibold truncate">{hotel.location}</span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.5rem'}}>
                              {hotel.name}
                            </h3>
                            
                            {/* Amenities */}
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1 items-center">
                                {hotel.amenities && hotel.amenities.length > 0 ? (
                                  <>
                                    {hotel.amenities.slice(0, 2).map((amenity, index) => (
                                      <div
                                        key={index}
                                        className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 whitespace-nowrap"
                                      >
                                        {getAmenityIcon(amenity)}
                                        <span className="truncate max-w-[80px]">{amenity}</span>
                                      </div>
                                    ))}
                                    {hotel.amenities.length > 2 && (
                                      <div className="inline-flex items-center bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 whitespace-nowrap">
                                        +{hotel.amenities.length - 2} more
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 whitespace-nowrap">
                                    <Coffee className="h-3 w-3" />
                                    <span>Standard Amenities</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                            <div className="flex items-center gap-1 text-gray-700">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(hotel.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">({reviewsCount})</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {hotel.originalPrice && hotel.price && hotel.price !== hotel.originalPrice ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-xs text-gray-500 line-through">₹{Math.round(hotel.originalPrice).toLocaleString()}</span>
                                  <span className="text-base font-bold text-orange-600">₹{Math.round(hotel.price).toLocaleString()}</span>
                                </div>
                              ) : hotel.price && hotel.price > 0 ? (
                                <span className="text-base font-bold text-orange-600">₹{Math.round(hotel.price).toLocaleString()}</span>
                              ) : (
                                <div className="text-right">
                                  <span className="text-xs font-medium text-gray-600">Contact for</span>
                                  <br />
                                  <span className="text-xs font-medium text-orange-600">Best Price</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}