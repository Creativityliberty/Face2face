# 🛠️ Setup Guide - Étapes d'Implémentation

## 🚀 Étape 1: Installation des Dépendances

### Commandes à Exécuter
```bash
# Dans le terminal, à la racine du projet
cd "/Volumes/Numtema/funnelvideo/video-funnel-builder (4)"

# Installation Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Installation State Management & UI
npm install zustand framer-motion @headlessui/react
npm install clsx tailwind-merge

# Vérification des installations
npm list tailwindcss zustand framer-motion
```

### Vérification
Après installation, vous devriez voir ces packages dans votre `package.json`:
- `tailwindcss` (devDependencies)
- `zustand` (dependencies)
- `framer-motion` (dependencies)
- `@headlessui/react` (dependencies)

---

## 📁 Étape 2: Structure des Fichiers à Créer

### Nouveaux Dossiers
```
src/
├── styles/
│   └── globals.css
├── stores/
│   └── appStore.ts
└── components/
    └── ui/
        ├── Button.tsx
        ├── Input.tsx
        ├── Card.tsx
        ├── Modal.tsx
        └── LoadingSpinner.tsx
```

---

## ⚙️ Étape 3: Configuration Tailwind

### Fichier: `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Inter', 'sans-serif'],
        'secondary': ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          beige: '#D9CFC4',
          rose: '#A97C7C',
          'rose-dark': '#8B6B6B',
          maroon: '#A11D1F',
          text: '#374151',
          'button-text': '#FFFFFF',
        }
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
```

---

## 🎨 Étape 4: CSS Global

### Fichier: `src/styles/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    margin: auto;
  }

  body {
    font-family: 'Inter', sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-brand-rose hover:bg-brand-rose-dark text-brand-button-text font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200;
  }
  
  .btn-outline {
    @apply border-2 border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-lg border border-gray-100 p-6;
  }
  
  .input-field {
    @apply w-full bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:ring-2 focus:ring-brand-rose focus:border-transparent transition-all duration-200;
  }
}
```

---

## 📦 Étape 5: Store Zustand

### Fichier: `src/stores/appStore.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizConfig, Answers } from '../types';
import { DEFAULT_QUIZ_CONFIG } from '../constants';

interface AppStore {
  // State
  quizConfig: QuizConfig;
  currentStepId: string;
  answers: Answers;
  isBuilderMode: boolean;
  history: string[];
  
  // Actions
  setQuizConfig: (config: QuizConfig) => void;
  navigateToStep: (stepId: string) => void;
  addAnswer: (questionId: string, answer: any) => void;
  toggleBuilderMode: () => void;
  goBack: () => void;
  reset: () => void;
  
  // Computed
  getCurrentStep: () => any;
  getCurrentStepIndex: () => number;
  canGoBack: () => boolean;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      quizConfig: DEFAULT_QUIZ_CONFIG,
      currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
      answers: {},
      isBuilderMode: false,
      history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || ''],
      
      // Actions
      setQuizConfig: (config) => {
        set({ 
          quizConfig: config,
          currentStepId: config.steps[0]?.id || '',
          history: [config.steps[0]?.id || '']
        });
      },
      
      navigateToStep: (stepId) => {
        set(state => ({
          currentStepId: stepId,
          history: [...state.history, stepId]
        }));
      },
      
      addAnswer: (questionId, answer) => {
        set(state => ({
          answers: { ...state.answers, [questionId]: answer }
        }));
      },
      
      toggleBuilderMode: () => {
        set(state => ({ isBuilderMode: !state.isBuilderMode }));
      },
      
      goBack: () => {
        set(state => {
          if (state.history.length > 1) {
            const newHistory = state.history.slice(0, -1);
            return {
              history: newHistory,
              currentStepId: newHistory[newHistory.length - 1]
            };
          }
          return state;
        });
      },
      
      reset: () => {
        set({
          currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
          answers: {},
          history: [DEFAULT_QUIZ_CONFIG.steps[0]?.id || '']
        });
      },
      
      // Computed
      getCurrentStep: () => {
        const state = get();
        return state.quizConfig.steps.find(s => s.id === state.currentStepId);
      },
      
      getCurrentStepIndex: () => {
        const state = get();
        return state.quizConfig.steps.findIndex(s => s.id === state.currentStepId);
      },
      
      canGoBack: () => {
        const state = get();
        return state.history.length > 1;
      }
    }),
    { 
      name: 'funnel-storage',
      partialize: (state) => ({
        quizConfig: state.quizConfig,
        answers: state.answers
      })
    }
  )
);
```

---

## 🧩 Étape 6: Composant Button

### Fichier: `src/components/ui/Button.tsx`
```typescript
import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  children, 
  className,
  disabled,
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-rose hover:bg-brand-rose-dark text-brand-button-text shadow-md hover:shadow-lg transform hover:scale-105 focus:ring-brand-rose',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-300',
    outline: 'border-2 border-brand-rose text-brand-rose hover:bg-brand-rose hover:text-white focus:ring-brand-rose'
  };
  
  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  };
  
  const isDisabled = disabled || loading;
  
  return (
    <button 
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed transform-none hover:scale-100',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};
```

---

## 🔗 Étape 7: Modification du Point d'Entrée

### Modifier: `src/index.tsx`
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css'; // ← AJOUTER CETTE LIGNE

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## ✅ Étape 8: Test d'Intégration

### Créer un fichier de test: `src/components/TestComponents.tsx`
```typescript
import React from 'react';
import { Button } from './ui/Button';
import { useAppStore } from '../stores/appStore';

export const TestComponents: React.FC = () => {
  const { isBuilderMode, toggleBuilderMode } = useAppStore();
  
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold text-brand-text">Test des Nouveaux Composants</h2>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Boutons</h3>
        <div className="space-x-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">State Management</h3>
        <p>Builder Mode: {isBuilderMode ? 'ON' : 'OFF'}</p>
        <Button onClick={toggleBuilderMode} className="mt-2">
          Toggle Builder Mode
        </Button>
      </div>
    </div>
  );
};
```

---

## 🎯 Ordre d'Exécution Recommandé

1. **Exécuter les commandes npm** (Étape 1)
2. **Créer la structure de dossiers** (Étape 2)
3. **Configurer Tailwind** (Étape 3)
4. **Créer le CSS global** (Étape 4)
5. **Créer le store Zustand** (Étape 5)
6. **Créer le composant Button** (Étape 6)
7. **Modifier index.tsx** (Étape 7)
8. **Tester l'intégration** (Étape 8)

---

## 🚨 Points d'Attention

### Erreurs Possibles
- **Import CSS**: Vérifiez que `./styles/globals.css` est bien importé dans `index.tsx`
- **Types**: Si erreurs TypeScript, vérifiez que les imports de types sont corrects
- **Tailwind**: Si les styles ne s'appliquent pas, vérifiez la configuration du `content` dans `tailwind.config.js`

### Validation
Après chaque étape, vérifiez:
- ✅ Aucune erreur de compilation
- ✅ L'application se lance sans erreur
- ✅ Les styles Tailwind s'appliquent
- ✅ Le store Zustand fonctionne

---

*Ce guide sera mis à jour au fur et à mesure de l'avancement du projet.*
