'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { MapPin, Search, LayoutList, Map as MapIcon } from 'lucide-react';
import { properties, formatETB } from '@/lib/data';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false, loading: () => <div className="map-loading">Loading map…</div> });

export function MapExplorer() {
  const [search, setSearch] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [type, setType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const filtered = useMemo(() => properties.filter(item =>
    (!search || `${item.city} ${item.neighborhood}`.toLowerCase().includes(search.toLowerCase())) &&
    (!maxPrice || item.monthlyRent <= Number(maxPrice)) &&
    (!type || item.propertyType === type) &&
    (!bedrooms || item.bedrooms >= Number(bedrooms))
  ), [search, maxPrice, type, bedrooms]);
  return <section className="container map-explorer">
    <div className="map-filters surface"><label><span>Location</span><div className="input-icon"><Search size={15} /><input className="form-control" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city or area" /></div></label><label><span>Max rent / month</span><select className="form-control" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}><option value="">Any price</option><option value="20000">ETB 20,000</option><option value="30000">ETB 30,000</option><option value="45000">ETB 45,000</option><option value="60000">ETB 60,000</option></select></label><label><span>Property type</span><select className="form-control" value={type} onChange={e => setType(e.target.value)}><option value="">Any type</option>{['Apartment','Condominium','Villa','Studio','Townhouse'].map(item => <option key={item}>{item}</option>)}</select></label><label><span>Bedrooms</span><select className="form-control" value={bedrooms} onChange={e => setBedrooms(e.target.value)}><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label></div>
    <div className="map-header"><span><MapPin size={16} /> {filtered.length} homes</span><button onClick={() => setListOpen(!listOpen)} className="btn btn-secondary"><LayoutList size={16} /> {listOpen ? 'Hide homes' : 'Show homes'}</button></div>
    <div className={`map-content ${listOpen ? 'with-list' : ''}`}><div className="map-canvas"><LeafletMap items={filtered} /></div>{listOpen && <div className="map-list">{filtered.slice(0, 15).map(item => <Link href={`/properties/${item.id}`} className="map-list-item" key={item.id}><img src={item.images[0]} alt="" /><span><strong>{item.title}</strong><small>{item.neighborhood}, {item.city}</small><b>{formatETB(item.monthlyRent)} / mo</b></span></Link>)}</div>}</div>
  </section>;
}
