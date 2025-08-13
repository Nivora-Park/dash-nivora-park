import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { ParkingMembership, ParkingMembershipProduct, Location } from '@/types/api';

interface MembershipFormData {
  membership_product_id: string;
  code: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  start_time: string;
  end_time: string;
}

interface MembershipFilters {
  searchTerm: string;
  membershipProductId: string;
}

export function useMembershipManagement() {
  const { execute } = useApi();
  const [memberships, setMemberships] = useState<ParkingMembership[]>([]);
  const [membershipProducts, setMembershipProducts] = useState<ParkingMembershipProduct[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState<ParkingMembership | null>(null);
  const [filters, setFilters] = useState<MembershipFilters>({
    searchTerm: '',
    membershipProductId: ''
  });
  
  const [formData, setFormData] = useState<MembershipFormData>({
    membership_product_id: '',
    code: '',
    name: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Fetch memberships
  const fetchMemberships = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getMemberships());
      
      if (response && response.code === 200) {
        setMemberships(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to fetch memberships');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch membership products
  const fetchMembershipProducts = async () => {
    try {
      const response = await execute(() => apiService.getMembershipProducts());
      
      if (response && response.code === 200) {
        setMembershipProducts(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch membership products:', err);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const response = await execute(() => apiService.getLocations());
      
      if (response && response.code === 200) {
        setLocations(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  };

  // Create membership
  const createMembership = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.createMembership(formData));
      
      if (response && (response.code === 201 || response.code === 200)) {
        await fetchMemberships();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to create membership');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update membership
  const updateMembership = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.updateMembership(id, formData));
      
      if (response && response.code === 200) {
        await fetchMemberships();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to update membership');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete membership
  const deleteMembership = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.deleteMembership(id));
      
      if (response && (response.code === 200 || response.code === 204)) {
        await fetchMemberships();
        return true;
      } else {
        setError('Failed to delete membership');
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
  const handleOpenModal = (membership?: ParkingMembership) => {
    if (membership) {
      setEditingMembership(membership);
      setFormData({
        membership_product_id: membership.membership_product_id,
        code: membership.code,
        name: membership.name,
        description: membership.description,
        address: membership.address,
        email: membership.email,
        phone: membership.phone,
        start_time: membership.start_time,
        end_time: membership.end_time
      });
    } else {
      setEditingMembership(null);
      setFormData({
        membership_product_id: '',
        code: '',
        name: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMembership(null);
    setError(null);
  };

  // Form handlers
  const updateFormField = (field: keyof MembershipFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingMembership) {
      return await updateMembership(editingMembership.id);
    } else {
      return await createMembership();
    }
  };

  // Filter handlers
  const updateFilters = (newFilters: Partial<MembershipFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get filtered products by location
  const getFilteredProducts = (locationId: string) => {
    return membershipProducts.filter(product => 
      !locationId || product.location_id === locationId
    );
  };

  // Filtered memberships
  const filteredMemberships = memberships.filter(membership => {
    const matchesSearch = membership.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         membership.email?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         membership.phone?.includes(filters.searchTerm) ||
                         membership.code.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filters.membershipProductId && membership.membership_product_id !== filters.membershipProductId) return false;

    return true;
  });

  // Get location name by product ID
  const getLocationName = (productId: string) => {
    const product = membershipProducts.find(p => p.id === productId);
    if (!product) return 'Unknown';
    const location = locations.find(l => l.id === product.location_id);
    return location?.name || 'Unknown';
  };

  // Get membership product name by ID
  const getMembershipProductName = (productId: string) => {
    const product = membershipProducts.find(p => p.id === productId);
    return product?.name || 'Unknown';
  };

  // Check if membership is expired
  const isExpired = (membership: ParkingMembership) => {
    const endDate = new Date(membership.end_time);
    return new Date() > endDate;
  };

  // Get status based on dates
  const getMembershipStatus = (membership: ParkingMembership) => {
    const now = new Date();
    const startDate = new Date(membership.start_time);
    const endDate = new Date(membership.end_time);
    
    if (now < startDate) return 'pending';
    if (now > endDate) return 'expired';
    return 'active';
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Stats
  const stats = {
    total: memberships.length,
    active: memberships.filter(m => getMembershipStatus(m) === 'active').length,
    expired: memberships.filter(m => isExpired(m)).length,
    byProduct: membershipProducts.map(product => ({
      name: product.name,
      count: memberships.filter(m => m.membership_product_id === product.id).length
    }))
  };

  // Load data on mount
  useEffect(() => {
    fetchMemberships();
    fetchMembershipProducts();
    fetchLocations();
  }, []);

  return {
    memberships: filteredMemberships,
    membershipProducts,
    locations,
    loading,
    error,
    stats,
    showModal,
    editingMembership,
    formData,
    filters,
    fetchMemberships,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteMembership,
    updateFilters,
    getLocationName,
    getMembershipProductName,
    getStatusColor,
    getFilteredProducts,
    isExpired,
    getMembershipStatus
  };
}
