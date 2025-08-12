'use client';

import { useState } from 'react';
import { Wifi, WifiOff, TestTube, RefreshCw, List, MapPin } from 'lucide-react';
import { apiService } from '@/services/api';

export function ApiTest() {
  const [testResult, setTestResult] = useState<{
    health: boolean | null;
    terminals: boolean | null;
    locations: boolean | null;
    vehicleTypes: boolean | null;
    loading: boolean;
    mode: 'direct' | 'proxy' | null;
    vehicleTypeCount?: number;
    locationCount?: number;
  }>({
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Test Koneksi API</h3>
        <button
          onClick={testApiConnection}
          disabled={testResult.loading}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {testResult.loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4" />
          )}
          <span>{testResult.loading ? 'Testing...' : 'Test API'}</span>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Health Endpoint:</span>
          {testResult.health === null ? (
            <span className="text-gray-500">Belum ditest</span>
          ) : testResult.health ? (
            <div className="flex items-center space-x-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span>Berhasil</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span>Gagal</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Terminals Endpoint:</span>
          {testResult.terminals === null ? (
            <span className="text-gray-500">Belum ditest</span>
          ) : testResult.terminals ? (
            <div className="flex items-center space-x-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span>Berhasil</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span>Gagal</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Locations Endpoint:</span>
          {testResult.locations === null ? (
            <span className="text-gray-500">Belum ditest</span>
          ) : testResult.locations ? (
            <div className="flex items-center space-x-2 text-green-600">
              <Wifi className="w-4 h-4" />
              <span>Berhasil</span>
              <span className="inline-flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                <MapPin className="w-3 h-3 mr-1" /> {testResult.locationCount} lokasi
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span>Gagal</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-700">Vehicle Types Endpoint:</span>
          {testResult.vehicleTypes === null ? (
            <span className="text-gray-500">Belum ditest</span>
          ) : testResult.vehicleTypes ? (
            <div className="flex items-center space-x-2 text-green-600">
              <Wifi className="w-4 h-4" />
              <span>Berhasil</span>
              <span className="inline-flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
                <List className="w-3 h-3 mr-1" /> {testResult.vehicleTypeCount} tipe
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-1 text-red-600">
              <WifiOff className="w-4 h-4" />
              <span>Gagal</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>URL API:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.101.100:59152'}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Status:</strong> {testResult.health && testResult.terminals && testResult.locations && testResult.vehicleTypes ? 'Semua endpoint berfungsi' : 'Ada masalah koneksi'}
        </p>
        {testResult.mode && (
          <p className="text-sm text-gray-600 mt-1">
            <strong>Mode:</strong> {testResult.mode === 'direct' ? 'Direct API Call' : 'Proxy API Call'}
          </p>
        )}
      </div>
    </div>
  );
} 