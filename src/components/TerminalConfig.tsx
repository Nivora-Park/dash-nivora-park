"use client";

import React from "react";
import { useTerminalConfig } from "@/hooks/useTerminalConfig";
import { TerminalHeader } from "@/components/terminal/TerminalHeader";
import { TerminalFilters } from "@/components/terminal/TerminalFilters";
import { TerminalTable } from "@/components/terminal/TerminalTable";
import { TerminalFormModal } from "@/components/terminal/TerminalFormModal";

export function TerminalConfig() {
  const {
    // State
    selectedTerminal,
    isModalOpen,
    formData,
    formErrors,
    filters,

    // Computed data
    filteredTerminals,
    locationOptions,
    rateOptions,

    // Loading states
    isLoading,
    terminalsError,

    // Helper functions
    getRateName,

    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    updateFilters,
    updateFormField,
    refreshData,
  } = useTerminalConfig();

  // Early return untuk loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 ">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TerminalHeader onRefresh={refreshData} onAddNew={openCreateModal} />

      <TerminalFilters
        searchTerm={filters.searchTerm}
        locationFilter={filters.locationFilter}
        rateFilter={filters.rateFilter}
        locationOptions={locationOptions}
        rateOptions={rateOptions}
        onUpdateFilters={updateFilters}
      />

      <TerminalTable
        terminals={filteredTerminals}
        isLoading={false} // sudah di-handle di level atas
        error={terminalsError}
        getRateName={getRateName}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <TerminalFormModal
        isOpen={isModalOpen}
        isEdit={!!selectedTerminal}
        formData={formData}
        formErrors={formErrors}
        rateOptions={rateOptions}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onUpdateField={updateFormField}
      />
    </div>
  );
}
