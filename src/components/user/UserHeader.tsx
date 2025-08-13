import React from "react";
import { UserPlus } from "lucide-react";

interface UserHeaderProps {
  onCreateUser: () => void;
}

export function UserHeader({ onCreateUser }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <p className="text-gray-600">Kelola pengguna dan hak akses sistem</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onCreateUser}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>
    </div>
  );
}
