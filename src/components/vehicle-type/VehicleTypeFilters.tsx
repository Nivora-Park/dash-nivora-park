import React from "react";
import { Search } from "lucide-react";

interface VehicleTypeFiltersProps {
  searchTerm: string;
  locationFilter: string;
  locationOptions: Array<{ id: string; name: string }>;
  onUpdateFilters: (filters: any) => void;
}

export function VehicleTypeFilters({
  searchTerm,
  locationFilter,
  locationOptions,
  onUpdateFilters,
}: VehicleTypeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Cari tipe kendaraan..."
            value={searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="w-full sm:w-48">
        <select
          value={locationFilter}
          onChange={(e) => onUpdateFilters({ locationId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Lokasi</option>
          {locationOptions.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
