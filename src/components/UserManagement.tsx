"use client";

import React, { useState } from "react";
import { useUserManagement } from "@/hooks/useUserManagement";
import { UserHeader } from "@/components/user/UserHeader";
import { UserStats } from "@/components/user/UserStats";
import { UserFilters } from "@/components/user/UserFilters";
import { UserTable } from "@/components/user/UserTable";
import { UserModal } from "@/components/user/UserModal";

export function UserManagement() {
  const {
    users,
    stats,
    filters,
    isLoading,
    error,
    updateFilters,
    createUser,
    editUser,
    deleteUser,
    fetchUsers,
  } = useUserManagement();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading users...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button
                  onClick={() => fetchUsers()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <UserHeader onCreateUser={() => setIsModalOpen(true)} />

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
          onEditUser={(userId) => {
            const user = users.find(u => u.id === userId);
            setEditingUser(user || null);
            setIsModalOpen(true);
          }}
          onDeleteUser={deleteUser}
        />
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        user={editingUser}
        isEditing={!!editingUser}
        onSubmit={async (data) => {
          try {
            setIsSubmitting(true);
            if (editingUser) {
              await editUser(editingUser.id, data);
            } else {
              await createUser(data);
            }
            setIsModalOpen(false);
            setEditingUser(null);
          } catch (error) {
            console.error('User operation failed:', error);
          } finally {
            setIsSubmitting(false);
          }
        }}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        isLoading={isSubmitting}
      />
    </div>
  );
}
