import React from 'react';
import { Button } from './Button';
import { PencilSquareIcon } from '../icons';

interface FloatingBuilderButtonProps {
  onClick: () => void;
  show: boolean;
}

export const FloatingBuilderButton: React.FC<FloatingBuilderButtonProps> = ({ onClick, show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
      <Button
        onClick={onClick}
        variant="primary"
        size="lg"
        className="rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
      >
        <PencilSquareIcon className="w-6 h-6 mr-2" />
        Edit Funnel
      </Button>
    </div>
  );
};