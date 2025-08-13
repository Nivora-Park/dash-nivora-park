import React from "react";
import { Search } from "lucide-react";

interface VehicleFilters {
  searchTerm: string;
  statusFilter: "all" | "parked" | "left" | "overdue";
  vehicleTypeFilter: "all" | "car" | "motorcycle";
}

interface VehicleFiltersProps {
  filters: VehicleFilters;
  onUpdateFilters: (filters: Partial<VehicleFilters>) => void;
}

export function VehicleFilters({
  filters,
  onUpdateFilters,
}: VehicleFiltersProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-900">Daftar Kendaraan</h3>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari plat nomor..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
        </div>
        <select
          value={filters.statusFilter}
          onChange={(e) =>
            onUpdateFilters({ statusFilter: e.target.value as any })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="parked">Sedang Parkir</option>
          <option value="left">Sudah Keluar</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={filters.vehicleTypeFilter}
          onChange={(e) =>
            onUpdateFilters({ vehicleTypeFilter: e.target.value as any })
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Kendaraan</option>
          <option value="car">Mobil</option>
          <option value="motorcycle">Motor</option>
        </select>
      </div>
    </div>
  );
}
