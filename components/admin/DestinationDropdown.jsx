'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, MapPin, X } from 'lucide-react'

export default function DestinationDropdown({ 
  value, 
  onChange, 
  placeholder = "Select destination...",
  required = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Fetch locations from API
  const fetchLocations = async (search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '100',
        search: search,
        status: 'active'
      })
      
      const response = await fetch(`/api/admin/locations?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setLocations(result.locations || [])
      } else {
        console.error('Failed to fetch locations:', result.error)
        setLocations([])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  // Load locations on mount and when search changes
  useEffect(() => {
    fetchLocations(searchTerm)
  }, [searchTerm])

  // Find selected location when value changes
  useEffect(() => {
    if (value && locations.length > 0) {
      const location = locations.find(loc => loc.id === value)
      setSelectedLocation(location)
    } else {
      setSelectedLocation(null)
    }
  }, [value, locations])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (location) => {
    setSelectedLocation(location)
    onChange(location.id)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    setSelectedLocation(null)
    onChange('')
    setSearchTerm('')
  }

  const getLocationDisplayName = (location) => {
    if (location.type === 'city' && location.parent) {
      return `${location.name}, ${location.parent.name}`
    }
    return location.name
  }

  const groupedLocations = locations.reduce((acc, location) => {
    if (location.type === 'state') {
      if (!acc.states) acc.states = []
      acc.states.push(location)
    } else if (location.type === 'city') {
      if (!acc.cities) acc.cities = []
      acc.cities.push(location)
    }
    return acc
  }, {})

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Input */}
      <div
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-colors cursor-pointer bg-white ${
          required && !value ? 'border-red-300' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className={selectedLocation ? 'text-gray-900' : 'text-gray-500'}>
              {selectedLocation ? getLocationDisplayName(selectedLocation) : placeholder}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedLocation && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Loading destinations...
              </div>
            ) : locations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No destinations found' : 'No destinations available'}
              </div>
            ) : (
              <div className="py-2">
                {/* States */}
                {groupedLocations.states && groupedLocations.states.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                      States
                    </div>
                    {groupedLocations.states.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => handleSelect(location)}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 ${
                          selectedLocation?.id === location.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{location.name}</div>
                          <div className="text-xs text-gray-500 capitalize">{location.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Cities */}
                {groupedLocations.cities && groupedLocations.cities.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                      Cities
                    </div>
                    {groupedLocations.cities.map((location) => (
                      <button
                        key={location.id}
                        type="button"
                        onClick={() => handleSelect(location)}
                        className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 ${
                          selectedLocation?.id === location.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                        }`}
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{getLocationDisplayName(location)}</div>
                          <div className="text-xs text-gray-500 capitalize">{location.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}