'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Tag,
  Hash,
  FileText,
  Image as ImageIcon,
  Star,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown
} from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'red' }
]

export default function NewCategoryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    banner_image: '',
    display_order: 0,
    is_featured: false,
    status: 'active'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

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
  }

  const handleSubmit = async (status) => {
    // Basic validation
    if (!formData.name.trim()) {
      setSubmitError('Category name is required')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const submitData = {
        ...formData,
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim() || undefined,
        icon: formData.icon.trim() || undefined,
        banner_image: formData.banner_image.trim() || undefined,
        display_order: parseInt(formData.display_order) || 0,
        status: status || formData.status
      }

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create category')
      }

      // Success - redirect to categories list
      router.push('/admin/categories?success=created')
      
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitError(error.message || 'Failed to create category. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/categories"
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
              <p className="text-gray-600 mt-2">Create a new package category</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {submitError && (
              <div className="flex-1 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}
            <button
              onClick={() => handleSubmit('inactive')}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5 mr-2 inline" />
              {isSubmitting ? 'Saving...' : 'Save as Inactive'}
            </button>
            <button
              onClick={() => handleSubmit('active')}
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="h-5 w-5 mr-2 inline" />
              {isSubmitting ? 'Publishing...' : 'Save & Activate'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Tag className="h-4 w-4 inline mr-2" />
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Adventure, Honeymoon, Family"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Hash className="h-4 w-4 inline mr-2" />
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="adventure-packages"
                />
                <p className="text-xs text-gray-500 mt-2">
                  URL-friendly version of the name. Leave empty to auto-generate.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="Describe this category and what types of packages it includes..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <ImageIcon className="h-4 w-4 inline mr-2" />
                    Icon
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="🏔️ or https://example.com/icon.png"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Emoji or image URL for the category icon.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <ArrowUpDown className="h-4 w-4 inline mr-2" />
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => handleInputChange('display_order', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Lower numbers appear first in listings.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <ImageIcon className="h-4 w-4 inline mr-2" />
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.banner_image}
                  onChange={(e) => handleInputChange('banner_image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  placeholder="https://example.com/banner.jpg"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Optional banner image for the category page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
            
            <div className="space-y-6">
              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Featured Category
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Featured categories appear prominently on the homepage
                  </p>
                </div>
                <button
                  onClick={() => handleInputChange('is_featured', !formData.is_featured)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.is_featured ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.is_featured ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          {(formData.name || formData.icon) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {formData.icon && (
                    <div className="flex-shrink-0">
                      {formData.icon.startsWith('http') ? (
                        <img 
                          src={formData.icon} 
                          alt={formData.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-lg">{formData.icon}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {formData.name || 'Category Name'}
                    </div>
                    {formData.description && (
                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {formData.description}
                      </div>
                    )}
                  </div>
                  {formData.is_featured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
