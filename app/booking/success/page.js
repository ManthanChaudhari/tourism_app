'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Head from 'next/head'
import { 
  CheckCircle, 
  Calendar, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Download,
  Share2,
  Home,
  Package,
  Building2,
  Car,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Service type icon
const getServiceIcon = (type) => {
  switch (type) {
    case 'package': return Package
    case 'hotel': return Building2
    case 'car': return Car
    default: return Package
  }
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const bookingCode = searchParams.get('code')
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetails()
    } else {
      setError('No booking code provided')
      setLoading(false)
    }
  }, [bookingCode])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use the new booking code endpoint that handles both authenticated and guest users
      const response = await fetch(`/api/bookings/code/${bookingCode}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Booking not found')
        } else if (response.status === 403) {
          throw new Error('Access denied')
        } else {
          throw new Error('Failed to fetch booking details')
        }
      }

      const data = await response.json()
      
      if (data.success) {
        setBooking(data.booking)
      } else {
        setError(data.error || 'Failed to fetch booking details')
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      setError(error.message || 'Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const shareText = `🎉 Booking Confirmed! 
Booking Code: ${booking.booking_code}
Service: ${booking.service_title}
Travel Dates: ${booking.start_date} to ${booking.end_date}
Total: ₹${booking.total_amount.toLocaleString()}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Confirmation',
          text: shareText,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText)
      alert('Booking details copied to clipboard!')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading booking details...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const ServiceIcon = getServiceIcon(booking.booking_type)
  const primaryCustomer = booking.customers?.find(c => c.is_primary)

  return (
    <>
      <Head>
        <title>Booking Confirmed - {booking?.booking_code}</title>
        <meta name="description" content={`Booking confirmation for ${booking?.service_title}`} />
        <link rel="stylesheet" href="/booking/success/print.css" media="print" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white print:bg-green-600">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-4 sm:mb-6" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-lg sm:text-xl text-green-100 mb-4 sm:mb-6 max-w-2xl mx-auto">
                Your booking has been successfully created and confirmed.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 inline-block max-w-xs sm:max-w-none booking-code print:bg-white print:text-black print:border-2 print:border-black">
                <p className="text-sm text-green-100 mb-1 print:text-black">Booking Code</p>
                <p className="text-xl sm:text-2xl font-bold break-all print:text-black">{booking.booking_code}</p>
              </div>
            </div>
          </div>
        </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Booking Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Booking Summary */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ServiceIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                      {booking.service_title}
                    </h2>
                    <Badge variant="outline" className="capitalize mt-1">
                      {booking.booking_type}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 mb-1">Travel Dates</p>
                      <p className="font-medium text-gray-900 break-words">
                        {formatDate(booking.start_date)} to {formatDate(booking.end_date)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 mb-1">Guests</p>
                      <p className="font-medium text-gray-900">
                        {booking.adults_count} Adult{booking.adults_count > 1 ? 's' : ''}
                        {booking.children_count > 0 && `, ${booking.children_count} Child${booking.children_count > 1 ? 'ren' : ''}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-medium text-gray-900">
                        {booking.duration_days} day{booking.duration_days > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  
                  {(booking.rooms_count || booking.vehicles_count) && (
                    <div className="flex items-start space-x-3">
                      <ServiceIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500 mb-1">
                          {booking.booking_type === 'hotel' ? 'Rooms' : 'Vehicles'}
                        </p>
                        <p className="font-medium text-gray-900">
                          {booking.rooms_count || booking.vehicles_count}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service-specific details */}
                {booking.meta && Object.keys(booking.meta).length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Additional Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                      {Object.entries(booking.meta).map(([key, value]) => (
                        <div key={key} className="min-w-0">
                          <p className="text-sm text-gray-500 capitalize mb-1">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="font-medium text-gray-900 break-words">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Amount */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">
                      ₹{booking.total_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-1 sm:space-y-0">
                    <span className="text-sm text-gray-500">Payment Status:</span>
                    <Badge 
                      variant={booking.payment_status === 'paid' ? 'default' : 'outline'} 
                      className="w-fit"
                    >
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Details */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {primaryCustomer && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-3">Primary Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 mb-1">Name</p>
                        <p className="font-medium text-gray-900 break-words">{primaryCustomer.full_name}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-medium text-gray-900 break-all">{primaryCustomer.email}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <p className="font-medium text-gray-900 break-all">{primaryCustomer.phone}</p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.customers && booking.customers.length > 1 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">All Travelers</h4>
                    <div className="space-y-3">
                      {booking.customers.map((customer) => (
                        <div key={customer.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 break-words">{customer.full_name}</p>
                              <p className="text-sm text-gray-500 capitalize">{customer.customer_type}</p>
                            </div>
                            {customer.is_primary && (
                              <Badge variant="outline" size="sm" className="w-fit">
                                Primary
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleShare}
                  variant="outline" 
                  className="w-full justify-start no-print"
                >
                  <Share2 className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Share Booking</span>
                </Button>
                
                <Button 
                  onClick={() => window.print()}
                  variant="outline" 
                  className="w-full justify-start no-print"
                >
                  <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Print Details</span>
                </Button>
                
                <Link href="/" className="block no-print">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">Back to Home</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle>Important Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="font-medium text-green-800 mb-1">✓ Booking Confirmed</p>
                  <p className="text-green-700 leading-relaxed">
                    Your booking is confirmed and you will receive a confirmation email shortly.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="font-medium text-blue-800 mb-1">📧 Check Your Email</p>
                  <p className="text-blue-700 leading-relaxed break-all">
                    A detailed confirmation email has been sent to {primaryCustomer?.email}
                  </p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <p className="font-medium text-orange-800 mb-1">📱 Save This Page</p>
                  <p className="text-orange-700 leading-relaxed">
                    Bookmark this page or save your booking code: 
                    <strong className="block sm:inline break-all mt-1 sm:mt-0 sm:ml-1">
                      {booking.booking_code}
                    </strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start no-print"
                  onClick={() => window.open('tel:+1234567890')}
                >
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Call Support</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start no-print"
                  onClick={() => window.open('mailto:support@example.com')}
                >
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Email Support</span>
                </Button>
                
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Reference your booking code when contacting support:
                  </p>
                  <p className="text-xs font-medium text-center mt-1 break-all">
                    {booking.booking_code}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}