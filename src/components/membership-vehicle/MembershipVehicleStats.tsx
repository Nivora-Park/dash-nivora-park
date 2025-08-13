import React from "react";
import { Car, Users, Settings, CheckCircle } from "lucide-react";

interface MembershipVehicleStatsProps {
  totalVehicles: number;
  activeVehicles: number;
  vehicleTypes: number;
  registeredMembers: number;
}

export function MembershipVehicleStats({
  totalVehicles,
  activeVehicles,
  vehicleTypes,
  registeredMembers,
}: MembershipVehicleStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Vehicles</p>
            <p className="text-2xl font-bold text-gray-900">{totalVehicles}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Vehicles</p>
            <p className="text-2xl font-bold text-green-600">
              {activeVehicles}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Vehicle Types</p>
            <p className="text-2xl font-bold text-purple-600">{vehicleTypes}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Settings className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Registered Members
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {registeredMembers}
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
