"use client";

import React from 'react';
import { UserForm } from './UserForm';

interface UserModalProps {
  isOpen: boolean;
  user?: any;
  isEditing?: boolean;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

export function UserModal({ isOpen, user, isEditing = false, onSubmit, onClose, isLoading = false }: UserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {isEditing ? 'Edit User' : 'Add New User'}
          </h2>
        </div>
        <div className="p-6">
          <UserForm
            user={user}
            isEditing={isEditing}
            onSubmit={onSubmit}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
