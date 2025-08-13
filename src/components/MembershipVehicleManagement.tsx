"use client";

import React from "react";
import { useMembershipVehicleManagement } from "@/hooks/useMembershipVehicleManagement";
import { MembershipVehicleHeader } from "@/components/membership-vehicle/MembershipVehicleHeader";
import { MembershipVehicleStats } from "@/components/membership-vehicle/MembershipVehicleStats";
import { MembershipVehicleFilters } from "@/components/membership-vehicle/MembershipVehicleFilters";
import { MembershipVehicleTable } from "@/components/membership-vehicle/MembershipVehicleTable";
import { MembershipVehicleFormModal } from "@/components/membership-vehicle/MembershipVehicleFormModal";

export default function MembershipVehicleManagement() {
  const {
    // Data
    membershipVehicles,
    memberships,
    vehicleTypes,
    stats,

    // UI State
    showModal,
    editingVehicle,
    formData,
    filters,

    // Loading states
    loading,
    error,

    // Actions
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    deleteMembershipVehicle,
    updateFormField,
    updateFilters,
    fetchMembershipVehicles,
    getMembershipName,
    getVehicleTypeName,
  } = useMembershipVehicleManagement();

  return (
    <div className="space-y-6">
      <MembershipVehicleHeader
        onRefresh={fetchMembershipVehicles}
        onAddNew={handleOpenModal}
      />

      <MembershipVehicleStats
        totalVehicles={stats.total}
        activeVehicles={membershipVehicles.filter((v) => !v.deleted_at).length}
        vehicleTypes={vehicleTypes.length}
        registeredMembers={memberships.length}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <MembershipVehicleFilters
          searchTerm={filters.searchTerm}
          membershipFilter={filters.membershipId}
          vehicleTypeFilter={filters.vehicleTypeId}
          statusFilter=""
          membershipOptions={memberships.map((m) => ({
            id: m.id,
            name: m.name,
            code: m.code,
          }))}
          vehicleTypeOptions={vehicleTypes.map((vt) => ({
            id: vt.id,
            name: vt.name,
          }))}
          onUpdateFilters={updateFilters}
        />

        <MembershipVehicleTable
          vehicles={membershipVehicles.map((v) => ({
            id: v.id,
            membership_id: v.membership_id,
            vehicle_type_id: v.vehicle_type_id,
            license_plate: v.plate_number,
            brand: v.brand,
            model: v.model,
            color: v.color,
          }))}
          isLoading={loading}
          error={error}
          getMembershipName={getMembershipName}
          getVehicleTypeName={getVehicleTypeName}
          onEdit={(vehicle) =>
            handleOpenModal(membershipVehicles.find((v) => v.id === vehicle.id))
          }
          onDelete={(id, licensePlate) => deleteMembershipVehicle(id)}
        />
      </div>

      {showModal && (
        <MembershipVehicleFormModal
          isOpen={showModal}
          vehicle={editingVehicle}
          formData={formData}
          memberships={memberships}
          vehicleTypes={vehicleTypes}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          updateFormField={updateFormField as any}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
