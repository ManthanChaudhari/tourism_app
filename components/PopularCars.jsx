'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Users, Fuel, Settings, Car, Loader2, Heart, Home, Crown } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PopularCars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/cars?limit=9&sortBy=created_at&sortOrder=desc')
        const data = await response.json()
        
        if (data.success) {
          setCars(data.cars || [])
        } else {
          setError(data.error || 'Failed to fetch cars')
        }
      } catch (error) {
        console.error('Error fetching cars:', error)
        setError('Failed to load cars')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  const getFeatureIcon = (feature) => {
    if (feature.toLowerCase().includes('seat')) return <Users className="h-3 w-3" />
    if (feature.toLowerCase().includes('fuel') || feature.toLowerCase().includes('petrol') || feature.toLowerCase().includes('diesel')) return <Fuel className="h-3 w-3" />
    if (feature.toLowerCase().includes('transmission') || feature.toLowerCase().includes('manual') || feature.toLowerCase().includes('automatic')) return <Settings className="h-3 w-3" />
    return <Car className="h-3 w-3" />
  }

  // Generate rating for cars (since cars might not have ratings in DB)
  const generateCarRating = (car) => {
    // Only use if car has actual rating from API
    return car.rating || 4.0
  }

  // Generate reviews count only if car has rating from API
  const generateReviewsCount = (car) => {
    return car.reviews_count || 0
  }

  // Get cars for single row display (up to 9 cars)
  const getCarsForDisplay = () => {
    return cars.slice(0, 9)
  }

  if (loading) {
    return (
      <section className="pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Cars</h2>
            <Link href="/cars">
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
              <p className="text-gray-600">Loading popular cars...</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Popular Cars</h2>
            <Link href="/cars">
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Unable to load cars at the moment.</p>
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

  if (cars.length === 0) {
    return (
      <section className="pb-12 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Cars</h2>
            <Link href="/cars">
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No cars available at the moment.</p>
            <p className="text-sm text-gray-500">Check back later for amazing car rental deals!</p>
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
              <pattern id="carPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" />
                <circle cx="10" cy="10" r="0.5" fill="currentColor" />
                <circle cx="50" cy="50" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#carPattern)" className="text-gray-400" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          {/* Single Row Display */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Cars</h2>
            <Link href="/cars">
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
              {getCarsForDisplay().map((car) => {
                const rating = generateCarRating(car)
                const reviewsCount = generateReviewsCount(car)
                
                return (
                  <Link key={car.id} href={`/cars/${car.slug || car.id}`}>
                    <Card className="group overflow-hidden flex-shrink-0 w-80 h-[360px] cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
                      <CardContent className="p-0 relative h-full flex flex-col">
                        {/* Main Image Section with Overlay */}
                        <div className="relative h-64 overflow-hidden rounded-t-2xl flex-shrink-0">
                          <img
                            src={car.thumbnail_image || "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop"}
                            alt={car.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop"
                            }}
                          />
                          
                          {/* Dark overlay for better text readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                          

                          
                          {/* Car Name and Details Overlay */}
                          <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3 className="text-xl font-bold mb-2 leading-tight">
                              {car.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                              {car.transmission && (
                                <>
                                  <span className="capitalize">{car.transmission}</span>
                                  <span>•</span>
                                </>
                              )}
                              {car.fuel_type && (
                                <>
                                  <span className="capitalize">{car.fuel_type}</span>
                                  <span>•</span>
                                </>
                              )}
                              {car.seating_capacity && (
                                <span>{car.seating_capacity} Seats</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Rating Badge - only show if rating exists */}
                          {rating > 0 && (
                            <div className="absolute bottom-4 right-4 bg-transparent backdrop-blur-sm text-white px-2 py-1 rounded-lg border-2 border-yellow-500 flex items-center gap-1">
                              <Crown className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-bold">{rating}</span>
                              {reviewsCount > 0 && (
                                <span className="text-xs opacity-80">({reviewsCount})</span>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Bottom Info Section */}
                        <div className="p-3 bg-white flex-1 flex flex-col">
                          {/* Price Info */}
                          <div className="flex items-center justify-between mb-2">
                            {car.locations?.name && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                                  <MapPin className="w-3 h-3 text-gray-600" />
                                </div>
                                <span className="text-sm font-medium">{car.locations.name}</span>
                              </div>
                            )}
                            <div className="text-right">
                              {car.price_per_day && car.price_per_day > 0 ? (
                                <div className="text-lg font-bold text-gray-900">
                                  ₹{Math.round(car.price_per_day).toLocaleString()}/day
                                </div>
                              ) : (
                                <div className="text-sm font-medium text-gray-600">
                                  Contact for Price
                                </div>
                              )}
                            </div>
                          </div>
                          
                          
                          {/* Additional Features */}
                          {(car.driver_included || car.allow_one_way || car.ac_available) && (
                            <div className="flex flex-wrap gap-3 text-xs">
                              {car.driver_included && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Driver Included</span>
                              )}
                              {car.allow_one_way && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">One-Way</span>
                              )}
                              {car.ac_available && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded">AC Available</span>
                              )}
                            </div>
                          )}

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