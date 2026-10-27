import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container not-found">
      <span className="eyebrow">404 · Not found</span>
      <h1>We couldn’t find that page.</h1>
      <p>Try searching our homes or return to the homepage.</p>
      <Link className="btn btn-primary" href="/am">Go to BetKiray</Link>
    </main>
  );
}
