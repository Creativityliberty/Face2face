import React from 'react';
import { StartQuizCTA } from './ui/ButtonImproved';

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

      {/* Quick Win #2: Improved Start CTA with value proposition */}
      <div className="flex justify-center">
        <StartQuizCTA
          onClick={onStart}
          className="max-w-md"
          fullWidth
        />
      </div>

      {/* Optional: Social proof */}
      <div className="mt-6 text-sm text-gray-600">
        <p className="flex items-center justify-center space-x-2">
          <span>⭐⭐⭐⭐⭐</span>
          <span>500+ Women Healed</span>
        </p>
      </div>
    </div>
  );
};