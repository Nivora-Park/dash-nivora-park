import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface UseUserDropdownReturn {
  isOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  user: any;
  toggleDropdown: () => void;
  closeDropdown: () => void;
  handleLogout: () => void;
}

export function useUserDropdown(): UseUserDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    closeDropdown();
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    isOpen,
    dropdownRef,
    user,
    toggleDropdown,
    closeDropdown,
    handleLogout
  };
}
