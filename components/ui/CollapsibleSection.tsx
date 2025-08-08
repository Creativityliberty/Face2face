import React from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string | React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false
}) => {
  return (
    <details className="bg-white border border-gray-200 rounded-lg group" open={defaultOpen}>
      <summary className="p-4 font-semibold text-gray-700 cursor-pointer list-none flex justify-between items-center hover:bg-gray-50 transition-colors" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {title}
        <ChevronDown className="w-5 h-5 transition-transform transform group-open:rotate-180" />
      </summary>
      <div className="p-4 border-t border-gray-200">
        {children}
      </div>
    </details>
  );
};