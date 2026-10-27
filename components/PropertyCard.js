'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Bath, BedDouble, MapPin, Heart, ArrowUpRight, Scale } from 'lucide-react';
import { formatETB } from '@/lib/data';
import { useFavoritesStore, useComparisonStore } from '@/stores/usePropertyStores';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PropertyCard({ property, compact = false }) {
  const t = useTranslations('PropertyCard');
  const favorite = useFavoritesStore(state => state.ids.includes(property.id));
  const toggleFavorite = useFavoritesStore(state => state.toggle);
  const comparing = useComparisonStore(state => state.ids.includes(property.id));
  const toggleCompare = useComparisonStore(state => state.toggle);
  const badgeLabel = property.verified ? t('verified') : property.featured ? t('featured') : null;
  const propertyTypes = ['Apartment', 'Studio', 'Condominium', 'Villa', 'Townhouse', 'Commercial'];
  const propertyTypeLabel = propertyTypes.includes(property.propertyType)
    ? t(`type${property.propertyType}`)
    : property.propertyType;

  return (
    <Card className={`property-card ${compact ? 'property-compact' : ''}`}>
      <div className="property-image-wrap">
        <Link href={`/properties/${property.id}`} className="property-image-link" aria-label={t('viewListing', { title: property.title })}>
          <Image
            src={property.images[0]}
            alt={`${property.propertyType} rental in ${property.neighborhood}`}
            className="property-image"
            fill
            sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
            priority={false}
          />
        </Link>
        {badgeLabel && <Badge variant={property.verified ? 'verified' : 'featured'} className="image-badge">{badgeLabel}</Badge>}
        <Button
          variant="icon"
          size="icon"
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          onClick={() => toggleFavorite(property.id)}
          aria-label={favorite ? t('removeSavedHome') : t('saveHome')}
          aria-pressed={favorite}
        >
          <Heart size={18} fill={favorite ? 'currentColor' : 'none'} aria-hidden="true" />
        </Button>
      </div>
      <CardContent className="property-card-body">
        <div className="property-card-heading">
          <div className="property-price">{formatETB(property.monthlyRent)}<span> / {t('month')}</span></div>
          <span className="property-type-label">{propertyTypeLabel}</span>
        </div>
        <Link href={`/properties/${property.id}`} className="property-title"><h3>{property.title}</h3></Link>
        <p className="property-location"><MapPin size={15} aria-hidden="true" />{property.neighborhood}, {property.city}</p>
        <div className="property-specs">
          <span><BedDouble size={16} aria-hidden="true" />{t('bedrooms', { count: property.bedrooms })}</span>
          <span><Bath size={16} aria-hidden="true" />{t('bathrooms', { count: property.bathrooms })}</span>
          <span>{t('area', { count: property.areaSqm })}</span>
        </div>
        <div className="property-card-bottom">
          <span className="type-label">{property.furnished ? t('furnished') : t('rentalHome')}</span>
          <Button
            variant="ghost"
            size="icon"
            className={`compare-mini ${comparing ? 'selected' : ''}`}
            onClick={() => toggleCompare(property.id)}
            title={comparing ? t('removeComparison') : t('addComparison')}
            aria-label={comparing ? t('removeComparison') : t('addComparison')}
            aria-pressed={comparing}
          ><Scale size={16} aria-hidden="true" /></Button>
          <Link className="card-arrow" href={`/properties/${property.id}`} aria-label={t('viewDetails')}><ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </CardContent>
    </Card>
  );
}
