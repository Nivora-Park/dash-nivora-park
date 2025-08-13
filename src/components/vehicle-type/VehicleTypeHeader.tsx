import React from "react";
import { Plus, Car } from "lucide-react";

interface VehicleTypeHeaderProps {
  onRefresh: () => void;
  onAddNew: () => void;
}

export function VehicleTypeHeader({
  onRefresh,
  onAddNew,
}: VehicleTypeHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Car className="h-8 w-8" />
          Tipe Kendaraan
        </h1>
        <p className="text-gray-600">
          Kelola tipe kendaraan dan konfigurasinya
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tipe</span>
        </button>
      </div>
    </div>
  );
}
