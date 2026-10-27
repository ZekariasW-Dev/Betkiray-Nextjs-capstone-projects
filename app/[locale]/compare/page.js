'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight, Scale, X } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { properties, formatETB } from '@/lib/data';
import { useComparisonStore } from '@/stores/usePropertyStores';

const fields = [['Monthly rent', item => formatETB(item.monthlyRent)], ['Location', item => `${item.neighborhood}, ${item.city}`], ['Bedrooms', item => item.bedrooms], ['Bathrooms', item => item.bathrooms], ['Floor area', item => `${item.areaSqm} m²`], ['Furnished', item => item.furnished ? 'Yes' : 'No'], ['Property type', item => item.propertyType], ['Amenities', item => item.amenities.join(', ')], ['Price per m²', item => formatETB(Math.round(item.monthlyRent / item.areaSqm))]];
export default function ComparePage() {
  const ids = useComparisonStore(state => state.ids);
  const remove = useComparisonStore(state => state.remove);
  const clear = useComparisonStore(state => state.clear);
  const homes = properties.filter(item => ids.includes(item.id));
  const cheapest = Math.min(...homes.map(item => item.monthlyRent));
  const largest = Math.max(...homes.map(item => item.areaSqm));
  const mostBedrooms = Math.max(...homes.map(item => item.bedrooms));
  const bestValue = Math.min(...homes.map(item => item.monthlyRent / item.areaSqm));
  return <><PageTitle eyebrow="Side by side" title="Compare homes" description="Compare up to four homes on the details that matter to you." /> <section className="container compare-page">
    {!homes.length ? <div className="surface empty-state"><Scale size={32} /><h2>Your comparison is ready when you are</h2><p>Add homes to compare using the scale icon on any listing.</p><Link className="btn btn-primary" href="/properties">Browse homes <ArrowRight size={16} /></Link></div> : <>
      <div className="results-toolbar"><span>{homes.length} of 4 homes selected</span><button className="link-button" onClick={clear}>Clear comparison</button></div>
      <div className="compare-table-wrap surface"><table className="compare-table"><thead><tr><th>Details</th>{homes.map(home => <th key={home.id}><div className="compare-home"><img src={home.images[0]} alt="" /><button aria-label={`Remove ${home.title}`} onClick={() => remove(home.id)}><X size={15} /></button><Link href={`/properties/${home.id}`}>{home.title}</Link><span>{home.monthlyRent === cheapest && <i>Lowest rent</i>}{home.areaSqm === largest && <i>Largest area</i>}{home.bedrooms === mostBedrooms && mostBedrooms > 0 && <i>Most bedrooms</i>}{home.monthlyRent / home.areaSqm === bestValue && <i>Lowest price per m²</i>}</span></div></th>)}</tr></thead><tbody>{fields.map(([label, value]) => <tr key={label}><th>{label}</th>{homes.map(home => <td className={label === 'Monthly rent' && home.monthlyRent === cheapest || label === 'Floor area' && home.areaSqm === largest || label === 'Bedrooms' && home.bedrooms === mostBedrooms || label === 'Price per m²' && home.monthlyRent / home.areaSqm === bestValue ? 'compare-highlight' : ''} key={home.id}>{value(home)}</td>)}</tr>)}</tbody></table></div>
    </>}
  </section></>;
}
