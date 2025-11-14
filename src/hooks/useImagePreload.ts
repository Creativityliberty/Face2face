/**
 * useImagePreload Hook
 * UI-010: Preload des images critiques pour performance
 *
 * Features:
 * - Preload images avant render
 * - Track loading state
 * - Prevent layout shift
 */

import { useEffect, useState } from 'react';

interface UseImagePreloadResult {
  /**
   * True si l'image est chargée
   */
  loaded: boolean;

  /**
   * True si erreur de chargement
   */
  error: boolean;

  /**
   * URL de l'image (peut être fallback si erreur)
   */
  src: string;
}

/**
 * Preload une image et track son état de chargement
 *
 * @param src URL de l'image à preloader
 * @param fallbackSrc URL de l'image de fallback en cas d'erreur
 * @returns État de chargement et URL effective
 *
 * @example
 * ```tsx
 * function Avatar({ url }: { url: string }) {
 *   const { loaded, src } = useImagePreload(url, '/images/default-avatar.jpg');
 *
 *   return (
 *     <div className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}>
 *       <img src={src} alt="Avatar" />
 *     </div>
 *   );
 * }
 * ```
 */
export function useImagePreload(
  src: string,
  fallbackSrc?: string
): UseImagePreloadResult {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    // Reset state when src changes
    setLoaded(false);
    setError(false);
    setImageSrc(src);

    if (!src) {
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
      return;
    }

    // Create image element to preload
    const img = new Image();

    img.onload = () => {
      setLoaded(true);
    };

    img.onerror = () => {
      setError(true);
      if (fallbackSrc) {
        setImageSrc(fallbackSrc);
      }
    };

    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return { loaded, error, src: imageSrc };
}

/**
 * Preload multiple images
 *
 * @param urls Array d'URLs à preloader
 * @returns True quand toutes les images sont chargées
 *
 * @example
 * ```tsx
 * function Gallery({ images }: { images: string[] }) {
 *   const allLoaded = useImagePreloadMultiple(images);
 *
 *   if (!allLoaded) {
 *     return <Spinner />;
 *   }
 *
 *   return <div>{images.map(url => <img key={url} src={url} />)}</div>;
 * }
 * ```
 */
export function useImagePreloadMultiple(urls: string[]): boolean {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    setLoadedCount(0);

    if (!urls || urls.length === 0) return;

    const images: HTMLImageElement[] = [];

    urls.forEach((url) => {
      const img = new Image();

      img.onload = () => {
        setLoadedCount((prev) => prev + 1);
      };

      img.onerror = () => {
        // Still count as "loaded" to avoid infinite loading
        setLoadedCount((prev) => prev + 1);
      };

      img.src = url;
      images.push(img);
    });

    // Cleanup
    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);

  return loadedCount === urls.length;
}

/**
 * Lazy load image when element enters viewport (Intersection Observer)
 *
 * @param threshold Pourcentage de visibilité avant de charger (0-1)
 * @returns Ref à attacher à l'élément + URL à utiliser
 *
 * @example
 * ```tsx
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { ref, imageSrc } = useIntersectionLazyLoad(src);
 *
 *   return (
 *     <div ref={ref}>
 *       {imageSrc && <img src={imageSrc} alt={alt} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIntersectionLazyLoad(
  src: string,
  threshold = 0.1
): { ref: React.RefObject<HTMLDivElement>; imageSrc: string | null } {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const ref = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref || !('IntersectionObserver' in window)) {
      // Fallback: Load immediately if no IntersectionObserver
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref) {
      observer.observe(ref as unknown as Element);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, threshold]);

  return { ref: ref as unknown as React.RefObject<HTMLDivElement>, imageSrc };
}
