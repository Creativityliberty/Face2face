/**
 * ProgressBar Component
 * Quick Win #1: Affiche progression visuelle dans le funnel
 *
 * Features:
 * - Barre de progression fixe en haut
 * - Indicateur numérique (Step X of Y)
 * - Animation smooth
 * - Mobile-friendly
 */

import React from 'react';

interface ProgressBarProps {
  /**
   * Étape actuelle (0-indexed)
   */
  currentStep: number;

  /**
   * Nombre total d'étapes
   */
  totalSteps: number;

  /**
   * Couleur de la barre (défaut: rose)
   */
  color?: string;

  /**
   * Afficher le texte "Step X of Y"
   */
  showText?: boolean;

  /**
   * Position fixe en haut (défaut: true)
   */
  fixed?: boolean;

  /**
   * Classe CSS additionnelle
   */
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  color = 'bg-[#A97C7C]', // Rose brand color
  showText = true,
  fixed = true,
  className = ''
}) => {
  // Calcul du pourcentage (1-indexed pour l'affichage)
  const displayStep = currentStep + 1;
  const percentage = (displayStep / totalSteps) * 100;

  // Empêcher division par zéro
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`w-full ${fixed ? 'fixed top-0 left-0 right-0 z-50' : ''} ${className}`}>
      {/* Barre de progression */}
      <div className="w-full h-1 bg-neutral-200">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${safePercentage}%` }}
          role="progressbar"
          aria-valuenow={displayStep}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${displayStep} of ${totalSteps}`}
        />
      </div>

      {/* Indicateur numérique (optionnel) */}
      {showText && (
        <div className="bg-white border-b border-neutral-200 py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-sm text-neutral-600 font-medium">
              Step {displayStep} of {totalSteps}
            </span>
            <span className="text-xs text-neutral-400">
              {Math.round(safePercentage)}% Complete
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Variant compact (sans texte, pour mobile)
 */
export const ProgressBarCompact: React.FC<Pick<ProgressBarProps, 'currentStep' | 'totalSteps' | 'color'>> = ({
  currentStep,
  totalSteps,
  color = 'bg-[#A97C7C]'
}) => {
  return (
    <ProgressBar
      currentStep={currentStep}
      totalSteps={totalSteps}
      color={color}
      showText={false}
      fixed={true}
    />
  );
};

/**
 * Variant avec dots (alternative design)
 */
export const ProgressDots: React.FC<Pick<ProgressBarProps, 'currentStep' | 'totalSteps'>> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isCompleted = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <div
            key={index}
            className={`
              h-2 rounded-full transition-all duration-300
              ${isCurrent ? 'w-8' : 'w-2'}
              ${isCompleted ? 'bg-[#A97C7C]' : 'bg-neutral-300'}
            `}
            aria-label={`Step ${index + 1}`}
          />
        );
      })}
    </div>
  );
};

/**
 * Exemple d'utilisation:
 *
 * <ProgressBar currentStep={2} totalSteps={5} />
 *
 * <ProgressBarCompact currentStep={2} totalSteps={5} />
 *
 * <ProgressDots currentStep={2} totalSteps={5} />
 */
