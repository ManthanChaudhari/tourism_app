# Location-Based Filtering Implementation

## Overview
This implementation adds location-based filtering to the homepage, allowing packages, hotels, and cars to be dynamically filtered based on the location selected in the Hero section's search bar.

## Architecture

### 1. Location Context (`lib/contexts/LocationContext.js`)
A React context that manages the global state for:
- **Selected Location**: The location chosen from the Hero search bar
- **Selected Date**: The travel date (for future use)
- **Passengers**: Number of adults and children (for future use)

#### Key Features:
- Centralized state management
- Helper functions for location display
- Easy integration across components

### 2. API Endpoints

#### Packages API (`/api/packages`)
- **Endpoint**: `GET /api/packages`
- **Parameters**:
  - `locationId`: Filter by specific location
  - `limit`: Number of results (default: 6)
  - `featured`: Show only featured packages
  - `search`: Search by package name

#### Hotels API (`/api/hotels`)
- **Endpoint**: `GET /api/hotels`
- **Parameters**:
  - `locationId`: Filter by specific location
  - `limit`: Number of results (default: 6)
  - `featured`: Show only featured hotels
  - `search`: Search by hotel name
  - `minRating`: Minimum rating filter

#### Cars API (`/api/cars`)
- **Endpoint**: `GET /api/cars`
- **Parameters**:
  - `locationId`: Filter by specific location
  - `limit`: Number of results (default: 6)
  - `featured`: Show only featured cars
  - `search`: Search by car name/brand/model
  - `categoryId`: Filter by car category

### 3. Component Updates

#### Hero Component (`components/Hero.tsx`)
- **Integration**: Uses `useLocation` hook
- **Updates Context**: When location is selected, updates global context
- **Triggers**: Location selection triggers re-fetch in other components

#### PopularPackages Component (`components/PopularPackages.jsx`)
- **New Component**: Created to display packages
- **Location Aware**: Fetches packages based on selected location
- **Dynamic Headers**: Shows location-specific titles
- **Filter Indicator**: Displays selected location badge

#### PopularHotels Component (`components/PopularHotels.jsx`)
- **Updated**: Now uses location context
- **Dynamic Filtering**: Fetches hotels based on selected location
- **Enhanced UI**: Shows location-specific information

#### PopularCars Component (`components/PopularCars.jsx`)
- **Updated**: Now uses location context
- **Dynamic Filtering**: Fetches cars based on selected location
- **Enhanced UI**: Shows location-specific information

## User Experience Flow

### 1. Initial Load
```
Homepage loads → Shows all popular packages/hotels/cars
```

### 2. Location Selection
```
User selects location in Hero → Context updates → Components re-fetch filtered data
```

### 3. Dynamic Updates
```
Location: "Mumbai" selected
↓
Packages: Shows "Packages in Mumbai, Maharashtra"
Hotels: Shows "Hotels in Mumbai, Maharashtra"  
Cars: Shows "Cars in Mumbai, Maharashtra"
```

## Database Queries

### Location Filtering Logic
The APIs use sophisticated location filtering that includes:

1. **Direct Match**: Items directly associated with the selected location
2. **Parent-Child Relationship**: Items in child locations (e.g., if state is selected, show items from all cities in that state)

```sql
-- Example query structure
WHERE location_id = selectedLocationId 
   OR location_id IN (
     SELECT id FROM locations 
     WHERE parent_id = selectedLocationId
   )
```

## Features Implemented

### ✅ **Dynamic Content**
- Content changes based on selected location
- Real-time filtering without page refresh
- Smooth transitions between filtered states

### ✅ **Smart Filtering**
- Hierarchical location filtering (state → cities)
- Fallback to all items when no location selected
- Empty state handling with helpful messages

### ✅ **Enhanced UI**
- Location-specific titles and descriptions
- Filter indicator badges
- Dynamic "View All" links with location context

### ✅ **Performance Optimized**
- Efficient API queries with proper indexing
- Minimal re-renders using React context
- Cached location data

### ✅ **User Feedback**
- Loading states during data fetch
- Empty states with helpful messages
- Clear indication of applied filters

## API Response Examples

### Packages API Response
```json
{
  "success": true,
  "packages": [
    {
      "id": "uuid",
      "name": "Mumbai Heritage Tour",
      "price_per_person": 5000,
      "discount_percentage": 10,
      "discounted_price": 4500,
      "duration_days": 3,
      "destination": {
        "id": "uuid",
        "name": "Mumbai",
        "type": "city",
        "parent": {
          "name": "Maharashtra",
          "type": "state"
        }
      }
    }
  ],
  "total": 1
}
```

### Hotels API Response
```json
{
  "success": true,
  "hotels": [
    {
      "id": "uuid",
      "name": "Grand Mumbai Hotel",
      "price_per_night": 8000,
      "star_rating": 5,
      "average_rating": 4.5,
      "destination": {
        "id": "uuid",
        "name": "Mumbai",
        "type": "city"
      }
    }
  ],
  "total": 1
}
```

### Cars API Response
```json
{
  "success": true,
  "cars": [
    {
      "id": "uuid",
      "name": "Swift Dzire",
      "brand": "Maruti Suzuki",
      "price_per_day": 2500,
      "seating_capacity": 5,
      "location": {
        "id": "uuid",
        "name": "Mumbai",
        "type": "city"
      }
    }
  ],
  "total": 1
}
```

## Integration Points

### 1. Root Layout (`app/layout.js`)
```javascript
<SettingsProvider>
  <LocationProvider>
    {children}
  </LocationProvider>
</SettingsProvider>
```

### 2. Homepage (`app/page.js`)
```javascript
// Conditionally render sections based on settings
{!loading && settings.packages_visible && <PopularPackages />}
{!loading && settings.hotels_visible && <PopularHotels />}
{!loading && settings.cars_visible && <PopularCars />}
```

### 3. Component Usage
```javascript
const { selectedLocation } = useLocation();

useEffect(() => {
  fetchData();
}, [selectedLocation]); // Re-fetch when location changes
```

## Benefits

### 🎯 **Personalized Experience**
- Users see relevant content for their selected location
- Reduces information overload
- Improves booking conversion rates

### 🔍 **Better Discovery**
- Location-specific recommendations
- Hierarchical filtering (state → cities)
- Smart fallbacks for empty results

### ⚡ **Performance**
- Efficient database queries
- Minimal API calls
- Optimized re-rendering

### 📱 **Responsive Design**
- Works seamlessly on all devices
- Consistent experience across components
- Smooth animations and transitions

## Future Enhancements

### Possible Improvements:
1. **Date-Based Filtering**: Filter by availability dates
2. **Price Range Filtering**: Add price filters
3. **Advanced Sorting**: Multiple sorting options
4. **Favorites**: Save favorite locations
5. **Recent Searches**: Remember recent location searches
6. **Geolocation**: Auto-detect user location
7. **Map Integration**: Show results on map
8. **Comparison**: Compare packages/hotels/cars

### Performance Optimizations:
1. **Caching**: Implement Redis caching for popular queries
2. **Pagination**: Add infinite scroll for large result sets
3. **Prefetching**: Preload data for popular locations
4. **CDN**: Cache static assets and images

## Testing

### Test Scenarios:
1. ✅ Select location → Components update with filtered data
2. ✅ Clear location → Components show all data
3. ✅ Select state → Shows items from all cities in state
4. ✅ Select city → Shows items only from that city
5. ✅ Empty results → Shows helpful empty state
6. ✅ API errors → Shows error state with retry option

The location-based filtering system provides a much more personalized and relevant experience for users, helping them discover packages, hotels, and cars specific to their chosen destination.