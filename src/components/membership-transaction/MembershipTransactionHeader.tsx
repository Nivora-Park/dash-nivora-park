import React from "react";
import { Receipt } from "lucide-react";

interface MembershipTransactionHeaderProps {
  onRefresh: () => void;
}

export function MembershipTransactionHeader({
  onRefresh,
}: MembershipTransactionHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Receipt className="h-8 w-8" />
          Membership Transactions
        </h1>
        <p className="text-gray-600">
          View and monitor membership payment transactions
        </p>
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
