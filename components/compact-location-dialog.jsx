'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Search, MapPin, Loader2 } from 'lucide-react';

export default function CompactLocationDialog({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedLocation = null,
  title = "Select Location" 
}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedLocation, setLocalSelectedLocation] = useState(selectedLocation);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchLocations();
      setLocalSelectedLocation(selectedLocation);
      // Focus search input when dialog opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, selectedLocation]);

  const fetchLocations = async (searchQuery) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        includeInactive: 'false'
      });

      if(searchQuery){
        params.append("search" , searchQuery);
      }

      const response = await fetch(`/api/locations?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      } else {
        console.error('Failed to fetch locations');
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    setLocalSelectedLocation(location);
    // Immediately proceed to next step when location is clicked
    onSelect(location);
  };

  const handleDoneClick = () => {
    if (localSelectedLocation) {
      onSelect(localSelectedLocation);
    } else {
      onClose();
    }
  };

  const getLocationDisplayName = (location) => {
    if (location.type === 'city' && location.parent) {
      return `${location.name}, ${location.parent.name}`;
    }
    return location.name;
  };

  const getLocationCode = (location) => {
    // Generate a simple 2-letter code based on location name
    const words = location.name.split(' ');
    if (words.length > 1) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return location.name.substring(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[70vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search locations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading locations...</span>
            </div>
          ) : locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <MapPin className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No locations found</p>
              <p className="text-sm">Try adjusting your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location)}
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 text-left hover:bg-blue-50 hover:border-blue-200 hover:shadow-sm ${
                    localSelectedLocation?.id === location.id
                      ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-6 bg-gray-100 rounded text-xs font-bold flex items-center justify-center text-gray-600 border">
                      {getLocationCode(location)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {location.name}
                    </p>
                    {location.type === 'city' && location.parent && (
                      <p className="text-xs text-gray-500 truncate">
                        {location.parent.name}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="text-sm text-gray-500">
            {localSelectedLocation ? (
              <span className="text-blue-600 font-medium">
                Selected: {localSelectedLocation.name}
                {localSelectedLocation.type === 'city' && localSelectedLocation.parent && `, ${localSelectedLocation.parent.name}`}
              </span>
            ) : (
              <span>{locations.length} location{locations.length !== 1 ? 's' : ''} available</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDoneClick}
              disabled={!localSelectedLocation}
              className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                localSelectedLocation
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {localSelectedLocation ? 'Continue' : 'Select Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}