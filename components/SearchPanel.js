'use client';

import { useMemo, useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, MapPin, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { formatETB } from '@/lib/data';

const cities = ['Addis Ababa', 'Adama', 'Bahir Dar', 'Dire Dawa', 'Hawassa', 'Mekelle'];
const propertyTypes = ['Apartment', 'Studio', 'Condominium', 'Villa', 'Townhouse', 'Commercial'];
const priceOptions = ['', '15000', '25000', '40000', '60000'];

export function SearchPanel({ prominent = false }) {
  const router = useRouter();
  const t = useTranslations('Search');
  const [filters, setFilters] = useState({ city: '', propertyType: '', minPrice: '', maxPrice: '' });
  const [cityQuery, setCityQuery] = useState('');
  const [locationOpen, setLocationOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const filteredCities = useMemo(
    () => cities.filter(city => city.toLowerCase().includes(cityQuery.trim().toLowerCase())),
    [cityQuery]
  );
  const priceSummary = filters.minPrice || filters.maxPrice
    ? `${filters.minPrice ? formatETB(Number(filters.minPrice)) : t('priceAny')} – ${filters.maxPrice ? formatETB(Number(filters.maxPrice)) : t('priceAny')}`
    : t('priceAny');

  function submit(event) {
    event.preventDefault();
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value));
    router.push(`/properties${query.size ? `?${query.toString()}` : ''}`);
  }

  function updateFilter(key, value) {
    setFilters(current => ({ ...current, [key]: value }));
  }

  return <form onSubmit={submit} className={`search-panel ${prominent ? 'search-panel-hero' : ''}`}>
    <Popover.Root open={locationOpen} onOpenChange={setLocationOpen}>
      <div className="search-segment search-segment-location">
        <span className="search-segment-label">{t('location')}</span>
        <Popover.Trigger asChild>
          <button type="button" className="search-segment-trigger" aria-label={t('location')} aria-expanded={locationOpen}>
            <MapPin size={16} aria-hidden="true" />
            <span>{filters.city || t('anywhere')}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="search-popover location-popover" align="start" sideOffset={10} onOpenAutoFocus={event => event.preventDefault()}>
            <label className="location-search">
              <MapPin size={15} aria-hidden="true" />
              <input autoFocus value={cityQuery} onChange={event => setCityQuery(event.target.value)} placeholder={t('citySearchPlaceholder')} aria-label={t('location')} />
              {cityQuery && <button type="button" className="search-clear-query" onClick={() => setCityQuery('')} aria-label={t('clear')}><X size={14} /></button>}
            </label>
            <div className="location-options" role="listbox" aria-label={t('city')}>
              <button type="button" className={`location-option ${filters.city === '' ? 'is-selected' : ''}`} onClick={() => { updateFilter('city', ''); setLocationOpen(false); }}>
                <span>{t('anywhere')}</span>{filters.city === '' && <Check size={15} />}
              </button>
              {filteredCities.map(city => (
                <button type="button" role="option" aria-selected={filters.city === city} className={`location-option ${filters.city === city ? 'is-selected' : ''}`} key={city} onClick={() => { updateFilter('city', city); setLocationOpen(false); }}>
                  <span>{city}</span>{filters.city === city && <Check size={15} />}
                </button>
              ))}
              {filteredCities.length === 0 && <p className="location-empty">{t('noCities')}</p>}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>

    <label className="search-segment search-segment-type">
      <span className="search-segment-label">{t('propertyType')}</span>
      <span className="search-select-wrap">
        <select className="search-segment-select" value={filters.propertyType} onChange={event => updateFilter('propertyType', event.target.value)} aria-label={t('propertyType')}>
          <option value="">{t('anyType')}</option>
          {propertyTypes.map(type => <option key={type} value={type}>{t(`type${type}`)}</option>)}
        </select>
        <ChevronDown size={14} aria-hidden="true" />
      </span>
    </label>

    <Popover.Root open={priceOpen} onOpenChange={setPriceOpen}>
      <div className="search-segment search-segment-price">
        <span className="search-segment-label">{t('priceRange')}</span>
        <Popover.Trigger asChild>
          <button type="button" className="search-segment-trigger" aria-label={`${t('priceRange')}: ${priceSummary}`} aria-expanded={priceOpen}>
            <span className="price-summary">{priceSummary}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="search-popover price-popover" align="end" sideOffset={10}>
            <div className="price-popover-heading">
              <div><strong>{t('priceRange')}</strong><span>{t('monthlyRent')}</span></div>
              {(filters.minPrice || filters.maxPrice) && <button type="button" className="price-reset" onClick={() => setFilters(current => ({ ...current, minPrice: '', maxPrice: '' }))}>{t('clear')}</button>}
            </div>
            <div className="price-fields">
              <label><span>{t('minimum')}</span><select className="form-control" value={filters.minPrice} onChange={event => updateFilter('minPrice', event.target.value)}><option value="">{t('noMinimum')}</option>{priceOptions.slice(1).filter(price => !filters.maxPrice || Number(price) <= Number(filters.maxPrice)).map(price => <option key={price} value={price}>{formatETB(Number(price))}</option>)}</select></label>
              <span className="price-separator" aria-hidden="true">—</span>
              <label><span>{t('maximum')}</span><select className="form-control" value={filters.maxPrice} onChange={event => updateFilter('maxPrice', event.target.value)}><option value="">{t('noMaximum')}</option>{priceOptions.slice(1).filter(price => !filters.minPrice || Number(price) >= Number(filters.minPrice)).map(price => <option key={price} value={price}>{formatETB(Number(price))}</option>)}</select></label>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </div>
    </Popover.Root>

    <Button className="search-submit" type="submit" aria-label={t('searchHouses')}><Search size={17} aria-hidden="true" /><span>{t('searchHouses')}</span></Button>
  </form>;
}
