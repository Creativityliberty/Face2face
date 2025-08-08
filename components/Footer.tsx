
import React from 'react';
import { PencilSquareIcon, EyeIcon } from './icons';

interface FooterProps {
  isBuilderMode: boolean;
  onToggleBuilder: () => void;
}

const FaceAFaceLogo = () => (
    <div className="flex items-center space-x-2">
        <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            <div className="w-4 h-4 rounded-full border-2 border-white -ml-2"></div>
        </div>
        <span className="font-semibold tracking-wider">FACEÀFACE</span>
    </div>
)

export const Footer: React.FC<FooterProps> = ({ isBuilderMode, onToggleBuilder }) => {
  return (
    <footer className="w-full bg-brand-maroon text-white py-3 px-8 flex items-center justify-center relative">
      <FaceAFaceLogo />
      <button 
        onClick={onToggleBuilder} 
        className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
        title={isBuilderMode ? "Preview Funnel" : "Edit Funnel"}
      >
        {isBuilderMode ? <EyeIcon className="w-5 h-5" /> : <PencilSquareIcon className="w-5 h-5" />}
        <span className="text-sm font-medium">{isBuilderMode ? 'Preview' : 'Edit Funnel'}</span>
      </button>
    </footer>
  );
};