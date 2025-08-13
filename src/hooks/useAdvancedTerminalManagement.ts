import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';
import type { ParkingTerminal, Location, ParkingVehicleType } from '@/types/api';

interface TerminalAdvancedFilters {
  searchTerm: string;
  locationId: string;
  status: string;
  vehicleTypeId: string;
  lastPingStatus: string;
}

interface TerminalStatus {
  id: string;
  isOnline: boolean;
  lastPing: string;
  transactionCount: number;
  errorCount: number;
  uptime: number;
  performance: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
}

interface TerminalAssignment {
  terminalId: string;
  vehicleTypeId: string;
  isActive: boolean;
  maxCapacity: number;
  currentOccupancy: number;
  pricing: {
    hourlyRate: number;
    dailyRate: number;
    penaltyRate: number;
  };
}

export function useAdvancedTerminalManagement() {
  const { execute } = useApi();
  const [terminals, setTerminals] = useState<ParkingTerminal[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<ParkingVehicleType[]>([]);
  const [terminalStatuses, setTerminalStatuses] = useState<TerminalStatus[]>([]);
  const [terminalAssignments, setTerminalAssignments] = useState<TerminalAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTerminal, setSelectedTerminal] = useState<ParkingTerminal | null>(null);
  const [filters, setFilters] = useState<TerminalAdvancedFilters>({
    searchTerm: '',
    locationId: '',
    status: '',
    vehicleTypeId: '',
    lastPingStatus: ''
  });

  // Real-time status monitoring
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);

  // Fetch terminals with status
  const fetchTerminalsWithStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const terminalsRes = await execute(() => apiService.getParkingTerminals());

      if (terminalsRes && terminalsRes.code === 200) {
        setTerminals(Array.isArray(terminalsRes.data) ? terminalsRes.data : []);
        // Generate mock status data for development (would be real API call in production)
        setTerminalStatuses(generateMockStatuses(terminalsRes.data || []));
      } else {
        setError('Failed to fetch terminals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Generate mock data for development
      setTerminalStatuses(generateMockStatuses(terminals));
    } finally {
      setLoading(false);
    }
  };

  // Generate mock status data for development
  const generateMockStatuses = (terminals: ParkingTerminal[]): TerminalStatus[] => {
    return terminals.map(terminal => ({
      id: terminal.id,
      isOnline: Math.random() > 0.2, // 80% online rate
      lastPing: new Date(Date.now() - Math.random() * 3600000).toISOString(), // Random last ping within 1 hour
      transactionCount: Math.floor(Math.random() * 1000),
      errorCount: Math.floor(Math.random() * 50),
      uptime: Math.random() * 100,
      performance: {
        avgResponseTime: Math.random() * 500 + 100, // 100-600ms
        successRate: Math.random() * 20 + 80, // 80-100%
        errorRate: Math.random() * 10 // 0-10%
      }
    }));
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

  // Fetch terminal assignments
  const fetchTerminalAssignments = async () => {
    try {
      // Mock data for now
      const mockAssignments: TerminalAssignment[] = terminals.map(terminal => ({
        terminalId: terminal.id,
        vehicleTypeId: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)]?.id || '',
        isActive: Math.random() > 0.3,
        maxCapacity: Math.floor(Math.random() * 50) + 10,
        currentOccupancy: Math.floor(Math.random() * 30),
        pricing: {
          hourlyRate: Math.floor(Math.random() * 10000) + 5000,
          dailyRate: Math.floor(Math.random() * 50000) + 25000,
          penaltyRate: Math.floor(Math.random() * 20000) + 10000
        }
      }));
      setTerminalAssignments(mockAssignments);
    } catch (err) {
      console.error('Failed to fetch terminal assignments:', err);
    }
  };

  // Start/stop real-time monitoring
  const toggleMonitoring = () => {
    if (isMonitoring) {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
        setMonitoringInterval(null);
      }
      setIsMonitoring(false);
    } else {
      const interval = setInterval(() => {
        fetchTerminalsWithStatus();
      }, 30000); // Update every 30 seconds
      setMonitoringInterval(interval);
      setIsMonitoring(true);
    }
  };

  // Restart terminal
  const restartTerminal = async (terminalId: string) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status to show restart
      setTerminalStatuses(prev => prev.map(status => 
        status.id === terminalId 
          ? { ...status, isOnline: true, lastPing: new Date().toISOString() }
          : status
      ));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restart terminal');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update terminal configuration
  const updateTerminalConfig = async (terminalId: string, config: any) => {
    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Filter handlers
  const updateFilters = (newFilters: Partial<TerminalAdvancedFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get filtered terminals
  const filteredTerminals = terminals.filter(terminal => {
    const status = terminalStatuses.find(s => s.id === terminal.id);
    const assignment = terminalAssignments.find(a => a.terminalId === terminal.id);
    
    const matchesSearch = terminal.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         terminal.code.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filters.locationId && terminal.location_id !== filters.locationId) return false;
    if (filters.vehicleTypeId && assignment && assignment.vehicleTypeId !== filters.vehicleTypeId) return false;
    if (filters.lastPingStatus) {
      if (filters.lastPingStatus === 'online' && (!status || !status.isOnline)) return false;
      if (filters.lastPingStatus === 'offline' && status && status.isOnline) return false;
    }

    return true;
  });

  // Get terminal status
  const getTerminalStatus = (terminalId: string) => {
    return terminalStatuses.find(s => s.id === terminalId);
  };

  // Get terminal assignment
  const getTerminalAssignment = (terminalId: string) => {
    return terminalAssignments.find(a => a.terminalId === terminalId);
  };

  // Get location name
  const getLocationName = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    return location?.name || 'Unknown';
  };

  // Get vehicle type name
  const getVehicleTypeName = (vehicleTypeId: string) => {
    const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId);
    return vehicleType?.name || 'Unknown';
  };

  // Modal handlers
  const handleOpenStatusModal = (terminal: ParkingTerminal) => {
    setSelectedTerminal(terminal);
    setShowStatusModal(true);
  };

  const handleOpenAssignmentModal = (terminal: ParkingTerminal) => {
    setSelectedTerminal(terminal);
    setShowAssignmentModal(true);
  };

  const handleCloseModals = () => {
    setShowModal(false);
    setShowAssignmentModal(false);
    setShowStatusModal(false);
    setSelectedTerminal(null);
    setError(null);
  };

  // Stats
  const stats = {
    total: terminals.length,
    online: terminalStatuses.filter(s => s.isOnline).length,
    offline: terminalStatuses.filter(s => !s.isOnline).length,
    avgUptime: terminalStatuses.reduce((sum, s) => sum + s.uptime, 0) / (terminalStatuses.length || 1),
    totalTransactions: terminalStatuses.reduce((sum, s) => sum + s.transactionCount, 0),
    totalErrors: terminalStatuses.reduce((sum, s) => sum + s.errorCount, 0),
    avgResponseTime: terminalStatuses.reduce((sum, s) => sum + s.performance.avgResponseTime, 0) / (terminalStatuses.length || 1),
    avgSuccessRate: terminalStatuses.reduce((sum, s) => sum + s.performance.successRate, 0) / (terminalStatuses.length || 1)
  };

  // Load data on mount
  useEffect(() => {
    fetchTerminalsWithStatus();
    fetchLocations();
    fetchVehicleTypes();
  }, []);

  // Load assignments when terminals and vehicle types are ready
  useEffect(() => {
    if (terminals.length > 0 && vehicleTypes.length > 0) {
      fetchTerminalAssignments();
    }
  }, [terminals, vehicleTypes]);

  // Cleanup monitoring on unmount
  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);

  return {
    terminals: filteredTerminals,
    locations,
    vehicleTypes,
    terminalStatuses,
    terminalAssignments,
    loading,
    error,
    stats,
    filters,
    showModal,
    showAssignmentModal,
    showStatusModal,
    selectedTerminal,
    isMonitoring,
    fetchTerminalsWithStatus,
    toggleMonitoring,
    restartTerminal,
    updateTerminalConfig,
    updateFilters,
    getTerminalStatus,
    getTerminalAssignment,
    getLocationName,
    getVehicleTypeName,
    handleOpenStatusModal,
    handleOpenAssignmentModal,
    handleCloseModals
  };
}
