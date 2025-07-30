'use client';

import { useState } from 'react';
import { TransactionMonitoring } from './TransactionMonitoring';
import { TerminalConfig } from './TerminalConfig';
import { PaymentConfig } from './PaymentConfig';
import { VehicleManagement } from './VehicleManagement';
import { Reports } from './Reports';
import { UserManagement } from './UserManagement';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function ParkingDashboard() {
  const [activeTab, setActiveTab] = useState('monitoring');

  const renderContent = () => {
    switch (activeTab) {
      case 'monitoring':
        return <TransactionMonitoring />;
      case 'terminal':
        return <TerminalConfig />;
      case 'payment':
        return <PaymentConfig />;
      case 'vehicles':
        return <VehicleManagement />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <UserManagement />;
      default:
        return <TransactionMonitoring />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
} 