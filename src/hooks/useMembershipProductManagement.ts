import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { ParkingMembershipProduct, Location } from '@/types/api';
import { validateDuplicates, getValidationRules } from '@/utils/validation';

interface MembershipProductFormData {
  location_id: string;
  code: string;
  name: string;
  description: string;
  base_price: number;
  card_price: number;
  sticker_price: number;
  tax_price: number;
  duration_days: number;
}

interface MembershipProductFilters {
  searchTerm: string;
  locationId: string;
}

export function useMembershipProductManagement() {
  const { execute } = useApi();
  const [products, setProducts] = useState<ParkingMembershipProduct[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ParkingMembershipProduct | null>(null);
  const [filters, setFilters] = useState<MembershipProductFilters>({
    searchTerm: '',
    locationId: ''
  });

  const [formData, setFormData] = useState<MembershipProductFormData>({
    location_id: '',
    code: '',
    name: '',
    description: '',
    base_price: 0,
    card_price: 0,
    sticker_price: 0,
    tax_price: 0,
    duration_days: 30
  });

  // Fetch membership products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getMembershipProducts());

      if (response && response.code === 200) {
        setProducts(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to fetch membership products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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

  // Create product
  const createProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate for duplicates before creating
      const validation = await validateDuplicates(formData, products, getValidationRules('membershipProduct'));
      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        return false;
      }

      const response = await execute(() => apiService.createMembershipProduct(formData));

      if (response && (response.code === 201 || response.code === 200)) {
        await fetchProducts();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to create membership product');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      // Validate for duplicates before updating (exclude current item)
      const validation = await validateDuplicates(formData, products, getValidationRules('membershipProduct'), id);
      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        return false;
      }

      const response = await execute(() => apiService.updateMembershipProduct(id, formData));

      if (response && response.code === 200) {
        await fetchProducts();
        handleCloseModal();
        return true;
      } else {
        setError('Failed to update membership product');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.deleteMembershipProduct(id));

      if (response && (response.code === 200 || response.code === 204)) {
        await fetchProducts();
        return true;
      } else {
        setError('Failed to delete membership product');
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
  const handleOpenModal = (product?: ParkingMembershipProduct) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        location_id: product.location_id,
        code: product.code,
        name: product.name,
        description: product.description,
        base_price: product.base_price,
        card_price: product.card_price,
        sticker_price: product.sticker_price,
        tax_price: product.tax_price,
        duration_days: product.duration_days
      });
    } else {
      setEditingProduct(null);
      setFormData({
        location_id: '',
        code: '',
        name: '',
        description: '',
        base_price: 0,
        card_price: 0,
        sticker_price: 0,
        tax_price: 0,
        duration_days: 30
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setError(null);
  };

  // Form handlers
  const updateFormField = (field: keyof MembershipProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (editingProduct) {
      return await updateProduct(editingProduct.id);
    } else {
      return await createProduct();
    }
  };

  // Filter handlers
  const updateFilters = (newFilters: Partial<MembershipProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filters.locationId && product.location_id !== filters.locationId) return false;

    return true;
  });

  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown';
  };

  // Stats
  const stats = {
    total: products.length,
    byLocation: locations.map(loc => ({
      name: loc.name,
      count: products.filter(p => p.location_id === loc.id).length
    }))
  };

  // Load data on mount
  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, []);

  return {
    products: filteredProducts,
    locations,
    loading,
    error,
    stats,
    showModal,
    editingProduct,
    formData,
    filters,
    fetchProducts,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    updateFormField,
    deleteProduct,
    updateFilters,
    getLocationName
  };
}
