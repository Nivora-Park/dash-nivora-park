import React from "react";

interface PaymentConfigTabsProps {
  activeTab: "methods" | "rates";
  onTabChange: (tab: "methods" | "rates") => void;
}

export function PaymentConfigTabs({
  activeTab,
  onTabChange,
}: PaymentConfigTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange("methods")}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === "methods"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Payment Methods
        </button>
        <button
          onClick={() => onTabChange("rates")}
          className={`py-2 px-1 border-b-2 font-medium text-sm ${
            activeTab === "rates"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Parking Rates
        </button>
      </nav>
    </div>
  );
}
