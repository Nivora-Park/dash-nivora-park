'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Car, 
  Clock,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { TransactionChart } from './TransactionChart';
import { TransactionTable } from './TransactionTable';

export function TransactionMonitoring() {
  const [timeFilter, setTimeFilter] = useState('today');

  const stats = [
    {
      title: 'Total Transaksi Hari Ini',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Pendapatan Hari Ini',
      value: 'Rp 8,450,000',
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-blue-500'
    },
    {
      title: 'Kendaraan Aktif',
      value: '89',
      change: '-3.1%',
      changeType: 'negative',
      icon: Car,
      color: 'bg-purple-500'
    },
    {
      title: 'Rata-rata Durasi',
      value: '2h 15m',
      change: '+5.3%',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring Transaksi</h1>
          <p className="text-gray-600">Pantau transaksi parkir real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Hari Ini</option>
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs kemarin</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tren Transaksi</h3>
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
          <TransactionChart />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Status Terminal</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Online</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Terminal A1', status: 'online', transactions: 45 },
              { name: 'Terminal A2', status: 'online', transactions: 38 },
              { name: 'Terminal B1', status: 'offline', transactions: 0 },
              { name: 'Terminal B2', status: 'online', transactions: 52 }
            ].map((terminal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    terminal.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900">{terminal.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {terminal.transactions} transaksi
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
              <Eye className="w-4 h-4" />
              <span>Lihat Semua</span>
            </button>
          </div>
        </div>
        <TransactionTable />
      </div>
    </div>
  );
} 