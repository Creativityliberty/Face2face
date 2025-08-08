import React from 'react';
import { clsx } from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: React.ElementType;
  onIconClick?: () => void;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  icon,
  onIconClick,
  className,
  rows = 3,
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
      <textarea
        rows={rows}
        className={clsx(
          'w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:ring-2 focus:ring-brand-rose focus:border-transparent transition-all duration-200',
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