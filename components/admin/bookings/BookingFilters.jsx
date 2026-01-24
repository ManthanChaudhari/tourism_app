'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

export function BookingFilters({ filters, onFilterChange }) {
  // Clear all filters
  const clearFilters = () => {
    onFilterChange('booking_type', 'all')
    onFilterChange('booking_status', 'all')
    onFilterChange('payment_status', 'all')
    onFilterChange('search', '')
    onFilterChange('date_type', 'created')
    onFilterChange('date_from', '')
    onFilterChange('date_to', '')
    onFilterChange('page', 1)
  }

  // Check if any filters are active
  const hasActiveFilters = 
    filters.booking_type !== 'all' ||
    filters.booking_status !== 'all' ||
    filters.payment_status !== 'all' ||
    filters.search !== '' ||
    filters.date_from !== '' ||
    filters.date_to !== ''

  return (
    <div className="space-y-4">
      {/* First Row - Type and Status Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="booking-type">Booking Type</Label>
          <Select
            value={filters.booking_type}
            onValueChange={(value) => onFilterChange('booking_type', value)}
          >
            <SelectTrigger id="booking-type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="package">Packages</SelectItem>
              <SelectItem value="hotel">Hotels</SelectItem>
              <SelectItem value="car">Cars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="booking-status">Booking Status</Label>
          <Select
            value={filters.booking_status}
            onValueChange={(value) => onFilterChange('booking_status', value)}
          >
            <SelectTrigger id="booking-status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment-status">Payment Status</Label>
          <Select
            value={filters.payment_status}
            onValueChange={(value) => onFilterChange('payment_status', value)}
          >
            <SelectTrigger id="payment-status">
              <SelectValue placeholder="All Payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Booking code, email, phone..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Second Row - Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date-type">Date Filter Type</Label>
          <Select
            value={filters.date_type}
            onValueChange={(value) => onFilterChange('date_type', value)}
          >
            <SelectTrigger id="date-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created">Created Date</SelectItem>
              <SelectItem value="travel">Travel Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-from">From Date</Label>
          <Input
            id="date-from"
            type="date"
            value={filters.date_from}
            onChange={(e) => onFilterChange('date_from', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date-to">To Date</Label>
          <Input
            id="date-to"
            type="date"
            value={filters.date_to}
            onChange={(e) => onFilterChange('date_to', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>&nbsp;</Label>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {filters.booking_type !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Type: {filters.booking_type}
              <button
                onClick={() => onFilterChange('booking_type', 'all')}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.booking_status !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Status: {filters.booking_status}
              <button
                onClick={() => onFilterChange('booking_status', 'all')}
                className="ml-1 hover:text-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.payment_status !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Payment: {filters.payment_status}
              <button
                onClick={() => onFilterChange('payment_status', 'all')}
                className="ml-1 hover:text-purple-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {filters.search && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange('search', '')}
                className="ml-1 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {(filters.date_from || filters.date_to) && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              {filters.date_type === 'created' ? 'Created' : 'Travel'}: 
              {filters.date_from && ` from ${filters.date_from}`}
              {filters.date_to && ` to ${filters.date_to}`}
              <button
                onClick={() => {
                  onFilterChange('date_from', '')
                  onFilterChange('date_to', '')
                }}
                className="ml-1 hover:text-orange-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}