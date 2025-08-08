import React from 'react';

interface WelcomeScreenProps {
  title: string;
  buttonText: string;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ title, buttonText, onStart }) => {
  return (
    <div className="text-center space-y-6 sm:space-y-8 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight break-words">
        {title}
      </h1>
      <button
        onClick={onStart}
        className="bg-brand-rose hover:bg-brand-rose-dark text-white font-bold py-4 px-6 sm:px-8 rounded-lg shadow-lg text-base sm:text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl touch-manipulation min-h-[48px] w-full sm:w-auto max-w-xs mx-auto"
      >
        {buttonText}
      </button>
    </div>
  );
};