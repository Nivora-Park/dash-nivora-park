import React from "react";
import { RefreshCw, Plus } from "lucide-react";

interface TerminalHeaderProps {
  onRefresh: () => void;
  onAddNew: () => void;
}

export function TerminalHeader({ onRefresh, onAddNew }: TerminalHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 transition-colors duration-300">
          Konfigurasi Terminal
        </h1>
        <p className="text-gray-600 transition-colors duration-300">
          Kelola dan monitor terminal parkir
        </p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Terminal</span>
        </button>
      </div>
    </div>
  );
}
