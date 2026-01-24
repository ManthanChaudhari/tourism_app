'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Calendar, 
  Users, 
  CreditCard, 
  MapPin, 
  Phone, 
  Mail,
  User,
  Package,
  Building2,
  Car,
  Clock,
  DollarSign,
  ExternalLink
} from 'lucide-react'

// Status badge variants (same as table)
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

// Service type icon
const getServiceIcon = (type) => {
  switch (type) {
    case 'package': return Package
    case 'hotel': return Building2
    case 'car': return Car
    default: return Package
  }
}

// Loading skeleton for booking details
function BookingDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const bookingId = params.id
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth implementation
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch booking details')
      }

      const data = await response.json()
      
      if (data.success) {
        setBooking(data.booking)
      } else {
        setError(data.error || 'Failed to load booking')
      }
    } catch (error) {
      console.error('Fetch booking details error:', error)
      setError('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <ExternalLink className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Error Loading Booking</h3>
                <p className="text-gray-500 mt-1">{error}</p>
              </div>
              <Button onClick={fetchBookingDetails}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ServiceIcon = booking ? getServiceIcon(booking.booking_type) : Package

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          {booking && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ServiceIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {booking.booking_code}
                </h1>
                <p className="text-gray-600">{booking.service_title}</p>
              </div>
            </div>
          )}
        </div>
        
        {booking && (
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusBadgeVariant(booking.booking_status, 'booking')}>
              {booking.booking_status}
            </Badge>
            <Badge variant={getStatusBadgeVariant(booking.payment_status, 'payment')}>
              {booking.payment_status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {booking.booking_type}
            </Badge>
          </div>
        )}
      </div>

      {loading ? (
        <BookingDetailSkeleton />
      ) : booking ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Booking Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Travel Dates</label>
                    <p className="text-sm">{booking.display.date_range}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Duration</label>
                    <p className="text-sm">{booking.display.duration_text}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guests</label>
                    <p className="text-sm">{booking.display.guest_summary}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Service Details</label>
                    <p className="text-sm">{booking.display.service_summary}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">
                    {booking.display.amount_formatted}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Customer Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Primary Customer */}
                {booking.primary_customer && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Primary Contact</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Name</label>
                        <p className="text-sm">{booking.primary_customer.full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-sm flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {booking.primary_customer.email}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Phone</label>
                        <p className="text-sm flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.primary_customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* All Adults */}
                {booking.adults && booking.adults.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Adults ({booking.adults.length})</h4>
                    <div className="space-y-3">
                      {booking.adults.map((adult, index) => (
                        <div key={adult.id} className="p-3 border rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Name</label>
                              <p className="text-sm">{adult.full_name}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Email</label>
                              <p className="text-sm">{adult.email || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Phone</label>
                              <p className="text-sm">{adult.phone || 'N/A'}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Age</label>
                              <p className="text-sm">{adult.age || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Children */}
                {booking.children && booking.children.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Children ({booking.children.length})</h4>
                    <div className="space-y-3">
                      {booking.children.map((child, index) => (
                        <div key={child.id} className="p-3 border rounded-lg bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500">Name</label>
                              <p className="text-sm">{child.full_name}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-500">Age</label>
                              <p className="text-sm">{child.age || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service-Specific Details */}
            {booking.meta && Object.keys(booking.meta).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Service Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(booking.meta).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm font-medium text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        <p className="text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Payment & Timeline */}
          <div className="space-y-6">
            {/* Payment History */}
            {booking.payments && booking.payments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Payment History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.payments.map((payment, index) => (
                      <div key={payment.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant={getStatusBadgeVariant(payment.payment_status, 'payment')}>
                            {payment.payment_status}
                          </Badge>
                          <span className="font-semibold">
                            {formatCurrency(payment.amount, payment.currency)}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Gateway</label>
                            <p className="capitalize">{payment.payment_gateway}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Transaction ID</label>
                            <p>{payment.transaction_id || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Method</label>
                            <p className="capitalize">{payment.payment_method || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Date</label>
                            <p>{payment.paid_at ? formatDateTime(payment.paid_at) : 'Pending'}</p>
                          </div>
                        </div>

                        {payment.refund_amount > 0 && (
                          <div className="mt-3 p-2 bg-orange-50 rounded border-l-4 border-orange-400">
                            <p className="text-sm text-orange-800">
                              Refunded: {formatCurrency(payment.refund_amount, payment.currency)}
                              {payment.refunded_at && ` on ${formatDateTime(payment.refunded_at)}`}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Timeline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Booking Created</p>
                      <p className="text-xs text-gray-500">{formatDateTime(booking.created_at)}</p>
                    </div>
                  </div>
                  
                  {booking.updated_at !== booking.created_at && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-xs text-gray-500">{formatDateTime(booking.updated_at)}</p>
                      </div>
                    </div>
                  )}

                  {booking.payments && booking.payments.length > 0 && (
                    booking.payments.map((payment) => (
                      payment.paid_at && (
                        <div key={payment.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Payment Received</p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(payment.paid_at)} - {formatCurrency(payment.amount, payment.currency)}
                            </p>
                          </div>
                        </div>
                      )
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}