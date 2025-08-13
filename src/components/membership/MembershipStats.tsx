import React from "react";
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react";

interface MembershipStatsProps {
  totalMemberships: number;
  activeMemberships: number;
  expiringMemberships: number;
  totalRevenue: number;
}

export function MembershipStats({
  totalMemberships,
  activeMemberships,
  expiringMemberships,
  totalRevenue,
}: MembershipStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Memberships
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalMemberships}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Active Memberships
            </p>
            <p className="text-2xl font-bold text-green-600">
              {activeMemberships}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
            <p className="text-2xl font-bold text-orange-600">
              {expiringMemberships}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
