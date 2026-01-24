'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, 
  Users, 
  MapPin, 
  Package,
  Building2,
  Car,
  Loader2,
  AlertCircle,
  Filter,
  Search,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Service type icon
const getServiceIcon = (type) => {
  switch (type) {
    case 'package': return Package
    case 'hotel': return Building2
    case 'car': return Car
    default: return Package
  }
}

// Status badge variants
const getStatusVariant = (status) => {
  switch (status) {
    case 'confirmed': return 'default'
    case 'completed': return 'secondary'
    case 'cancelled': return 'destructive'
    case 'pending': return 'outline'
    default: return 'outline'
  }
}

const getPaymentStatusVariant = (status) => {
  switch (status) {
    case 'paid': return 'default'
    case 'failed': return 'destructive'
    case 'refunded': return 'secondary'
    case 'pending': return 'outline'
    default: return 'outline'
  }
}

export default function UserBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({})
  
  // Filters
  const [filters, setFilters] = useState({
    booking_type: 'all',
    status: 'all',
    search: '',
    page: 1
  })

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '10'
      })
      
      if (filters.booking_type !== 'all') {
        params.append('booking_type', filters.booking_type)
      }
      
      if (filters.status !== 'all') {
        params.append('status', filters.status)
      }
      
      const response = await fetch(`/api/bookings?${params}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      
      if (data.success) {
        let filteredBookings = data.bookings
        
        // Apply client-side search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredBookings = filteredBookings.filter(booking => 
            booking.booking_code.toLowerCase().includes(searchLower) ||
            booking.service_title.toLowerCase().includes(searchLower) ||
            booking.customers?.some(customer => 
              customer.full_name.toLowerCase().includes(searchLower) ||
              customer.email?.toLowerCase().includes(searchLower)
            )
          )
        }
        
        setBookings(filteredBookings)
        setPagination(data.pagination)
      } else {
        setError(data.error || 'Failed to fetch bookings')
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError(error.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">View and manage your travel bookings</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Booking Type
                </label>
                <Select 
                  value={filters.booking_type} 
                  onValueChange={(value) => handleFilterChange('booking_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="package">Packages</SelectItem>
                    <SelectItem value="hotel">Hotels</SelectItem>
                    <SelectItem value="car">Cars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by booking code, service, or customer name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Bookings</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={fetchBookings}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bookings List */}
        {!error && (
          <>
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                    <p className="text-gray-600 mb-6">
                      {filters.search || filters.booking_type !== 'all' || filters.status !== 'all'
                        ? 'No bookings match your current filters.'
                        : 'You haven\'t made any bookings yet.'
                      }
                    </p>
                    <div className="space-x-4">
                      {(filters.search || filters.booking_type !== 'all' || filters.status !== 'all') && (
                        <Button 
                          variant="outline"
                          onClick={() => setFilters({ booking_type: 'all', status: 'all', search: '', page: 1 })}
                        >
                          Clear Filters
                        </Button>
                      )}
                      <Link href="/packages">
                        <Button>
                          Browse Packages
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const ServiceIcon = getServiceIcon(booking.booking_type)
                  const primaryCustomer = booking.customers?.find(c => c.is_primary)
                  
                  return (
                    <Card key={booking.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          {/* Main Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start space-x-3 mb-3">
                              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <ServiceIcon className="h-5 w-5 text-gray-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 break-words">
                                  {booking.service_title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant="outline" className="capitalize">
                                    {booking.booking_type}
                                  </Badge>
                                  <span className="text-sm text-gray-500">
                                    {booking.booking_code}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-600 break-words">
                                  {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="text-gray-600">
                                  {booking.adults_count} Adult{booking.adults_count > 1 ? 's' : ''}
                                  {booking.children_count > 0 && `, ${booking.children_count} Child${booking.children_count > 1 ? 'ren' : ''}`}
                                </span>
                              </div>
                              
                              {primaryCustomer && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-gray-600 break-words">
                                    {primaryCustomer.full_name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Status and Actions */}
                          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-end xl:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-0 lg:space-y-3 xl:space-y-0 xl:space-x-4">
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900 mb-1">
                                ₹{booking.total_amount.toLocaleString()}
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Badge variant={getStatusVariant(booking.booking_status)}>
                                  {booking.booking_status}
                                </Badge>
                                <Badge variant={getPaymentStatusVariant(booking.payment_status)}>
                                  {booking.payment_status}
                                </Badge>
                              </div>
                            </div>
                            
                            <Link href={`/booking/success?code=${booking.booking_code}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-sm text-gray-600">
                      Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                      {pagination.totalItems} bookings
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage || loading}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <span className="text-sm text-gray-600 px-3">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}