
import React from 'react';
import { PencilSquareIcon, EyeIcon } from './icons';

interface FooterProps {
  isBuilderMode: boolean;
  onToggleBuilder: () => void;
  isSharedMode?: boolean;
}

const FaceAFaceLogo = () => (
    <a 
        href="https://face2face-ufc9.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
        title="Retour à l'application FACEÀFACE"
    >
        <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border-2 border-white"></div>
            <div className="w-4 h-4 rounded-full border-2 border-white -ml-2"></div>
        </div>
        <span className="font-semibold tracking-wider">FACEÀFACE</span>
    </a>
)

export const Footer: React.FC<FooterProps> = ({ isBuilderMode, onToggleBuilder, isSharedMode = false }) => {
  return (
    <footer className="w-full bg-brand-maroon text-white py-3 px-4 sm:px-8 flex items-center justify-center relative min-h-[56px]">
      <FaceAFaceLogo />
      {/* Bouton Edit masqué en mode partage client */}
      {!isSharedMode && (
        <button 
          onClick={onToggleBuilder} 
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-2 sm:py-1.5 rounded-md transition-colors touch-manipulation min-h-[40px]"
          title={isBuilderMode ? "Preview Funnel" : "Edit Funnel"}
        >
          {isBuilderMode ? <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" /> : <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
          <span className="text-xs sm:text-sm font-medium hidden sm:inline">{isBuilderMode ? 'Preview' : 'Edit Funnel'}</span>
        </button>
      )}
    </footer>
  );
};