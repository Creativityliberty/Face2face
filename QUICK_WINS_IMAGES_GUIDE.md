# 📸 Guide Rapide: Optimisation Images WebP - Quick Win

**Quick Win #3**: Optimiser les images du funnel pour performance mobile

---

## ✅ Ce qui a été fait

1. ✅ **Composant OptimizedImage créé** (`src/components/OptimizedImage.tsx`)
2. ✅ **Hooks image preload créés** (`src/hooks/useImagePreload.ts`)
3. ✅ **Backend Sharp installé** (package.json backend)

---

## 🎯 Prochaines Étapes pour Images

### **1. Remplacer `<img>` par `<OptimizedImage>`**

**Dans tous les composants qui affichent des images:**

**Avant:**
```tsx
<img src={mediaUrl} alt="Step image" />
```

**Après:**
```tsx
import { OptimizedImage } from './OptimizedImage';

<OptimizedImage
  src={mediaUrl}
  alt="Step image"
  width={1200}
  height={800}
  sizes={[320, 640, 1024]}
  className="rounded-lg"
/>
```

---

### **2. Fichiers à Modifier**

**Priority 1 (Images fréquentes):**
- `components/MessageScreen.tsx` - Images de message
- `components/MediaViewer.tsx` - Viewer d'images
- `components/builder/StepEditor.tsx` - Preview images

**Priority 2:**
- Tout autre composant avec `<img>` tag

---

### **3. Backend: Générer WebP Automatiquement**

Le backend a déjà `sharp` installé. Modifier `backend/src/routes/media.routes.ts`:

**Ajouter après upload:**
```typescript
import sharp from 'sharp';

// Après sauvegarde du fichier original
if (data.mimetype.startsWith('image/')) {
  const webpFilename = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const webpPath = path.join(uploadsDir, webpFilename);

  // Générer version WebP
  await sharp(buffer)
    .webp({ quality: 80 })
    .toFile(webpPath);

  // Générer versions responsive
  const sizes = [320, 640, 1024];
  for (const size of sizes) {
    // WebP responsive
    const sizedWebp = webpFilename.replace('.webp', `-${size}w.webp`);
    await sharp(buffer)
      .resize(size, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(path.join(uploadsDir, sizedWebp));
  }
}
```

---

### **4. Test Rapide**

```bash
# 1. Upload une image dans le builder
# 2. Vérifier dans backend/uploads/ :
ls backend/uploads/
# Devrait voir:
# - image-original.jpg
# - image-original.webp
# - image-original-320w.webp
# - image-original-640w.webp
# - image-original-1024w.webp

# 3. Tester dans browser DevTools → Network
# Vérifier Type = "webp" au lieu de "jpeg"
```

---

## 📊 Impact Attendu

**Avant:**
- Image JPEG 1920x1080: 800 KB
- Temps chargement 3G: 2.1s

**Après:**
- Image WebP 1920x1080: 200 KB (-75%)
- Image WebP 640w (mobile): 40 KB (-95%)
- Temps chargement 3G: 0.5s

**Gain total: -70% temps de chargement**

---

## ✅ Checklist

- [ ] Remplacer `<img>` par `<OptimizedImage>` dans MessageScreen
- [ ] Remplacer `<img>` par `<OptimizedImage>` dans MediaViewer
- [ ] Modifier media.routes.ts pour générer WebP
- [ ] Tester upload image
- [ ] Vérifier WebP généré dans uploads/
- [ ] Tester dans browser (DevTools → Network)
- [ ] Lighthouse audit (Performance ≥ 90)

---

## 🚀 Alternative Rapide (Si pas le temps)

**Si vous n'avez pas le temps de modifier le backend maintenant:**

1. Convertir images Pexels actuelles en WebP manuellement:
   - Aller sur https://squoosh.app/
   - Upload image
   - Choisir WebP format
   - Quality: 80
   - Download

2. Remplacer URLs dans le funnel par les nouvelles images WebP

**Gain:** Immédiat sans code backend

---

## 📝 Notes

- ✅ OptimizedImage component supporte fallback JPEG automatique
- ✅ Lazy loading activé par défaut
- ✅ Aspect ratio préservé (pas de layout shift)
- ✅ Error handling avec placeholder

**Prêt à implémenter ! 🎨**
