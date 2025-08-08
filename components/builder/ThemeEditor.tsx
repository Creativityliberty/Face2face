import React from 'react';
import { Select, ColorPicker } from '../ui';
import { type ThemeConfig } from '../../types';

interface ThemeEditorProps {
  theme: ThemeConfig;
  onUpdate: (theme: ThemeConfig) => void;
}

const GOOGLE_FONTS = ['Inter', 'Poppins', 'Roboto', 'Lato', 'Montserrat', 'Oswald', 'Raleway', 'Nunito'];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onUpdate }) => {
  const handleColorChange = (colorName: keyof ThemeConfig['colors'], value: string) => {
    onUpdate({ ...theme, colors: { ...theme.colors, [colorName]: value } });
  };

  const handleFontChange = (font: string) => {
    onUpdate({ ...theme, font });
  };

  return (
    <div className="space-y-4">
      <ColorPicker
        label="Background Color"
        value={theme.colors.background}
        onChange={(e) => handleColorChange('background', e.target.value)}
      />
      
      <ColorPicker
        label="Primary/Button Color"
        value={theme.colors.primary}
        onChange={(e) => handleColorChange('primary', e.target.value)}
      />
      
      <ColorPicker
        label="Accent/Footer Color"
        value={theme.colors.accent}
        onChange={(e) => handleColorChange('accent', e.target.value)}
      />
      
      <ColorPicker
        label="Text Color"
        value={theme.colors.text}
        onChange={(e) => handleColorChange('text', e.target.value)}
      />
      
      <ColorPicker
        label="Button Text Color"
        value={theme.colors.buttonText}
        onChange={(e) => handleColorChange('buttonText', e.target.value)}
      />
      
      <Select
        label="Font Family"
        value={theme.font}
        onChange={(e) => handleFontChange(e.target.value)}
      >
        {GOOGLE_FONTS.map(font => (
          <option key={font} value={font}>{font}</option>
        ))}
      </Select>
    </div>
  );
};