"use client";

import React from "react";
import { Filter, Eye } from "lucide-react";
import { useTransactionMonitoring } from "@/hooks/useTransactionMonitoring";
import { TransactionMonitoringHeader } from "@/components/transaction/TransactionMonitoringHeader";
import { TransactionMonitoringFilters } from "@/components/transaction/TransactionMonitoringFilters";
import { TransactionStats } from "@/components/transaction/TransactionStats";
import { TransactionChart } from "./TransactionChart";
import { TransactionTable } from "./TransactionTable";

export function TransactionMonitoring() {
  const {
    timeFilter,
    dateRange,
    exportFormat,
    stats,
    chartData,
    tableRows,
    terminalsMaster,
    payments,
    terminalEntryCounts,
    terminalExitCounts,
    loading,
    updateTimeFilter,
    updateDateRange,
    refreshData,
    exportData,
    setExportFormat,
  } = useTransactionMonitoring();

  return (
    <div className="space-y-6">
      <TransactionMonitoringHeader
        onRefresh={refreshData}
        onExport={exportData}
        exportFormat={exportFormat}
        onExportFormatChange={setExportFormat}
      />

      <TransactionMonitoringFilters
        timeFilter={timeFilter}
        onTimeFilterChange={updateTimeFilter}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onDateRangeChange={updateDateRange}
      />

      {/* Stats Cards */}
      <TransactionStats
        totalTransactions={stats.totalTransactions}
        totalRevenue={stats.totalRevenue}
        activeVehicles={stats.activeVehicles}
        avgDurationMinutes={stats.avgDurationMinutes}
        loading={loading}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tren Transaksi
            </h3>
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading data...</p>
            </div>
          ) : (
            <TransactionChart data={chartData} />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Status Terminal
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading data...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {terminalsMaster.slice(0, 4).map((terminal, index) => {
                const entryCount = terminalEntryCounts.get(terminal.id) || 0;
                const exitCount = terminalExitCounts.get(terminal.id) || 0;
                return (
                  <div
                    key={terminal.id ?? index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="font-medium text-gray-900">
                        {terminal.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-x-2">
                      {entryCount > 0 && <span>{entryCount.toLocaleString("id-ID")}</span>}
                      <span>{exitCount.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Transaksi Terbaru
            </h3>
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
              <Eye className="w-4 h-4" />
              <span>Lihat Semua</span>
            </button>
          </div>
        </div>
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <TransactionTable rows={tableRows} />
        )}
      </div>
    </div>
  );
}
