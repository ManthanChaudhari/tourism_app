'use client';

import { X, Calendar, MapPin, Users, Fuel, Settings, DollarSign, Shield } from 'lucide-react';

export default function CarDetailsModal({ car, onClose }) {
  const category = car.categories || { name: car.category_id };
  const location = car.locations || { name: car.location_id };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Car Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header with main image and basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img
                src={car.thumbnail_image || '/placeholder-car.jpg'}
                alt={car.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {/* Gallery Images */}
              {car.gallery_images && car.gallery_images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Gallery</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {car.gallery_images.slice(0, 8).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="h-16 w-full object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{car.name}</h3>
                <p className="text-lg text-gray-600">{car.brand} {car.model}</p>
                <div className="flex items-center mt-2">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{car.year}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  car.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {car.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Category</span>
                  </div>
                  <p className="font-medium">{category?.name || 'N/A'}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">Base Location</span>
                  </div>
                  <p className="font-medium">{location?.name || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Users size={20} className="text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Seating</p>
                  <p className="font-medium">{car.seating_capacity} seats</p>
                </div>
              </div>

              <div className="flex items-center">
                <Fuel size={20} className="text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Fuel Type</p>
                  <p className="font-medium capitalize">{car.fuel_type}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Settings size={20} className="text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-medium capitalize">{car.transmission}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full ${car.ac_available ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">AC</p>
                  <p className="font-medium">{car.ac_available ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
            </div>

            {car.luggage_capacity && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Luggage Capacity</p>
                    <p className="font-medium">{car.luggage_capacity}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign size={20} className="mr-2" />
              Pricing Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Price per Day</p>
                <p className="text-2xl font-bold text-blue-600">₹{car.price_per_day}</p>
              </div>

              {car.price_per_hour && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Price per Hour</p>
                  <p className="text-2xl font-bold text-green-600">₹{car.price_per_hour}</p>
                </div>
              )}

              {car.extra_km_price && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Extra KM Price</p>
                  <p className="text-xl font-bold text-orange-600">₹{car.extra_km_price}/km</p>
                </div>
              )}

              {car.driver_charge_per_day && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Driver Charge per Day</p>
                  <p className="text-xl font-bold text-purple-600">₹{car.driver_charge_per_day}</p>
                </div>
              )}

              {car.security_deposit && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 flex items-center">
                    <Shield size={16} className="mr-1" />
                    Security Deposit
                  </p>
                  <p className="text-xl font-bold text-red-600">₹{car.security_deposit}</p>
                </div>
              )}

              {car.min_booking_hours && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Min Booking Hours</p>
                  <p className="text-xl font-bold text-indigo-600">{car.min_booking_hours}h</p>
                </div>
              )}

              {car.min_booking_days && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Min Booking Days</p>
                  <p className="text-xl font-bold text-teal-600">{car.min_booking_days} days</p>
                </div>
              )}
            </div>
          </div>

          {/* Policies and Options */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Policies & Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {car.fuel_policy && (
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600 font-medium">Fuel Policy</p>
                    <p className="text-gray-900 capitalize">{car.fuel_policy.replace('-', ' ')}</p>
                  </div>
                )}

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Rental Options</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${car.allow_one_way ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">One-Way Rentals {car.allow_one_way ? 'Allowed' : 'Not Allowed'}</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${car.driver_included ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className="text-sm">Driver {car.driver_included ? 'Included' : 'Not Included'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {car.cancellation_policy && (
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium mb-2">Cancellation Policy</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{car.cancellation_policy}</p>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Record Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {car.created_at && (
                <div>
                  <span className="font-medium">Created:</span> {new Date(car.created_at).toLocaleString()}
                </div>
              )}
              {car.updated_at && (
                <div>
                  <span className="font-medium">Last Updated:</span> {new Date(car.updated_at).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}