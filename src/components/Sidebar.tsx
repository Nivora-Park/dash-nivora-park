'use client';

import { 
  BarChart3, 
  Settings, 
  CreditCard, 
  Car, 
  Activity,
  Users,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: 'monitoring',
      label: 'Monitoring Transaksi',
      icon: BarChart3,
      description: 'Pantau transaksi parkir real-time'
    },
    {
      id: 'terminal',
      label: 'Konfigurasi Terminal',
      icon: Settings,
      description: 'Kelola terminal parkir'
    },
    {
      id: 'payment',
      label: 'Konfigurasi Payment',
      icon: CreditCard,
      description: 'Atur metode pembayaran'
    },
    {
      id: 'vehicles',
      label: 'Kendaraan',
      icon: Car,
      description: 'Data kendaraan parkir'
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: FileText,
      description: 'Laporan dan analitik'
    },
    {
      id: 'users',
      label: 'Pengguna',
      icon: Users,
      description: 'Kelola pengguna sistem'
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Nivora Park</h1>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-700">Sistem Aktif</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Semua terminal online</div>
        </div>
      </div>
    </div>
  );
} 