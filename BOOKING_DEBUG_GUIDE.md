# Booking Success Page Debug Guide

## 🔍 **Issue: Success Page Shows "Booking Not Found"**

### **Root Cause Analysis:**
The issue occurs because:
1. **Authenticated users** create bookings with `user_id` set
2. **Guest endpoint** (`/api/bookings/guest/{code}`) expects bookings without `user_id`
3. **Success page** was using the guest endpoint for all users

### **✅ Solution Implemented:**
Created a new unified endpoint: `/api/bookings/code/{booking_code}` that handles both:
- Authenticated user bookings (with `user_id`)
- Guest bookings (without `user_id`)

## 🧪 **Testing Steps:**

### **Step 1: Verify the New API Endpoint**
Test the new endpoint directly in browser or Postman:

```
GET /api/bookings/code/BK-2026-000001
```

**Expected Response:**
```json
{
  "success": true,
  "booking": {
    "id": "uuid",
    "booking_code": "BK-2026-000001",
    "booking_type": "package",
    "service_title": "Package Name",
    "user_id": "user-uuid-or-null",
    // ... other booking details
  }
}
```

### **Step 2: Check Database Records**
Run this SQL query in Supabase to verify booking was created:

```sql
SELECT 
  booking_code, 
  user_id, 
  service_title, 
  booking_status,
  created_at
FROM bookings 
ORDER BY created_at DESC 
LIMIT 5;
```

**What to look for:**
- ✅ Booking code exists (e.g., `BK-2026-000001`)
- ✅ `user_id` is populated for authenticated users
- ✅ `service_title` matches the package name

### **Step 3: Test the Success Page**
1. Create a new booking through the form
2. Note the booking code from the redirect URL
3. Manually navigate to: `/booking/success?code=BK-2026-000001`
4. Check browser console for any errors

### **Step 4: Debug Network Requests**
Open browser DevTools → Network tab:

1. **Look for the API call:** `GET /api/bookings/code/{booking_code}`
2. **Check the response:**
   - Status should be `200 OK`
   - Response should contain booking data
3. **If 404 error:** Booking code doesn't exist in database
4. **If 403 error:** Permission issue with RLS policies

## 🔧 **Common Issues & Fixes:**

### **Issue 1: "Booking not found" (404)**
**Cause:** Booking code doesn't exist in database
**Debug:**
```sql
SELECT * FROM bookings WHERE booking_code = 'BK-2026-000001';
```
**Fix:** Ensure booking was created successfully, check for API errors during creation

### **Issue 2: "Access denied" (403)**
**Cause:** RLS policy blocking access
**Debug:**
```sql
-- Check if RLS policies are too restrictive
SELECT * FROM bookings WHERE booking_code = 'BK-2026-000001';
```
**Fix:** Update RLS policies to allow access:
```sql
-- Allow users to read their own bookings
CREATE POLICY "Users can read own bookings" ON bookings
FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Allow access to guest bookings
CREATE POLICY "Allow guest booking access" ON bookings
FOR SELECT TO anon
USING (user_id IS NULL);
```

### **Issue 3: Booking created but redirect fails**
**Cause:** JavaScript error or network issue
**Debug:** Check browser console for errors
**Fix:** Ensure booking response contains `booking_code` field

### **Issue 4: Meta data not displaying**
**Cause:** Meta data not being formatted correctly
**Debug:** Check if `booking_meta` table has records:
```sql
SELECT * FROM booking_meta WHERE booking_id = 'booking-uuid';
```

## 🛠 **Manual Testing Commands:**

### **Test Booking Creation (Authenticated User):**
```javascript
// Run in browser console on package page
fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    booking_type: 'package',
    service_id: 'test-id',
    service_title: 'Test Package',
    start_date: '2026-03-15',
    end_date: '2026-03-18',
    adults_count: 2,
    children_count: 0,
    total_amount: 15000,
    customers: [{
      full_name: 'Test User',
      email: 'test@example.com',
      phone: '+91-9876543210',
      customer_type: 'adult',
      is_primary: true
    }]
  })
})
.then(r => r.json())
.then(console.log)
```

### **Test Success Page API:**
```javascript
// Test the new endpoint
fetch('/api/bookings/code/BK-2026-000001')
.then(r => r.json())
.then(console.log)
```

## 📋 **Verification Checklist:**

After implementing the fix:

- [ ] New API endpoint `/api/bookings/code/{code}` is accessible
- [ ] Booking creation works without errors
- [ ] Booking appears in database with correct `user_id`
- [ ] Success page loads without "booking not found" error
- [ ] All booking details display correctly
- [ ] Customer information shows properly
- [ ] Meta data (pickup location, etc.) displays
- [ ] Share and print functions work

## 🚨 **If Issues Persist:**

1. **Check Supabase logs** for detailed error messages
2. **Verify RLS policies** are not blocking access
3. **Test with guest booking** (logout and try booking)
4. **Check browser console** for JavaScript errors
5. **Verify database schema** is complete and up-to-date

## 📞 **Quick Debug Commands:**

```sql
-- Check recent bookings
SELECT booking_code, user_id, service_title, created_at 
FROM bookings 
ORDER BY created_at DESC LIMIT 10;

-- Check booking customers
SELECT b.booking_code, bc.full_name, bc.email, bc.is_primary
FROM bookings b
JOIN booking_customers bc ON b.id = bc.booking_id
ORDER BY b.created_at DESC LIMIT 10;

-- Check booking meta
SELECT b.booking_code, bm.key, bm.value
FROM bookings b
JOIN booking_meta bm ON b.id = bm.booking_id
ORDER BY b.created_at DESC LIMIT 10;
```

The new implementation should resolve the "booking not found" issue for authenticated users while maintaining compatibility with guest bookings.