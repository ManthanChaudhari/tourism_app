'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  User,
  Loader2,
  AlertCircle,
  Check
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  calculateEndDate, 
  calculateTotalAmount, 
  validateBookingForm, 
  formatBookingData 
} from "@/lib/booking-utils"

export default function BookingForm({ packageData }) {
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    adults_count: 1,
    children_count: 0,
    primary_customer: {
      full_name: '',
      email: '',
      phone: '',
      age: ''
    }
  })

  // Calculate end date based on package duration
  const handleStartDateChange = (startDate) => {
    const endDate = calculateEndDate(startDate, packageData?.days)
    setFormData(prev => ({
      ...prev,
      start_date: startDate,
      end_date: endDate
    }))
  }

  // Calculate total amount
  const getTotalAmount = () => {
    return calculateTotalAmount(
      packageData?.discountedPrice || packageData?.price || 0,
      formData.adults_count,
      formData.children_count
    )
  }

  // Handle form field changes
  const handleInputChange = (field, value) => {
    if (field.startsWith('primary_customer.')) {
      const customerField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        primary_customer: {
          ...prev.primary_customer,
          [customerField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
      
      // Auto-calculate end date when start date changes
      if (field === 'start_date') {
        handleStartDateChange(value)
      }
    }
  }

  // Validate form
  const validateForm = () => {
    return validateBookingForm(formData)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '))
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // Prepare booking data using utility function
      const bookingData = formatBookingData(formData, packageData, 'package')
      
      // Call booking API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking')
      }
      
      if (result.success) {
        setSuccess(true)
        
        // Redirect to success page after a short delay
        setTimeout(() => {
          router.push(`/booking/success?code=${result.booking.booking_code}`)
        }, 2000)
      } else {
        throw new Error(result.error || 'Failed to create booking')
      }
      
    } catch (error) {
      console.error('Booking error:', error)
      setError(error.message || 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success state
  if (success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Successful!</h3>
              <p className="text-gray-600">Redirecting to confirmation page...</p>
            </div>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalAmount = getTotalAmount()
  const minDate = new Date().toISOString().split('T')[0]

  return (
    <Card>
      <CardContent className="p-6">
        {/* Price Display */}
        <div className="text-center mb-6">
          <div className="text-sm text-gray-600 mb-1">Starting from</div>
          {packageData.originalPrice && packageData.originalPrice !== packageData.discountedPrice && (
            <div className="text-lg text-gray-500 line-through">
              ₹{packageData.originalPrice?.toLocaleString()}
            </div>
          )}
          <div className="text-3xl font-bold text-orange-600 mb-1">
            ₹{packageData.discountedPrice?.toLocaleString() || packageData.price?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">per person</div>
          {packageData.discount && (
            <div className="text-sm text-green-600 font-medium mt-2">
              🎉 Save {packageData.discount}%
            </div>
          )}
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Travel Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="start_date" className="text-sm font-medium text-gray-700">
                Start Date
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  min={minDate}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="end_date" className="text-sm font-medium text-gray-700">
                End Date
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  min={formData.start_date || minDate}
                  className="pl-10"
                  required
                  readOnly={!formData.start_date} // Auto-calculated based on package duration
                />
              </div>
            </div>
          </div>

          {/* Guest Counts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="adults_count" className="text-sm font-medium text-gray-700">
                Adults
              </Label>
              <Select 
                value={formData.adults_count.toString()} 
                onValueChange={(value) => handleInputChange('adults_count', parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Adult{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="children_count" className="text-sm font-medium text-gray-700">
                Children
              </Label>
              <Select 
                value={formData.children_count.toString()} 
                onValueChange={(value) => handleInputChange('children_count', parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <Users className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 0 ? 'Children' : `Child${num > 1 ? 'ren' : ''}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Customer Details */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Primary Contact Details</h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="customer_name" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="customer_name"
                    type="text"
                    value={formData.primary_customer.full_name}
                    onChange={(e) => handleInputChange('primary_customer.full_name', e.target.value)}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer_email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="customer_email"
                    type="email"
                    value={formData.primary_customer.email}
                    onChange={(e) => handleInputChange('primary_customer.email', e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer_phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="customer_phone"
                    type="tel"
                    value={formData.primary_customer.phone}
                    onChange={(e) => handleInputChange('primary_customer.phone', e.target.value)}
                    placeholder="+91 9876543210"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="customer_age" className="text-sm font-medium text-gray-700">
                  Age (Optional)
                </Label>
                <Input
                  id="customer_age"
                  type="number"
                  value={formData.primary_customer.age}
                  onChange={(e) => handleInputChange('primary_customer.age', e.target.value)}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          {totalAmount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {formData.adults_count} Adult{formData.adults_count > 1 ? 's' : ''}
                  {formData.children_count > 0 && ` + ${formData.children_count} Child${formData.children_count > 1 ? 'ren' : ''}`}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
              {formData.children_count > 0 && (
                <p className="text-xs text-gray-500 mb-3">
                  * Children pricing at 50% of adult rate
                </p>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Booking...
              </>
            ) : (
              `Book Now - ₹${totalAmount.toLocaleString()}`
            )}
          </Button>
        </form>

        {/* Trust Indicators */}
        <div className="space-y-2 text-center text-xs text-gray-500 mt-4">
          <p>✓ Instant confirmation</p>
          <p>✓ Secure booking process</p>
          <p>✓ 24/7 customer support</p>
        </div>

        {/* Contact Options */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Need Help?</h4>
          <div className="space-y-2">
            <Button 
              type="button"
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => window.open('tel:+1234567890')}
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="w-full justify-start text-left"
              onClick={() => window.open('mailto:support@example.com')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}