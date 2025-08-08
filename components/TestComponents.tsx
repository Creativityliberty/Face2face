import React from 'react';
import { Button } from './ui/Button';
import { useAppStore } from '../src/stores/appStore';

export const TestComponents: React.FC = () => {
  const { isBuilderMode, toggleBuilderMode } = useAppStore();
  
  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-brand-text mb-2 font-primary">
          🚀 Video Funnel Builder - Test Components
        </h1>
        <p className="text-gray-600 mb-8">
          Test de l'intégration Tailwind CSS + Zustand + Nouveaux Composants
        </p>
        
        {/* Test des Boutons */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-brand-text">Composants Button</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>Loading...</Button>
              <Button variant="secondary" disabled>Disabled</Button>
            </div>
          </div>
        </div>

        {/* Test du State Management */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-brand-text">State Management (Zustand)</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-lg">
                <strong>Builder Mode:</strong> 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isBuilderMode 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isBuilderMode ? 'ON' : 'OFF'}
                </span>
              </p>
            </div>
            
            <Button onClick={toggleBuilderMode} variant="outline">
              Toggle Builder Mode
            </Button>
          </div>
        </div>

        {/* Test des Classes Tailwind */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-brand-text">Classes Tailwind CSS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-beige rounded-lg">
              <h3 className="font-semibold text-brand-text">Brand Beige</h3>
              <p className="text-sm text-gray-600">#D9CFC4</p>
            </div>
            
            <div className="p-4 bg-brand-rose rounded-lg text-white">
              <h3 className="font-semibold">Brand Rose</h3>
              <p className="text-sm opacity-90">#A97C7C</p>
            </div>
            
            <div className="p-4 bg-brand-maroon rounded-lg text-white">
              <h3 className="font-semibold">Brand Maroon</h3>
              <p className="text-sm opacity-90">#A11D1F</p>
            </div>
          </div>
        </div>

        {/* Test des Animations */}
        <div className="card mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-brand-text">Animations</h2>
          <div className="space-y-4">
            <div className="animate-slide-in p-4 bg-blue-100 rounded-lg">
              <p>✨ Animation slide-in appliquée</p>
            </div>
            
            <div className="animate-fade-in p-4 bg-green-100 rounded-lg">
              <p>🌟 Animation fade-in appliquée</p>
            </div>
          </div>
        </div>

        {/* Test des Fonts */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4 text-brand-text">Typography</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-primary text-xl font-semibold mb-2">Font Primary (Inter)</h3>
              <p className="font-primary text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
            
            <div>
              <h3 className="font-secondary text-xl font-semibold mb-2">Font Secondary (Poppins)</h3>
              <p className="font-secondary text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
