"use client";

import React from "react";
import { Search, Filter, Building2 } from "lucide-react";
import type { Merchant } from "@/types/api";

interface LocationFiltersProps {
  filters: {
    searchTerm: string;
    merchantId: string;
    contractStatus: "all" | "active" | "expired" | "expiring";
  };
  onUpdateFilters: (filters: Partial<LocationFiltersProps["filters"]>) => void;
  merchants: Merchant[];
}

export function LocationFilters({
  filters,
  onUpdateFilters,
  merchants,
}: LocationFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari lokasi..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>

        {/* Merchant Filter */}
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filters.merchantId}
            onChange={(e) => onUpdateFilters({ merchantId: e.target.value })}
            className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white min-w-[180px]"
          >
            <option value="">Semua Merchant</option>
            {merchants.map((merchant) => (
              <option key={merchant.id} value={merchant.id}>
                {merchant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Contract Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={filters.contractStatus}
            onChange={(e) =>
              onUpdateFilters({
                contractStatus: e.target.value as
                  | "all"
                  | "active"
                  | "expired"
                  | "expiring",
              })
            }
            className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white min-w-[160px]"
          >
            <option value="all">Semua Status</option>
            <option value="active">Kontrak Aktif</option>
            <option value="expiring">Akan Berakhir</option>
            <option value="expired">Kontrak Habis</option>
          </select>
        </div>
      </div>
    </div>
  );
}
