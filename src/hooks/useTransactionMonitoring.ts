import { useState, useEffect, useMemo } from "react";
import {
  useParkingTransactionPayments,
  useParkingTransactionTerminals,
  useParkingTransactions,
  useParkingPaymentTypes,
  useParkingTerminals,
} from "@/hooks/useApi";
import type {
  ParkingTransactionPayment,
  ParkingTransactionTerminal,
  ParkingTransaction,
  ParkingPaymentType,
  ParkingTerminal,
} from "@/types/api";

export interface TransactionChartPoint {
  label: string;
  transactions: number;
  revenue: number;
}

export interface MonitoringTableRow {
  id: string;
  plateNumber: string;
  vehicleType: "car" | "motorcycle" | string;
  entryTime: string | null;
  exitTime: string | null;
  duration: string | null;
  amount: number;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
  terminal: string;
}

interface StatsItem {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  color: string;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export function useTransactionMonitoring() {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today");

  // API hooks
  const { data: paymentsData, getTransactionPayments } = useParkingTransactionPayments();
  const { data: terminalsData, getTransactionTerminals } = useParkingTransactionTerminals();
  const { data: transactionsData, getTransactions } = useParkingTransactions();
  const { data: paymentTypesData, getPaymentTypes } = useParkingPaymentTypes();
  const { data: terminalsMasterData, getTerminals } = useParkingTerminals();

  // Processed data
  const payments: ParkingTransactionPayment[] = useMemo(() => 
    Array.isArray(paymentsData) ? paymentsData : [],
    [paymentsData]
  );

  const terminals: ParkingTransactionTerminal[] = useMemo(() => 
    Array.isArray(terminalsData) ? terminalsData : [],
    [terminalsData]
  );

  const transactions: ParkingTransaction[] = useMemo(() => 
    Array.isArray(transactionsData) ? transactionsData : [],
    [transactionsData]
  );

  const paymentTypes: ParkingPaymentType[] = useMemo(() => 
    Array.isArray(paymentTypesData) ? paymentTypesData : [],
    [paymentTypesData]
  );

  const terminalsMaster: ParkingTerminal[] = useMemo(() => 
    Array.isArray(terminalsMasterData) ? terminalsMasterData : [],
    [terminalsMasterData]
  );

  // Helper maps
  const transactionIdToTerminal = useMemo(() => {
    const map = new Map<string, ParkingTransactionTerminal>();
    for (const t of terminals) {
      if (t && t.transaction_id) map.set(t.transaction_id, t);
    }
    return map;
  }, [terminals]);

  const paymentTypeIdToName = useMemo(() => {
    const map = new Map<string, string>();
    for (const pt of paymentTypes) {
      map.set(pt.id, pt.name ?? pt.code ?? "Unknown");
    }
    return map;
  }, [paymentTypes]);

  const terminalIdToCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of terminalsMaster) {
      map.set(t.id, t.code ?? t.name ?? "Terminal");
    }
    return map;
  }, [terminalsMaster]);

  // Statistics
  const stats = useMemo(() => {
    const totalTransactions = payments.length;
    const totalRevenue = payments.reduce(
      (sum, p) => sum + (typeof p.total_amount === "number" ? p.total_amount : 0),
      0
    );
    
    const avgDurationMinutes = (() => {
      const list = transactions.map((t) =>
        typeof t.duration_minutes === "number" ? t.duration_minutes : 0
      );
      if (list.length === 0) return 0;
      const total = list.reduce((s, v) => s + v, 0);
      return Math.round(total / list.length);
    })();

    const activeVehicles = (() => {
      const set = new Set<string>();
      for (const t of terminals) {
        if (t.plate_number) set.add(t.plate_number);
      }
      return set.size;
    })();

    return {
      totalTransactions,
      totalRevenue,
      avgDurationMinutes,
      activeVehicles,
    };
  }, [payments, transactions, terminals]);

  // Chart data
  const chartData: TransactionChartPoint[] = useMemo(() => {
    if (timeFilter === "today") {
      const points: TransactionChartPoint[] = Array.from(
        { length: 24 },
        (_, h) => ({
          label: `${String(h).padStart(2, "0")}:00`,
          transactions: 0,
          revenue: 0,
        })
      );
      for (const p of payments) {
        const d = new Date(p.created_at);
        const h = d.getHours();
        const idx = Math.max(0, Math.min(23, h));
        points[idx].transactions += 1;
        points[idx].revenue +=
          typeof p.total_amount === "number" ? p.total_amount : 0;
      }
      return points;
    }
    
    // week/month -> agregasi per hari
    const buckets = new Map<string, { transactions: number; revenue: number }>();
    for (const p of payments) {
      const key = formatDate(new Date(p.created_at));
      const prev = buckets.get(key) || { transactions: 0, revenue: 0 };
      prev.transactions += 1;
      prev.revenue += typeof p.total_amount === "number" ? p.total_amount : 0;
      buckets.set(key, prev);
    }
    const labels = Array.from(buckets.keys()).sort();
    return labels.map((label) => ({
      label,
      transactions: buckets.get(label)!.transactions,
      revenue: buckets.get(label)!.revenue,
    }));
  }, [payments, timeFilter]);

  // Table rows
  const tableRows: MonitoringTableRow[] = useMemo(() => {
    return payments.map((p) => {
      const terminal = transactionIdToTerminal.get(p.transaction_id);
      const entryTime = terminal?.created_at
        ? new Date(terminal.created_at).toLocaleString("id-ID")
        : null;
      const exitTime = p.created_at
        ? new Date(p.created_at).toLocaleString("id-ID")
        : null;
      
      let duration: string | null = null;
      if (terminal?.created_at && p.created_at) {
        const ms = new Date(p.created_at).getTime() - new Date(terminal.created_at).getTime();
        const mins = Math.max(0, Math.round(ms / 60000));
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
      }
      
      const paymentMethod = paymentTypeIdToName.get(p.payment_type_id) || "—";
      const terminalLabel = terminalIdToCode.get(p.terminal_id) || p.terminal_id;
      
      return {
        id: p.id,
        plateNumber: terminal?.plate_number || "-",
        vehicleType: "car",
        entryTime,
        exitTime,
        duration,
        amount: typeof p.total_amount === "number" ? p.total_amount : 0,
        paymentMethod,
        status: "completed",
        terminal: terminalLabel,
      } as MonitoringTableRow;
    });
  }, [payments, transactionIdToTerminal, paymentTypeIdToName, terminalIdToCode]);

  // Actions
  const updateTimeFilter = (filter: "today" | "week" | "month") => {
    setTimeFilter(filter);
  };

  const refreshData = () => {
    let from: Date;
    let to: Date = endOfToday();
    
    if (timeFilter === "today") {
      from = startOfToday();
    } else if (timeFilter === "week") {
      from = addDays(startOfToday(), -6);
    } else {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      from = d;
    }

    const params = {
      created_at_from: formatDate(from),
      created_at_to: formatDate(to),
      page_size: 5000,
    } as const;

    getTransactionPayments(params);
    getTransactionTerminals(params);
    getTransactions(params);
    getPaymentTypes();
    getTerminals();
  };

  const exportData = () => {
    // TODO: Implement export functionality
    console.log("Export data");
  };

  // Load data when filter changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    refreshData();
  }, [timeFilter]);

  return {
    // State
    timeFilter,
    
    // Data
    stats,
    chartData,
    tableRows,
    terminalsMaster,
    payments,
    
    // Actions
    updateTimeFilter,
    refreshData,
    exportData,
  };
}