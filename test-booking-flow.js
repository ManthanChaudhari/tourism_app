// Test script to verify booking flow works correctly
// Run this in browser console on your package page

async function testBookingFlow() {
  console.log('🧪 Testing Booking Flow...')
  
  try {
    // Step 1: Test booking creation
    console.log('📝 Step 1: Creating test booking...')
    
    const bookingResponse = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_type: 'package',
        service_id: 'test-service-id',
        service_title: 'Test Package Booking',
        start_date: '2026-03-15',
        end_date: '2026-03-18',
        adults_count: 2,
        children_count: 1,
        total_amount: 25000,
        currency: 'INR',
        customers: [{
          full_name: 'Test User',
          email: 'test@example.com',
          phone: '+91-9876543210',
          customer_type: 'adult',
          is_primary: true
        }, {
          full_name: 'Child 1',
          customer_type: 'child',
          is_primary: false
        }],
        meta: {
          pickup_location: 'Test Pickup',
          package_category: 'Adventure'
        }
      })
    })
    
    const bookingData = await bookingResponse.json()
    
    if (!bookingResponse.ok) {
      console.error('❌ Booking creation failed:', bookingData)
      return
    }
    
    console.log('✅ Booking created successfully:', bookingData.booking.booking_code)
    
    // Step 2: Test success page API
    console.log('📄 Step 2: Testing success page API...')
    
    const successResponse = await fetch(`/api/bookings/code/${bookingData.booking.booking_code}`)
    const successData = await successResponse.json()
    
    if (!successResponse.ok) {
      console.error('❌ Success page API failed:', successData)
      return
    }
    
    console.log('✅ Success page API works:', successData.booking.booking_code)
    
    // Step 3: Test success page URL
    console.log('🔗 Step 3: Testing success page URL...')
    const successUrl = `/booking/success?code=${bookingData.booking.booking_code}`
    console.log('✅ Success URL:', window.location.origin + successUrl)
    
    // Step 4: Verify booking in database (if admin access)
    console.log('🗄️ Step 4: Testing admin API (if admin)...')
    
    try {
      const adminResponse = await fetch(`/api/admin/bookings/${bookingData.booking.id}`)
      if (adminResponse.ok) {
        const adminData = await adminResponse.json()
        console.log('✅ Admin API works:', adminData.booking.booking_code)
      } else {
        console.log('ℹ️ Admin API not accessible (user not admin)')
      }
    } catch (e) {
      console.log('ℹ️ Admin API test skipped')
    }
    
    console.log('🎉 All tests passed! Booking flow is working correctly.')
    console.log('📋 Test Results Summary:')
    console.log('- Booking Creation: ✅')
    console.log('- Success Page API: ✅')
    console.log('- Booking Code:', bookingData.booking.booking_code)
    console.log('- Total Amount: ₹' + bookingData.booking.total_amount.toLocaleString())
    
    return {
      success: true,
      bookingCode: bookingData.booking.booking_code,
      bookingId: bookingData.booking.id,
      successUrl: successUrl
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
    return { success: false, error: error.message }
  }
}

// Run the test
testBookingFlow().then(result => {
  if (result.success) {
    console.log('🚀 You can now test the success page at:', result.successUrl)
  }
})

// Alternative: Test just the success page API with an existing booking code
function testSuccessPageAPI(bookingCode) {
  console.log('🧪 Testing Success Page API for:', bookingCode)
  
  fetch(`/api/bookings/code/${bookingCode}`)
    .then(response => {
      console.log('Response status:', response.status)
      return response.json()
    })
    .then(data => {
      if (data.success) {
        console.log('✅ Success page API works!')
        console.log('📋 Booking details:', {
          code: data.booking.booking_code,
          service: data.booking.service_title,
          amount: data.booking.total_amount,
          status: data.booking.booking_status
        })
      } else {
        console.error('❌ API returned error:', data.error)
      }
    })
    .catch(error => {
      console.error('❌ Network error:', error)
    })
}

// Usage: testSuccessPageAPI('BK-2026-000001')

console.log('🧪 Booking test functions loaded!')
console.log('Run testBookingFlow() to test the complete flow')
console.log('Run testSuccessPageAPI("BK-2026-000001") to test with existing booking code')