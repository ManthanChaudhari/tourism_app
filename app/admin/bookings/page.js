'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookingFilters } from '@/components/admin/bookings/BookingFilters'
import { BookingTable } from '@/components/admin/bookings/BookingTable'
import { BookingStats } from '@/components/admin/bookings/BookingStats'
import { BookingDetailDrawer } from '@/components/admin/bookings/BookingDetailDrawer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminBookingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State management
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20
  })

  // Filter state from URL params
  const [filters, setFilters] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 20,
    booking_type: searchParams.get('booking_type') || 'all',
    booking_status: searchParams.get('booking_status') || 'all',
    payment_status: searchParams.get('payment_status') || 'all',
    search: searchParams.get('search') || '',
    date_type: searchParams.get('date_type') || 'created',
    date_from: searchParams.get('date_from') || '',
    date_to: searchParams.get('date_to') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  })

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Update URL when filters change
  const updateURL = useCallback((newFilters) => {
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value.toString())
      }
    })
    
    const newURL = `/admin/bookings${params.toString() ? `?${params.toString()}` : ''}`
    router.push(newURL, { scroll: false })
  }, [router])

  // Fetch bookings from API
  const fetchBookings = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const queryParams = new URLSearchParams()
      
      // Add all non-empty filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          // Handle date filters
          if (key === 'date_from' && filters.date_type === 'created') {
            queryParams.set('created_from', value)
          } else if (key === 'date_to' && filters.date_type === 'created') {
            queryParams.set('created_to', value)
          } else if (key === 'date_from' && filters.date_type === 'travel') {
            queryParams.set('travel_from', value)
          } else if (key === 'date_to' && filters.date_type === 'travel') {
            queryParams.set('travel_to', value)
          } else if (key === 'search') {
            queryParams.set('customer_search', value)
            queryParams.set('booking_code', value)
          } else if (key !== 'date_type') {
            queryParams.set(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/admin/bookings?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth implementation
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      
      if (data.success) {
        setBookings(data.bookings)
        setPagination(data.pagination)
      } else {
        console.error('API Error:', data.error)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [filters])

  // Effect to fetch bookings when filters change
  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  // Effect to update URL when filters change (except for search which is debounced)
  useEffect(() => {
    const filtersToUpdate = { ...filters }
    if (debouncedSearch !== filters.search) {
      filtersToUpdate.search = debouncedSearch
    }
    updateURL(filtersToUpdate)
  }, [filters, debouncedSearch, updateURL])

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when other filters change
    }))
  }

  // Handle booking view
  const handleViewBooking = (bookingId) => {
    setSelectedBookingId(bookingId)
    setDrawerOpen(true)
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchBookings(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">View and manage all bookings across packages, hotels, and cars</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <BookingStats />

      {/* Filters */}
      <Card className={"p-4"}>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card className={"p-4"}>
        <CardHeader>
          <CardTitle>
            Bookings 
            {pagination.totalItems > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({pagination.totalItems} total)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BookingTable
            bookings={bookings}
            loading={loading}
            pagination={pagination}
            onViewBooking={handleViewBooking}
            onPageChange={(page) => handleFilterChange('page', page)}
            onSortChange={(sortBy, sortOrder) => {
              handleFilterChange('sortBy', sortBy)
              handleFilterChange('sortOrder', sortOrder)
            }}
            currentSort={{ field: filters.sortBy, order: filters.sortOrder }}
          />
        </CardContent>
      </Card>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        bookingId={selectedBookingId}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}