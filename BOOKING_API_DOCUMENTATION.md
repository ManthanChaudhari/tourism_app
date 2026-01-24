# Unified Booking Management System - API Documentation

## Overview
This document provides comprehensive API documentation for the unified booking management system that handles Packages, Hotels, and Cars bookings.

## Base URL
All API endpoints are relative to your application's base URL: `/api`

## Authentication
- **Client APIs**: Support both authenticated users and guest bookings
- **Admin APIs**: Require admin authentication via Supabase Auth
- **Headers**: Include `Authorization: Bearer <token>` for authenticated requests

---

## Client-Side APIs

### 1. Create Booking
**Endpoint:** `POST /api/bookings`

**Description:** Create a new booking for packages, hotels, or cars.

**Request Body:**
```json
{
  "booking_type": "package|hotel|car",
  "service_id": "uuid",
  "service_title": "Service Name Snapshot",
  "start_date": "2026-03-15",
  "end_date": "2026-03-18",
  "adults_count": 2,
  "children_count": 1,
  "rooms_count": 1,  // Required for hotel bookings
  "vehicles_count": 1,  // Required for car bookings
  "total_amount": 15000.00,
  "currency": "INR",
  "customers": [
    {
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+91-9876543210",
      "age": 35,
      "customer_type": "adult",
      "is_primary": true
    },
    {
      "full_name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+91-9876543211",
      "age": 32,
      "customer_type": "adult",
      "is_primary": false
    },
    {
      "full_name": "Little Doe",
      "age": 8,
      "customer_type": "child",
      "is_primary": false
    }
  ],
  "meta": {
    "pickup_location": "Airport Terminal 1",
    "room_type": "Deluxe",
    "meal_plan": "Breakfast Included",
    "special_requests": "High floor room preferred"
  }
}
```

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "booking_code": "BK-2026-000123",
    "booking_type": "hotel",
    "service_id": "uuid",
    "service_title": "Grand Palace Hotel - Deluxe Room",
    "user_id": "uuid|null",
    "booking_status": "pending",
    "payment_status": "pending",
    "start_date": "2026-03-15",
    "end_date": "2026-03-18",
    "duration_days": 3,
    "adults_count": 2,
    "children_count": 1,
    "rooms_count": 1,
    "total_amount": 15000.00,
    "currency": "INR",
    "created_at": "2026-01-24T10:30:00Z",
    "customers": [...],
    "meta": {...}
  },
  "message": "Booking created successfully"
}
```

### 2. Get User Bookings
**Endpoint:** `GET /api/bookings`

**Description:** Get bookings for authenticated user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)
- `booking_type` (optional): Filter by type (package|hotel|car|all)
- `status` (optional): Filter by booking status (pending|confirmed|cancelled|completed|all)

**Response:**
```json
{
  "success": true,
  "bookings": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 3. Get Booking Details
**Endpoint:** `GET /api/bookings/{id}`

**Description:** Get detailed booking information by ID.

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "booking_code": "BK-2026-000123",
    // ... all booking fields
    "customers": [...],
    "payments": [...],
    "meta": {
      "pickup_location": "Airport Terminal 1",
      "room_type": "Deluxe"
    }
  }
}
```

### 4. Get Guest Booking
**Endpoint:** `GET /api/bookings/guest/{booking_code}`

**Description:** Get booking details using booking code (for guest access).

**Query Parameters:**
- `email` (optional): Primary customer email for verification
- `phone` (optional): Primary customer phone for verification

**Response:** Same as booking details above.

### 5. Process Payment
**Endpoint:** `POST /api/bookings/{id}/payment`

**Description:** Process payment for a booking.

**Request Body:**
```json
{
  "payment_gateway": "razorpay|stripe|cashfree|payu",
  "transaction_id": "txn_123456789",
  "payment_method": "card|upi|netbanking|wallet|emi",
  "amount": 15000.00,
  "currency": "INR",
  "payment_status": "success|failed|pending",
  "raw_response": {
    // Gateway response data
  }
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "uuid",
    "booking_id": "uuid",
    "payment_gateway": "razorpay",
    "transaction_id": "txn_123456789",
    "payment_method": "card",
    "amount": 15000.00,
    "currency": "INR",
    "payment_status": "success",
    "paid_at": "2026-01-24T10:35:00Z",
    "created_at": "2026-01-24T10:35:00Z"
  },
  "message": "Payment processed successfully"
}
```

### 6. Get Payment History
**Endpoint:** `GET /api/bookings/{id}/payment`

**Description:** Get payment history for a booking.

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "id": "uuid",
      "payment_gateway": "razorpay",
      "transaction_id": "txn_123456789",
      "payment_method": "card",
      "amount": 15000.00,
      "currency": "INR",
      "payment_status": "success",
      "paid_at": "2026-01-24T10:35:00Z",
      "created_at": "2026-01-24T10:35:00Z",
      "refund_amount": 0,
      "refund_status": "none"
    }
  ]
}
```

---

## Admin APIs (Read-Only)

### 1. Get All Bookings
**Endpoint:** `GET /api/admin/bookings`

**Description:** Get all bookings with filtering and pagination (admin only).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sortBy` (optional): Sort field (created_at|booking_code|booking_type|booking_status|payment_status|start_date|total_amount)
- `sortOrder` (optional): Sort direction (asc|desc, default: desc)
- `booking_type` (optional): Filter by type (package|hotel|car|all)
- `booking_status` (optional): Filter by booking status (pending|confirmed|cancelled|completed|all)
- `payment_status` (optional): Filter by payment status (pending|paid|failed|refunded|all)
- `booking_code` (optional): Search by booking code
- `customer_search` (optional): Search in customer name, email, phone
- `created_from` (optional): Filter by creation date from (YYYY-MM-DD)
- `created_to` (optional): Filter by creation date to (YYYY-MM-DD)
- `travel_from` (optional): Filter by travel date from (YYYY-MM-DD)
- `travel_to` (optional): Filter by travel date to (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "uuid",
      "booking_code": "BK-2026-000123",
      "booking_type": "hotel",
      "service_name": "Grand Palace Hotel - Deluxe Room",
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "+91-9876543210",
      "adults_children": "2A / 1C",
      "travel_dates": "2026-03-15 to 2026-03-18",
      "duration": "3 days",
      "rooms_vehicles": "1",
      "total_amount": 15000.00,
      "currency": "INR",
      "payment_status": "paid",
      "booking_status": "confirmed",
      "created_at": "2026-01-24T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "booking_type": "all",
    "booking_status": "all",
    "payment_status": "all",
    "sortBy": "created_at",
    "sortOrder": "desc"
  }
}
```

### 2. Get Booking Details (Admin)
**Endpoint:** `GET /api/admin/bookings/{id}`

**Description:** Get detailed booking information for admin view.

**Response:**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "booking_code": "BK-2026-000123",
    "booking_type": "hotel",
    "service_id": "uuid",
    "service_title": "Grand Palace Hotel - Deluxe Room",
    "user_id": "uuid",
    "booking_status": "confirmed",
    "payment_status": "paid",
    "start_date": "2026-03-15",
    "end_date": "2026-03-18",
    "duration_days": 3,
    "adults_count": 2,
    "children_count": 1,
    "rooms_count": 1,
    "total_amount": 15000.00,
    "currency": "INR",
    "created_at": "2026-01-24T10:30:00Z",
    "updated_at": "2026-01-24T10:35:00Z",
    "primary_customer": {
      "id": "uuid",
      "full_name": "John Doe",
      "email": "john@example.com",
      "phone": "+91-9876543210",
      "age": 35,
      "customer_type": "adult"
    },
    "adults": [...],
    "children": [...],
    "payments": [...],
    "meta": {
      "pickup_location": "Airport Terminal 1",
      "room_type": "Deluxe"
    },
    "display": {
      "guest_summary": "2 Adults, 1 Child",
      "date_range": "2026-03-15 to 2026-03-18",
      "duration_text": "3 days",
      "service_summary": "1 Room",
      "amount_formatted": "INR 15,000",
      "status_badge": {
        "booking": "confirmed",
        "payment": "paid",
        "booking_color": "green",
        "payment_color": "green"
      }
    }
  }
}
```

### 3. Get Booking Statistics
**Endpoint:** `GET /api/admin/bookings/stats`

**Description:** Get booking statistics for admin dashboard.

**Query Parameters:**
- `from` (optional): Date range start (YYYY-MM-DD, default: start of current year)
- `to` (optional): Date range end (YYYY-MM-DD, default: today)

**Response:**
```json
{
  "success": true,
  "stats": {
    "total_bookings": 150,
    "total_revenue": 2250000.00,
    "paid_revenue": 1800000.00,
    "by_type": {
      "package": 75,
      "hotel": 50,
      "car": 25
    },
    "by_booking_status": {
      "pending": 20,
      "confirmed": 100,
      "cancelled": 15,
      "completed": 15
    },
    "by_payment_status": {
      "pending": 25,
      "paid": 120,
      "failed": 3,
      "refunded": 2
    },
    "revenue_by_type": {
      "package": 1500000.00,
      "hotel": 600000.00,
      "car": 150000.00
    },
    "conversion_rates": {
      "booking_confirmation": "76.67",
      "payment_success": "80.00"
    },
    "date_range": {
      "from": "2026-01-01",
      "to": "2026-01-24"
    }
  },
  "daily_trends": [
    {
      "date": "2026-01-23",
      "bookings": 5,
      "revenue": 75000.00,
      "paid_revenue": 60000.00,
      "package": 3,
      "hotel": 2,
      "car": 0
    }
  ],
  "recent_bookings": [
    {
      "id": "uuid",
      "booking_code": "BK-2026-000123",
      "booking_type": "hotel",
      "service_title": "Grand Palace Hotel",
      "customer_name": "John Doe",
      "booking_status": "confirmed",
      "payment_status": "paid",
      "total_amount": 15000.00,
      "currency": "INR",
      "created_at": "2026-01-24T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

All APIs return consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Validation error 1", "Validation error 2"]  // Optional for validation errors
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `405` - Method Not Allowed (admin read-only endpoints)
- `500` - Internal Server Error

---

## Booking Meta Keys Reference

### Package Bookings
- `pickup_location` - Pickup point
- `drop_location` - Drop-off point
- `meal_plan` - Meal preferences
- `special_requests` - Additional requests

### Hotel Bookings
- `room_type` - Type of room booked
- `room_ids` - JSON array of specific room IDs
- `meal_plan` - Meal plan selected
- `special_requests` - Special accommodation requests
- `check_in_time` - Preferred check-in time
- `check_out_time` - Preferred check-out time

### Car Bookings
- `pickup_location` - Pickup address/location
- `drop_location` - Drop-off address/location
- `car_model` - Specific car model
- `driver_required` - Boolean for self-drive vs chauffeur
- `pickup_time` - Preferred pickup time
- `additional_driver` - Additional driver details

---

## Integration Examples

### Frontend Booking Flow
```javascript
// 1. Create booking
const bookingResponse = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Optional for guest bookings
  },
  body: JSON.stringify(bookingData)
});

const { booking } = await bookingResponse.json();

// 2. Process payment
const paymentResponse = await fetch(`/api/bookings/${booking.id}/payment`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(paymentData)
});
```

### Admin Dashboard Integration
```javascript
// Get bookings with filters
const response = await fetch('/api/admin/bookings?' + new URLSearchParams({
  page: 1,
  limit: 20,
  booking_type: 'hotel',
  booking_status: 'confirmed',
  sortBy: 'created_at',
  sortOrder: 'desc'
}), {
  headers: {
    'Authorization': `Bearer ${adminToken}`
  }
});

const { bookings, pagination } = await response.json();
```

---

## Notes

1. **Immutable Bookings**: Once created, bookings cannot be modified to maintain data integrity
2. **Guest Bookings**: System supports bookings without user authentication
3. **Admin Read-Only**: Admin APIs strictly prohibit create/update/delete operations
4. **Payment Integration**: Supports multiple payment gateways with flexible response handling
5. **Flexible Meta Storage**: Service-specific data stored as key-value pairs
6. **Comprehensive Filtering**: Admin panel supports extensive filtering and search capabilities
7. **Audit Trail**: All operations are logged with timestamps for tracking
8. **Scalable Design**: APIs designed to handle high-volume bookings with proper pagination