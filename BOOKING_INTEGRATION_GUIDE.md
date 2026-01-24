# Booking System Integration Guide

## Overview
This guide provides step-by-step instructions for integrating the unified booking management system into your tourism website.

## Prerequisites
1. Supabase project setup with authentication
2. Database schema implemented (see `BOOKING_SYSTEM_SCHEMA.md`)
3. Existing packages, hotels, and cars APIs
4. Payment gateway integration (Razorpay, Stripe, etc.)

---

## Step 1: Database Setup

### 1.1 Run Database Migrations
Execute the SQL commands from `BOOKING_SYSTEM_SCHEMA.md` in your Supabase SQL editor:

```sql
-- Create all tables
CREATE TABLE bookings (...);
CREATE TABLE booking_customers (...);
CREATE TABLE booking_payments (...);
CREATE TABLE booking_meta (...);

-- Create indexes and triggers
-- ... (see schema file)

-- Set up RLS policies
-- ... (see schema file)
```

### 1.2 Verify Tables
Check that all tables are created with proper relationships:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'booking%';
```

---

## Step 2: API Integration

### 2.1 Test API Endpoints
The booking APIs are now available at:
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - User bookings
- `GET /api/bookings/{id}` - Booking details
- `GET /api/admin/bookings` - Admin bookings list
- `GET /api/admin/bookings/stats` - Admin statistics

### 2.2 Test with Sample Data
```bash
# Create a test booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "booking_type": "hotel",
    "service_id": "test-hotel-id",
    "service_title": "Test Hotel - Deluxe Room",
    "start_date": "2026-03-15",
    "end_date": "2026-03-18",
    "adults_count": 2,
    "children_count": 1,
    "rooms_count": 1,
    "total_amount": 15000.00,
    "customers": [
      {
        "full_name": "John Doe",
        "email": "john@example.com",
        "phone": "+91-9876543210",
        "age": 35,
        "customer_type": "adult",
        "is_primary": true
      }
    ]
  }'
```

---

## Step 3: Frontend Integration

### 3.1 Booking Form Component
Create a unified booking form that handles all three booking types:

```jsx
// components/BookingForm.jsx
import { useState } from 'react'

export default function BookingForm({ serviceType, serviceId, serviceTitle, basePrice }) {
  const [formData, setFormData] = useState({
    booking_type: serviceType, // 'package', 'hotel', 'car'
    service_id: serviceId,
    service_title: serviceTitle,
    start_date: '',
    end_date: '',
    adults_count: 1,
    children_count: 0,
    rooms_count: serviceType === 'hotel' ? 1 : null,
    vehicles_count: serviceType === 'car' ? 1 : null,
    customers: [
      {
        full_name: '',
        email: '',
        phone: '',
        age: '',
        customer_type: 'adult',
        is_primary: true
      }
    ],
    meta: {}
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Calculate total amount based on service type and selections
    const totalAmount = calculateTotalAmount(formData, basePrice)
    
    const bookingData = {
      ...formData,
      total_amount: totalAmount
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}` // Optional for guest bookings
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()
      
      if (result.success) {
        // Redirect to payment page
        window.location.href = `/payment/${result.booking.id}`
      } else {
        alert('Booking failed: ' + result.error)
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('Booking failed. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      {/* Date Selection */}
      <div className="form-group">
        <label>Check-in Date</label>
        <input
          type="date"
          value={formData.start_date}
          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Check-out Date</label>
        <input
          type="date"
          value={formData.end_date}
          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
          required
        />
      </div>

      {/* Guest Selection */}
      <div className="form-group">
        <label>Adults</label>
        <select
          value={formData.adults_count}
          onChange={(e) => setFormData({...formData, adults_count: parseInt(e.target.value)})}
        >
          {[1,2,3,4,5,6].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Children</label>
        <select
          value={formData.children_count}
          onChange={(e) => setFormData({...formData, children_count: parseInt(e.target.value)})}
        >
          {[0,1,2,3,4].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Service-specific fields */}
      {serviceType === 'hotel' && (
        <div className="form-group">
          <label>Rooms</label>
          <select
            value={formData.rooms_count}
            onChange={(e) => setFormData({...formData, rooms_count: parseInt(e.target.value)})}
          >
            {[1,2,3,4,5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      )}

      {serviceType === 'car' && (
        <div className="form-group">
          <label>Vehicles</label>
          <select
            value={formData.vehicles_count}
            onChange={(e) => setFormData({...formData, vehicles_count: parseInt(e.target.value)})}
          >
            {[1,2,3].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
      )}

      {/* Customer Information */}
      <div className="customer-section">
        <h3>Primary Contact</h3>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={formData.customers[0].full_name}
            onChange={(e) => {
              const customers = [...formData.customers]
              customers[0].full_name = e.target.value
              setFormData({...formData, customers})
            }}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.customers[0].email}
            onChange={(e) => {
              const customers = [...formData.customers]
              customers[0].email = e.target.value
              setFormData({...formData, customers})
            }}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={formData.customers[0].phone}
            onChange={(e) => {
              const customers = [...formData.customers]
              customers[0].phone = e.target.value
              setFormData({...formData, customers})
            }}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-primary">
        Book Now - ₹{calculateTotalAmount(formData, basePrice).toLocaleString()}
      </button>
    </form>
  )
}

function calculateTotalAmount(formData, basePrice) {
  let total = basePrice
  
  // Multiply by adults (children might be free or discounted)
  total *= formData.adults_count
  
  // Add children cost (50% of adult price)
  total += (basePrice * 0.5 * formData.children_count)
  
  // Multiply by rooms/vehicles if applicable
  if (formData.rooms_count) {
    total *= formData.rooms_count
  }
  
  if (formData.vehicles_count) {
    total *= formData.vehicles_count
  }
  
  // Calculate duration
  if (formData.start_date && formData.end_date) {
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    total *= Math.max(1, days)
  }
  
  return Math.round(total)
}
```

### 3.2 Payment Integration
```jsx
// pages/payment/[bookingId].js
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function PaymentPage() {
  const router = useRouter()
  const { bookingId } = router.query
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (bookingId) {
      fetchBooking()
    }
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`)
      const result = await response.json()
      
      if (result.success) {
        setBooking(result.booking)
      } else {
        alert('Booking not found')
        router.push('/')
      }
    } catch (error) {
      console.error('Fetch booking error:', error)
    } finally {
      setLoading(false)
    }
  }

  const processPayment = async (paymentData) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()
      
      if (result.success) {
        // Redirect to success page
        router.push(`/booking-confirmation/${booking.booking_code}`)
      } else {
        alert('Payment failed: ' + result.error)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    }
  }

  const handleRazorpayPayment = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: booking.total_amount * 100, // Amount in paise
      currency: booking.currency,
      name: 'Your Tourism Company',
      description: `Booking: ${booking.booking_code}`,
      order_id: '', // Create order on your backend
      handler: function (response) {
        // Payment successful
        processPayment({
          payment_gateway: 'razorpay',
          transaction_id: response.razorpay_payment_id,
          payment_method: 'card', // Detect from Razorpay response
          amount: booking.total_amount,
          currency: booking.currency,
          payment_status: 'success',
          raw_response: response
        })
      },
      prefill: {
        name: booking.customers?.find(c => c.is_primary)?.full_name,
        email: booking.customers?.find(c => c.is_primary)?.email,
        contact: booking.customers?.find(c => c.is_primary)?.phone
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="payment-page">
      <h1>Complete Your Payment</h1>
      
      <div className="booking-summary">
        <h2>Booking Summary</h2>
        <p><strong>Booking Code:</strong> {booking.booking_code}</p>
        <p><strong>Service:</strong> {booking.service_title}</p>
        <p><strong>Dates:</strong> {booking.start_date} to {booking.end_date}</p>
        <p><strong>Guests:</strong> {booking.adults_count} Adults, {booking.children_count} Children</p>
        <p><strong>Total Amount:</strong> ₹{booking.total_amount.toLocaleString()}</p>
      </div>

      <div className="payment-methods">
        <button onClick={handleRazorpayPayment} className="btn-primary">
          Pay with Razorpay
        </button>
      </div>
    </div>
  )
}
```

---

## Step 4: Admin Dashboard Integration

### 4.1 Admin Bookings List
```jsx
// pages/admin/bookings.js
import { useState, useEffect } from 'react'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    booking_type: 'all',
    booking_status: 'all',
    payment_status: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchBookings()
  }, [filters])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams(filters)
      const response = await fetch(`/api/admin/bookings?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setBookings(result.bookings)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Fetch bookings error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-bookings">
      <h1>Booking Management</h1>
      
      {/* Filters */}
      <div className="filters">
        <select
          value={filters.booking_type}
          onChange={(e) => setFilters({...filters, booking_type: e.target.value, page: 1})}
        >
          <option value="all">All Types</option>
          <option value="package">Packages</option>
          <option value="hotel">Hotels</option>
          <option value="car">Cars</option>
        </select>

        <select
          value={filters.booking_status}
          onChange={(e) => setFilters({...filters, booking_status: e.target.value, page: 1})}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.payment_status}
          onChange={(e) => setFilters({...filters, payment_status: e.target.value, page: 1})}
        >
          <option value="all">All Payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table">
        <table>
          <thead>
            <tr>
              <th>Booking Code</th>
              <th>Type</th>
              <th>Service</th>
              <th>Customer</th>
              <th>Guests</th>
              <th>Travel Dates</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.booking_code}</td>
                <td>
                  <span className={`badge badge-${booking.booking_type}`}>
                    {booking.booking_type}
                  </span>
                </td>
                <td>{booking.service_name}</td>
                <td>
                  <div>
                    <div>{booking.customer_name}</div>
                    <small>{booking.customer_email}</small>
                  </div>
                </td>
                <td>{booking.adults_children}</td>
                <td>{booking.travel_dates}</td>
                <td>₹{booking.total_amount.toLocaleString()}</td>
                <td>
                  <span className={`badge badge-${booking.payment_status}`}>
                    {booking.payment_status}
                  </span>
                </td>
                <td>
                  <span className={`badge badge-${booking.booking_status}`}>
                    {booking.booking_status}
                  </span>
                </td>
                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => viewBooking(booking.id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => setFilters({...filters, page: filters.page - 1})}
        >
          Previous
        </button>
        
        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        
        <button
          disabled={!pagination.hasNextPage}
          onClick={() => setFilters({...filters, page: filters.page + 1})}
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

### 4.2 Admin Dashboard Stats
```jsx
// components/BookingStats.jsx
import { useState, useEffect } from 'react'

export default function BookingStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/bookings/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading stats...</div>

  return (
    <div className="booking-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bookings</h3>
          <p className="stat-number">{stats.total_bookings}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">₹{stats.total_revenue.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <h3>Paid Revenue</h3>
          <p className="stat-number">₹{stats.paid_revenue.toLocaleString()}</p>
        </div>
        
        <div className="stat-card">
          <h3>Conversion Rate</h3>
          <p className="stat-number">{stats.conversion_rates.payment_success}%</p>
        </div>
      </div>

      <div className="stats-breakdown">
        <div className="breakdown-section">
          <h4>By Type</h4>
          <ul>
            <li>Packages: {stats.by_type.package}</li>
            <li>Hotels: {stats.by_type.hotel}</li>
            <li>Cars: {stats.by_type.car}</li>
          </ul>
        </div>

        <div className="breakdown-section">
          <h4>By Status</h4>
          <ul>
            <li>Confirmed: {stats.by_booking_status.confirmed}</li>
            <li>Pending: {stats.by_booking_status.pending}</li>
            <li>Cancelled: {stats.by_booking_status.cancelled}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
```

---

## Step 5: Testing & Deployment

### 5.1 Test Scenarios
1. **Package Booking**: Create booking for a tour package
2. **Hotel Booking**: Create booking with multiple rooms
3. **Car Booking**: Create booking with driver requirements
4. **Guest Booking**: Create booking without authentication
5. **Payment Flow**: Test successful and failed payments
6. **Admin Access**: Test filtering and viewing bookings

### 5.2 Environment Variables
```env
# Add to your .env.local
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret
```

### 5.3 Deployment Checklist
- [ ] Database schema deployed to production
- [ ] RLS policies enabled
- [ ] API endpoints tested
- [ ] Payment gateway configured
- [ ] Admin authentication working
- [ ] Error handling implemented
- [ ] Monitoring and logging setup

---

## Step 6: Monitoring & Maintenance

### 6.1 Key Metrics to Monitor
- Booking creation success rate
- Payment success rate
- API response times
- Database query performance
- Error rates by endpoint

### 6.2 Regular Maintenance Tasks
- Monitor booking trends
- Review failed payments
- Clean up old booking data (if needed)
- Update payment gateway configurations
- Review and optimize database queries

---

## Troubleshooting

### Common Issues
1. **Booking Creation Fails**: Check validation errors and database constraints
2. **Payment Processing Issues**: Verify payment gateway configuration
3. **Admin Access Denied**: Check user role in profiles table
4. **Performance Issues**: Review database indexes and query optimization

### Debug Tools
```javascript
// Enable API debugging
console.log('Booking data:', bookingData)
console.log('API response:', response)

// Check database constraints
SELECT * FROM bookings WHERE booking_code = 'BK-2026-000123';
```

This integration guide provides a complete roadmap for implementing the unified booking management system in your tourism website. Follow each step carefully and test thoroughly before deploying to production.