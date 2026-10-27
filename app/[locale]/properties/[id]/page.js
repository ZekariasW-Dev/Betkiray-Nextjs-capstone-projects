import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler, CalendarDays, Check } from 'lucide-react';
import { properties, formatETB } from '@/lib/data';
import { PropertyActions } from '@/components/PropertyActions';
import { PropertyCard } from '@/components/PropertyCard';
import { ContactOwner } from '@/components/ContactOwner';

export function generateStaticParams() { return properties.map(item => ({ id: item.id })); }
export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = properties.find(property => property.id === id);
  return { title: item ? `${item.title} in ${item.neighborhood}` : 'Rental home', description: 'Explore rental homes on BetKiray Ethiopia.' };
}
export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  const property = properties.find(item => item.id === id);
  if (!property) notFound();
  return <section className="container detail-page">
    <Link href="/properties" className="back-link"><ArrowLeft size={16} /> Back to homes</Link>
    <div className="gallery-grid">
      <div className="gallery-img-wrap"><Image src={property.images[0]} alt={`${property.title} interior`} fill sizes="(max-width: 600px) 100vw, 60vw" className="gallery-img" priority /></div>
      <div className="gallery-img-wrap"><Image src={property.images[1]} alt={`${property.title} living area`} fill sizes="(max-width: 600px) 100vw, 40vw" className="gallery-img" /></div>
    </div>
    <div className="detail-layout">
      <div className="detail-main">
        <div className="detail-heading"><div><span className="pill">{property.propertyType}</span><h1>{property.title}</h1><p><MapPin size={16} /> {property.address}, {property.neighborhood}, {property.city}</p></div><PropertyActions property={property} /></div>
        <div className="detail-specs"><span><BedDouble />{property.bedrooms} bedrooms</span><span><Bath />{property.bathrooms} bathrooms</span><span><Ruler />{property.areaSqm} m²</span><span>{property.propertyType}</span></div>
        <section className="detail-section"><h2>About this home</h2><p>{property.description}</p></section>
        <section className="detail-section"><h2>What this home offers</h2><div className="amenities-grid">{property.amenities.map(item => <span key={item}><Check size={16} />{item}</span>)}<span><Check size={16} />{property.furnished ? 'Furnished' : 'Unfurnished'}</span>{property.parking && <span><Check size={16} />Parking</span>}</div></section>
        <section className="detail-section"><h2>Neighborhood</h2><div className="detail-map"><iframe title={`${property.neighborhood} neighborhood map`} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - .01}%2C${property.latitude - .008}%2C${property.longitude + .01}%2C${property.latitude + .008}&layer=mapnik`} /></div></section>
        <div className="listing-date"><CalendarDays size={16} /> Listed {property.createdAt}</div>
      </div>
      <aside className="detail-aside surface">
        <div className="detail-price">{formatETB(property.monthlyRent)}<small> / month</small></div>
        <div className="aside-rule" />
        <p><MapPin size={16} /> {property.neighborhood}, {property.city}</p>
        <div className="aside-rule" />
        <ContactOwner property={property} />
        <div className="aside-owner-card">
          <span className="aside-owner-avatar">{property.owner.name.charAt(0)}</span>
          <div className="aside-owner-info">
            <strong>{property.owner.name}</strong>
            <span>Property owner</span>
          </div>
        </div>
        <p className="aside-response-time"><CalendarDays size={14} />{property.owner.responseTime}</p>
        <div className="aside-rule" />
        <small className="detail-aside-note">
          Always visit the property before making any payment.
        </small>
      </aside>
    </div>
    <section className="section"><div className="section-heading"><div><span className="eyebrow">Keep exploring</span><h2>Similar homes</h2></div></div><div className="grid-3">{properties.filter(item => item.id !== property.id && item.city === property.city).slice(0, 3).map(item => <PropertyCard property={item} key={item.id} />)}</div></section>
  </section>;
}
