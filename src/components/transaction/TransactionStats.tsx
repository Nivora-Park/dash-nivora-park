import React from "react";
import { TrendingUp, Car, Clock } from "lucide-react";

interface TransactionStatsProps {
  totalTransactions: number;
  totalRevenue: number;
  activeVehicles: number;
  avgDurationMinutes: number;
  loading?: boolean;
}

export function TransactionStats({
  totalTransactions,
  totalRevenue,
  activeVehicles,
  avgDurationMinutes,
  loading = false,
}: TransactionStatsProps) {
  const stats = [
    {
      title: "Total Transaksi",
      value: totalTransactions.toLocaleString("id-ID"),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Pendapatan",
      value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
      icon: null, // No icon, will render custom Rp text
      color: "bg-blue-500",
    },
    {
      title: "Kendaraan Aktif",
      value: activeVehicles.toLocaleString("id-ID"),
      icon: Car,
      color: "bg-purple-500",
    },
    {
      title: "Rata-rata Durasi",
      value: `${Math.floor(avgDurationMinutes / 60)}h ${
        avgDurationMinutes % 60
      }m`,
      icon: Clock,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 ">
                  {stat.title}
                </p>
                {loading ? (
                  <div className="mt-1">
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                )}
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                {loading ? (
                  <div className="animate-pulse bg-white bg-opacity-30 w-6 h-6 rounded"></div>
                ) : Icon ? (
                  <Icon className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white font-bold text-lg">Rp</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
