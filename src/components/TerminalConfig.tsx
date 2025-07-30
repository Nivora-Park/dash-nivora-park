'use client';

import { useState } from 'react';
import { 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface Terminal {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  ipAddress: string;
  lastSeen: string;
  transactions: number;
  capacity: number;
  currentOccupancy: number;
}

const terminals: Terminal[] = [
  {
    id: 'TERM-001',
    name: 'Terminal A1',
    location: 'Lantai 1 - Area A',
    status: 'online',
    ipAddress: '192.168.1.101',
    lastSeen: '2 menit yang lalu',
    transactions: 45,
    capacity: 50,
    currentOccupancy: 38
  },
  {
    id: 'TERM-002',
    name: 'Terminal A2',
    location: 'Lantai 1 - Area A',
    status: 'online',
    ipAddress: '192.168.1.102',
    lastSeen: '1 menit yang lalu',
    transactions: 38,
    capacity: 50,
    currentOccupancy: 42
  },
  {
    id: 'TERM-003',
    name: 'Terminal B1',
    location: 'Lantai 2 - Area B',
    status: 'offline',
    ipAddress: '192.168.1.103',
    lastSeen: '15 menit yang lalu',
    transactions: 0,
    capacity: 40,
    currentOccupancy: 0
  },
  {
    id: 'TERM-004',
    name: 'Terminal B2',
    location: 'Lantai 2 - Area B',
    status: 'maintenance',
    ipAddress: '192.168.1.104',
    lastSeen: '5 menit yang lalu',
    transactions: 52,
    capacity: 40,
    currentOccupancy: 35
  }
];

export function TerminalConfig() {
  const [selectedTerminal, setSelectedTerminal] = useState<Terminal | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Online</span>;
      case 'offline':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Offline</span>;
      case 'maintenance':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Maintenance</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Terminal</h1>
          <p className="text-gray-600">Kelola dan monitor terminal parkir</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
                    <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Terminal</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Terminal</p>
              <p className="text-2xl font-bold text-gray-900">{terminals.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600">
                {terminals.filter(t => t.status === 'online').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-red-600">
                {terminals.filter(t => t.status === 'offline').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Maintenance</p>
              <p className="text-2xl font-bold text-yellow-600">
                {terminals.filter(t => t.status === 'maintenance').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Terminal List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Terminal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-6 font-medium text-gray-900">Terminal</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Lokasi</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">IP Address</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Kapasitas</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Transaksi</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Last Seen</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {terminals.map((terminal) => (
                <tr key={terminal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(terminal.status)}
                      <div>
                        <div className="font-medium text-gray-900">{terminal.name}</div>
                        <div className="text-sm text-gray-500">ID: {terminal.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(terminal.status)}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{terminal.location}</td>
                  <td className="py-4 px-6 text-gray-600">{terminal.ipAddress}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getOccupancyPercentage(terminal.currentOccupancy, terminal.capacity)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {terminal.currentOccupancy}/{terminal.capacity}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{terminal.transactions}</td>
                  <td className="py-4 px-6 text-gray-600">{terminal.lastSeen}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-700 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-700 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Configuration Panel */}
      {selectedTerminal && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Konfigurasi Terminal</h3>
            <button 
              onClick={() => setSelectedTerminal(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Terminal</label>
                <input
                  type="text"
                  value={selectedTerminal.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                <input
                  type="text"
                  value={selectedTerminal.location}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
                <input
                  type="text"
                  value={selectedTerminal.ipAddress}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas</label>
                <input
                  type="number"
                  value={selectedTerminal.capacity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Simpan
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 