import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { Location, Merchant, ApiResponse } from '@/types/api';

interface LocationFormData {
  merchant_id: string;
  code: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  contract_start: string;
  contract_end: string;
  logo_url: string;
}

interface LocationFilters {
  searchTerm: string;
  merchantId: string;
  contractStatus: 'all' | 'active' | 'expired' | 'expiring';
}

export function useLocationManagement() {
  const { execute } = useApi();
  const [locations, setLocations] = useState<Location[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [filters, setFilters] = useState<LocationFilters>({
    searchTerm: '',
    merchantId: '',
    contractStatus: 'all'
  });
  
  const [formData, setFormData] = useState<LocationFormData>({
    merchant_id: '',
    code: '',
    name: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    contract_start: '',
    contract_end: '',
    logo_url: ''
  });

  // Fetch locations
  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getLocations());
      
      if (response && response.code === 200) {
        setLocations(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to fetch locations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch merchants
  const fetchMerchants = async () => {
    try {
      const response = await execute(() => apiService.getMerchants());
      
      if (response && response.code === 200) {
        setMerchants(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch merchants:', err);
    }
  };

  // Create location
  const createLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.createLocation(formData));
      
      if (response && (response.code === 201 || response.code === 200)) {
        await fetchLocations();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to create location');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update location
  const updateLocation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.updateLocation(id, formData));
      
      if (response && response.code === 200) {
        await fetchLocations();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to update location');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete location
  const deleteLocation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.deleteLocation(id));
      
      if (response && (response.code === 200 || response.code === 204)) {
        await fetchLocations();
        return true;
      } else {
        setError('Failed to delete location');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleOpenModal = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        merchant_id: location.merchant_id,
        code: location.code,
        name: location.name,
        description: location.description,
        address: location.address,
        email: location.email,
        phone: location.phone,
        contract_start: location.contract_start.split('T')[0],
        contract_end: location.contract_end.split('T')[0],
        logo_url: location.logo_url
      });
    } else {
      setEditingLocation(null);
      setFormData({
        merchant_id: '',
        code: '',
        name: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        contract_start: '',
        contract_end: '',
        logo_url: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLocation(null);
    setError(null);
  };

  // Form handlers
  const updateFormField = (field: keyof LocationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingLocation) {
      return await updateLocation(editingLocation.id);
    } else {
      return await createLocation();
    }
  };

  // Filter handlers
  const updateFilters = (newFilters: Partial<LocationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filtered locations
  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         location.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filters.merchantId && location.merchant_id !== filters.merchantId) return false;

    if (filters.contractStatus === 'all') return true;
    
    const now = new Date();
    const contractEnd = new Date(location.contract_end);
    const daysUntilExpiry = Math.ceil((contractEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (filters.contractStatus) {
      case 'active':
        return daysUntilExpiry > 30;
      case 'expiring':
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      case 'expired':
        return daysUntilExpiry <= 0;
      default:
        return true;
    }
  });

  // Stats
  const stats = {
    total: locations.length,
    active: locations.filter(l => {
      const now = new Date();
      const contractEnd = new Date(l.contract_end);
      return contractEnd > now;
    }).length,
    expiring: locations.filter(l => {
      const now = new Date();
      const contractEnd = new Date(l.contract_end);
      const daysUntilExpiry = Math.ceil((contractEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    expired: locations.filter(l => {
      const now = new Date();
      const contractEnd = new Date(l.contract_end);
      return contractEnd <= now;
    }).length
  };

  // Get merchant name by ID
  const getMerchantName = (merchantId: string) => {
    const merchant = merchants.find(m => m.id === merchantId);
    return merchant?.name || 'Unknown';
  };

  // Load data on mount
  useEffect(() => {
    fetchLocations();
    fetchMerchants();
  }, []);

  return {
    locations: filteredLocations,
    merchants,
    loading,
    error,
    stats,
    showModal,
    editingLocation,
    formData,
    filters,
    fetchLocations,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteLocation,
    updateFilters,
    getMerchantName
  };
}
