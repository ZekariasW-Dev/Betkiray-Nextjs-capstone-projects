import { notFound } from 'next/navigation';
import { PageTitle } from '@/components/PageTitle';
import { OwnerPropertyForm } from '@/components/OwnerPropertyForm';

export async function generateMetadata({ params }) { const { id } = await params; return { title: `Edit ${id}` }; }
export default async function EditListingPage({ params }) {
  const { id } = await params;
  if (!id) notFound();
  return <><PageTitle eyebrow="Owner account" title="Edit a property" description="Update a listing belonging to your owner account." /><div className="container owner-form-page"><OwnerPropertyForm listingId={id} /></div></>;
}
