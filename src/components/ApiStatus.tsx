'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { useHealthCheck } from '@/hooks/useApi';

export function ApiStatus() {
  const { data, loading, error, checkHealth } = useHealthCheck();
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Check health on mount
    checkApiHealth();

    // Check health every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        <span className="text-sm">Memeriksa koneksi...</span>
      </div>
    );
  }

  if (isOnline === null) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 text-sm ${
      isOnline ? 'text-green-600' : 'text-red-600'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>API Terhubung</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>API Tidak Terhubung</span>
        </>
      )}
    </div>
  );
} 