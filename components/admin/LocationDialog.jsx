'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Save, Loader2 } from 'lucide-react'

export default function LocationDialog({ 
  isOpen, 
  onClose, 
  onSuccess, 
  location = null, // null for add, location object for edit
  mode = 'add' // 'add' or 'edit'
}) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'state',
    parent_id: '',
    is_active: true
  })
  
  const [states, setStates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [loadingStates, setLoadingStates] = useState(false)

  // Load form data when location changes (for edit mode)
  useEffect(() => {
    if (location && mode === 'edit') {
      setFormData({
        name: location.name || '',
        slug: location.slug || '',
        type: location.type || 'state',
        parent_id: location.parent?.id || '',
        is_active: location.is_active !== undefined ? location.is_active : true
      })
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        slug: '',
        type: 'state',
        parent_id: '',
        is_active: true
      })
    }
  }, [location, mode, isOpen])

  // Load states when dialog opens and type is city
  useEffect(() => {
    if (isOpen && formData.type === 'city') {
      fetchStates()
    }
  }, [isOpen, formData.type])

  const fetchStates = async () => {
    try {
      setLoadingStates(true)
      const response = await fetch('/api/admin/locations/states')
      const result = await response.json()
      
      if (result.success) {
        setStates(result.states || [])
      } else {
        console.error('Failed to fetch states:', result.error)
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    } finally {
      setLoadingStates(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from name
    if (field === 'name' && !formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      setFormData(prev => ({
        ...prev,
        slug: autoSlug
      }))
    }

    // Clear parent when type changes to state
    if (field === 'type' && value === 'state') {
      setFormData(prev => ({
        ...prev,
        parent_id: ''
      }))
    }

    // Load states when type changes to city
    if (field === 'type' && value === 'city' && states.length === 0) {
      fetchStates()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (formData.type === 'city' && !formData.parent_id) {
      setError('Parent state is required for cities')
      return
    }

    if (formData.type === 'state' && formData.parent_id) {
      setError('States cannot have a parent')
      return
    }

    setLoading(true)

    try {
      const submitData = {
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        type: formData.type,
        parent_id: formData.type === 'city' ? formData.parent_id : null,
        is_active: formData.is_active
      }

      const url = mode === 'edit' 
        ? `/api/admin/locations/${location.id}`
        : '/api/admin/locations'
      
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Failed to ${mode} location`)
      }

      // Success
      onSuccess(result.location, mode)
      onClose()
      
    } catch (error) {
      console.error(`${mode} error:`, error)
      setError(error.message || `Failed to ${mode} location. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
      setError('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Destination' : 'Add New Destination'}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'edit' ? 'Update destination information' : 'Create a new destination'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="e.g., Maharashtra, Mumbai"
                required
                disabled={loading}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="maharashtra, mumbai"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to auto-generate from name
              </p>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                required
                disabled={loading}
              >
                <option value="state">State</option>
                <option value="city">City</option>
              </select>
            </div>

            {/* Parent State (only for cities) */}
            {formData.type === 'city' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent State *
                </label>
                {loadingStates ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                    <span className="ml-2 text-sm text-gray-600">Loading states...</span>
                  </div>
                ) : (
                  <select
                    value={formData.parent_id}
                    onChange={(e) => handleInputChange('parent_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                    disabled={loading}
                  >
                    <option value="">Select a state</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="true"
                    checked={formData.is_active === true}
                    onChange={() => handleInputChange('is_active', true)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="false"
                    checked={formData.is_active === false}
                    onChange={() => handleInputChange('is_active', false)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    disabled={loading}
                  />
                  <span className="ml-2 text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === 'edit' ? 'Update Destination' : 'Create Destination'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}