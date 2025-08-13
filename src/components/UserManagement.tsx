"use client";

import React from "react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserHeader } from "@/components/user/UserHeader";
import { UserStats } from "@/components/user/UserStats";
import { UserFilters } from "@/components/user/UserFilters";
import { UserTable } from "@/components/user/UserTable";

export function UserManagement() {
  const {
    users,
    stats,
    filters,
    updateFilters,
    createUser,
    editUser,
    deleteUser,
  } = useUserManagement();

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserHeader onCreateUser={createUser} />

      {/* Stats Cards */}
      <UserStats
        totalUsers={stats.totalUsers}
        activeUsers={stats.activeUsers}
        adminUsers={stats.adminUsers}
        operatorUsers={stats.operatorUsers}
      />

      {/* User List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Daftar Pengguna
            </h3>
            <UserFilters
              searchTerm={filters.searchTerm}
              roleFilter={filters.roleFilter}
              statusFilter={filters.statusFilter}
              onSearchChange={(value) => updateFilters({ searchTerm: value })}
              onRoleFilterChange={(value) =>
                updateFilters({ roleFilter: value })
              }
              onStatusFilterChange={(value) =>
                updateFilters({ statusFilter: value })
              }
            />
          </div>
        </div>

        <UserTable
          users={users}
          totalUsers={stats.totalUsers}
          onEditUser={editUser}
          onDeleteUser={deleteUser}
        />
      </div>
    </div>
  );
}
