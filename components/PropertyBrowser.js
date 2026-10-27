'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, Search, X, LayoutGrid, List, Map } from 'lucide-react';
import { filterProperties, properties, propertyTypes } from '@/lib/data';
import { PropertyCard } from '@/components/PropertyCard';

export function PropertyBrowser({ initialFilters = {} }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const starting = Object.fromEntries(searchParams.entries());
  const [filters, setFilters] = useState({ ...initialFilters, ...starting });
  const [view, setView] = useState('grid');
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 180));
      return filterProperties(properties, filters);
    }
  });
  const pageSize = 9;
  const pageCount = Math.ceil(data.length / pageSize);
  const currentPage = Math.max(1, Math.min(Number(filters.page) || 1, pageCount || 1));
  const pageItems = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  function update(key, value) {
    const next = { ...filters, [key]: value };
    delete next.page;
    setFilters(next);
    const query = new URLSearchParams(Object.entries(next).filter(([, item]) => item));
    router.replace(`${pathname}${query.size ? `?${query.toString()}` : ''}`, { scroll: false });
  }
  function goToPage(page) {
    const next = { ...filters, page: page > 1 ? String(page) : '' };
    setFilters(next);
    const query = new URLSearchParams(Object.entries(next).filter(([, item]) => item));
    router.replace(`${pathname}${query.size ? `?${query.toString()}` : ''}`, { scroll: false });
  }
  function clear() {
    setFilters({});
    router.replace(pathname, { scroll: false });
  }
  return <section className="container browse-layout">
    <aside className="filter-panel surface">
      <div className="filter-title"><span><SlidersHorizontal size={17} /> Filters</span><button className="link-button" onClick={clear}>Clear all</button></div>
      <label className="filter-label"><span>Search</span><div className="input-icon"><Search size={16} /><input className="form-control" placeholder="Area, city, keywords" value={filters.search || ''} onChange={e => update('search', e.target.value)} /></div></label>
      <label className="filter-label"><span>City</span><select className="form-control" value={filters.city || ''} onChange={e => update('city', e.target.value)}><option value="">All cities</option>{['Addis Ababa','Adama','Hawassa','Bahir Dar','Dire Dawa','Mekelle'].map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="filter-label"><span>Neighborhood</span><input className="form-control" placeholder="Any neighborhood" value={filters.neighborhood || ''} onChange={e => update('neighborhood', e.target.value)} /></label>
      <label className="filter-label"><span>Property type</span><select className="form-control" value={filters.propertyType || ''} onChange={e => update('propertyType', e.target.value)}><option value="">Any type</option>{propertyTypes.map(item => <option key={item}>{item}</option>)}</select></label>
      <div className="filter-label"><span>Monthly rent (ETB)</span><div className="range-fields"><input aria-label="Minimum rent" className="form-control" type="number" placeholder="Min" value={filters.minPrice || ''} onChange={e => update('minPrice', e.target.value)} /><input aria-label="Maximum rent" className="form-control" type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={e => update('maxPrice', e.target.value)} /></div></div>
      <label className="filter-label"><span>Bedrooms</span><select className="form-control" value={filters.bedrooms || ''} onChange={e => update('bedrooms', e.target.value)}><option value="">Any</option>{[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}</select></label>
      <label className="filter-label"><span>Bathrooms</span><select className="form-control" value={filters.bathrooms || ''} onChange={e => update('bathrooms', e.target.value)}><option value="">Any</option>{[1,2,3].map(n => <option key={n} value={n}>{n}+</option>)}</select></label>
      <label className="filter-label"><span>Furnished</span><select className="form-control" value={filters.furnished || ''} onChange={e => update('furnished', e.target.value)}><option value="">Any</option><option value="true">Furnished</option><option value="false">Unfurnished</option></select></label>
      <label className="filter-label"><span>Parking</span><select className="form-control" value={filters.parking || ''} onChange={e => update('parking', e.target.value)}><option value="">Any</option><option value="true">Available</option><option value="false">No parking</option></select></label>
      <label className="filter-label"><span>Pet-friendly</span><select className="form-control" value={filters.petFriendly || ''} onChange={e => update('petFriendly', e.target.value)}><option value="">Any</option><option value="true">Yes</option><option value="false">No</option></select></label>
      <label className="filter-label"><span>Amenity</span><select className="form-control" value={filters.amenity || ''} onChange={e => update('amenity', e.target.value)}><option value="">Any amenity</option>{['Internet','Balcony','Security','Parking','Laundry','Garden','Water tank','Generator'].map(item => <option key={item}>{item}</option>)}</select></label>
    </aside>
    <div className="results-area">
      <div className="results-toolbar"><div><strong>{isLoading ? 'Loading homes…' : `${data.length} homes`}</strong><span> · Across Ethiopia</span></div><div className="results-controls"><label className="sort-control"><span>Sort:</span><select aria-label="Sort results" className="form-control" value={filters.sort || 'relevance'} onChange={e => update('sort', e.target.value === 'relevance' ? '' : e.target.value)}><option value="relevance">Relevance</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="newest">Newest</option></select></label><div className="view-toggle"><button onClick={() => setView('grid')} aria-label="Grid view" className={view === 'grid' ? 'active' : ''}><LayoutGrid size={17} /></button><button onClick={() => setView('list')} aria-label="List view" className={view === 'list' ? 'active' : ''}><List size={17} /></button></div><Link href="/map" className="map-view-link"><Map size={16} /> Map</Link></div></div>
      {Object.entries(filters).some(([key, value]) => key !== 'page' && value) && <div className="active-filters"><span>Applied filters</span>{Object.entries(filters).filter(([key, value]) => key !== 'page' && value).map(([key, value]) => <button key={key} onClick={() => update(key, '')}>{key === 'minPrice' ? 'Min' : key === 'maxPrice' ? 'Max' : key}: {value} <X size={13} /></button>)}</div>}
      {isError ? <div className="surface empty-state"><h2>We couldn’t load these homes</h2><p>Please try again in a moment.</p><button className="btn btn-secondary" onClick={() => window.location.reload()}>Retry</button></div> : isLoading ? <div className="grid-3">{[1,2,3].map(i => <div className="skeleton-card" key={i} />)}</div> : data.length ? <><div className={`property-results ${view === 'list' ? 'list-view' : ''}`}>{pageItems.map(property => <PropertyCard property={property} key={property.id} compact={view === 'list'} />)}</div><div className="pagination-bar"><span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, data.length)} of {data.length} homes</span><nav aria-label="Property result pages" className="pagination-controls"><button className="btn btn-secondary page-step" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Previous</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map(page => <button key={page} className={`page-number ${currentPage === page ? 'current' : ''}`} aria-label={`Page ${page}`} aria-current={currentPage === page ? 'page' : undefined} onClick={() => goToPage(page)}>{page}</button>)}<button className="btn btn-secondary page-step" disabled={currentPage === pageCount} onClick={() => goToPage(currentPage + 1)}>Next</button></nav></div></> : <div className="surface empty-state"><Search size={30} /><h2>No homes match these filters</h2><p>Try a different neighborhood, price range, or property type.</p><button className="btn btn-secondary" onClick={clear}>Clear filters</button></div>}
    </div>
  </section>;
}
