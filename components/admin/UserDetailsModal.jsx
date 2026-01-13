'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserDetailsModal({ userId, isOpen, onClose, onRoleUpdate }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetails()
    }
  }, [isOpen, userId])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/admin/users/${userId}/role`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details')
      }

      const data = await response.json()
      
      if (data.success) {
        setUser(data.profile)
      } else {
        throw new Error(data.error || 'Failed to fetch user details')
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (newRole) => {
    try {
      setUpdating(true)
      
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()
      
      if (data.success) {
        setUser({ ...user, role: newRole })
        onRoleUpdate?.(userId, newRole)
      } else {
        throw new Error(data.error || 'Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      setError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchUserDetails} className="bg-orange-600 hover:bg-orange-700 text-white">
                Try Again
              </Button>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="text-center">
                <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-semibold text-orange-600">
                    {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : 'No name provided'
                  }
                </h4>
                <p className="text-gray-600">{user.email}</p>
              </div>

              {/* Role Badge */}
              <div className="text-center">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(user.role)}`}>
                  {user.role === 'admin' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {user.role}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Joined:</span>
                  <span className="text-gray-900">{formatDate(user.created_at)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="text-gray-900">{formatDate(user.updated_at)}</span>
                </div>
              </div>

              {/* Role Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h5 className="text-sm font-medium text-gray-900 mb-3">Role Management</h5>
                <div className="flex gap-2">
                  {user.role === 'user' ? (
                    <Button
                      onClick={() => handleRoleChange('admin')}
                      disabled={updating}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      {updating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Promote to Admin
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleRoleChange('user')}
                      disabled={updating}
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      {updating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        <>
                          <User className="h-4 w-4 mr-2" />
                          Demote to User
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}