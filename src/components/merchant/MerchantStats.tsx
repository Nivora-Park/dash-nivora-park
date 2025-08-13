"use client";

import React from "react";
import { Building2, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface StatsProps {
  stats: {
    total: number;
    active: number;
    expiring: number;
    expired: number;
  };
}

export function MerchantStats({ stats }: StatsProps) {
  const statsData = [
    {
      id: "total",
      label: "Total Merchant",
      value: stats.total,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: "active",
      label: "Kontrak Aktif",
      value: stats.active,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: "expiring",
      label: "Akan Berakhir",
      value: stats.expiring,
      icon: AlertTriangle,
      color: "bg-yellow-50 text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      id: "expired",
      label: "Kontrak Habis",
      value: stats.expired,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div
                className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-6 h-6 ${stat.color.split(" ")[1]}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
