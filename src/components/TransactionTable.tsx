'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Car, Bike } from 'lucide-react';

const transactions = [
  {
    id: 'TRX-001',
    plateNumber: 'B 1234 ABC',
    vehicleType: 'car',
    entryTime: '08:30',
    exitTime: '12:45',
    duration: '4h 15m',
    amount: 25000,
    paymentMethod: 'QRIS',
    status: 'completed',
    terminal: 'A1'
  },
  {
    id: 'TRX-002',
    plateNumber: 'B 5678 DEF',
    vehicleType: 'motorcycle',
    entryTime: '09:15',
    exitTime: '11:30',
    duration: '2h 15m',
    amount: 15000,
    paymentMethod: 'Cash',
    status: 'completed',
    terminal: 'A2'
  },
  {
    id: 'TRX-003',
    plateNumber: 'B 9012 GHI',
    vehicleType: 'car',
    entryTime: '10:00',
    exitTime: null,
    duration: '-',
    amount: 0,
    paymentMethod: '-',
    status: 'active',
    terminal: 'B1'
  },
  {
    id: 'TRX-004',
    plateNumber: 'B 3456 JKL',
    vehicleType: 'motorcycle',
    entryTime: '07:45',
    exitTime: '14:20',
    duration: '6h 35m',
    amount: 35000,
    paymentMethod: 'E-Wallet',
    status: 'completed',
    terminal: 'B2'
  },
  {
    id: 'TRX-005',
    plateNumber: 'B 7890 MNO',
    vehicleType: 'car',
    entryTime: '11:30',
    exitTime: '16:45',
    duration: '5h 15m',
    amount: 30000,
    paymentMethod: 'QRIS',
    status: 'completed',
    terminal: 'A1'
  }
];

export function TransactionTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Selesai</span>;
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Aktif</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getVehicleIcon = (type: string) => {
    return type === 'car' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />;
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari plat nomor atau ID transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Semua Status</option>
            <option value="completed">Selesai</option>
            <option value="active">Aktif</option>
          </select>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter Lanjutan</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">ID Transaksi</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Kendaraan</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Masuk</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Keluar</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Durasi</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Biaya</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Pembayaran</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Terminal</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{transaction.id}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {getVehicleIcon(transaction.vehicleType)}
                    <span className="font-medium text-gray-900">{transaction.plateNumber}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600">{transaction.entryTime}</td>
                <td className="py-3 px-4 text-gray-600">{transaction.exitTime || '-'}</td>
                <td className="py-3 px-4 text-gray-600">{transaction.duration}</td>
                <td className="py-3 px-4">
                  {transaction.amount > 0 ? (
                    <span className="font-medium text-gray-900">Rp {transaction.amount.toLocaleString()}</span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600">{transaction.paymentMethod}</td>
                <td className="py-3 px-4">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="py-3 px-4 text-gray-600">{transaction.terminal}</td>
                <td className="py-3 px-4">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            Sebelumnya
          </button>
          <span className="px-3 py-1 text-sm font-medium text-gray-900 bg-blue-100 rounded">1</span>
          <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
} 