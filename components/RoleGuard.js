'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldAlert } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export function RoleGuard({ allowedRoles, children }) {
  const currentUser = useAuthStore(state => state.currentUser);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('Navigation');

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated || !isAuthenticated) {
    return <section className="container auth-wait" aria-live="polite">
      <span className="eyebrow">BetKiray</span>
      <h1>Checking your access…</h1>
    </section>;
  }

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <section className="container role-denied">
      <div className="role-denied-icon"><ShieldAlert size={25} aria-hidden="true" /></div>
      <span className="eyebrow">Permission required</span>
      <h1>Access denied</h1>
      <p>Your {currentUser?.role || 'account'} account does not have permission to view this area.</p>
      <Link className="btn btn-primary" href="/">{t('homeLabel')}</Link>
    </section>;
  }

  return children;
}
