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

    constructor() {
        this.baseUrl = '/api/proxy'; // Use proxy routes
        console.log('🌐 API Service initialized with proxy routes:', this.baseUrl); // Debug log
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        // Try to get token from localStorage first
        let freshToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

        // If no token in localStorage, try to get from cookie
        if (!freshToken && typeof window !== 'undefined') {
            const cookies = document.cookie.split(';');
            const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
            if (authCookie) {
                freshToken = authCookie.split('=')[1];
                console.log('🔐 Found token in cookie:', freshToken.substring(0, 20) + '...');
            }
        }

        if (freshToken) {
            headers['Authorization'] = `Bearer ${freshToken}`;
            console.log('🔐 Adding Authorization header with token:', freshToken.substring(0, 20) + '...');
        } else {
            console.log('⚠️ No token found in localStorage or cookie, request will be unauthenticated');
            console.log('🔍 localStorage contents:', {
                'auth-token': localStorage.getItem('auth-token'),
                'isAuthenticated': localStorage.getItem('isAuthenticated'),
                'user': localStorage.getItem('user')
            });
            console.log('🔍 Cookie contents:', document.cookie);
        }

        return headers;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        // Get fresh headers for each request
        const requestHeaders = this.getHeaders();

        const config: RequestInit = {
            ...options,
            headers: {
                ...requestHeaders,
                ...options.headers,
            },
        };

        console.log('🌐 Making request to:', url);
        console.log('🔐 Request headers:', requestHeaders);

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
        // Always get fresh token from localStorage
        return typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
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

    async createLocation(data: any): Promise<ApiResponse<Location>> {
        return this.post<ApiResponse<Location>>('/cms/location', data);
    }

    async updateLocation(id: string, data: any): Promise<ApiResponse<Location>> {
        return this.put<ApiResponse<Location>>(`/cms/location/${id}`, data);
    }

    async deleteLocation(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/location/${id}`);
    }

    // Merchants
    async getMerchants(params?: QueryParams): Promise<ApiResponse<Merchant[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<Merchant[]>>(`/cms/merchant${queryString}`);
    }

    async createMerchant(data: any): Promise<ApiResponse<Merchant>> {
        return this.post<ApiResponse<Merchant>>('/cms/merchant', data);
    }

    async updateMerchant(id: string, data: any): Promise<ApiResponse<Merchant>> {
        return this.put<ApiResponse<Merchant>>(`/cms/merchant/${id}`, data);
    }

    async deleteMerchant(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/merchant/${id}`);
    }

    // Parking Terminals
    async getParkingTerminals(params?: QueryParams): Promise<ApiResponse<ParkingTerminal[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTerminal[]>>(`/cms/parking-terminal${queryString}`);
    }

    async createParkingTerminal(data: any): Promise<ApiResponse<ParkingTerminal>> {
        return this.post<ApiResponse<ParkingTerminal>>('/cms/parking-terminal', data);
    }

    async updateParkingTerminal(id: string, data: any): Promise<ApiResponse<ParkingTerminal>> {
        return this.put<ApiResponse<ParkingTerminal>>(`/cms/parking-terminal/${id}`, data);
    }

    async deleteParkingTerminal(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-terminal/${id}`);
    }

    // Parking Vehicle Types
    async getParkingVehicleTypes(params?: QueryParams): Promise<ApiResponse<ParkingVehicleType[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingVehicleType[]>>(`/cms/parking-vehicle-type${queryString}`);
    }

    async createParkingVehicleType(data: any): Promise<ApiResponse<ParkingVehicleType>> {
        return this.post<ApiResponse<ParkingVehicleType>>('/cms/parking-vehicle-type', data);
    }

    async updateParkingVehicleType(id: string, data: any): Promise<ApiResponse<ParkingVehicleType>> {
        return this.put<ApiResponse<ParkingVehicleType>>(`/cms/parking-vehicle-type/${id}`, data);
    }

    async deleteParkingVehicleType(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-vehicle-type/${id}`);
    }

    // Parking Payment Types
    async getParkingPaymentTypes(params?: QueryParams): Promise<ApiResponse<ParkingPaymentType[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingPaymentType[]>>(`/cms/parking-payment-type${queryString}`);
    }

    async createParkingPaymentType(data: any): Promise<ApiResponse<ParkingPaymentType>> {
        return this.post<ApiResponse<ParkingPaymentType>>('/cms/parking-payment-type', data);
    }

    async updateParkingPaymentType(id: string, data: any): Promise<ApiResponse<ParkingPaymentType>> {
        return this.put<ApiResponse<ParkingPaymentType>>(`/cms/parking-payment-type/${id}`, data);
    }

    async deleteParkingPaymentType(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-payment-type/${id}`);
    }

    // Parking Rates
    async getParkingRates(params?: QueryParams): Promise<ApiResponse<ParkingRate[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingRate[]>>(`/cms/parking-rate${queryString}`);
    }

    async createParkingRate(data: any): Promise<ApiResponse<ParkingRate>> {
        return this.post<ApiResponse<ParkingRate>>('/cms/parking-rate', data);
    }

    async updateParkingRate(id: string, data: any): Promise<ApiResponse<ParkingRate>> {
        return this.put<ApiResponse<ParkingRate>>(`/cms/parking-rate/${id}`, data);
    }

    async deleteParkingRate(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-rate/${id}`);
    }

    // Parking Transactions
    async getParkingTransactions(params?: QueryParams): Promise<ApiResponse<ParkingTransaction[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTransaction[]>>(`/cms/parking-transaction${queryString}`);
    }

    async createParkingTransaction(data: any): Promise<ApiResponse<ParkingTransaction>> {
        return this.post<ApiResponse<ParkingTransaction>>('/cms/parking-transaction', data);
    }

    async updateParkingTransaction(id: string, data: any): Promise<ApiResponse<ParkingTransaction>> {
        return this.put<ApiResponse<ParkingTransaction>>(`/cms/parking-transaction/${id}`, data);
    }

    async deleteParkingTransaction(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-transaction/${id}`);
    }

    // Parking Transaction Payments
    async getParkingTransactionPayments(params?: QueryParams): Promise<ApiResponse<ParkingTransactionPayment[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTransactionPayment[]>>(`/cms/parking-transaction-payment${queryString}`);
    }

    async createParkingTransactionPayment(data: any): Promise<ApiResponse<ParkingTransactionPayment>> {
        return this.post<ApiResponse<ParkingTransactionPayment>>('/cms/parking-transaction-payment', data);
    }

    async updateParkingTransactionPayment(id: string, data: any): Promise<ApiResponse<ParkingTransactionPayment>> {
        return this.put<ApiResponse<ParkingTransactionPayment>>(`/cms/parking-transaction-payment/${id}`, data);
    }

    async deleteParkingTransactionPayment(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-transaction-payment/${id}`);
    }

    // Parking Transaction Terminals
    async getParkingTransactionTerminals(params?: QueryParams): Promise<ApiResponse<ParkingTransactionTerminal[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingTransactionTerminal[]>>(`/cms/parking-transaction-terminal${queryString}`);
    }

    async createParkingTransactionTerminal(data: any): Promise<ApiResponse<ParkingTransactionTerminal>> {
        return this.post<ApiResponse<ParkingTransactionTerminal>>('/cms/parking-transaction-terminal', data);
    }

    async updateParkingTransactionTerminal(id: string, data: any): Promise<ApiResponse<ParkingTransactionTerminal>> {
        return this.put<ApiResponse<ParkingTransactionTerminal>>(`/cms/parking-transaction-terminal/${id}`, data);
    }

    async deleteParkingTransactionTerminal(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-transaction-terminal/${id}`);
    }

    // Parking Membership Products
    async getMembershipProducts(params?: QueryParams): Promise<ApiResponse<ParkingMembershipProduct[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembershipProduct[]>>(`/cms/parking-membership-product${queryString}`);
    }

    async createMembershipProduct(data: any): Promise<ApiResponse<ParkingMembershipProduct>> {
        return this.post<ApiResponse<ParkingMembershipProduct>>('/cms/parking-membership-product', data);
    }

    async updateMembershipProduct(id: string, data: any): Promise<ApiResponse<ParkingMembershipProduct>> {
        return this.put<ApiResponse<ParkingMembershipProduct>>(`/cms/parking-membership-product/${id}`, data);
    }

    async deleteMembershipProduct(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-membership-product/${id}`);
    }

    // Parking Memberships
    async getMemberships(params?: QueryParams): Promise<ApiResponse<ParkingMembership[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembership[]>>(`/cms/parking-membership${queryString}`);
    }

    async createMembership(data: any): Promise<ApiResponse<ParkingMembership>> {
        return this.post<ApiResponse<ParkingMembership>>('/cms/parking-membership', data);
    }

    async updateMembership(id: string, data: any): Promise<ApiResponse<ParkingMembership>> {
        return this.put<ApiResponse<ParkingMembership>>(`/cms/parking-membership/${id}`, data);
    }

    async deleteMembership(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-membership/${id}`);
    }

    async createMembershipBulk(data: any[]): Promise<ApiResponse<ParkingMembership[]>> {
        return this.post<ApiResponse<ParkingMembership[]>>('/cms/parking-membership/bulk', { data });
    }

    async importMemberships(data: any[]): Promise<ApiResponse<any>> {
        return this.post<ApiResponse<any>>('/api/memberships/import', { data });
    }

    // Parking Membership Vehicles
    async getMembershipVehicles(params?: QueryParams): Promise<ApiResponse<ParkingMembershipVehicle[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembershipVehicle[]>>(`/cms/parking-membership-vehicle${queryString}`);
    }

    async createMembershipVehicle(data: any): Promise<ApiResponse<ParkingMembershipVehicle>> {
        return this.post<ApiResponse<ParkingMembershipVehicle>>('/cms/parking-membership-vehicle', data);
    }

    async updateMembershipVehicle(id: string, data: any): Promise<ApiResponse<ParkingMembershipVehicle>> {
        return this.put<ApiResponse<ParkingMembershipVehicle>>(`/cms/parking-membership-vehicle/${id}`, data);
    }

    async deleteMembershipVehicle(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-membership-vehicle/${id}`);
    }

    // Parking Membership Transactions
    async getMembershipTransactions(params?: QueryParams): Promise<ApiResponse<ParkingMembershipTransaction[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<ParkingMembershipTransaction[]>>(`/cms/parking-membership-transaction${queryString}`);
    }

    async createMembershipTransaction(data: any): Promise<ApiResponse<ParkingMembershipTransaction>> {
        return this.post<ApiResponse<ParkingMembershipTransaction>>('/cms/parking-membership-transaction', data);
    }

    async updateMembershipTransaction(id: string, data: any): Promise<ApiResponse<ParkingMembershipTransaction>> {
        return this.put<ApiResponse<ParkingMembershipTransaction>>(`/cms/parking-membership-transaction/${id}`, data);
    }

    async deleteMembershipTransaction(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/parking-membership-transaction/${id}`);
    }

    // Users
    async getUsers(params?: QueryParams): Promise<ApiResponse<any[]>> {
        const queryString = params ? this.buildQueryString(params) : '';
        return this.get<ApiResponse<any[]>>(`/cms/user${queryString}`);
    }

    async createUser(data: any): Promise<ApiResponse<any>> {
        return this.post<ApiResponse<any>>('/cms/user', data);
    }

    async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
        return this.put<ApiResponse<any>>(`/cms/user/${id}`, data);
    }

    async deleteUser(id: string): Promise<ApiResponse<any>> {
        return this.delete<ApiResponse<any>>(`/cms/user/${id}`);
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


}

export const apiService = new ApiService();