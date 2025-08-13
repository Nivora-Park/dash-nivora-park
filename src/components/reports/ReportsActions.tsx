import React from "react";
import { Car, Calendar, FileText, Download } from "lucide-react";

interface ReportsActionsProps {
  onGenerateDailyReport: () => void;
  onGenerateMonthlyReport: () => void;
  onAnalyzeVehicles: () => void;
  onExportAllData: () => void;
}

export function ReportsActions({
  onGenerateDailyReport,
  onGenerateMonthlyReport,
  onAnalyzeVehicles,
  onExportAllData,
}: ReportsActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={onGenerateDailyReport}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FileText className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Laporan Harian</div>
            <div className="text-sm text-gray-600">Generate laporan harian</div>
          </div>
        </button>

        <button
          onClick={onGenerateMonthlyReport}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Calendar className="w-5 h-5 text-green-600" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Laporan Bulanan</div>
            <div className="text-sm text-gray-600">
              Generate laporan bulanan
            </div>
          </div>
        </button>

        <button
          onClick={onAnalyzeVehicles}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Car className="w-5 h-5 text-purple-600" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Analisis Kendaraan</div>
            <div className="text-sm text-gray-600">Lihat analisis detail</div>
          </div>
        </button>

        <button
          onClick={onExportAllData}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5 text-orange-600" />
          <div className="text-left">
            <div className="font-medium text-gray-900">Export Data</div>
            <div className="text-sm text-gray-600">Download semua data</div>
          </div>
        </button>
      </div>
    </div>
  );
}
