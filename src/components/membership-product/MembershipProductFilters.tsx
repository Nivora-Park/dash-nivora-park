import React from "react";
import { Search } from "lucide-react";

interface MembershipProductFiltersProps {
  searchTerm: string;
  locationFilter: string;
  statusFilter: string;
  locationOptions: Array<{ id: string; name: string }>;
  onUpdateFilters: (updates: any) => void;
}

export function MembershipProductFilters({
  searchTerm,
  locationFilter,
  statusFilter,
  locationOptions,
  onUpdateFilters,
}: MembershipProductFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="sm:w-48">
        <select
          value={locationFilter}
          onChange={(e) => onUpdateFilters({ locationFilter: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {locationOptions.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-48">
        <select
          value={statusFilter}
          onChange={(e) => onUpdateFilters({ statusFilter: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}
