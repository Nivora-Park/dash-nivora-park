import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { ParkingVehicleType, Location } from '@/types/api';

interface VehicleTypeFormData {
  location_id: string;
  code: string;
  name: string;
  description: string;
  wheel_count: number;
  height: number;
  weight: number;
  logo_url: string;
}

interface VehicleTypeFilters {
  searchTerm: string;
  locationId: string;
}

export function useVehicleTypeManagement() {
  const { execute } = useApi();
  const [vehicleTypes, setVehicleTypes] = useState<ParkingVehicleType[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicleType, setEditingVehicleType] = useState<ParkingVehicleType | null>(null);
  const [filters, setFilters] = useState<VehicleTypeFilters>({
    searchTerm: '',
    locationId: ''
  });
  
  const [formData, setFormData] = useState<VehicleTypeFormData>({
    location_id: '',
    code: '',
    name: '',
    description: '',
    wheel_count: 4,
    height: 0,
    weight: 0,
    logo_url: ''
  });

  // Fetch all vehicle types
  const fetchVehicleTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getParkingVehicleTypes());
      if (response && response.code === 200) {
        const data = Array.isArray(response.data) ? response.data : [];
        setVehicleTypes(data);
      } else {
        setError('Failed to fetch vehicle types');
      }
    } catch (err) {
      console.error('Error fetching vehicle types:', err);
      setError('Failed to fetch vehicle types');
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations for dropdown
  const fetchLocations = async () => {
    try {
      const response = await execute(() => apiService.getLocations());
      if (response && response.code === 200) {
        const data = Array.isArray(response.data) ? response.data : [];
        setLocations(data);
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  // Open modal for creating new vehicle type
  const handleOpenModal = (vehicleType?: ParkingVehicleType) => {
    if (vehicleType) {
      setEditingVehicleType(vehicleType);
      setFormData({
        location_id: vehicleType.location_id || '',
        code: vehicleType.code,
        name: vehicleType.name,
        description: vehicleType.description,
        wheel_count: vehicleType.wheel_count,
        height: vehicleType.height,
        weight: vehicleType.weight,
        logo_url: vehicleType.logo_url
      });
    } else {
      setEditingVehicleType(null);
      setFormData({
        location_id: '',
        code: '',
        name: '',
        description: '',
        wheel_count: 4,
        height: 0,
        weight: 0,
        logo_url: ''
      });
    }
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVehicleType(null);
    setError(null);
  };

  // Submit form (create or update)
  const handleSubmit = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        location_id: formData.location_id,
        code: formData.code,
        name: formData.name,
        description: formData.description,
        wheel_count: formData.wheel_count,
        height: formData.height,
        weight: formData.weight,
        logo_url: formData.logo_url
      };

      let response;
      if (editingVehicleType) {
        response = await execute(() => 
          apiService.updateParkingVehicleType(editingVehicleType.id, payload)
        );
      } else {
        response = await execute(() => 
          apiService.createParkingVehicleType(payload)
        );
      }

      if (response && response.code === 200) {
        await fetchVehicleTypes();
        handleCloseModal();
        return true;
      } else {
        setError(response?.message || 'Failed to save vehicle type');
        return false;
      }
    } catch (err) {
      console.error('Error saving vehicle type:', err);
      setError('Failed to save vehicle type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update form field
  const updateFormField = (field: keyof VehicleTypeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Delete vehicle type
  const deleteVehicleType = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await execute(() => apiService.deleteParkingVehicleType(id));
      if (response && response.code === 200) {
        await fetchVehicleTypes();
        return true;
      } else {
        setError(response?.message || 'Failed to delete vehicle type');
        return false;
      }
    } catch (err) {
      console.error('Error deleting vehicle type:', err);
      setError('Failed to delete vehicle type');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<VehicleTypeFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get location name
  const getLocationName = (locationId: string): string => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown';
  };

  // Get rate description - removed since rate_id doesn't exist
  const getRateDescription = (rateId: string): string => {
    return 'N/A';
  };

  // Filter vehicle types
  const filteredVehicleTypes = vehicleTypes.filter(vt => {
    const matchesSearch = 
      vt.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      vt.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      vt.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesLocation = 
      !filters.locationId || vt.location_id === filters.locationId;
    
    return matchesSearch && matchesLocation;
  });

  // Stats
  const stats = {
    total: vehicleTypes.length,
    byLocation: locations.map(location => ({
      name: location.name,
      count: vehicleTypes.filter(vt => vt.location_id === location.id).length
    })),
    byWheelCount: [
      { name: '2 Roda', count: vehicleTypes.filter(vt => vt.wheel_count === 2).length },
      { name: '4 Roda', count: vehicleTypes.filter(vt => vt.wheel_count === 4).length },
      { name: 'Lainnya', count: vehicleTypes.filter(vt => vt.wheel_count > 4).length }
    ]
  };

  // Load data on mount
  useEffect(() => {
    fetchVehicleTypes();
    fetchLocations();
  }, []);

  return {
    vehicleTypes: filteredVehicleTypes,
    locations,
    loading,
    error,
    stats,
    showModal,
    editingVehicleType,
    formData,
    filters,
    fetchVehicleTypes,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteVehicleType,
    updateFilters,
    getLocationName,
    getRateDescription
  };
}
