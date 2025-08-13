import React from "react";
import { CreditCard, DollarSign, CheckCircle, Settings } from "lucide-react";

interface PaymentStatsProps {
  totalTransactions: number;
  totalRevenue: number;
  activeMethods: number;
  avgTransaction: number;
}

export function PaymentStats({
  totalTransactions,
  totalRevenue,
  activeMethods,
  avgTransaction,
}: PaymentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
            <p className="text-2xl font-bold text-gray-900">
              {totalTransactions.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Pendapatan
            </p>
            <p className="text-2xl font-bold text-green-600">
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
            <p className="text-sm font-medium text-gray-600">Metode Aktif</p>
            <p className="text-2xl font-bold text-blue-600">{activeMethods}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Rata-rata Transaksi
            </p>
            <p className="text-2xl font-bold text-purple-600">
              Rp {Math.round(avgTransaction).toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
