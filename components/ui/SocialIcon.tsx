import React from 'react';
import { 
  WhatsAppIcon, 
  YouTubeIcon, 
  InstagramIcon, 
  FacebookIcon, 
  XIcon, 
  WebsiteIcon 
} from '../icons';
import { type SocialLink } from '../../types';

interface SocialIconProps {
  type: SocialLink['type'];
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ type, className = 'w-6 h-6' }) => {
  const iconProps = { className };
  
  switch(type) {
    case 'whatsapp': return <WhatsAppIcon {...iconProps} />;
    case 'youtube': return <YouTubeIcon {...iconProps} />;
    case 'instagram': return <InstagramIcon {...iconProps} />;
    case 'facebook': return <FacebookIcon {...iconProps} />;
    case 'twitter': return <XIcon {...iconProps} />;
    case 'website': return <WebsiteIcon {...iconProps} />;
    default: return null;
  }
};