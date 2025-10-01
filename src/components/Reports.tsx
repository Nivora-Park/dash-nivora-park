import React from "react";
import { useReports } from "@/hooks/useReports";
import { ReportsActions } from "./reports/ReportsActions";
import { ReportsStats } from "./reports/ReportsStats";
import { RevenueChart } from "./reports/RevenueChart";
import { VehicleTypeChart } from "./reports/VehicleTypeChart";
import { VehicleAnalysisChart } from "./reports/VehicleAnalysisChart";
import { PerformanceMetrics } from "./reports/PerformanceMetrics";

export function Reports() {
  const {
    loading,
    stats,
    chartData,
    generateDailyReport,
    generateMonthlyReport,
    analyzeVehicles,
    exportAllData,
  } = useReports();

  return (
    <div className="space-y-6">
      <ReportsActions
        onGenerateDailyReport={generateDailyReport}
        onGenerateMonthlyReport={generateMonthlyReport}
        onAnalyzeVehicles={analyzeVehicles}
        onExportAllData={exportAllData}
        loading={loading}
      />
      <ReportsStats
        totalRevenue={stats.totalRevenue}
        totalTransactions={stats.totalTransactions}
        averageRevenue={stats.averageRevenue}
        growth={stats.growth}
        loading={loading}
      />
      <RevenueChart data={chartData?.revenueData || []} loading={loading} />
      <VehicleTypeChart data={chartData?.vehicleTypeData || []} loading={loading} />
      {/* Placeholder empty data for VehicleAnalysisChart and PerformanceMetrics */}
      <VehicleAnalysisChart data={[]} loading={loading} />
      <PerformanceMetrics metrics={[]} loading={loading} />
    </div>
  );
}
