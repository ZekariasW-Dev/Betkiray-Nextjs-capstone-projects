'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { properties } from '../lib/data.js';

export const useOwnerListingsStore = create(persist((set, get) => ({
  listings: [],
  hasHydrated: false,

  setHasHydrated: hasHydrated => set({ hasHydrated }),

  addListing(ownerId, values, status = 'active') {
    if (!ownerId) throw new Error('Sign in as a landlord to save a listing.');
    const images = values.imageUrl ? [values.imageUrl] : [properties[0].images[0]];
    const listing = {
      ...values,
      id: globalThis.crypto.randomUUID(),
      ownerId,
      images,
      amenities: [
        ...(values.furnished ? ['Furnished'] : []),
        ...(values.parking ? ['Parking'] : []),
        ...(values.petFriendly ? ['Pet-friendly'] : [])
      ],
      status,
      createdAt: new Date().toISOString().slice(0, 10),
      demo: false
    };
    set(state => ({ listings: [listing, ...state.listings] }));
    return listing;
  },

  updateListing(ownerId, listingId, values, status) {
    const existing = get().listings.find(item => item.id === listingId && item.ownerId === ownerId);
    if (!existing) throw new Error('This listing was not found in your account.');
    const images = values.imageUrl
      ? [values.imageUrl]
      : existing.images?.length ? existing.images : [properties[0].images[0]];
    const listing = {
      ...existing,
      ...values,
      images,
      amenities: [
        ...(values.furnished ? ['Furnished'] : []),
        ...(values.parking ? ['Parking'] : []),
        ...(values.petFriendly ? ['Pet-friendly'] : [])
      ],
      status: status || existing.status
    };
    set(state => ({
      listings: state.listings.map(item => item.id === listingId && item.ownerId === ownerId ? listing : item)
    }));
    return listing;
  },

  deleteListing(ownerId, listingId) {
    const exists = get().listings.some(item => item.id === listingId && item.ownerId === ownerId);
    if (!exists) throw new Error('This listing was not found in your account.');
    set(state => ({
      listings: state.listings.filter(item => item.id !== listingId || item.ownerId !== ownerId)
    }));
  }
}), {
  name: 'betkiray-owner-listings',
  storage: createJSONStorage(() => localStorage),
  skipHydration: true,
  partialize: state => ({ listings: state.listings }),
  onRehydrateStorage: () => (state, error) => {
    if (error) console.error('Unable to restore locally saved owner listings.', error);
    state?.setHasHydrated(true);
  }
}));
