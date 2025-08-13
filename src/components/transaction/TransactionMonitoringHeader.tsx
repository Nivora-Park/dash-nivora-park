import React from "react";
import { BarChart3, Download, RefreshCw } from "lucide-react";

interface TransactionMonitoringHeaderProps {
  onRefresh: () => void;
  onExport: () => void;
}

export function TransactionMonitoringHeader({
  onRefresh,
  onExport,
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
