import React from "react";
import { Eye } from "lucide-react";

interface VehicleHeaderProps {
  onViewMap?: () => void;
}

export function VehicleHeader({ onViewMap }: VehicleHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Kendaraan
        </h1>
        <p className="text-gray-600">Kelola dan monitor kendaraan parkir</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onViewMap}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Lihat Peta</span>
        </button>
      </div>
    </div>
  );
}
