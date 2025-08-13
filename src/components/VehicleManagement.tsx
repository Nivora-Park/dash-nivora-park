"use client";

import React from "react";
import { useVehicleManagement } from "@/hooks/useVehicleManagement";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleStats } from "@/components/vehicle/VehicleStats";
import { VehicleFilters } from "@/components/vehicle/VehicleFilters";
import { VehicleTable } from "@/components/vehicle/VehicleTable";

export function VehicleManagement() {
  const { vehicles, stats, filters, updateFilters, refreshData } =
    useVehicleManagement();

  const handleViewMap = () => {
    // TODO: Implement map view
    console.log("View map clicked");
  };

  return (
    <div className="space-y-6">
      <VehicleHeader onViewMap={handleViewMap} />

      <VehicleStats
        totalVehicles={stats.totalVehicles}
        parkedCount={stats.parkedCount}
        overdueCount={stats.overdueCount}
        averageDurationMins={stats.averageDurationMins}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <VehicleFilters filters={filters} onUpdateFilters={updateFilters} />

        <VehicleTable vehicles={vehicles} totalVehicles={stats.totalVehicles} />
      </div>
    </div>
  );
}
