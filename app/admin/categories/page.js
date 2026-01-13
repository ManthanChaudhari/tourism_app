'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  StarOff,
  Tag,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Sortable Row Component
function SortableRow({ category, onDelete, deleteLoading, getStatusBadge, reorderLoading }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const isReordering = reorderLoading === category.id

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-gray-50 transition-colors ${isDragging ? 'bg-gray-100' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div 
          {...attributes} 
          {...listeners}
          className={`p-1 rounded inline-flex relative ${
            isReordering 
              ? 'cursor-wait' 
              : 'cursor-grab active:cursor-grabbing hover:bg-gray-200'
          }`}
        >
          {isReordering ? (
            <RefreshCw className="h-4 w-4 text-orange-600 animate-spin" />
          ) : (
            <GripVertical className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          {category.icon && (
            <div className="flex-shrink-0">
              {category.icon.startsWith('http') ? (
                <img 
                  src={category.icon} 
                  alt={category.name}
                  className="h-8 w-8 rounded object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-orange-100 rounded flex items-center justify-center">
                  <span className="text-sm">{category.icon}</span>
                </div>
              )}
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {category.name}
            </div>
            <div className="text-sm text-gray-500">
              /{category.slug}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs truncate">
          {category.description || '-'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {category.is_featured ? (
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
        ) : (
          <StarOff className="h-4 w-4 text-gray-400" />
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(category.status)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(category.created_at).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/categories/${category.id}`}>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </Link>
          <Link href={`/admin/categories/${category.id}/edit`}>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </Link>
          <Button
            onClick={() => onDelete(category.id, category.name)}
            disabled={deleteLoading === category.id}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {deleteLoading === category.id ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </td>
    </tr>
  )
}

export default function CategoriesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)
  const [reorderLoading, setReorderLoading] = useState(null) // Changed to track specific category ID
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [featuredFilter, setFeaturedFilter] = useState(searchParams.get('featured') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'position')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'asc')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [pagination, setPagination] = useState(null)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter,
        featured: featuredFilter === 'all' ? '' : featuredFilter,
        sortBy,
        sortOrder
      })

      const response = await fetch(`/api/admin/categories?${params}`)
      const result = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in')
        } else if (response.status === 403) {
          throw new Error('Access denied - Admin privileges required')
        } else {
          throw new Error(result.error || 'Failed to fetch categories')
        }
      }

      setCategories(result.categories || [])
      setPagination(result.pagination)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, featuredFilter, sortBy, sortOrder])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (featuredFilter !== 'all') params.set('featured', featuredFilter)
    if (sortBy !== 'position') params.set('sortBy', sortBy)
    if (sortOrder !== 'asc') params.set('sortOrder', sortOrder)
    if (currentPage !== 1) params.set('page', currentPage.toString())
    
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/admin/categories${newUrl}`, { scroll: false })
  }, [searchTerm, statusFilter, featuredFilter, sortBy, sortOrder, currentPage, router])

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = categories.findIndex((item) => item.id === active.id)
      const newIndex = categories.findIndex((item) => item.id === over.id)

      const newCategories = arrayMove(categories, oldIndex, newIndex)
      setCategories(newCategories)

      // Update order in backend - track the specific category being moved
      setReorderLoading(active.id)
      try {
        const categoryIds = newCategories.map(cat => cat.id)
        const response = await fetch('/api/admin/categories/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ categoryIds }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update category order')
        }

        setMessage({ 
          type: 'success', 
          text: 'Category order updated successfully' 
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } catch (err) {
        console.error('Reorder error:', err)
        setMessage({ 
          type: 'error', 
          text: `Failed to update order: ${err.message}` 
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 5000)
        // Revert the change
        fetchCategories()
      } finally {
        setReorderLoading(null)
      }
    }
  }

  const handleDelete = async (categoryId, categoryName) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(categoryId)
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete category')
      }

      // Refresh the categories list
      fetchCategories()
      setMessage({ 
        type: 'success', 
        text: 'Category deleted successfully' 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      console.error('Delete error:', err)
      setMessage({ 
        type: 'error', 
        text: `Failed to delete category: ${err.message}` 
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setDeleteLoading(null)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCategories()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setFeaturedFilter('all')
    setCurrentPage(1)
    fetchCategories()
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || featuredFilter !== 'all'

  const itemsPerPageOptions = [10, 20, 50, 100]

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setCurrentPage(1)
  }

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    }
    
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.inactive}`}>
        {status === 'active' ? 'Active' : 'Inactive'}
      </span>
    )
  }

  // Check if drag and drop should be enabled
  const isDragEnabled = sortBy === 'position' && sortOrder === 'asc' && !hasActiveFilters && pagination?.totalPages === 1

  if (loading && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Manage package categories</p>
          </div>
        </div>
        
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-1">
            Manage package categories and their ordering.
            {pagination && (
              <span className="ml-2 text-sm">
                ({pagination.totalItems} total categories)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchCategories}
            disabled={loading}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link href="/admin/categories/new">
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </Link>
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

      {/* Drag and Drop Info */}
      {isDragEnabled && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Drag and drop enabled! Use the grip handles to reorder categories.
            </span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
                Search
              </Button>
            </form>
            
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(parseInt(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    {itemsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option} per page
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                    <select
                      value={featuredFilter}
                      onChange={(e) => {
                        setFeaturedFilter(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="all">All Categories</option>
                      <option value="true">Featured Only</option>
                      <option value="false">Non-Featured</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-')
                        setSortBy(field)
                        setSortOrder(order)
                        setCurrentPage(1)
                      }}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="position-asc">Position (A-Z)</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="created_at-desc">Newest First</option>
                      <option value="created_at-asc">Oldest First</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      {pagination && (
                        <span>
                          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} categories
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      {error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Categories</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchCategories} className="bg-orange-600 hover:bg-orange-700 text-white">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : categories.length === 0 && !loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? "No categories match your current filters. Try adjusting your search criteria."
                : "No categories have been added yet. Add your first category to get started."
              }
            </p>
            <div className="flex items-center justify-center gap-3">
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  Clear Filters
                </Button>
              )}
              <Link href="/admin/categories/new">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {isDragEnabled ? 'Order' : 'Position'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isDragEnabled ? (
                    <DndContext 
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext 
                        items={categories.map(cat => cat.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {categories.map((category) => (
                          <SortableRow
                            key={category.id}
                            category={category}
                            onDelete={handleDelete}
                            deleteLoading={deleteLoading}
                            getStatusBadge={getStatusBadge}
                            reorderLoading={reorderLoading}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    categories.map((category, index) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {((currentPage - 1) * itemsPerPage) + index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            {category.icon && (
                              <div className="flex-shrink-0">
                                {category.icon.startsWith('http') ? (
                                  <img 
                                    src={category.icon} 
                                    alt={category.name}
                                    className="h-8 w-8 rounded object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 bg-orange-100 rounded flex items-center justify-center">
                                    <span className="text-sm">{category.icon}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                /{category.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {category.description || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.is_featured ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4 text-gray-400" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(category.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(category.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/admin/categories/${category.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link href={`/admin/categories/${category.id}/edit`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDelete(category.id, category.name)}
                              disabled={deleteLoading === category.id}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              {deleteLoading === category.id ? 'Deleting...' : 'Delete'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, Math.min(
                  pagination.totalPages - 4,
                  Math.max(1, currentPage - 2)
                )) + i;
                
                if (pageNum > pagination.totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNum)}
                    disabled={loading}
                    className={pageNum === currentPage 
                      ? "bg-orange-600 text-white hover:bg-orange-700" 
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages || loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}