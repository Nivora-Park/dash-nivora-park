import React from "react";
import { Users, CheckCircle, Shield, User } from "lucide-react";

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  operatorUsers: number;
}

export function UserStats({
  totalUsers,
  activeUsers,
  adminUsers,
  operatorUsers,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Aktif</p>
            <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Admin</p>
            <p className="text-2xl font-bold text-red-600">{adminUsers}</p>
          </div>
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Operator</p>
            <p className="text-2xl font-bold text-blue-600">{operatorUsers}</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
