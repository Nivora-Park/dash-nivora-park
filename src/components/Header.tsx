"use client";

import {
  Bell,
  Search,
  User,
  Settings,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ApiStatus } from "./ApiStatus";
import { useLocationSwitcher } from "@/hooks/useLocationSwitcher";

export function Header() {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    currentLocation,
    currentMerchant,
    locations,
    setCurrentLocation,
    loading,
  } = useLocationSwitcher();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Location Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex items-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {currentLocation?.name || "Pilih Lokasi"}
                </div>
                <div className="text-xs text-gray-500">
                  {currentMerchant?.name || "Loading..."}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showLocationDropdown && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">
                    Pilih Lokasi
                  </h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => {
                        setCurrentLocation(location);
                        setShowLocationDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 ${
                        currentLocation?.id === location.id
                          ? "bg-emerald-50 border-r-2 border-emerald-500"
                          : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {location.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {location.address}
                        </div>
                      </div>
                    </button>
                  ))}
                  {locations.length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Tidak ada lokasi tersedia
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari transaksi, terminal, atau pengguna..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* API Status */}
          <ApiStatus />

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                Admin Nivora
              </div>
              <div className="text-xs text-gray-500">Super Admin</div>
            </div>
            <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
