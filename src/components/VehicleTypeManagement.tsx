"use client";

import React from "react";
import { useVehicleTypeManagement } from "@/hooks/useVehicleTypeManagement";
import { VehicleTypeHeader } from "@/components/vehicle-type/VehicleTypeHeader";
import { VehicleTypeStats } from "@/components/vehicle-type/VehicleTypeStats";
import { VehicleTypeFilters } from "@/components/vehicle-type/VehicleTypeFilters";
import { VehicleTypeTable } from "@/components/vehicle-type/VehicleTypeTable";
import { VehicleTypeFormModal } from "@/components/vehicle-type/VehicleTypeFormModal";

export function VehicleTypeManagement() {
  const {
    vehicleTypes,
    locations,
    loading,
    error,
    stats,
    showModal,
    editingVehicleType,
    formData,
    filters,
    fetchVehicleTypes,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteVehicleType,
    updateFilters,
    getLocationName,
    getRateDescription,
  } = useVehicleTypeManagement();

  const handleDeleteVehicleType = async (id: string, name: string) => {
    await deleteVehicleType(id);
  };

  return (
    <div className="space-y-6">
      <VehicleTypeHeader
        onRefresh={fetchVehicleTypes}
        onAddNew={() => handleOpenModal()}
      />

      <VehicleTypeStats
        totalTypes={stats.total}
        twoWheelers={
          stats.byWheelCount.find((item) => item.name === "2 Roda")?.count || 0
        }
        fourWheelers={
          stats.byWheelCount.find((item) => item.name === "4 Roda")?.count || 0
        }
        activeLocations={
          stats.byLocation.filter((item) => item.count > 0).length
        }
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <VehicleTypeFilters
          searchTerm={filters.searchTerm}
          locationFilter={filters.locationId}
          locationOptions={locations.map((l) => ({ id: l.id, name: l.name }))}
          onUpdateFilters={updateFilters}
        />

        <VehicleTypeTable
          vehicleTypes={vehicleTypes}
          isLoading={loading}
          error={error}
          getLocationName={getLocationName}
          getRateDescription={getRateDescription}
          onEdit={(vehicleType) => handleOpenModal(vehicleType as any)}
          onDelete={handleDeleteVehicleType}
        />
      </div>

      {showModal && (
        <VehicleTypeFormModal
          isOpen={showModal}
          vehicleType={editingVehicleType}
          formData={formData}
          updateFormField={updateFormField as any}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          locations={locations}
          rates={[]}
        />
      )}
    </div>
  );
}
