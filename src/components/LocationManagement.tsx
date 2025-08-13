"use client";

import React from "react";
import { useLocationManagement } from "@/hooks/useLocationManagement";
import { LocationHeader } from "@/components/location/LocationHeader";
import { LocationStats } from "@/components/location/LocationStats";
import { LocationFilters } from "@/components/location/LocationFilters";
import { LocationTable } from "@/components/location/LocationTable";
import { LocationFormModal } from "@/components/location/LocationFormModal";

export function LocationManagement() {
  const {
    locations,
    merchants,
    loading,
    error,
    stats,
    showModal,
    editingLocation,
    formData,
    filters,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteLocation,
    updateFilters,
    getMerchantName,
  } = useLocationManagement();

  return (
    <div className="space-y-6">
      <LocationHeader onAddLocation={() => handleOpenModal()} />

      <LocationStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <LocationFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          merchants={merchants}
        />

        <LocationTable
          locations={locations}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={deleteLocation}
          getMerchantName={getMerchantName}
        />
      </div>

      {showModal && (
        <LocationFormModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          editingLocation={editingLocation}
          formData={formData}
          updateFormField={updateFormField}
          loading={loading}
          error={error}
          merchants={merchants}
        />
      )}
    </div>
  );
}
