"use client";

import {
  BarChart3,
  Settings,
  CreditCard,
  Car,
  Activity,
  Users,
  FileText,
  TestTube,
  Building2,
  MapPin,
  Package,
  CreditCard as MembershipIcon,
  Truck,
  Receipt,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";
import { Logo } from "@/components/ui/Logo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  const menuItems = [
    {
      id: "monitoring",
      label: "Monitoring Transaksi",
      icon: BarChart3,
      description: "Pantau transaksi parkir real-time",
    },
    {
      id: "merchants",
      label: "Manajemen Merchant",
      icon: Building2,
      description: "Kelola data merchant",
    },
    {
      id: "locations",
      label: "Manajemen Lokasi",
      icon: MapPin,
      description: "Kelola lokasi parkir",
    },
    {
      id: "membership-products",
      label: "Produk Membership",
      icon: Package,
      description: "Kelola produk membership",
    },
    {
      id: "memberships",
      label: "Data Membership",
      icon: MembershipIcon,
      description: "Kelola member parkir",
    },
    {
      id: "membership-vehicles",
      label: "Kendaraan Member",
      icon: Truck,
      description: "Kelola kendaraan member",
    },
    {
      id: "membership-transactions",
      label: "Transaksi Member",
      icon: Receipt,
      description: "Monitor transaksi member",
    },
    {
      id: "terminal",
      label: "Konfigurasi Terminal",
      icon: Settings,
      description: "Kelola terminal parkir",
    },
    {
      id: "payment",
      label: "Konfigurasi Payment",
      icon: CreditCard,
      description: "Atur metode pembayaran",
    },
    {
      id: "vehicles",
      label: "Kendaraan",
      icon: Car,
      description: "Data kendaraan parkir",
    },
    {
      id: "reports",
      label: "Laporan",
      icon: FileText,
      description: "Laporan dan analitik",
    },
    {
      id: "users",
      label: "Pengguna",
      icon: Users,
      description: "Kelola pengguna sistem",
    },
    {
      id: "api-test",
      label: "Test API",
      icon: TestTube,
      description: "Test koneksi API",
    },
  ];

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out relative`}
    >
      {/* Header */}
      <div
        className={`${
          isCollapsed ? "p-3" : "p-6"
        } border-b border-gray-200 transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo 
              size="medium" 
              showText={!isCollapsed}
              showTagline={false}
              className="min-w-0"
            />
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div
          className={`${
            isCollapsed ? "px-2" : "px-3"
          } transition-all duration-300`}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center ${
                    isCollapsed
                      ? "justify-center px-2 py-3"
                      : "space-x-3 px-3 py-3"
                  } rounded-lg mb-1 transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  {!isCollapsed && (
                    <div className="flex-1 text-left transition-opacity duration-300">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300">
                      {item.description}
                    </div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                      <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
