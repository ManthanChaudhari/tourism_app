'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  MapPin, 
  Building, 
  AlertCircle, 
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewLocationPage() {
  const router = useRouter()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'state',
    parent_id: '',
    is_active: true
  })
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [states, setStates] = useState([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  const [slugGenerated, setSlugGenerated] = useState(true) // Track if slug is auto-generated

  useEffect(() => {
    fetchStates()
  }, [])

  useEffect(() => {
    // Auto-generate slug when name changes (only if slug was auto-generated)
    if (slugGenerated && formData.name) {
      const generatedSlug = generateSlug(formData.name)
      setFormData(prev => ({ ...prev, slug: generatedSlug }))
    }
  }, [formData.name, slugGenerated])

  const fetchStates = async () => {
    try {
      setLoadingStates(true)
      const response = await fetch('/api/admin/locations/states')
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setStates(data.states || [])
        }
      }
    } catch (error) {
      console.error('Error fetching states:', error)
    } finally {
      setLoadingStates(false)
    }
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    // Handle type change
    if (field === 'type') {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        parent_id: value === 'state' ? '' : prev.parent_id
      }))
    }
  }

  const handleSlugChange = (value) => {
    setFormData(prev => ({ ...prev, slug: value }))
    setSlugGenerated(false) // Mark as manually edited
    
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }

    if (!formData.type) {
      newErrors.type = 'Type is required'
    }

    if (formData.type === 'city' && !formData.parent_id) {
      newErrors.parent_id = 'City must have a parent state'
    }

    if (formData.type === 'state' && formData.parent_id) {
      newErrors.parent_id = 'State cannot have a parent'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors below' })
      return
    }

    try {
      setLoading(true)
      setMessage({ type: '', text: '' })
      
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Location created successfully!' })
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/admin/locations')
        }, 1500)
      } else {
        throw new Error(data.error || 'Failed to create location')
      }
    } catch (error) {
      console.error('Error creating location:', error)
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/locations">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Locations
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Location</h1>
            <p className="text-gray-600 mt-1">Create a new state or city</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {message.text && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <Card>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter location name"
                className={errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Slug Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-name"
                className={errors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              />
              <p className="mt-1 text-sm text-gray-500">
                URL-friendly version of the name. Auto-generated but can be customized.
              </p>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.slug}
                </p>
              )}
            </div>

            {/* Type Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="state">State</option>
                <option value="city">City</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type}
                </p>
              )}
            </div>

            {/* Parent Location Field (only for cities) */}
            {formData.type === 'city' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent State <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => handleInputChange('parent_id', e.target.value)}
                  disabled={loadingStates}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                    errors.parent_id ? 'border-red-300' : 'border-gray-300'
                  } ${loadingStates ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  City must belong to a state
                </p>
                {errors.parent_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.parent_id}
                  </p>
                )}
                {loadingStates && (
                  <p className="mt-1 text-sm text-gray-500 flex items-center gap-1">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Loading states...
                  </p>
                )}
              </div>
            )}

            {/* Helper Text for States */}
            {formData.type === 'state' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  State has no parent location
                </p>
              </div>
            )}

            {/* Active Status */}
            <div>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
              <p className="mt-1 text-sm text-gray-500 ml-7">
                Active locations are available for selection in packages and hotels
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <Link href="/admin/locations">
                <Button type="button" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Location
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}