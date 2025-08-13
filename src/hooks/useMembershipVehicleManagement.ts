import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { ParkingMembershipVehicle, ParkingMembership, ParkingVehicleType } from '@/types/api';

interface MembershipVehicleFormData {
  membership_id: string;
  vehicle_type_id: string;
  description: string;
  plate_number: string;
  card_number: string;
  sticker_number: string;
  brand: string;
  model: string;
  color: string;
}

interface MembershipVehicleFilters {
  searchTerm: string;
  membershipId: string;
  vehicleTypeId: string;
}

export function useMembershipVehicleManagement() {
  const { execute } = useApi();
  const [membershipVehicles, setMembershipVehicles] = useState<ParkingMembershipVehicle[]>([]);
  const [memberships, setMemberships] = useState<ParkingMembership[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<ParkingVehicleType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<ParkingMembershipVehicle | null>(null);
  const [filters, setFilters] = useState<MembershipVehicleFilters>({
    searchTerm: '',
    membershipId: '',
    vehicleTypeId: ''
  });
  
  const [formData, setFormData] = useState<MembershipVehicleFormData>({
    membership_id: '',
    vehicle_type_id: '',
    description: '',
    plate_number: '',
    card_number: '',
    sticker_number: '',
    brand: '',
    model: '',
    color: ''
  });

  // Fetch membership vehicles
  const fetchMembershipVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getMembershipVehicles());
      
      if (response && response.code === 200) {
        setMembershipVehicles(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to fetch membership vehicles');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch memberships
  const fetchMemberships = async () => {
    try {
      const response = await execute(() => apiService.getMemberships());
      
      if (response && response.code === 200) {
        setMemberships(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch memberships:', err);
    }
  };

  // Fetch vehicle types
  const fetchVehicleTypes = async () => {
    try {
      const response = await execute(() => apiService.getParkingVehicleTypes());
      
      if (response && response.code === 200) {
        setVehicleTypes(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Failed to fetch vehicle types:', err);
    }
  };

  // Create membership vehicle
  const createMembershipVehicle = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.createMembershipVehicle(formData));
      
      if (response && (response.code === 201 || response.code === 200)) {
        await fetchMembershipVehicles();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to create membership vehicle');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update membership vehicle
  const updateMembershipVehicle = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.updateMembershipVehicle(id, formData));
      
      if (response && response.code === 200) {
        await fetchMembershipVehicles();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to update membership vehicle');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete membership vehicle
  const deleteMembershipVehicle = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.deleteMembershipVehicle(id));
      
      if (response && (response.code === 200 || response.code === 204)) {
        await fetchMembershipVehicles();
        return true;
      } else {
        setError('Failed to delete membership vehicle');
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
  const handleOpenModal = (vehicle?: ParkingMembershipVehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        membership_id: vehicle.membership_id,
        vehicle_type_id: vehicle.vehicle_type_id,
        description: vehicle.description,
        plate_number: vehicle.plate_number,
        card_number: vehicle.card_number,
        sticker_number: vehicle.sticker_number,
        brand: vehicle.brand,
        model: vehicle.model,
        color: vehicle.color
      });
    } else {
      setEditingVehicle(null);
      setFormData({
        membership_id: '',
        vehicle_type_id: '',
        description: '',
        plate_number: '',
        card_number: '',
        sticker_number: '',
        brand: '',
        model: '',
        color: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setError(null);
  };

  // Form handlers
  const updateFormField = (field: keyof MembershipVehicleFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingVehicle) {
      return await updateMembershipVehicle(editingVehicle.id);
    } else {
      return await createMembershipVehicle();
    }
  };

  // Filter handlers
  const updateFilters = (newFilters: Partial<MembershipVehicleFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filtered membership vehicles
  const filteredMembershipVehicles = membershipVehicles.filter(vehicle => {
    const matchesSearch = vehicle.plate_number.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         vehicle.color.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filters.membershipId && vehicle.membership_id !== filters.membershipId) return false;
    if (filters.vehicleTypeId && vehicle.vehicle_type_id !== filters.vehicleTypeId) return false;

    return true;
  });

  // Get membership name by ID
  const getMembershipName = (membershipId: string) => {
    const membership = memberships.find(m => m.id === membershipId);
    return membership?.name || 'Unknown';
  };

  // Get vehicle type name by ID
  const getVehicleTypeName = (vehicleTypeId: string) => {
    const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId);
    return vehicleType?.name || 'Unknown';
  };

  // Stats
  const stats = {
    total: membershipVehicles.length,
    byMembership: memberships.map(membership => ({
      name: membership.name,
      count: membershipVehicles.filter(v => v.membership_id === membership.id).length
    })),
    byVehicleType: vehicleTypes.map(vt => ({
      name: vt.name,
      count: membershipVehicles.filter(v => v.vehicle_type_id === vt.id).length
    }))
  };

  // Load data on mount
  useEffect(() => {
    fetchMembershipVehicles();
    fetchMemberships();
    fetchVehicleTypes();
  }, []);

  return {
    membershipVehicles: filteredMembershipVehicles,
    memberships,
    vehicleTypes,
    loading,
    error,
    stats,
    showModal,
    editingVehicle,
    formData,
    filters,
    fetchMembershipVehicles,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteMembershipVehicle,
    updateFilters,
    getMembershipName,
    getVehicleTypeName
  };
}
