import React from "react";
import { Package, DollarSign, MapPin, Calendar } from "lucide-react";

interface MembershipProductStatsProps {
  totalProducts: number;
  activeProducts: number;
  totalRevenue: number;
  averagePrice: number;
}

export function MembershipProductStats({
  totalProducts,
  activeProducts,
  totalRevenue,
  averagePrice,
}: MembershipProductStatsProps) {
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
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Products</p>
            <p className="text-2xl font-bold text-green-600">
              {activeProducts}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <MapPin className="h-6 w-6 text-green-600" />
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

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Price</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(averagePrice)}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
