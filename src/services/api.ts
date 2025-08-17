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
    private baseURL: string;
    private useProxy: boolean;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    this.useProxy = false; // default not used for JSON calls
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

        // Allow overriding headers; by default JSON headers, but let caller skip for FormData
        const requestHeaders: Record<string, string> = {
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
            if (!this.useProxy && error instanceof TypeError && (error as any).message?.includes?.('fetch')) {
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

    // Raw fetch helper for non-JSON requests (e.g., multipart upload or blob/text)
    private async fetchRaw(
        endpoint: string,
        options: RequestInit,
        opts?: { forceDirect?: boolean; forceProxy?: boolean; noProxyRetry?: boolean; sameOrigin?: boolean }
    ): Promise<Response> {
        const useProxyNow = opts?.forceDirect ? false : (opts?.forceProxy ? true : this.useProxy);
        const url = opts?.sameOrigin
            ? endpoint
            : (useProxyNow ? `/api/proxy${endpoint}` : `${this.baseURL}${endpoint}`);
        try {
            const resp = await fetch(url, {
                ...options,
                mode: opts?.sameOrigin || useProxyNow ? 'same-origin' : 'cors',
                credentials: opts?.sameOrigin || useProxyNow ? 'same-origin' : 'omit',
                cache: 'no-cache',
            });
            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(`HTTP error! status: ${resp.status}, message: ${text}`);
            }
            return resp;
        } catch (error) {
            // Retry with proxy on network error
            if (!opts?.noProxyRetry && !useProxyNow && error instanceof TypeError && (error as any).message?.includes?.('fetch')) {
                this.useProxy = true;
                return this.fetchRaw(endpoint, options, opts);
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

    // Merchant endpoints
    async getMerchants(params?: QueryParams): Promise<ApiResponse<Merchant[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.MERCHANTS}${queryString}`);
    }

    async createMerchant(data: Omit<Merchant, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<Merchant>> {
        return this.request(API_CONFIG.ENDPOINTS.MERCHANTS, API_METHODS.POST, data);
    }

    async getMerchantById(id: string): Promise<ApiResponse<Merchant>> {
        return this.request(`${API_CONFIG.ENDPOINTS.MERCHANTS}/${id}`);
    }

    async updateMerchant(id: string, data: Partial<Merchant>): Promise<ApiResponse<Merchant>> {
        return this.request(`${API_CONFIG.ENDPOINTS.MERCHANTS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteMerchant(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.MERCHANTS}/${id}`, API_METHODS.DELETE);
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
        console.log('Mengirim permintaan ke endpoint ParkingRates dengan params:', params);
        const queryString = this.buildQueryString(params);
        const response = await this.request(`${API_CONFIG.ENDPOINTS.PARKING_RATES}${queryString}`);
        console.log('Respons dari endpoint ParkingRates:', response);
        return response as ApiResponse<ParkingRate[]>;
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

    // Membership Product endpoints
    async getMembershipProducts(params?: QueryParams): Promise<ApiResponse<ParkingMembershipProduct[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_PRODUCTS}${queryString}`);
    }

    async createMembershipProduct(data: Omit<ParkingMembershipProduct, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingMembershipProduct>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_PRODUCTS, API_METHODS.POST, data);
    }

    async updateMembershipProduct(id: string, data: Partial<ParkingMembershipProduct>): Promise<ApiResponse<ParkingMembershipProduct>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_PRODUCTS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteMembershipProduct(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_PRODUCTS}/${id}`, API_METHODS.DELETE);
    }

    // Membership endpoints
    async getMemberships(params?: QueryParams): Promise<ApiResponse<ParkingMembership[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIPS}${queryString}`);
    }

    async createMembership(data: Omit<ParkingMembership, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingMembership>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIPS, API_METHODS.POST, data);
    }

    async updateMembership(id: string, data: Partial<ParkingMembership>): Promise<ApiResponse<ParkingMembership>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIPS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteMembership(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIPS}/${id}`, API_METHODS.DELETE);
    }

    // Membership Vehicle endpoints
    async getMembershipVehicles(params?: QueryParams): Promise<ApiResponse<ParkingMembershipVehicle[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_VEHICLES}${queryString}`);
    }

    async createMembershipVehicle(data: Omit<ParkingMembershipVehicle, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingMembershipVehicle>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_VEHICLES, API_METHODS.POST, data);
    }

    async updateMembershipVehicle(id: string, data: Partial<ParkingMembershipVehicle>): Promise<ApiResponse<ParkingMembershipVehicle>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_VEHICLES}/${id}`, API_METHODS.PUT, data);
    }

    async deleteMembershipVehicle(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_VEHICLES}/${id}`, API_METHODS.DELETE);
    }

    // Membership Transaction endpoints
    async getMembershipTransactions(params?: QueryParams): Promise<ApiResponse<ParkingMembershipTransaction[]>> {
        const queryString = this.buildQueryString(params);
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_TRANSACTIONS}${queryString}`);
    }

    async createMembershipTransaction(data: Omit<ParkingMembershipTransaction, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by' | 'created_remark' | 'updated_remark'>): Promise<ApiResponse<ParkingMembershipTransaction>> {
        return this.request(API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_TRANSACTIONS, API_METHODS.POST, data);
    }

    async updateMembershipTransaction(id: string, data: Partial<ParkingMembershipTransaction>): Promise<ApiResponse<ParkingMembershipTransaction>> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_TRANSACTIONS}/${id}`, API_METHODS.PUT, data);
    }

    async deleteMembershipTransaction(id: string): Promise<ApiResponse> {
        return this.request(`${API_CONFIG.ENDPOINTS.PARKING_MEMBERSHIP_TRANSACTIONS}/${id}`, API_METHODS.DELETE);
    }

    // Upload/list/get files
    async uploadFile(file: File, allowedExt?: string): Promise<ApiResponse<any>> {
        const form = new FormData();
        form.append('file', file);

        // Derive file extension and validate against provided list (if any)
        const rawName = file.name || '';
        const ext = (rawName.includes('.') ? rawName.split('.').pop() : '')?.toLowerCase() || '';
        if (!ext) {
            throw new Error('Nama file tidak memiliki ekstensi');
        }
        if (allowedExt) {
            const allowed = allowedExt.split(',').map((s) => s.trim().toLowerCase());
            if (!allowed.includes(ext)) {
                throw new Error(`Ekstensi .${ext} tidak diizinkan. Hanya: ${allowed.join(', ')}`);
            }
        }

        // Always pass a single extension to backend to maximize compatibility
        const qs = `?allowed_ext=${encodeURIComponent(ext)}`;
        // Try direct to API backend (CORS)
        try {
            const resp = await this.fetchRaw(`${API_CONFIG.ENDPOINTS.FILE}${qs}`, {
                method: API_METHODS.POST,
                body: form,
            }, { forceDirect: true, noProxyRetry: true });
            const data = (await resp.json()) as ApiResponse<any>;
            return data;
        } catch (err: any) {
            // Fallback to same-origin Next.js route to avoid CORS/network issues
            if (err instanceof TypeError || (typeof err?.message === 'string' && err.message.includes('fetch'))) {
                const resp2 = await this.fetchRaw(`/api/file${qs}`, {
                    method: API_METHODS.POST,
                    body: form,
                }, { sameOrigin: true, noProxyRetry: true });
                const data2 = (await resp2.json()) as ApiResponse<any>;
                return data2;
            }
            throw err;
        }
    }

    async listFiles(): Promise<ApiResponse<any>> {
        return this.request(`${API_CONFIG.ENDPOINTS.FILE}`, API_METHODS.GET);
    }

    async getFile(filename: string): Promise<Blob> {
        // Use same-origin Next.js route for file content to avoid CORS impact on other endpoints
        const resp = await this.fetchRaw(`/api/file/${encodeURIComponent(filename)}`, {
            method: API_METHODS.GET,
        }, { sameOrigin: true, noProxyRetry: true });
        return await resp.blob();
    }

    // Helper: build a URL to access a stored file depending on proxy mode
    public getFileUrl(filename: string): string {
        const rel = `/api/file/${encodeURIComponent(filename)}`;
        // For form inputs with type=url, return absolute URL to satisfy browser validation
        if (typeof window !== 'undefined' && window.location?.origin) {
            return `${window.location.origin}${rel}`;
        }
        return rel;
    }
}

export const apiService = new ApiService();