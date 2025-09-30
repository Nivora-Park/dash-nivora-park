import React, { useState } from "react";
import { Filter } from "lucide-react";

interface TransactionMonitoringFiltersProps {
  timeFilter: "today" | "week" | "month";
  onTimeFilterChange: (filter: "today" | "week" | "month") => void;
  startDate: string | null;
  endDate: string | null;
  onDateRangeChange: (startDate: string | null, endDate: string | null) => void;
}

export function TransactionMonitoringFilters({
  timeFilter,
  onTimeFilterChange,
  startDate,
  endDate,
  onDateRangeChange,
}: TransactionMonitoringFiltersProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate || "");
  const [localEndDate, setLocalEndDate] = useState(endDate || "");

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalStartDate(value);
    onDateRangeChange(value || null, localEndDate || null);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalEndDate(value);
    onDateRangeChange(localStartDate || null, value || null);
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500 " />
        <span className="text-sm font-medium text-gray-700 ">
          Time Period:
        </span>
      </div>
      <select
        value={timeFilter}
        onChange={(e) =>
          onTimeFilterChange(e.target.value as "today" | "week" | "month")
        }
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 transition-colors duration-300"
      >
        <option value="today">Today</option>
        <option value="week">7 Days</option>
        <option value="month">This Month</option>
      </select>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">From:</label>
        <input
          type="date"
          value={localStartDate}
          onChange={handleStartDateChange}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
      </div>

      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">To:</label>
        <input
          type="date"
          value={localEndDate}
          onChange={handleEndDateChange}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
      </div>
    </div>
  );
}
