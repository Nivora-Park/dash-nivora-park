import { useState } from 'react';
import { useApi } from './useApi';
import { apiService } from '@/services/api';

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

export function useMembershipImport() {
    const { execute } = useApi();
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<{
        success: boolean;
        message: string;
        importedCount?: number;
        errorCount?: number;
        errors?: string[];
    } | null>(null);

    const importMemberships = async (data: MembershipImportData[]) => {
        setIsImporting(true);
        setImportResult(null);

        try {
            // Use execute from useApi hook to ensure proper token handling
            const response = await execute(() => apiService.importMemberships(data));

            setImportResult({
                success: response.success,
                message: response.message,
                importedCount: response.importedCount,
                errorCount: response.errorCount,
                errors: response.errors,
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Import failed';
            setImportResult({
                success: false,
                message: errorMessage,
            });
            throw error;
        } finally {
            setIsImporting(false);
        }
    };

    const clearImportResult = () => {
        setImportResult(null);
    };

    return {
        isImporting,
        importResult,
        importMemberships,
        clearImportResult,
    };
}
