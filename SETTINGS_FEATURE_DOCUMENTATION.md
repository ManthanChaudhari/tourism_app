# Website Settings Feature Documentation

## Overview
The Website Settings feature allows administrators to control the visibility of different sections (Packages, Hotels, Cars) on the website from the admin panel. This provides flexibility to show or hide sections based on business needs.

## Features Implemented

### 1. Admin Settings Page (`/admin/settings`)
- **Location**: `app/admin/settings/page.js`
- **Features**:
  - Toggle visibility for Packages, Hotels, and Cars sections
  - Real-time preview of how sections will appear
  - Save settings with loading states and success/error messages
  - Responsive design with intuitive UI

### 2. Database Schema
- **Table**: `site_settings`
- **Location**: `database/migrations/create_site_settings_table.sql`
- **Columns**:
  - `id` (UUID, Primary Key)
  - `packages_visible` (Boolean, default: true)
  - `hotels_visible` (Boolean, default: true)
  - `cars_visible` (Boolean, default: true)
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)

### 3. API Endpoints

#### Admin Settings API (`/api/admin/settings`)
- **GET**: Fetch current settings (admin only)
- **PUT**: Update settings (admin only)
- **Location**: `app/api/admin/settings/route.js`

#### Public Settings API (`/api/settings`)
- **GET**: Fetch current settings (public access)
- **Location**: `app/api/settings/route.js`

### 4. Settings Context & Hooks
- **Location**: `lib/hooks/useSettings.js`
- **Components**:
  - `SettingsProvider`: Context provider for settings
  - `useSettings()`: Main hook to access settings
  - `usePackagesVisible()`: Hook for packages visibility
  - `useHotelsVisible()`: Hook for hotels visibility
  - `useCarsVisible()`: Hook for cars visibility

### 5. Frontend Integration

#### Homepage (`app/page.js`)
- Conditionally renders sections based on settings:
  - `PopularPackages` (when `packages_visible` is true)
  - `PopularHotels` (when `hotels_visible` is true)
  - `PopularCars` (when `cars_visible` is true)

#### Header Navigation (`components/Header.jsx`)
- Conditionally shows navigation links based on settings
- Works for both desktop and mobile navigation

#### New Component: PopularPackages
- **Location**: `components/PopularPackages.jsx`
- Displays featured packages on the homepage
- Fetches data from `/api/packages?limit=6&featured=true`

## Setup Instructions

### 1. Database Setup
Run the SQL migration to create the settings table:
```sql
-- Execute the contents of database/migrations/create_site_settings_table.sql
```

### 2. Environment Variables
Ensure these environment variables are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Admin Navigation
The settings page is automatically added to the admin navigation sidebar.

## Usage

### For Administrators:
1. Navigate to `/admin/settings`
2. Toggle the visibility switches for each section
3. Preview how the changes will appear
4. Click "Save Settings" to apply changes

### For Developers:
```javascript
// Use the settings hook in any component
import { useSettings } from '@/lib/hooks/useSettings';

function MyComponent() {
  const { settings, loading } = useSettings();
  
  return (
    <div>
      {!loading && settings.packages_visible && (
        <PackagesSection />
      )}
    </div>
  );
}
```

## API Usage Examples

### Fetch Settings (Public)
```javascript
const response = await fetch('/api/settings');
const data = await response.json();
console.log(data.settings); // { packages_visible: true, hotels_visible: false, cars_visible: true }
```

### Update Settings (Admin)
```javascript
const response = await fetch('/api/admin/settings', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    settings: {
      packages_visible: true,
      hotels_visible: false,
      cars_visible: true
    }
  })
});
```

## Security Features
- Row Level Security (RLS) enabled on `site_settings` table
- Admin-only access for settings modification
- Public read access for settings display
- Input validation and sanitization

## Default Behavior
- All sections are visible by default (`true`)
- If no settings exist in database, defaults are used
- Graceful fallback if API calls fail

## File Structure
```
├── app/
│   ├── admin/settings/page.js          # Admin settings page
│   ├── api/admin/settings/route.js     # Admin settings API
│   ├── api/settings/route.js           # Public settings API
│   ├── layout.js                       # Updated with SettingsProvider
│   └── page.js                         # Updated homepage
├── components/
│   ├── Header.jsx                      # Updated navigation
│   └── PopularPackages.jsx             # New packages component
├── lib/hooks/
│   └── useSettings.js                  # Settings context & hooks
└── database/migrations/
    └── create_site_settings_table.sql  # Database schema
```

## Benefits
1. **Flexibility**: Easily control which sections appear on the website
2. **Performance**: Sections that are hidden don't make unnecessary API calls
3. **User Experience**: Clean interface without unused sections
4. **Business Control**: Adapt website content based on available services
5. **Scalability**: Easy to add new toggleable sections in the future