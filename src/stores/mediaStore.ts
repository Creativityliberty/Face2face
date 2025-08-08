// src/stores/mediaStore.ts – Zustand store for recent media
import { create } from 'zustand';
// Using native fetch instead of axios
// Media from UI only contains type & url, but the store keeps full DB record
interface MediaRecord {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  userId?: string;
  createdAt?: string;
}

// No need to import Media here; we only use MediaRecord for the store

interface MediaStore {
  mediaList: MediaRecord[];
  fetchRecent: () => Promise<void>;
  addMedia: (media: MediaRecord) => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  mediaList: [],
  fetchRecent: async () => {
    try {
      const response = await fetch('/api/media/recent');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: MediaRecord[] = await response.json();
      set({ mediaList: data });
    } catch (error) {
      // Silently fail when backend is not available
      // This prevents console spam and UI blocking
      console.warn('Backend not available, using local media only');
      set({ mediaList: [] });
    }
  },
  addMedia: (media) => set((state) => ({ mediaList: [media, ...state.mediaList] })),
}));
