# Face2Face Code Snippets & Examples

## 1. KEY COMPONENT EXAMPLES

### A. Builder Architecture
**File**: `/home/user/Face2face/components/Builder.tsx` (188 lines)

```typescript
// Entry point for funnel creation/editing
const Builder: React.FC<BuilderProps> = ({ config, setConfig }) => {
  return (
    <div className="bg-gray-50 min-h-screen p-4 overflow-y-auto">
      {/* AI-generated funnels */}
      <CollapsibleSection title="AI Assistant" defaultOpen={false}>
        <AIAssistant setConfig={setConfig} />
      </CollapsibleSection>

      {/* Design customization */}
      <CollapsibleSection title="Theme Editor" defaultOpen={false}>
        <ThemeEditor theme={config.theme} onUpdate={updateTheme} />
      </CollapsibleSection>

      {/* Step management with drag-drop */}
      <CollapsibleSection title="Steps Management" defaultOpen={true}>
        {config.steps.map((step, idx) => (
          <StepEditor
            key={step.id}
            step={step}
            allSteps={config.steps}
            onUpdate={(upd) => updateStep(idx, upd)}
            onDelete={() => deleteStep(idx)}
            onDragStart={(e) => handleDragStart(e, step.id)}
          />
        ))}
      </CollapsibleSection>
    </div>
  );
};
```

### B. Store Structure
**File**: `/home/user/Face2face/stores/appStore.ts` (207 lines)

```typescript
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // State
      quizConfig: DEFAULT_QUIZ_CONFIG,
      currentStepId: DEFAULT_QUIZ_CONFIG.steps[0]?.id || '',
      answers: {},
      isBuilderMode: false,
      
      // Actions
      setQuizConfig: (config) => {
        set({
          quizConfig: config,
          currentStepId: config.steps[0]?.id || '',
          history: [config.steps[0]?.id || '']
        });
      },
      
      goToNext: () => {
        const state = get();
        const currentIndex = state.quizConfig.steps.findIndex(
          s => s.id === state.currentStepId
        );
        if (currentIndex >= 0 && currentIndex < state.quizConfig.steps.length - 1) {
          const nextStep = state.quizConfig.steps[currentIndex + 1];
          set(prevState => ({
            currentStepId: nextStep.id,
            history: [...prevState.history, nextStep.id]
          }));
        }
      },
      
      // ... 18+ more actions
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

### C. Theme System (Dynamic CSS Variables)
**File**: `/home/user/Face2face/App.tsx` (lines 19-45)

```typescript
const ThemeManager: React.FC<{ theme: ThemeConfig }> = ({ theme }) => {
  useEffect(() => {
    const root = document.documentElement;
    const { colors, font } = theme;

    // Set CSS custom properties dynamically
    root.style.setProperty('--theme-bg', colors.background);
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-primary-hover', darkenColor(colors.primary, 0.1));
    root.style.setProperty('--theme-text', colors.text);

    // Dynamically load Google Font
    if (font) {
      const link = document.createElement('link');
      link.id = 'dynamic-google-font';
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  }, [theme]);

  return null;
};
```

---

## 2. MAIN ISSUES WITH CODE EXAMPLES

### A. Issue #1: Inline Styles (27 instances)

**Problem**: Header.tsx uses inline styles instead of Tailwind

```typescript
// ❌ BAD - Header.tsx (7+ times)
<span className="font-bold tracking-wider text-gray-800 text-xl" 
      style={{ fontFamily: 'Poppins, sans-serif' }}>
  FACEÀFACE
</span>

// ✅ GOOD - Use Tailwind
<span className="font-bold tracking-wider text-gray-800 text-xl font-poppins">
  FACEÀFACE
</span>
```

**Fix**: Add to `tailwind.config.js`:
```javascript
theme: {
  extend: {
    fontFamily: {
      primary: ['Inter', 'sans-serif'],
      secondary: ['Poppins', 'sans-serif'],
    }
  }
}
```

---

### B. Issue #2: Large God Component

**Problem**: StepEditor.tsx (564 lines) handles 4 step types

```typescript
// ❌ BAD - Current StepEditor
export const StepEditor: React.FC<StepEditorProps> = ({ step }) => {
  return (
    <div>
      {step.type === StepType.Welcome && (
        /* 100+ lines of Welcome step UI */
      )}
      {step.type === StepType.Question && (
        /* 150+ lines of Question step UI */
      )}
      {step.type === StepType.Message && (
        /* 100+ lines of Message step UI */
      )}
      {step.type === StepType.LeadCapture && (
        /* 150+ lines of LeadCapture step UI */
      )}
    </div>
  );
};

// ✅ GOOD - Separate components
const WelcomeStepEditor: React.FC<Props> = ({ step, onUpdate }) => {/* 100 lines */};
const QuestionStepEditor: React.FC<Props> = ({ step, onUpdate }) => {/* 150 lines */};
const MessageStepEditor: React.FC<Props> = ({ step, onUpdate }) => {/* 100 lines */};
const LeadCaptureStepEditor: React.FC<Props> = ({ step, onUpdate }) => {/* 150 lines */};

export const StepEditor: React.FC<StepEditorProps> = ({ step, onUpdate }) => {
  switch (step.type) {
    case StepType.Welcome:
      return <WelcomeStepEditor step={step as WelcomeStep} onUpdate={onUpdate} />;
    case StepType.Question:
      return <QuestionStepEditor step={step as QuestionStep} onUpdate={onUpdate} />;
    // ...
  }
};
```

---

### C. Issue #3: Duplicate Components

**Problem**: Two headers with unclear usage

```
/components/Header.tsx              (155 lines - currently used)
/components/Header.improved.tsx     (216 lines - not used?)
```

**Solution**:
1. Merge improved version into main Header
2. Delete duplicate
3. Clear import paths

---

### D. Issue #4: Missing API Integration

**Current State - localStorage only**:
```typescript
// App.tsx - saves to localStorage, not backend
onSave={async (config) => {
  console.log('Sauvegarde du funnel:', config);
  await new Promise(resolve => setTimeout(resolve, 1000));
  localStorage.setItem('savedFunnel', JSON.stringify(config));  // ❌ localStorage
}}
```

**Required Implementation**:
```typescript
// ✅ Backend integration
onSave={async (config) => {
  const response = await apiFetch('/api/funnels', {
    method: 'POST',
    body: JSON.stringify(config)
  });
  if (!response.ok) throw new Error('Save failed');
  return response.json();
}}
```

---

### E. Issue #5: MediaViewer Handling Too Much

**Problem**: 254 lines handling 4 media types

```typescript
// ❌ BAD - All in one component
export const MediaViewer: React.FC<Props> = ({ media }) => {
  if (media.type === 'image') {
    // 80 lines of image handling
  } else if (media.type === 'video') {
    // 70 lines of video handling
  } else if (media.type === 'audio') {
    // 50 lines of audio handling
  } else if (media.type === 'youtube') {
    // 54 lines of YouTube handling
  }
};

// ✅ GOOD - Separate components
<MediaViewer media={media}>
  {media.type === 'image' && <ImageViewer url={media.url} />}
  {media.type === 'video' && <VideoViewer url={media.url} />}
  {media.type === 'audio' && <AudioViewer url={media.url} />}
  {media.type === 'youtube' && <YouTubeViewer videoId={extractYouTubeId(media.url)} />}
</MediaViewer>
```

---

### F. Issue #6: Inconsistent Responsiveness

**Problem**: Layout missing md: breakpoint

```typescript
// ❌ BAD - Jumps from mobile (sm:) to lg:
<div className={`flex flex-col lg:flex-row w-full`}>
  <div className="w-full lg:w-1/2">...</div>
  <div className="w-full lg:w-1/2">...</div>
</div>

// ✅ GOOD - Proper progression
<div className={`flex flex-col md:flex-row lg:grid-cols-2 w-full`}>
  <div className="w-full md:w-1/2 lg:w-1/2">...</div>
  <div className="w-full md:w-1/2 lg:w-1/2">...</div>
</div>
```

---

## 3. CUSTOM HOOK OPPORTUNITIES

### Missing Hooks (should be extracted)

```typescript
// ❌ CURRENTLY - scattered throughout components
const [textAnswer, setTextAnswer] = useState('');
const { addAnswer } = useAppStore();

// ✅ CUSTOM HOOKS NEEDED
// hooks/useAnswer.ts
export const useAnswer = (questionId: string) => {
  const { addAnswer, answers } = useAppStore();
  const answer = answers[questionId];
  
  const submit = (value: any) => {
    addAnswer(questionId, value);
  };
  
  return { answer, submit };
};

// hooks/useStep.ts
export const useStep = (stepId: string) => {
  const { quizConfig, navigateToStep, goToNext, goBack } = useAppStore();
  const step = quizConfig.steps.find(s => s.id === stepId);
  const index = quizConfig.steps.findIndex(s => s.id === stepId);
  
  return { step, index, navigateToStep, goToNext, goBack };
};

// hooks/useBuilder.ts
export const useBuilder = () => {
  const { isBuilderMode, toggleBuilderMode, quizConfig, setQuizConfig } = useAppStore();
  
  const updateStep = (index: number, update: Partial<QuizStep>) => {
    const newSteps = [...quizConfig.steps];
    newSteps[index] = { ...newSteps[index], ...update };
    setQuizConfig({ ...quizConfig, steps: newSteps });
  };
  
  return { isBuilderMode, toggleBuilderMode, updateStep };
};
```

---

## 4. ACCESSIBILITY ISSUES

### Missing ARIA Labels

```typescript
// ❌ BAD - No accessibility info
<button onClick={toggleBuilder} className="...">
  <Edit3 className="w-4 h-4" />
</button>

// ✅ GOOD - Proper accessibility
<button 
  onClick={toggleBuilder} 
  aria-label="Toggle builder mode"
  aria-pressed={isBuilderMode}
  className="..."
>
  <Edit3 className="w-4 h-4" aria-hidden="true" />
</button>
```

### Inconsistent Focus Management

```typescript
// ❌ BAD - No focus trap in modal
export const AuthModal: React.FC<Props> = ({ isOpen }) => {
  return (
    <Modal isOpen={isOpen}>
      <LoginForm />
    </Modal>
  );
};

// ✅ GOOD - Focus management
import { useFocusTrap } from 'hooks/useFocusTrap';

export const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const focusRef = useFocusTrap<HTMLDivElement>(isOpen);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div ref={focusRef} role="dialog" aria-modal="true">
        <LoginForm />
      </div>
    </Modal>
  );
};
```

---

## 5. PERFORMANCE ISSUES

### Image Optimization

```typescript
// ❌ BAD - Full resolution, no optimization
<img src={fullResolutionUrl} alt="..." className="w-full h-full object-cover" />

// ✅ GOOD - Optimized with lazy loading
<img 
  src={optimizedUrl}
  srcSet={`${small} 480w, ${medium} 1024w, ${large} 1920w`}
  sizes="(max-width: 640px) 480px, (max-width: 1024px) 1024px, 1920px"
  alt="..."
  loading="lazy"
  className="w-full h-full object-cover"
/>
```

### Zustand Selector Optimization

```typescript
// ❌ BAD - Whole store re-renders
const { answers, currentStepId } = useAppStore();

// ✅ GOOD - Selective subscriptions
const answers = useAppStore(state => state.answers);
const currentStepId = useAppStore(state => state.currentStepId);
```

---

## 6. FOLDER STRUCTURE IMPROVEMENTS

### Current (Confusing) ❌
```
/components
  ├── Builder.tsx
  ├── Header.tx
  ├── Header.improved.tsx  (duplicate)
  ├── ui/
  │   ├── Button.tsx
  │   └── ...
  └── builder/
      ├── StepEditor.tsx
      └── ...

/src
  ├── components/
  │   ├── OptimizedImage.tsx (unused)
  │   └── ui/
  │       └── Button.tsx (duplicate)
  └── ...
```

### Recommended Structure ✅
```
/src
  ├── components/
  │   ├── pages/
  │   │   ├── Builder.tsx
  │   │   ├── Dashboard.tsx
  │   │   └── QuizView.tsx
  │   ├── screens/
  │   │   ├── WelcomeScreen.tsx
  │   │   ├── QuestionScreen.tsx
  │   │   └── ...
  │   ├── builder/
  │   │   ├── editors/
  │   │   │   ├── WelcomeStepEditor.tsx
  │   │   │   ├── QuestionStepEditor.tsx
  │   │   │   └── ...
  │   │   ├── AIAssistant.tsx
  │   │   └── ThemeEditor.tsx
  │   ├── media/
  │   │   ├── ImageViewer.tsx
  │   │   ├── VideoViewer.tsx
  │   │   └── ...
  │   ├── ui/
  │   │   ├── Button.tsx
  │   │   ├── Input.tsx
  │   │   └── ...
  │   └── common/
  │       ├── Header.tsx
  │       ├── Footer.tsx
  │       └── ...
  ├── hooks/
  │   ├── useAnswer.ts
  │   ├── useStep.ts
  │   ├── useBuilder.ts
  │   └── useFocusTrap.ts
  ├── stores/
  │   └── appStore.ts
  ├── lib/
  │   ├── ai.ts
  │   ├── api.ts
  │   └── media.ts
  └── types/
      └── index.ts
```

