'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users,
  Package,
  Building2,
  Car,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

function StatCard({ title, value, icon: Icon, trend, loading, className = "" }) {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className="text-xs text-gray-500 mt-1">{trend}</p>
            )}
          </div>
          <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BookingStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/bookings/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth implementation
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Fetch stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={loading ? "..." : stats?.total_bookings?.toLocaleString() || "0"}
          icon={Calendar}
          trend={loading ? "" : `${stats?.conversion_rates?.booking_confirmation || 0}% confirmed`}
          loading={loading}
        />
        
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : formatCurrency(stats?.total_revenue || 0)}
          icon={DollarSign}
          trend={loading ? "" : `${formatCurrency(stats?.paid_revenue || 0)} collected`}
          loading={loading}
        />
        
        <StatCard
          title="Payment Success"
          value={loading ? "..." : `${stats?.conversion_rates?.payment_success || 0}%`}
          icon={TrendingUp}
          trend={loading ? "" : `${stats?.by_payment_status?.paid || 0} paid bookings`}
          loading={loading}
        />
        
        <StatCard
          title="Active Customers"
          value={loading ? "..." : (stats?.by_booking_status?.confirmed + stats?.by_booking_status?.completed || 0).toLocaleString()}
          icon={Users}
          trend={loading ? "" : "Confirmed + Completed"}
          loading={loading}
        />
      </div>

      {/* Detailed Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Types */}
        <Card className={"p-4"}>
          <CardHeader>
            <CardTitle className="text-lg">Bookings by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Packages</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_type?.package || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Hotels</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_type?.hotel || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Car className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Cars</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_type?.car || 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card className={"p-4"}>
          <CardHeader>
            <CardTitle className="text-lg">Booking Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">Confirmed</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_booking_status?.confirmed || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-medium">Pending</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_booking_status?.pending || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Completed</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_booking_status?.completed || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium">Cancelled</span>
                  </div>
                  <span className="text-2xl font-bold">{stats?.by_booking_status?.cancelled || 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className={"p-4"}>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-600">Packages</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(stats?.revenue_by_type?.package || 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-600">Hotels</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(stats?.revenue_by_type?.hotel || 0)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-600">Cars</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(stats?.revenue_by_type?.car || 0)}
                  </span>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(stats?.total_revenue || 0)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}