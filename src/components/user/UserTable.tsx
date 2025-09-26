import React from "react";
import {
  Edit,
  Trash2,
  Shield,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
} from "lucide-react";

interface SystemUser {
  id: string;
  username?: string;
  full_name?: string; // Changed from 'name' to 'full_name' to match API
  email?: string;
  role?: "admin" | "operator" | "viewer";
  status?: "active" | "inactive" | "suspended";
  lastLogin?: string | null;
  permissions?: string[];
  terminal?: string;
  location_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserTableProps {
  users: SystemUser[];
  totalUsers: number;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export function UserTable({
  users,
  totalUsers,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Admin
          </span>
        );
      case "operator":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Operator
          </span>
        );
      case "viewer":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Viewer
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {role}
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Aktif
          </span>
        );
      case "inactive":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Nonaktif
          </span>
        );
      case "suspended":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            Suspended
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {status}
          </span>
        );
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-500" />;
      case "operator":
        return <User className="w-4 h-4 text-blue-500" />;
      case "viewer":
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case "suspended":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Daftar Pengguna</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Pengguna
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Role
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Status
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Terminal
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Last Login
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Permissions
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id || `user-${index}`}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.full_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(user.role || 'viewer')}
                    {getRoleBadge(user.role || 'viewer')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(user.status || 'inactive')}
                    {getStatusBadge(user.status || 'inactive')}
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">{user.terminal || '-'}</td>
                <td className="py-4 px-6 text-gray-600">{user.lastLogin || '-'}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {(user.permissions || []).slice(0, 2).map((permission, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {permission}
                      </span>
                    ))}
                    {(user.permissions || []).length > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{(user.permissions || []).length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => user.id && onEditUser(user.id)}
                      className="p-1 text-blue-600 hover:text-blue-700 rounded"
                      disabled={!user.id}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => user.id && onDeleteUser(user.id)}
                      className="p-1 text-red-600 hover:text-red-700 rounded"
                      disabled={!user.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Menampilkan {users.length} dari {totalUsers} pengguna
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            Sebelumnya
          </button>
          <span className="px-3 py-1 text-sm font-medium text-gray-900 bg-blue-100 rounded">
            1
          </span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
