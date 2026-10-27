'use client';

import { useFavoritesStore, useComparisonStore } from '@/stores/usePropertyStores';

export function ResetPreferences() {
  const clearFavorites = useFavoritesStore(state => state.clear);
  const clearComparison = useComparisonStore(state => state.clear);
  return <button className="btn btn-secondary" onClick={() => { clearFavorites(); clearComparison(); }}>Clear saved data</button>;
}
