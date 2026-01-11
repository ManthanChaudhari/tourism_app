'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Tag,
  Hash,
  FileText,
  Image as ImageIcon,
  Star,
  StarOff,
  Calendar,
  Eye,
  Package
} from 'lucide-react'

export default function CategoryViewPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${params.id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch category')
        }

        setCategory(result.category)
      } catch (error) {
        console.error('Fetch error:', error)
        setError(error.message || 'Failed to load category data')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCategory()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(true)
    try {
      const response = await fetch(`/api/admin/categories/${params.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete category')
      }

      // Success - redirect to categories list
      router.push('/admin/categories?success=deleted')
      
    } catch (error) {
      console.error('Delete error:', error)
      alert(`Failed to delete category: ${error.message}`)
    } finally {
      setDeleteLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    }
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full border ${styles[status] || styles.inactive}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          href="/admin/categories"
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Link>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-4">Category not found</p>
        <Link
          href="/admin/categories"
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Link>
      </div>
    )
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
            <div className="flex items-center space-x-4">
              {category.icon && (
                <div className="flex-shrink-0">
                  {category.icon.startsWith('http') ? (
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                  )}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                <p className="text-gray-600 mt-2">Category Details</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/admin/categories/${category.id}/edit`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm flex items-center space-x-2"
            >
              <Edit className="h-5 w-5" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Trash2 className="h-5 w-5" />
              <span>{deleteLoading ? 'Deleting...' : 'Delete'}</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag className="h-4 w-4 inline mr-2" />
                    Category Name
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {category.name}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Hash className="h-4 w-4 inline mr-2" />
                    URL Slug
                  </label>
                  <div className="text-lg text-gray-900 font-mono">
                    /{category.slug}
                  </div>
                </div>
              </div>

              {category.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    Description
                  </label>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {category.description}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    {category.display_order}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Category
                  </label>
                  <div className="flex items-center space-x-2">
                    {category.is_featured ? (
                      <>
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                        <span className="text-lg font-medium text-gray-900">Yes</span>
                      </>
                    ) : (
                      <>
                        <StarOff className="h-5 w-5 text-gray-400" />
                        <span className="text-lg text-gray-600">No</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Image */}
          {category.banner_image && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Banner Image</h2>
              
              <div className="aspect-video w-full max-w-2xl bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={category.banner_image} 
                  alt={`${category.name} banner`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ display: 'none' }}>
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Failed to load image</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Status & Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Status & Metadata</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                {getStatusBadge(category.status)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Created
                </label>
                <div className="text-sm text-gray-900">
                  {new Date(category.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Last Updated
                </label>
                <div className="text-sm text-gray-900">
                  {new Date(category.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Icon Preview */}
          {category.icon && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Icon</h2>
              
              <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                {category.icon.startsWith('http') ? (
                  <img 
                    src={category.icon} 
                    alt={category.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-4xl">{category.icon}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                href={`/admin/categories/${category.id}/edit`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Category
              </Link>
              
              <Link
                href={`/admin/packages?category=${category.name.toLowerCase()}`}
                className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Package className="h-4 w-4 mr-2" />
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}