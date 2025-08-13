import React from "react";
import { Car, CheckCircle, AlertTriangle, Clock } from "lucide-react";

interface VehicleStatsProps {
  totalVehicles: number;
  parkedCount: number;
  overdueCount: number;
  averageDurationMins: number;
}

export function VehicleStats({
  totalVehicles,
  parkedCount,
  overdueCount,
  averageDurationMins,
}: VehicleStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Kendaraan</p>
            <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Sedang Parkir</p>
            <p className="text-2xl font-bold text-green-600">{parkedCount}</p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
          </div>
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Rata-rata Durasi
            </p>
            <p className="text-2xl font-bold text-purple-600">—</p>
          </div>
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
