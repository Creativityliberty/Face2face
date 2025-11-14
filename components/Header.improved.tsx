/**
 * Header amélioré - Responsive 320px → 2560px
 * Fix UI-004: Navigation mobile (320px minimum)
 *
 * Améliorations:
 * - Menu hamburger fonctionnel sur mobile
 * - Touch targets ≥ 44px
 * - Layout optimisé pour 320px
 * - Pas de duplication de code
 * - Accessibilité améliorée (ARIA, focus)
 */

import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { Menu, X, Edit3, BarChart3, FolderOpen, Image, Settings, Target } from 'lucide-react';
import { Button } from './ui/Button';
import { UserSettings } from './UserSettings';

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
  const { isAuthenticated } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Header principal - Toujours visible */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gradient-to-br from-blue-600 to-purple-600"></div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-800 bg-gradient-to-br from-purple-600 to-pink-600 -ml-2"></div>
              </div>
              <span className="font-bold tracking-wider text-gray-800 text-base sm:text-xl" style={{ fontFamily: 'Poppins, sans-serif' }}>
                FACEÀFACE
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Button
                    onClick={onToggleBuilder}
                    variant={isBuilderMode ? "primary" : "secondary"}
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isBuilderMode ? 'Builder' : 'Funnel'}
                  </Button>

                  {onShowFunnels && (
                    <Button onClick={onShowFunnels} variant="secondary" size="sm">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Funnels
                    </Button>
                  )}

                  {onShowMedia && (
                    <Button onClick={onShowMedia} variant="secondary" size="sm">
                      <Image className="w-4 h-4 mr-2" />
                      Médias
                    </Button>
                  )}

                  <Button onClick={onShowResults} variant="secondary" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Résultats
                  </Button>

                  <Button onClick={() => setShowSettings(true)} variant="secondary" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={onLoginClick} variant="secondary" size="sm">
                    Login
                  </Button>
                  <Button onClick={onRegisterClick} variant="primary" size="sm">
                    Sign Up
                  </Button>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-rose focus:ring-offset-2"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { onToggleBuilder(); closeMobileMenu(); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors min-h-[44px] ${
                      isBuilderMode
                        ? 'bg-brand-rose text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Edit3 className="w-5 h-5" />
                    {isBuilderMode ? 'Mode Builder' : 'Mode Funnel'}
                  </button>

                  {onShowFunnels && (
                    <button
                      onClick={() => { onShowFunnels(); closeMobileMenu(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-h-[44px]"
                    >
                      <FolderOpen className="w-5 h-5" />
                      Mes Funnels
                    </button>
                  )}

                  {onShowMedia && (
                    <button
                      onClick={() => { onShowMedia(); closeMobileMenu(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-h-[44px]"
                    >
                      <Image className="w-5 h-5" />
                      Mes Médias
                    </button>
                  )}

                  <button
                    onClick={() => { onShowResults(); closeMobileMenu(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-h-[44px]"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Résultats
                  </button>

                  <button
                    onClick={() => { setShowSettings(true); closeMobileMenu(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors min-h-[44px]"
                  >
                    <Settings className="w-5 h-5" />
                    Paramètres
                  </button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => { onLoginClick(); closeMobileMenu(); }}
                    variant="secondary"
                    className="w-full justify-center"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => { onRegisterClick(); closeMobileMenu(); }}
                    variant="primary"
                    className="w-full justify-center"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Spacer pour éviter que le contenu soit caché sous le header */}
      <div className="h-16"></div>

      {/* User Settings Modal */}
      <UserSettings
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};
