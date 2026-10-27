import { Link } from '@/i18n/navigation';
import { PageTitle } from '@/components/PageTitle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export const metadata = { title: 'Settings and preferences' };
export default function SettingsPage() {
  return <><PageTitle eyebrow="Your preferences" title="Settings" description="Manage your saved homes and BetKiray account." /><section className="container section settings-layout"><div className="settings-card surface"><h2>Saved preferences</h2><p>Manage your favorites and comparison shortlist.</p><div className="settings-row"><div><strong>Reset saved preferences</strong><p>Remove your saved homes and comparison shortlist.</p></div><ResetPreferences /></div></div><div className="settings-card surface"><h2>Language</h2><p>Choose the language you prefer. Your current page will stay open when you switch.</p><div className="settings-row"><span>Interface language</span><LanguageSwitcher /></div></div><p className="muted"><Link href="/about">About BetKiray</Link></p></section></>;
}

import { ResetPreferences } from '@/components/ResetPreferences';
