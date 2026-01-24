// Utility functions for booking operations

/**
 * Calculate end date based on start date and duration
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {number} days - Number of days for the package
 * @returns {string} End date in YYYY-MM-DD format
 */
export function calculateEndDate(startDate, days) {
  if (!startDate || !days) return ''
  
  const start = new Date(startDate)
  const end = new Date(start)
  end.setDate(start.getDate() + days - 1)
  
  return end.toISOString().split('T')[0]
}

/**
 * Calculate total booking amount
 * @param {number} basePrice - Base price per person
 * @param {number} adultsCount - Number of adults
 * @param {number} childrenCount - Number of children
 * @param {number} childDiscount - Discount percentage for children (default 50%)
 * @returns {number} Total amount
 */
export function calculateTotalAmount(basePrice, adultsCount, childrenCount, childDiscount = 0.5) {
  if (!basePrice || adultsCount < 1) return 0
  
  const adultPrice = basePrice * adultsCount
  const childPrice = basePrice * childDiscount * childrenCount
  
  return Math.round(adultPrice + childPrice)
}

/**
 * Validate booking form data
 * @param {Object} formData - Form data object
 * @returns {Array} Array of validation error messages
 */
export function validateBookingForm(formData) {
  const errors = []
  
  // Required fields
  if (!formData.start_date) errors.push('Start date is required')
  if (!formData.end_date) errors.push('End date is required')
  if (!formData.adults_count || formData.adults_count < 1) errors.push('At least 1 adult is required')
  if (!formData.primary_customer?.full_name) errors.push('Customer name is required')
  if (!formData.primary_customer?.email) errors.push('Customer email is required')
  if (!formData.primary_customer?.phone) errors.push('Customer phone is required')
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (formData.primary_customer?.email && !emailRegex.test(formData.primary_customer.email)) {
    errors.push('Please enter a valid email address')
  }
  
  // Phone validation (basic)
  const phoneRegex = /^[\+]?[0-9\-\s\(\)]{10,}$/
  if (formData.primary_customer?.phone && !phoneRegex.test(formData.primary_customer.phone)) {
    errors.push('Please enter a valid phone number')
  }
  
  // Date validation
  if (formData.start_date && formData.end_date) {
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (startDate < today) {
      errors.push('Start date cannot be in the past')
    }
    
    if (endDate <= startDate) {
      errors.push('End date must be after start date')
    }
  }
  
  return errors
}

/**
 * Format booking data for API submission
 * @param {Object} formData - Form data
 * @param {Object} serviceData - Service (package/hotel/car) data
 * @param {string} bookingType - Type of booking ('package', 'hotel', 'car')
 * @returns {Object} Formatted booking data for API
 */
export function formatBookingData(formData, serviceData, bookingType = 'package') {
  const totalAmount = calculateTotalAmount(
    serviceData.discountedPrice || serviceData.price,
    formData.adults_count,
    formData.children_count
  )
  
  const bookingData = {
    booking_type: bookingType,
    service_id: serviceData.id,
    service_title: serviceData.title,
    start_date: formData.start_date,
    end_date: formData.end_date,
    adults_count: formData.adults_count,
    children_count: formData.children_count,
    total_amount: totalAmount,
    currency: 'INR',
    customers: [
      {
        full_name: formData.primary_customer.full_name,
        email: formData.primary_customer.email,
        phone: formData.primary_customer.phone,
        age: formData.primary_customer.age ? parseInt(formData.primary_customer.age) : null,
        customer_type: 'adult',
        is_primary: true
      }
    ],
    meta: {}
  }
  
  // Add service-specific metadata
  if (bookingType === 'package') {
    bookingData.meta = {
      pickup_location: serviceData.pickupLocation || '',
      drop_location: serviceData.dropLocation || '',
      package_category: serviceData.category || ''
    }
  } else if (bookingType === 'hotel') {
    bookingData.rooms_count = formData.rooms_count || 1
    bookingData.meta = {
      room_type: formData.room_type || '',
      meal_plan: formData.meal_plan || '',
      special_requests: formData.special_requests || ''
    }
  } else if (bookingType === 'car') {
    bookingData.vehicles_count = formData.vehicles_count || 1
    bookingData.meta = {
      pickup_location: formData.pickup_location || '',
      drop_location: formData.drop_location || '',
      car_model: serviceData.model || '',
      driver_required: formData.driver_required || false
    }
  }
  
  // Add child customers as placeholders
  for (let i = 0; i < formData.children_count; i++) {
    bookingData.customers.push({
      full_name: `Child ${i + 1}`, // Could be enhanced to collect individual names
      customer_type: 'child',
      is_primary: false
    })
  }
  
  return bookingData
}

/**
 * Format currency amount for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default 'INR')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

/**
 * Format date for display
 * @param {string} dateString - Date string
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Date(dateString).toLocaleDateString('en-IN', { ...defaultOptions, ...options })
}

/**
 * Generate booking reference for display
 * @param {string} bookingCode - Booking code
 * @param {string} serviceTitle - Service title
 * @returns {string} Formatted booking reference
 */
export function generateBookingReference(bookingCode, serviceTitle) {
  return `${bookingCode} - ${serviceTitle}`
}