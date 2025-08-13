"use client";

import React from "react";
import { useMembershipProductManagement } from "@/hooks/useMembershipProductManagement";
import { MembershipProductHeader } from "@/components/membership-product/MembershipProductHeader";
import { MembershipProductStats } from "@/components/membership-product/MembershipProductStats";
import { MembershipProductFilters } from "@/components/membership-product/MembershipProductFilters";
import { MembershipProductTable } from "@/components/membership-product/MembershipProductTable";
import { MembershipProductFormModal } from "@/components/membership-product/MembershipProductFormModal";

export default function MembershipProductManagement() {
  const {
    // Data
    products,
    locations,
    stats,

    // UI State
    showModal,
    editingProduct,
    formData,
    filters,

    // Loading states
    loading,
    error,

    // Actions
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    deleteProduct,
    updateFormField,
    updateFilters,
    getLocationName,
  } = useMembershipProductManagement();

  return (
    <div className="space-y-6">
      <MembershipProductHeader
        onRefresh={() => {}}
        onAddNew={handleOpenModal}
      />

      <MembershipProductStats
        totalProducts={stats.total}
        activeProducts={stats.total}
        totalRevenue={0}
        averagePrice={0}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <MembershipProductFilters
          searchTerm={filters.searchTerm}
          locationFilter={filters.locationId}
          statusFilter=""
          locationOptions={locations.map((l) => ({ id: l.id, name: l.name }))}
          onUpdateFilters={updateFilters}
        />

        <MembershipProductTable
          products={products.map((p) => ({
            id: p.id,
            location_id: p.location_id,
            code: p.code,
            name: p.name,
            description: p.description,
            price: p.base_price,
            duration_days: p.duration_days,
            is_active: !p.deleted_at,
          }))}
          isLoading={loading}
          error={error}
          getLocationName={getLocationName}
          onEdit={(product) => handleOpenModal(product as any)}
          onDelete={deleteProduct}
        />
      </div>

      {showModal && (
        <MembershipProductFormModal
          isOpen={showModal}
          product={editingProduct}
          formData={formData}
          locations={locations}
          loading={loading}
          error={error}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          updateFormField={(field, value) =>
            updateFormField(field as any, value)
          }
        />
      )}
    </div>
  );
}
