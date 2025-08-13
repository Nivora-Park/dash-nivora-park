import React from "react";
import { TestTube, RefreshCw } from "lucide-react";

interface ApiTestHeaderProps {
  isLoading: boolean;
  onTestApi: () => void;
  onResetTest: () => void;
}

export function ApiTestHeader({
  isLoading,
  onTestApi,
  onResetTest,
}: ApiTestHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900">Test Koneksi API</h3>
      <div className="flex items-center space-x-2">
        <button
          onClick={onResetTest}
          disabled={isLoading}
          className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Reset
        </button>
        <button
          onClick={onTestApi}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <TestTube className="w-4 h-4" />
          )}
          <span>{isLoading ? "Testing..." : "Test API"}</span>
        </button>
      </div>
    </div>
  );
}
