"use client";

import React, { useState } from "react";
import { useMembershipManagement } from "@/hooks/useMembershipManagement";
import { useMembershipImport } from "@/hooks/useMembershipImport";
import { MembershipHeader } from "@/components/membership/MembershipHeader";
import { MembershipStats } from "@/components/membership/MembershipStats";
import { MembershipFilters } from "@/components/membership/MembershipFilters";
import { MembershipTable } from "@/components/membership/MembershipTable";
import { MembershipFormModal } from "@/components/membership/MembershipFormModal";
import { MembershipImportModal } from "@/components/membership/MembershipImportModal";

export default function MembershipManagement() {
  const [showImportModal, setShowImportModal] = useState(false);
  
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
    fetchMemberships,
  } = useMembershipManagement();

  const { importMemberships } = useMembershipImport();

  const handleImport = async (data: any[]) => {
    try {
      await importMemberships(data);
      // Refresh data after successful import
      await fetchMemberships();
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <MembershipHeader 
        onRefresh={fetchMemberships} 
        onAddNew={handleOpenModal}
        onImport={() => setShowImportModal(true)}
      />

      <MembershipStats
        totalMemberships={stats.total}
        activeMemberships={stats.active}
        expiringMemberships={memberships.filter(m => {
          const now = new Date();
          const endDate = new Date(m.end_time);
          const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0; // Expiring within 30 days but not expired yet
        }).length}
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

      {showImportModal && (
        <MembershipImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}
