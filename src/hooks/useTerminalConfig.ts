import { useState, useEffect, useMemo } from "react";
import {
  useParkingTerminals,
  useLocations,
  useParkingRates,
} from "@/hooks/useApi";
import { ParkingTerminal, Location, ParkingRate } from "@/types/api";

interface TerminalFormData {
  location_id: string;
  rate_id: string;
  code: string;
  name: string;
  description: string;
  ip_terminal: string;
  ip_printer: string;
  printer_type: string;
  ip_camera: string;
  logo_url: string;
}

interface FormErrors {
  location_id?: string;
  rate_id?: string;
  code?: string;
  name?: string;
  ip_terminal?: string;
  ip_printer?: string;
  printer_type?: string;
  ip_camera?: string;
}

interface FilterState {
  searchTerm: string;
  locationFilter: string;
  rateFilter: string;
}

export function useTerminalConfig() {
  // State management
  const [selectedTerminal, setSelectedTerminal] = useState<ParkingTerminal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [terminalOverrides, setTerminalOverrides] = useState<Record<string, Partial<ParkingTerminal>>>({});
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    locationFilter: "all",
    rateFilter: "all",
  });

  // Form state
  const [formData, setFormData] = useState<TerminalFormData>({
    location_id: "",
    rate_id: "",
    code: "",
    name: "",
    description: "",
    ip_terminal: "",
    ip_printer: "",
    printer_type: "",
    ip_camera: "",
    logo_url: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // API hooks
  const {
    data: terminalsData,
    loading: terminalsLoading,
    error: terminalsError,
    getTerminals,
    createTerminal,
    updateTerminal,
    deleteTerminal,
  } = useParkingTerminals();

  const {
    data: locationsData,
    loading: locationsLoading,
    getLocations,
  } = useLocations();

  const {
    data: ratesData,
    loading: ratesLoading,
    getRates,
  } = useParkingRates();

  // Computed values
  const terminals = useMemo(() => 
    Array.isArray(terminalsData) ? terminalsData : [], 
    [terminalsData]
  );

  const locationsArray = useMemo(() => 
    Array.isArray(locationsData)
      ? locationsData
      : locationsData && Array.isArray((locationsData as any).items)
      ? (locationsData as any).items
      : [], 
    [locationsData]
  );

  const rates = useMemo(() => 
    Array.isArray(ratesData) ? ratesData : [], 
    [ratesData]
  );

  const rateOptions = useMemo(() =>
    rates && rates.length > 0
      ? rates.map((r: ParkingRate) => ({
          id: r.id,
          name:
            r.name ||
            r.description ||
            `Tarif Rp ${r.first_hour_cost?.toLocaleString()}/jam` ||
            "Tarif Tidak Diketahui",
        }))
      : [],
    [rates]
  );

  const locationOptions = useMemo(() =>
    locationsArray && locationsArray.length > 0
      ? locationsArray.map((loc: Location) => ({ id: loc.id, name: loc.name }))
      : [],
    [locationsArray]
  );

  const filteredTerminals = useMemo(() => 
    terminals.filter((terminal: ParkingTerminal) => {
      if (!terminal || typeof terminal !== "object") return false;
      if (!terminal.name || !terminal.code) return false;

      const matchesSearch =
        terminal.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        terminal.code.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesLocation =
        filters.locationFilter === "all" || terminal.location_id === filters.locationFilter;
      const matchesRate = 
        filters.rateFilter === "all" || terminal.rate_id === filters.rateFilter;

      return matchesSearch && matchesLocation && matchesRate;
    }),
    [terminals, filters]
  );

  // Helper functions
  const getRateName = (rateId: string): string => {
    if (!Array.isArray(rates)) {
      return "Tarif tidak ditemukan";
    }

    const rate = rates.find((r: ParkingRate) => r && r.id === rateId);
    return rate
      ? rate.name ||
          rate.description ||
          `Tarif Rp ${rate.first_hour_cost?.toLocaleString()}/jam`
      : "Tarif tidak ditemukan";
  };

  const getTerminalLocationName = (terminal: ParkingTerminal): string => {
    const rate = Array.isArray(rates)
      ? (rates as ParkingRate[]).find((r) => r.id === terminal.rate_id)
      : undefined;
    if (!rate || !rate.location_id) return "Lokasi tidak ditemukan";
    
    const location = locationsArray.find((loc: Location) => loc.id === rate.location_id);
    return location?.name || "Lokasi tidak ditemukan";
  };

  const mergeTerminal = (t: ParkingTerminal): ParkingTerminal => {
    const override = terminalOverrides[t.id] || {};
    return { ...t, ...override } as ParkingTerminal;
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.rate_id) errors.rate_id = "Tarif wajib dipilih";
    if (!String(formData.code).trim()) errors.code = "Kode terminal wajib diisi";
    if (!String(formData.name).trim()) errors.name = "Nama terminal wajib diisi";
    if (!String(formData.ip_terminal).trim()) errors.ip_terminal = "IP Terminal wajib diisi";
    if (!String(formData.ip_printer).trim()) errors.ip_printer = "IP Printer wajib diisi";
    if (!String(formData.printer_type).trim()) errors.printer_type = "Tipe printer wajib diisi";
    if (!String(formData.ip_camera).trim()) errors.ip_camera = "IP Camera wajib diisi";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      location_id: "",
      rate_id: "",
      code: "",
      name: "",
      description: "",
      ip_terminal: "",
      ip_printer: "",
      printer_type: "",
      ip_camera: "",
      logo_url: "",
    });
    setFormErrors({});
    setSelectedTerminal(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (terminal: ParkingTerminal) => {
    setSelectedTerminal(terminal);
    setFormData({
      location_id: terminal.location_id || "",
      rate_id: terminal.rate_id || "",
      code: terminal.code || "",
      name: terminal.name || "",
      description: terminal.description || "",
      ip_terminal: terminal.ip_terminal || "",
      ip_printer: terminal.ip_printer || "",
      printer_type: terminal.printer_type || "",
      ip_camera: terminal.ip_camera || "",
      logo_url: terminal.logo_url || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedTerminal) {
        await updateTerminal(selectedTerminal.id, formData);
      } else {
        await createTerminal(formData);
      }
      closeModal();
      getTerminals(); // Refresh data
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (terminalId: string) => {
    try {
      await deleteTerminal(terminalId);
      getTerminals(); // Refresh data
    } catch (error) {
      console.error("Error deleting terminal:", error);
    }
  };

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const updateFormField = (field: keyof TerminalFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Initialize data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      getTerminals();
      getLocations();
      getRates();
    }
  }, [getTerminals, getLocations, getRates]);

  // Set default values when data is loaded
  useEffect(() => {
    if (!formData.location_id && locationsArray.length > 0) {
      setFormData(prev => ({ ...prev, location_id: locationsArray[0].id }));
    }
  }, [locationsArray.length, formData.location_id]);

  useEffect(() => {
    if (!formData.rate_id && rates.length > 0) {
      setFormData(prev => ({ ...prev, rate_id: rates[0].id }));
    }
  }, [rates.length, formData.rate_id]);

  return {
    // State
    selectedTerminal,
    isModalOpen,
    formData,
    formErrors,
    filters,
    
    // Computed data
    terminals,
    filteredTerminals,
    locationOptions,
    rateOptions,
    
    // Loading states
    isLoading: terminalsLoading || locationsLoading || ratesLoading,
    terminalsError,
    
    // Helper functions
    getRateName,
    getTerminalLocationName,
    mergeTerminal,
    
    // Actions
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmit,
    handleDelete,
    updateFilters,
    updateFormField,
    refreshData: getTerminals,
  };
}