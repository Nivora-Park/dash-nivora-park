"use client";

import React from "react";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import { PaymentConfigHeader } from "@/components/payment/PaymentConfigHeader";
import { PaymentConfigTabs } from "@/components/payment/PaymentConfigTabs";
import { PaymentStats } from "@/components/payment/PaymentStats";
import { PaymentMethodTable } from "@/components/payment/PaymentMethodTable";
import { ParkingRateTable } from "@/components/payment/ParkingRateTable";

export function PaymentConfig() {
  const {
    // State
    activeTab,
    isPaymentModalOpen,
    isRateModalOpen,
    selectedPaymentType,
    selectedRate,
    paymentFormData,
    rateFormData,

    // Data
    paymentTypes,
    rates,
    vehicleTypes,
    stats,

    // Loading states
    paymentTypesLoading,
    ratesLoading,
    paymentTypesError,
    ratesError,

    // Helper functions
    getVehicleTypeName,

    // Actions
    setActiveTab,
    openCreatePaymentModal,
    openEditPaymentModal,
    closePaymentModal,
    handleCreatePaymentType,
    handleUpdatePaymentType,
    handleDeletePaymentType,
    openCreateRateModal,
    openEditRateModal,
    closeRateModal,
    handleCreateRate,
    handleUpdateRate,
    handleDeleteRate,
    updatePaymentFormField,
    updateRateFormField,
  } = usePaymentConfig();

  return (
    <div className="space-y-6">
      <PaymentConfigHeader
        onRefresh={() => {}}
        onAddPaymentType={openCreatePaymentModal}
        onAddRate={openCreateRateModal}
      />

      <PaymentStats
        totalTransactions={stats.totalTransactions}
        totalRevenue={stats.totalRevenue}
        activeMethods={stats.activeMethods}
        avgTransaction={stats.avgTransaction}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <PaymentConfigTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-6">
          {activeTab === "methods" ? (
            <PaymentMethodTable
              paymentTypes={paymentTypes}
              isLoading={paymentTypesLoading}
              error={paymentTypesError}
              onEdit={openEditPaymentModal}
              onDelete={(id, name) => handleDeletePaymentType(id)}
            />
          ) : (
            <ParkingRateTable
              rates={rates}
              isLoading={ratesLoading}
              error={ratesError}
              getVehicleTypeName={getVehicleTypeName}
              onEdit={openEditRateModal}
              onDelete={(id, name) => handleDeleteRate(id)}
            />
          )}
        </div>
      </div>

      {/* Payment Type Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedPaymentType
                  ? "Edit Metode Pembayaran"
                  : "Tambah Metode Pembayaran"}
              </h3>
              <button
                onClick={closePaymentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode *
                </label>
                <input
                  type="text"
                  value={paymentFormData.code}
                  onChange={(e) =>
                    updatePaymentFormField("code", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: QRIS, CASH, CARD"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama *
                </label>
                <input
                  type="text"
                  value={paymentFormData.name}
                  onChange={(e) =>
                    updatePaymentFormField("name", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: QRIS, Cash, Credit Card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={paymentFormData.description}
                  onChange={(e) =>
                    updatePaymentFormField("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Deskripsi metode pembayaran"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={paymentFormData.logo_url}
                  onChange={(e) =>
                    updatePaymentFormField("logo_url", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closePaymentModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={
                  selectedPaymentType
                    ? handleUpdatePaymentType
                    : handleCreatePaymentType
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedPaymentType ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Modal */}
      {isRateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedRate ? "Edit Tarif Parkir" : "Tambah Tarif Parkir"}
              </h3>
              <button
                onClick={closeRateModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={rateFormData.description}
                  onChange={(e) =>
                    updateRateFormField("description", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Tarif mobil per jam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Pertama (Rp) *
                </label>
                <input
                  type="number"
                  value={rateFormData.first_hour_cost}
                  onChange={(e) =>
                    updateRateFormField(
                      "first_hour_cost",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Berikutnya (Rp) *
                </label>
                <input
                  type="number"
                  value={rateFormData.subsequent_hour_cost}
                  onChange={(e) =>
                    updateRateFormField(
                      "subsequent_hour_cost",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimal Harian (Rp) *
                </label>
                <input
                  type="number"
                  value={rateFormData.daily_max_cost}
                  onChange={(e) =>
                    updateRateFormField(
                      "daily_max_cost",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiket Hilang (Rp) *
                </label>
                <input
                  type="number"
                  value={rateFormData.lost_ticket_cost}
                  onChange={(e) =>
                    updateRateFormField(
                      "lost_ticket_cost",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pajak (Rp)
                </label>
                <input
                  type="number"
                  value={rateFormData.tax_cost}
                  onChange={(e) =>
                    updateRateFormField(
                      "tax_cost",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biaya Layanan (Rp)
                </label>
                <input
                  type="number"
                  value={rateFormData.service_cost}
                  onChange={(e) =>
                    updateRateFormField(
                      "service_cost",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeRateModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={selectedRate ? handleUpdateRate : handleCreateRate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedRate ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
