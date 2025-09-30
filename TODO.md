# Date Filter Implementation for Transaction Monitoring

## Overview
Add date-based filtering capability to the "Lihat Semua" (View All) function in the "Transaksi Terbaru" (Latest Transactions) section of the transaction monitoring page.

## Tasks
- [x] Update `useTransactionMonitoring` hook to support date range state and filtering
- [x] Create date range input components in `TransactionMonitoringFilters`
- [x] Modify data fetching logic to use date range when specified
- [x] Update `TransactionMonitoring` component to integrate date filters
- [ ] Test the date filtering functionality

## Implementation Details
1. Add `dateRange` state to the hook with start and end dates
2. Add date picker inputs to the filter UI
3. Update `refreshData` function to use date range parameters
4. Ensure backward compatibility with existing time period fi