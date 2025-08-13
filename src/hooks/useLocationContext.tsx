import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import type { Location, Merchant } from '@/types/api';

interface LocationContextType {
  currentLocation: Location | null;
  currentMerchant: Merchant | null;
  locations: Location[];
  merchants: Merchant[];
  setCurrentLocation: (location: Location) => void;
  loading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const { execute } = useApi();
  const [currentLocation, setCurrentLocationState] = useState<Location | null>(null);
  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [locationsResponse, merchantsResponse] = await Promise.all([
        execute(() => apiService.getLocations()),
        execute(() => apiService.getMerchants())
      ]);

      if (locationsResponse && locationsResponse.code === 200) {
        const locationData = Array.isArray(locationsResponse.data) ? locationsResponse.data : [];
        setLocations(locationData);
        
        // Set default location if none selected
        if (!currentLocation && locationData.length > 0) {
          setCurrentLocationState(locationData[0]);
        }
      }

      if (merchantsResponse && merchantsResponse.code === 200) {
        const merchantData = Array.isArray(merchantsResponse.data) ? merchantsResponse.data : [];
        setMerchants(merchantData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set current location and find corresponding merchant
  const setCurrentLocation = (location: Location) => {
    setCurrentLocationState(location);
    const merchant = merchants.find(m => m.id === location.merchant_id);
    setCurrentMerchant(merchant || null);
    
    // Save to localStorage
    localStorage.setItem('currentLocationId', location.id);
  };

  // Load saved location on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Restore saved location
  useEffect(() => {
    if (locations.length > 0 && !currentLocation) {
      const savedLocationId = localStorage.getItem('currentLocationId');
      if (savedLocationId) {
        const savedLocation = locations.find(l => l.id === savedLocationId);
        if (savedLocation) {
          setCurrentLocation(savedLocation);
          return;
        }
      }
      // Default to first location
      setCurrentLocation(locations[0]);
    }
  }, [locations]);

  // Update merchant when location changes
  useEffect(() => {
    if (currentLocation && merchants.length > 0) {
      const merchant = merchants.find(m => m.id === currentLocation.merchant_id);
      setCurrentMerchant(merchant || null);
    }
  }, [currentLocation, merchants]);

  return (
    <LocationContext.Provider value={{
      currentLocation,
      currentMerchant,
      locations,
      merchants,
      setCurrentLocation,
      loading
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
