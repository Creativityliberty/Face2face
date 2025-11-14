# Checklist Qualité UX/UI - Face2Face

Cette checklist doit être complétée pour **chaque feature** avant de la considérer comme terminée.

---

## 🎨 DESIGN VISUEL

### Couleurs
- [ ] Utilise uniquement les couleurs de la palette brand
- [ ] Respecte les couleurs sémantiques (success, warning, error, info)
- [ ] Pas de couleurs hardcodées (ex: #ff0000)
- [ ] Contraste texte/background ≥ 4.5:1
- [ ] Contraste éléments UI/background ≥ 3:1

### Typographie
- [ ] Police Poppins pour headings (h1, h2, h3)
- [ ] Police Inter pour body text
- [ ] Tailles de texte responsive (clamp ou breakpoints)
- [ ] Line-height adapté (1.2 headings, 1.6 body)
- [ ] Font-weight cohérent (700 h1, 600 h2-h3, 400 body)

### Spacing
- [ ] Utilise l'échelle 8px (4px, 8px, 16px, 24px, 32px...)
- [ ] Spacing cohérent entre éléments similaires
- [ ] Pas de valeurs arbitraires (ex: padding: 13px)
- [ ] Responsive spacing (plus petit sur mobile)

### Borders & Shadows
- [ ] Border-radius de la scale (6px, 8px, 12px, 16px, 24px)
- [ ] Shadows de la scale (sm, md, lg, xl, 2xl)
- [ ] Pas de borders ou shadows custom

---

## 📱 RESPONSIVE DESIGN

### Mobile (320px - 639px)
- [ ] Layout fonctionne parfaitement à 320px
- [ ] Texte lisible sans zoom
- [ ] Boutons minimum 44x44px (touch-friendly)
- [ ] Pas de scroll horizontal
- [ ] Images adaptées (srcset)
- [ ] Navigation simplifiée (menu hamburger si nécessaire)

### Tablet (640px - 1023px)
- [ ] Layout adapté (2 colonnes au lieu de 1)
- [ ] Spacing augmenté vs mobile
- [ ] Images taille intermédiaire
- [ ] Navigation optimisée

### Desktop (1024px+)
- [ ] Layout pleine largeur avec max-width
- [ ] Multi-colonnes si pertinent
- [ ] Hover states visibles
- [ ] Navigation complète visible

### Tests
- [ ] Testé Chrome DevTools responsive mode (320px, 375px, 768px, 1024px, 1440px)
- [ ] Testé sur vrai mobile si possible
- [ ] Testé orientation portrait et landscape
- [ ] Pas de breakage entre breakpoints

---

## ♿ ACCESSIBILITÉ (WCAG 2.1 AA)

### Clavier
- [ ] Tous les éléments interactifs accessibles au Tab
- [ ] Ordre de tab logique
- [ ] Enter/Space activent les boutons
- [ ] Esc ferme les modals
- [ ] Focus visible (ring de 2px minimum)
- [ ] Focus trap dans modals/dialogs

### Screen Readers
- [ ] Headings hiérarchie correcte (h1 → h2 → h3)
- [ ] ARIA labels sur boutons icônes
- [ ] ARIA labels sur inputs
- [ ] ARIA live regions pour changements dynamiques
- [ ] ARIA invalid sur erreurs de formulaire
- [ ] Alt text descriptif sur images

### Navigation
- [ ] Landmarks ARIA (header, nav, main, aside, footer)
- [ ] Skip to main content link
- [ ] Breadcrumbs si navigation profonde

### États
- [ ] aria-disabled sur éléments désactivés
- [ ] aria-busy sur chargements
- [ ] aria-expanded sur accordéons
- [ ] aria-checked sur checkboxes/radios
- [ ] role="alert" sur erreurs

### Test
- [ ] Testé navigation clavier complète
- [ ] Testé avec screen reader (VoiceOver macOS ou NVDA Windows)
- [ ] Lighthouse accessibility score ≥ 95

---

## ⚡ PERFORMANCE

### Images
- [ ] Format moderne (WebP avec fallback)
- [ ] Tailles optimisées (< 200kb)
- [ ] srcset avec différentes résolutions
- [ ] Lazy loading (loading="lazy")
- [ ] Width & height définis (évite CLS)
- [ ] Alt text présent

### Animations
- [ ] Uniquement transform et opacity (GPU-accelerated)
- [ ] Durée ≤ 300ms
- [ ] Ease-out pour naturel
- [ ] Pas d'animations pendant scroll (janky)
- [ ] prefers-reduced-motion respecté

### Code
- [ ] Pas de re-renders inutiles (React.memo si besoin)
- [ ] Debounce sur inputs avec recherche
- [ ] Lazy loading des routes (React.lazy)
- [ ] Code splitting si bundle > 500kb
- [ ] Aucun console.log, console.error en prod

### Lighthouse
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90

---

## 🎭 ÉTATS UI

### Loading
- [ ] Skeleton loader ou spinner présent
- [ ] Texte "Chargement..." pour screen readers
- [ ] Boutons disabled avec loading state
- [ ] Pas de flash de contenu vide
- [ ] Durée minimale 300ms (évite flash)

### Success
- [ ] Message de succès clair et visible
- [ ] Toast notification ou alert
- [ ] Auto-dismiss après 3-5s (sauf si action requise)
- [ ] Icône de succès (CheckCircle)
- [ ] Couleur verte (success)

### Error
- [ ] Message d'erreur explicite et utile
- [ ] Pas de jargon technique
- [ ] Action suggérée ("Réessayer", "Contacter support")
- [ ] Icône d'erreur (AlertCircle)
- [ ] Couleur rouge (error)
- [ ] aria-invalid sur champs de formulaire

### Empty
- [ ] État vide géré (pas de page blanche)
- [ ] Illustration ou icône
- [ ] Message explicatif
- [ ] CTA pour créer premier élément
- [ ] Suggestions si pertinent

### Disabled
- [ ] Opacité réduite (50%)
- [ ] Cursor not-allowed
- [ ] Tooltip expliquant pourquoi si pertinent
- [ ] aria-disabled="true"

---

## 📝 FORMULAIRES

### Inputs
- [ ] Label visible associé (for/id)
- [ ] Placeholder informatif (pas le label)
- [ ] Type approprié (email, tel, number, etc.)
- [ ] Autocomplete activé (name, email, etc.)
- [ ] Taille adaptée (min-h-44px sur mobile)
- [ ] Focus state visible
- [ ] Error state distinct

### Validation
- [ ] Validation client-side immédiate
- [ ] Messages d'erreur spécifiques
- [ ] Erreurs affichées sous le champ
- [ ] aria-invalid sur erreur
- [ ] aria-describedby liant erreur au champ
- [ ] Validation backend aussi (sécurité)

### Submit
- [ ] Bouton submit désactivé si formulaire invalide
- [ ] Loading state pendant soumission
- [ ] Prévention double-submit
- [ ] Success feedback après soumission
- [ ] Error handling gracieux
- [ ] Données préservées si erreur

### UX
- [ ] Autofocus sur premier champ si pertinent
- [ ] Enter soumet le formulaire
- [ ] Tab ordre logique
- [ ] Champs obligatoires marqués (*)
- [ ] Format attendu indiqué (ex: email@example.com)

---

## 🧩 COMPOSANTS

### Boutons
- [ ] Variant approprié (primary, secondary, outline)
- [ ] Size responsive (sm sur mobile, md/lg sur desktop)
- [ ] Loading state géré
- [ ] Disabled state géré
- [ ] Icon + text (pas icon seul sauf si aria-label)
- [ ] Min-height 44px sur mobile

### Cards
- [ ] Border radius cohérent (lg ou xl)
- [ ] Shadow appropriée (md ou lg)
- [ ] Padding cohérent (p-6 ou p-8)
- [ ] Hover state si clickable
- [ ] Pas de carte vide

### Modals
- [ ] Backdrop semi-transparent
- [ ] Animation d'entrée/sortie
- [ ] Esc pour fermer
- [ ] Click outside pour fermer
- [ ] Focus trap actif
- [ ] aria-modal="true"
- [ ] Scroll désactivé sur body

### Tooltips
- [ ] Délai avant apparition (300ms)
- [ ] Texte concis
- [ ] Contraste suffisant
- [ ] Position adaptée (pas coupé)
- [ ] Accessible clavier (focus)

### Dropdowns
- [ ] Animation fluide
- [ ] Keyboard navigation (arrows)
- [ ] Esc pour fermer
- [ ] Click outside pour fermer
- [ ] Item sélectionné visible
- [ ] aria-expanded géré

---

## 🔧 BACKEND COHÉRENCE

### API Calls
- [ ] Loading state pendant call
- [ ] Error handling avec try/catch
- [ ] Retry automatique sur erreur réseau (3 fois)
- [ ] Timeout configuré (30s max)
- [ ] Success feedback à l'utilisateur
- [ ] Error message user-friendly

### Response Format
- [ ] Format standard utilisé (success/error)
- [ ] Codes d'erreur explicites
- [ ] Messages d'erreur traduits
- [ ] Metadata incluse si pagination

### Error Handling
- [ ] Erreurs réseau gérées
- [ ] Erreurs validation gérées
- [ ] Erreurs serveur gérées
- [ ] Erreurs timeout gérées
- [ ] Fallback UI si erreur critique

### State Management
- [ ] État global cohérent (Zustand)
- [ ] Pas de duplication de state
- [ ] Optimistic updates si pertinent
- [ ] Rollback si erreur

---

## 🎯 UX PATTERNS

### Navigation
- [ ] Fil d'Ariane si profondeur > 2
- [ ] Bouton retour visible
- [ ] Menu actif highlighted
- [ ] Transitions page fluides
- [ ] URL mise à jour

### Feedback
- [ ] Action confirmée visuellement (toast, modal)
- [ ] Changements sauvegardés automatiquement OU bouton save
- [ ] Indication "Non sauvegardé" si changements pending
- [ ] Confirmation avant actions destructives

### Search
- [ ] Debounce 300ms minimum
- [ ] Loading pendant recherche
- [ ] Results en temps réel
- [ ] Empty state si aucun résultat
- [ ] Suggestions si pertinent

### Pagination
- [ ] Page courante visible
- [ ] Total pages indiqué
- [ ] Navigation prev/next
- [ ] Jump to page si > 10 pages
- [ ] Limite par page configurable

---

## 📊 ANALYTICS & MONITORING

### Tracking
- [ ] Événements clés trackés
- [ ] Erreurs loggées (Sentry)
- [ ] Performance monitorée
- [ ] Conversions trackées

### SEO (si applicable)
- [ ] Title unique et descriptif
- [ ] Meta description
- [ ] Open Graph tags
- [ ] Schema.org markup
- [ ] Sitemap à jour

---

## ✅ VALIDATION FINALE

### Auto-Review
- [ ] J'ai relu mon code ligne par ligne
- [ ] J'ai testé tous les cas d'usage
- [ ] J'ai testé les edge cases
- [ ] J'ai vérifié la console (0 erreurs/warnings)

### Tests Multi-Device
- [ ] Chrome Desktop (1920x1080)
- [ ] Chrome Mobile (375x667 iPhone)
- [ ] Chrome Tablet (768x1024 iPad)
- [ ] Safari Desktop
- [ ] Safari Mobile (iPhone réel si possible)
- [ ] Firefox Desktop

### Tests Accessibilité
- [ ] Navigation clavier complète
- [ ] Screen reader test (1 page minimum)
- [ ] Lighthouse accessibility ≥ 95
- [ ] Contraste vérifié (WebAIM)

### Tests Performance
- [ ] Lighthouse performance ≥ 90
- [ ] Animations 60fps
- [ ] Pas de lag au scroll
- [ ] Chargement initial < 3s

### Code Quality
- [ ] TypeScript 0 erreurs
- [ ] ESLint 0 warnings
- [ ] Prettier appliqué
- [ ] Imports organisés
- [ ] Pas de code mort

### Documentation
- [ ] Props TypeScript documentées
- [ ] Cas d'usage complexes commentés
- [ ] README mis à jour si nouveau composant
- [ ] CHANGELOG mis à jour

---

## 🏆 SCORE FINAL

Calculer le score de qualité:

```
Total checks complétés / Total checks = Score %

≥ 95% = Excellent ✨
90-94% = Très bon ✅
80-89% = Bon 👍
70-79% = Acceptable ⚠️
< 70% = À améliorer ❌
```

**Objectif: ≥ 95% pour chaque feature**

---

## 🎯 CHECKLIST PAR TYPE DE FEATURE

### Page Complète
Sections à vérifier:
- [ ] Design visuel (25 checks)
- [ ] Responsive (13 checks)
- [ ] Accessibilité (23 checks)
- [ ] Performance (17 checks)
- [ ] États UI (22 checks)
- [ ] UX Patterns (11 checks)
- [ ] Validation finale (22 checks)

**Total: 133 checks**

### Composant Réutilisable
Sections à vérifier:
- [ ] Design visuel (25 checks)
- [ ] Responsive (13 checks)
- [ ] Accessibilité (23 checks)
- [ ] Performance (10 checks)
- [ ] États UI (15 checks)
- [ ] Composants (selon type)
- [ ] Code Quality (6 checks)

**Total: ~100 checks**

### Feature Backend
Sections à vérifier:
- [ ] Backend cohérence (15 checks)
- [ ] Performance backend (5 checks)
- [ ] Error handling (5 checks)
- [ ] Security (10 checks)
- [ ] Tests (5 checks)
- [ ] Documentation (3 checks)

**Total: 43 checks**

---

## 📝 TEMPLATE ISSUE/PR

Copier dans la description de chaque PR:

```markdown
## Checklist Qualité UX/UI

### Design
- [ ] Palette de couleurs respectée
- [ ] Typographie cohérente
- [ ] Spacing échelle 8px

### Responsive
- [ ] Testé 320px, 768px, 1024px
- [ ] Touch targets ≥ 44px
- [ ] Pas de scroll horizontal

### Accessibilité
- [ ] Navigation clavier OK
- [ ] ARIA labels présents
- [ ] Contraste ≥ 4.5:1

### Performance
- [ ] Lighthouse ≥ 90
- [ ] Images optimisées
- [ ] Animations fluides

### États
- [ ] Loading states
- [ ] Error handling
- [ ] Empty states
- [ ] Success feedback

### Tests
- [ ] Chrome Desktop
- [ ] Safari Mobile
- [ ] Screen reader test

**Score: __/100 checks complétés**
```

---

## 🔄 PROCESS D'AMÉLIORATION CONTINUE

### Hebdomadaire
- [ ] Auditer 1 page avec cette checklist
- [ ] Fixer les items < 90%
- [ ] Documenter patterns découverts

### Mensuel
- [ ] Lighthouse audit complet
- [ ] Accessibility audit complet
- [ ] Performance budget review
- [ ] Design system update si besoin

### Trimestriel
- [ ] User testing session
- [ ] Analytics review
- [ ] Competitors analysis
- [ ] Checklist update

---

**Utilise cette checklist systématiquement. La qualité n'est pas négociable. 🎯**

*Dernière mise à jour: 2025-11-14*
