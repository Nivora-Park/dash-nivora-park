'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  Plus, 
  Edit, 
  CheckCircle,
  QrCode,
  Smartphone,
  XCircle,
  Trash2
} from 'lucide-react';
import { useParkingPaymentTypes, useParkingRates, useParkingVehicleTypes } from '@/hooks/useApi';
import { ParkingPaymentType, ParkingRate, ParkingVehicleType } from '@/types/api';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'qris' | 'cash' | 'ewallet' | 'card';
  status: 'active' | 'inactive' | 'maintenance';
  icon: any;
  description: string;
  transactionCount: number;
  totalAmount: number;
}

export function PaymentConfig() {
  const [activeTab, setActiveTab] = useState('methods');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<ParkingPaymentType | null>(null);
  const [selectedRate, setSelectedRate] = useState<ParkingRate | null>(null);

  // API hooks
  const {
    data: paymentTypesData,
    loading: paymentTypesLoading,
    error: paymentTypesError,
    getPaymentTypes,
    createPaymentType,
    updatePaymentType,
    deletePaymentType
  } = useParkingPaymentTypes();

  const {
    data: ratesData,
    loading: ratesLoading,
    error: ratesError,
    getRates,
    createRate,
    updateRate,
    deleteRate
  } = useParkingRates();

  const {
    data: vehicleTypesData,
    loading: vehicleTypesLoading,
    getVehicleTypes
  } = useParkingVehicleTypes();

  // Form state for payment type
  const [paymentFormData, setPaymentFormData] = useState({
    location_id: '',
    code: '',
    name: '',
    description: '',
    logo_url: ''
  });

  // Form state for rate
  const [rateFormData, setRateFormData] = useState({
    vehicle_type_id: '',
    description: '',
    first_hour_cost: 0,
    subsequent_hour_cost: 0,
    daily_max_cost: 0,
    lost_ticket_cost: 0,
    tax_cost: 0,
    service_cost: 0
  });

  // Load data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      getPaymentTypes();
      getRates();
      getVehicleTypes();
    }
  }, [getPaymentTypes, getRates, getVehicleTypes]);

  // Set default location when data loads
  useEffect(() => {
    if (paymentTypesData && Array.isArray(paymentTypesData) && paymentTypesData.length > 0) {
      const firstPayment = paymentTypesData[0];
      if (firstPayment.location_id && !paymentFormData.location_id) {
        setPaymentFormData(prev => ({ ...prev, location_id: firstPayment.location_id }));
      }
    }
  }, [paymentTypesData]);

  useEffect(() => {
    if (vehicleTypesData && Array.isArray(vehicleTypesData) && vehicleTypesData.length > 0) {
      const firstVehicle = vehicleTypesData[0];
      if (firstVehicle.id && !rateFormData.vehicle_type_id) {
        setRateFormData(prev => ({ ...prev, vehicle_type_id: firstVehicle.id }));
      }
    }
  }, [vehicleTypesData]);

  const paymentTypes = Array.isArray(paymentTypesData) ? paymentTypesData : [];
  const rates = Array.isArray(ratesData) ? ratesData : [];
  const vehicleTypes = Array.isArray(vehicleTypesData) ? vehicleTypesData : [];

  // Helper functions
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

  const getVehicleTypeName = (vehicleTypeId: string) => {
    const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId);
    return vehicleType ? vehicleType.name : 'Tidak ditemukan';
  };

  const getPaymentTypeIcon = (code: string) => {
    switch (code.toLowerCase()) {
      case 'qris':
        return QrCode;
      case 'cash':
        return DollarSign;
      case 'ewallet':
        return Smartphone;
      case 'card':
        return CreditCard;
      default:
        return CreditCard;
    }
  };

  // Payment type handlers
  const handleCreatePaymentType = async () => {
    try {
      await createPaymentType(paymentFormData);
      setIsPaymentModalOpen(false);
      setPaymentFormData({
        location_id: paymentFormData.location_id,
        code: '',
        name: '',
        description: '',
        logo_url: ''
      });
      getPaymentTypes();
    } catch (error) {
      console.error('Error creating payment type:', error);
    }
  };

  const handleUpdatePaymentType = async () => {
    if (!selectedPaymentType) return;
    try {
      await updatePaymentType(selectedPaymentType.id, paymentFormData);
      setIsPaymentModalOpen(false);
      setSelectedPaymentType(null);
      setPaymentFormData({
        location_id: paymentFormData.location_id,
        code: '',
        name: '',
        description: '',
        logo_url: ''
      });
      getPaymentTypes();
    } catch (error) {
      console.error('Error updating payment type:', error);
    }
  };

  const handleDeletePaymentType = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) {
      try {
        await deletePaymentType(id);
        getPaymentTypes();
      } catch (error) {
        console.error('Error deleting payment type:', error);
      }
    }
  };

  const openEditPaymentModal = (paymentType: ParkingPaymentType) => {
    setSelectedPaymentType(paymentType);
    setPaymentFormData({
      location_id: paymentType.location_id,
      code: paymentType.code,
      name: paymentType.name,
      description: paymentType.description,
      logo_url: paymentType.logo_url || ''
    });
    setIsPaymentModalOpen(true);
  };

  // Rate handlers
  const handleCreateRate = async () => {
    try {
      await createRate(rateFormData);
      setIsRateModalOpen(false);
      setRateFormData({
        vehicle_type_id: rateFormData.vehicle_type_id,
        description: '',
        first_hour_cost: 0,
        subsequent_hour_cost: 0,
        daily_max_cost: 0,
        lost_ticket_cost: 0,
        tax_cost: 0,
        service_cost: 0
      });
      getRates();
    } catch (error) {
      console.error('Error creating rate:', error);
    }
  };

  const handleUpdateRate = async () => {
    if (!selectedRate) return;
    try {
      await updateRate(selectedRate.id, rateFormData);
      setIsRateModalOpen(false);
      setSelectedRate(null);
      setRateFormData({
        vehicle_type_id: rateFormData.vehicle_type_id,
        description: '',
        first_hour_cost: 0,
        subsequent_hour_cost: 0,
        daily_max_cost: 0,
        lost_ticket_cost: 0,
        tax_cost: 0,
        service_cost: 0
      });
      getRates();
    } catch (error) {
      console.error('Error updating rate:', error);
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tarif ini?')) {
      try {
        await deleteRate(id);
        getRates();
      } catch (error) {
        console.error('Error deleting rate:', error);
      }
    }
  };

  const openEditRateModal = (rate: ParkingRate) => {
    setSelectedRate(rate);
    setRateFormData({
      vehicle_type_id: rate.vehicle_type_id,
      description: rate.description,
      first_hour_cost: rate.first_hour_cost,
      subsequent_hour_cost: rate.subsequent_hour_cost,
      daily_max_cost: rate.daily_max_cost,
      lost_ticket_cost: rate.lost_ticket_cost,
      tax_cost: rate.tax_cost,
      service_cost: rate.service_cost
    });
    setIsRateModalOpen(true);
  };

  // Calculate stats
  const totalTransactions = paymentTypes.length * 100; // Mock data
  const totalRevenue = paymentTypes.length * 2500000; // Mock data
  const activeMethods = paymentTypes.length;
  const avgTransaction = totalRevenue / totalTransactions;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Payment</h1>
          <p className="text-gray-600">Kelola metode pembayaran dan tarif parkir</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => {
              setSelectedPaymentType(null);
              setIsPaymentModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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
              <p className="text-2xl font-bold text-gray-900">{totalTransactions.toLocaleString()}</p>
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
                Rp {totalRevenue.toLocaleString()}
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
              <p className="text-2xl font-bold text-blue-600">{activeMethods}</p>
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
                Rp {Math.round(avgTransaction).toLocaleString()}
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
              {paymentTypesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Memuat metode pembayaran...</p>
                </div>
              ) : paymentTypesError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {paymentTypesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentTypes.map((paymentType) => {
                    const Icon = getPaymentTypeIcon(paymentType.code);
                    return (
                      <div key={paymentType.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-900">{paymentType.name}</span>
                          </div>
                          {getStatusBadge('active')}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{paymentType.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Kode:</span>
                            <span className="font-medium">{paymentType.code}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <button 
                            onClick={() => openEditPaymentModal(paymentType)}
                            className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeletePaymentType(paymentType.id)}
                            className="flex-1 px-3 py-1 text-xs border border-red-300 text-red-700 rounded hover:bg-red-50 transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Konfigurasi Tarif Parkir</h3>
                <button 
                  onClick={() => {
                    setSelectedRate(null);
                    setIsRateModalOpen(true);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tarif</span>
                </button>
              </div>
              
              {ratesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Memuat tarif parkir...</p>
                </div>
              ) : ratesError ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Error: {ratesError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rates.map((rate) => (
                    <div key={rate.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{getVehicleTypeName(rate.vehicle_type_id)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openEditRateModal(rate)}
                            className="p-1 text-blue-600 hover:text-blue-700 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteRate(rate.id)}
                            className="p-1 text-red-600 hover:text-red-700 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{rate.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Jam pertama:</span>
                          <span className="font-medium">Rp {rate.first_hour_cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Jam berikutnya:</span>
                          <span className="font-medium">Rp {rate.subsequent_hour_cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Maksimal harian:</span>
                          <span className="font-medium">Rp {rate.daily_max_cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Tiket hilang:</span>
                          <span className="font-medium">Rp {rate.lost_ticket_cost.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Type Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedPaymentType ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}
              </h3>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kode *</label>
                <input
                  type="text"
                  value={paymentFormData.code}
                  onChange={(e) => setPaymentFormData({...paymentFormData, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: QRIS, CASH, CARD"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama *</label>
                <input
                  type="text"
                  value={paymentFormData.name}
                  onChange={(e) => setPaymentFormData({...paymentFormData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: QRIS, Cash, Credit Card"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={paymentFormData.description}
                  onChange={(e) => setPaymentFormData({...paymentFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Deskripsi metode pembayaran"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={paymentFormData.logo_url}
                  onChange={(e) => setPaymentFormData({...paymentFormData, logo_url: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={selectedPaymentType ? handleUpdatePaymentType : handleCreatePaymentType}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedPaymentType ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Modal */}
      {isRateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedRate ? 'Edit Tarif Parkir' : 'Tambah Tarif Parkir'}
              </h3>
              <button 
                onClick={() => setIsRateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kendaraan *</label>
                <select
                  value={rateFormData.vehicle_type_id}
                  onChange={(e) => setRateFormData({...rateFormData, vehicle_type_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Tipe Kendaraan</option>
                  {vehicleTypes.map((vt) => (
                    <option key={vt.id} value={vt.id}>{vt.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                <input
                  type="text"
                  value={rateFormData.description}
                  onChange={(e) => setRateFormData({...rateFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Tarif mobil per jam"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jam Pertama (Rp) *</label>
                <input
                  type="number"
                  value={rateFormData.first_hour_cost}
                  onChange={(e) => setRateFormData({...rateFormData, first_hour_cost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jam Berikutnya (Rp) *</label>
                <input
                  type="number"
                  value={rateFormData.subsequent_hour_cost}
                  onChange={(e) => setRateFormData({...rateFormData, subsequent_hour_cost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maksimal Harian (Rp) *</label>
                <input
                  type="number"
                  value={rateFormData.daily_max_cost}
                  onChange={(e) => setRateFormData({...rateFormData, daily_max_cost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiket Hilang (Rp) *</label>
                <input
                  type="number"
                  value={rateFormData.lost_ticket_cost}
                  onChange={(e) => setRateFormData({...rateFormData, lost_ticket_cost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pajak (Rp)</label>
                <input
                  type="number"
                  value={rateFormData.tax_cost}
                  onChange={(e) => setRateFormData({...rateFormData, tax_cost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biaya Layanan (Rp)</label>
                <input
                  type="number"
                  value={rateFormData.service_cost}
                  onChange={(e) => setRateFormData({...rateFormData, service_cost: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setIsRateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={selectedRate ? handleUpdateRate : handleCreateRate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {selectedRate ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

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