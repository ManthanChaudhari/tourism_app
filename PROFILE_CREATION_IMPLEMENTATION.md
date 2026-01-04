# Profile Creation Implementation

## Overview
This document explains how user profiles are automatically created when users register, ensuring every authenticated user has a corresponding profile in the `profiles` table.

## ✅ Implementation Approaches

### 1. API-Based Profile Creation (Current Implementation)

#### Register API Enhancement
- **File**: `app/api/auth/register/route.js`
- **Method**: Automatically creates profile after successful user registration
- **Utility**: Uses `createUserProfile()` from `lib/auth-utils.js`

```javascript
// After successful user registration
if (data.user) {
  const profileResult = await createUserProfile(data.user, {
    firstName,
    lastName,
    role: 'user' // Default role for new registrations
  })
}
```

#### Benefits:
- ✅ Immediate profile creation
- ✅ Error handling and logging
- ✅ Doesn't fail registration if profile creation fails
- ✅ Flexible data handling

### 2. Database Trigger Approach (Alternative)

#### SQL Trigger Implementation
```sql
-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### Benefits:
- ✅ Database-level automation
- ✅ Works for all registration methods (API, OAuth, etc.)
- ✅ No application code needed
- ✅ Guaranteed consistency

## 🔧 Utility Functions

### `lib/auth-utils.js`

#### `createUserProfile(userData, additionalData)`
Creates a new user profile in the profiles table.

```javascript
const profileResult = await createUserProfile(userData, {
  firstName: 'John',
  lastName: 'Doe',
  role: 'user'
})
```

#### `getOrCreateUserProfile(userData, additionalData)`
Gets existing profile or creates new one if it doesn't exist.

```javascript
const result = await getOrCreateUserProfile(userData, additionalData)
// result.created indicates if profile was newly created
```

#### `updateUserRole(userId, newRole, adminUserId)`
Updates user role (admin-only operation).

```javascript
const result = await updateUserRole(targetUserId, 'admin', adminUserId)
```

## 🚀 API Endpoints

### User Management APIs

#### `GET /api/admin/users`
List all users with pagination and filtering (admin only).

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `role` - Filter by role ('user' or 'admin')
- `search` - Search in email, first_name, last_name

**Response:**
```json
{
  "success": true,
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### `GET /api/admin/users/[id]/role`
Get specific user profile (admin only).

#### `PUT /api/admin/users/[id]/role`
Update user role (admin only).

**Request Body:**
```json
{
  "role": "admin" // or "user"
}
```

## 📊 Database Schema

### Profiles Table Structure
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security Policies
```sql
-- Allow users to read their own profile
CREATE POLICY "Allow users to read own profile" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Allow admin read all profiles" ON profiles
FOR SELECT TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));

-- Allow admins to update user roles
CREATE POLICY "Allow admin update user roles" ON profiles
FOR UPDATE TO authenticated
USING (auth.uid() IN (
  SELECT id FROM profiles WHERE role = 'admin'
));
```

## 🔄 Registration Flow

### Current Flow
1. User submits registration form
2. API validates input data
3. Supabase Auth creates user account
4. API automatically creates profile entry
5. Success response sent to client
6. User receives email confirmation

### Error Handling
- If profile creation fails, registration still succeeds
- Error is logged for debugging
- User can still log in (profile can be created later)
- Admin can manually create missing profiles

## 🛠️ Setup Instructions

### 1. Database Setup
```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies (see above)
```

### 2. Create First Admin User
```sql
-- After a user registers, promote them to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin@example.com';
```

### 3. Optional: Add Database Trigger
If you prefer database-level automation, add the trigger from the schema above.

## 🔍 Testing Profile Creation

### Test Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Verify Profile Creation
```sql
SELECT * FROM profiles WHERE email = 'test@example.com';
```

### Test Admin APIs
```bash
# List users (as admin)
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update user role (as admin)
curl -X PUT http://localhost:3000/api/admin/users/USER_ID/role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"role": "admin"}'
```

## 🚨 Important Notes

### Security Considerations
- Profile creation doesn't fail registration (graceful degradation)
- Only admins can update user roles
- RLS policies protect profile data
- All admin operations are logged

### Data Consistency
- Profile IDs match auth.users IDs exactly
- Email addresses are synchronized
- Timestamps track creation and updates
- Role constraints prevent invalid values

### Monitoring
- Profile creation errors are logged
- Failed profile creations don't break registration
- Admin operations are auditable
- Database constraints ensure data integrity

## 🔄 Migration for Existing Users

If you have existing users without profiles:

```sql
-- Create profiles for existing users
INSERT INTO profiles (id, email, role, created_at, updated_at)
SELECT 
  id, 
  email, 
  'user' as role,
  created_at,
  NOW() as updated_at
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);
```

This implementation ensures every user has a profile while maintaining system reliability and security.