import { API_CONFIG, API_METHODS, QUERY_PARAMS } from '@/config/api';
import {
    ApiResponse,
    QueryParams,
    Merchant,
    Location,
    ParkingTransaction,
    ParkingTerminal,
    ParkingVehicleType,
    ParkingPaymentType,
    ParkingTransactionPayment,
    ParkingTransactionTerminal,
    ParkingRate,
    ParkingMembershipProduct,
    ParkingMembership,
    ParkingMembershipVehicle,
    ParkingMembershipTransaction
} from '@/types/api';

class ApiService {
    private baseUrl: string;
    private token: string | null;

    constructor() {
        this.baseUrl = '/api/proxy'; // Use proxy routes
        this.token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        console.log('🌐 API Service initialized with proxy routes:', this.baseUrl); // Debug log
        console.log('🔐 Token loaded from localStorage:', this.token ? 'YES' : 'NO'); // Debug token
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
            console.log('🔐 Adding Authorization header with token');
        } else {
            console.log('⚠️ No token found, request will be unauthenticated');
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired or invalid, redirect to login
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('isAuthenticated');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    private async getToken(): Promise<string | null> {
        // First try to use stored token
        if (this.token) {
            return this.token;
        }

        // Fallback: try to get token from API
        try {
            const response = await fetch('/api/auth/verify');
            if (response.ok) {
                const data = await response.json();
                return data.token || null;
            }
        } catch (error) {
            console.error('Failed to get token:', error);
        }
        return null;
    }

    // Generic CRUD methods
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // Specific API methods
    // Locations
    async getLocations(params?: QueryParams): Promise<ApiResponse<Location[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<Location[]>>(`/cms/location${queryString}`);
    }

    // Merchants
    async getMerchants(params?: QueryParams): Promise<ApiResponse<Merchant[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<Merchant[]>>(`/cms/merchant${queryString}`);
    }

    // Parking Terminals
    async getParkingTerminals(params?: QueryParams): Promise<ApiResponse<ParkingTerminal[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTerminal[]>>(`/cms/parking-terminal${queryString}`);
    }

    // Parking Vehicle Types
    async getParkingVehicleTypes(params?: QueryParams): Promise<ApiResponse<ParkingVehicleType[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingVehicleType[]>>(`/cms/parking-vehicle-type${queryString}`);
    }

    // Parking Payment Types
    async getParkingPaymentTypes(params?: QueryParams): Promise<ApiResponse<ParkingPaymentType[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingPaymentType[]>>(`/cms/parking-payment-type${queryString}`);
    }

    // Parking Rates
    async getParkingRates(params?: QueryParams): Promise<ApiResponse<ParkingRate[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingRate[]>>(`/cms/parking-rate${queryString}`);
    }

    // Parking Transactions
    async getParkingTransactions(params?: QueryParams): Promise<ApiResponse<ParkingTransaction[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTransaction[]>>(`/cms/parking-transaction${queryString}`);
    }

    // Parking Transaction Payments
    async getParkingTransactionPayments(params?: QueryParams): Promise<ApiResponse<ParkingTransactionPayment[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTransactionPayment[]>>(`/cms/parking-transaction-payment${queryString}`);
    }

    // Parking Transaction Terminals
    async getParkingTransactionTerminals(params?: QueryParams): Promise<ApiResponse<ParkingTransactionTerminal[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTransactionTerminal[]>>(`/cms/parking-transaction-terminal${queryString}`);
    }

    // Parking Membership Products
    async getMembershipProducts(params?: QueryParams): Promise<ApiResponse<ParkingMembershipProduct[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembershipProduct[]>>(`/cms/parking-membership-product${queryString}`);
    }

    // Parking Memberships
    async getMemberships(params?: QueryParams): Promise<ApiResponse<ParkingMembership[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembership[]>>(`/cms/parking-membership${queryString}`);
    }

    // Parking Membership Vehicles
    async getMembershipVehicles(params?: QueryParams): Promise<ApiResponse<ParkingMembershipVehicle[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembershipVehicle[]>>(`/cms/parking-membership-vehicle${queryString}`);
    }

    // Parking Membership Transactions
    async getMembershipTransactions(params?: QueryParams): Promise<ApiResponse<ParkingMembershipTransaction[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembershipTransaction[]>>(`/cms/parking-membership-transaction${queryString}`);
    }

    // Helper method to build query string
    private buildQueryString(params: QueryParams): string {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    }

    // Update token when user logs in
    setToken(token: string) {
        this.token = token;
    }

    // Clear token when user logs out
    clearToken() {
        this.token = null;
    }
}

export const apiService = new ApiService();