'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useOwnerListingsStore } from '@/stores/useOwnerListingsStore';

export function useOwnerListings() {
  const ownerId = useAuthStore(state => state.currentUser?.id);
  const listings = useOwnerListingsStore(state => state.listings);
  const hasHydrated = useOwnerListingsStore(state => state.hasHydrated);
  const addListing = useOwnerListingsStore(state => state.addListing);
  const updateListing = useOwnerListingsStore(state => state.updateListing);
  const deleteListing = useOwnerListingsStore(state => state.deleteListing);
  const ownerListings = useMemo(
    () => listings.filter(listing => listing.ownerId === ownerId),
    [listings, ownerId]
  );

  return {
    data: ownerListings,
    isLoading: !hasHydrated,
    error: null,
    addListing: (values, status) => addListing(ownerId, values, status),
    updateListing: (id, values, status) => updateListing(ownerId, id, values, status),
    deleteListing: id => deleteListing(ownerId, id)
  };
}
