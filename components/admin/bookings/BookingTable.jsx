'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

// Status badge variants
const getStatusBadgeVariant = (status, type) => {
  if (type === 'booking') {
    switch (status) {
      case 'confirmed': return 'default'
      case 'completed': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  } else if (type === 'payment') {
    switch (status) {
      case 'paid': return 'default'
      case 'failed': return 'destructive'
      case 'refunded': return 'secondary'
      case 'pending': return 'outline'
      default: return 'outline'
    }
  }
  return 'outline'
}

// Booking type badge colors
const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'package': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'hotel': return 'bg-green-100 text-green-800 border-green-200'
    case 'car': return 'bg-purple-100 text-purple-800 border-purple-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Sortable column header
function SortableHeader({ children, field, currentSort, onSortChange }) {
  const isSorted = currentSort.field === field
  const isAsc = isSorted && currentSort.order === 'asc'
  const isDesc = isSorted && currentSort.order === 'desc'

  const handleSort = () => {
    if (!isSorted) {
      onSortChange(field, 'desc')
    } else if (isDesc) {
      onSortChange(field, 'asc')
    } else {
      onSortChange(field, 'desc')
    }
  }

  return (
    <button
      onClick={handleSort}
      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
    >
      <span>{children}</span>
      {!isSorted && <ArrowUpDown className="h-4 w-4 text-gray-400" />}
      {isAsc && <ArrowUp className="h-4 w-4 text-gray-600" />}
      {isDesc && <ArrowDown className="h-4 w-4 text-gray-600" />}
    </button>
  )
}

// Loading skeleton for table rows
function TableRowSkeleton() {
  return (
    <TableRow>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-8 w-16" /></TableCell>
    </TableRow>
  )
}

// Empty state component
function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={11} className="text-center py-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters to see more results.</p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

// Pagination component
function Pagination({ pagination, onPageChange }) {
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination
  
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <div className="text-sm text-gray-700">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-700 px-3">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function BookingTable({ 
  bookings, 
  loading, 
  pagination, 
  onViewBooking, 
  onPageChange, 
  onSortChange,
  currentSort 
}) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader 
                field="booking_code" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Booking Code
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="booking_type" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Type
              </SortableHeader>
            </TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>
              <SortableHeader 
                field="start_date" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Travel Dates
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="total_amount" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Amount
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="payment_status" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Payment
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="booking_status" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Status
              </SortableHeader>
            </TableHead>
            <TableHead>
              <SortableHeader 
                field="created_at" 
                currentSort={currentSort} 
                onSortChange={onSortChange}
              >
                Created
              </SortableHeader>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))
          ) : bookings.length === 0 ? (
            // Empty state
            <EmptyState />
          ) : (
            // Actual booking rows
            bookings.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {booking.booking_code}
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getTypeBadgeClass(booking.booking_type)}
                  >
                    {booking.booking_type}
                  </Badge>
                </TableCell>
                
                <TableCell className="max-w-xs">
                  <div className="truncate" title={booking.service_name}>
                    {booking.service_name}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{booking.customer_name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {booking.customer_email}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    {booking.adults_children}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm">
                    <div>{booking.travel_dates}</div>
                    <div className="text-gray-500">{booking.duration}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="font-medium">
                    {booking.currency} {booking.total_amount.toLocaleString()}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.payment_status, 'payment')}>
                    {booking.payment_status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.booking_status, 'booking')}>
                    {booking.booking_status}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewBooking(booking.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      {!loading && bookings.length > 0 && (
        <Pagination 
          pagination={pagination} 
          onPageChange={onPageChange} 
        />
      )}
    </div>
  )
}