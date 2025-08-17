// Base response interface
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    host: string;
    latency: number;
    data: T;
}

// Common base fields
export interface BaseModel {
    id: string;
    created_at: string;
    created_by: string;
    created_remark: string;
    updated_at: string;
    updated_by: string;
    updated_remark: string;
    deleted_at?: string;
    deleted_by?: string;
    deleted_remark?: string;
    synced_at?: string;
    synced_by?: string;
    synced_remark?: string;
}

// Merchant model
export interface Merchant extends BaseModel {
    code: string;
    name: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    contract_start: string;
    contract_end: string;
    logo_url: string;
}

// Location model
export interface Location extends BaseModel {
    merchant_id: string;
    code: string;
    name: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    contract_start: string;
    contract_end: string;
    logo_url: string;
}

// Parking Transaction model
export interface ParkingTransaction extends BaseModel {
    code: string;
    description: string;
    duration_minutes: number;
    canceled_at?: string;
    canceled_by?: string;
    canceled_remark?: string;
}

// Parking Terminal model
export interface ParkingTerminal extends BaseModel {
    // Catatan: backend tidak mengembalikan location_id untuk terminal
    location_id?: string;
    code: string;
    name: string;
    description: string;
    logo_url: string;
    ip_terminal: string;
    ip_printer: string;
    printer_type: string;
    ip_camera: string;
    // Legacy fields (optional untuk backward compatibility)
    ip_address?: string;
    port?: number;
    status?: string;
    last_online?: string;
}

// Parking Vehicle Type model
export interface ParkingVehicleType extends BaseModel {
    location_id: string;
    rate_id?: string; // Relasi ke parking_rate sesuai schema-db
    code: string;
    name: string;
    description: string;
    height: number;
    weight: number;
    wheel_count: number;
    logo_url: string;
}

// Parking Rate model
export interface ParkingRate extends BaseModel {
    location_id?: string; // Tambahkan relasi ke lokasi
    name?: string; // Tambahkan field name untuk display di dropdown
    code?: string; // Tambahkan field code
    description: string;
    first_hour_cost: number;
    subsequent_hour_cost: number;
    daily_max_cost: number;
    lost_ticket_cost: number;
    tax_cost: number;
    service_cost: number;
}

// Parking Payment Type model
export interface ParkingPaymentType extends BaseModel {
    location_id: string;
    code: string;
    name: string;
    description: string;
    logo_url: string;
}

// Parking Transaction Payment model
export interface ParkingTransactionPayment extends BaseModel {
    transaction_id: string;
    terminal_id: string;
    payment_type_id: string;
    vehicle_type_id?: string; // Add missing vehicle_type_id field
    identifier: string;
    reference: string;
    provider: string;
    description: string;
    base_amount: number;
    discount_amount: number;
    tax_amount: number;
    service_amount: number;
    penalty_amount: number;
    total_amount: number;
    paid_amount: number;
    change_amount: number;
}

// Membership models
export interface ParkingMembershipProduct extends BaseModel {
    location_id: string;
    code: string;
    name: string;
    description: string;
    base_price: number;
    card_price: number;
    sticker_price: number;
    tax_price: number;
    duration_days: number;
}

export interface ParkingMembership extends BaseModel {
    membership_product_id: string;
    code: string;
    name: string;
    description: string;
    address: string;
    email: string;
    phone: string;
    start_time: string;
    end_time: string;
}

export interface ParkingMembershipVehicle extends BaseModel {
    membership_id: string;
    vehicle_type_id: string;
    description: string;
    plate_number: string;
    card_number: string;
    sticker_number: string;
    brand: string;
    model: string;
    color: string;
}

export interface ParkingMembershipTransaction extends BaseModel {
    membership_id: string;
    code: string;
    name: string;
    description: string;
    base_amount: number;
    card_amount: number;
    sticker_amount: number;
    discount_amount: number;
    service_amount: number;
    tax_amount: number;
    total_amount: number;
    paid_amount: number;
    change_amount: number;
}

// Parking Transaction Terminal model
export interface ParkingTransactionTerminal extends BaseModel {
    transaction_id: string;
    terminal_id: string;
    plate_number: string;
    image_url: string;
}

// Query parameters for filtering
export interface QueryParams {
    // Pagination
    page?: number;
    page_size?: number;

    // Date filters
    created_at_from?: string;
    created_at_to?: string;
    updated_at_from?: string;
    updated_at_to?: string;

    // Common fields
    id?: string;
    code?: string;
    description?: string;
    created_by?: string;
    updated_by?: string;

    // Location specific
    merchant_id?: string;
    name?: string;
    address?: string;
    email?: string;
    phone?: string;

    // Parking Transaction specific
    duration_minutes?: number;
    canceled_at_from?: string;
    canceled_at_to?: string;
    canceled_by?: string;

    // Parking Terminal specific
    location_id?: string;
    ip_address?: string;
    port?: number;
    status?: string;

    // Parking Vehicle Type specific
    height?: number;
    weight?: number;
    wheel_count?: number;

    // Parking Transaction Payment specific
    transaction_id?: string;
    terminal_id?: string;
    payment_type_id?: string;
    identifier?: string;
    reference?: string;
    provider?: string;
    base_amount?: number;
    total_amount?: number;
    paid_amount?: number;

    // Parking Transaction Terminal specific
    plate_number?: string;
}