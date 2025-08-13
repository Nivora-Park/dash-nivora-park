import React from "react";
import { Plus, CreditCard } from "lucide-react";

interface PaymentConfigHeaderProps {
  onRefresh: () => void;
  onAddPaymentType: () => void;
  onAddRate: () => void;
}

export function PaymentConfigHeader({
  onRefresh,
  onAddPaymentType,
  onAddRate,
}: PaymentConfigHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          Payment Configuration
        </h1>
        <p className="text-gray-600">
          Manage payment methods and parking rates
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={onAddPaymentType}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Payment Method</span>
        </button>
        <button
          onClick={onAddRate}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Rate</span>
        </button>
      </div>
    </div>
  );
}
