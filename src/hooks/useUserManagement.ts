import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import { validateDuplicates, getValidationRules } from '@/utils/validation';

interface SystemUser {
  id: string;
  username?: string;
  full_name?: string; // Changed from 'name' to 'full_name' to match API
  email?: string;
  password?: string;
  role?: 'admin' | 'operator' | 'viewer';
  status?: 'active' | 'inactive' | 'suspended';
  lastLogin?: string | null;
  permissions?: string[];
  terminal?: string;
  location_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

// Initial empty state - will be populated from API
const initialUsers: SystemUser[] = [];

export function useUserManagement() {
  const { isAuthenticated } = useAuth();
  const { execute } = useApi();

  // State
  const [users, setUsers] = useState<SystemUser[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    roleFilter: 'all',
    statusFilter: 'all'
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesSearch =
        (user.full_name?.toLowerCase() || '').includes(searchTerm) ||
        (user.email?.toLowerCase() || '').includes(searchTerm) ||
        (user.username?.toLowerCase() || '').includes(searchTerm);
      const matchesRole = filters.roleFilter === 'all' || user.role === filters.roleFilter;
      const matchesStatus = filters.statusFilter === 'all' || user.status === filters.statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters]);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      operatorUsers: users.filter(u => u.role === 'operator').length,
    };
  }, [users]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await execute(() => apiService.getUsers());

      if (response && response.code === 200) {
        const userData = Array.isArray(response.data) ? response.data : [];
        setUsers(userData);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Fetch users error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Add small delay to ensure token is properly stored after login
      const timer = setTimeout(() => {
        fetchUsers();
      }, 500); // Increased delay to ensure token is properly stored

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Actions
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const createUser = async (userData: Omit<SystemUser, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);

      // Prepare data for API (only send fields that API expects)
      const apiData = {
        username: userData.username,
        email: userData.email,
        full_name: userData.full_name,
        password: userData.password,
        location_id: userData.location_id
      };

      // Validate for duplicates before creating
      const validation = await validateDuplicates(userData, users, getValidationRules('user'));
      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        return false;
      }

      const response = await execute(() => apiService.createUser(apiData));

      if (response && (response.code === 201 || response.code === 200)) {
        await fetchUsers();
        return response.data;
      } else {
        setError('Failed to create user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Create user error:', err);
      throw err;
    }
  };

  const editUser = async (userId: string, userData: Partial<SystemUser>) => {
    try {
      setError(null);

      // Validate for duplicates before updating (exclude current item)
      const validation = await validateDuplicates(userData, users, getValidationRules('user'), userId);
      if (!validation.isValid) {
        setError(`Validation failed: ${validation.errors.join(', ')}`);
        return false;
      }

      const response = await execute(() => apiService.updateUser(userId, userData));

      if (response && response.code === 200) {
        await fetchUsers();
        return response.data;
      } else {
        setError('Failed to update user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      console.error('Edit user error:', err);
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setError(null);

      const response = await execute(() => apiService.deleteUser(userId));

      if (response && response.code === 200) {
        await fetchUsers();
        return response.data;
      } else {
        setError('Failed to delete user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Delete user error:', err);
      throw err;
    }
  };

  const suspendUser = async (userId: string) => {
    try {
      setError(null);

      const response = await execute(() => apiService.updateUser(userId, { status: 'suspended' }));

      if (response && response.code === 200) {
        await fetchUsers();
        return response.data;
      } else {
        setError('Failed to suspend user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend user');
      console.error('Suspend user error:', err);
      throw err;
    }
  };

  const activateUser = async (userId: string) => {
    try {
      setError(null);

      const response = await execute(() => apiService.updateUser(userId, { status: 'active' }));

      if (response && response.code === 200) {
        await fetchUsers();
        return response.data;
      } else {
        setError('Failed to activate user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user');
      console.error('Activate user error:', err);
      throw err;
    }
  };

  return {
    // Data
    users: filteredUsers,
    allUsers: users,
    stats,
    filters,
    isLoading,
    error,

    // Actions
    updateFilters,
    createUser,
    editUser,
    deleteUser,
    suspendUser,
    activateUser,
    fetchUsers,
  };
}