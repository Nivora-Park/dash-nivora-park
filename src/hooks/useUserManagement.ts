import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SystemUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string | null;
  permissions: string[];
  terminal: string;
  location_id?: string;
  created_at: string;
  updated_at: string;
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
      const matchesSearch = user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.searchTerm.toLowerCase());
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
  const fetchUsers = async (retryCount = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('auth-token');
      console.log('Fetching users with token:', token ? 'Token exists' : 'No token');

      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 && retryCount < 3) {
          // Retry after a short delay if unauthorized
          console.log(`Retrying fetch users (attempt ${retryCount + 1})`);
          setTimeout(() => fetchUsers(retryCount + 1), 1000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch users');
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

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create user');
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

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update user');
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

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to delete user');
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

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'suspended' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to suspend user');
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

      const token = localStorage.getItem('auth-token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Refresh users list
        await fetchUsers();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to activate user');
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