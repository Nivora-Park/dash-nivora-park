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
  uniqueId: string;
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
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>( {
    startDate: formatDate(startOfToday()),
    endDate: formatDate(endOfToday()),
  });

  // API hooks
  const { data: paymentsData, loading: paymentsLoading, getTransactionPayments } = useParkingTransactionPayments();
  const { data: terminalsData, loading: terminalsLoading, getTransactionTerminals } = useParkingTransactionTerminals();
  const { data: transactionsData, loading: transactionsLoading, getTransactions } = useParkingTransactions();
  const { data: paymentTypesData, loading: paymentTypesLoading, getPaymentTypes } = useParkingPaymentTypes();
  const { data: terminalsMasterData, loading: terminalsMasterLoading, getTerminals } = useParkingTerminals();

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

  const terminalsMaster: ParkingTerminal[] = useMemo(() => {
    return Array.isArray(terminalsMasterData) ? terminalsMasterData : [];
  }, [terminalsMasterData]);

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

  // Terminal counts
  const terminalEntryCounts = new Map<string, number>();
  const terminalExitCounts = new Map<string, number>();

  // Calculate terminal counts based on payments and terminals
  const terminalsToCount = terminals.filter(t => {
    const terminalDate = new Date(t.created_at);
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();
      return terminalDate >= start && terminalDate <= end;
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      return terminalDate >= start && terminalDate <= end;
    }
  });

  for (const terminal of terminalsToCount) {
    const terminalMaster = terminalsMaster.find(t => t.id === terminal.terminal_id);
    if (!terminalMaster) continue;

    // Find payment for this transaction
    const payment = payments.find(p => p.transaction_id === terminal.transaction_id);

    // If payment exists and has created_at, consider as exit (completed)
    if (payment && payment.created_at) {
      const count = terminalExitCounts.get(terminal.terminal_id) || 0;
      terminalExitCounts.set(terminal.terminal_id, count + 1);
    } else {
      // Otherwise, consider as entry (active)
      const count = terminalEntryCounts.get(terminal.terminal_id) || 0;
      terminalEntryCounts.set(terminal.terminal_id, count + 1);
    }
  }

  // Debug logs for terminal counts
  console.log("Terminal Entry Counts:", Array.from(terminalEntryCounts.entries()));
  console.log("Terminal Exit Counts:", Array.from(terminalExitCounts.entries()));

  // Statistics
  const stats = useMemo(() => {
    // Filter payments to those with exit gate filled (completed) or pending
    let filteredPayments = payments.filter(p => {
      const hasExitGate = terminals.some(t => t.transaction_id === p.transaction_id && t.created_at);
      return hasExitGate || !hasExitGate && !p.total_amount;
    });
    let filteredTransactions = transactions;
    let filteredTerminals = terminals;

    // If no date range selected, default to today only
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();

      filteredPayments = filteredPayments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });

      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate >= start && transactionDate <= end;
      });

      filteredTerminals = terminals.filter(t => {
        const terminalDate = new Date(t.created_at);
        return terminalDate >= start && terminalDate <= end;
      });
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      filteredPayments = filteredPayments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });

      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate >= start && transactionDate <= end;
      });

      filteredTerminals = terminals.filter(t => {
        const terminalDate = new Date(t.created_at);
        return terminalDate >= start && terminalDate <= end;
      });
    }

    const totalTransactions = filteredPayments.length;
    const totalRevenue = filteredPayments.reduce(
      (sum, p) => sum + (typeof p.total_amount === "number" ? p.total_amount : 0),
      0
    );
    
    const avgDurationMinutes = (() => {
      const list = filteredTransactions.map((t) =>
        typeof t.duration_minutes === "number" ? t.duration_minutes : 0
      );
      if (list.length === 0) return 0;
      const total = list.reduce((s, v) => s + v, 0);
      return Math.round(total / list.length);
    })();

    const activeVehicles = (() => {
      const set = new Set<string>();
      for (const t of filteredTerminals) {
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
  }, [payments, transactions, terminals, dateRange]);

  // Chart data
  const chartData: TransactionChartPoint[] = useMemo(() => {
    let filteredPayments = payments;

    // If no date range selected, default to today only
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    if (timeFilter === "today") {
      const points: TransactionChartPoint[] = Array.from(
        { length: 24 },
        (_, h) => ({
          label: `${String(h).padStart(2, "0")}:00`,
          transactions: 0,
          revenue: 0,
        })
      );
      for (const p of filteredPayments) {
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
    for (const p of filteredPayments) {
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
  }, [payments, timeFilter, dateRange]);

  // Table rows
  const tableRows: MonitoringTableRow[] = useMemo(() => {
    let filteredPayments = payments;

    // If no date range selected, default to today only
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    const transactionRows = new Map<string, MonitoringTableRow>();

    for (const p of filteredPayments) {
      const transactionId = p.transaction_id;
      const terminalEntry = transactionIdToTerminal.get(transactionId);
      const entryTime = terminalEntry?.created_at
        ? new Date(terminalEntry.created_at).toLocaleString("id-ID")
        : null;

      // Determine exit terminal if available
      const terminalExit = terminals.find(t => t.transaction_id === transactionId && t.created_at !== terminalEntry?.created_at);
      const exitTimeDate = terminalExit?.created_at
        ? new Date(terminalExit.created_at)
        : null;

      let duration: string | null = null;
      if (terminalEntry?.created_at && exitTimeDate) {
        const ms = exitTimeDate.getTime() - new Date(terminalEntry.created_at).getTime();
        const mins = Math.max(0, Math.round(ms / 60000));
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
      }

      const exitTime = exitTimeDate ? exitTimeDate.toLocaleString("id-ID") : null;

      const paymentMethod = paymentTypeIdToName.get(p.payment_type_id) || "—";
      const terminalLabel = terminalIdToCode.get(p.terminal_id) || p.terminal_id;

      // Status is completed only if exitTime exists
      const status = exitTime ? "completed" : "pending";

      const row: MonitoringTableRow = {
        id: transactionId,
        uniqueId: p.id,
        plateNumber: terminalEntry?.plate_number || "-",
        vehicleType: "car",
        entryTime,
        exitTime,
        duration,
        amount: typeof p.total_amount === "number" ? p.total_amount : 0,
        paymentMethod,
        status,
        terminal: terminalLabel,
      };

      const existing = transactionRows.get(transactionId);
      if (!existing) {
        transactionRows.set(transactionId, row);
      } else if (exitTime && !existing.exitTime) {
        // Prefer row with exit time
        transactionRows.set(transactionId, row);
      } else if ((!!exitTime === !!existing.exitTime) && row.amount > existing.amount) {
        // If both have exit or both don't, prefer higher amount
        transactionRows.set(transactionId, row);
      }
    }

    return Array.from(transactionRows.values());
  }, [payments, transactionIdToTerminal, paymentTypeIdToName, terminalIdToCode, dateRange]);

  // Loading state combining all API hooks
  const loading = paymentsLoading || terminalsLoading || transactionsLoading || paymentTypesLoading || terminalsMasterLoading;

  // Actions
  const updateTimeFilter = (filter: "today" | "week" | "month") => {
    setTimeFilter(filter);
    // Reset date range when time filter changes
    setDateRange({ startDate: null, endDate: null });
  };

  const updateDateRange = (startDate: string | null, endDate: string | null) => {
    setDateRange({ startDate, endDate });
    // Reset time filter when date range changes
    setTimeFilter("today");
  };

  const refreshData = () => {
    let from: Date | null = null;
    let to: Date | null = null;

    if (dateRange.startDate && dateRange.endDate) {
      from = new Date(dateRange.startDate);
      to = new Date(dateRange.endDate);
      to.setHours(23, 59, 59, 999);
    } else {
      to = endOfToday();
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
    }

    const params = {
      created_at_from: from ? formatDate(from) : undefined,
      created_at_to: to ? formatDate(to) : undefined,
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
  }, [timeFilter, dateRange]);

  return {
    // State
    timeFilter,
    dateRange,

    // Data
    stats,
    chartData,
    tableRows,
    terminalsMaster,
    payments,

    // Terminal counts
    terminalEntryCounts,
    terminalExitCounts,

    // Loading state
    loading,

    // Actions
    updateTimeFilter,
    updateDateRange,
    refreshData,
    exportData,
  };
}
