import React from "react";
import { Settings, Edit, Trash2 } from "lucide-react";
import { ParkingTerminal } from "@/types/api";

interface TerminalTableProps {
  terminals: ParkingTerminal[];
  isLoading: boolean;
  error: string | null;
  onEdit: (terminal: ParkingTerminal) => void;
  onDelete: (terminalId: string) => void;
}

export function TerminalTable({
  terminals,
  isLoading,
  error,
  onEdit,
  onDelete,
}: TerminalTableProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 ">
          <h3 className="text-lg font-semibold text-gray-900 ">
            Daftar Terminal
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 ">Memuat data terminal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 ">
          <h3 className="text-lg font-semibold text-gray-900 ">
            Daftar Terminal
          </h3>
        </div>
        <div className="p-6 text-center text-red-600 ">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 ">
        <h3 className="text-lg font-semibold text-gray-900 ">
          Daftar Terminal
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 ">
              <th className="text-left py-3 px-6 font-medium text-gray-900 ">
                Terminal
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900 ">
                IP Terminal
              </th>
              <th className="text-left py-3 px-6 font-medium text-gray-900 ">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {terminals.map((terminal: ParkingTerminal) => (
              <tr
                key={terminal.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                      {terminal.logo_url ? (
                        <img
                          src={terminal.logo_url}
                          alt={`${terminal.name} logo`}
                          className="w-8 h-8 object-contain border rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Settings className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 ">
                        {terminal.name}
                      </div>
                      <div className="text-sm text-gray-500 ">
                        ID: {terminal.code}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600 ">
                  {terminal.ip_terminal || "Tidak ada data"}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(terminal)}
                      className="p-1 text-blue-600 hover:text-blue-700 rounded transition-colors duration-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(terminal.id)}
                      className="p-1 text-red-600 hover:text-red-700 rounded transition-colors duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {terminals.length === 0 && (
          <div className="p-6 text-center text-gray-500 ">
            Tidak ada terminal yang ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
