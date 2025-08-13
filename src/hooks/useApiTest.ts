import { useState } from 'react';
import { apiService } from '@/services/api';

interface TestResult {
  health: boolean | null;
  terminals: boolean | null;
  locations: boolean | null;
  vehicleTypes: boolean | null;
  loading: boolean;
  mode: 'direct' | 'proxy' | null;
  vehicleTypeCount?: number;
  locationCount?: number;
}

export function useApiTest() {
  const [testResult, setTestResult] = useState<TestResult>({
    health: null,
    terminals: null,
    locations: null,
    vehicleTypes: null,
    loading: false,
    mode: null
  });

  const testApiConnection = async () => {
    setTestResult(prev => ({ ...prev, loading: true }));

    try {
      // Test health endpoint
      const healthResponse = await apiService.healthCheck();
      console.log('Health check response:', healthResponse);
      
      // Test terminals endpoint
      const terminalsResponse = await apiService.getParkingTerminals();
      console.log('Terminals response:', terminalsResponse);

      // Test locations endpoint
      const locationsResponse = await apiService.getLocations();
      console.log('Locations response:', locationsResponse);

      // Test vehicle types endpoint
      const vehicleTypesResponse = await apiService.getParkingVehicleTypes();
      console.log('Vehicle types response:', vehicleTypesResponse);

      setTestResult({
        health: true,
        terminals: true,
        locations: true,
        vehicleTypes: true,
        vehicleTypeCount: Array.isArray(vehicleTypesResponse?.data) ? vehicleTypesResponse.data.length : 0,
        locationCount: Array.isArray(locationsResponse?.data) ? locationsResponse.data.length : 0,
        loading: false,
        mode: 'direct'
      });
    } catch (error) {
      console.error('API Test failed:', error);
      setTestResult({
        health: false,
        terminals: false,
        locations: false,
        vehicleTypes: false,
        vehicleTypeCount: 0,
        locationCount: 0,
        loading: false,
        mode: null
      });
    }
  };

  const resetTest = () => {
    setTestResult({
      health: null,
      terminals: null,
      locations: null,
      vehicleTypes: null,
      loading: false,
      mode: null
    });
  };

  // Computed values
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.101.100:59152';
  const allEndpointsWorking = testResult.health && testResult.terminals && testResult.locations && testResult.vehicleTypes;
  const connectionStatus = allEndpointsWorking ? 'Semua endpoint berfungsi' : 'Ada masalah koneksi';

  return {
    // State
    testResult,
    
    // Computed values
    apiUrl,
    allEndpointsWorking,
    connectionStatus,
    
    // Actions
    testApiConnection,
    resetTest,
  };
}