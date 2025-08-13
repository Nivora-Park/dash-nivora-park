"use client";

import React from "react";
import { Building2, Plus } from "lucide-react";

interface MerchantHeaderProps {
  onAddMerchant: () => void;
}

export function MerchantHeader({ onAddMerchant }: MerchantHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Merchant
          </h1>
          <p className="text-sm text-gray-500">
            Kelola data merchant dan kontrak
          </p>
        </div>
      </div>

      <button
        onClick={onAddMerchant}
        className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Merchant</span>
      </button>
    </div>
  );
}
