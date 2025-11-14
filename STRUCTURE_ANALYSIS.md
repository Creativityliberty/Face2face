# Face2Face Application Structure Analysis

## Executive Summary
Face2Face is a React-based video funnel builder with AI-assisted content generation. The application uses Zustand for state management, Tailwind CSS for styling, and Google's Gemini API for AI features. The codebase has ~4,700 lines of component code across 46 React components.

---

## 1. CURRENT UI COMPONENTS

### Component Architecture
- **Location**: Primary components at `/home/user/Face2face/components/` (46 files)
- **Secondary Location**: `/home/user/Face2face/src/components/` (minimal usage)
- **Total Lines**: 4,694 LOC

### Main Component Categories

#### A. Core Pages (Entry Points)
1. **Builder.tsx** (188 lines)
   - Funnel editing interface
   - Drag-and-drop step management
   - Uses CollapsibleSection UI components
   - Integrates: AIAssistant, ThemeEditor, StepEditor, ShareAndEmbed

2. **QuizContainer.tsx** (275 lines)
   - Main quiz flow controller
   - Renders appropriate screen based on step type
   - Handles lead capture and WhatsApp redirection
   - Screens rendered: Welcome, Question, Message, LeadCapture, Completion

3. **ResultsDashboard.tsx** (193 lines)
   - Displays submission results
   - Pagination (5 items per page)
   - Drill-down to individual submission details

#### B. Screen Components (Step Types)
- **WelcomeScreen.tsx** - Title + button
- **QuestionScreen.tsx** - Question + 4 input types (buttons, text, voice, video)
- **MessageScreen.tsx** - Title + continue button
- **LeadCaptureScreen.tsx** (122 lines) - Form with name/email/phone + subscription
- **QuizCompletionScreen.tsx** - End-of-funnel screen
- **LeadConfirmationScreen.tsx** (144 lines) - Confirmation before redirect

#### C. Builder Sub-Components
1. **StepEditor.tsx** (564 lines) ⚠️ LARGEST COMPONENT
   - Single editor for all step types
   - AI suggestions via suggestChangesForStep()
   - Image/audio generation
   - Media tab system (link vs AI)
   - Handles all step type variants

2. **ThemeEditor.tsx** - Color picker + font selector
3. **AIAssistant.tsx** - Prompt input + model selection (Gemini 2.5 Pro/Flash)
4. **ShareAndEmbed.tsx** (112 lines) - Share link + embed code generation

#### D. UI Component Library (14 files)
Located in `/home/user/Face2face/components/ui/`
- Button.tsx - Primary/Secondary/Outline variants, 3 sizes
- Input.tsx - With error state + icon support
- InputWithIcon.tsx - Pre-built email/phone inputs
- Textarea.tsx
- Select.tsx
- Card.tsx
- Modal.tsx
- Toast.tsx
- LoadingSpinner.tsx
- ColorPicker.tsx
- CollapsibleSection.tsx - Accordion component
- BackButton.tsx
- FloatingBuilderButton.tsx
- SocialIcon.tsx (Instagram, YouTube, WhatsApp, etc.)

#### E. Dashboard Components
- SubmissionDetail.tsx - Single submission view
- AnswerAnalysis.tsx - AI sentiment analysis display
- AnswerCard.tsx - Individual answer card
- SentimentDisplay.tsx - Sentiment visualization

#### F. Auth Components
- AuthModal.tsx - Login/register modal wrapper
- LoginForm.tsx
- RegisterForm.tsx

#### G. Utility Components
- **Header.tsx** (155 lines) - Main header with responsive collapse
- **Header.improved.tsx** (216 lines) - Alternative header (⚠️ DUPLICATE)
- Footer.tsx
- UserSettings.tsx (352 lines)
- MediaViewer.tsx (254 lines) - Image/video/audio viewer with YouTube support
- VideoPlayer.tsx - Video player wrapper
- MediaRecorder.tsx (185 lines) - Voice/video recording
- ErrorBoundary.tsx - Error handling component

### Design System & Theme

#### Tailwind Configuration
- Located: `tailwind.config.js`
- Custom colors in `theme.extend.colors`:
  ```
  brand: {
    beige: '#D9CFC4',
    rose: '#A97C7C',
    rose-dark: '#8B6B6B',
    maroon: '#A11D1F',
    text: '#374151',
    button-text: '#FFFFFF'
  }
  ```
- Custom animations: `slide-in` (0.3s), `fade-in` (0.2s)
- Font families: Inter (primary), Poppins (secondary)

#### CSS Files
1. **globals.css** (64 lines)
   - CSS custom properties (--brand-beige, --brand-rose, etc.)
   - Component classes (.btn-primary, .btn-secondary, .card, .input-field)
   - Keyframe animations

2. **accessibility.css** (127 lines) ⚠️ WCAG 2.1 AA
   - Focus indicators (outline: 2px solid #A97C7C)
   - Skip-to-content link
   - SR-only utility class
   - Touch targets (min 44x44px on mobile)
   - Reduced motion support
   - High contrast mode support

---

## 2. FUNNEL BUILDER IMPLEMENTATION

### Step Types Supported
```typescript
enum StepType {
  Welcome,      // Title + button
  Question,     // Question + answer input
  Message,      // Title + button
  LeadCapture   // Form (name, email, phone, subscribe)
}
```

### Answer Input Types
```typescript
type AnswerInputType = 'buttons' | 'text' | 'voice' | 'video'
```

### Funnel Configuration Structure
```typescript
interface QuizConfig {
  steps: QuizStep[]
  theme: ThemeConfig
  redirectUrl?: string          // Post-capture redirect
  whatsappNumber?: string       // Auto-redirect to WhatsApp
  maxSteps?: number            // Default: 15 steps
}

interface ThemeConfig {
  font: string
  colors: {
    background: string
    primary: string
    accent: string
    text: string
    buttonText: string
  }
}
```

### Builder Features

#### Step Management
- **Add Step**: Type selector (Welcome/Question/Message/LeadCapture)
- **Edit Step**: In-place editing via StepEditor
- **Delete Step**: Single-step deletion
- **Reorder Steps**: Drag-and-drop within the builder
- **Constraints**: Max 15 steps (enforced)

#### Media Management
- Upload media: Links to `/api/media/upload`
- AI generation: Image (via Gemini) and audio (via text-to-speech)
- Media types: Image (JPEG/PNG), Video (MP4/WebM), Audio (MP3/WAV)
- YouTube support: Auto-extract video ID and render player

#### AI Features
1. **Funnel Generation** (AIAssistant.tsx)
   - Prompt: Describe funnel goal
   - Output: Complete QuizConfig (7-15 steps)
   - Models: Gemini 2.5 Pro (default) or Flash

2. **Step Suggestions** (StepEditor.tsx)
   - Suggest changes to title/question/button text
   - Uses: `suggestChangesForStep(step, field, currentValue)`

3. **Content Generation**
   - **Images**: `generateImageFromPrompt(prompt)` → Data URL
   - **Audio**: `generateAudioFromText(text)` → Data URL

#### Preview System
- **Live Preview**: Right panel shows current step media
- **Media Viewer Component**: Handles all media types
- **YouTube Preview**: Thumbnail + play button overlay

### Data Flow
```
Builder → QuizConfig → localStorage (persisted)
              ↓
        useAppStore (Zustand)
              ↓
        QuizContainer → Step screens → Answers → Results
```

---

## 3. STATE MANAGEMENT (Zustand)

### Store Location
`/home/user/Face2face/stores/appStore.ts`

### Store Structure
```typescript
interface AppStore {
  // Auth State
  user: { id, email, name } | null
  accessToken: string | null
  refreshToken: string | null
  
  // Funnel State
  quizConfig: QuizConfig
  currentStepId: string
  answers: Answers
  isBuilderMode: boolean
  history: string[]                // Navigation history
  isQuizCompleted: boolean
  hasError: boolean
  submissions: Submission[]
  
  // Actions (20+ methods)
  setQuizConfig, navigateToStep, addAnswer, toggleBuilderMode
  goBack, goToNext, reset, setQuizCompleted, etc.
}
```

### Key Features
- **Persistence**: Uses Zustand `persist` middleware
- **Storage Key**: 'funnel-storage'
- **Persisted Fields**: quizConfig, answers only
- **History**: Maintains navigation stack for back button

### URL Sharing
- Funnels can be shared via URL parameters: `?config=<encoded-json>`
- Decoding: `decodeURIComponent() + JSON.parse()`
- Activation: Sets isSharedMode flag (hides header/footer)

---

## 4. STYLING APPROACH

### Framework
- **Primary**: Tailwind CSS v3.4.17
- **Utility**: clsx v2.1.1 (className merging)
- **Typography**: 
  - Body: Inter (sans-serif)
  - Headings: Poppins (sans-serif)

### Color Palette
| Semantic | Hex | Usage |
|----------|-----|-------|
| Primary | #A97C7C (rose) | Buttons, links, hover states |
| Dark | #8B6B6B (rose-dark) | Button hover |
| Accent | #A11D1F (maroon) | CTAs, important elements |
| Background | #D9CFC4 (beige) | Canvas background |
| Text | #374151 (gray) | Body text |
| Button Text | #FFFFFF | White text on buttons |

### Responsive Breakpoints Usage
- **sm:** Mobile → tablet (640px)
- **md:** Tablet → desktop (768px)
- **lg:** Large screens (1024px)
- **Instances**: 51 responsive breakpoints throughout codebase

### Custom CSS Layer Structure
```
@layer base
  - CSS variables (--brand-*)
  - Typography settings
  - Font smoothing
  
@layer components
  - .btn-primary, .btn-secondary, .btn-outline
  - .card, .input-field, .animate-slide-in
  
@layer utilities
  - Standard Tailwind utilities
```

### Responsive Design Patterns
1. **Container**: `w-full max-w-md mx-auto` (quiz screens)
2. **Grid**: `flex flex-col lg:flex-row` (layout toggle)
3. **Scaling**: `sm:text-lg md:text-xl lg:text-2xl`
4. **Spacing**: `px-4 sm:px-6 md:px-8`
5. **Touch**: `touch-manipulation` (iOS/Android optimization)
6. **Min heights**: `min-h-[48px]` (44px touch target + padding)

---

## 5. CURRENT ISSUES & PAIN POINTS

### A. TODOs / FIXMEs
```typescript
// App.tsx:140
// TODO: Connecter à l'API pour sauvegarder en base
console.log('Sauvegarde du funnel:', config);

// App.tsx:147
// TODO: Connecter à l'API pour charger depuis la base
const saved = localStorage.getItem('savedFunnel');
```
**Impact**: Funnels only persist to localStorage, not backend

### B. Component Organization Issues

#### 1. Duplicate Components ⚠️
- **Header.tsx** (155 lines) vs **Header.improved.tsx** (216 lines)
- Unclear which is being used; improved version not adopted
- **Location**: `/components/` root level

#### 2. Folder Confusion
- Components split between `/components/` and `/src/components/`
- `/src/components/` only contains:
  - OptimizedImage.tsx (unused)
  - ui/Button.tsx (duplicate of `/components/ui/Button.tsx`)
- **Import chaos**: Some files import from `./components`, others from `../src/components`

#### 3. Large Components ⚠️
| Component | Lines | Issue |
|-----------|-------|-------|
| StepEditor.tsx | 564 | Handles all step types, media, AI features |
| UserSettings.tsx | 352 | Settings + preferences + profile |
| QuizContainer.tsx | 275 | Main orchestrator with 6+ conditional renders |
| MediaViewer.tsx | 254 | Image, video, audio, YouTube all in one |

### C. Styling Issues

#### 1. Inline Styles (27 instances) ⚠️
```jsx
// Scattered throughout Header.tsx (7 times)
style={{ fontFamily: 'Poppins, sans-serif' }}

// Better: Use Tailwind font-family utilities
```
**Impact**: Breaks separation of concerns, hard to maintain

#### 2. Inconsistent Theme Application
- ThemeManager (App.tsx) sets CSS variables dynamically
- But many components hardcode brand colors
- Example: `bg-brand-rose` vs CSS variable `var(--theme-primary)`

#### 3. Absolute/Fixed Positioning (34 instances)
- 34 absolute/fixed positioning statements found
- Can cause mobile responsiveness issues
- Examples:
  - MediaViewer: `absolute inset-0` for full coverage
  - Header: `fixed top-0 left-0` with complex z-index management
  - Play button overlays

### D. Mobile Responsiveness Issues

#### 1. Touch Target Sizes
- ✅ Good: min-h-[48px] minimum on buttons
- ⚠️ Gap: Some buttons use sm: breakpoints that don't scale on mobile
- Issue: Builder interface not optimized for small screens

#### 2. Layout Stacking
- App.tsx uses `flex-col lg:flex-row` split layout
- On mobile: Single column good
- On tablet (768-1023px): Still single column (should maybe be side-by-side)
- Missing md: breakpoint in some components

#### 3. Viewport Height Issues
- Several `h-full` usage without `min-h-screen` fallback
- Can cause layout breaks on iOS (viewport height quirks)

### E. Code Duplication

#### 1. Icons Component (181 lines)
- Has UI icons scattered throughout
- Some duplicated across components:
  - PhotoIcon used in multiple places
  - PlayButton rendering duplicated in MediaViewer vs YouTube component

#### 2. Button Variants
- Button.tsx covers primary/secondary/outline
- But custom button styles also in:
  - globals.css (.btn-primary, .btn-secondary)
  - Individual components (inline styles)

#### 3. Form Inputs
- InputWithIcon.tsx wraps Input.tsx + icon
- But some components build custom icon inputs
- No standardized form wrapper

### F. API Integration Gaps

#### 1. Incomplete Backend Connection
| Feature | Status | Note |
|---------|--------|------|
| Save funnel | ⚠️ TODO | Only localStorage |
| Load funnel | ⚠️ TODO | Only localStorage |
| Upload media | 🔴 Broken | Calls `/api/media/upload` but no backend |
| Auth | 🟡 Partial | apiFetch wrapper ready, but no login implementation |
| Results | 🟡 Partial | Submission tracking ready, analysis TBD |

#### 2. Error Handling
- API errors logged to console
- No user-facing error boundaries in places like AIAssistant
- Media upload failures silently fail

### G. Performance Issues

#### 1. No Image Optimization
- MediaViewer loads full resolution images
- No lazy loading
- YouTube thumbnails might be oversized (using maxresdefault.jpg)
- `/src/components/OptimizedImage.tsx` exists but unused

#### 2. Bundle Size
- Google Generative AI SDK included (not optimized for browser)
- Framer Motion imported but minimal usage
- lucide-react icons: 300+ icons loaded despite using <10

#### 3. Zustand Optimization
- No selector optimization (whole store re-renders)
- Answer storage grows unbounded

### H. Accessibility Issues

#### 1. Missing ARIA Labels
- Buttons like toggle header have aria-label ✅
- But many components missing:
  - Form inputs lack associated labels
  - Icon buttons lack descriptions
  - Modals lack aria-modal

#### 2. Focus Management
- accessibility.css good (focus indicators)
- But no focus trap in modals
- No skip-to-content link implemented
- Screen reader announcements missing

#### 3. Semantic HTML
- Overuse of divs instead of semantic elements
- Video player missing <video> element (uses iframe)
- No proper form structure in some screens

---

## 6. ARCHITECTURE PATTERNS

### Current Patterns ✅
1. **Compound Components**: Button, Input, Card (well-structured)
2. **Screen Container Pattern**: QuizContainer dispatches to different screens
3. **Store-Driven UI**: Zustand store as single source of truth
4. **Composition**: Builder uses sub-components (ThemeEditor, StepEditor)

### Anti-Patterns Found ⚠️
1. **God Component**: StepEditor handles 4+ step types
2. **Prop Drilling**: QuizContainer passes many props down
3. **Mixed Concerns**: MediaViewer handles 4 media types
4. **Feature Flags**: No proper flagging (isSharedMode flag scattered)

### Missing Patterns 🔴
1. **Error Boundary**: Limited error handling
2. **Loading State**: Inconsistent loading indicators
3. **Caching**: No response caching for AI calls
4. **Hooks Library**: No custom hooks for common patterns
5. **Layout System**: No consistent grid/flex wrapper

---

## 7. SPECIFIC FILES NEEDING REFACTORING

### High Priority (breaking/security)
1. **App.tsx** (224 lines)
   - Theme manager logic should be extracted
   - URL parameter decoding should be sanitized
   - Too many responsibilities

2. **appStore.ts** (207 lines)
   - No TypeScript strict mode on complex actions
   - History management could be simplified
   - Missing error states

3. **lib/api.ts** (106 lines)
   - Token refresh logic is complex
   - window.location.href hardcoded
   - No request cancellation

### Medium Priority (maintainability)
1. **StepEditor.tsx** (564 lines) → Split into:
   - WelcomeStepEditor
   - QuestionStepEditor
   - MessageStepEditor
   - LeadCaptureStepEditor
   - MediaTab (extracted)

2. **QuizContainer.tsx** (275 lines) → Extract screens:
   - Already partially done, but extract screen selection logic

3. **Header.tsx** (155 lines) → Remove duplicate, merge with improved version

4. **MediaViewer.tsx** (254 lines) → Split by media type:
   - ImageViewer
   - VideoViewer
   - AudioViewer
   - YouTubeViewer

### Low Priority (nice-to-have)
1. **icons.tsx** (181 lines) → Use lucide-react directly
2. Remove **Header.improved.tsx** (duplicate)
3. Clean up `/src/components/` folder structure
4. Extract utility functions from lib/ai.ts

---

## 8. IMPROVEMENT OPPORTUNITIES

### Quick Wins (1-2 hours each)
1. Remove inline style fontFamily - use Tailwind font-family
2. Implement missing ARIA labels
3. Add error boundaries to Builder components
4. Create custom hooks: useAnswers, useStep, useBuilderState
5. Add image optimization in MediaViewer

### Medium Efforts (4-8 hours)
1. Split StepEditor into smaller components
2. Create reusable form wrapper component
3. Add request caching layer
4. Implement proper error handling in API calls
5. Create component story file for UI library

### Large Refactors (16+ hours)
1. Extract theme system into context provider
2. Implement proper API integration (currently localStorage only)
3. Add comprehensive test suite
4. Build custom hooks library for state management
5. Create design system documentation

---

## 9. TECHNOLOGY STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.1.0 |
| State | Zustand | 5.0.7 |
| Build | Vite | 6.2.0 |
| Styling | Tailwind CSS | 3.4.17 |
| UI | lucide-react | 0.537.0 |
| Animation | Framer Motion | 12.23.12 |
| AI | @google/genai | latest |
| Icons | Custom (icons.tsx) | - |

---

## 10. KEY FILES REFERENCE

### Core Files
- **App.tsx** - Main app entry, theme manager
- **types.ts** - All TypeScript interfaces
- **constants.ts** - Config limits, default funnel
- **stores/appStore.ts** - Zustand store
- **lib/ai.ts** - Gemini API integration
- **lib/api.ts** - Backend fetch wrapper

### Component Tree
```
App
├── Header
├── AuthModal
├── Builder (in builder mode)
│   ├── AIAssistant
│   ├── ThemeEditor
│   ├── StepEditor (×n steps)
│   └── ShareAndEmbed
├── QuizContainer (in quiz mode)
│   ├── WelcomeScreen
│   ├── QuestionScreen
│   ├── MessageScreen
│   ├── LeadCaptureScreen
│   └── QuizCompletionScreen
├── MediaViewer
├── ResultsPanel
└── Footer
```

### Utilities
- **styles/globals.css** - Base styles
- **styles/accessibility.css** - A11y improvements
- **tailwind.config.js** - Tailwind configuration
- **vite.config.ts** - Build configuration

