import { PageTitle } from '@/components/PageTitle';
import { MapExplorer } from '@/components/MapExplorer';

export const metadata = { title: 'Rental map across Ethiopia', description: 'Explore rental homes by location on an interactive map.' };
export default function MapPage() {
  return <><PageTitle eyebrow="Location explorer" title="Explore homes on the map" description="Browse rental homes by city and neighborhood." /><MapExplorer /></>;
}
