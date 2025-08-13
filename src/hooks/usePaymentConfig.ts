import { useState, useEffect, useMemo } from "react";
import { 
  useParkingPaymentTypes, 
  useParkingRates, 
  useParkingVehicleTypes,
  useParkingTransactionPayments 
} from "@/hooks/useApi";
import { ParkingPaymentType, ParkingRate, ParkingVehicleType } from "@/types/api";

interface PaymentFormData {
  location_id: string;
  code: string;
  name: string;
  description: string;
  logo_url: string;
}

interface RateFormData {
  vehicle_type_id: string;
  description: string;
  first_hour_cost: number;
  subsequent_hour_cost: number;
  daily_max_cost: number;
  lost_ticket_cost: number;
  tax_cost: number;
  service_cost: number;
}

export function usePaymentConfig() {
  // State
  const [activeTab, setActiveTab] = useState<'methods' | 'rates'>('methods');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<ParkingPaymentType | null>(null);
  const [selectedRate, setSelectedRate] = useState<ParkingRate | null>(null);

  // Form state
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({
    location_id: '',
    code: '',
    name: '',
    description: '',
    logo_url: ''
  });

  const [rateFormData, setRateFormData] = useState<RateFormData>({
    vehicle_type_id: '',
    description: '',
    first_hour_cost: 0,
    subsequent_hour_cost: 0,
    daily_max_cost: 0,
    lost_ticket_cost: 0,
    tax_cost: 0,
    service_cost: 0
  });

  // API hooks
  const {
    data: paymentTypesData,
    loading: paymentTypesLoading,
    error: paymentTypesError,
    getPaymentTypes,
    createPaymentType,
    updatePaymentType,
    deletePaymentType
  } = useParkingPaymentTypes();

  const {
    data: ratesData,
    loading: ratesLoading,
    error: ratesError,
    getRates,
    createRate,
    updateRate,
    deleteRate
  } = useParkingRates();

  const {
    data: vehicleTypesData,
    loading: vehicleTypesLoading,
    getVehicleTypes
  } = useParkingVehicleTypes();

  const {
    data: transactionPaymentsData,
    getTransactionPayments,
  } = useParkingTransactionPayments();

  // Processed data
  const paymentTypes = useMemo(() => 
    Array.isArray(paymentTypesData) ? paymentTypesData : [],
    [paymentTypesData]
  );

  const rates = useMemo(() => 
    Array.isArray(ratesData) ? ratesData : [],
    [ratesData]
  );

  const vehicleTypes = useMemo(() => 
    Array.isArray(vehicleTypesData) ? vehicleTypesData : [],
    [vehicleTypesData]
  );

  const transactionPayments = useMemo(() => 
    Array.isArray(transactionPaymentsData) ? transactionPaymentsData : [],
    [transactionPaymentsData]
  );

  // Statistics
  const stats = useMemo(() => {
    const totalTransactions = transactionPayments.length;
    const totalRevenue = transactionPayments.reduce((sum, payment) => {
      const amount = typeof payment.total_amount === 'number' ? payment.total_amount : 0;
      return sum + amount;
    }, 0);
    const activeMethods = paymentTypes.length;
    const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalTransactions,
      totalRevenue,
      activeMethods,
      avgTransaction,
    };
  }, [transactionPayments, paymentTypes]);

  // Helper functions
  const getVehicleTypeName = (vehicleTypeId: string) => {
    const vehicleType = vehicleTypes.find(vt => vt.id === vehicleTypeId);
    return vehicleType ? vehicleType.name : 'Tidak ditemukan';
  };

  // Payment type actions
  const openCreatePaymentModal = () => {
    setSelectedPaymentType(null);
    setPaymentFormData({
      location_id: paymentFormData.location_id,
      code: '',
      name: '',
      description: '',
      logo_url: ''
    });
    setIsPaymentModalOpen(true);
  };

  const openEditPaymentModal = (paymentType: ParkingPaymentType) => {
    setSelectedPaymentType(paymentType);
    setPaymentFormData({
      location_id: paymentType.location_id,
      code: paymentType.code,
      name: paymentType.name,
      description: paymentType.description,
      logo_url: paymentType.logo_url || ''
    });
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPaymentType(null);
  };

  const handleCreatePaymentType = async () => {
    try {
      await createPaymentType(paymentFormData);
      closePaymentModal();
      getPaymentTypes();
    } catch (error) {
      console.error('Error creating payment type:', error);
    }
  };

  const handleUpdatePaymentType = async () => {
    if (!selectedPaymentType) return;
    try {
      await updatePaymentType(selectedPaymentType.id, paymentFormData);
      closePaymentModal();
      getPaymentTypes();
    } catch (error) {
      console.error('Error updating payment type:', error);
    }
  };

  const handleDeletePaymentType = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus metode pembayaran ini?')) {
      try {
        await deletePaymentType(id);
        getPaymentTypes();
      } catch (error) {
        console.error('Error deleting payment type:', error);
      }
    }
  };

  // Rate actions
  const openCreateRateModal = () => {
    setSelectedRate(null);
    setRateFormData({
      vehicle_type_id: rateFormData.vehicle_type_id,
      description: '',
      first_hour_cost: 0,
      subsequent_hour_cost: 0,
      daily_max_cost: 0,
      lost_ticket_cost: 0,
      tax_cost: 0,
      service_cost: 0
    });
    setIsRateModalOpen(true);
  };

  const openEditRateModal = (rate: ParkingRate) => {
    setSelectedRate(rate);
    setRateFormData({
      vehicle_type_id: rate.vehicle_type_id,
      description: rate.description,
      first_hour_cost: rate.first_hour_cost,
      subsequent_hour_cost: rate.subsequent_hour_cost,
      daily_max_cost: rate.daily_max_cost,
      lost_ticket_cost: rate.lost_ticket_cost,
      tax_cost: rate.tax_cost,
      service_cost: rate.service_cost
    });
    setIsRateModalOpen(true);
  };

  const closeRateModal = () => {
    setIsRateModalOpen(false);
    setSelectedRate(null);
  };

  const handleCreateRate = async () => {
    try {
      await createRate(rateFormData);
      closeRateModal();
      getRates();
    } catch (error) {
      console.error('Error creating rate:', error);
    }
  };

  const handleUpdateRate = async () => {
    if (!selectedRate) return;
    try {
      await updateRate(selectedRate.id, rateFormData);
      closeRateModal();
      getRates();
    } catch (error) {
      console.error('Error updating rate:', error);
    }
  };

  const handleDeleteRate = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tarif ini?')) {
      try {
        await deleteRate(id);
        getRates();
      } catch (error) {
        console.error('Error deleting rate:', error);
      }
    }
  };

  const updatePaymentFormField = (field: keyof PaymentFormData, value: string) => {
    setPaymentFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateRateFormField = (field: keyof RateFormData, value: string | number) => {
    setRateFormData(prev => ({ ...prev, [field]: value }));
  };

  // Initialize data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      getPaymentTypes();
      getRates();
      getVehicleTypes();
      getTransactionPayments();
    }
  }, [getPaymentTypes, getRates, getVehicleTypes, getTransactionPayments]);

  // Set default location when data loads
  useEffect(() => {
    if (paymentTypes.length > 0 && !paymentFormData.location_id) {
      const firstPayment = paymentTypes[0];
      if (firstPayment.location_id) {
        setPaymentFormData(prev => ({ ...prev, location_id: firstPayment.location_id }));
      }
    }
  }, [paymentTypes, paymentFormData.location_id]);

  useEffect(() => {
    if (vehicleTypes.length > 0 && !rateFormData.vehicle_type_id) {
      const firstVehicle = vehicleTypes[0];
      if (firstVehicle.id) {
        setRateFormData(prev => ({ ...prev, vehicle_type_id: firstVehicle.id }));
      }
    }
  }, [vehicleTypes, rateFormData.vehicle_type_id]);

  return {
    // State
    activeTab,
    isPaymentModalOpen,
    isRateModalOpen,
    selectedPaymentType,
    selectedRate,
    paymentFormData,
    rateFormData,
    
    // Data
    paymentTypes,
    rates,
    vehicleTypes,
    stats,
    
    // Loading states
    paymentTypesLoading,
    ratesLoading,
    vehicleTypesLoading,
    paymentTypesError,
    ratesError,
    
    // Helper functions
    getVehicleTypeName,
    
    // Actions
    setActiveTab,
    openCreatePaymentModal,
    openEditPaymentModal,
    closePaymentModal,
    handleCreatePaymentType,
    handleUpdatePaymentType,
    handleDeletePaymentType,
    openCreateRateModal,
    openEditRateModal,
    closeRateModal,
    handleCreateRate,
    handleUpdateRate,
    handleDeleteRate,
    updatePaymentFormField,
    updateRateFormField,
  };
}