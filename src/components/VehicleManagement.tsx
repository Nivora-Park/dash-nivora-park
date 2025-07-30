'use client';

import { useState } from 'react';
import { 
  Car, 
  Bike, 
  Search, 
  Clock, 
  MapPin, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreVertical
} from 'lucide-react';

interface Vehicle {
  id: string;
  plateNumber: string;
  vehicleType: 'car' | 'motorcycle';
  entryTime: string;
  duration: string;
  location: string;
  status: 'parked' | 'left' | 'overdue';
  amount: number;
  terminal: string;
}

const vehicles: Vehicle[] = [
  {
    id: 'VEH-001',
    plateNumber: 'B 1234 ABC',
    vehicleType: 'car',
    entryTime: '08:30',
    duration: '4h 15m',
    location: 'Lantai 1 - A12',
    status: 'parked',
    amount: 25000,
    terminal: 'A1'
  },
  {
    id: 'VEH-002',
    plateNumber: 'B 5678 DEF',
    vehicleType: 'motorcycle',
    entryTime: '09:15',
    duration: '2h 15m',
    location: 'Lantai 1 - M05',
    status: 'left',
    amount: 15000,
    terminal: 'A2'
  },
  {
    id: 'VEH-003',
    plateNumber: 'B 9012 GHI',
    vehicleType: 'car',
    entryTime: '10:00',
    duration: '6h 30m',
    location: 'Lantai 2 - B08',
    status: 'overdue',
    amount: 45000,
    terminal: 'B1'
  },
  {
    id: 'VEH-004',
    plateNumber: 'B 3456 JKL',
    vehicleType: 'motorcycle',
    entryTime: '07:45',
    duration: '8h 20m',
    location: 'Lantai 1 - M12',
    status: 'parked',
    amount: 35000,
    terminal: 'B2'
  },
  {
    id: 'VEH-005',
    plateNumber: 'B 7890 MNO',
    vehicleType: 'car',
    entryTime: '11:30',
    duration: '5h 45m',
    location: 'Lantai 2 - A15',
    status: 'parked',
    amount: 30000,
    terminal: 'A1'
  }
];

export function VehicleManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = vehicleTypeFilter === 'all' || vehicle.vehicleType === vehicleTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'parked':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Parkir</span>;
      case 'left':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Keluar</span>;
      case 'overdue':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{status}</span>;
    }
  };

  const getVehicleIcon = (type: string) => {
    return type === 'car' ? <Car className="w-4 h-4" /> : <Bike className="w-4 h-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'parked':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'left':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Kendaraan</h1>
          <p className="text-gray-600">Kelola dan monitor kendaraan parkir</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Lihat Peta</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kendaraan</p>
              <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sedang Parkir</p>
              <p className="text-2xl font-bold text-green-600">
                {vehicles.filter(v => v.status === 'parked').length}
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
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {vehicles.filter(v => v.status === 'overdue').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rata-rata Durasi</p>
              <p className="text-2xl font-bold text-purple-600">5h 20m</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Kendaraan</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari plat nomor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="parked">Sedang Parkir</option>
              <option value="left">Sudah Keluar</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Kendaraan</option>
              <option value="car">Mobil</option>
              <option value="motorcycle">Motor</option>
            </select>
          </div>
        </div>

        {/* Vehicle Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Kendaraan</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Lokasi</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Masuk</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Durasi</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Biaya</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Terminal</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900"></th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {getVehicleIcon(vehicle.vehicleType)}
                      <div>
                        <div className="font-medium text-gray-900">{vehicle.plateNumber}</div>
                        <div className="text-sm text-gray-500">ID: {vehicle.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(vehicle.status)}
                      {getStatusBadge(vehicle.status)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{vehicle.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{vehicle.entryTime}</td>
                  <td className="py-4 px-4 text-gray-600">{vehicle.duration}</td>
                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-900">Rp {vehicle.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{vehicle.terminal}</td>
                  <td className="py-4 px-4">
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
            Menampilkan {filteredVehicles.length} dari {vehicles.length} kendaraan
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
    </div>
  );
} 