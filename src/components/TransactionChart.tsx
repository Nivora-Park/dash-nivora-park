"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface TransactionChartPoint {
  label: string;
  transactions: number;
  revenue: number;
}

export function TransactionChart({ data }: { data: TransactionChartPoint[] }) {
  const chartColors = {
    grid: "#e8e8e8",
    axis: "#4a5568",
    tooltip: {
      backgroundColor: "#f7f8fa",
      border: "1px solid #d1d5db",
      color: "#2d3748",
    },
  };

  return (
    <div
      className="h-64 bg-gray-50 rounded-lg p-4 font-sans"
      style={{ backgroundColor: "#f7f8fa" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey="label"
            stroke={chartColors.axis}
            fontSize={13}
            fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
            fontWeight={500}
          />
          <YAxis
            yAxisId="left"
            stroke={chartColors.axis}
            fontSize={13}
            fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
            fontWeight={500}
            label={{
              value: "Transaksi",
              angle: -90,
              position: "insideLeft",
              style: {
                textAnchor: "middle",
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                fontWeight: 600,
                fill: "#2d3748",
              },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={chartColors.axis}
            fontSize={13}
            fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
            fontWeight={500}
            label={{
              value: "Pendapatan (Rp)",
              angle: 90,
              position: "insideRight",
              style: {
                textAnchor: "middle",
                fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
                fontWeight: 600,
                fill: "#2d3748",
              },
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.tooltip.backgroundColor,
              border: chartColors.tooltip.border,
              borderRadius: "12px",
              boxShadow: "0 8px 25px -8px rgba(0, 0, 0, 0.1)",
              color: chartColors.tooltip.color,
              fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
            }}
            formatter={(value: any, name: any) => {
              if (name === "revenue") {
                const num =
                  typeof value === "number" ? value : Number(value) || 0;
                return [`Rp ${num.toLocaleString()}`, "Pendapatan"];
              }
              return [value, "Transaksi"];
            }}
          />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="#0066cc"
            strokeWidth={3}
            dot={{ fill: "#0066cc", strokeWidth: 0, r: 5 }}
            activeDot={{
              r: 7,
              fill: "#0066cc",
              strokeWidth: 2,
              stroke: "#ffffff",
            }}
            yAxisId="left"
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#00cc66"
            strokeWidth={3}
            dot={{ fill: "#00cc66", strokeWidth: 0, r: 5 }}
            activeDot={{
              r: 7,
              fill: "#00cc66",
              strokeWidth: 2,
              stroke: "#ffffff",
            }}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
