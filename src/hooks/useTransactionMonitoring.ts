import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { BRANDING_CONFIG } from "@/config/branding";
import {
  useParkingTransactionPayments,
  useParkingTransactionTerminals,
  useParkingTransactions,
  useParkingPaymentTypes,
  useParkingTerminals,
} from "@/hooks/useApi";
import type {
  ParkingTransactionPayment,
  ParkingTransactionTerminal,
  ParkingTransaction,
  ParkingPaymentType,
  ParkingTerminal,
} from "@/types/api";

export interface TransactionChartPoint {
  label: string;
  transactions: number;
  revenue: number;
}

export interface MonitoringTableRow {
  id: string;
  uniqueId: string;
  plateNumber: string;
  vehicleType: "car" | "motorcycle" | string;
  entryTime: string | null;
  exitTime: string | null;
  duration: string | null;
  amount: number;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
  terminal: string;
}

interface StatsItem {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: any;
  color: string;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

export function useTransactionMonitoring() {
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today");
  const [dateRange, setDateRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: formatDate(startOfToday()),
    endDate: formatDate(endOfToday()),
  });
  const [exportFormat, setExportFormat] = useState<"excel" | "pdf">("excel");

  // API hooks
  const { data: paymentsData, loading: paymentsLoading, getTransactionPayments } = useParkingTransactionPayments();
  const { data: terminalsData, loading: terminalsLoading, getTransactionTerminals } = useParkingTransactionTerminals();
  const { data: transactionsData, loading: transactionsLoading, getTransactions } = useParkingTransactions();
  const { data: paymentTypesData, loading: paymentTypesLoading, getPaymentTypes } = useParkingPaymentTypes();
  const { data: terminalsMasterData, loading: terminalsMasterLoading, getTerminals } = useParkingTerminals();

  // Processed data
  const payments: ParkingTransactionPayment[] = useMemo(() => 
    Array.isArray(paymentsData) ? paymentsData : [],
    [paymentsData]
  );

  const terminals: ParkingTransactionTerminal[] = useMemo(() => 
    Array.isArray(terminalsData) ? terminalsData : [],
    [terminalsData]
  );

  const transactions: ParkingTransaction[] = useMemo(() => 
    Array.isArray(transactionsData) ? transactionsData : [],
    [transactionsData]
  );

  const paymentTypes: ParkingPaymentType[] = useMemo(() => 
    Array.isArray(paymentTypesData) ? paymentTypesData : [],
    [paymentTypesData]
  );

  const terminalsMaster: ParkingTerminal[] = useMemo(() => {
    return Array.isArray(terminalsMasterData) ? terminalsMasterData : [];
  }, [terminalsMasterData]);

  // Helper maps
  const transactionIdToTerminal = useMemo(() => {
    const map = new Map<string, ParkingTransactionTerminal>();
    for (const t of terminals) {
      if (t && t.transaction_id) map.set(t.transaction_id, t);
    }
    return map;
  }, [terminals]);

  const paymentTypeIdToName = useMemo(() => {
    const map = new Map<string, string>();
    for (const pt of paymentTypes) {
      map.set(pt.id, pt.name ?? pt.code ?? "Unknown");
    }
    return map;
  }, [paymentTypes]);

  const terminalIdToCode = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of terminalsMaster) {
      map.set(t.id, t.code ?? t.name ?? "Terminal");
    }
    return map;
  }, [terminalsMaster]);

  // Terminal counts
  const terminalEntryCounts = new Map<string, number>();
  const terminalExitCounts = new Map<string, number>();

  // Calculate terminal counts based on payments and terminals
  const terminalsToCount = terminals.filter(t => {
    const terminalDate = new Date(t.created_at);
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();
      return terminalDate >= start && terminalDate <= end;
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);
      return terminalDate >= start && terminalDate <= end;
    }
  });

  for (const terminal of terminalsToCount) {
    const terminalMaster = terminalsMaster.find(t => t.id === terminal.terminal_id);
    if (!terminalMaster) continue;

    // Find payment for this transaction
    const payment = payments.find(p => p.transaction_id === terminal.transaction_id);

    // If payment exists and has created_at, consider as exit (completed)
    if (payment && payment.created_at) {
      const count = terminalExitCounts.get(terminal.terminal_id) || 0;
      terminalExitCounts.set(terminal.terminal_id, count + 1);
    } else {
      // Otherwise, consider as entry (active)
      const count = terminalEntryCounts.get(terminal.terminal_id) || 0;
      terminalEntryCounts.set(terminal.terminal_id, count + 1);
    }
  }

  // Debug logs for terminal counts
  console.log("Terminal Entry Counts:", Array.from(terminalEntryCounts.entries()));
  console.log("Terminal Exit Counts:", Array.from(terminalExitCounts.entries()));

  // Statistics
  const stats = useMemo(() => {
    // Filter payments to those with exit gate filled (completed) or pending
    let filteredPayments = payments.filter(p => {
      const hasExitGate = terminals.some(t => t.transaction_id === p.transaction_id && t.created_at);
      return hasExitGate || !hasExitGate && !p.total_amount;
    });
    let filteredTransactions = transactions;
    let filteredTerminals = terminals;

    // If no date range selected, default to today only
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();

      filteredPayments = filteredPayments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });

      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate >= start && transactionDate <= end;
      });

      filteredTerminals = terminals.filter(t => {
        const terminalDate = new Date(t.created_at);
        return terminalDate >= start && terminalDate <= end;
      });
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      filteredPayments = filteredPayments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });

      filteredTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.created_at);
        return transactionDate >= start && transactionDate <= end;
      });

      filteredTerminals = terminals.filter(t => {
        const terminalDate = new Date(t.created_at);
        return terminalDate >= start && terminalDate <= end;
      });
    }

    const totalTransactions = filteredPayments.length;
    const totalRevenue = filteredPayments.reduce(
      (sum, p) => sum + (typeof p.total_amount === "number" ? p.total_amount : 0),
      0
    );
    
    const avgDurationMinutes = (() => {
      const list = filteredTransactions.map((t) =>
        typeof t.duration_minutes === "number" ? t.duration_minutes : 0
      );
      if (list.length === 0) return 0;
      const total = list.reduce((s, v) => s + v, 0);
      return Math.round(total / list.length);
    })();

    const activeVehicles = (() => {
      const set = new Set<string>();
      for (const t of filteredTerminals) {
        if (t.plate_number) set.add(t.plate_number);
      }
      return set.size;
    })();

    return {
      totalTransactions,
      totalRevenue,
      avgDurationMinutes,
      activeVehicles,
    };
  }, [payments, transactions, terminals, dateRange]);

  // Chart data
  const chartData: TransactionChartPoint[] = useMemo(() => {
    let filteredPayments = payments;

    // If no date range selected, default to today only
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    if (timeFilter === "today") {
      const points: TransactionChartPoint[] = Array.from(
        { length: 24 },
        (_, h) => ({
          label: `${String(h).padStart(2, "0")}:00`,
          transactions: 0,
          revenue: 0,
        })
      );
      for (const p of filteredPayments) {
        const d = new Date(p.created_at);
        const h = d.getHours();
        const idx = Math.max(0, Math.min(23, h));
        points[idx].transactions += 1;
        points[idx].revenue +=
          typeof p.total_amount === "number" ? p.total_amount : 0;
      }
      return points;
    }
    
    // week/month -> agregasi per hari
    const buckets = new Map<string, { transactions: number; revenue: number }>();
    for (const p of filteredPayments) {
      const key = formatDate(new Date(p.created_at));
      const prev = buckets.get(key) || { transactions: 0, revenue: 0 };
      prev.transactions += 1;
      prev.revenue += typeof p.total_amount === "number" ? p.total_amount : 0;
      buckets.set(key, prev);
    }
    const labels = Array.from(buckets.keys()).sort();
    return labels.map((label) => ({
      label,
      transactions: buckets.get(label)!.transactions,
      revenue: buckets.get(label)!.revenue,
    }));
  }, [payments, timeFilter, dateRange]);

  // Table rows
  const tableRows: MonitoringTableRow[] = useMemo(() => {
    let filteredPayments = payments;

    // If no date range selected, default to today only
    if (!dateRange.startDate || !dateRange.endDate) {
      const start = startOfToday();
      const end = endOfToday();

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    } else {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      end.setHours(23, 59, 59, 999);

      filteredPayments = payments.filter(p => {
        const paymentDate = new Date(p.created_at);
        return paymentDate >= start && paymentDate <= end;
      });
    }

    const transactionRows = new Map<string, MonitoringTableRow>();

    for (const p of filteredPayments) {
      const transactionId = p.transaction_id;
      const terminalEntry = transactionIdToTerminal.get(transactionId);
      const entryTime = terminalEntry?.created_at
        ? new Date(terminalEntry.created_at).toLocaleString("id-ID")
        : null;

      // Determine exit terminal if available
      const terminalExit = terminals.find(t => t.transaction_id === transactionId && t.created_at !== terminalEntry?.created_at);
      const exitTimeDate = terminalExit?.created_at
        ? new Date(terminalExit.created_at)
        : null;

      let duration: string | null = null;
      if (terminalEntry?.created_at && exitTimeDate) {
        const ms = exitTimeDate.getTime() - new Date(terminalEntry.created_at).getTime();
        const mins = Math.max(0, Math.round(ms / 60000));
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        duration = h > 0 ? `${h}h ${m}m` : `${m}m`;
      }

      const exitTime = exitTimeDate ? exitTimeDate.toLocaleString("id-ID") : null;

      const paymentMethod = paymentTypeIdToName.get(p.payment_type_id) || "—";
      const terminalLabel = terminalIdToCode.get(p.terminal_id) || p.terminal_id;

      // Status is completed only if exitTime exists
      const status = exitTime ? "completed" : "pending";

      const row: MonitoringTableRow = {
        id: transactionId,
        uniqueId: p.id,
        plateNumber: terminalEntry?.plate_number || "-",
        vehicleType: "car",
        entryTime,
        exitTime,
        duration,
        amount: typeof p.total_amount === "number" ? p.total_amount : 0,
        paymentMethod,
        status,
        terminal: terminalLabel,
      };

      const existing = transactionRows.get(transactionId);
      if (!existing) {
        transactionRows.set(transactionId, row);
      } else if (exitTime && !existing.exitTime) {
        // Prefer row with exit time
        transactionRows.set(transactionId, row);
      } else if ((!!exitTime === !!existing.exitTime) && row.amount > existing.amount) {
        // If both have exit or both don't, prefer higher amount
        transactionRows.set(transactionId, row);
      }
    }

    return Array.from(transactionRows.values());
  }, [payments, transactionIdToTerminal, paymentTypeIdToName, terminalIdToCode, dateRange]);

  // Loading state combining all API hooks
  const loading = paymentsLoading || terminalsLoading || transactionsLoading || paymentTypesLoading || terminalsMasterLoading;

  // Actions
  const updateTimeFilter = (filter: "today" | "week" | "month") => {
    setTimeFilter(filter);
    // Reset date range when time filter changes
    setDateRange({ startDate: null, endDate: null });
  };

  const updateDateRange = (startDate: string | null, endDate: string | null) => {
    setDateRange({ startDate, endDate });
    // Reset time filter when date range changes
    setTimeFilter("today");
  };

  const refreshData = () => {
    let from: Date | null = null;
    let to: Date | null = null;

    if (dateRange.startDate && dateRange.endDate) {
      from = new Date(dateRange.startDate);
      to = new Date(dateRange.endDate);
      to.setHours(23, 59, 59, 999);
    } else {
      to = endOfToday();
      if (timeFilter === "today") {
        from = startOfToday();
      } else if (timeFilter === "week") {
        from = addDays(startOfToday(), -6);
      } else {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        from = d;
      }
    }

    const params = {
      created_at_from: from ? formatDate(from) : undefined,
      created_at_to: to ? formatDate(to) : undefined,
      page_size: 5000,
    } as const;

    getTransactionPayments(params);
    getTransactionTerminals(params);
    getTransactions(params);
    getPaymentTypes();
    getTerminals();
  };

  const exportData = () => {
    const data = tableRows.map(row => ({
      "ID Transaksi": row.id,
      "Jenis Kendaraan": row.vehicleType,
      "Waktu Masuk": row.entryTime || "-",
      "Waktu Keluar": row.exitTime || "-",
      "Durasi": row.duration || "-",
      "Jumlah": row.amount,
      "Metode Pembayaran": row.paymentMethod,
      "Status": row.status,
      "Terminal": row.terminal,
    }));

    // Calculate totals
    const totalVehicles = tableRows.length;
    const totalRevenue = tableRows.reduce((sum, row) => sum + row.amount, 0);

    const startDate = dateRange.startDate || formatDate(startOfToday());
    const endDate = dateRange.endDate || formatDate(endOfToday());
    const filename = `transaction-monitoring-${startDate}-to-${endDate}`;

    if (exportFormat === "excel") {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();

      // Set column widths
      const colWidths = [
        { wch: 20 }, // ID Transaksi (wider for total label)
        { wch: 20 }, // Jenis Kendaraan (wider for total label)
        { wch: 10 }, // Waktu Masuk (spacer)
        { wch: 10 }, // Waktu Keluar (spacer)
        { wch: 10 }, // Durasi (spacer)
        { wch: 10 }, // Jumlah (spacer)
        { wch: 10 }, // Metode Pembayaran (spacer)
        { wch: 25 }, // Status (wider for total revenue)
        { wch: 25 }, // Terminal (wider for total revenue)
      ];
      ws['!cols'] = colWidths;

      // Add header styling
      const headerRange = XLSX.utils.decode_range(ws['!ref'] || "");
      for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          fill: { fgColor: { rgb: "D9E1F2" } },
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }

      // Add border and alignment to data cells
      for (let R = 1; R <= headerRange.e.r; ++R) {
        for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) continue;
          ws[cellAddress].s = {
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "000000" } },
              bottom: { style: "thin", color: { rgb: "000000" } },
              left: { style: "thin", color: { rgb: "000000" } },
              right: { style: "thin", color: { rgb: "000000" } },
            },
          };
        }
      }

      // Add totals row
      const totalsRowIndex = headerRange.e.r + 1;

      // Add a new row for totals with empty cells
      for (let c = headerRange.s.c; c <= headerRange.e.c; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r: totalsRowIndex, c });
        ws[cellAddress] = { t: 's', v: '' };
      }

      const totalVehiclesCell = XLSX.utils.encode_cell({ r: totalsRowIndex, c: 0 });
      const totalRevenueCell = XLSX.utils.encode_cell({ r: totalsRowIndex, c: 7 });

      // Set total vehicles label and value spanning first two columns
      ws[totalVehiclesCell] = { t: 's', v: `TOTAL KENDARAAN: ${totalVehicles}` };
      if (!ws['!merges']) ws['!merges'] = [];
      ws['!merges'].push({
        s: { r: totalsRowIndex, c: 0 },
        e: { r: totalsRowIndex, c: 1 }
      });

      // Merge columns 2 to 6 as spacer
      ws['!merges'].push({
        s: { r: totalsRowIndex, c: 2 },
        e: { r: totalsRowIndex, c: 6 }
      });

      // Set total revenue label and value spanning last two columns
      ws[totalRevenueCell] = { t: 's', v: `TOTAL PENDAPATAN: Rp ${totalRevenue.toLocaleString("id-ID")}` };
      ws['!merges'].push({
        s: { r: totalsRowIndex, c: 7 },
        e: { r: totalsRowIndex, c: 8 }
      });

      // Style all cells in totals row
      for (let c = headerRange.s.c; c <= headerRange.e.c; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r: totalsRowIndex, c });
        if (!ws[cellAddress]) continue;
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "000000" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
          fill: { fgColor: { rgb: "FFF2CC" } }, // Light yellow background for totals
        };
      }

      // Update worksheet range to include totals row
      const range = XLSX.utils.decode_range(ws['!ref'] || "");
      range.e.r = totalsRowIndex;
      ws['!ref'] = XLSX.utils.encode_range(range);

      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } else if (exportFormat === "pdf") {
      const doc = new jsPDF('l', 'mm', 'a4'); // Landscape orientation for better table fit
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      const tableWidth = pageWidth - (margin * 2);

      // Title
      doc.setFontSize(16);
      doc.text("Transaction Monitoring Report", pageWidth / 2, margin + 10, { align: "center" });

      // Date range
      doc.setFontSize(12);
      doc.text(`Date Range: ${startDate} to ${endDate}`, pageWidth / 2, margin + 20, { align: "center" });

      // Table setup
      let y = margin + 30;
      const headers = Object.keys(data[0] || {});
      const colWidths = [40, 30, 35, 35, 15, 20, 30, 15, 20]; // Increased widths for first two columns
      const rowHeight = 14;

      // Header row with background color
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      let x = margin;
      const headerFillColor = BRANDING_CONFIG.theme.primary;
      const headerTextColor = "#FFFFFF";
      // Convert hex to RGB for jsPDF setFillColor
      const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
      };
      const [r, g, b] = hexToRgb(headerFillColor);
      doc.setFillColor(r, g, b);
      headers.forEach((header, i) => {
        const width = colWidths[i] || 20;
        if (i === 0) {
          // First header cell with primary color background and white text
          doc.setFillColor(r, g, b);
          doc.rect(x, y, width, rowHeight, "F");
          doc.setTextColor(headerTextColor);
        } else {
          // Other header cells with light background and black text
          doc.setFillColor(217, 225, 242);
          doc.rect(x, y, width, rowHeight, "F");
          doc.setTextColor(0, 0, 0);
        }
        doc.text(header, x + width / 2, y + rowHeight / 2, { align: "center" });
        x += width;
      });
      y += rowHeight;

      // Data rows with borders and centered text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      data.forEach((row, rowIndex) => {
        if (y + rowHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;

          // Redraw header on new page
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          x = margin;
          doc.setFillColor(r, g, b);
          headers.forEach((header, i) => {
            const width = colWidths[i] || 20;
            if (i === 0) {
              doc.setFillColor(r, g, b);
              doc.rect(x, y, width, rowHeight, "F");
              doc.setTextColor(headerTextColor);
            } else {
              doc.setFillColor(217, 225, 242);
              doc.rect(x, y, width, rowHeight, "F");
              doc.setTextColor(0, 0, 0);
            }
            doc.text(header, x + width / 2, y + rowHeight / 2, { align: "center" });
            x += width;
          });
          y += rowHeight;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
        }

        x = margin;
        headers.forEach((header, i) => {
          const width = colWidths[i] || 20;
          let value = String(row[header as keyof typeof row] || "");
          value = value.replace(/\n/g, " ").trim();
          const lines = doc.splitTextToSize(value, width - 6);
          doc.rect(x, y, width, rowHeight);
          doc.text(lines, x + width / 2, y + rowHeight / 2, { align: "center" });
          x += width;
        });
        y += rowHeight;
      });

      // Add totals row below table
      if (y + rowHeight * 2 < pageHeight - margin) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setFillColor(255, 255, 0); // Yellow background
        doc.setTextColor(0, 0, 0);

        // Calculate widths based on colWidths array
        const colWidths = [40, 30, 35, 35, 15, 20, 30, 15, 20];
        const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
        const rightBoxWidth = 100; // wider width for total revenue box
        const leftBoxWidth = totalTableWidth - rightBoxWidth;

        // Draw left box for total vehicles with fill only
        doc.setFillColor(255, 255, 0); // Yellow fill
        doc.rect(margin, y, leftBoxWidth, rowHeight, "F"); // Fill only
        // Draw border separately
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin, y, leftBoxWidth, rowHeight, "S"); // Stroke only
        doc.setTextColor(0, 0, 0);
        doc.text(`TOTAL KENDARAAN: ${totalVehicles}`, margin + 5, y + rowHeight / 2 + 3, { align: "left" });

        // Draw right box for total revenue with fill only
        doc.setFillColor(255, 255, 0); // Yellow fill
        doc.rect(margin + leftBoxWidth, y, rightBoxWidth, rowHeight, "F"); // Fill only
        // Draw border separately
        doc.setDrawColor(0, 0, 0);
        doc.rect(margin + leftBoxWidth, y, rightBoxWidth, rowHeight, "S"); // Stroke only

        doc.setTextColor(0, 0, 0);
        doc.text(`TOTAL PENDAPATAN: Rp ${totalRevenue.toLocaleString("id-ID")}`, margin + leftBoxWidth + 5, y + rowHeight / 2 + 3, { align: "left" });
      }

      doc.save(`${filename}.pdf`);
    }
  };

  // Load data when filter changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    refreshData();
  }, [timeFilter, dateRange]);

  return {
    // State
    timeFilter,
    dateRange,
    exportFormat,

    // Data
    stats,
    chartData,
    tableRows,
    terminalsMaster,
    payments,

    // Terminal counts
    terminalEntryCounts,
    terminalExitCounts,

    // Loading state
    loading,

    // Actions
    updateTimeFilter,
    updateDateRange,
    refreshData,
    exportData,
    setExportFormat,
  };
}
