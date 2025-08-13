"use client";

import React from "react";
import { MapPin, Plus } from "lucide-react";

interface LocationHeaderProps {
  onAddLocation: () => void;
}

export function LocationHeader({ onAddLocation }: LocationHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <MapPin className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Lokasi</h1>
          <p className="text-sm text-gray-500">
            Kelola lokasi parkir per merchant
          </p>
        </div>
      </div>

      <button
        onClick={onAddLocation}
        className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Lokasi</span>
      </button>
    </div>
  );
}
