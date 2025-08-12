import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { ApiResponse, QueryParams } from '@/types/api';

export interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T = any>() {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (apiCall: () => Promise<ApiResponse<T>>) => {
        // Only execute on client side
        if (typeof window === 'undefined') {
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const response = await apiCall();

            setState({
                data: response.data,
                loading: false,
                error: null,
            });
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';

            // Log detailed error for debugging
            console.error('API Error Details:', {
                error: errorMessage,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });

            setState({
                data: null,
                loading: false,
                error: errorMessage,
            });
            throw error;
        }
    }, []);

    const reset = useCallback(() => {
        setState({
            data: null,
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}

// Health check hook
export function useHealthCheck() {
    const { data, loading, error, execute } = useApi();

    const checkHealth = useCallback(() => {
        return execute(() => apiService.healthCheck());
    }, [execute]);

    return { data, loading, error, checkHealth };
}

// Parking Transaction hooks
export function useParkingTransactions() {
    const { data, loading, error, execute } = useApi();

    const getTransactions = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getParkingTransactions(params));
    }, [execute]);

    const createTransaction = useCallback((data: any) => {
        return execute(() => apiService.createParkingTransaction(data));
    }, [execute]);

    const updateTransaction = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateParkingTransaction(id, data));
    }, [execute]);

    const deleteTransaction = useCallback((id: string) => {
        return execute(() => apiService.deleteParkingTransaction(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
    };
}

// Parking Terminal hooks
export function useParkingTerminals() {
    const { data, loading, error, execute } = useApi();

    const getTerminals = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getParkingTerminals(params));
    }, [execute]);

    const createTerminal = useCallback((data: any) => {
        return execute(() => apiService.createParkingTerminal(data));
    }, [execute]);

    const updateTerminal = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateParkingTerminal(id, data));
    }, [execute]);

    const deleteTerminal = useCallback((id: string) => {
        return execute(() => apiService.deleteParkingTerminal(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getTerminals,
        createTerminal,
        updateTerminal,
        deleteTerminal,
    };
}

// Parking Vehicle Type hooks
export function useParkingVehicleTypes() {
    const { data, loading, error, execute } = useApi();

    const getVehicleTypes = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getParkingVehicleTypes(params));
    }, [execute]);

    const createVehicleType = useCallback((data: any) => {
        return execute(() => apiService.createParkingVehicleType(data));
    }, [execute]);

    const updateVehicleType = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateParkingVehicleType(id, data));
    }, [execute]);

    const deleteVehicleType = useCallback((id: string) => {
        return execute(() => apiService.deleteParkingVehicleType(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getVehicleTypes,
        createVehicleType,
        updateVehicleType,
        deleteVehicleType,
    };
}

// Parking Payment Type hooks
export function useParkingPaymentTypes() {
    const { data, loading, error, execute } = useApi();

    const getPaymentTypes = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getParkingPaymentTypes(params));
    }, [execute]);

    const createPaymentType = useCallback((data: any) => {
        return execute(() => apiService.createParkingPaymentType(data));
    }, [execute]);

    const updatePaymentType = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateParkingPaymentType(id, data));
    }, [execute]);

    const deletePaymentType = useCallback((id: string) => {
        return execute(() => apiService.deleteParkingPaymentType(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getPaymentTypes,
        createPaymentType,
        updatePaymentType,
        deletePaymentType,
    };
}

// Parking Rate hooks
export function useParkingRates() {
    const { data, loading, error, execute } = useApi();

    const getRates = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getParkingRates(params));
    }, [execute]);

    const createRate = useCallback((data: any) => {
        return execute(() => apiService.createParkingRate(data));
    }, [execute]);

    const updateRate = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateParkingRate(id, data));
    }, [execute]);

    const deleteRate = useCallback((id: string) => {
        return execute(() => apiService.deleteParkingRate(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getRates,
        createRate,
        updateRate,
        deleteRate,
    };
}

// Location hooks
export function useLocations() {
    const { data, loading, error, execute } = useApi();

    const getLocations = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getLocations(params));
    }, [execute]);

    const createLocation = useCallback((data: any) => {
        return execute(() => apiService.createLocation(data));
    }, [execute]);

    const updateLocation = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateLocation(id, data));
    }, [execute]);

    const deleteLocation = useCallback((id: string) => {
        return execute(() => apiService.deleteLocation(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getLocations,
        createLocation,
        updateLocation,
        deleteLocation,
    };
}

// Parking Transaction Payment hooks
export function useParkingTransactionPayments() {
    const { data, loading, error, execute } = useApi();

    const getTransactionPayments = useCallback((params?: QueryParams) => {
        return execute(() => apiService.getParkingTransactionPayments(params));
    }, [execute]);

    const createTransactionPayment = useCallback((data: any) => {
        return execute(() => apiService.createParkingTransactionPayment(data));
    }, [execute]);

    const updateTransactionPayment = useCallback((id: string, data: any) => {
        return execute(() => apiService.updateParkingTransactionPayment(id, data));
    }, [execute]);

    const deleteTransactionPayment = useCallback((id: string) => {
        return execute(() => apiService.deleteParkingTransactionPayment(id));
    }, [execute]);

    return {
        data,
        loading,
        error,
        getTransactionPayments,
        createTransactionPayment,
        updateTransactionPayment,
        deleteTransactionPayment,
    };
} 