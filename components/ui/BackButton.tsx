import React from 'react';
import { ChevronLeft } from '../icons';

interface BackButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center text-brand-rose-dark hover:text-brand-rose transition-colors ${className}`}
    >
      <ChevronLeft className="w-5 h-5 mr-2" />
      <span className="text-xl font-semibold text-brand-text">{children}</span>
    </button>
  );
};