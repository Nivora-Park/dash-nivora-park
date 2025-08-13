import { useState, useEffect, useMemo } from "react";
import {
  useParkingTransactionTerminals,
  useParkingTransactionPayments,
  useParkingVehicleTypes,
  useParkingTerminals,
  useLocations,
} from "@/hooks/useApi";
import type {
  ParkingTransactionTerminal,
  ParkingTransactionPayment,
  ParkingVehicleType,
  ParkingTerminal,
  Location,
} from "@/types/api";

interface VehicleRow {
  id: string;
  plateNumber: string;
  vehicleType: "car" | "motorcycle" | string;
  entryTime: string | null;
  duration: string;
  location: string;
  status: "parked" | "left" | "overdue";
  amount: number;
  terminal: string;
}

interface VehicleFilters {
  searchTerm: string;
  statusFilter: "all" | "parked" | "left" | "overdue";
  vehicleTypeFilter: "all" | "car" | "motorcycle";
}

function minutesBetween(a: string, b: Date): number {
  const ms = b.getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 60000));
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function formatDateTime(s?: string | null): string | null {
  if (!s) return null;
  const d = new Date(s);
  return d.toLocaleString("id-ID");
}

export function useVehicleManagement() {
  // State
  const [filters, setFilters] = useState<VehicleFilters>({
    searchTerm: "",
    statusFilter: "all",
    vehicleTypeFilter: "all",
  });

  // API hooks
  const { data: terminalsData, getTransactionTerminals } = useParkingTransactionTerminals();
  const { data: paymentsData, getTransactionPayments } = useParkingTransactionPayments();
  const { data: vehicleTypesData, getVehicleTypes } = useParkingVehicleTypes();
  const { data: terminalsMasterData, getTerminals } = useParkingTerminals();
  const { data: locationsData, getLocations } = useLocations();

  // Computed data
  const terminals: ParkingTransactionTerminal[] = useMemo(() => 
    Array.isArray(terminalsData) ? terminalsData : [],
    [terminalsData]
  );

  const payments: ParkingTransactionPayment[] = useMemo(() => 
    Array.isArray(paymentsData) ? paymentsData : [],
    [paymentsData]
  );

  const vehicleTypes: ParkingVehicleType[] = useMemo(() => 
    Array.isArray(vehicleTypesData) ? vehicleTypesData : [],
    [vehicleTypesData]
  );

  const terminalsMaster: ParkingTerminal[] = useMemo(() => 
    Array.isArray(terminalsMasterData) ? terminalsMasterData : [],
    [terminalsMasterData]
  );

  const locations: Location[] = useMemo(() => 
    Array.isArray(locationsData)
      ? locationsData
      : Array.isArray((locationsData as any)?.items)
      ? (locationsData as any).items
      : [],
    [locationsData]
  );

  // Helper maps
  const paymentByTransaction = useMemo(() => {
    const map = new Map<string, ParkingTransactionPayment>();
    for (const p of payments) map.set(p.transaction_id, p);
    return map;
  }, [payments]);

  const vehicleTypeIdToLocationName = useMemo(() => {
    const locMap = new Map<string, string>();
    for (const v of vehicleTypes) {
      const loc = locations.find((l) => l.id === v.location_id);
      if (v.id) locMap.set(v.id, loc?.name || "");
    }
    return locMap;
  }, [vehicleTypes, locations]);

  const terminalIdToCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of terminalsMaster)
      map.set(t.id, t.code || t.name || "Terminal");
    return map;
  }, [terminalsMaster]);

  // Process data into rows
  const rows: VehicleRow[] = useMemo(() => {
    const now = new Date();
    return terminals.map((t) => {
      const payment = paymentByTransaction.get(t.transaction_id);
      const entry = formatDateTime(t.created_at);
      const mins = t.created_at ? minutesBetween(t.created_at, now) : 0;
      const status: VehicleRow["status"] = payment
        ? "left"
        : mins > 6 * 60
        ? "overdue"
        : "parked";
      const amount =
        payment?.total_amount && typeof payment.total_amount === "number"
          ? payment.total_amount
          : 0;
      const locationName =
        vehicleTypeIdToLocationName.get(t.vehicle_type_id) || "-";
      const terminalLabel =
        terminalIdToCode.get(t.terminal_id) || t.terminal_id;
      return {
        id: t.id,
        plateNumber: t.plate_number || "-",
        vehicleType: "car",
        entryTime: entry,
        duration: formatDuration(mins),
        location: locationName,
        status,
        amount,
        terminal: terminalLabel,
      };
    });
  }, [terminals, paymentByTransaction, vehicleTypeIdToLocationName, terminalIdToCode]);

  // Filtered data
  const filteredVehicles = useMemo(() => {
    return rows.filter((vehicle) => {
      const matchesSearch =
        vehicle.plateNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        vehicle.id.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesStatus =
        filters.statusFilter === "all" || vehicle.status === filters.statusFilter;
      const matchesType =
        filters.vehicleTypeFilter === "all" ||
        vehicle.vehicleType === filters.vehicleTypeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rows, filters]);

  // Statistics
  const stats = useMemo(() => {
    const totalVehicles = rows.length;
    const parkedCount = rows.filter((v) => v.status === "parked").length;
    const overdueCount = rows.filter((v) => v.status === "overdue").length;
    
    return {
      totalVehicles,
      parkedCount,
      overdueCount,
      averageDurationMins: 0, // placeholder
    };
  }, [rows]);

  // Actions
  const updateFilters = (newFilters: Partial<VehicleFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const refreshData = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 7);
    from.setHours(0, 0, 0, 0);
    const params = {
      created_at_from: `${from.getFullYear()}-${String(
        from.getMonth() + 1
      ).padStart(2, "0")}-${String(from.getDate()).padStart(2, "0")}`,
      created_at_to: `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(to.getDate()).padStart(2, "0")}`,
      page_size: 10000,
    } as const;
    
    getTransactionTerminals(params);
    getTransactionPayments(params);
    getVehicleTypes();
    getTerminals();
    getLocations();
  };

  // Initialize data
  useEffect(() => {
    if (typeof window === "undefined") return;
    refreshData();
  }, []);

  return {
    // Data
    vehicles: filteredVehicles,
    stats,
    filters,
    
    // Actions
    updateFilters,
    refreshData,
    
    // Utils
    formatDateTime,
    formatDuration,
  };
}