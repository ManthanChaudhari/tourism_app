'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, Tag, X } from 'lucide-react'

export default function CategoryDropdown({ 
  value, 
  onChange, 
  placeholder = "Select category...",
  required = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Fetch categories from API
  const fetchCategories = async (search = '') => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: '100',
        search: search,
        status: 'active',
        sortBy: 'display_order',
        sortOrder: 'asc'
      })
      
      const response = await fetch(`/api/admin/categories?${params}`)
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.categories || [])
      } else {
        console.error('Failed to fetch categories:', result.error)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // Load categories on mount and when search changes
  useEffect(() => {
    fetchCategories(searchTerm)
  }, [searchTerm])

  // Find selected category when value changes
  useEffect(() => {
    if (value && categories.length > 0) {
      const category = categories.find(cat => cat.id === value)
      setSelectedCategory(category)
    } else {
      setSelectedCategory(null)
    }
  }, [value, categories])

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

  const handleSelect = (category) => {
    setSelectedCategory(category)
    onChange(category.id)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    setSelectedCategory(null)
    onChange('')
    setSearchTerm('')
  }

  const getCategoryDisplayName = (category) => {
    return category.name
  }

  const getCategoryIcon = (category) => {
    if (category.icon) {
      if (category.icon.startsWith('http')) {
        return (
          <img 
            src={category.icon} 
            alt={category.name}
            className="h-4 w-4 rounded object-cover"
          />
        )
      } else {
        return <span className="text-sm">{category.icon}</span>
      }
    }
    return <Tag className="h-4 w-4 text-gray-400" />
  }

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
            {selectedCategory ? getCategoryIcon(selectedCategory) : <Tag className="h-4 w-4 text-gray-400" />}
            <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
              {selectedCategory ? getCategoryDisplayName(selectedCategory) : placeholder}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCategory && (
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
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No categories found' : 'No categories available'}
              </div>
            ) : (
              <div className="py-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category)}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 ${
                      selectedCategory?.id === category.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      {category.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {category.description}
                        </div>
                      )}
                    </div>
                    {category.is_featured && (
                      <div className="flex-shrink-0">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}