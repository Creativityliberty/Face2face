import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { ChevronDown, Settings, BarChart3, Edit3, User, LogOut, FolderOpen, Image, Save } from 'lucide-react';
import { Button } from './ui/Button';
import { Menu, X, Target } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onToggleBuilder: () => void;
  onShowResults: () => void;
  onShowMedia?: () => void;
  onShowFunnels?: () => void;
  isBuilderMode: boolean;
  showResultsButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  onLoginClick, 
  onRegisterClick, 
  onToggleBuilder, 
  onShowResults, 
  onShowMedia, 
  onShowFunnels, 
  isBuilderMode, 
  showResultsButton = false 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = useAppStore((state) => state.user);
  const logout = useAppStore((state) => state.logout);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated());

  const toggleHeader = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={toggleHeader}
        className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg hover:bg-white transition-all duration-300 group"
        aria-label={isCollapsed ? 'Show header' : 'Hide header'}
      >
        {isCollapsed ? <Menu className="w-5 h-5 text-gray-700" /> : <X className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Header Content */}
      <header className={`fixed top-0 left-0 right-0 p-4 bg-transparent flex justify-between items-center z-40 transition-all duration-300 ${isCollapsed ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center space-x-3 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg ml-16">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gradient-to-br from-blue-600 to-purple-600"></div>
            <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gradient-to-br from-purple-600 to-pink-600 -ml-2"></div>
          </div>
          <span className="font-bold tracking-wider text-gray-800 text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>FACEÀFACE</span>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <Button 
            onClick={onToggleBuilder} 
            variant={isBuilderMode ? "primary" : "secondary"}
            size="sm"
          >
            <div className="flex items-center gap-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {isBuilderMode ? <Edit3 className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              {isBuilderMode ? 'Builder' : 'Funnel'}
            </div>
          </Button>
          
          {showResultsButton && onShowResults && (
            <Button 
              onClick={onShowResults} 
              variant="secondary"
              size="sm"
            >
              <div className="flex items-center gap-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <BarChart3 className="w-4 h-4" />
                Results
              </div>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleBuilder}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Edit3 className="w-4 h-4" />
                <span>{isBuilderMode ? 'Quiz' : 'Builder'}</span>
              </button>
              
              {onShowFunnels && (
                <button
                  onClick={onShowFunnels}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Funnels</span>
                </button>
              )}
              
              {onShowMedia && (
                <button
                  onClick={onShowMedia}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Image className="w-4 h-4" />
                  <span>Médias</span>
                </button>
              )}
              
              <button
                onClick={onShowResults}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Résultats</span>
              </button>
              
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              <Button onClick={onLoginClick} variant="secondary" size="sm">
                <span style={{ fontFamily: 'Poppins, sans-serif' }}>Login</span>
              </Button>
              <Button onClick={onRegisterClick} variant="primary" size="sm">
                <span style={{ fontFamily: 'Poppins, sans-serif' }}>Sign Up</span>
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
