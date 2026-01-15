'use client';

import { useState, useEffect } from 'react';
import { Save, Settings, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    packages_visible: true,
    hotels_visible: true,
    cars_visible: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || {
          packages_visible: true,
          hotels_visible: true,
          cars_visible: true
        });
      } else {
        throw new Error('Failed to fetch settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const sectionSettings = [
    {
      key: 'packages_visible',
      title: 'Packages Section',
      description: 'Show or hide the packages section on the website',
      icon: '📦'
    },
    {
      key: 'hotels_visible',
      title: 'Hotels Section',
      description: 'Show or hide the hotels section on the website',
      icon: '🏨'
    },
    {
      key: 'cars_visible',
      title: 'Cars Section',
      description: 'Show or hide the cars section on the website',
      icon: '🚗'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-600 mt-1">Loading settings...</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-gray-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Website Settings</h1>
            <p className="text-gray-600 mt-1">Control the visibility of different sections on your website</p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Section Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {sectionSettings.map((section) => (
            <div key={section.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{section.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${
                  settings[section.key] ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {settings[section.key] ? 'Visible' : 'Hidden'}
                </span>
                
                <button
                  onClick={() => handleToggle(section.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings[section.key] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings[section.key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                
                {settings[section.key] ? (
                  <Eye className="h-5 w-5 text-green-600" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-4">
            This is how the sections will appear on your website:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sectionSettings.map((section) => (
              <div
                key={section.key}
                className={`p-4 border rounded-lg text-center transition-all ${
                  settings[section.key]
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-2xl mb-2">{section.icon}</div>
                <h4 className="font-medium text-gray-900">{section.title}</h4>
                <p className={`text-xs mt-1 ${
                  settings[section.key] ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {settings[section.key] ? 'Visible to users' : 'Hidden from users'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}