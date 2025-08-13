import React from "react";
import { Plus, Package } from "lucide-react";

interface MembershipProductHeaderProps {
  onRefresh: () => void;
  onAddNew: () => void;
}

export function MembershipProductHeader({
  onRefresh,
  onAddNew,
}: MembershipProductHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-8 w-8" />
          Membership Products
        </h1>
        <p className="text-gray-600">
          Manage parking membership products and pricing
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
          onClick={onAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>
    </div>
  );
}
