/**
 * OptimizedImage Component
 * UI-010: Image optimization avec lazy loading, WebP support, et responsive
 *
 * Features:
 * - Lazy loading natif (loading="lazy")
 * - WebP avec fallback JPEG/PNG
 * - Responsive avec srcset
 * - Placeholder blur pendant chargement
 * - Error handling avec fallback image
 */

import { useState, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /**
   * URL de l'image source (format original: jpg, png, etc.)
   */
  src: string;

  /**
   * URL de l'image WebP (optionnel)
   * Si non fourni, remplace automatiquement l'extension par .webp
   */
  webpSrc?: string;

  /**
   * Texte alternatif (OBLIGATOIRE pour accessibilité)
   */
  alt: string;

  /**
   * Largeurs responsive pour srcset (optionnel)
   * Exemple: [320, 640, 1024, 1920]
   */
  sizes?: number[];

  /**
   * Largeur native de l'image (pour aspect ratio)
   */
  width?: number;

  /**
   * Hauteur native de l'image (pour aspect ratio)
   */
  height?: number;

  /**
   * Image de fallback si erreur de chargement
   */
  fallbackSrc?: string;

  /**
   * Désactiver lazy loading (défaut: false)
   */
  eager?: boolean;

  /**
   * Classe CSS supplémentaire
   */
  className?: string;
}

/**
 * Génère l'URL WebP à partir de l'URL source
 */
function getWebpUrl(src: string, webpSrc?: string): string {
  if (webpSrc) return webpSrc;

  // Remplace l'extension par .webp
  return src.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
}

/**
 * Génère le srcset pour responsive
 */
function generateSrcSet(src: string, sizes?: number[]): string | undefined {
  if (!sizes || sizes.length === 0) return undefined;

  // Extrait l'URL de base et l'extension
  const lastDot = src.lastIndexOf('.');
  const base = src.substring(0, lastDot);
  const ext = src.substring(lastDot);

  // Génère le srcset (assume que le serveur génère des variantes avec suffix -320w, -640w, etc.)
  return sizes
    .map((width) => `${base}-${width}w${ext} ${width}w`)
    .join(', ');
}

export function OptimizedImage({
  src,
  webpSrc,
  alt,
  sizes,
  width,
  height,
  fallbackSrc = '/images/placeholder.jpg',
  eager = false,
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const webpUrl = getWebpUrl(src, webpSrc);
  const srcSet = generateSrcSet(src, sizes);
  const webpSrcSet = generateSrcSet(webpUrl, sizes);

  // Calcule le padding pour aspect ratio (evite layout shift)
  const aspectRatio = width && height ? (height / width) * 100 : undefined;

  const handleError = () => {
    if (!hasError) {
      console.warn(`Failed to load image: ${imgSrc}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <picture className={`optimized-image-wrapper ${className}`}>
      {/* WebP source */}
      {!hasError && (
        <source
          type="image/webp"
          srcSet={webpSrcSet || webpUrl}
          sizes={sizes ? sizes.map((w) => `(max-width: ${w}px) ${w}px`).join(', ') : undefined}
        />
      )}

      {/* Fallback JPEG/PNG source */}
      {!hasError && srcSet && (
        <source
          srcSet={srcSet}
          sizes={sizes ? sizes.map((w) => `(max-width: ${w}px) ${w}px`).join(', ') : undefined}
        />
      )}

      {/* Image element */}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        style={
          aspectRatio
            ? {
                aspectRatio: `${width} / ${height}`,
                objectFit: 'cover',
              }
            : undefined
        }
        {...props}
      />
    </picture>
  );
}

/**
 * Exemple d'utilisation:
 *
 * <OptimizedImage
 *   src="/uploads/photo.jpg"
 *   alt="Photo de profil"
 *   width={800}
 *   height={600}
 *   sizes={[320, 640, 1024]}
 *   className="rounded-lg"
 * />
 *
 * Génère:
 * <picture>
 *   <source type="image/webp" srcset="/uploads/photo-320w.webp 320w, /uploads/photo-640w.webp 640w, ..." />
 *   <source srcset="/uploads/photo-320w.jpg 320w, /uploads/photo-640w.jpg 640w, ..." />
 *   <img src="/uploads/photo.jpg" alt="Photo de profil" loading="lazy" ... />
 * </picture>
 */
