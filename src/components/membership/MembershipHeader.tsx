import React from "react";
import { Plus, Users, Upload } from "lucide-react";

interface MembershipHeaderProps {
  onRefresh: () => void;
  onAddNew: () => void;
  onImport: () => void;
}

export function MembershipHeader({
  onRefresh,
  onAddNew,
  onImport,
}: MembershipHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Membership Management
        </h1>
        <p className="text-gray-600">Manage parking membership members</p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
        <button
          onClick={onImport}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Import CSV</span>
        </button>
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Membership</span>
        </button>
      </div>
    </div>
  );
}
