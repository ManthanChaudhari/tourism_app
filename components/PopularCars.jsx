'use client'

import { useState, useEffect } from 'react'
import { Star, MapPin, Users, Fuel, Settings, Car, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocation } from '@/lib/contexts/LocationContext'

export default function PopularCars() {
  const { selectedLocation } = useLocation()
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          limit: '9',
          featured: 'true'
        })

        // Add location filter if a location is selected
        if (selectedLocation?.id) {
          params.append('locationId', selectedLocation.id)
        }

        const response = await fetch(`/api/cars?${params}`)
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
  }, [selectedLocation])

  const getLocationDisplayName = (location) => {
    if (!location) return '';
    if (location.type === 'city' && location.parent) {
      return `${location.name}, ${location.parent.name}`;
    }
    return location.name;
  };

  const getFeatureIcon = (feature) => {
    if (feature.toLowerCase().includes('seat')) return <Users className="h-3 w-3" />
    if (feature.toLowerCase().includes('fuel') || feature.toLowerCase().includes('petrol') || feature.toLowerCase().includes('diesel')) return <Fuel className="h-3 w-3" />
    if (feature.toLowerCase().includes('transmission') || feature.toLowerCase().includes('manual') || feature.toLowerCase().includes('automatic')) return <Settings className="h-3 w-3" />
    return <Car className="h-3 w-3" />
  }

  // Generate mock reviews count based on car rating and creation date
  const generateReviewsCount = (rating) => {
    const baseReviews = Math.floor(rating * 150)
    const randomFactor = Math.floor(Math.random() * 300) + 50
    return baseReviews + randomFactor
  }

  // Generate rating for cars (since cars might not have ratings in DB)
  const generateCarRating = (car) => {
    // Generate rating based on car features and price
    let rating = 3.5
    if (car.ac_available) rating += 0.3
    if (car.transmission === 'automatic') rating += 0.2
    if (car.fuel_type === 'diesel') rating += 0.1
    if (car.driver_included) rating += 0.2
    if (car.allow_one_way) rating += 0.1
    
    // Add some randomness but keep it realistic
    rating += (Math.random() * 0.6) - 0.3
    
    return Math.min(5, Math.max(3, Math.round(rating * 10) / 10))
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
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedLocation ? `Cars in ${getLocationDisplayName(selectedLocation)}` : 'Popular Cars'}
            </h2>
            <Link href={selectedLocation ? `/cars?location=${selectedLocation.id}` : "/cars"}>
              <Button className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent">
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          {selectedLocation && (
            <div className="mb-6 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4 mr-2" />
              Filtered by: {getLocationDisplayName(selectedLocation)}
            </div>
          )}
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {getCarsForDisplay().map((car) => {
                const rating = generateCarRating(car)
                const reviewsCount = generateReviewsCount(rating)
                
                return (
                  <Link key={car.id} href={`/cars/${car.slug || car.id}`}>
                    <Card className="group overflow-hidden flex-shrink-0 w-72 h-96 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <CardContent className="p-0 relative h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                          <img
                            src={car.thumbnail_image || "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop"}
                            alt={car.name}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop"
                            }}
                          />
                          {/* Special Offers Badge */}
                          {car.driver_included && (
                            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              Driver Included
                            </div>
                          )}
                          {car.allow_one_way && !car.driver_included && (
                            <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              One-Way
                            </div>
                          )}
                          {/* Rating Badge */}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900">{rating}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-white to-gray-50 group-hover:from-orange-50 group-hover:to-white transition-all duration-500 flex-1 flex flex-col">
                          <div className="flex-1 min-h-0">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-3 h-3 text-orange-600" />
                              </div>
                              <span className="text-sm font-semibold truncate">
                                {car.locations?.name || car.location_id || 'Available'}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300 leading-tight overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.5rem'}}>
                              {car.name}
                            </h3>
                            
                            {/* Car Features */}
                            <div className="mb-3">
                              <div className="flex flex-wrap gap-1 items-center">
                                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 whitespace-nowrap">
                                  <Users className="h-3 w-3" />
                                  <span>{car.seating_capacity} seats</span>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 whitespace-nowrap">
                                  <Fuel className="h-3 w-3" />
                                  <span className="capitalize">{car.fuel_type}</span>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600 whitespace-nowrap">
                                  <Settings className="h-3 w-3" />
                                  <span className="capitalize">{car.transmission}</span>
                                </div>
                                {car.ac_available && (
                                  <div className="inline-flex items-center bg-blue-100 px-2 py-0.5 rounded text-xs text-blue-600 whitespace-nowrap">
                                    AC
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
                                      i < Math.floor(rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">({reviewsCount})</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {car.price_per_day && car.price_per_day > 0 ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-base font-bold text-orange-600">₹{Math.round(car.price_per_day).toLocaleString()}</span>
                                  <span className="text-xs text-gray-500">per day</span>
                                </div>
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