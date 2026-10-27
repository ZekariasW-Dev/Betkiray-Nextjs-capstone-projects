'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFavoritesStore, useComparisonStore } from '@/stores/usePropertyStores';
import { useOwnerListingsStore } from '@/stores/useOwnerListingsStore';
import { AuthProvider } from '@/components/AuthProvider';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false } }
});

export function Providers({ children }) {
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
    useComparisonStore.persist.rehydrate();
    useOwnerListingsStore.persist.rehydrate();
  }, []);
  return <QueryClientProvider client={queryClient}><AuthProvider>{children}</AuthProvider></QueryClientProvider>;
}
