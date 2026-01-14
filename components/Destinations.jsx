"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Destinations() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch published packages from the public API
      const response = await fetch('/api/packages?public=true&limit=24&sortBy=created_at&sortOrder=desc', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }

      const data = await response.json()
      
      if (data.success) {
        setPackages(data.packages || [])
      } else {
        throw new Error(data.error || 'Failed to fetch packages')
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Get packages for single row display (8-9 packages)
  const getPackagesForDisplay = () => {
    return packages.slice(0, 9)
  }

  if (loading) {
    return (
      <section className="pt-4 pb-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-orange-400"></div>
              <span className="text-orange-600 font-medium text-lg">Top Destinations</span>
              <div className="w-16 h-px bg-orange-400"></div>
            </div>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Loading amazing destinations...
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="pt-4 pb-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-orange-400"></div>
              <span className="text-orange-600 font-medium text-lg">Top Destinations</span>
              <div className="w-16 h-px bg-orange-400"></div>
            </div>
            <p className="text-red-600 text-lg max-w-2xl mx-auto">
              Unable to load destinations. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (packages.length === 0) {
    return (
      <section className="pt-4 pb-12 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-px bg-orange-400"></div>
              <span className="text-orange-600 font-medium text-lg">Top Destinations</span>
              <div className="w-16 h-px bg-orange-400"></div>
            </div>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              No destinations available at the moment. Check back soon!
            </p>
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
      <section className="pt-4 pb-12 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none">
            <defs>
              <pattern id="destinationPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1" fill="currentColor" />
                <circle cx="10" cy="10" r="0.5" fill="currentColor" />
                <circle cx="50" cy="50" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#destinationPattern)" className="text-gray-400" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          {/* Header */}
          <div className="mb-6">
            {/* Centered Title */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-px bg-orange-400"></div>
                <span className="text-orange-600 font-medium text-lg">Top Destinations</span>
                <div className="w-16 h-px bg-orange-400"></div>
              </div>
              <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                Explore our handpicked collection of amazing destinations around the world. 
                From bustling cities to serene landscapes, find your perfect getaway.
              </p>
            </div>
          </div>
          {/* Single Row Display */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Destinations</h2>
            <Link href="/packages">
              <Button
                className="text-orange-600 border-orange-600 hover:bg-orange-600 hover:text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:shadow-lg border-2 bg-transparent"
              >
                Explore All
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
            </Link>
          </div>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
              {getPackagesForDisplay().map((destination) => (
                <Link key={destination.id} href={`/packages/${destination.slug || destination.id}`}>
                  <Card className="group overflow-hidden shrink-0 w-80 h-[380px] cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl">
                    <CardContent className="p-0 relative h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-64 overflow-hidden rounded-t-2xl shrink-0">
                        <img
                          src={destination.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}
                          alt={destination.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                          }}
                        />
                        
                        {/* Discount Badge */}
                        {destination.discount && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                            -{destination.discount}%
                          </div>
                        )}
                        
                        {/* Location Badge */}
                        <div className="absolute bottom-4 left-2 backdrop-blur-sm bg-white/20 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-lg">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{destination.location || destination.destination || destination.city || 'India'}</span>
                        </div>
                      </div>

                      {/* Bottom Content Section */}
                      <div className="p-4 bg-white flex-1 flex flex-col ">
                        {/* Title */}
                        <div className="mb-3">
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">
                            {destination.title}
                          </h3>
                        </div>
                        
                        {/* Starting from and Price */}
                        <div>
                          <p className="text-base text-gray-500 ">Starting from</p>
                          <div className="text-2xl font-bold text-gray-900">
                            {destination.discount ? (
                              <span>₹ {destination.discountedPrice || destination.price}</span>
                            ) : (
                              <span>₹ {destination.price}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
