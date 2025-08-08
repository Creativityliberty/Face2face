import React from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={onChange}
          className="w-10 h-10 p-0 border-none rounded-md cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={onChange}
          className="flex-1 bg-white border border-gray-300 rounded-lg py-2 px-3 text-gray-800 font-mono text-sm focus:ring-2 focus:ring-brand-rose focus:border-transparent"
        />
      </div>
    </div>
  );
};