import { useAppStore } from '../stores/appStore';

const RAW_API_BASE = (import.meta.env.VITE_API_URL as string | undefined);

// Normalisation de la base URL API pour éviter les 404 en prod
// - Si vide: '/api' (utilise le proxy Vite en dev)
// - Si absolue (http/https) et ne termine pas par '/api': on ajoute '/api'
// - Si relative et ne commence pas par '/api': on force '/api'
function normalizeApiBase(raw?: string): string {
  if (!raw || raw.trim() === '') return '/api';
  let base = raw.trim();
  // retirer les slashs finaux
  while (base.length > 1 && base.endsWith('/')) base = base.slice(0, -1);
  const isAbsolute = /^https?:\/\//i.test(base);
  if (isAbsolute) {
    if (!/\/api$/i.test(base)) base = `${base}/api`;
    return base;
  }
  // chemins relatifs
  if (!base.startsWith('/')) base = `/${base}`;
  if (!/^\/api(\/|$)?/i.test(base)) base = '/api';
  return base;
}

const API_BASE_URL = normalizeApiBase(RAW_API_BASE);

// Fonction pour récupérer les tokens depuis le store Zustand
const getTokens = () => {
  try {
    const state = useAppStore.getState();
    return {
      accessToken: state?.accessToken || null,
      refreshToken: state?.refreshToken || null
    };
  } catch (error) {
    console.warn('Error accessing tokens from store:', error);
    return {
      accessToken: null,
      refreshToken: null
    };
  }
};

// Fonction wrapper pour les appels fetch
const apiFetch = async (url: string, options: RequestInit = {}) => {
  let { accessToken } = getTokens();

  const headers = new Headers(options.headers || {});
  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }
  headers.append('Content-Type', 'application/json');

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Si le token a expiré (401) et qu'on a un refresh token, on tente de le rafraîchir
  if (response.status === 401) {
    const { refreshToken } = getTokens();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        const newTokens = await refreshResponse.json();
        
        // Mise à jour des tokens dans le store (fallback refreshToken si non renvoyé par le backend)
        const state = useAppStore.getState();
        const existingRefresh = state?.refreshToken || null;
        const nextRefresh = newTokens.refreshToken || existingRefresh;
        state.setTokens(newTokens.accessToken, nextRefresh as string);

        // On réessaye la requête originale avec le nouveau token
        headers.set('Authorization', `Bearer ${newTokens.accessToken}`);
        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        });

      } catch (error) {
        console.error('Session expired. Please log in again.', error);
        // Si le refresh échoue, on déconnecte l'utilisateur
        useAppStore.getState().logout();
        // On redirige vers la page de connexion ou on affiche un message
        window.location.href = '/login'; 
        return Promise.reject('Session expired');
      }
    }
  }

  return response;
};

/**
 * Generate a quiz funnel from a text prompt using the backend AI proxy.
 * This keeps the Gemini API key secure on the server.
 *
 * @param prompt - Text description of the funnel to generate
 * @param model - Gemini model to use (default: gemini-2.5-pro)
 * @returns QuizConfig object
 * @throws Error if generation fails
 */
export async function generateFunnelFromBackend(
  prompt: string,
  model: 'gemini-2.5-pro' | 'gemini-2.5-flash' = 'gemini-2.5-pro'
): Promise<import('../types').QuizConfig> {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  const response = await apiFetch('/ai/generate-funnel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt, model })
  });

  if (!response.ok) {
    let errorMessage = 'Failed to generate funnel. Please try again.';

    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // If we can't parse error JSON, use default message
    }

    throw new Error(errorMessage);
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error('Invalid response from server');
  }

  return result.data;
}

export default apiFetch;
