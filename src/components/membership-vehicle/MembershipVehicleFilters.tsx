import React from "react";
import { Search } from "lucide-react";

interface MembershipVehicleFiltersProps {
  searchTerm: string;
  membershipFilter: string;
  vehicleTypeFilter: string;
  statusFilter: string;
  membershipOptions: Array<{ id: string; name: string; code: string }>;
  vehicleTypeOptions: Array<{ id: string; name: string }>;
  onUpdateFilters: (updates: any) => void;
}

export function MembershipVehicleFilters({
  searchTerm,
  membershipFilter,
  vehicleTypeFilter,
  statusFilter,
  membershipOptions,
  vehicleTypeOptions,
  onUpdateFilters,
}: MembershipVehicleFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="sm:w-48">
        <select
          value={membershipFilter}
          onChange={(e) =>
            onUpdateFilters({ membershipFilter: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Memberships</option>
          {membershipOptions.map((membership) => (
            <option key={membership.id} value={membership.id}>
              {membership.name} ({membership.code})
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-48">
        <select
          value={vehicleTypeFilter}
          onChange={(e) =>
            onUpdateFilters({ vehicleTypeFilter: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Vehicle Types</option>
          {vehicleTypeOptions.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
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
