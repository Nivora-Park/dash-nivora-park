"use client";

import React from "react";
import { X, Building2 } from "lucide-react";
import { UploadButton } from "@/components/common/UploadButton";
import type { Merchant } from "@/types/api";

interface MerchantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
  editingMerchant: Merchant | null;
  formData: {
    code: string;
    name: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    contract_start: string;
    contract_end: string;
    logo_url: string;
  };
  updateFormField: (
    field: keyof MerchantFormModalProps["formData"],
    value: string
  ) => void;
  loading: boolean;
  error: string | null;
}

export function MerchantFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingMerchant,
  formData,
  updateFormField,
  loading,
  error,
}: MerchantFormModalProps) {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingMerchant ? "Edit Merchant" : "Tambah Merchant"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Merchant *
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => updateFormField("code", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Merchant *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormField("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormField("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => updateFormField("address", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateFormField("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telepon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormField("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai Kontrak *
              </label>
              <input
                type="date"
                value={formData.contract_start}
                onChange={(e) =>
                  updateFormField("contract_start", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Berakhir Kontrak *
              </label>
              <input
                type="date"
                value={formData.contract_end}
                onChange={(e) =>
                  updateFormField("contract_end", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Logo
            </label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => updateFormField("logo_url", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com/logo.png"
            />
            <div className="mt-2 flex items-center gap-3">
              <UploadButton
                label="Upload Logo"
                allowedExt="jpg,jpeg,png,svg"
                onUploaded={({ url }) => updateFormField("logo_url", url)}
              />
              {formData.logo_url && (
                <img
                  src={formData.logo_url}
                  alt="Logo preview"
                  className="h-10 w-10 object-contain border rounded"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyimpan..." : editingMerchant ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
