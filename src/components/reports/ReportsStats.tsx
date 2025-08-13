import React from "react";
import { BarChart3, TrendingUp, DollarSign, Activity } from "lucide-react";

interface ReportsStatsProps {
  totalRevenue: number;
  totalTransactions: number;
  averageRevenue: number;
  growth: number;
}

export function ReportsStats({
  totalRevenue,
  totalTransactions,
  averageRevenue,
  growth,
}: ReportsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Pendapatan
            </p>
            <p className="text-2xl font-bold text-gray-900">
              Rp {totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Rata-rata Pendapatan
            </p>
            <p className="text-2xl font-bold text-purple-600">
              Rp {averageRevenue.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pertumbuhan</p>
            <p className="text-2xl font-bold text-green-600">—</p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
