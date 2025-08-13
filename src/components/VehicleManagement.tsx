"use client";

import React, { useState } from "react";
import { useVehicleManagement } from "@/hooks/useVehicleManagement";
import { VehicleHeader } from "@/components/vehicle/VehicleHeader";
import { VehicleStats } from "@/components/vehicle/VehicleStats";
import { VehicleFilters } from "@/components/vehicle/VehicleFilters";
import { VehicleTable } from "@/components/vehicle/VehicleTable";
import { VehicleTypeManagement } from "@/components/VehicleTypeManagement";

type TabType = "monitoring" | "types";

export function VehicleManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("monitoring");
  const { vehicles, stats, filters, updateFilters, refreshData } =
    useVehicleManagement();

  const handleViewMap = () => {
    // TODO: Implement map view
    console.log("View map clicked");
  };

  const tabs = [
    {
      id: "monitoring" as TabType,
      name: "Monitoring Kendaraan",
      count: stats.totalVehicles,
    },
    { id: "types" as TabType, name: "Tipe Kendaraan", count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{tab.name}</span>
              {tab.count !== null && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "monitoring" && (
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

            <VehicleTable
              vehicles={vehicles}
              totalVehicles={stats.totalVehicles}
            />
          </div>
        </div>
      )}

      {activeTab === "types" && <VehicleTypeManagement />}
    </div>
  );
}
