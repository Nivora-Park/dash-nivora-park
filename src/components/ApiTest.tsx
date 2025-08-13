"use client";

import React from "react";
import { useApiTest } from "@/hooks/useApiTest";
import { ApiTestHeader } from "@/components/api/ApiTestHeader";
import { ApiEndpointStatus } from "@/components/api/ApiEndpointStatus";

export function ApiTest() {
  const { testResult, apiUrl, connectionStatus, testApiConnection, resetTest } =
    useApiTest();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <ApiTestHeader
        isLoading={testResult.loading}
        onTestApi={testApiConnection}
        onResetTest={resetTest}
      />

      {/* Endpoint Status */}
      <ApiEndpointStatus testResult={testResult} />

      {/* API Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>URL API:</strong> {apiUrl}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          <strong>Status:</strong> {connectionStatus}
        </p>
        {testResult.mode && (
          <p className="text-sm text-gray-600 mt-1">
            <strong>Mode:</strong>{" "}
            {testResult.mode === "direct"
              ? "Direct API Call"
              : "Proxy API Call"}
          </p>
        )}
      </div>
    </div>
  );
}
