import { PropertyBrowser } from '@/components/PropertyBrowser';
import { PageTitle } from '@/components/PageTitle';

export const metadata = { title: 'Search rental homes in Ethiopia', description: 'Filter rental homes across Ethiopia.' };
export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  return <><PageTitle eyebrow="Search homes" title="Find the right fit" description="Set your preferences and explore rentals across Ethiopia." /><PropertyBrowser initialFilters={params || {}} /></>;
}
