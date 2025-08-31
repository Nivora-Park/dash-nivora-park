import { NextRequest, NextResponse } from 'next/server';
import { validateBulkImport, getValidationRules } from '@/utils/validation';

interface MembershipImportData {
    name: string;
    email: string;
    phone: string;
    address: string;
    membership_type: string;
    vehicle_number: string;
    vehicle_type: string;
    start_date: string;
    end_date: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { data }: { data: MembershipImportData[] } = body;

        if (!data || !Array.isArray(data)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        // Validate data format and required fields
        const validatedData = data.map((item, index) => {
            if (!item.name || !item.email || !item.phone) {
                throw new Error(`Row ${index + 1}: Missing required fields (name, email, phone)`);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(item.email)) {
                throw new Error(`Row ${index + 1}: Invalid email format`);
            }

            // Validate phone format (basic validation)
            if (!item.phone.match(/^\+?[\d\s\-\(\)]+$/)) {
                throw new Error(`Row ${index + 1}: Invalid phone format`);
            }

            return {
                ...item,
                // Set default values if not provided
                membership_type: item.membership_type || 'Standard',
                vehicle_type: item.vehicle_type || 'Car',
                start_date: item.start_date || new Date().toISOString().split('T')[0],
                end_date: item.end_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
        });

        // Check for duplicates within the import data
        const duplicateCheck = await validateBulkImport(validatedData, 'membership', []);
        if (!duplicateCheck.isValid) {
            return NextResponse.json({
                success: false,
                error: 'Duplicate data found in import',
                details: duplicateCheck.errors
            }, { status: 400 });
        }

        // Call the actual API to create memberships
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            throw new Error('No authentication token found');
        }

        // Get available membership products to use valid product ID
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api-nivora.nahsbyte.my.id'}/api/v1/cms/parking-membership-product`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        let defaultProductId = '1';
        if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            if (productsData.data && productsData.data.length > 0) {
                defaultProductId = productsData.data[0].id;
            }
        }

        // Get existing memberships to check for duplicates
        const existingMembershipsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api-nivora.nahsbyte.my.id'}/api/v1/cms/parking-membership`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        let existingMemberships: any[] = [];
        if (existingMembershipsResponse.ok) {
            const existingData = await existingMembershipsResponse.json();
            if (existingData.data && Array.isArray(existingData.data)) {
                existingMemberships = existingData.data;
            }
        }

        // Check for duplicates against existing data
        const duplicateCheckWithExisting = await validateBulkImport(validatedData, 'membership', existingMemberships);
        if (!duplicateCheckWithExisting.isValid) {
            return NextResponse.json({
                success: false,
                error: 'Duplicate data found with existing records',
                details: duplicateCheckWithExisting.errors
            }, { status: 409 });
        }

        // Transform data to match API format
        const transformedData = validatedData.map((item, index) => ({
            membership_product_id: defaultProductId,
            code: `MBR${Date.now()}${index}${Math.random().toString(36).substr(2, 3).toUpperCase()}`, // Generate unique code
            name: item.name,
            description: `${item.membership_type} membership for ${item.vehicle_type}`,
            address: item.address,
            email: item.email,
            phone: item.phone,
            start_time: new Date(item.start_date).toISOString(),
            end_time: new Date(item.end_date).toISOString(),
        }));

        console.log(`Transformed data for API:`, transformedData);

        // Create memberships one by one (since bulk endpoint might not exist)
        const createdMemberships = [];
        const errors = [];

        for (let i = 0; i < transformedData.length; i++) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api-nivora.nahsbyte.my.id'}/api/v1/cms/parking-membership`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(transformedData[i]),
                });

                if (response.ok) {
                    const result = await response.json();
                    createdMemberships.push(result.data);
                    console.log(`Created membership ${i + 1}:`, result.data);
                } else {
                    const errorData = await response.json();
                    errors.push(`Row ${i + 1}: ${errorData.message || 'Failed to create membership'}`);
                    console.error(`Failed to create membership ${i + 1}:`, errorData);
                }
            } catch (error) {
                errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Network error'}`);
                console.error(`Error creating membership ${i + 1}:`, error);
            }
        }

        if (errors.length > 0) {
            return NextResponse.json({
                success: false,
                message: `Import completed with errors`,
                importedCount: createdMemberships.length,
                errorCount: errors.length,
                errors: errors,
                data: createdMemberships
            }, { status: 207 }); // 207 Multi-Status
        }

        return NextResponse.json({
            success: true,
            message: `Successfully imported ${createdMemberships.length} membership records`,
            importedCount: createdMemberships.length,
            data: createdMemberships
        });

    } catch (error) {
        console.error('Import error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Import failed',
                success: false
            },
            { status: 400 }
        );
    }
}
