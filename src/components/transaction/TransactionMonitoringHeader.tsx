import React from "react";
import { BarChart3, Download, RefreshCw } from "lucide-react";

interface TransactionMonitoringHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
  exportFormat: "excel" | "pdf";
  onExportFormatChange: (format: "excel" | "pdf") => void;
}

export function TransactionMonitoringHeader({
  onRefresh,
  onExport,
  exportFormat,
  onExportFormatChange,
}: TransactionMonitoringHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2 transition-colors duration-300">
          <BarChart3 className="h-8 w-8" />
          Transaction Monitoring
        </h1>
        <p className="text-gray-600 transition-colors duration-300">
          Real-time parking transaction monitoring
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
        <select
          value={exportFormat}
          onChange={(e) => onExportFormatChange(e.target.value as "excel" | "pdf")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="excel">Excel</option>
          <option value="pdf">PDF</option>
        </select>
        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
