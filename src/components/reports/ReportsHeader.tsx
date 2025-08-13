import React from "react";
import { Download, Calendar } from "lucide-react";

interface ReportsHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: "week" | "month" | "quarter" | "year") => void;
  onExportReport: () => void;
}

export function ReportsHeader({
  dateRange,
  onDateRangeChange,
  onExportReport,
}: ReportsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Laporan & Analitik</h1>
        <p className="text-gray-600">Analisis performa sistem parkir</p>
      </div>
      <div className="flex items-center space-x-3">
        <select
          value={dateRange}
          onChange={(e) => onDateRangeChange(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="week">Minggu Ini</option>
          <option value="month">Bulan Ini</option>
          <option value="quarter">Kuartal Ini</option>
          <option value="year">Tahun Ini</option>
        </select>
        <button
          onClick={onExportReport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Laporan</span>
        </button>
      </div>
    </div>
  );
}
