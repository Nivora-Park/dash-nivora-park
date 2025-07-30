'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  Plus, 
  Edit, 
  CheckCircle,
  QrCode,
  Smartphone
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'qris' | 'cash' | 'ewallet' | 'card';
  status: 'active' | 'inactive' | 'maintenance';
  icon: LucideIcon;
  description: string;
  transactionCount: number;
  totalAmount: number;
}

interface RateConfig {
  id: string;
  vehicleType: 'car' | 'motorcycle';
  duration: string;
  rate: number;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'PM-001',
    name: 'QRIS',
    type: 'qris',
    status: 'active',
    icon: QrCode,
    description: 'Pembayaran QRIS',
    transactionCount: 456,
    totalAmount: 12500000
  },
  {
    id: 'PM-002',
    name: 'Cash',
    type: 'cash',
    status: 'active',
    icon: DollarSign,
    description: 'Pembayaran Tunai',
    transactionCount: 234,
    totalAmount: 6800000
  },
  {
    id: 'PM-003',
    name: 'E-Wallet',
    type: 'ewallet',
    status: 'active',
    icon: Smartphone,
    description: 'GoPay, OVO, DANA',
    transactionCount: 189,
    totalAmount: 5200000
  },
  {
    id: 'PM-004',
    name: 'Credit Card',
    type: 'card',
    status: 'inactive',
    icon: CreditCard,
    description: 'Kartu Kredit/Debit',
    transactionCount: 0,
    totalAmount: 0
  }
];

const rateConfigs: RateConfig[] = [
  {
    id: 'RATE-001',
    vehicleType: 'car',
    duration: '1 jam pertama',
    rate: 5000,
    description: 'Tarif mobil per jam pertama'
  },
  {
    id: 'RATE-002',
    vehicleType: 'car',
    duration: 'Jam berikutnya',
    rate: 3000,
    description: 'Tarif mobil per jam berikutnya'
  },
  {
    id: 'RATE-003',
    vehicleType: 'motorcycle',
    duration: '1 jam pertama',
    rate: 3000,
    description: 'Tarif motor per jam pertama'
  },
  {
    id: 'RATE-004',
    vehicleType: 'motorcycle',
    duration: 'Jam berikutnya',
    rate: 2000,
    description: 'Tarif motor per jam berikutnya'
  }
];

export function PaymentConfig() {
  const [activeTab, setActiveTab] = useState('methods');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>;
      case 'inactive':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Nonaktif</span>;
      case 'maintenance':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Maintenance</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    return type === 'car' ? 'Mobil' : 'Motor';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Payment</h1>
          <p className="text-gray-600">Kelola metode pembayaran dan tarif parkir</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Tambah Metode</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-900">
                {paymentMethods.reduce((sum, method) => sum + method.transactionCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pendapatan</p>
              <p className="text-2xl font-bold text-green-600">
                Rp {paymentMethods.reduce((sum, method) => sum + method.totalAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Metode Aktif</p>
              <p className="text-2xl font-bold text-blue-600">
                {paymentMethods.filter(m => m.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Transaksi</p>
              <p className="text-2xl font-bold text-purple-600">
                Rp {Math.round(paymentMethods.reduce((sum, method) => sum + method.totalAmount, 0) / 
                    paymentMethods.reduce((sum, method) => sum + method.transactionCount, 0)).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('methods')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'methods'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Metode Pembayaran
            </button>
            <button
              onClick={() => setActiveTab('rates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Konfigurasi Tarif
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'methods' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{method.name}</span>
                        </div>
                        {getStatusBadge(method.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Transaksi:</span>
                          <span className="font-medium">{method.transactionCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">Rp {method.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4">
                        <button className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          Edit
                        </button>
                        <button className="flex-1 px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                          {method.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Konfigurasi Tarif Parkir</h3>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tarif</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rateConfigs.map((rate) => (
                  <div key={rate.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{getVehicleTypeLabel(rate.vehicleType)}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{rate.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">Rp {rate.rate.toLocaleString()}</span>
                        <button className="p-1 text-blue-600 hover:text-blue-700 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{rate.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Pembayaran</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeout Pembayaran</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="300">5 menit</option>
                <option value="600">10 menit</option>
                <option value="900">15 menit</option>
                <option value="1800">30 menit</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mata Uang</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD (Dollar)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pembulatan</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="none">Tidak ada pembulatan</option>
                <option value="up">Pembulatan ke atas</option>
                <option value="down">Pembulatan ke bawah</option>
                <option value="nearest">Pembulatan terdekat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notifikasi</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">Email notifikasi pembayaran</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="ml-2 text-sm text-gray-700">SMS notifikasi pembayaran</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Reset
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
} 