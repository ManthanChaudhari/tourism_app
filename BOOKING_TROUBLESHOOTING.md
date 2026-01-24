# Booking System Troubleshooting Guide

## 🚨 **Current Issue: Ambiguous booking_code Column Reference**

### **Error Message:**
```
Booking creation error: {
  code: '42702',
  details: 'It could refer to either a PL/pgSQL variable or a table column.',
  hint: null,
  message: 'column reference "booking_code" is ambiguous'
}
```

### **Root Cause:**
The PostgreSQL trigger function `generate_booking_code()` has a variable named `booking_code` that conflicts with the table column name `booking_code`. This creates ambiguity when the function tries to reference the column.

### **🔧 Quick Fix (Run in Supabase SQL Editor):**

1. **Open Supabase Dashboard** → Go to SQL Editor
2. **Copy and paste** the contents of `QUICK_FIX_BOOKING_CODE.sql`
3. **Execute the script** - this will:
   - Drop the existing problematic functions
   - Create new functions with proper variable naming
   - Recreate the trigger

### **What the Fix Does:**

**Before (Problematic):**
```sql
DECLARE
  booking_code TEXT;  -- ❌ Conflicts with table column name
BEGIN
  SELECT ... FROM bookings WHERE booking_code LIKE ...  -- ❌ Ambiguous reference
```

**After (Fixed):**
```sql
DECLARE
  new_booking_code TEXT;  -- ✅ Different variable name
BEGIN
  SELECT ... FROM bookings b WHERE b.booking_code LIKE ...  -- ✅ Uses table alias
```

### **Verification Steps:**

After running the fix, test the booking creation:

1. **Try creating a booking** through the frontend form
2. **Check the database** - you should see a new booking with auto-generated code like `BK-2026-000001`
3. **Verify the booking code format** follows the pattern: `BK-YYYY-NNNNNN`

### **Alternative Manual Fix:**

If you prefer to fix it manually:

```sql
-- 1. Drop existing trigger and functions
DROP TRIGGER IF EXISTS trigger_set_booking_code ON bookings;
DROP FUNCTION IF EXISTS set_booking_code();
DROP FUNCTION IF EXISTS generate_booking_code();

-- 2. Create new function with fixed variable names
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  new_code TEXT;  -- Different variable name
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(b.booking_code FROM 9) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM bookings b  -- Use table alias
  WHERE b.booking_code LIKE 'BK-' || year_part || '-%';
  
  new_code := 'BK-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  RETURN new_code;
END;
$$ LANGUAGE plpgsql;

-- 3. Recreate trigger function
CREATE OR REPLACE FUNCTION set_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_code IS NULL OR NEW.booking_code = '' THEN
    NEW.booking_code := generate_booking_code();
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Recreate trigger
CREATE TRIGGER trigger_set_booking_code
  BEFORE INSERT OR UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_booking_code();
```

## 🔍 **Other Common Issues & Solutions**

### **Issue: "Booking not found" on Success Page (Authenticated Users)**
**Root Cause:** Success page was using guest endpoint for authenticated user bookings
**Solution:** 
1. **New API endpoint created:** `/api/bookings/code/{booking_code}`
2. **Updated success page** to use the new unified endpoint
3. **Handles both:** Authenticated users and guest bookings

**Quick Fix:** Success page now uses `/api/bookings/code/{code}` instead of `/api/bookings/guest/{code}`

### **Issue: "Table 'bookings' doesn't exist"**
**Solution:** Run the complete schema from `BOOKING_SYSTEM_SCHEMA.md`

### **Issue: "Permission denied for table bookings"**
**Solution:** Ensure RLS policies are set up correctly:
```sql
-- Allow anonymous users to create guest bookings
CREATE POLICY "Allow guest bookings" ON bookings
FOR INSERT TO anon
WITH CHECK (user_id IS NULL);
```

### **Issue: "Invalid input syntax for type uuid"**
**Solution:** Ensure service_id is a valid UUID format in the booking request

### **Issue: "Validation failed" errors**
**Solution:** Check the frontend form validation:
- All required fields are filled
- Email format is valid
- Phone format is valid
- Start date is not in the past
- End date is after start date

## 🧪 **Testing the Fix**

### **Test 1: Basic Booking Creation**
```javascript
// Frontend test - fill out the booking form with:
{
  start_date: '2026-03-15',
  end_date: '2026-03-18',
  adults_count: 2,
  children_count: 1,
  primary_customer: {
    full_name: 'Test User',
    email: 'test@example.com',
    phone: '+91-9876543210'
  }
}
```

### **Test 2: Database Direct Insert**
```sql
-- Run in SQL editor to test trigger
INSERT INTO bookings (
  booking_type, service_id, service_title, 
  start_date, end_date, adults_count, children_count, total_amount
) VALUES (
  'package', 'test-service-id', 'Test Package',
  '2026-03-15', '2026-03-18', 2, 1, 25000.00
);

-- Check if booking_code was auto-generated
SELECT booking_code, created_at FROM bookings ORDER BY created_at DESC LIMIT 1;
```

### **Test 3: API Endpoint Test**
```bash
# Test the booking API directly
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "booking_type": "package",
    "service_id": "test-id",
    "service_title": "Test Package",
    "start_date": "2026-03-15",
    "end_date": "2026-03-18",
    "adults_count": 2,
    "children_count": 0,
    "total_amount": 15000,
    "customers": [{
      "full_name": "Test User",
      "email": "test@example.com",
      "phone": "+91-9876543210",
      "customer_type": "adult",
      "is_primary": true
    }]
  }'
```

## 📞 **If Issues Persist**

1. **Check Supabase logs** for detailed error messages
2. **Verify database schema** is completely set up
3. **Test with minimal data** to isolate the issue
4. **Check browser console** for frontend JavaScript errors
5. **Verify API endpoints** are accessible and responding

## ✅ **Success Indicators**

After the fix, you should see:
- ✅ Booking form submits without errors
- ✅ Success page displays with booking code
- ✅ Database contains new booking record
- ✅ Booking code follows format: `BK-2026-000001`
- ✅ Admin dashboard shows the new booking