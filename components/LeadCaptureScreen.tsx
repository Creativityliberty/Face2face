import React, { useState } from 'react';
import { Button, InputWithIcon, SocialIcon } from './ui';
import { UserIcon, EnvelopeIcon, PhoneIcon } from './icons';
import { type LeadCaptureStep } from '../types';

interface LeadCaptureScreenProps {
  stepData: LeadCaptureStep;
  onSaveSubmission?: (contactInfo: any) => void;
}

export const LeadCaptureScreen: React.FC<LeadCaptureScreenProps> = ({ 
  stepData, 
  onSaveSubmission 
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [subscribed, setSubscribed] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData, subscribed };
    
    if (onSaveSubmission) {
      onSaveSubmission(submissionData);
    } else {
      // In a real app, you would send this data to a server
      console.log('Lead capture submission:', submissionData);
      alert('Thank you! Your results are on their way.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-slide-in text-brand-text px-4 sm:px-0">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center break-words">{stepData.title}</h2>
      <p className="mb-6 sm:mb-8 text-sm sm:text-base opacity-90 text-center break-words">{stepData.subtitle}</p>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
        <InputWithIcon
          icon={UserIcon}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={stepData.namePlaceholder}
          required
        />

        <InputWithIcon
          icon={EnvelopeIcon}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={stepData.emailPlaceholder}
          required
        />

        <InputWithIcon
          icon={PhoneIcon}
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder={stepData.phonePlaceholder}
        />
        
        <div className="flex items-start space-x-3 pt-2">
          <input 
            id="subscribe"
            type="checkbox"
            checked={subscribed}
            onChange={(e) => setSubscribed(e.target.checked)}
            className="h-5 w-5 sm:h-5 sm:w-5 mt-0.5 rounded border-gray-300 text-brand-maroon focus:ring-brand-maroon touch-manipulation"
          />
          <label htmlFor="subscribe" className="text-sm text-brand-text/80">
            {stepData.subscriptionText}{' '}
            <a 
              href={stepData.privacyPolicyUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="underline font-semibold text-brand-maroon hover:text-brand-maroon/80 transition-colors"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-brand-button-text font-bold shadow-lg"
        >
          {stepData.buttonText}
        </Button>
      </form>
      
      {stepData.socialLinks && stepData.socialLinks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-brand-text/10 text-center">
          <p className="text-sm font-medium text-brand-text/80 mb-4">Connect with us:</p>
          <div className="flex items-center justify-center space-x-5">
            {stepData.socialLinks.map(link => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                title={link.type}
                className="text-brand-text/70 hover:text-brand-text transition-colors transform hover:scale-110"
              >
                <SocialIcon type={link.type} />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};