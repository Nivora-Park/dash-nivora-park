"use client";

import { useState, useEffect } from 'react';

export function TokenDebug() {
  const [token, setToken] = useState<string | null>(null);
  const [localStorageContents, setLocalStorageContents] = useState<any>({});

  useEffect(() => {
    const updateDebugInfo = () => {
      if (typeof window !== 'undefined') {
        const authToken = localStorage.getItem('auth-token');
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const user = localStorage.getItem('user');
        
        setToken(authToken);
        setLocalStorageContents({
          'auth-token': authToken,
          'isAuthenticated': isAuthenticated,
          'user': user ? JSON.parse(user) : null
        });
      }
    };

    updateDebugInfo();
    
    // Update every second
    const interval = setInterval(updateDebugInfo, 1000);
    
    // Also listen for storage events
    const handleStorageChange = () => updateDebugInfo();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">🔐 Token Debug</h3>
      <div className="space-y-1">
        <div>
          <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'NULL'}
        </div>
        <div>
          <strong>isAuthenticated:</strong> {localStorageContents['isAuthenticated'] || 'NULL'}
        </div>
        <div>
          <strong>User:</strong> {localStorageContents.user ? JSON.stringify(localStorageContents.user) : 'NULL'}
        </div>
        <div>
          <strong>Visible Cookie:</strong> {document.cookie ? document.cookie.substring(0, 30) + '...' : 'NULL'}
        </div>
        <div>
          <strong>Note:</strong> HTTP-only cookies not visible to JS
        </div>
        <button 
          onClick={() => {
            console.log('🔍 localStorage contents:', localStorageContents);
            console.log('🔍 Full token:', token);
            console.log('🔍 Cookie contents:', document.cookie);
          }}
          className="bg-blue-600 px-2 py-1 rounded text-xs mt-2"
        >
          Log to Console
        </button>
      </div>
    </div>
  );
}
