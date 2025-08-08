import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ElementType;
  onIconClick?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  onIconClick,
  className,
  ...props
}) => {
  const Icon = icon;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {label && (
          <label className="block text-sm font-medium text-gray-600">
            {label}
          </label>
        )}
        {Icon && onIconClick && (
          <button
            type="button"
            onClick={onIconClick}
            className="text-brand-rose-dark hover:text-brand-rose disabled:text-gray-400"
            title="AI Suggestion"
          >
            <Icon className="w-4 h-4" />
          </button>
        )}
      </div>
      <input
        className={clsx(
          'input-field',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};