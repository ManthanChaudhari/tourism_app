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
  X
} from 'lucide-react'

// Mock data - in real app, this would come from API
const mockPackageData = {
  1: {
    id: 1,
    title: 'Bali Adventure Package',
    destination: 'Bali, Indonesia',
    duration: '7 days, 6 nights',
    price: 1299,
    status: 'published',
    bookings: 45,
    description: 'Experience the magic of Bali with our comprehensive adventure package. From ancient temples to pristine beaches, this journey will take you through the heart of Indonesian culture and natural beauty.',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    itinerary: [
      { day: 1, title: 'Arrival in Denpasar', description: 'Airport pickup and transfer to hotel. Welcome dinner with traditional Balinese cuisine.' },
      { day: 2, title: 'Ubud Cultural Tour', description: 'Visit Monkey Forest Sanctuary, Tegallalang Rice Terraces, and traditional art villages.' },
      { day: 3, title: 'Temple Hopping', description: 'Explore Tanah Lot, Uluwatu Temple, and witness the famous Kecak fire dance.' },
      { day: 4, title: 'Adventure Day', description: 'White water rafting in Ayung River and ATV ride through jungle trails.' },
      { day: 5, title: 'Beach Day', description: 'Relax at Seminyak Beach, water sports, and beachside lunch.' },
      { day: 6, title: 'Mount Batur Sunrise', description: 'Early morning hike to catch the sunrise from Mount Batur volcano.' },
      { day: 7, title: 'Departure', description: 'Last-minute shopping and transfer to airport.' }
    ],
    inclusions: [
      'Round-trip airport transfers',
      '6 nights accommodation in 4-star hotels',
      'Daily breakfast and 3 dinners',
      'All entrance fees to attractions',
      'Professional English-speaking guide',
      'Transportation in air-conditioned vehicle'
    ],
    exclusions: [
      'International flights',
      'Travel insurance',
      'Personal expenses',
      'Alcoholic beverages',
      'Tips and gratuities'
    ],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15'
  }
}

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [packageData, setPackageData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const data = mockPackageData[params.id]
      setPackageData(data)
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      // Simulate delete API call
      alert('Package deleted successfully!')
      router.push('/admin/packages')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (!packageData) {
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
              <h1 className="text-3xl font-bold text-gray-900">{packageData.title}</h1>
              <div className="flex items-center space-x-4 mt-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  packageData.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {packageData.status}
                </span>
                <span className="text-gray-500 text-sm">
                  Created {packageData.createdAt}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href={`/admin/packages/${packageData.id}/edit`}
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
              <p className="text-2xl font-bold text-gray-900">${packageData.price}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-blue-600 bg-blue-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{packageData.bookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-purple-600 bg-purple-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-lg font-bold text-gray-900">{packageData.duration}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <MapPin className="h-10 w-10 text-orange-600 bg-orange-100 rounded-xl p-2" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Destination</p>
              <p className="text-lg font-bold text-gray-900">{packageData.destination}</p>
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
              {packageData.images.map((image, index) => (
                <div key={index} className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Eye className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Description</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{packageData.description}</p>
          </div>

          {/* Itinerary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Itinerary</h2>
            <div className="space-y-6">
              {packageData.itinerary.map((day, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 text-lg">Day {day.day}: {day.title}</h3>
                  </div>
                  <p className="text-gray-600">{day.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Inclusions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">What's Included</h2>
            <div className="space-y-3">
              {packageData.inclusions.map((inclusion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{inclusion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">What's Not Included</h2>
            <div className="space-y-3">
              {packageData.exclusions.map((exclusion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <X className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{exclusion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Package Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Package Information</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">{packageData.createdAt}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Updated:</span>
                <span className="font-medium">{packageData.updatedAt}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  packageData.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {packageData.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}