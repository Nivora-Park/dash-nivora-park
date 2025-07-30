'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '00:00', transactions: 12, revenue: 85000 },
  { time: '04:00', transactions: 8, revenue: 65000 },
  { time: '08:00', transactions: 45, revenue: 320000 },
  { time: '12:00', transactions: 78, revenue: 580000 },
  { time: '16:00', transactions: 92, revenue: 720000 },
  { time: '20:00', transactions: 65, revenue: 480000 },
  { time: '24:00', transactions: 23, revenue: 180000 },
];

export function TransactionChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            yAxisId="left"
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Transaksi', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#6b7280"
            fontSize={12}
            label={{ value: 'Pendapatan (Rp)', angle: 90, position: 'insideRight' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            formatter={(value, name) => {
              if (name === 'revenue') {
                return [`Rp ${value.toLocaleString()}`, 'Pendapatan'];
              }
              return [value, 'Transaksi'];
            }}
          />
          <Line 
            type="monotone" 
            dataKey="transactions" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            yAxisId="left"
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#10b981" 
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 