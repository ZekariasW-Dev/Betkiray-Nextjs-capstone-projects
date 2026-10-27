import { PageTitle } from '@/components/PageTitle';
import { MarketDashboard } from '@/components/MarketDashboard';

export const metadata = { title: 'Rental listing insights', description: 'Explore rental prices, property types, and neighborhoods across Ethiopia.' };
export default function MarketInsightsPage() {
  return <><PageTitle eyebrow="See the bigger picture" title="Rental listing insights" description="Compare asking rents, property types, and neighborhood options." /><MarketDashboard /></>;
}
