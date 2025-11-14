# Guidelines de Design - Face2Face Design System

Guide complet du Design System de Face2Face avec exemples de code.

---

## 🎨 INTRODUCTION

Le Design System Face2Face garantit une expérience utilisateur cohérente, belle et performante sur tous les appareils.

### Principes de Design

1. **Clarté** - L'interface doit être immédiatement compréhensible
2. **Cohérence** - Même langage visuel partout
3. **Efficacité** - Minimiser les frictions
4. **Beauté** - Attention aux détails
5. **Accessibilité** - Utilisable par tous

---

## 🌈 COULEURS

### Palette Principale

```tsx
// tailwind.config.js
colors: {
  brand: {
    beige: '#D9CFC4',      // Backgrounds doux, secondaire
    rose: '#A97C7C',       // Primaire, CTA
    'rose-dark': '#8B6B6B', // Hover states
    maroon: '#A11D1F',     // Accents forts
    text: '#374151',       // Texte par défaut
  }
}
```

**Utilisation:**

```tsx
// Bouton principal
<button className="bg-brand-rose hover:bg-brand-rose-dark text-white">

// Background doux
<div className="bg-brand-beige">

// Texte
<p className="text-brand-text">
```

### Couleurs Sémantiques

```tsx
// À ajouter dans tailwind.config.js
semantic: {
  success: '#10B981',    // Actions positives
  warning: '#F59E0B',    // Avertissements
  error: '#EF4444',      // Erreurs
  info: '#3B82F6',       // Informations
}
```

**Exemples:**

```tsx
// Message de succès
<div className="bg-green-50 border border-green-200 text-green-800">
  ✓ Funnel créé avec succès!
</div>

// Erreur
<div className="bg-red-50 border border-red-200 text-red-800">
  ⚠ Une erreur est survenue
</div>

// Warning
<div className="bg-yellow-50 border border-yellow-200 text-yellow-800">
  ⚡ Attention: Action irréversible
</div>

// Info
<div className="bg-blue-50 border border-blue-200 text-blue-800">
  ℹ Astuce: Utilisez le raccourci Cmd+S
</div>
```

### Neutrals (Gris)

```tsx
// Déjà disponibles via Tailwind
gray-50   #F9FAFB   // Backgrounds très clairs
gray-100  #F3F4F6   // Backgrounds clairs
gray-200  #E5E7EB   // Borders, dividers
gray-300  #D1D5DB   // Borders hover
gray-400  #9CA3AF   // Placeholders
gray-500  #6B7280   // Texte secondaire
gray-600  #4B5563   // Texte normal
gray-700  #374151   // Texte fort (brand-text)
gray-800  #1F2937   // Headings
gray-900  #111827   // Texte très fort
```

### Règles de Contraste

```
Texte normal:
- Minimum 4.5:1 sur background
- ✅ #374151 sur #FFFFFF = 8.3:1
- ❌ #9CA3AF sur #FFFFFF = 2.8:1

Texte large (≥18pt):
- Minimum 3:1
- ✅ #6B7280 sur #FFFFFF = 4.5:1

Éléments UI:
- Minimum 3:1
- ✅ Border #D1D5DB sur #FFFFFF = 1.6:1 (acceptable car non-texte)
```

**Vérifier le contraste:** https://webaim.org/resources/contrastchecker/

---

## ✍️ TYPOGRAPHIE

### Polices

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Poppins', sans-serif;
}
```

### Scale Typographique

```tsx
// Headings
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
  {/* 48px mobile → 56px tablet → 64px desktop */}
</h1>

<h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
  {/* 24px mobile → 30px tablet → 36px desktop */}
</h2>

<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 leading-snug">
  {/* 20px mobile → 24px tablet → 30px desktop */}
</h3>

<h4 className="text-lg sm:text-xl font-semibold text-gray-900">
  {/* 18px mobile → 20px desktop */}
</h4>

// Body text
<p className="text-base sm:text-lg text-gray-700 leading-relaxed">
  {/* 16px mobile → 18px desktop */}
</p>

<p className="text-sm sm:text-base text-gray-600 leading-normal">
  {/* 14px mobile → 16px desktop */}
</p>

// Small text
<small className="text-xs sm:text-sm text-gray-500">
  {/* 12px mobile → 14px desktop */}
</small>
```

### Poids des Polices

```tsx
// Inter (body)
font-normal   // 400 - Texte normal
font-medium   // 500 - Texte important
font-semibold // 600 - Labels, emphasis
font-bold     // 700 - Très important

// Poppins (headings)
font-semibold // 600 - H2, H3, H4
font-bold     // 700 - H1, Hero titles
```

### Line Heights

```tsx
leading-tight    // 1.25 - Headings larges (H1, H2)
leading-snug     // 1.375 - Headings moyens (H3, H4)
leading-normal   // 1.5 - Body text court
leading-relaxed  // 1.625 - Body text long, articles
leading-loose    // 2 - Emphasis, citations
```

### Exemples Complets

```tsx
// Hero section
<div className="text-center">
  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
    Créez des funnels magnifiques
  </h1>
  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
    Transformez vos visiteurs en clients avec Face2Face
  </p>
</div>

// Card title
<h3 className="text-xl font-semibold text-gray-900 mb-2">
  Mon premier funnel
</h3>
<p className="text-sm text-gray-600">
  Créé il y a 2 jours
</p>

// Form label
<label className="block text-sm font-medium text-gray-700 mb-2">
  Adresse email
</label>
```

---

## 📏 SPACING

### Scale (Base 8px)

```tsx
p-1   // 4px
p-2   // 8px
p-3   // 12px
p-4   // 16px
p-5   // 20px
p-6   // 24px
p-8   // 32px
p-10  // 40px
p-12  // 48px
p-16  // 64px
p-20  // 80px
p-24  // 96px
```

### Règles d'Utilisation

```tsx
// Padding dans composants
<button className="px-4 py-2 sm:px-6 sm:py-3">
  {/* Mobile: 16px/8px, Desktop: 24px/12px */}
</button>

<div className="p-4 sm:p-6 lg:p-8">
  {/* Mobile: 16px, Tablet: 24px, Desktop: 32px */}
</div>

// Marges entre sections
<section className="py-12 sm:py-16 lg:py-20">
  {/* Mobile: 48px, Tablet: 64px, Desktop: 80px */}
</section>

// Gap dans grilles
<div className="grid gap-4 sm:gap-6 lg:gap-8">
  {/* Mobile: 16px, Tablet: 24px, Desktop: 32px */}
</div>

// Stack verticalement
<div className="space-y-4">
  {/* 16px entre chaque enfant */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Stack horizontalement
<div className="flex gap-3">
  {/* 12px entre chaque enfant */}
  <button>Action 1</button>
  <button>Action 2</button>
</div>
```

### Container & Max-Width

```tsx
// Container standard
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  {/* Content */}
</div>

// Narrow container (forms, articles)
<div className="container mx-auto px-4 max-w-2xl">
  {/* Content */}
</div>

// Wide container (dashboards)
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl">
  {/* Content */}
</div>
```

---

## 🔘 COMPOSANTS

### Boutons

```tsx
// components/ui/Button.tsx (référence complète)

// Primary (CTA principal)
<Button variant="primary" size="md">
  Créer un funnel
</Button>

// Secondary (Actions secondaires)
<Button variant="secondary" size="md">
  Annuler
</Button>

// Outline (Actions tertiaires)
<Button variant="outline" size="md">
  En savoir plus
</Button>

// Avec loading
<Button variant="primary" loading={isLoading}>
  {isLoading ? 'Envoi...' : 'Envoyer'}
</Button>

// Disabled
<Button variant="primary" disabled>
  Action indisponible
</Button>

// Full width (mobile)
<Button variant="primary" className="w-full sm:w-auto">
  Continuer
</Button>

// Avec icône
<Button variant="primary">
  <PlusIcon className="w-5 h-5 mr-2" />
  Nouveau
</Button>
```

### Inputs

```tsx
// Text input
<div className="space-y-2">
  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    Nom complet
  </label>
  <input
    type="text"
    id="name"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg
               focus:ring-2 focus:ring-brand-rose focus:border-transparent
               transition-all duration-200"
    placeholder="Jean Dupont"
  />
</div>

// Input avec erreur
<div className="space-y-2">
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <input
    type="email"
    id="email"
    className="w-full px-4 py-3 border-2 border-red-300 rounded-lg
               focus:ring-2 focus:ring-red-500 focus:border-transparent"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-red-600" role="alert">
    Format d'email invalide
  </p>
</div>

// Input avec icône
<div className="relative">
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    <SearchIcon className="h-5 w-5 text-gray-400" />
  </div>
  <input
    type="text"
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg"
    placeholder="Rechercher..."
  />
</div>
```

### Cards

```tsx
// Card basique
<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6
                hover:shadow-xl transition-shadow duration-300">
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    Titre de la carte
  </h3>
  <p className="text-gray-600">
    Description du contenu
  </p>
</div>

// Card clickable
<button className="w-full text-left bg-white rounded-xl shadow-lg border border-gray-100 p-6
                   hover:shadow-xl hover:border-brand-rose
                   transition-all duration-300 transform hover:scale-105">
  {/* Content */}
</button>

// Card avec image
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
  <img
    src="/image.jpg"
    alt="Description"
    className="w-full h-48 object-cover"
  />
  <div className="p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Titre
    </h3>
    <p className="text-gray-600">
      Description
    </p>
  </div>
</div>
```

### Modals

```tsx
// Modal avec backdrop
<div className="fixed inset-0 z-50 overflow-y-auto">
  {/* Backdrop */}
  <div
    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
    onClick={onClose}
  />

  {/* Modal */}
  <div className="flex min-h-screen items-center justify-center p-4">
    <div
      className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full p-6
                 transform transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">
          Titre du modal
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fermer"
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-600">
          Contenu du modal
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirmer
        </Button>
      </div>
    </div>
  </div>
</div>
```

### Toasts/Notifications

```tsx
// Success toast
<div className="fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in">
  <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <CheckCircleIcon className="h-6 w-6 text-green-500" />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          Succès !
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Votre funnel a été créé avec succès.
        </p>
      </div>
      <button className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600">
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  </div>
</div>

// Error toast
<div className="bg-red-50 border-l-4 border-red-500 p-4">
  <div className="flex">
    <AlertCircleIcon className="h-5 w-5 text-red-500" />
    <div className="ml-3">
      <p className="text-sm text-red-800">
        Une erreur est survenue. Veuillez réessayer.
      </p>
    </div>
  </div>
</div>
```

### Badges

```tsx
// Status badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                 bg-green-100 text-green-800">
  Publié
</span>

<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                 bg-yellow-100 text-yellow-800">
  Brouillon
</span>

<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                 bg-gray-100 text-gray-800">
  Archivé
</span>

// Count badge
<button className="relative">
  Notifications
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold
                   rounded-full h-5 w-5 flex items-center justify-center">
    3
  </span>
</button>
```

---

## 🎭 ANIMATIONS

### Principes

1. **Rapide** - 200-300ms maximum
2. **Subtil** - Pas de bounce excessif
3. **Purposeful** - Chaque animation a un but
4. **Performant** - Transform et opacity uniquement

### Transitions Basiques

```tsx
// Hover sur bouton
<button className="transform transition-all duration-200
                   hover:scale-105 active:scale-95
                   hover:shadow-lg">
  Hover me
</button>

// Hover sur card
<div className="transition-shadow duration-300
                hover:shadow-xl">
  {/* Card content */}
</div>

// Color transition
<div className="transition-colors duration-200
                hover:bg-brand-rose-dark">
  {/* Content */}
</div>

// Opacity transition
<div className="transition-opacity duration-300
                opacity-0 group-hover:opacity-100">
  {/* Revealed content */}
</div>
```

### Animations d'Entrée

```tsx
// Fade in
<div className="animate-fade-in">
  {/* Content */}
</div>

// Slide in from bottom
<div className="animate-slide-in">
  {/* Content */}
</div>

// tailwind.config.js
animation: {
  'fade-in': 'fadeIn 0.3s ease-out',
  'slide-in': 'slideIn 0.3s ease-out',
}

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideIn: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
}
```

### Loading States

```tsx
// Spinner
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-rose" />

// Pulse
<div className="animate-pulse bg-gray-200 rounded h-4 w-full" />

// Shimmer
<div className="animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
                bg-[length:200%_100%]">
  {/* Skeleton */}
</div>

// tailwind.config.js
keyframes: {
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
}
```

### Framer Motion (Recommandé pour animations complexes)

```bash
npm install framer-motion
```

```tsx
import { motion } from 'framer-motion';

// Fade + slide in
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>

// Stagger children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>

// Modal animation
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Modal */}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🎯 PATTERNS COMMUNS

### Hero Section

```tsx
<section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="text-center max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
        Créez des funnels qui convertissent
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8">
        Face2Face vous aide à transformer vos visiteurs en clients fidèles
        avec des funnels personnalisés et performants.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="primary" size="lg">
          Commencer gratuitement
        </Button>
        <Button variant="outline" size="lg">
          Voir une démo
        </Button>
      </div>
    </div>
  </div>
</section>
```

### Feature Grid

```tsx
<section className="py-16 sm:py-20 lg:py-24">
  <div className="container mx-auto px-4 max-w-7xl">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Fonctionnalités puissantes
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Tous les outils dont vous avez besoin pour réussir
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature) => (
        <div key={feature.id} className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16
                          bg-brand-rose rounded-xl mb-4">
            <feature.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Dashboard Layout

```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Logo />
        <nav className="hidden md:flex gap-6">
          <a href="/funnels" className="text-gray-700 hover:text-brand-rose">
            Funnels
          </a>
          <a href="/results" className="text-gray-700 hover:text-brand-rose">
            Résultats
          </a>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm">
          <PlusIcon className="w-4 h-4 mr-2" />
          Nouveau
        </Button>
        <UserMenu />
      </div>
    </div>
  </header>

  {/* Main content */}
  <main className="container mx-auto px-4 py-8 max-w-7xl">
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
          {/* Sidebar content */}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  </main>
</div>
```

---

## 📱 RESPONSIVE PATTERNS

### Navigation Mobile

```tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

<header className="bg-white border-b">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <Logo />

      {/* Desktop nav */}
      <nav className="hidden md:flex gap-6">
        <a href="/funnels">Funnels</a>
        <a href="/results">Résultats</a>
      </nav>

      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
      </button>
    </div>

    {/* Mobile menu */}
    {mobileMenuOpen && (
      <nav className="md:hidden py-4 border-t">
        <a href="/funnels" className="block py-2">Funnels</a>
        <a href="/results" className="block py-2">Résultats</a>
      </nav>
    )}
  </div>
</header>
```

### Responsive Table

```tsx
{/* Desktop: table, Mobile: cards */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left py-3 px-4">Nom</th>
        <th className="text-left py-3 px-4">Statut</th>
        <th className="text-left py-3 px-4">Créé</th>
      </tr>
    </thead>
    <tbody>
      {items.map(item => (
        <tr key={item.id} className="border-b hover:bg-gray-50">
          <td className="py-3 px-4">{item.name}</td>
          <td className="py-3 px-4">{item.status}</td>
          <td className="py-3 px-4">{item.created}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

<div className="md:hidden space-y-4">
  {items.map(item => (
    <div key={item.id} className="bg-white p-4 rounded-lg border">
      <div className="font-semibold mb-2">{item.name}</div>
      <div className="text-sm text-gray-600 space-y-1">
        <div>Statut: {item.status}</div>
        <div>Créé: {item.created}</div>
      </div>
    </div>
  ))}
</div>
```

---

## ♿ ACCESSIBILITÉ

### Focus Indicators

```tsx
// Toujours visible et clair
<button className="focus:outline-none focus:ring-2 focus:ring-brand-rose focus:ring-offset-2">
  Click me
</button>

// Custom focus
<a className="focus:outline-none focus:underline focus:decoration-2">
  Link
</a>
```

### Skip to Main Content

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
             bg-brand-rose text-white px-4 py-2 rounded-lg z-50"
>
  Aller au contenu principal
</a>

<main id="main-content">
  {/* Content */}
</main>
```

### Screen Reader Only Text

```tsx
<button>
  <TrashIcon className="w-5 h-5" />
  <span className="sr-only">Supprimer</span>
</button>

// Tailwind sr-only:
// .sr-only {
//   position: absolute;
//   width: 1px;
//   height: 1px;
//   padding: 0;
//   margin: -1px;
//   overflow: hidden;
//   clip: rect(0, 0, 0, 0);
//   white-space: nowrap;
//   border-width: 0;
// }
```

---

## 🚀 MISE EN PRATIQUE

### Checklist Avant Commit

- [ ] Couleurs de la palette uniquement
- [ ] Typographie Inter + Poppins
- [ ] Spacing échelle 8px
- [ ] Border radius cohérents
- [ ] Shadows cohérentes
- [ ] Responsive testé (320px, 768px, 1024px)
- [ ] Touch targets ≥ 44px
- [ ] Focus indicators visibles
- [ ] ARIA labels présents
- [ ] Animations ≤ 300ms
- [ ] Contraste ≥ 4.5:1

### Resources

- **Design Tokens:** `tailwind.config.js`
- **Composants UI:** `/components/ui/`
- **Exemples:** `/docs/ux-ui/examples/`
- **Storybook:** (à venir)

---

**Ce design system est vivant. Proposez des améliorations!** 🎨

*Dernière mise à jour: 2025-11-14*
