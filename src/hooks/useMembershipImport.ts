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

            if (!response) {
                // execute() may return undefined when called on the server or if it returned early
                throw new Error('No response from import API');
            }

            const payload = response.data || {};

            setImportResult({
                success: (payload as any).success ?? true,
                message: (payload as any).message ?? response.message,
                importedCount: (payload as any).importedCount,
                errorCount: (payload as any).errorCount,
                errors: (payload as any).errors,
            });

            // Return the payload (not the wrapper) so callers like the modal can inspect errorCount directly
            return payload;
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
