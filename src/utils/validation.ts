import { apiService } from '@/services/api';

// Generic duplicate validation interface
export interface DuplicateValidationRule {
    field: string;
    message: string;
    isUnique?: (value: any, existingData: any[]) => boolean;
}

// Validation result interface
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

// Generic duplicate validation function
export async function validateDuplicates<T>(
    data: any,
    existingData: T[],
    rules: DuplicateValidationRule[],
    excludeId?: string
): Promise<ValidationResult> {
    const errors: string[] = [];

    for (const rule of rules) {
        const value = data[rule.field];
        if (value === undefined || value === null || value === '') {
            continue; // Skip empty values
        }

        let isDuplicate = false;

        if (rule.isUnique) {
            // Use custom validation function
            isDuplicate = !rule.isUnique(value, existingData);
        } else {
            // Default exact match validation
            isDuplicate = existingData.some(item => {
                const itemValue = (item as any)[rule.field];
                // Skip the current item being edited
                if (excludeId && (item as any).id === excludeId) {
                    return false;
                }
                return itemValue === value;
            });
        }

        if (isDuplicate) {
            errors.push(rule.message);
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Specific validation rules for each entity type
export const VALIDATION_RULES = {
    // User validation rules
    user: [
        { field: 'username', message: 'Username already exists' },
        { field: 'email', message: 'Email already exists' }
    ],

    // Location validation rules
    location: [
        { field: 'code', message: 'Location code already exists' },
        { field: 'name', message: 'Location name already exists' }
    ],

    // Merchant validation rules
    merchant: [
        { field: 'code', message: 'Merchant code already exists' },
        { field: 'name', message: 'Merchant name already exists' },
        { field: 'email', message: 'Merchant email already exists' }
    ],

    // Terminal validation rules
    terminal: [
        { field: 'code', message: 'Terminal code already exists' },
        { field: 'name', message: 'Terminal name already exists' },
        { field: 'ip_terminal', message: 'Terminal IP address already exists' }
    ],

    // Vehicle type validation rules
    vehicleType: [
        { field: 'code', message: 'Vehicle type code already exists' },
        { field: 'name', message: 'Vehicle type name already exists' }
    ],

    // Payment type validation rules
    paymentType: [
        { field: 'code', message: 'Payment type code already exists' },
        { field: 'name', message: 'Payment type name already exists' }
    ],

    // Rate validation rules
    rate: [
        { field: 'code', message: 'Rate code already exists' },
        { field: 'name', message: 'Rate name already exists' }
    ],

    // Membership product validation rules
    membershipProduct: [
        { field: 'code', message: 'Product code already exists' },
        { field: 'name', message: 'Product name already exists' }
    ],

    // Membership validation rules
    membership: [
        {
            field: 'email',
            message: 'Email already exists',
            isUnique: (email: string, existingData: any[]) => {
                return !existingData.some(item => item.email === email);
            }
        },
        {
            field: 'phone',
            message: 'Phone number already exists',
            isUnique: (phone: string, existingData: any[]) => {
                return !existingData.some(item => item.phone === phone);
            }
        }
    ],

    // Membership vehicle validation rules
    membershipVehicle: [
        { field: 'plate_number', message: 'Vehicle plate number already exists' },
        { field: 'registration_number', message: 'Vehicle registration number already exists' }
    ],

    // Membership transaction validation rules
    membershipTransaction: [
        {
            field: 'transaction_code',
            message: 'Transaction code already exists',
            isUnique: (code: string, existingData: any[]) => {
                return !existingData.some(item => item.transaction_code === code);
            }
        }
    ],

    // Transaction validation rules
    transaction: [
        {
            field: 'code',
            message: 'Transaction code already exists',
            isUnique: (code: string, existingData: any[]) => {
                return !existingData.some(item => item.code === code);
            }
        }
    ]
};

// Helper function to get validation rules by entity type
export function getValidationRules(entityType: keyof typeof VALIDATION_RULES): DuplicateValidationRule[] {
    return VALIDATION_RULES[entityType] || [];
}

// Bulk import validation with duplicate checking
export async function validateBulkImport<T>(
    data: any[],
    entityType: keyof typeof VALIDATION_RULES,
    existingData: T[],
    excludeIds?: string[]
): Promise<ValidationResult> {
    const errors: string[] = [];
    const rules = getValidationRules(entityType);

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const rowNumber = i + 1;

        // Check for duplicates within the import data
        for (let j = i + 1; j < data.length; j++) {
            const compareItem = data[j];

            for (const rule of rules) {
                const value1 = item[rule.field];
                const value2 = compareItem[rule.field];

                if (value1 && value2 && value1 === value2) {
                    errors.push(`Row ${rowNumber}: Duplicate ${rule.field} "${value1}" found in row ${j + 1}`);
                }
            }
        }

        // Check for duplicates with existing data
        const validation = await validateDuplicates(item, existingData, rules);
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                errors.push(`Row ${rowNumber}: ${error}`);
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

// Enhanced validation with custom error messages
export function createCustomValidationRule(
    field: string,
    message: string,
    validator?: (value: any, existingData: any[]) => boolean
): DuplicateValidationRule {
    return {
        field,
        message,
        isUnique: validator
    };
}

// Validation for specific business logic
export const BUSINESS_VALIDATION_RULES = {
    // Location-specific validation (same merchant can't have duplicate codes)
    locationByMerchant: (merchantId: string) => [
        {
            field: 'code',
            message: 'Location code already exists for this merchant',
            isUnique: (code: string, existingData: any[]) => {
                return !existingData.some(item =>
                    item.code === code && (item as any).merchant_id === merchantId
                );
            }
        }
    ],

    // Terminal-specific validation (same location can't have duplicate codes)
    terminalByLocation: (locationId: string) => [
        {
            field: 'code',
            message: 'Terminal code already exists for this location',
            isUnique: (code: string, existingData: any[]) => {
                return !existingData.some(item =>
                    item.code === code && (item as any).location_id === locationId
                );
            }
        }
    ],

    // Vehicle type-specific validation (same location can't have duplicate codes)
    vehicleTypeByLocation: (locationId: string) => [
        {
            field: 'code',
            message: 'Vehicle type code already exists for this location',
            isUnique: (code: string, existingData: any[]) => {
                return !existingData.some(item =>
                    item.code === code && (item as any).location_id === locationId
                );
            }
        }
    ]
};
