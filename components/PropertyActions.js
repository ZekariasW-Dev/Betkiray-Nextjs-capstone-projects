'use client';

import { useState } from 'react';
import { Heart, Scale, Share2, Check } from 'lucide-react';
import { useFavoritesStore, useComparisonStore } from '@/stores/usePropertyStores';

export function PropertyActions({ property }) {
  const favorite = useFavoritesStore(state => state.ids.includes(property.id));
  const toggleFavorite = useFavoritesStore(state => state.toggle);
  const comparing = useComparisonStore(state => state.ids.includes(property.id));
  const toggleCompare = useComparisonStore(state => state.toggle);
  const [copied, setCopied] = useState(false);
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.alert('Unable to copy the link. You can copy it from your browser address bar.');
    }
  }
  return <div className="detail-actions"><button className={`icon-button ${favorite ? 'active-action' : ''}`} onClick={() => toggleFavorite(property.id)} aria-pressed={favorite} aria-label={favorite ? 'Remove saved home' : 'Save home'}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button><button className={`icon-button ${comparing ? 'active-action' : ''}`} onClick={() => toggleCompare(property.id)} aria-pressed={comparing} aria-label={comparing ? 'Remove from comparison' : 'Compare home'}><Scale size={18} /></button><button className="icon-button" onClick={share} aria-label="Copy property link">{copied ? <Check size={18} /> : <Share2 size={18} />}</button></div>;
}
