export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.8.100:8080',
    SWAGGER_URL: process.env.NEXT_PUBLIC_API_SWAGGER_URL || 'http://192.168.8.100:8080/swagger/index.html#/',
    API_VERSION: 'v1',
    ENDPOINTS: {
        // Health check
        HEALTH: '/health',

        // Merchant management (CMS)
        MERCHANTS: '/api/v1/cms/merchant',

        // Location management (CMS)
        LOCATIONS: '/api/v1/cms/location',

        // Parking management (CMS)
        PARKING_TRANSACTIONS: '/api/v1/cms/parking-transaction',
        PARKING_TERMINALS: '/api/v1/cms/parking-terminal',
        PARKING_VEHICLE_TYPES: '/api/v1/cms/parking-vehicle-type',
        PARKING_PAYMENT_TYPES: '/api/v1/cms/parking-payment-type',
        PARKING_RATES: '/api/v1/cms/parking-rate',
        PARKING_TRANSACTION_PAYMENTS: '/api/v1/cms/parking-transaction-payment',
        PARKING_TRANSACTION_TERMINALS: '/api/v1/cms/parking-transaction-terminal',

    // File upload
    FILE: '/api/v1/file',

        // Membership management (CMS)
        PARKING_MEMBERSHIP_PRODUCTS: '/api/v1/cms/parking-membership-product',
        PARKING_MEMBERSHIPS: '/api/v1/cms/parking-membership',
        PARKING_MEMBERSHIP_VEHICLES: '/api/v1/cms/parking-membership-vehicle',
        PARKING_MEMBERSHIP_TRANSACTIONS: '/api/v1/cms/parking-membership-transaction',
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
};

export const API_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
};

// Common query parameters for filtering
export const QUERY_PARAMS = {
    // Pagination
    PAGE: 'page',
    PAGE_SIZE: 'page_size',

    // Date filters
    CREATED_AT_FROM: 'created_at_from',
    CREATED_AT_TO: 'created_at_to',
    UPDATED_AT_FROM: 'updated_at_from',
    UPDATED_AT_TO: 'updated_at_to',

    // Common fields
    ID: 'id',
    CODE: 'code',
    DESCRIPTION: 'description',
    CREATED_BY: 'created_by',
    UPDATED_BY: 'updated_by',
}; 