'use client';

import { Link } from '@/i18n/navigation';
import { ArrowRight, CircleDollarSign, FileText, Plus, TrendingUp } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';
import { formatETB } from '@/lib/data';
import { useOwnerListings } from '@/hooks/useOwnerListings';

export default function OwnerDashboardPage() {
  const { data: listings = [], isLoading, error } = useOwnerListings();
  const active = listings.filter(item => item.status !== 'draft');
  const drafts = listings.filter(item => item.status === 'draft');
  const rentTotal = listings.reduce((sum, item) => sum + Number(item.monthlyRent || 0), 0);
  return <><PageTitle eyebrow="Property management" title="Owner dashboard" description="Create and manage your rental listings."><Link href="/owner-dashboard/listings/new" className="btn btn-primary"><Plus size={17} /> Add a listing</Link></PageTitle><section className="container owner-dashboard">
    <div className="owner-metrics"><Metric icon={FileText} label="My listings" value={listings.length} /><Metric icon={TrendingUp} label="Active listings" value={active.length} /><Metric icon={FileText} label="Drafts" value={drafts.length} /><Metric icon={CircleDollarSign} label="Total listed rent" value={formatETB(rentTotal)} /></div>
    {isLoading ? <div className="surface empty-small">Loading your listings…</div> : error ? <div className="owner-alert" role="alert">{error.message}</div> : <div className="owner-dashboard-grid"><div className="surface owner-recent"><div className="owner-section-head"><div><h2>Recently added</h2><p>Your latest account listings.</p></div><Link href="/owner-dashboard/listings">View all <ArrowRight size={15} /></Link></div>{listings.length ? listings.slice(0, 4).map(item => <div className="recent-listing" key={item.id}><img src={item.images?.[0]} alt="" /><span><strong>{item.title}</strong><small>{item.neighborhood}, {item.city}</small></span><b>{formatETB(item.monthlyRent)}</b><span className={`status-pill ${item.status === 'draft' ? 'draft' : ''}`}>{item.status || 'active'}</span></div>) : <div className="empty-small"><p>You haven’t added any listings yet.</p><Link href="/owner-dashboard/listings/new" className="btn btn-secondary">Create your first listing</Link></div>}</div><div className="surface owner-side-card"><span className="feature-icon"><Plus size={20} /></span><h2>Ready to add a home?</h2><p>Create and manage listings from your owner workspace.</p><Link className="btn btn-primary" href="/owner-dashboard/listings/new">Add a property</Link><Link className="text-link" href="/owner-dashboard/listings">Manage listings <ArrowRight size={15} /></Link></div></div>}
  </section></>;
}
function Metric({ icon: Icon, label, value }) { return <div className="surface owner-metric"><span><Icon size={18} /></span><small>{label}</small><strong>{value}</strong></div>; }
