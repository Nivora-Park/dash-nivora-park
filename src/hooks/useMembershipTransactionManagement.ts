import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { ParkingMembershipTransaction, ParkingMembership } from '@/types/api';

interface MembershipTransactionFilters {
  searchTerm: string;
  membershipId: string;
  dateFrom: string;
  dateTo: string;
}

export function useMembershipTransactionManagement() {
  const { execute } = useApi();
  const [transactions, setTransactions] = useState<ParkingMembershipTransaction[]>([]);
  const [memberships, setMemberships] = useState<ParkingMembership[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MembershipTransactionFilters>({
    searchTerm: '',
    membershipId: '',
    dateFrom: '',
    dateTo: ''
  });

  // Fetch membership transactions
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await execute(() => apiService.getMembershipTransactions());
      
      if (response && response.code === 200) {
        setTransactions(Array.isArray(response.data) ? response.data : []);
      } else {
        setError('Failed to fetch membership transactions');
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

  // Filter handlers
  const updateFilters = (newFilters: Partial<MembershipTransactionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(transaction => {
    const membership = memberships.find(m => m.id === transaction.membership_id);
    const membershipName = membership?.name || '';
    
    const matchesSearch = membershipName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filters.membershipId && transaction.membership_id !== filters.membershipId) return false;

    // Date filtering
    if (filters.dateFrom) {
      const transactionDate = new Date(transaction.created_at);
      const fromDate = new Date(filters.dateFrom);
      if (transactionDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const transactionDate = new Date(transaction.created_at);
      const toDate = new Date(filters.dateTo + 'T23:59:59');
      if (transactionDate > toDate) return false;
    }

    return true;
  });

  // Get membership name by ID
  const getMembershipName = (membershipId: string) => {
    const membership = memberships.find(m => m.id === membershipId);
    return membership?.name || 'Unknown';
  };

  // Get membership code by ID
  const getMembershipCode = (membershipId: string) => {
    const membership = memberships.find(m => m.id === membershipId);
    return membership?.code || 'Unknown';
  };

  // Stats
  const stats = {
    total: transactions.length,
    totalAmount: transactions.reduce((sum, t) => sum + t.total_amount, 0),
    paidAmount: transactions.reduce((sum, t) => sum + t.paid_amount, 0),
    byMembership: memberships.map(membership => ({
      name: membership.name,
      count: transactions.filter(t => t.membership_id === membership.id).length,
      totalAmount: transactions
        .filter(t => t.membership_id === membership.id)
        .reduce((sum, t) => sum + t.total_amount, 0)
    }))
  };

  // Load data on mount
  useEffect(() => {
    fetchTransactions();
    fetchMemberships();
  }, []);

  return {
    transactions: filteredTransactions,
    memberships,
    loading,
    error,
    stats,
    filters,
    fetchTransactions,
    updateFilters,
    getMembershipName,
    getMembershipCode
  };
}
