import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { neighborhoods, properties, formatETB } from '@/lib/data';
import { PageTitle } from '@/components/PageTitle';
import { PropertyCard } from '@/components/PropertyCard';

export function generateStaticParams() { return neighborhoods.map(area => ({ slug: area.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const area = neighborhoods.find(item => item.slug === slug);
  return { title: area ? `Rentals in ${area.name}, ${area.city}` : 'Neighborhood guide', description: 'Explore rental homes and local landmarks in this neighborhood.' };
}
export default async function NeighborhoodPage({ params }) {
  const { slug } = await params;
  const area = neighborhoods.find(item => item.slug === slug);
  if (!area) notFound();
  const listings = properties.filter(item => item.neighborhood.toLowerCase() === area.name.toLowerCase()).slice(0, 3);
  return <><div className="container breadcrumb"><Link href="/neighborhoods"><ArrowLeft size={15} /> All neighborhoods</Link></div><div className="area-hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(10,25,16,.75),rgba(10,25,16,.12)),url(${area.image})` }}><div className="container"><span className="eyebrow">{area.city} · Neighborhood guide</span><h1>{area.name}</h1><p>{area.description}</p></div></div><section className="container area-detail-content"><div className="area-detail-stats surface"><div><span>Average listed rent</span><strong>{formatETB(area.rent)} <small>/ month</small></strong></div><div><span>Homes</span><strong>{area.count}</strong></div><div><span>City</span><strong>{area.city}</strong></div></div><div className="area-info-grid"><div><h2>A little about {area.name}</h2><p>{area.description}</p><h3>Nearby landmarks</h3><p>{area.landmarks.join(' · ')}</p></div><div className="surface area-amenities"><h3>Common conveniences</h3>{area.amenities.map(item => <span key={item}><MapPin size={15} />{item}</span>)}</div></div><div className="section-heading"><div><span className="eyebrow">Rental listings</span><h2>Homes in {area.name}</h2></div><Link className="text-link" href={`/properties?neighborhood=${encodeURIComponent(area.name)}`}>See all homes <ArrowRight size={16} /></Link></div>{listings.length ? <div className="grid-3">{listings.map(item => <PropertyCard property={item} key={item.id} />)}</div> : <div className="surface empty-state"><p>No homes found for this area.</p><Link href="/properties" className="btn btn-secondary">Explore all homes</Link></div>}</section></>;
}
