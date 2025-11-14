# Documentation UX/UI - Face2Face

Bienvenue dans la documentation complète UX/UI de Face2Face!

---

## 📚 Vue d'Ensemble

Cette documentation garantit que chaque pixel de Face2Face respecte les plus hauts standards de design, d'ergonomie et d'accessibilité.

### Objectifs

✨ **Magnifique** - Interface visuellement plaisante
🎯 **Ergonomique** - Intuitive sans instructions
📱 **Responsive** - Parfaite sur tous les appareils
♿ **Accessible** - Utilisable par tous (WCAG 2.1 AA)
⚡ **Performante** - Rapide et fluide
🧩 **Cohérente** - Design system unifié

---

## 📄 Documents

### 1. Agent UX/UI Mission
**Fichier:** `/.clinerules/ux-ui-agent-mission.md`

**Description:** Prompt complet pour l'agent IA responsable de l'UX/UI

**Contenu:**
- Mission et responsabilités
- Design system complet (couleurs, typographie, spacing)
- Règles responsive design
- Guidelines accessibilité
- Patterns d'animations
- Cohérence backend
- Critères de succès

**Utilisation:**
```bash
# L'agent IA lit automatiquement ce fichier
# Vous pouvez aussi le consulter pour comprendre les standards
```

---

### 2. Checklist Qualité
**Fichier:** `/docs/ux-ui/QUALITY_CHECKLIST.md`

**Description:** Checklist exhaustive à compléter pour chaque feature

**Sections:**
- Design visuel (25 checks)
- Responsive design (13 checks)
- Accessibilité (23 checks)
- Performance (17 checks)
- États UI (22 checks)
- Formulaires (15 checks)
- Composants (variable)
- Backend cohérence (15 checks)

**Total:** ~150 checks selon le type de feature

**Utilisation:**
```markdown
Avant chaque commit:
1. Ouvrir QUALITY_CHECKLIST.md
2. Vérifier section par section
3. Calculer le score (checks complétés / total)
4. Objectif: ≥ 95%
```

**Template PR:**
```markdown
## Checklist Qualité UX/UI
- [ ] Design visuel (25/25)
- [ ] Responsive (13/13)
- [ ] Accessibilité (23/23)
- [ ] Performance (17/17)
- [ ] États UI (22/22)

**Score: 100/100** ✅
```

---

### 3. Design Guidelines
**Fichier:** `/docs/ux-ui/DESIGN_GUIDELINES.md`

**Description:** Guide pratique du Design System avec exemples de code

**Contenu:**
- Palette de couleurs (avec codes hex)
- Typographie (Inter + Poppins)
- Spacing system (échelle 8px)
- Composants UI (Button, Input, Card, Modal, etc.)
- Animations et transitions
- Patterns communs (Hero, Feature Grid, Dashboard)
- Patterns responsive
- Accessibilité pratique

**Utilisation:**
```tsx
// Copier-coller les exemples de code
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  Mon bouton
</Button>
```

---

## 🎨 Design System

### Palette de Couleurs

```
Brand:
• Rose:       #A97C7C  (Primary CTA)
• Rose Dark:  #8B6B6B  (Hover states)
• Beige:      #D9CFC4  (Backgrounds)
• Maroon:     #A11D1F  (Accents)
• Text:       #374151  (Body text)

Sémantiques:
• Success:    #10B981
• Warning:    #F59E0B
• Error:      #EF4444
• Info:       #3B82F6

Neutrals:
• Gray 50-900 (Tailwind standard)
```

### Typographie

```
Headings: Poppins (600-700)
Body:     Inter (400-600)

Scale:
• H1: 48-64px
• H2: 30-36px
• H3: 24-30px
• Body: 16-18px
• Small: 14px
```

### Spacing

```
Base 8px:
• xs:  4px
• sm:  8px
• md:  16px
• lg:  24px
• xl:  32px
• 2xl: 48px
• 3xl: 64px
```

### Composants

✅ **Disponibles:**
- Button (primary, secondary, outline)
- Input (text, email, password, etc.)
- Card
- Modal
- Toast
- Badge
- Spinner / Skeleton loader

📝 **À créer:**
- Dropdown
- Tabs
- Accordion
- Pagination
- Breadcrumbs

---

## 📱 Responsive Breakpoints

```javascript
{
  xs: '320px',    // Mobile portrait
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Extra large
}
```

### Stratégie

**Mobile First**
```tsx
// Default = Mobile
<div className="p-4 sm:p-6 lg:p-8">

// Grilles responsive
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// Typographie fluide
<h1 className="text-3xl sm:text-4xl lg:text-5xl">
```

### Touch Targets

```
Minimum: 44x44px (iOS HIG)

<button className="min-h-[44px] px-6">
```

---

## ♿ Accessibilité

### Standards

**WCAG 2.1 Level AA**
- Contraste texte ≥ 4.5:1
- Navigation clavier complète
- ARIA labels présents
- Screen reader compatible
- Focus indicators visibles

### Outils de Test

- **Lighthouse:** Chrome DevTools (⌘+Shift+C → Lighthouse)
- **Contraste:** https://webaim.org/resources/contrastchecker/
- **Screen Reader:** VoiceOver (macOS) ou NVDA (Windows)

### Checklist Rapide

```tsx
// ✅ Bon
<button aria-label="Fermer" className="focus:ring-2">
  <XIcon />
</button>

// ❌ Mauvais
<div onclick="close()">
  X
</div>
```

---

## ⚡ Performance

### Objectifs Lighthouse

```
Performance:     ≥ 90
Accessibility:   ≥ 95
Best Practices:  ≥ 90
SEO:             ≥ 90
```

### Bonnes Pratiques

**Images:**
```tsx
<img
  src="/image.jpg"
  srcSet="/image-320w.jpg 320w, /image-640w.jpg 640w"
  sizes="(max-width: 640px) 100vw, 50vw"
  loading="lazy"
  width="640"
  height="480"
  alt="Description"
/>
```

**Animations:**
```tsx
// ✅ Performant (GPU-accelerated)
<div className="transform transition-transform hover:scale-105">

// ❌ Janky (CPU)
<div className="transition-all hover:w-full hover:h-full">
```

**Code Splitting:**
```tsx
const Dashboard = lazy(() => import('./Dashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

---

## 🔧 Workflow

### 1. Design

**Avant de coder:**
- [ ] Sketcher le layout (mobile → desktop)
- [ ] Définir les états (normal, hover, loading, error)
- [ ] Vérifier cohérence avec existant
- [ ] Consulter DESIGN_GUIDELINES.md

### 2. Développement

**Pendant le code:**
- [ ] Utiliser composants UI existants
- [ ] Respecter design system (couleurs, spacing, etc.)
- [ ] Mobile first (commencer par 320px)
- [ ] Ajouter loading/error states
- [ ] ARIA labels si nécessaire

### 3. Tests

**Avant commit:**
- [ ] Test Chrome DevTools responsive (320px, 768px, 1024px)
- [ ] Test navigation clavier (Tab, Enter, Esc)
- [ ] Test screen reader (au moins 1 fois)
- [ ] Lighthouse audit (score ≥ 90)
- [ ] Compléter QUALITY_CHECKLIST.md

### 4. Review

**Code review:**
- [ ] Design system respecté?
- [ ] Responsive fonctionne?
- [ ] Accessibilité OK?
- [ ] Performance OK?
- [ ] Code propre et commenté?

---

## 🎯 Exemples Rapides

### Page Complète

```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex gap-6">
            <a href="/">Accueil</a>
            <a href="/funnels">Funnels</a>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Mes Funnels
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {funnels.map(funnel => (
            <Card key={funnel.id}>
              <h3 className="text-xl font-semibold mb-2">
                {funnel.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {funnel.description}
              </p>
              <Button variant="outline" className="w-full">
                Voir le funnel
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
```

### Formulaire

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export default function MyForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.subscribe(email);
      toast.success('Inscription réussie!');
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Adresse email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-brand-rose focus:border-transparent"
          placeholder="vous@example.com"
          required
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
        />
        {error && (
          <p id="email-error" className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      <Button variant="primary" type="submit" loading={loading} className="w-full">
        {loading ? 'Envoi...' : "S'inscrire"}
      </Button>
    </form>
  );
}
```

---

## 🚀 Commencer Rapidement

### Nouveau Composant

1. **Copier un composant similaire** de `/components/ui/`
2. **Adapter** selon vos besoins
3. **Respecter** le design system (couleurs, spacing, etc.)
4. **Tester** responsive + accessibilité
5. **Documenter** les props TypeScript

### Nouvelle Page

1. **Utiliser** les layouts existants
2. **Réutiliser** les composants UI
3. **Suivre** les patterns de DESIGN_GUIDELINES.md
4. **Compléter** QUALITY_CHECKLIST.md avant commit

### Debug UX

**Problème de design?**
→ Consulter DESIGN_GUIDELINES.md

**Problème responsive?**
→ Tester Chrome DevTools responsive mode

**Problème accessibilité?**
→ Run Lighthouse, fix warnings

**Problème performance?**
→ Run Lighthouse, check animations

---

## 📞 Support

### Questions?

1. **Chercher** dans cette documentation
2. **Consulter** les composants existants (`/components/ui/`)
3. **Demander** sur #design-system (Slack)

### Proposer une Amélioration

```markdown
# Nouvelle proposition

**Problème:** [Décrire le problème actuel]
**Solution:** [Votre proposition]
**Exemple:** [Code ou screenshot]
**Impact:** [Qui est affecté?]
```

---

## ✅ Checklist Démarrage

Pour bien démarrer avec le Design System:

- [ ] Lire ce README
- [ ] Parcourir DESIGN_GUIDELINES.md
- [ ] Consulter QUALITY_CHECKLIST.md
- [ ] Explorer `/components/ui/`
- [ ] Tester les composants existants
- [ ] Faire un petit exercice (créer un bouton custom)
- [ ] Installer extensions VS Code recommandées:
  - [ ] Tailwind CSS IntelliSense
  - [ ] ESLint
  - [ ] Prettier

---

## 📊 Métriques de Succès

### Objectifs Q1 2025

- [ ] 100% des pages Lighthouse ≥ 90
- [ ] 100% des composants accessibles (WCAG AA)
- [ ] 0 couleur hors palette
- [ ] 0 style inline dans JSX
- [ ] Design system documenté à 100%
- [ ] Storybook avec tous les composants

### Tracking

```bash
# Audit Lighthouse de toutes les pages
npm run lighthouse:audit

# Accessibility scan
npm run a11y:check

# Design system conformité
npm run design:lint
```

---

## 🎉 Conclusion

**Avec cette documentation, vous avez tout pour créer une UX magnifique et accessible!**

### Règles d'Or

1. ✨ **Mobile First** - Toujours commencer par 320px
2. 🎨 **Design System** - Respecter couleurs, typo, spacing
3. ♿ **Accessibilité** - Navigation clavier + ARIA labels
4. ⚡ **Performance** - Transform/opacity pour animations
5. 📋 **Checklist** - Compléter avant chaque commit

---

**Questions? Ouvrir une issue ou contacter l'équipe Design!**

*Dernière mise à jour: 2025-11-14*
