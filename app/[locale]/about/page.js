import { Link } from '@/i18n/navigation';
import { ArrowRight, Compass, HandHeart, Lightbulb } from 'lucide-react';
import { PageTitle } from '@/components/PageTitle';

export const metadata = { title: 'About BetKiray Ethiopia', description: 'Learn about the BetKiray Ethiopia rental platform.' };
export default function AboutPage() {
  return <><PageTitle eyebrow="Our purpose" title="A clearer path to your next home" description="BetKiray makes rental discovery feel more organized and more informed." /><section className="container section about-content"><div className="about-intro surface"><div><span className="eyebrow">The idea</span><h2>Finding a place should feel less like guesswork.</h2><p>Rental information can be scattered and difficult to compare. BetKiray brings home listings, neighborhood context, and simple comparison tools into one approachable experience for people exploring homes in Ethiopia.</p></div><Compass size={45} /></div><div className="about-values"><article><Lightbulb /><h3>Useful clarity</h3><p>Present the details renters need to compare options more easily.</p></article><article><HandHeart /><h3>Designed for people</h3><p>Use local city and neighborhood context, with a calm, accessible interface.</p></article><article><Compass /><h3>Helpful by design</h3><p>Keep the details that matter easy to find and compare.</p></article></div><Link className="btn btn-primary" href="/properties">Explore homes <ArrowRight size={16} /></Link></section></>;
}
