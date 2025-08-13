import React from "react";
import { Filter } from "lucide-react";

interface TransactionMonitoringFiltersProps {
  timeFilter: "today" | "week" | "month";
  onTimeFilterChange: (filter: "today" | "week" | "month") => void;
}

export function TransactionMonitoringFilters({
  timeFilter,
  onTimeFilterChange,
}: TransactionMonitoringFiltersProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Time Period:</span>
      </div>
      <select
        value={timeFilter}
        onChange={(e) =>
          onTimeFilterChange(e.target.value as "today" | "week" | "month")
        }
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="today">Today</option>
        <option value="week">7 Days</option>
        <option value="month">This Month</option>
      </select>
    </div>
  );
}
