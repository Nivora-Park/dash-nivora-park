# Duplicate Validation Implementation

This document outlines the comprehensive duplicate validation system implemented across all CRUD modules in the Nivora Park application.

## Overview

The validation system prevents duplicate data during create and update operations across all entities. It includes:
- Pre-creation validation
- Pre-update validation (excluding current item)
- Bulk import validation
- Business logic-specific validation rules

## Validation Utility (`src/utils/validation.ts`)

### Core Functions

1. **`validateDuplicates<T>()`** - Generic duplicate validation function
2. **`validateBulkImport<T>()`** - Bulk import validation with duplicate checking
3. **`getValidationRules()`** - Get validation rules by entity type
4. **`createCustomValidationRule()`** - Create custom validation rules

### Validation Rules

#### User Validation
- Username uniqueness
- Email uniqueness

#### Location Validation
- Code uniqueness (per merchant)
- Name uniqueness (per merchant)

#### Merchant Validation
- Code uniqueness
- Name uniqueness
- Email uniqueness

#### Terminal Validation
- Code uniqueness (per location)
- Name uniqueness (per location)
- IP address uniqueness

#### Vehicle Type Validation
- Code uniqueness (per location)
- Name uniqueness (per location)

#### Payment Type Validation
- Code uniqueness
- Name uniqueness

#### Rate Validation
- Code uniqueness
- Name uniqueness

#### Membership Product Validation
- Code uniqueness
- Name uniqueness

#### Membership Validation
- Email uniqueness
- Phone number uniqueness

#### Membership Vehicle Validation
- Plate number uniqueness
- Registration number uniqueness

#### Membership Transaction Validation
- Transaction code uniqueness

#### Transaction Validation
- Code uniqueness

### Business Logic Validation

#### Location by Merchant
- Same merchant cannot have duplicate location codes

#### Terminal by Location
- Same location cannot have duplicate terminal codes

#### Vehicle Type by Location
- Same location cannot have duplicate vehicle type codes

## Implemented Modules

### 1. Users API (`src/app/api/users/route.ts`)
- ✅ Already had duplicate validation for username and email
- ✅ Uses mock data validation functions

### 2. Memberships Import API (`src/app/api/memberships/import/route.ts`)
- ✅ Added duplicate validation within import data
- ✅ Added duplicate validation against existing data
- ✅ Returns detailed error messages for duplicates

### 3. Location Management (`src/hooks/useLocationManagement.ts`)
- ✅ Added duplicate validation before create
- ✅ Added duplicate validation before update
- ✅ Uses business logic validation (per merchant)

### 4. Merchant Management (`src/hooks/useMerchantManagement.ts`)
- ✅ Added duplicate validation before create
- ✅ Added duplicate validation before update
- ✅ Uses standard validation rules

### 5. Terminal Management (`src/hooks/useTerminalConfig.ts`)
- ✅ Added duplicate validation before create/update
- ✅ Uses business logic validation (per location)

### 6. Vehicle Type Management (`src/hooks/useVehicleTypeManagement.ts`)
- ✅ Added duplicate validation before create/update
- ✅ Uses business logic validation (per location)

### 7. Membership Product Management (`src/hooks/useMembershipProductManagement.ts`)
- ✅ Added duplicate validation before create
- ✅ Added duplicate validation before update
- ✅ Uses standard validation rules

### 8. Membership Management (`src/hooks/useMembershipManagement.ts`)
- ✅ Added duplicate validation before create
- ✅ Added duplicate validation before update
- ✅ Uses standard validation rules

### 9. User Management (`src/hooks/useUserManagement.ts`)
- ✅ Added duplicate validation before create
- ✅ Added duplicate validation before update
- ✅ Uses standard validation rules

## Validation Flow

### Create Operation
1. User submits form
2. Hook validates form data
3. Hook calls `validateDuplicates()` with current data
4. If validation passes, API call is made
5. If validation fails, error is shown to user

### Update Operation
1. User submits form
2. Hook validates form data
3. Hook calls `validateDuplicates()` with current data and item ID (to exclude current item)
4. If validation passes, API call is made
5. If validation fails, error is shown to user

### Bulk Import Operation
1. User uploads file
2. API validates data format
3. API calls `validateBulkImport()` to check for duplicates within import data
4. API fetches existing data
5. API calls `validateBulkImport()` to check for duplicates against existing data
6. If validation passes, items are created
7. If validation fails, detailed error report is returned

## Error Handling

### Validation Errors
- Clear error messages indicating which field has duplicates
- Row numbers for bulk import errors
- Field-specific error messages

### User Experience
- Validation happens before API calls
- Immediate feedback on duplicate data
- No unnecessary network requests for invalid data

## Benefits

1. **Data Integrity** - Prevents duplicate records across all entities
2. **User Experience** - Immediate feedback on validation errors
3. **Performance** - Avoids unnecessary API calls for invalid data
4. **Maintainability** - Centralized validation logic
5. **Flexibility** - Easy to add new validation rules
6. **Business Logic** - Supports complex validation scenarios (per merchant, per location)

## Future Enhancements

1. **Real-time Validation** - Validate as user types
2. **Custom Validation Rules** - Allow users to define custom rules
3. **Validation History** - Track validation attempts
4. **Batch Validation** - Validate multiple entities at once
5. **Validation Templates** - Predefined validation rule sets

## Usage Examples

### Basic Validation
```typescript
const validation = await validateDuplicates(formData, existingData, getValidationRules('user'));
if (!validation.isValid) {
  setError(`Validation failed: ${validation.errors.join(', ')}`);
  return false;
}
```

### Business Logic Validation
```typescript
const validationRules = formData.merchant_id 
  ? BUSINESS_VALIDATION_RULES.locationByMerchant(formData.merchant_id)
  : getValidationRules('location');

const validation = await validateDuplicates(formData, locations, validationRules);
```

### Bulk Import Validation
```typescript
const duplicateCheck = await validateBulkImport(importData, 'membership', existingData);
if (!duplicateCheck.isValid) {
  return NextResponse.json({
    success: false,
    error: 'Duplicate data found',
    details: duplicateCheck.errors
  }, { status: 400 });
}
```

## Conclusion

The duplicate validation system provides comprehensive protection against duplicate data across all CRUD operations. It ensures data integrity while maintaining a good user experience through clear error messages and immediate feedback.
