import { useAppStore } from '../stores/appStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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
        
        // Mise à jour des tokens dans le store
        useAppStore.getState().setTokens(newTokens.accessToken, newTokens.refreshToken);

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

export default apiFetch;
