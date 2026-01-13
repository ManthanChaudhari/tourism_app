'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Create Settings Context
const SettingsContext = createContext();

// Settings Provider Component
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    packages_visible: true,
    hotels_visible: true,
    cars_visible: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/settings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.settings);
      } else {
        throw new Error(data.error || 'Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
      // Keep default settings on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const value = {
    settings,
    loading,
    error,
    refetch: fetchSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext);
  
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  
  return context;
}

// Individual hooks for specific settings
export function usePackagesVisible() {
  const { settings, loading } = useSettings();
  return { visible: settings.packages_visible, loading };
}

export function useHotelsVisible() {
  const { settings, loading } = useSettings();
  return { visible: settings.hotels_visible, loading };
}

export function useCarsVisible() {
  const { settings, loading } = useSettings();
  return { visible: settings.cars_visible, loading };
}