"use client";

import React from "react";
import { useReports } from "@/hooks/useReports";
import { ReportsHeader } from "@/components/reports/ReportsHeader";
import { ReportsStats } from "@/components/reports/ReportsStats";
import { ReportsActions } from "@/components/reports/ReportsActions";
import { ReportTabs } from "@/components/reports/ReportTabs";
import { RevenueChart } from "@/components/reports/RevenueChart";
import { VehicleTypeChart } from "@/components/reports/VehicleTypeChart";
import { VehicleAnalysisChart } from "@/components/reports/VehicleAnalysisChart";
import { PerformanceMetrics } from "@/components/reports/PerformanceMetrics";

export function Reports() {
  const {
    dateRange,
    reportType,
    stats,
    chartData,
    updateDateRange,
    updateReportType,
    exportReport,
    generateDailyReport,
    generateMonthlyReport,
    analyzeVehicles,
    exportAllData,
  } = useReports();

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReportsHeader
        dateRange={dateRange}
        onDateRangeChange={updateDateRange}
        onExportReport={exportReport}
      />

      {/* Stats Cards */}
      <ReportsStats
        totalRevenue={stats.totalRevenue}
        totalTransactions={stats.totalTransactions}
        averageRevenue={stats.averageRevenue}
        growth={stats.growth}
      />

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ReportTabs activeTab={reportType} onTabChange={updateReportType} />

        <div className="p-6">
          {reportType === "revenue" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueChart data={chartData.revenueData} />
                <VehicleTypeChart data={chartData.vehicleTypeData} />
              </div>
            </div>
          )}

          {reportType === "vehicles" && (
            <VehicleAnalysisChart data={chartData.revenueData} />
          )}

          {reportType === "performance" && <PerformanceMetrics />}
        </div>
      </div>

      {/* Quick Actions */}
      <ReportsActions
        onGenerateDailyReport={generateDailyReport}
        onGenerateMonthlyReport={generateMonthlyReport}
        onAnalyzeVehicles={analyzeVehicles}
        onExportAllData={exportAllData}
      />
    </div>
  );
}
