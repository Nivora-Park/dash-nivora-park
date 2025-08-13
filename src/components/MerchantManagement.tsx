"use client";

import React from "react";
import { useMerchantManagement } from "@/hooks/useMerchantManagement";
import { MerchantHeader } from "@/components/merchant/MerchantHeader";
import { MerchantStats } from "@/components/merchant/MerchantStats";
import { MerchantFilters } from "@/components/merchant/MerchantFilters";
import { MerchantTable } from "@/components/merchant/MerchantTable";
import { MerchantFormModal } from "@/components/merchant/MerchantFormModal";

export function MerchantManagement() {
  const {
    merchants,
    loading,
    error,
    stats,
    showModal,
    editingMerchant,
    formData,
    filters,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteMerchant,
    updateFilters,
  } = useMerchantManagement();

  return (
    <div className="space-y-6">
      <MerchantHeader onAddMerchant={() => handleOpenModal()} />

      <MerchantStats stats={stats} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <MerchantFilters filters={filters} onUpdateFilters={updateFilters} />

        <MerchantTable
          merchants={merchants}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={deleteMerchant}
        />
      </div>

      {showModal && (
        <MerchantFormModal
          isOpen={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          editingMerchant={editingMerchant}
          formData={formData}
          updateFormField={updateFormField}
          loading={loading}
          error={error}
        />
      )}
    </div>
  );
}
