'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, RefreshCw, AlertCircle, CheckCircle, Car, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryDropdown from '../../../components/admin/CategoryDropdown';
import DestinationDropdown from '../../../components/admin/DestinationDropdown';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation"


export default function CarsManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Check for success message from URL params
  useEffect(() => {
    const messageParam = searchParams.get('message');
    if (messageParam) {
      setMessage({ type: 'success', text: messageParam });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      // Clean up URL
      router.replace('/admin/cars');
    }
  }, [searchParams, router]);

  useEffect(() => {
    fetchCars();
  }, [currentPage, itemsPerPage]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy: 'created_at',
        sortOrder: 'desc'
      });
      
      if (searchTerm) params.set('search', searchTerm);
      if (filterCategory) params.set('category', filterCategory);
      if (filterLocation) params.set('location', filterLocation);
      
      const response = await fetch(`/api/admin/cars?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized - Please log in');
        } else if (response.status === 403) {
          throw new Error('Access denied - Admin privileges required');
        } else {
          throw new Error('Failed to fetch cars');
        }
      }
      
      const data = await response.json();
      setCars(data || []);
      
      // Calculate pagination (since API doesn't return pagination yet)
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      setPagination({
        totalItems,
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      });
    } catch (error) {
      console.error('Error fetching cars:', error);
      setError(error.message);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await fetch(`/api/admin/cars/${carId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCars(cars.filter(car => car.id !== carId));
        setMessage({ 
          type: 'success', 
          text: 'Car deleted successfully' 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const errorData = await response.json();
        setMessage({ 
          type: 'error', 
          text: errorData.error || 'Failed to delete car' 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      setMessage({ 
        type: 'error', 
        text: 'Error deleting car' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleEdit = (car) => {
    router.push(`/admin/cars/${car.id}/edit`);
  };

  const handleView = (car) => {
    router.push(`/admin/cars/${car.id}`);
  };

  const handleFormClose = () => {
    // This function is no longer needed since we're using pages
    fetchCars();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCars();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterLocation('');
    setCurrentPage(1);
    fetchCars();
  };

  const hasActiveFilters = searchTerm || filterCategory || filterLocation;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const itemsPerPageOptions = [10, 20, 50, 100];

  const filteredCars = (cars || []).filter(car => {
    const matchesSearch = car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || car.category_id === filterCategory;
    const matchesLocation = !filterLocation || car.location_id === filterLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading && cars.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
            <p className="text-gray-600 mt-1">Manage cars and rental inventory</p>
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Car Management</h1>
          <p className="text-gray-600 mt-1">
            Manage cars, pricing, and rental policies.
            {pagination.totalItems > 0 && (
              <span className="ml-2 text-sm">
                ({pagination.totalItems} total cars)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={fetchCars}
            disabled={loading}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => router.push('/admin/cars/new')}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Car
          </Button>
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
                  placeholder="Search cars..."
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
                      setItemsPerPage(parseInt(e.target.value));
                      setCurrentPage(1);
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <CategoryDropdown
                      value={filterCategory}
                      onChange={setFilterCategory}
                      placeholder="All Categories"
                      required={false}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <DestinationDropdown
                      value={filterLocation}
                      onChange={setFilterLocation}
                      placeholder="All Locations"
                      required={false}
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      {pagination && (
                        <span>
                          Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} cars
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

      {/* Cars Table */}
      {error ? (
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Cars</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchCars} className="bg-orange-600 hover:bg-orange-700 text-white">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : cars.length === 0 && !loading ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Cars Found</h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters 
                ? "No cars match your current filters. Try adjusting your search criteria."
                : "No cars have been added yet. Add your first car to get started."
              }
            </p>
            <div className="flex items-center justify-center gap-3">
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                  Clear Filters
                </Button>
              )}
              <Button onClick={() => router.push('/admin/cars/new')} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Car
              </Button>
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
                      Car Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category & Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specifications
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pricing
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {car.thumbnail_image ? (
                              <img
                                className="h-12 w-12 rounded-lg object-cover"
                                src={car.thumbnail_image}
                                alt={car.name}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Car className="h-6 w-6 text-orange-600" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{car.name}</div>
                            <div className="text-sm text-gray-500">{car.brand} {car.model}</div>
                            <div className="text-sm text-gray-500">{car.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {car.categories?.name || car.category_id || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {car.locations?.name || car.location_id || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{car.seating_capacity} seats</div>
                        <div>{car.fuel_type} • {car.transmission}</div>
                        <div className="flex items-center space-x-2">
                          <span>{car.ac_available ? 'AC' : 'Non-AC'}</span>
                          {car.driver_included && <span className="text-orange-600">• Driver</span>}
                          {car.allow_one_way && <span className="text-green-600">• One-way</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>₹{car.price_per_day}/day</div>
                        {car.price_per_hour && <div>₹{car.price_per_hour}/hour</div>}
                        {(car.min_booking_hours || car.min_booking_days) && (
                          <div className="text-xs text-gray-500">
                            Min: {car.min_booking_hours ? `${car.min_booking_hours}h` : ''} 
                            {car.min_booking_days ? `${car.min_booking_days}d` : ''}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          car.is_active 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {car.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleView(car)}
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            onClick={() => handleEdit(car)}
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(car.id)}
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
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
  );
}