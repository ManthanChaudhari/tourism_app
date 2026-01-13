'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { 
  Search, 
  MapPin, 
  Calendar, 
  Grid3X3,
  List,
  X,
  SlidersHorizontal
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function PackagesContent() {
  // State management
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states - Initialize without searchParams
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState({
    min: '',
    max: ''
  })
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'beach', label: 'Beach' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'city', label: 'City Tours' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'luxury', label: 'Luxury' }
  ]

  const sortOptions = [
    { value: 'created_at', label: 'Newest First', order: 'desc' },
    { value: 'created_at', label: 'Oldest First', order: 'asc' },
    { value: 'price_per_person', label: 'Price: Low to High', order: 'asc' },
    { value: 'price_per_person', label: 'Price: High to Low', order: 'desc' },
    { value: 'title', label: 'Name: A to Z', order: 'asc' },
    { value: 'title', label: 'Name: Z to A', order: 'desc' }
  ]

  useEffect(() => {
    fetchPackages()
  }, [currentPage, searchTerm, selectedCategory, priceRange, sortBy, sortOrder])

  const fetchPackages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        public: 'true',
        page: currentPage.toString(),
        limit: '12',
        sortBy,
        sortOrder
      })
      
      if (searchTerm) params.set('search', searchTerm)
      if (selectedCategory !== 'all') params.set('category', selectedCategory)
      
      const response = await fetch(`/api/packages?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch packages')
      }

      const data = await response.json()
      
      if (data.success) {
        // Filter by price range on client side if needed
        let filteredPackages = data.packages || []
        if (priceRange.min || priceRange.max) {
          filteredPackages = filteredPackages.filter(pkg => {
            const price = pkg.discountedPrice || pkg.price
            const min = priceRange.min ? parseFloat(priceRange.min) : 0
            const max = priceRange.max ? parseFloat(priceRange.max) : Infinity
            return price >= min && price <= max
          })
        }
        
        setPackages(filteredPackages)
        setPagination(data.pagination)
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

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPackages()
  }

  const handleSortChange = (value) => {
    const option = sortOptions.find(opt => `${opt.value}-${opt.order}` === value)
    if (option) {
      setSortBy(option.value)
      setSortOrder(option.order)
      setCurrentPage(1)
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setPriceRange({ min: '', max: '' })
    setSortBy('created_at')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || priceRange.min || priceRange.max

  if (loading && packages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore All Destinations</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing travel packages from around the world. Find your perfect adventure with our comprehensive collection of destinations.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search destinations, cities, or activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-8 h-12">
                Search
              </Button>
            </form>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
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
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={`rounded-none ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-gray-600'}`}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-none ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'text-gray-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Sort Dropdown */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {sortOptions.map((option) => (
                    <option key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>
              
              {/* Results Count */}
              <div className="flex items-end">
                <div className="text-sm text-gray-600">
                  {pagination && (
                    <span>
                      Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, pagination.totalItems)} of {pagination.totalItems} packages
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 text-lg mb-4">Failed to load packages</div>
            <Button onClick={fetchPackages} className="bg-orange-600 hover:bg-orange-700 text-white">
              Try Again
            </Button>
          </div>
        ) : packages.length === 0 && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg mb-4">No packages found matching your criteria</div>
            <Button onClick={clearFilters} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            {/* Package Grid/List */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-6"
            }>
              {packages.map((pkg) => (
                <Link key={pkg.id} href={`/packages/${pkg.id}`}>
                  {viewMode === 'grid' ? (
                    <Card className="group overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-96">
                      <CardContent className="p-0 h-full flex flex-col">
                        <div className="relative h-48 overflow-hidden flex-shrink-0">
                          <img
                            src={pkg.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}
                            alt={pkg.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                            }}
                          />
                          {pkg.discount && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                              -{pkg.discount}%
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex-1 min-h-0">
                            <div className="flex items-center gap-2 text-gray-600 mb-3">
                              <MapPin className="h-4 w-4 text-orange-600 flex-shrink-0" />
                              <span className="text-sm font-medium truncate">{pkg.destination}</span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors duration-300 overflow-hidden leading-tight" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.5rem'}}>
                              {pkg.title}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-auto">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              <span className="text-sm">{pkg.duration}</span>
                            </div>
                            <div className="text-right">
                              {pkg.discount ? (
                                <div className="flex flex-col items-end">
                                  <span className="text-xs text-gray-500 line-through">${pkg.originalPrice}</span>
                                  <span className="text-base font-bold text-orange-600">${pkg.discountedPrice}</span>
                                </div>
                              ) : (
                                <span className="text-base font-bold text-orange-600">${pkg.price}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-0">
                        <div className="flex">
                          <div className="relative w-64 h-48 flex-shrink-0 overflow-hidden">
                            <img
                              src={pkg.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"}
                              alt={pkg.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop"
                              }}
                            />
                            {pkg.discount && (
                              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                                -{pkg.discount}%
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <MapPin className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium">{pkg.destination}</span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm capitalize bg-gray-100 px-2 py-1 rounded">{pkg.category}</span>
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                                {pkg.title}
                              </h3>
                              <p className="text-gray-600 text-sm overflow-hidden mb-4" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                                {pkg.description || 'Discover an amazing travel experience with this carefully crafted package.'}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-sm">{pkg.duration}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                {pkg.discount ? (
                                  <div className="flex flex-col items-end">
                                    <span className="text-sm text-gray-500 line-through">${pkg.originalPrice}</span>
                                    <span className="text-2xl font-bold text-orange-600">${pkg.discountedPrice}</span>
                                  </div>
                                ) : (
                                  <span className="text-2xl font-bold text-orange-600">${pkg.price}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </Button>
                
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
                      className={pageNum === currentPage 
                        ? "bg-orange-600 text-white hover:bg-orange-700" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    }>
      <PackagesContent />
    </Suspense>
  )
}