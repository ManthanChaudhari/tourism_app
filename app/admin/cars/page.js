'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import CarForm from '../../../components/admin/CarForm';
import CarDetailsModal from '../../../components/admin/CarDetailsModal';
import CategoryDropdown from '../../../components/admin/CategoryDropdown';
import DestinationDropdown from '../../../components/admin/DestinationDropdown';

export default function CarsManagement() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/admin/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data || []);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]); // Ensure it's always an array
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
      } else {
        alert('Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleView = (car) => {
    setSelectedCar(car);
    setShowDetails(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCar(null);
    fetchCars();
  };

  const filteredCars = (cars || []).filter(car => {
    const matchesSearch = car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || car.category_id === filterCategory;
    const matchesLocation = !filterLocation || car.location_id === filterLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          Add New Car
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <CategoryDropdown
            value={filterCategory}
            onChange={setFilterCategory}
            placeholder="All Categories"
            required={false}
          />

          <DestinationDropdown
            value={filterLocation}
            onChange={setFilterLocation}
            placeholder="All Locations"
            required={false}
          />
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={car.thumbnail_image || '/placeholder-car.jpg'}
                          alt={car.name}
                        />
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
                      {car.driver_included && <span className="text-blue-600">• Driver</span>}
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      car.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {car.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(car)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(car)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No cars found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Car Form Modal */}
      {showForm && (
        <CarForm
          car={editingCar}
          onClose={handleFormClose}
        />
      )}

      {/* Car Details Modal */}
      {showDetails && selectedCar && (
        <CarDetailsModal
          car={selectedCar}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}