'use client'

import { 
  Package, 
  Calendar, 
  Clock, 
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Eye
} from 'lucide-react'

// Mock data for dashboard
const stats = [
  {
    title: 'Total Packages',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: Package
  },
  {
    title: 'Active Bookings',
    value: '156',
    change: '+8%',
    changeType: 'positive',
    icon: Calendar
  },
  {
    title: 'Pending Bookings',
    value: '12',
    change: '-3%',
    changeType: 'negative',
    icon: Clock
  },
  {
    title: 'Revenue (This Month)',
    value: '$45,230',
    change: '+15%',
    changeType: 'positive',
    icon: DollarSign
  }
]

const popularDestinations = [
  { name: 'Bali, Indonesia', bookings: 45, revenue: '$12,450' },
  { name: 'Paris, France', bookings: 38, revenue: '$18,900' },
  { name: 'Tokyo, Japan', bookings: 32, revenue: '$15,600' },
  { name: 'New York, USA', bookings: 28, revenue: '$14,200' },
  { name: 'Dubai, UAE', bookings: 25, revenue: '$16,800' }
]

const recentBookings = [
  { id: 1, customer: 'John Doe', package: 'Bali Adventure', date: '2024-01-15', status: 'confirmed' },
  { id: 2, customer: 'Jane Smith', package: 'Paris Romance', date: '2024-01-14', status: 'pending' },
  { id: 3, customer: 'Mike Johnson', package: 'Tokyo Explorer', date: '2024-01-13', status: 'confirmed' },
  { id: 4, customer: 'Sarah Wilson', package: 'Dubai Luxury', date: '2024-01-12', status: 'pending' }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-3 flex items-center">
                    <span className={`text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">from last month</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Destinations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-blue-600" />
              Popular Destinations
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {popularDestinations.map((destination, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{destination.name}</p>
                    <p className="text-sm text-gray-500">{destination.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{destination.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-3 text-blue-600" />
              Recent Bookings
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.customer}</p>
                    <p className="text-sm text-gray-500">{booking.package}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900 mb-1">{booking.date}</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <TrendingUp className="h-5 w-5 mr-3 text-blue-600" />
            Revenue Overview
          </h2>
        </div>
        <div className="p-8">
          <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200">
            <div className="text-center">
              <TrendingUp className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Revenue Chart</p>
              <p className="text-sm text-gray-400 mt-2">Chart integration coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}