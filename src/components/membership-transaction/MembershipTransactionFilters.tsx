import React from "react";
import { Search, Calendar } from "lucide-react";

interface MembershipTransactionFiltersProps {
  searchTerm: string;
  membershipFilter: string;
  dateFilter: string;
  statusFilter: string;
  membershipOptions: Array<{ id: string; name: string; code: string }>;
  onUpdateFilters: (updates: any) => void;
}

export function MembershipTransactionFilters({
  searchTerm,
  membershipFilter,
  dateFilter,
  statusFilter,
  membershipOptions,
  onUpdateFilters,
}: MembershipTransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions..."
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
          value={dateFilter}
          onChange={(e) => onUpdateFilters({ dateFilter: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      <div className="sm:w-48">
        <select
          value={statusFilter}
          onChange={(e) => onUpdateFilters({ statusFilter: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  );
}
