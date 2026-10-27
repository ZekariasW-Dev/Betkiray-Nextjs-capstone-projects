import { Link } from '@/i18n/navigation';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { neighborhoods, formatETB } from '@/lib/data';

export const metadata = { title: 'Neighborhoods across Ethiopia', description: 'Explore neighborhood guides and rental homes across Ethiopia.' };
export default function NeighborhoodsPage() {
  return <><PageTitle eyebrow="Get to know the area" title="Find your neighborhood" description="Explore local guides, landmarks, and rental homes." /><section className="container section"><div className="grid-3">{neighborhoods.map(area => <Link href={`/neighborhoods/${area.slug}`} className="area-card surface" key={area.slug}><img src={area.image} alt={`${area.name} neighborhood`} /><div className="area-card-body"><span className="eyebrow">{area.city}</span><h2>{area.name}</h2><p><MapPin size={15} />{area.landmarks.slice(0, 2).join(' · ')}</p><div className="area-card-footer"><span>Monthly rent from <strong>{formatETB(area.rent)}</strong></span><span><ArrowUpRight size={18} /></span></div><small>{area.count} homes in this guide</small></div></Link>)}</div></section></>;
}
