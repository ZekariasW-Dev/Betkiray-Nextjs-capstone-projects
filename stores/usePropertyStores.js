'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useFavoritesStore = create(persist(
  (set) => ({
    ids: [],
    toggle: (id) => set((state) => ({ ids: state.ids.includes(id) ? state.ids.filter(item => item !== id) : [...state.ids, id] })),
    clear: () => set({ ids: [] })
  }),
  { name: 'rentwise-favorites', storage: createJSONStorage(() => localStorage), skipHydration: true }
));

export const useComparisonStore = create(persist(
  (set) => ({
    ids: [],
    toggle: (id) => set((state) => ({ ids: state.ids.includes(id) ? state.ids.filter(item => item !== id) : state.ids.length < 4 ? [...state.ids, id] : state.ids })),
    remove: (id) => set((state) => ({ ids: state.ids.filter(item => item !== id) })),
    clear: () => set({ ids: [] })
  }),
  { name: 'rentwise-comparison', storage: createJSONStorage(() => localStorage), skipHydration: true }
));
