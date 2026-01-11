'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import CarForm from '../../../../components/admin/CarForm';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewCarPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSave = async (carData) => {
    try {
      setSaving(true);
      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(carData),
      });

      if (response.ok) {
        router.push('/admin/cars?message=Car created successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create car');
      }
    } catch (error) {
      console.error('Error creating car:', error);
      alert('Error creating car: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/admin/cars');
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Add New Car</h1>
            <p className="text-gray-600 mt-1">Create a new car for rental management</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="p-6">
          <CarForm
            car={null}
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