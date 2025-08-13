import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { Merchant, ApiResponse } from '@/types/api';

interface MerchantFormData {
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

interface MerchantFilters {
  searchTerm: string;
  contractStatus: 'all' | 'active' | 'expired' | 'expiring';
}

export function useMerchantManagement() {
  const { execute } = useApi();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [filters, setFilters] = useState<MerchantFilters>({
    searchTerm: '',
    contractStatus: 'all'
  });
  
  const [formData, setFormData] = useState<MerchantFormData>({
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

  // Fetch merchants
  const fetchMerchants = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getMerchants());
      
      if (response && response.code === 200) {
        setMerchants(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to fetch merchants');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Create merchant
  const createMerchant = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.createMerchant(formData));
      
      if (response && (response.code === 201 || response.code === 200)) {
        await fetchMerchants();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to create merchant');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update merchant
  const updateMerchant = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.updateMerchant(id, formData));
      
      if (response && response.code === 200) {
        await fetchMerchants();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to update merchant');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete merchant
  const deleteMerchant = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.deleteMerchant(id));
      
      if (response && (response.code === 200 || response.code === 204)) {
        await fetchMerchants();
        return true;
      } else {
        setError('Failed to delete merchant');
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
  const handleOpenModal = (merchant?: Merchant) => {
    if (merchant) {
      setEditingMerchant(merchant);
      setFormData({
        code: merchant.code,
        name: merchant.name,
        description: merchant.description,
        address: merchant.address,
        email: merchant.email,
        phone: merchant.phone,
        contract_start: merchant.contract_start.split('T')[0],
        contract_end: merchant.contract_end.split('T')[0],
        logo_url: merchant.logo_url
      });
    } else {
      setEditingMerchant(null);
      setFormData({
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
    setEditingMerchant(null);
    setError(null);
  };

  // Form handlers
  const updateFormField = (field: keyof MerchantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingMerchant) {
      return await updateMerchant(editingMerchant.id);
    } else {
      return await createMerchant();
    }
  };

  // Filter handlers
  const updateFilters = (newFilters: Partial<MerchantFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filtered merchants
  const filteredMerchants = merchants.filter(merchant => {
    const matchesSearch = merchant.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         merchant.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         merchant.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filters.contractStatus === 'all') return true;
    
    const now = new Date();
    const contractEnd = new Date(merchant.contract_end);
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
    total: merchants.length,
    active: merchants.filter(m => {
      const now = new Date();
      const contractEnd = new Date(m.contract_end);
      return contractEnd > now;
    }).length,
    expiring: merchants.filter(m => {
      const now = new Date();
      const contractEnd = new Date(m.contract_end);
      const daysUntilExpiry = Math.ceil((contractEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length,
    expired: merchants.filter(m => {
      const now = new Date();
      const contractEnd = new Date(m.contract_end);
      return contractEnd <= now;
    }).length
  };

  // Load data on mount
  useEffect(() => {
    fetchMerchants();
  }, []);

  return {
    merchants: filteredMerchants,
    loading,
    error,
    stats,
    showModal,
    editingMerchant,
    formData,
    filters,
    fetchMerchants,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteMerchant,
    updateFilters
  };
}
