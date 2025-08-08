import React, { useState, useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { QuizContainer } from './components/QuizContainer';
import { Builder } from './components/Builder';
import { Header } from './components/Header';
import { AuthModal } from './components/auth/AuthModal';
import { type ThemeConfig, type QuizConfig } from './types';
import { DEFAULT_QUIZ_CONFIG } from './constants';
import { Footer } from './components/Footer';
import { MediaViewer } from './components/MediaViewer';
import { ResultsPanel } from './components/ResultsPanel';

const darkenColor = (hex: string, percent: number): string => {
  if (!hex || !hex.startsWith('#')) return hex;
  let f=parseInt(hex.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
  return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

const ThemeManager: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  useEffect(() => {
    const root = document.documentElement;
    const { colors, font } = theme;

    root.style.setProperty('--theme-bg', colors.background);
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-primary-hover', darkenColor(colors.primary, 0.1));
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-button-text', colors.buttonText);
    root.style.setProperty('--theme-font', font);

    const oldFontLink = document.getElementById('dynamic-google-font');
    if (oldFontLink) oldFontLink.remove();

    if (font) {
      const link = document.createElement('link');
      link.id = 'dynamic-google-font';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [theme]);

  return null;
}

const App: React.FC = () => {
  const {
    quizConfig,
    isBuilderMode,
    toggleBuilderMode,
    getCurrentStep,
    getCurrentStepIndex,
    addAnswer,
    navigateToStep,
    goBack,
    goToNext,
    canGoBack,
    answers,
    setQuizConfig,
  } = useAppStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const [showResults, setShowResults] = useState(false);
  const [isSharedMode, setIsSharedMode] = useState(false);

  // Function to decode shared funnel config from URL
  const decodeConfigFromUrl = (encodedConfig: string): QuizConfig | null => {
    try {
      const decodedConfig = decodeURIComponent(encodedConfig);
      const parsedConfig = JSON.parse(decodedConfig);
      return parsedConfig as QuizConfig;
    } catch (error) {
      console.error('Error decoding config from URL:', error);
      return null;
    }
  };

  // Load shared config from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const configParam = urlParams.get('config') || hashParams.get('config');
    
    if (configParam) {
      const sharedConfig = decodeConfigFromUrl(configParam);
      if (sharedConfig) {
        setQuizConfig(sharedConfig);
        setIsSharedMode(true); // Activer le mode partage client
        console.log('Loaded shared funnel config:', sharedConfig);
      }
    }
  }, [setQuizConfig]);

  const handleOpenLogin = () => {
    setAuthModalView('login');
    setAuthModalOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthModalView('register');
    setAuthModalOpen(true);
  };

  const currentStep = getCurrentStep();

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg font-sans">
      <ThemeManager theme={quizConfig.theme || DEFAULT_QUIZ_CONFIG.theme} />
      
      {/* Header masqué en mode partage client */}
      {!isSharedMode && (
        <Header 
          onLoginClick={handleOpenLogin}
          onRegisterClick={handleOpenRegister}
          onToggleBuilder={toggleBuilderMode}
          onShowResults={() => setShowResults(!showResults)}
          isBuilderMode={isBuilderMode}
          showResultsButton={true}
        />
      )}

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
      />

      <main className={`flex-1 flex ${isSharedMode ? 'bg-gray-50 px-4 py-8' : 'bg-gray-100'}`}>
        {/* Container pour le mode partage */}
        <div className={`flex w-full ${isSharedMode ? 'max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden' : ''}`}>
          {/* Left Panel - Quiz/Builder Content */}
          <div className={isSharedMode ? "w-1/2 bg-white" : "w-1/2 bg-white"}>
          {(isBuilderMode && !isSharedMode) ? (
            <Builder 
              config={quizConfig} 
              setConfig={setQuizConfig}
              onSave={async (config) => {
                // TODO: Connecter à l'API pour sauvegarder en base
                console.log('Sauvegarde du funnel:', config);
                // Simuler une sauvegarde
                await new Promise(resolve => setTimeout(resolve, 1000));
                localStorage.setItem('savedFunnel', JSON.stringify(config));
              }}
              onLoad={() => {
                // TODO: Connecter à l'API pour charger depuis la base
                const saved = localStorage.getItem('savedFunnel');
                if (saved) {
                  setQuizConfig(JSON.parse(saved));
                  console.log('Funnel chargé depuis le localStorage');
                }
              }}
            />  
          ) : (
            <QuizContainer 
              step={getCurrentStepIndex()}
              quizSteps={quizConfig.steps}
              config={quizConfig}
              onNext={goToNext}
              onBack={goBack}
              onAnswer={(questionId, answer) => {
                addAnswer(questionId, answer);
                // Naviguer automatiquement vers la question suivante
                goToNext();
              }}
              onStart={goToNext}
              onQuizComplete={() => {
                console.log('Quiz completed!');
                // Marquer le quiz comme terminé
              }}
              onEditFunnel={() => toggleBuilderMode()}
              onRestartQuiz={() => {
                // Redémarrer le quiz
                console.log('Restarting quiz...');
                navigateToStep(quizConfig.steps[0]?.id || '');
              }}
              totalAnswers={Object.keys(answers).length}
            />
          )}
        </div>
        
        {/* Right Panel - Preview (toujours affiché pour les médias) */}
        <div className="w-1/2 bg-black relative">
          {getCurrentStepIndex() !== null && getCurrentStep() ? (
            <MediaViewer 
              media={getCurrentStep()!.media || { type: 'image', url: '' }} 
              isWelcomeScreen={getCurrentStep()!.type === 0} 
              className="h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer">
                <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          )}
          {!isSharedMode && (
            <div className="absolute bottom-4 left-4 text-white text-sm opacity-75 bg-black/50 px-2 py-1 rounded">
              Preview Mode
            </div>
          )}
          </div>
        </div>
      </main>
      
      <Footer 
        isBuilderMode={isBuilderMode}
        onToggleBuilder={toggleBuilderMode}
        isSharedMode={isSharedMode}
      />
      
      {/* Results Panel Overlay */}
      <ResultsPanel 
        isVisible={showResults}
        onClose={() => setShowResults(false)}
      />
    </div>
  );
};

export default App;