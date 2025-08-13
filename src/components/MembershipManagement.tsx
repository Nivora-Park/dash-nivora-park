"use client";

import React from "react";
import { useMembershipManagement } from "@/hooks/useMembershipManagement";
import { MembershipHeader } from "@/components/membership/MembershipHeader";
import { MembershipStats } from "@/components/membership/MembershipStats";
import { MembershipFilters } from "@/components/membership/MembershipFilters";
import { MembershipTable } from "@/components/membership/MembershipTable";
import { MembershipFormModal } from "@/components/membership/MembershipFormModal";

export default function MembershipManagement() {
  const {
    // Data
    memberships,
    membershipProducts,
    stats,

    // UI State
    showModal,
    editingMembership,
    formData,
    filters,

    // Loading states
    loading,
    error,

    // Actions
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    deleteMembership,
    updateFormField,
    updateFilters,
    getMembershipProductName,
  } = useMembershipManagement();

  return (
    <div className="space-y-6">
      <MembershipHeader onRefresh={() => {}} onAddNew={handleOpenModal} />

      <MembershipStats
        totalMemberships={stats.total}
        activeMemberships={stats.active}
        expiringMemberships={stats.expired}
        totalRevenue={0}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <MembershipFilters
          searchTerm={filters.searchTerm}
          productFilter={filters.membershipProductId}
          statusFilter=""
          productOptions={membershipProducts.map((p) => ({
            id: p.id,
            name: p.name,
          }))}
          onUpdateFilters={updateFilters}
        />

        <MembershipTable
          memberships={memberships.map((m) => ({
            ...m,
            status: "active" as const,
          }))}
          isLoading={loading}
          error={error}
          getMembershipProductName={getMembershipProductName}
          getStatusColor={() => "bg-green-100 text-green-800"}
          getMembershipStatus={() => "active"}
          onEdit={(membership) => handleOpenModal(membership as any)}
          onDelete={deleteMembership}
        />
      </div>

      {showModal && (
        <MembershipFormModal
          isOpen={showModal}
          membership={editingMembership}
          formData={formData}
          membershipProducts={membershipProducts}
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
