/**
 * Button Component - Improved with better CTAs
 * Quick Win #2: CTAs plus convaincants avec value proposition
 *
 * Variants: primary, secondary, text, success
 */

import React from 'react';
import clsx from 'clsx';

export interface ButtonImprovedProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Style variant
   */
  variant?: 'primary' | 'secondary' | 'text' | 'success';

  /**
   * Taille du bouton
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Texte secondaire (sous-titre)
   */
  subtitle?: string;

  /**
   * Icône/emoji avant le texte
   */
  icon?: string;

  /**
   * Loading state
   */
  loading?: boolean;

  /**
   * Full width
   */
  fullWidth?: boolean;

  /**
   * Children
   */
  children: React.ReactNode;
}

export const ButtonImproved: React.FC<ButtonImprovedProps> = ({
  variant = 'primary',
  size = 'md',
  subtitle,
  icon,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}) => {
  // Classes de base
  const baseClasses = clsx(
    'inline-flex flex-col items-center justify-center',
    'font-semibold rounded-xl',
    'transition-all duration-300',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'min-h-[44px]', // Touch target size (WCAG)
    {
      'w-full': fullWidth,
      'cursor-not-allowed': disabled || loading
    }
  );

  // Classes selon variant
  const variantClasses = clsx({
    // Primary CTA (rose brand)
    'bg-[#A97C7C] hover:bg-[#8B6A6A] text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus-visible:ring-[#A97C7C]':
      variant === 'primary' && !disabled,

    // Secondary (outline)
    'bg-white border-2 border-[#A97C7C] text-[#A97C7C] hover:bg-[#FAF5F5] shadow-md hover:shadow-lg focus-visible:ring-[#A97C7C]':
      variant === 'secondary' && !disabled,

    // Text link
    'text-[#A97C7C] hover:text-[#8B6A6A] underline':
      variant === 'text' && !disabled,

    // Success (green)
    'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 focus-visible:ring-green-600':
      variant === 'success' && !disabled
  });

  // Classes selon size
  const sizeClasses = clsx({
    'px-4 py-2 text-sm': size === 'sm',
    'px-6 py-3 text-base': size === 'md',
    'px-8 py-4 text-lg': size === 'lg',
    'px-10 py-5 text-xl': size === 'xl'
  });

  return (
    <button
      className={clsx(baseClasses, variantClasses, sizeClasses, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            {icon && <span className="text-xl">{icon}</span>}
            <span>{children}</span>
          </div>
          {subtitle && (
            <span className={clsx(
              'text-xs mt-1 font-normal',
              variant === 'primary' || variant === 'success' ? 'text-white/90' : 'text-neutral-600'
            )}>
              {subtitle}
            </span>
          )}
        </>
      )}
    </button>
  );
};

/**
 * CTAs Pré-configurés pour Quick Wins
 */

export const GetResultsCTA: React.FC<Omit<ButtonImprovedProps, 'children' | 'subtitle' | 'icon' | 'variant'>> = (props) => (
  <ButtonImproved
    variant="primary"
    size="lg"
    icon="🎁"
    subtitle="Personalized for You in 60 Seconds"
    {...props}
  >
    Get My FREE Healing Roadmap
  </ButtonImproved>
);

export const StartQuizCTA: React.FC<Omit<ButtonImprovedProps, 'children' | 'subtitle' | 'icon' | 'variant'>> = (props) => (
  <ButtonImproved
    variant="primary"
    size="lg"
    icon="✨"
    subtitle="Takes Less Than 2 Minutes"
    {...props}
  >
    Start Your Healing Journey
  </ButtonImproved>
);

export const ContinueCTA: React.FC<Omit<ButtonImprovedProps, 'children' | 'variant'>> = (props) => (
  <ButtonImproved
    variant="primary"
    size="md"
    {...props}
  >
    Continue →
  </ButtonImproved>
);

export const SkipCTA: React.FC<Omit<ButtonImprovedProps, 'children' | 'variant'>> = (props) => (
  <ButtonImproved
    variant="text"
    size="sm"
    {...props}
  >
    Skip for now
  </ButtonImproved>
);

/**
 * Exemples d'utilisation:
 *
 * // CTA principal lead capture
 * <GetResultsCTA fullWidth onClick={handleSubmit} />
 *
 * // Démarrer quiz
 * <StartQuizCTA fullWidth onClick={onStart} />
 *
 * // Continue standard
 * <ContinueCTA onClick={onNext} />
 *
 * // Skip optionnel
 * <SkipCTA onClick={handleSkip} />
 *
 * // Custom avec subtitle
 * <ButtonImproved
 *   variant="primary"
 *   size="lg"
 *   icon="💖"
 *   subtitle="Join 500+ Healed Women"
 *   fullWidth
 * >
 *   Book Your Free Call
 * </ButtonImproved>
 */
