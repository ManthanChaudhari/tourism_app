'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Loader2, AlertCircle } from 'lucide-react';
import CarForm from '../../../../../components/admin/CarForm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSave = async (carData) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/admin/cars/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (response.ok) {
        router.push(`/admin/cars/${params.id}?message=Car updated successfully`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update car');
      }
    } catch (error) {
      console.error('Error updating car:', error);
      alert('Error updating car: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push(`/admin/cars/${params.id}`);
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
            <p className="text-gray-600 mt-1">Car not found</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
            onClick={() => router.push(`/admin/cars/${params.id}`)}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Details
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
            <p className="text-gray-600 mt-1">{car.name} - {car.brand} {car.model}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <CarForm
            car={car}
            onSave={handleSave}
            onCancel={handleCancel}
            saving={saving}
            isPage={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}