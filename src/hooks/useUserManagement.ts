import { useState, useMemo } from 'react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  terminal: string;
}

interface UserFilters {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
}

// Mock data - in real app this would come from API
const mockUsers: SystemUser[] = [
  {
    id: 'USR-001',
    name: 'Admin Nivora',
    email: 'admin@nivora.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2 menit yang lalu',
    permissions: ['all'],
    terminal: 'All'
  },
  {
    id: 'USR-002',
    name: 'Operator A1',
    email: 'operator.a1@nivora.com',
    role: 'operator',
    status: 'active',
    lastLogin: '15 menit yang lalu',
    permissions: ['terminal_a1', 'transactions', 'reports'],
    terminal: 'A1'
  },
  {
    id: 'USR-003',
    name: 'Operator B1',
    email: 'operator.b1@nivora.com',
    role: 'operator',
    status: 'inactive',
    lastLogin: '2 jam yang lalu',
    permissions: ['terminal_b1', 'transactions'],
    terminal: 'B1'
  },
  {
    id: 'USR-004',
    name: 'Viewer Reports',
    email: 'viewer@nivora.com',
    role: 'viewer',
    status: 'active',
    lastLogin: '1 jam yang lalu',
    permissions: ['reports', 'analytics'],
    terminal: 'None'
  },
  {
    id: 'USR-005',
    name: 'Operator A2',
    email: 'operator.a2@nivora.com',
    role: 'operator',
    status: 'suspended',
    lastLogin: '1 hari yang lalu',
    permissions: ['terminal_a2', 'transactions'],
    terminal: 'A2'
  }
];

export function useUserManagement() {
  // State
  const [users] = useState<SystemUser[]>(mockUsers);
  const [filters, setFilters] = useState<UserFilters>({
    searchTerm: '',
    roleFilter: 'all',
    statusFilter: 'all'
  });

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(filters.searchTerm.toLowerCase());
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

  // Actions
  const updateFilters = (newFilters: Partial<UserFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const createUser = () => {
    // TODO: Implement user creation
    console.log('Create user');
  };

  const editUser = (userId: string) => {
    // TODO: Implement user editing
    console.log('Edit user:', userId);
  };

  const deleteUser = (userId: string) => {
    // TODO: Implement user deletion
    console.log('Delete user:', userId);
  };

  const suspendUser = (userId: string) => {
    // TODO: Implement user suspension
    console.log('Suspend user:', userId);
  };

  const activateUser = (userId: string) => {
    // TODO: Implement user activation
    console.log('Activate user:', userId);
  };

  return {
    // Data
    users: filteredUsers,
    allUsers: users,
    stats,
    filters,
    
    // Actions
    updateFilters,
    createUser,
    editUser,
    deleteUser,
    suspendUser,
    activateUser,
  };
}