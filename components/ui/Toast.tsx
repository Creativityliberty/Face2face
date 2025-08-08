import React from 'react';

interface ToastProps {
  message: string;
  variant?: 'error' | 'success' | 'info';
}

/**
 * Simple toast component used for inline error messages.
 * It renders a styled div based on the variant.
 */
export const Toast: React.FC<ToastProps> = ({ message, variant = 'info' }) => {
  const baseClasses = 'p-2 rounded-md text-sm font-medium';
  const variantClasses = {
    error: 'bg-red-50 border border-red-200 text-red-600',
    success: 'bg-green-50 border border-green-200 text-green-600',
    info: 'bg-blue-50 border border-blue-200 text-blue-600',
  }[variant];

  return <div className={`${baseClasses} ${variantClasses}`}>{message}</div>;
};
