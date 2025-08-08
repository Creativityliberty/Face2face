import React from 'react';

interface WelcomeScreenProps {
  title: string;
  buttonText: string;
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ title, buttonText, onStart }) => {
  return (
    <div className="text-center space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
        {title}
      </h1>
      <button
        onClick={onStart}
        className="bg-brand-rose hover:bg-brand-rose-dark text-white font-bold py-4 px-8 rounded-lg shadow-lg text-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
      >
        {buttonText}
      </button>
    </div>
  );
};