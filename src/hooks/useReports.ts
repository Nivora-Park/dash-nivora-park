import { useState, useEffect, useMemo } from 'react';
import { useParkingTransactionPayments, useParkingVehicleTypes } from '@/hooks/useApi';
import type { ParkingTransactionPayment, ParkingVehicleType } from '@/types/api';

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString('id-ID', { month: 'short' });
}

function formatYYYYMM(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function useReports() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [reportType, setReportType] = useState<'revenue' | 'vehicles' | 'performance'>('revenue');

  // API hooks
  const { data: paymentsData, getTransactionPayments } = useParkingTransactionPayments();
  const { data: vehicleTypesData, getVehicleTypes } = useParkingVehicleTypes();

  // Processed data
  const payments: ParkingTransactionPayment[] = useMemo(() => 
    Array.isArray(paymentsData) ? paymentsData : [],
    [paymentsData]
  );

  const vehicleTypes: ParkingVehicleType[] = useMemo(() => 
    Array.isArray(vehicleTypesData) ? vehicleTypesData : [],
    [vehicleTypesData]
  );

  // Statistics
  const stats = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + (typeof p.total_amount === 'number' ? p.total_amount : 0), 0);
    const totalTransactions = payments.length;
    const averageRevenue = totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0;
    
    return {
      totalRevenue,
      totalTransactions,
      averageRevenue,
      growth: 0, // placeholder
    };
  }, [payments]);

  // Chart data
  const chartData = useMemo(() => {
    // Dataset pendapatan bulanan: group by YYYY-MM
    const monthlyMap = new Map<string, { month: Date; revenue: number; transactions: number }>();
    
    for (const p of payments) {
      const d = new Date(p.created_at);
      const key = formatYYYYMM(d);
      const entry = monthlyMap.get(key) || { 
        month: new Date(d.getFullYear(), d.getMonth(), 1), 
        revenue: 0, 
        transactions: 0 
      };
      entry.revenue += typeof p.total_amount === 'number' ? p.total_amount : 0;
      entry.transactions += 1;
      monthlyMap.set(key, entry);
    }

    const revenueData = Array.from(monthlyMap.values())
      .sort((a, b) => a.month.getTime() - b.month.getTime())
      .map(item => ({ 
        month: formatMonthLabel(item.month), 
        revenue: item.revenue, 
        transactions: item.transactions 
      }));

    // Distribusi jenis kendaraan
    const vehicleCounts = new Map<string, number>();
    for (const p of payments) {
      // Use 'vehicle_type_id' from ParkingTransactionPayment
            const key = (p as any).vehicle_type ?? 'unknown';
            vehicleCounts.set(key, (vehicleCounts.get(key) || 0) + 1);
    }

    const vehicleTypeData = Array.from(vehicleCounts.entries()).map(([vehicleTypeId, value]) => {
      const vt = vehicleTypes.find(v => v.id === vehicleTypeId);
      const name = vt?.name || 'Lainnya';
      return { name, value, color: '#3b82f6' };
    });

    return {
      revenueData,
      vehicleTypeData,
    };
  }, [payments, vehicleTypes]);

  // Actions
  const updateDateRange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setDateRange(range);
  };

  const updateReportType = (type: 'revenue' | 'vehicles' | 'performance') => {
    setReportType(type);
  };

  const exportReport = () => {
    // TODO: Implement export functionality
    console.log('Export report');
  };

  const generateDailyReport = () => {
    // TODO: Implement daily report generation
    console.log('Generate daily report');
  };

  const generateMonthlyReport = () => {
    // TODO: Implement monthly report generation
    console.log('Generate monthly report');
  };

  const analyzeVehicles = () => {
    // TODO: Implement vehicle analysis
    console.log('Analyze vehicles');
  };

  const exportAllData = () => {
    // TODO: Implement export all data
    console.log('Export all data');
  };

  // Initialize data
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Ambil data 6 bulan terakhir sebagai dasar laporan
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 5, 1);
    start.setHours(0, 0, 0, 0);
    
    const params = {
      created_at_from: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-01`,
      created_at_to: `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate()).padStart(2, '0')}`,
      page_size: 10000,
    } as const;
    
    getTransactionPayments(params);
    getVehicleTypes();
  }, [getTransactionPayments, getVehicleTypes]);

  return {
    // State
    dateRange,
    reportType,
    
    // Data
    stats,
    chartData,
    
    // Actions
    updateDateRange,
    updateReportType,
    exportReport,
    generateDailyReport,
    generateMonthlyReport,
    analyzeVehicles,
    exportAllData,
  };
}