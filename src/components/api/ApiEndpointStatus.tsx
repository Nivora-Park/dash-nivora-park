import React from "react";
import { Wifi, WifiOff, List, MapPin } from "lucide-react";

interface TestResult {
  health: boolean | null;
  terminals: boolean | null;
  locations: boolean | null;
  vehicleTypes: boolean | null;
  vehicleTypeCount?: number;
  locationCount?: number;
}

interface ApiEndpointStatusProps {
  testResult: TestResult;
}

export function ApiEndpointStatus({ testResult }: ApiEndpointStatusProps) {
  const getEndpointStatus = (status: boolean | null) => {
    if (status === null) {
      return <span className="text-gray-500">Belum ditest</span>;
    }

    if (status) {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <Wifi className="w-4 h-4" />
          <span>Berhasil</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-1 text-red-600">
        <WifiOff className="w-4 h-4" />
        <span>Gagal</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">
          Health Endpoint:
        </span>
        {getEndpointStatus(testResult.health)}
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">
          Terminals Endpoint:
        </span>
        {getEndpointStatus(testResult.terminals)}
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">
          Locations Endpoint:
        </span>
        {testResult.locations === null ? (
          <span className="text-gray-500">Belum ditest</span>
        ) : testResult.locations ? (
          <div className="flex items-center space-x-2 text-green-600">
            <Wifi className="w-4 h-4" />
            <span>Berhasil</span>
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
              <MapPin className="w-3 h-3 mr-1" /> {testResult.locationCount}{" "}
              lokasi
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
        <span className="text-sm font-medium text-gray-700">
          Vehicle Types Endpoint:
        </span>
        {testResult.vehicleTypes === null ? (
          <span className="text-gray-500">Belum ditest</span>
        ) : testResult.vehicleTypes ? (
          <div className="flex items-center space-x-2 text-green-600">
            <Wifi className="w-4 h-4" />
            <span>Berhasil</span>
            <span className="inline-flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">
              <List className="w-3 h-3 mr-1" /> {testResult.vehicleTypeCount}{" "}
              tipe
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
  );
}
