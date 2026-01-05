'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users,
  Eye,
  Clock,
  Check,
  X,
  Loader2
} from 'lucide-react'

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchPackageData()
    
    // Check for success message from URL params
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'updated') {
      setSuccessMessage('Package updated successfully!')
      // Clear the URL parameter
      window.history.replaceState({}, '', window.location.pathname)
      // Clear message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    }
  }, [params.id])

  const fetchPackageData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/packages/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Package not found')
        } else {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to fetch package')
        }
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setPackageData(data.package)
      } else {
        setError(data.error || 'Failed to fetch package')
      }
    } catch (error) {
      console.error('Error fetching package:', error)
      setError('Failed to fetch package data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/packages/${params.id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          router.push('/admin/packages?success=deleted')
        } else {
          const errorData = await response.json()
          alert(errorData.error || 'Failed to delete package')
        }
      } catch (error) {
        console.error('Error deleting package:', error)
        alert('Failed to delete package')
      }
    }
  }

  // Format package data for display
  const formatPackageData = (pkg) => {
    if (!pkg) return null
    
    return {
      ...pkg,
      duration: `${pkg.days} days, ${pkg.nights} nights`,
      price: pkg.price_per_person,
      images: pkg.gallery_image_urls && pkg.gallery_image_urls.length > 0 
        ? pkg.gallery_image_urls 
        : pkg.thumbnail_image_url 
          ? [pkg.thumbnail_image_url]
          : ['/api/placeholder/600/400'],
      createdAt: new Date(pkg.created_at).toLocaleDateString(),
      updatedAt: new Date(pkg.updated_at || pkg.created_at).toLocaleDateString(),
      // TODO: Replace with actual bookings count when bookings table is implemented
      bookings: 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error === 'Package not found' ? 'Package Not Found' : 'Error Loading Package'}
        </h2>
        <p className="text-gray-600 mb-6">
          {error === 'Package not found' 
            ? "The package you're looking for doesn't exist." 
            : error
          }
        </p>
        <div className="space-x-4">
          <Link
            href="/admin/packages"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Packages
          </Link>
          {error !== 'Package not found' && (
            <button
              onClick={fetchPackageData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    )
  }

  const formattedPackage = formatPackageData(packageData)

  if (!formattedPackage) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
        <p className="text-gray-600 mb-6">The package you're looking for doesn't exist.</p>
        <Link
          href="/admin/packages"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Packages
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/packages"
              className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{formattedPackage.title}</h1>
              <div className="flex items-center space-x-4 mt-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  formattedPackage.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {formattedPackage.status}
                </span>
                <span className="text-gray-500 text-sm">
                  Created {formattedPackage.createdAt}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/admin/packages/${formattedPackage.id}/edit`}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Edit className="h-5 w-5 mr-2 inline" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <Trash2 className="h-5 w-5 mr-2 inline" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-green-600 bg-green-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Price</p>
              <p className="text-2xl font-bold text-gray-900">${formattedPackage.price?.toLocaleString() || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-blue-600 bg-blue-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{formattedPackage.bookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-purple-600 bg-purple-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-lg font-bold text-gray-900">{formattedPackage.duration}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <MapPin className="h-10 w-10 text-orange-600 bg-orange-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Destination</p>
              <p className="text-lg font-bold text-gray-900">{formattedPackage.destination}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Package Images */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Package Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formattedPackage.images.slice(0, 3).map((imageUrl, index) => (
                <div key={index} className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl overflow-hidden">
                  {imageUrl && imageUrl !== '/api/placeholder/600/400' ? (
                    <img 
                      src={imageUrl} 
                      alt={`Package image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full flex items-center justify-center" style={{ display: imageUrl && imageUrl !== '/api/placeholder/600/400' ? 'none' : 'flex' }}>
                    <Eye className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              {formattedPackage.description || 'No description available.'}
            </p>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Itinerary</h2>
            <div className="space-y-6">
              {formattedPackage.itinerary && formattedPackage.itinerary.length > 0 ? (
                formattedPackage.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900 text-lg">Day {day.day}: {day.title}</h3>
                    </div>
                    <p className="text-gray-600">{day.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No itinerary available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Inclusions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">What's Included</h2>
            <div className="space-y-3">
              {formattedPackage.inclusions && formattedPackage.inclusions.length > 0 ? (
                formattedPackage.inclusions.map((inclusion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{inclusion}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No inclusions specified.</p>
              )}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">What's Not Included</h2>
            <div className="space-y-3">
              {formattedPackage.exclusions && formattedPackage.exclusions.length > 0 ? (
                formattedPackage.exclusions.map((exclusion, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{exclusion}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No exclusions specified.</p>
              )}
            </div>
          </div>

          {/* Package Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Package Information</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{formattedPackage.createdAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{formattedPackage.updatedAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{formattedPackage.category || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  formattedPackage.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {formattedPackage.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}