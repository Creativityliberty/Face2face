import React from 'react';
import { Button, BackButton } from './ui';

interface MessageScreenProps {
  title: string;
  buttonText: string;
  onContinue: () => void;
  onBack: () => void;
}

export const MessageScreen: React.FC<MessageScreenProps> = ({ 
  title, 
  buttonText, 
  onContinue, 
  onBack 
}) => {
  return (
    <div className="w-full max-w-md mx-auto animate-slide-in">
      <div className="mb-8">
        <BackButton onClick={onBack}>
          {title}
        </BackButton>
      </div>
      
      <Button
        onClick={onContinue}
        variant="primary"
        size="lg"
        className="w-full text-left justify-start p-4 text-lg font-medium"
      >
        {buttonText}
      </Button>
    </div>
  );
};