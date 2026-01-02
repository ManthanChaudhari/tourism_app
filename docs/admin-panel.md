# Admin Panel Documentation

## Overview
The admin panel provides a comprehensive interface for managing travel packages and monitoring business metrics.

## Features

### 1. Dashboard (`/admin`)
- **Business Overview**: Quick snapshot of key metrics
- **Statistics Cards**: 
  - Total packages count
  - Active bookings
  - Pending bookings  
  - Monthly revenue
- **Popular Destinations**: Top performing destinations with booking counts and revenue
- **Recent Bookings**: Latest customer bookings with status
- **Revenue Chart**: Placeholder for future chart integration

### 2. Packages Management (`/admin/packages`)

#### Package List View
- **Grid Layout**: Visual cards showing package information
- **Search & Filter**: Search by title/destination, filter by status
- **Package Actions**: View, Edit, Delete options
- **Status Indicators**: Published/Draft status badges

#### Add New Package (`/admin/packages/new`)
- **Basic Information**: Title, destination, duration, price, description
- **Itinerary Management**: Day-by-day itinerary with add/remove functionality
- **Inclusions/Exclusions**: Dynamic lists for what's included/excluded
- **Image Upload**: Placeholder for package images
- **Status Control**: Save as draft or publish directly

#### Package Detail View (`/admin/packages/[id]`)
- **Complete Package Overview**: All package information in organized sections
- **Statistics**: Price, bookings, duration, destination
- **Visual Layout**: Images, description, detailed itinerary
- **Action Buttons**: Edit and delete functionality

#### Edit Package (`/admin/packages/[id]/edit`)
- **Pre-populated Forms**: All existing data loaded for editing
- **Same Functionality**: All features from new package creation
- **Status Management**: Update status (draft/published)
- **Save Options**: Save changes or save & publish

## Navigation
- **Responsive Sidebar**: Collapsible on mobile, persistent on desktop
- **Active State Indicators**: Visual feedback for current page
- **Breadcrumb Navigation**: Easy navigation between related pages

## Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean UI**: Modern, professional interface using Tailwind CSS
- **Consistent Icons**: Lucide React icons throughout
- **Status Indicators**: Color-coded status badges
- **Interactive Elements**: Hover states and smooth transitions

## Access
- Admin panel accessible via `/admin` route
- Temporary admin link added to main header for development
- Future: Will be protected by authentication

## Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React useState hooks
- **Routing**: Next.js App Router with dynamic routes

## Future Enhancements
- Backend integration for data persistence
- Authentication and authorization
- Image upload functionality
- Chart integration for analytics
- Booking management features
- User management
- Settings and configuration