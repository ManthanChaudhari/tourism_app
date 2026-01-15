'use client';

import { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [passengers, setPassengers] = useState({ adults: 1, children: 0 });

  const updateLocation = (location) => {
    setSelectedLocation(location);
  };

  const updateDate = (date) => {
    setSelectedDate(date);
  };

  const updatePassengers = (passengerData) => {
    setPassengers(passengerData);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setSelectedDate(null);
    setPassengers({ adults: 1, children: 0 });
  };

  const getLocationDisplayName = (location) => {
    if (!location) return '';
    if (location.type === 'city' && location.parent) {
      return `${location.name}, ${location.parent.name}`;
    }
    return location.name;
  };

  const value = {
    selectedLocation,
    selectedDate,
    passengers,
    updateLocation,
    updateDate,
    updatePassengers,
    clearSelection,
    getLocationDisplayName
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}