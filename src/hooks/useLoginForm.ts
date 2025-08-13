import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface LoginFormData {
  username: string;
  password: string;
}

export interface UseLoginFormReturn {
  credentials: LoginFormData;
  isLoading: boolean;
  error: string;
  updateField: (field: keyof LoginFormData, value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  clearError: () => void;
}

export function useLoginForm(): UseLoginFormReturn {
  const [credentials, setCredentials] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const updateField = (field: keyof LoginFormData, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(credentials.username, credentials.password);
      
      if (!success) {
        setError('Username atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return {
    credentials,
    isLoading,
    error,
    updateField,
    handleSubmit,
    clearError
  };
}
