'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Star, ArrowRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useLocation } from '@/lib/contexts/LocationContext';

export default function PopularPackages() {
  const { selectedLocation } = useLocation();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, [selectedLocation]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '6',
        featured: 'true'
      });

      // Add location filter if a location is selected
      if (selectedLocation?.id) {
        params.append('locationId', selectedLocation.id);
      }

      const response = await fetch(`/api/packages?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      } else {
        console.error('Failed to fetch packages');
        setPackages([]);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationDisplayName = (location) => {
    if (!location) return '';
    if (location.type === 'city' && location.parent) {
      return `${location.name}, ${location.parent.name}`;
    }
    return location.name;
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedLocation ? `Packages in ${getLocationDisplayName(selectedLocation)}` : 'Popular Packages'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {selectedLocation 
                ? `Discover amazing travel packages in ${getLocationDisplayName(selectedLocation)}`
                : 'Discover our most loved travel packages'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedLocation ? `Packages in ${getLocationDisplayName(selectedLocation)}` : 'Popular Packages'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {selectedLocation 
                ? `No packages found in ${getLocationDisplayName(selectedLocation)} at the moment.`
                : 'No packages available at the moment.'
              }
            </p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-6">
              {selectedLocation 
                ? 'Try selecting a different location or check back later for new packages.'
                : 'Check back later for exciting travel packages.'
              }
            </p>
            <Link
              href="/packages"
              className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Browse All Packages
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {selectedLocation ? `Packages in ${getLocationDisplayName(selectedLocation)}` : 'Popular Packages'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {selectedLocation 
              ? `Discover amazing travel packages in ${getLocationDisplayName(selectedLocation)}, carefully curated for unforgettable experiences`
              : 'Discover our most loved travel packages, carefully curated for unforgettable experiences'
            }
          </p>
          {selectedLocation && (
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4 mr-2" />
              Filtered by: {getLocationDisplayName(selectedLocation)}
            </div>
          )}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              {/* Package Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={pkg.thumbnail_image || '/placeholder-package.jpg'}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {pkg.is_featured && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                )}
                {pkg.discount_percentage > 0 && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.discount_percentage}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Package Content */}
              <div className="p-6">
                {/* Location */}
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{pkg.destination?.name || 'Multiple Destinations'}</span>
                </div>

                {/* Package Name */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {pkg.name}
                </h3>

                {/* Package Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{pkg.duration_days} Days</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Max {pkg.max_people} People</span>
                  </div>
                  {pkg.average_rating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span>{pkg.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {pkg.discount_percentage > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{pkg.discounted_price?.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ₹{pkg.price_per_person?.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-orange-600">
                        ₹{pkg.price_per_person?.toLocaleString()}
                      </span>
                    )}
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  href={`/packages/${pkg.slug || pkg.id}`}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center group"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href={selectedLocation ? `/packages?location=${selectedLocation.id}` : "/packages"}
            className="inline-flex items-center px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {selectedLocation 
              ? `View All Packages in ${getLocationDisplayName(selectedLocation)}`
              : 'View All Packages'
            }
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}