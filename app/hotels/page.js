'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Loader2,
  AlertCircle,
  ChevronDown,
  SlidersHorizontal,
  X
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedRating, setSelectedRating] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const itemsPerPage = 12

  // Fetch hotels and destinations
  useEffect(() => {
    fetchDestinations()
  }, [])

  useEffect(() => {
    fetchHotels()
  }, [currentPage, searchTerm, selectedDestination, selectedRating, sortBy, sortOrder])

  const fetchDestinations = async () => {
    try {
      const response = await fetch('/api/destinations')
      const data = await response.json()
      if (data.success) {
        setDestinations(data.destinations || [])
      }
    } catch (error) {
      console.error('Error fetching destinations:', error)
    }
  }

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder
      })

      if (searchTerm) params.set('search', searchTerm)
      if (selectedDestination) params.set('destination', selectedDestination)
      if (selectedRating) params.set('rating', selectedRating)

      const response = await fetch(`/api/hotels?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setHotels(data.hotels || [])
        setPagination(data.pagination)
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

  const getAmenityIcon = (amenity) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi className="h-3 w-3" />
    if (amenity.toLowerCase().includes('parking') || amenity.toLowerCase().includes('car')) return <Car className="h-3 w-3" />
    if (amenity.toLowerCase().includes('restaurant') || amenity.toLowerCase().includes('dining') || amenity.toLowerCase().includes('cuisine')) return <Utensils className="h-3 w-3" />
    return <Coffee className="h-3 w-3" />
  }

  const generateReviewsCount = (rating, createdAt) => {
    const baseReviews = Math.floor(rating * 200)
    const randomFactor = Math.floor(Math.random() * 500) + 100
    return baseReviews + randomFactor
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchHotels()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedDestination('')
    setSelectedRating('')
    setSortBy('created_at')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || selectedDestination || selectedRating || sortBy !== 'created_at' || sortOrder !== 'desc'

  if (loading && hotels.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading hotels...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Amazing Hotels</h1>
            <p className="text-gray-600 text-lg">Find the perfect accommodation for your next trip</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search hotels by name, location, or amenities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12"
                disabled={loading}
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </Button>
              
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {pagination ? `${pagination.totalItems} hotels found` : ''}
              </span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-')
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="star_rating-desc">Highest Rated</option>
                <option value="star_rating-asc">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                    <select
                      value={selectedDestination}
                      onChange={(e) => {
                        setSelectedDestination(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">All Destinations</option>
                      {destinations.map((destination) => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                    <select
                      value={selectedRating}
                      onChange={(e) => {
                        setSelectedRating(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                      <option value="1">1+ Stars</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={fetchHotels}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      disabled={loading}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Hotels Grid */}
        {error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Hotels</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchHotels} className="bg-orange-600 hover:bg-orange-700 text-white">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : hotels.length === 0 && !loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Hotels Found</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? "No hotels match your current filters. Try adjusting your search criteria."
                  : "No hotels are available at the moment."
                }
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} className="bg-orange-600 hover:bg-orange-700 text-white">
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {hotels.map((hotel) => {
                const reviewsCount = generateReviewsCount(hotel.rating, hotel.created_at)
                
                return (
                  <Link key={hotel.id} href={`/hotels/${hotel.id}`}>
                    <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
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

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, Math.min(
                        pagination.totalPages - 4,
                        Math.max(1, currentPage - 2)
                      )) + i
                      
                      if (pageNum > pagination.totalPages) return null
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className={pageNum === currentPage 
                            ? "bg-orange-600 text-white hover:bg-orange-700" 
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || loading}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {loading && hotels.length > 0 && (
          <div className="mt-8 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-orange-600 mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}