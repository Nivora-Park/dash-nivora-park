import { API_CONFIG, API_METHODS, QUERY_PARAMS } from '@/config/api';
import {
    ApiResponse,
    QueryParams,
    Location,
    ParkingTransaction,
    ParkingTerminal,
    ParkingVehicleType,
    ParkingPaymentType,
    ParkingTransactionPayment,
    ParkingTransactionTerminal,
    ParkingRate
} from '@/types/api';

class ApiService {
    private baseURL: string;
    private useProxy: boolean;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.useProxy = false; // Start with direct API calls
    }

    private async request<T>(
        endpoint: string,
        method: string = API_METHODS.GET,
        body?: any,
        headers?: Record<string, string>
    ): Promise<ApiResponse<T>> {
        const url = this.useProxy
            ? `/api/proxy${endpoint}`
            : `${this.baseURL}${endpoint}`;

        const requestHeaders = {
            ...API_CONFIG.HEADERS,
            ...headers,
        };

        try {
            const response = await fetch(url, {
                method,
                headers: requestHeaders,
                body: body ? JSON.stringify(body) : undefined,
                mode: this.useProxy ? 'same-origin' : 'cors',
                credentials: this.useProxy ? 'same-origin' : 'omit',
                cache: 'no-cache',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data: ApiResponse<T> = await response.json();
            return data;
        } catch (error) {
            console.error(`API Error (${method} ${endpoint}):`, error);

            // If direct API call fails and we haven't tried proxy yet, retry with proxy
            if (!this.useProxy && error instanceof TypeError && error.message.includes('fetch')) {
                console.log('Direct API call failed, retrying with proxy...');
                this.useProxy = true;
                return this.request(endpoint, method, body, headers);
            }

            // Handle network errors specifically
            if (error instanceof TypeError && error.message.includes('fetch')) {
                console.error('Network error details:', {
                    url,
                    method,
                    headers: requestHeaders,
                    error: error.message,
                    useProxy: this.useProxy
                });
                throw new Error(`Tidak dapat terhubung ke server API. Pastikan server berjalan di ${this.baseURL}`);
            }

            throw error;
        }
    }

    private buildQueryString(params?: QueryParams): string {
        if (!params) return '';

        const queryParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value.toString());
            }
        });

        return queryParams.toString() ? `?${queryParams.toString()}` : '';
    }

    // Health check
    async healthCheck(): Promise<ApiResponse> {
        return this.request(API_CONFIG.ENDPOINTS.HEALTH);
    }

    // Location endpoints
    async getLocations(params?: QueryParams): Promise<ApiResponse<Location[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.LOCATIONS}${queryString}`);
    }

    async createLocation(data: Omit<Location, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<Location>> {
        return this.request(API_CONFIG.ENDPOINTS.LOCATIONS, API_METHODS.POST, data);
    }

    async getLocationById(id: string): Promise<ApiResponse<Location>> {
        return this.request(`${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`);
    }

    async updateLocation(id: string, data: Partial<Location>): Promise<ApiResponse<Location>> {
        return this.request(`${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteLocation(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.LOCATIONS}/${id}`, API_METHODS.DELETE);
    }

    // Parking Transaction endpoints
    async getParkingTransactions(params?: QueryParams): Promise<ApiResponse<ParkingTransaction[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTIONS}${queryString}`);
    }

    async createParkingTransaction(data: Omit<ParkingTransaction, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingTransaction>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_TRANSACTIONS, API_METHODS.POST, data);
    }

    async getParkingTransactionById(id: string): Promise<ApiResponse<ParkingTransaction>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTIONS}/${id}`);
    }

    async updateParkingTransaction(id: string, data: Partial<ParkingTransaction>): Promise<ApiResponse<ParkingTransaction>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTIONS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingTransaction(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTIONS}/${id}`, API_METHODS.DELETE);
    }

    // Parking Terminal endpoints
    async getParkingTerminals(params?: QueryParams): Promise<ApiResponse<ParkingTerminal[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TERMINALS}${queryString}`);
    }

    async createParkingTerminal(data: Omit<ParkingTerminal, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingTerminal>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_TERMINALS, API_METHODS.POST, data);
    }

    async getParkingTerminalById(id: string): Promise<ApiResponse<ParkingTerminal>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TERMINALS}/${id}`);
    }

    async updateParkingTerminal(id: string, data: Partial<ParkingTerminal>): Promise<ApiResponse<ParkingTerminal>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TERMINALS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingTerminal(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TERMINALS}/${id}`, API_METHODS.DELETE);
    }

    // Parking Vehicle Type endpoints
    async getParkingVehicleTypes(params?: QueryParams): Promise<ApiResponse<ParkingVehicleType[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_VEHICLE_TYPES}${queryString}`);
    }

    async createParkingVehicleType(data: Omit<ParkingVehicleType, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingVehicleType>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_VEHICLE_TYPES, API_METHODS.POST, data);
    }

    async getParkingVehicleTypeById(id: string): Promise<ApiResponse<ParkingVehicleType>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_VEHICLE_TYPES}/${id}`);
    }

    async updateParkingVehicleType(id: string, data: Partial<ParkingVehicleType>): Promise<ApiResponse<ParkingVehicleType>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_VEHICLE_TYPES}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingVehicleType(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_VEHICLE_TYPES}/${id}`, API_METHODS.DELETE);
    }

    // Parking Payment Type endpoints
    async getParkingPaymentTypes(params?: QueryParams): Promise<ApiResponse<ParkingPaymentType[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_PAYMENT_TYPES}${queryString}`);
    }

    async createParkingPaymentType(data: Omit<ParkingPaymentType, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingPaymentType>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_PAYMENT_TYPES, API_METHODS.POST, data);
    }

    async getParkingPaymentTypeById(id: string): Promise<ApiResponse<ParkingPaymentType>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_PAYMENT_TYPES}/${id}`);
    }

    async updateParkingPaymentType(id: string, data: Partial<ParkingPaymentType>): Promise<ApiResponse<ParkingPaymentType>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_PAYMENT_TYPES}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingPaymentType(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_PAYMENT_TYPES}/${id}`, API_METHODS.DELETE);
    }

    // Parking Transaction Payment endpoints
    async getParkingTransactionPayments(params?: QueryParams): Promise<ApiResponse<ParkingTransactionPayment[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_PAYMENTS}${queryString}`);
    }

    async createParkingTransactionPayment(data: Omit<ParkingTransactionPayment, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingTransactionPayment>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_PAYMENTS, API_METHODS.POST, data);
    }

    async getParkingTransactionPaymentById(id: string): Promise<ApiResponse<ParkingTransactionPayment>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_PAYMENTS}/${id}`);
    }

    async updateParkingTransactionPayment(id: string, data: Partial<ParkingTransactionPayment>): Promise<ApiResponse<ParkingTransactionPayment>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_PAYMENTS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingTransactionPayment(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_PAYMENTS}/${id}`, API_METHODS.DELETE);
    }

    // Parking Transaction Terminal endpoints
    async getParkingTransactionTerminals(params?: QueryParams): Promise<ApiResponse<ParkingTransactionTerminal[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_TERMINALS}${queryString}`);
    }

    async createParkingTransactionTerminal(data: Omit<ParkingTransactionTerminal, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingTransactionTerminal>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_TERMINALS, API_METHODS.POST, data);
    }

    async getParkingTransactionTerminalById(id: string): Promise<ApiResponse<ParkingTransactionTerminal>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_TERMINALS}/${id}`);
    }

    async updateParkingTransactionTerminal(id: string, data: Partial<ParkingTransactionTerminal>): Promise<ApiResponse<ParkingTransactionTerminal>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_TERMINALS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingTransactionTerminal(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_TRANSACTION_TERMINALS}/${id}`, API_METHODS.DELETE);
    }

    // Parking Rate endpoints
    async getParkingRates(params?: QueryParams): Promise<ApiResponse<ParkingRate[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_RATES}${queryString}`);
    }

    async createParkingRate(data: Omit<ParkingRate, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingRate>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_RATES, API_METHODS.POST, data);
    }

    async getParkingRateById(id: string): Promise<ApiResponse<ParkingRate>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_RATES}/${id}`);
    }

    async updateParkingRate(id: string, data: Partial<ParkingRate>): Promise<ApiResponse<ParkingRate>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_RATES}/${id}`, API_METHODS.PUT, data);
    }

    async deleteParkingRate(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_RATES}/${id}`, API_METHODS.DELETE);
    }
}

export const apiService = new ApiService(); 