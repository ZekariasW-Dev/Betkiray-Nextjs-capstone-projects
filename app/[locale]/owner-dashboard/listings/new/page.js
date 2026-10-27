import { PageTitle } from '@/components/PageTitle';
import { OwnerPropertyForm } from '@/components/OwnerPropertyForm';

export const metadata = { title: 'Add a property' };
export default function NewListingPage() {
  return <><PageTitle eyebrow="Owner tools" title="Add a property" description="Share the details of your rental property." /><div className="container owner-form-page"><OwnerPropertyForm /></div></>;
}
