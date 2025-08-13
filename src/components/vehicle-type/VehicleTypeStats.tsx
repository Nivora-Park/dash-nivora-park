import React from "react";
import { Car, Settings, MapPin, BarChart3 } from "lucide-react";

interface VehicleTypeStatsProps {
  totalTypes: number;
  twoWheelers: number;
  fourWheelers: number;
  activeLocations: number;
}

export function VehicleTypeStats({
  totalTypes,
  twoWheelers,
  fourWheelers,
  activeLocations,
}: VehicleTypeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tipe</p>
            <p className="text-2xl font-bold text-gray-900">{totalTypes}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Roda 2</p>
            <p className="text-2xl font-bold text-gray-900">{twoWheelers}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <Settings className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Roda 4</p>
            <p className="text-2xl font-bold text-gray-900">{fourWheelers}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Lokasi Aktif</p>
            <p className="text-2xl font-bold text-gray-900">
              {activeLocations}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
