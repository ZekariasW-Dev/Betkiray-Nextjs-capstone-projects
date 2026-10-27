import { Link } from '@/i18n/navigation';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return <div className="container not-found"><SearchX size={38} /><span className="eyebrow">404 · Not found</span><h1>We couldn’t find that page.</h1><p>Try searching our listings or head back to the homepage.</p><div><Link className="btn btn-primary" href="/properties">Explore homes</Link><Link className="btn btn-secondary" href="/">Go home</Link></div></div>;
}
