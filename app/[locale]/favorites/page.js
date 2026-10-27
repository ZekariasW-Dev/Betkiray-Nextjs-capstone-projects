'use client';

import { Link } from '@/i18n/navigation';
import { Heart } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { PropertyCard } from '@/components/PropertyCard';
import { properties } from '@/lib/data';
import { useFavoritesStore } from '@/stores/usePropertyStores';

export default function FavoritesPage() {
  const ids = useFavoritesStore(state => state.ids);
  const clear = useFavoritesStore(state => state.clear);
  const homes = properties.filter(item => ids.includes(item.id));
  return <><PageTitle eyebrow="Your shortlist" title="Saved homes" description="Keep the homes you like together while you explore." /> <section className="container favorites-page">
    {homes.length ? <><div className="results-toolbar"><strong>{homes.length} saved {homes.length === 1 ? 'home' : 'homes'}</strong><div className="results-controls"><Link href="/compare" className="btn btn-secondary">Compare saved</Link><button className="link-button" onClick={clear}>Remove all</button></div></div><div className="grid-3">{homes.map(item => <PropertyCard property={item} key={item.id} />)}</div></> : <div className="surface empty-state"><Heart size={31} /><h2>Your saved homes will appear here</h2><p>Tap the heart on a home to add it to your shortlist.</p><Link className="btn btn-primary" href="/properties">Explore homes</Link></div>}
  </section></>;
}
