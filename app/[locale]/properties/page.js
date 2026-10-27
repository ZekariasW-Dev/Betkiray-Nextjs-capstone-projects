import { PropertyBrowser } from '@/components/PropertyBrowser';
import { PageTitle } from '@/components/PageTitle';

export const metadata = { title: 'Rental properties in Ethiopia', description: 'Search rental homes across Ethiopian cities.' };

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;
  return <><PageTitle eyebrow="Find your place" title="Explore rental homes" description="Browse homes across Ethiopia and narrow your search to what matters." /><PropertyBrowser initialFilters={params || {}} /></>;
}
