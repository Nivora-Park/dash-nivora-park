import React from "react";
import { Search, Filter } from "lucide-react";

interface TerminalFiltersProps {
  searchTerm: string;
  locationFilter: string;
  rateFilter: string;
  locationOptions: Array<{ id: string; name: string }>;
  rateOptions: Array<{ id: string; name: string }>;
  onUpdateFilters: (filters: {
    searchTerm?: string;
    locationFilter?: string;
    rateFilter?: string;
  }) => void;
}

export function TerminalFilters({
  searchTerm,
  locationFilter,
  rateFilter,
  locationOptions,
  rateOptions,
  onUpdateFilters,
}: TerminalFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari terminal..."
            value={searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white text-gray-900 transition-colors duration-300"
          />
        </div>

        <div>
          <select
            value={locationFilter}
            onChange={(e) =>
              onUpdateFilters({ locationFilter: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-colors duration-300"
          >
            <option value="all">Semua Lokasi</option>
            {locationOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={rateFilter}
            onChange={(e) => onUpdateFilters({ rateFilter: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-colors duration-300"
          >
            <option value="all">Semua Tarif</option>
            {rateOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400 " />
          <span className="text-sm text-gray-600 ">Filter</span>
        </div>
      </div>
    </div>
  );
}
