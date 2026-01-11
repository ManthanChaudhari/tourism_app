# Car Rental Management System

## Overview
A comprehensive car rental management system for the admin panel that allows administrators to manage car inventory, pricing, and availability.

## Features

### Car Management
- **Modern UI Design**: Consistent with package and hotel management using orange accent colors
- **Card-based Layout**: Clean, professional interface with proper spacing and shadows
- **Add New Cars**: Complete form with searchable category and location dropdowns
- **Edit Existing Cars**: Update car information and pricing with searchable dropdowns
- **View Car Details**: Detailed modal with specifications and pricing
- **Delete Cars**: Remove cars from inventory with confirmation
- **Advanced Search & Filter**: Search by name/brand/model, filter by category and location using searchable dropdowns
- **Image Management**: Upload thumbnail and gallery images with preview
- **Pagination**: Professional pagination controls with page numbers
- **Loading States**: Proper loading indicators and error handling
- **Success Messages**: User feedback for all operations

### Enhanced UI Components
- **Searchable Category Dropdown**: Type-ahead search for categories with icons and descriptions
- **Searchable Location Dropdown**: Hierarchical location selection (states and cities) with search
- **Professional Buttons**: Consistent button styling with hover effects and proper spacing
- **Responsive Design**: Works seamlessly across all device sizes
- **Consistent Theme**: Matches the design patterns used in package and hotel management

### Car Fields
- **Basic Information**: Name, Brand, Model, Year
- **Classification**: Category (UUID reference), Base Location (UUID reference)
- **Specifications**: Seating capacity, Luggage capacity, Fuel type, Transmission, AC availability
- **Pricing**: Daily rate, Hourly rate (optional), Extra KM price, Driver charges, Security deposit
- **Booking Requirements**: Minimum booking hours, Minimum booking days
- **Policies**: Fuel policy, Cancellation policy
- **Options**: Allow one-way rentals, Driver included
- **Media**: Thumbnail image, Gallery images
- **Status**: Active/Inactive for availability

## File Structure

```
app/
├── admin/
│   └── cars/
│       └── page.js                    # Main cars management page
├── api/
│   └── admin/
│       └── cars/
│           ├── route.js               # GET (all cars), POST (create car)
│           └── [id]/
│               └── route.js           # GET, PUT, DELETE individual car

components/
└── admin/
    ├── CarForm.jsx                    # Add/Edit car form modal
    └── CarDetailsModal.jsx            # View car details modal

docs/
├── create-cars-table.sql             # Database schema for cars table
└── CAR_RENTAL_MANAGEMENT.md          # This documentation
```

## Database Schema

The cars table includes:
- Primary key (UUID)
- Car details (name, brand, model, year)
- Foreign keys to categories and locations (UUIDs)
- Specifications (seating, luggage, fuel, transmission, AC)
- Pricing information (daily, hourly, extra km, driver, deposit)
- Booking requirements (minimum hours/days)
- Policies (fuel policy, cancellation policy)
- Options (one-way rentals, driver included)
- Image storage (thumbnail + gallery)
- Status and timestamps
- Proper indexes and constraints
- Row Level Security (RLS) policies

## API Endpoints

### GET /api/admin/cars
Fetch all cars with category and location details.

### POST /api/admin/cars
Create a new car with validation.

### GET /api/admin/cars/[id]
Fetch a specific car by ID.

### PUT /api/admin/cars/[id]
Update an existing car.

### DELETE /api/admin/cars/[id]
Delete a car from inventory.

## Usage

1. **Setup Database**: Run the SQL script in `docs/create-cars-table.sql`
2. **Access Admin Panel**: Navigate to `/admin/cars`
3. **Add Cars**: Click "Add New Car" button
4. **Manage Cars**: Use search, filters, and action buttons
5. **View Details**: Click the eye icon to see full car details
6. **Edit Cars**: Click the edit icon to modify car information
7. **Delete Cars**: Click the trash icon to remove cars

## Validation

- Required fields: Name, Brand, Model, Year, Category, Location, Seating Capacity, Price per Day
- Year validation: Between 1990 and current year + 1
- Positive number validation for all pricing fields
- Image upload support with preview
- Form error handling and user feedback

## Security

- Admin-only access through RLS policies
- Input validation and sanitization
- Proper error handling
- Secure file upload handling

## Dependencies

- Next.js 13+ (App Router)
- Supabase (Database & Storage)
- Lucide React (Icons)
- Tailwind CSS (Styling)
- CategoryDropdown component (shared admin component)
- DestinationDropdown component (shared admin component)
- UI Components (@/components/ui/card, @/components/ui/button, @/components/ui/input)
- Orange theme colors (orange-600, orange-700) for consistency

## Future Enhancements

- Booking integration
- Availability calendar
- Maintenance tracking
- Car performance analytics
- Bulk operations
- Export functionality
- Advanced filtering options
- Car comparison features