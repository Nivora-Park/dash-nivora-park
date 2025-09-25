"use client";

import React, { useState, useEffect } from 'react';

interface UserFormData {
  username: string;
  email: string;
  full_name: string; // Changed from 'name' to 'full_name' to match API
  password: string;
  role: 'admin' | 'operator' | 'viewer';
  location_id?: string;
  terminal: string;
  permissions: string[];
  status?: 'active' | 'inactive' | 'suspended';
}

interface UserFormProps {
  user?: Partial<UserFormData>;
  isEditing?: boolean;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'operator', label: 'Operator' },
  { value: 'viewer', label: 'Viewer' }
];

const permissionOptions = [
  { value: 'all', label: 'All Permissions' },
  { value: 'terminal_a1', label: 'Terminal A1' },
  { value: 'terminal_a2', label: 'Terminal A2' },
  { value: 'terminal_b1', label: 'Terminal B1' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'reports', label: 'Reports' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'settings', label: 'Settings' }
];

export function UserForm({ user, isEditing = false, onSubmit, onCancel, isLoading = false }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role: 'operator',
    location_id: '',
    terminal: '',
    permissions: [],
    status: 'active'
  });

  // Errors map: field name -> error message
  type UserFormErrors = Partial<Record<keyof UserFormData, string>>;
  const [errors, setErrors] = useState<UserFormErrors>({});

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        ...user,
        password: user.password || '' // Don't show existing password
      }));
    }
  }, [user]);

  const validateForm = (): boolean => {
  const newErrors: UserFormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full Name is required';
    }

    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Remove password if it's empty (for editing)
      const submitData = {
        ...formData,
        password: formData.password || undefined
      };

      await onSubmit(submitData as UserFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (permission === 'all') {
      setFormData(prev => ({
        ...prev,
        permissions: checked ? permissionOptions.map(p => p.value) : []
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: checked 
          ? [...prev.permissions, permission]
          : prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({
      ...prev,
      role: role as 'admin' | 'operator' | 'viewer',
      // Reset location_id and terminal for admin role
      location_id: role === 'admin' ? '' : prev.location_id,
      terminal: role === 'admin' ? 'All' : prev.terminal
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username *
          </label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.username ? 'border-red-300' : ''
            }`}
            disabled={isEditing} // Username cannot be changed after creation
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.full_name ? 'border-red-300' : ''
            }`}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password {!isEditing && '*'}
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-300' : ''
            }`}
            placeholder={isEditing ? 'Leave blank to keep current password' : ''}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.role ? 'border-red-300' : ''
            }`}
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
          )}
        </div>

        {/* Terminal */}
        <div>
          <label htmlFor="terminal" className="block text-sm font-medium text-gray-700 mb-1">
            Terminal
          </label>
          <input
            type="text"
            id="terminal"
            value={formData.terminal}
            onChange={(e) => setFormData(prev => ({ ...prev, terminal: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., A1, B1, or 'All' for admin"
          />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Permissions
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {permissionOptions.map(permission => (
            <label key={permission.value} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission.value)}
                onChange={(e) => handlePermissionChange(permission.value, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{permission.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
        </button>
      </div>
    </form>
  );
}
