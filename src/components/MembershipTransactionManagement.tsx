"use client";

import React from "react";
import { useMembershipTransactionManagement } from "@/hooks/useMembershipTransactionManagement";
import { MembershipTransactionHeader } from "@/components/membership-transaction/MembershipTransactionHeader";
import { MembershipTransactionStats } from "@/components/membership-transaction/MembershipTransactionStats";
import { MembershipTransactionFilters } from "@/components/membership-transaction/MembershipTransactionFilters";
import { MembershipTransactionTable } from "@/components/membership-transaction/MembershipTransactionTable";

export default function MembershipTransactionManagement() {
  const {
    // Data
    transactions,
    memberships,
    stats,
    filters,

    // Loading & Error
    loading,
    error,

    // Actions
    fetchTransactions,
    updateFilters,
    getMembershipName,
    getMembershipCode,
  } = useMembershipTransactionManagement();

  return (
    <div className="space-y-6">
      <MembershipTransactionHeader onRefresh={fetchTransactions} />

      <MembershipTransactionStats
        totalTransactions={stats.total}
        totalAmount={stats.totalAmount}
        monthlyGrowth={0}
        activeMembers={memberships.length}
      />

      <MembershipTransactionFilters
        searchTerm={filters.searchTerm}
        membershipFilter={filters.membershipId}
        dateFilter={filters.dateFrom}
        statusFilter=""
        membershipOptions={memberships.map((m) => ({
          id: m.id,
          name: m.name,
          code: m.code,
        }))}
        onUpdateFilters={updateFilters}
      />

      <MembershipTransactionTable
        transactions={transactions}
        loading={loading}
        error={error}
        getMembershipName={getMembershipName}
        getMembershipCode={getMembershipCode}
      />
    </div>
  );
}
