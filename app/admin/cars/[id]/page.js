'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Car, Loader2, AlertCircle } from 'lucide-react';
import CarDetailsModal from '../../../../components/admin/CarDetailsModal';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CarDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (params.id) {
      fetchCar();
    }
  }, [params.id]);

  const fetchCar = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/cars/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Car not found');
        } else if (response.status === 401) {
          throw new Error('Unauthorized - Please log in');
        } else if (response.status === 403) {
          throw new Error('Access denied - Admin privileges required');
        } else {
          throw new Error('Failed to fetch car details');
        }
      }
      
      const data = await response.json();
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    router.push(`/admin/cars/${params.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cars/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/cars?message=Car deleted successfully');
      } else {
        const errorData = await response.json();
        alert('Error deleting car: ' + (errorData.error || 'Failed to delete car'));
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Error deleting car: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/cars')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Car Details</h1>
            <p className="text-gray-600 mt-1">Loading car information...</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading car details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/cars')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Car Details</h1>
            <p className="text-gray-600 mt-1">Error loading car information</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Car</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={fetchCar} className="bg-orange-600 hover:bg-orange-700 text-white">
                Try Again
              </Button>
              <Button 
                onClick={() => router.push('/admin/cars')} 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back to Cars
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/cars')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Car Details</h1>
            <p className="text-gray-600 mt-1">Car not found</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Car Not Found</h3>
            <p className="text-gray-600 mb-4">The requested car could not be found.</p>
            <Button 
              onClick={() => router.push('/admin/cars')} 
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Back to Cars
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push('/admin/cars')}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{car.name}</h1>
            <p className="text-gray-600 mt-1">{car.brand} {car.model} ({car.year})</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={handleEdit}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Car
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Car Details */}
      <div className="bg-white">
        <CarDetailsModal
          car={car}
          onClose={() => {}} // No close function needed for page view
          isPage={true}
        />
      </div>
    </div>
  );
}