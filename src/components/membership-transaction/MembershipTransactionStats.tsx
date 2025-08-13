import React from "react";
import { Receipt, DollarSign, TrendingUp, Users } from "lucide-react";

interface MembershipTransactionStatsProps {
  totalTransactions: number;
  totalAmount: number;
  monthlyGrowth: number;
  activeMembers: number;
}

export function MembershipTransactionStats({
  totalTransactions,
  totalAmount,
  monthlyGrowth,
  activeMembers,
}: MembershipTransactionStatsProps) {
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
              Total Transactions
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalTransactions}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Receipt className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
            <p className="text-2xl font-bold text-purple-600">
              {monthlyGrowth}%
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Members</p>
            <p className="text-2xl font-bold text-orange-600">
              {activeMembers}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <Users className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
