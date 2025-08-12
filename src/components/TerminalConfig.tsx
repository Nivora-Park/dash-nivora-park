'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { useParkingTerminals, useLocations, useParkingVehicleTypes } from '@/hooks/useApi';
import { ParkingTerminal, Location, ParkingVehicleType } from '@/types/api';

export function TerminalConfig() {
  const [selectedTerminal, setSelectedTerminal] = useState<ParkingTerminal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  // Overrides lokal untuk menutupi field yang tidak dikembalikan backend (contoh: vehicle_type_id)
  const [terminalOverrides, setTerminalOverrides] = useState<Record<string, Partial<ParkingTerminal>>>({});

  // API hooks
  const { 
    data: terminalsData, 
    loading: terminalsLoading, 
    error: terminalsError,
    getTerminals,
    createTerminal,
    updateTerminal,
    deleteTerminal
  } = useParkingTerminals();

  const {
    data: locationsData,
    loading: locationsLoading,
    getLocations
  } = useLocations();

  const {
    data: vehicleTypesData,
    loading: vehicleTypesLoading,
    getVehicleTypes
  } = useParkingVehicleTypes();

  // Form state
  const [formData, setFormData] = useState({
    location_id: '',
    vehicle_type_id: '',
    code: '',
    name: '',
    description: '',
    ip_terminal: '',
    ip_printer: '',
    printer_type: '',
    ip_camera: '',
    logo_url: ''
  });

  const [formErrors, setFormErrors] = useState<{
    location_id?: string;
    vehicle_type_id?: string;
    code?: string;
    name?: string;
    ip_terminal?: string;
    ip_printer?: string;
    printer_type?: string;
    ip_camera?: string;
  }>({});

  const validateForm = () => {
    const errors: typeof formErrors = {};
    // Lokasi tidak diwajibkan karena tidak disimpan di backend terminal
    // if (!formData.location_id) errors.location_id = 'Lokasi wajib dipilih';
    // if (formData.location_id && !isValidUUID(formData.location_id)) errors.location_id = 'Lokasi tidak valid';
    if (!formData.vehicle_type_id) errors.vehicle_type_id = 'Tipe kendaraan wajib dipilih';
    if (formData.vehicle_type_id && !isValidUUID(formData.vehicle_type_id)) errors.vehicle_type_id = 'Tipe kendaraan tidak valid';
    if (!String(formData.code).trim()) errors.code = 'Kode terminal wajib diisi';
    if (!String(formData.name).trim()) errors.name = 'Nama terminal wajib diisi';
    if (!String(formData.ip_terminal).trim()) errors.ip_terminal = 'IP Terminal wajib diisi';
    else if (!isValidIPv4(formData.ip_terminal)) errors.ip_terminal = 'Format IP Terminal tidak valid (harus IPv4)';
    if (!String(formData.ip_printer).trim()) errors.ip_printer = 'IP Printer wajib diisi';
    else if (!isValidIPv4(formData.ip_printer)) errors.ip_printer = 'Format IP Printer tidak valid (harus IPv4)';
    if (!String(formData.printer_type).trim()) errors.printer_type = 'Tipe printer wajib diisi';
    if (!String(formData.ip_camera).trim()) errors.ip_camera = 'IP Camera wajib diisi';
    else if (!isValidIPv4(formData.ip_camera)) errors.ip_camera = 'Format IP Camera tidak valid (harus IPv4)';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper: dapatkan nama lokasi terminal dari vehicle type
  const getTerminalLocationName = (terminal: ParkingTerminal) => {
    const vt = Array.isArray(vehicleTypes) ? (vehicleTypes as ParkingVehicleType[]).find(v => v.id === terminal.vehicle_type_id) : undefined;
    if (!vt || !vt.location_id) return 'Lokasi tidak ditemukan';
    return getLocationName(vt.location_id);
  };

  // Gabungkan terminal dari server dengan overrides lokal
  const mergeTerminal = (t: ParkingTerminal): ParkingTerminal => {
    const override = terminalOverrides[t.id] || {};
    return { ...t, ...override } as ParkingTerminal;
  };

  useEffect(() => {
    // Only execute on client side
    if (typeof window !== 'undefined') {
      getTerminals();
      getLocations();
      getVehicleTypes();
    }
  }, [getTerminals, getLocations, getVehicleTypes]);

  const terminals = Array.isArray(terminalsData) ? terminalsData : [];
  // Normalisasi data locations: dukung array langsung atau objek dengan properti items
  const locationsArray = Array.isArray(locationsData)
    ? locationsData
    : (locationsData && Array.isArray((locationsData as any).items))
      ? (locationsData as any).items
      : [];
  const vehicleTypes = Array.isArray(vehicleTypesData) ? vehicleTypesData : [];
  
  // Opsi yang ditampilkan di dropdown: hanya dari API (tanpa fallback default)
  const vehicleTypeOptions = (vehicleTypes && vehicleTypes.length > 0)
    ? vehicleTypes.map((vt: ParkingVehicleType) => ({ id: vt.id, name: vt.name }))
    : [];
  const locationOptions = (locationsArray && locationsArray.length > 0)
    ? locationsArray.map((loc: Location) => ({ id: loc.id, name: loc.name }))
    : [];

  // Set default value otomatis hanya jika data asli tersedia
  useEffect(() => {
    if (!formData.location_id && locationsArray.length > 0) {
      setFormData(prev => ({ ...prev, location_id: locationsArray[0].id }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationsArray.length]);

  useEffect(() => {
    if (!formData.vehicle_type_id && vehicleTypes.length > 0) {
      setFormData(prev => ({ ...prev, vehicle_type_id: vehicleTypes[0].id }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleTypes.length]);

  // UUID validator
  const isValidUUID = (value: string) => {
    const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return UUID_REGEX.test(value);
  };

  // IPv4 validator (sederhana)
  const isValidIPv4 = (value: string) => {
    const IPv4_REGEX = /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;
    return IPv4_REGEX.test(value.trim());
  };

  // Kumpulkan alasan kenapa submit tidak bisa dilakukan
  const submitIssues: string[] = [];
  if (!formData.location_id) submitIssues.push('Lokasi wajib dipilih');
  else if (!isValidUUID(formData.location_id)) submitIssues.push('Lokasi tidak valid (UUID)');

  if (!formData.vehicle_type_id) submitIssues.push('Tipe kendaraan wajib dipilih');
  else if (!isValidUUID(formData.vehicle_type_id)) submitIssues.push('Tipe kendaraan tidak valid (UUID)');

  if (!String(formData.code).trim()) submitIssues.push('Kode terminal wajib diisi');
  if (!String(formData.name).trim()) submitIssues.push('Nama terminal wajib diisi');

  if (!String(formData.ip_terminal).trim()) submitIssues.push('IP Terminal wajib diisi');
  else if (!isValidIPv4(formData.ip_terminal)) submitIssues.push('Format IP Terminal tidak valid (harus IPv4)');

  if (!String(formData.ip_printer).trim()) submitIssues.push('IP Printer wajib diisi');
  else if (!isValidIPv4(formData.ip_printer)) submitIssues.push('Format IP Printer tidak valid (harus IPv4)');

  if (!String(formData.printer_type).trim()) submitIssues.push('Tipe printer wajib diisi');

  if (!String(formData.ip_camera).trim()) submitIssues.push('IP Camera wajib diisi');
  else if (!isValidIPv4(formData.ip_camera)) submitIssues.push('Format IP Camera tidak valid (harus IPv4)');

  // Filter terminals
  const filteredTerminals = terminals
    .map((t: ParkingTerminal) => mergeTerminal(t))
    .filter((terminal: ParkingTerminal) => {
      // Validasi terminal object
      if (!terminal || typeof terminal !== 'object') {
        console.warn('Invalid terminal object:', terminal);
        return false;
      }

      // Validasi properti yang diperlukan - gunakan properti yang ada
      if (!terminal.name || !terminal.code) {
        console.warn('Terminal missing required properties:', terminal);
        return false;
      }

      // Gunakan properti yang ada, dengan fallback untuk yang tidak ada
      const terminalName = terminal.name || '';
      const terminalCode = terminal.code || '';
      const terminalDescription = terminal.description || '';
      const terminalIpTerminal = terminal.ip_terminal || '';
      const terminalIpPrinter = terminal.ip_printer || '';
      const terminalIpCamera = terminal.ip_camera || '';

      const matchesSearch = terminalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           terminalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           terminalDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           terminalIpTerminal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           terminalIpPrinter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           terminalIpCamera.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = locationFilter === 'all' || terminal.location_id === locationFilter;
      const matchesVehicleType = vehicleTypeFilter === 'all' || terminal.vehicle_type_id === vehicleTypeFilter;

      return matchesSearch && matchesLocation && matchesVehicleType;
    });

  // Error display component
  const ErrorDisplay = ({ error }: { error: string | null }) => {
    if (!error) return null;
    
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700 font-medium">Error:</span>
        </div>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  };

  const getLocationName = (locationId: string) => {
    if (!Array.isArray(locationsArray)) {
      console.warn('Locations is not an array:', locationsArray);
      return 'Lokasi tidak ditemukan';
    }
    
    const location = locationsArray.find((loc: Location) => loc && loc.id === locationId);
    return location ? location.name : 'Lokasi tidak ditemukan';
  };

  const getVehicleTypeName = (vehicleTypeId: string) => {
    if (!Array.isArray(vehicleTypes)) {
      console.warn('Vehicle types is not an array:', vehicleTypes);
      return 'Tipe kendaraan tidak ditemukan';
    }
    
    const vehicleType = vehicleTypes.find((vt: ParkingVehicleType) => vt && vt.id === vehicleTypeId);
    return vehicleType ? vehicleType.name : 'Tipe kendaraan tidak ditemukan';
  };

  const handleCreateTerminal = async () => {
    if (!validateForm()) return;
    try {
      // Hanya kirim field yang ada di backend API
      const terminalData = {
        // location_id tidak dikirim karena backend terminal tidak memerlukannya
        vehicle_type_id: formData.vehicle_type_id,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        ip_terminal: formData.ip_terminal,
        ip_printer: formData.ip_printer,
        printer_type: formData.printer_type,
        ip_camera: formData.ip_camera,
        logo_url: formData.logo_url
      };
      
      const response = await createTerminal(terminalData);
      // Simpan override lokal untuk vehicle_type_id agar tampil di daftar
      if (response && response.data && response.data.id) {
        setTerminalOverrides(prev => ({
          ...prev,
          [response.data.id]: { vehicle_type_id: formData.vehicle_type_id }
        }));
      }
      setIsModalOpen(false);
      setFormData({
        location_id: (locationsArray && locationsArray.length > 0) ? locationsArray[0].id : '',
        vehicle_type_id: (vehicleTypes && vehicleTypes.length > 0) ? vehicleTypes[0].id : '',
        code: '',
        name: '',
        description: '',
        ip_terminal: '',
        ip_printer: '',
        printer_type: '',
        ip_camera: '',
        logo_url: ''
      });
      setFormErrors({});
      await getTerminals(); // Refresh data
    } catch (error) {
      console.error('Error creating terminal:', error);
    }
  };

  const handleUpdateTerminal = async () => {
    if (!selectedTerminal) return;
    if (!validateForm()) return;
    try {
      // Hanya kirim field yang ada di backend API
      const terminalData = {
        // location_id tidak dikirim karena backend terminal tidak memerlukannya
        vehicle_type_id: formData.vehicle_type_id,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        ip_terminal: formData.ip_terminal,
        ip_printer: formData.ip_printer,
        printer_type: formData.printer_type,
        ip_camera: formData.ip_camera,
        logo_url: formData.logo_url
      };
      
      await updateTerminal(selectedTerminal.id, terminalData);
      // Simpan override lokal untuk vehicle_type_id agar tampil di daftar
      setTerminalOverrides(prev => ({
        ...prev,
        [selectedTerminal.id]: { vehicle_type_id: formData.vehicle_type_id }
      }));
      setIsModalOpen(false);
      setSelectedTerminal(null);
      setFormErrors({});
      await getTerminals(); // Refresh data
    } catch (error) {
      console.error('Error updating terminal:', error);
    }
  };

  const handleDeleteTerminal = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus terminal ini?')) {
      try {
        await deleteTerminal(id);
        getTerminals(); // Refresh data
      } catch (error) {
        console.error('Error deleting terminal:', error);
      }
    }
  };

  const openEditModal = (terminal: ParkingTerminal) => {
    setSelectedTerminal(terminal);
    setFormData({
      location_id: terminal.location_id || '',
      vehicle_type_id: terminal.vehicle_type_id || '',
      code: terminal.code || '',
      name: terminal.name || '',
      description: terminal.description || '',
      ip_terminal: terminal.ip_terminal || '',
      ip_printer: terminal.ip_printer || '',
      printer_type: terminal.printer_type || '',
      ip_camera: terminal.ip_camera || '',
      logo_url: terminal.logo_url || ''
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTerminal(null);
    setFormData({
      location_id: (locationsArray && locationsArray.length > 0) ? locationsArray[0].id : '',
      vehicle_type_id: (vehicleTypes && vehicleTypes.length > 0) ? vehicleTypes[0].id : '',
      code: '',
      name: '',
      description: '',
      ip_terminal: '',
      ip_printer: '',
      printer_type: '',
      ip_camera: '',
      logo_url: ''
    });
    setIsModalOpen(true);
  };

  // Debug component untuk menampilkan data mentah
  const DebugData = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-yellow-800 mb-2">Debug Data (Development Only)</h4>
        <div className="text-sm text-yellow-700 space-y-2">
          <div>
            <strong>Terminals Data Type:</strong> {typeof terminalsData}
          </div>
          <div>
            <strong>Is Array:</strong> {Array.isArray(terminalsData) ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Data Length:</strong> {terminalsData?.length || 0}
          </div>
          {terminalsData && Array.isArray(terminalsData) && terminalsData.length > 0 && (
            <div>
              <strong>First Terminal Keys:</strong> {Object.keys(terminalsData[0]).join(', ')}
            </div>
          )}
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">Raw Terminals Data</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
              {JSON.stringify(terminalsData, null, 2)}
            </pre>
          </details>
          <details className="mt-2">
            <summary className="cursor-pointer font-medium">Processed Terminals</summary>
            <pre className="mt-2 text-xs overflow-auto max-h-40 bg-gray-100 p-2 rounded">
              {JSON.stringify(terminals, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    );
  };

  // Early return jika masih loading
  if (terminalsLoading || locationsLoading || vehicleTypesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Debug Data */}
      <DebugData />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Terminal</h1>
          <p className="text-gray-600">Kelola dan monitor terminal parkir</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => getTerminals()}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
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
              <p className="text-sm font-medium text-gray-600">Dengan IP Terminal</p>
              <p className="text-2xl font-bold text-green-600">
                {terminals.filter((t: ParkingTerminal) => t.ip_terminal && t.ip_terminal.trim()).length}
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
              <p className="text-sm font-medium text-gray-600">Dengan IP Printer</p>
              <p className="text-2xl font-bold text-yellow-600">
                {terminals.filter((t: ParkingTerminal) => t.ip_printer && t.ip_printer.trim()).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dengan IP Camera</p>
              <p className="text-2xl font-bold text-purple-600">
                {terminals.filter((t: ParkingTerminal) => t.ip_camera && t.ip_camera.trim()).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari terminal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
          </div>
          
          <div>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Lokasi</option>
              {locationOptions.length === 0 ? (
                <option value="">Tidak ada lokasi tersedia</option>
              ) : (
                locationOptions.map((option: { id: string; name: string }) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))
              )}
            </select>
          </div>
          
          <div>
            <select
              value={vehicleTypeFilter}
              onChange={(e) => setVehicleTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Tipe Kendaraan</option>
              {vehicleTypeOptions.length === 0 ? (
                <option value="">Tidak ada tipe kendaraan tersedia</option>
              ) : (
                vehicleTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))
              )}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filter</span>
          </div>
        </div>
      </div>

      {/* Terminal List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daftar Terminal</h3>
        </div>
        
        {terminalsLoading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Memuat data terminal...</p>
          </div>
        ) : terminalsError ? (
          <ErrorDisplay error={terminalsError} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Terminal</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Lokasi</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Tipe Kendaraan</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">IP Terminal</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">IP Printer</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">IP Camera</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Updated</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredTerminals.map((terminal: ParkingTerminal) => {
                  return (
                    <tr key={terminal.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Settings className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{terminal.name}</div>
                            <div className="text-sm text-gray-500">ID: {terminal.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{getTerminalLocationName(terminal)}</td>
                      <td className="py-4 px-6 text-gray-600">{getVehicleTypeName(terminal.vehicle_type_id)}</td>
                      <td className="py-4 px-6 text-gray-600">{terminal.ip_terminal || 'Tidak ada data'}</td>
                      <td className="py-4 px-6 text-gray-600">{terminal.ip_printer || 'Tidak ada data'}</td>
                      <td className="py-4 px-6 text-gray-600">{terminal.ip_camera || 'Tidak ada data'}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {terminal.updated_at ? new Date(terminal.updated_at).toLocaleString('id-ID') : 'Tidak ada data'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => openEditModal(terminal)}
                            className="p-1 text-blue-600 hover:text-blue-700 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTerminal(terminal.id)}
                            className="p-1 text-red-600 hover:text-red-700 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {filteredTerminals.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                Tidak ada terminal yang ditemukan
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Create/Edit Terminal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTerminal ? 'Edit Terminal' : 'Tambah Terminal Baru'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi *</label>
                  <select
                    value={formData.location_id || ''}
                    onChange={(e) => {
                      setFormData({...formData, location_id: e.target.value});
                      if (formErrors.location_id) setFormErrors({...formErrors, location_id: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Lokasi</option>
                    {locationOptions.length === 0 ? (
                      <option value="">Tidak ada lokasi tersedia</option>
                    ) : (
                      locationOptions.map((option: { id: string; name: string }) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))
                    )}
                  </select>
                  {formErrors.location_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.location_id}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kendaraan *</label>
                  <select
                    value={formData.vehicle_type_id}
                    onChange={(e) => {
                      setFormData({...formData, vehicle_type_id: e.target.value});
                      if (formErrors.vehicle_type_id) setFormErrors({...formErrors, vehicle_type_id: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Tipe Kendaraan</option>
                    {vehicleTypeOptions.length === 0 ? (
                      <option value="">Tidak ada tipe kendaraan tersedia</option>
                    ) : (
                      vehicleTypeOptions.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))
                    )}
                  </select>
                  {formErrors.vehicle_type_id && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.vehicle_type_id}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kode Terminal *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => {
                      setFormData({...formData, code: e.target.value});
                      if (formErrors.code) setFormErrors({...formErrors, code: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="TERM-001"
                  />
                  {formErrors.code && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Terminal *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({...formData, name: e.target.value});
                      if (formErrors.name) setFormErrors({...formErrors, name: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Terminal A1"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Deskripsi terminal..."
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IP Terminal *</label>
                  <input
                    type="text"
                    value={formData.ip_terminal}
                    onChange={(e) => {
                      setFormData({...formData, ip_terminal: e.target.value});
                      if (formErrors.ip_terminal) setFormErrors({...formErrors, ip_terminal: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.100"
                  />
                  {formErrors.ip_terminal && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.ip_terminal}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IP Printer *</label>
                  <input
                    type="text"
                    value={formData.ip_printer}
                    onChange={(e) => {
                      setFormData({...formData, ip_printer: e.target.value});
                      if (formErrors.ip_printer) setFormErrors({...formErrors, ip_printer: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.101"
                  />
                  {formErrors.ip_printer && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.ip_printer}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Printer *</label>
                  <input
                    type="text"
                    value={formData.printer_type}
                    onChange={(e) => {
                      setFormData({...formData, printer_type: e.target.value});
                      if (formErrors.printer_type) setFormErrors({...formErrors, printer_type: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Epson TM-T88VI"
                  />
                  {formErrors.printer_type && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.printer_type}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IP Camera *</label>
                  <input
                    type="text"
                    value={formData.ip_camera}
                    onChange={(e) => {
                      setFormData({...formData, ip_camera: e.target.value});
                      if (formErrors.ip_camera) setFormErrors({...formErrors, ip_camera: undefined});
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="192.168.1.102"
                  />
                  {formErrors.ip_camera && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.ip_camera}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={selectedTerminal ? handleUpdateTerminal : handleCreateTerminal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitIssues.length > 0}
              >
                {selectedTerminal ? 'Update' : 'Simpan'}
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
            </div>

            {submitIssues.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700 space-y-1">
                <div className="font-medium">Tidak bisa menyimpan karena:</div>
                <ul className="list-disc pl-5">
                  {submitIssues.map((issue, idx) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 