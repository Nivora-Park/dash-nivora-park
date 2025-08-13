"use client";

import React from "react";
import {
  Plus,
  QrCode,
  DollarSign,
  Smartphone,
  CreditCard,
  Edit,
  Trash2,
  XCircle,
} from "lucide-react";
import { usePaymentConfig } from "@/hooks/usePaymentConfig";
import { PaymentStats } from "@/components/payment/PaymentStats";

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

  const getPaymentTypeIcon = (code: string) => {
    switch (code.toLowerCase()) {
      case "qris":
        return QrCode;
      case "cash":
        return DollarSign;
      case "ewallet":
        return Smartphone;
      case "card":
        return CreditCard;
      default:
        return CreditCard;
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Aktif
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Konfigurasi Payment
          </h1>
          <p className="text-gray-600">
            Kelola metode pembayaran dan tarif parkir
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={openCreatePaymentModal}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Metode</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <PaymentStats
        totalTransactions={stats.totalTransactions}
        totalRevenue={stats.totalRevenue}
        activeMethods={stats.activeMethods}
        avgTransaction={stats.avgTransaction}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("methods")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "methods"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Metode Pembayaran
            </button>
            <button
              onClick={() => setActiveTab("rates")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "rates"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Konfigurasi Tarif
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "methods" ? (
            <div className="space-y-6">
              {paymentTypesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    Memuat metode pembayaran...
                  </p>
                </div>
              ) : paymentTypesError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {paymentTypesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentTypes.map((paymentType) => {
                    const Icon = getPaymentTypeIcon(paymentType.code);
                    return (
                      <div
                        key={paymentType.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-900">
                              {paymentType.name}
                            </span>
                          </div>
                          {getStatusBadge("active")}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {paymentType.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Kode:</span>
                            <span className="font-medium">
                              {paymentType.code}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <button
                            onClick={() => openEditPaymentModal(paymentType)}
                            className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeletePaymentType(paymentType.id)
                            }
                            className="flex-1 px-3 py-1 text-xs border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Konfigurasi Tarif Parkir
                </h3>
                <button
                  onClick={openCreateRateModal}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tarif</span>
                </button>
              </div>

              {ratesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Memuat tarif parkir...</p>
                </div>
              ) : ratesError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {ratesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rates.map((rate) => (
                    <div
                      key={rate.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {getVehicleTypeName(rate.vehicle_type_id)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditRateModal(rate)}
                            className="p-1 text-blue-600 hover:text-blue-700 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRate(rate.id)}
                            className="p-1 text-red-600 hover:text-red-700 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {rate.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Jam pertama:</span>
                          <span className="font-medium">
                            Rp {rate.first_hour_cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Jam berikutnya:</span>
                          <span className="font-medium">
                            Rp {rate.subsequent_hour_cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            Maksimal harian:
                          </span>
                          <span className="font-medium">
                            Rp {rate.daily_max_cost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiket hilang:</span>
                          <span className="font-medium">
                            Rp {rate.lost_ticket_cost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                <XCircle className="w-5 h-5" />
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
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipe Kendaraan *
                </label>
                <select
                  value={rateFormData.vehicle_type_id}
                  onChange={(e) =>
                    updateRateFormField("vehicle_type_id", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Tipe Kendaraan</option>
                  {vehicleTypes.map((vt) => (
                    <option key={vt.id} value={vt.id}>
                      {vt.name}
                    </option>
                  ))}
                </select>
              </div>

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
