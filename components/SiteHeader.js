'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Heart, Menu, X, House, LogOut, UserRound, ChevronDown, Check } from 'lucide-react';
import { useFavoritesStore } from '@/stores/usePropertyStores';
import { useAuth } from '@/components/AuthProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const navItems = [
  ['homes', '/properties'],
  ['neighborhoods', '/neighborhoods'],
  ['insights', '/market-insights'],
  ['about', '/about']
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const favorites = useFavoritesStore(state => state.ids);
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  async function logout() {
    try {
      await signOut();
      setOpen(false);
      router.push('/');
    } catch (error) {
      window.alert(error.message || 'Unable to sign out. Please try again.');
    }
  }
  return <header className="site-header">
    <div className="container header-inner">
      <Link className="brand" href="/" aria-label={t('homeLabel')}><span className="brand-mark"><House size={19} strokeWidth={2.5} /></span><span>BetKiray<span className="brand-ethiopia"> Ethiopia</span></span></Link>
      <nav className={`main-nav ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
        {navItems.map(([key, href]) => <Link onClick={() => setOpen(false)} href={href} key={href} aria-current={pathname === href ? 'page' : undefined}>{t(key)}</Link>)}
        <Link className="mobile-nav-link" onClick={() => setOpen(false)} href="/favorites">{t('savedHomes')} <span className="nav-count">{favorites.length}</span></Link>
        {user?.role === 'landlord' && <Link className="mobile-owner" onClick={() => setOpen(false)} href="/owner-dashboard">{t('ownerDashboard')}</Link>}
        {!isLoading && !user && <Link className="mobile-owner" onClick={() => setOpen(false)} href="/signup?role=landlord">{t('listProperty')}</Link>}
        {!isLoading && !user && <Link className="mobile-auth-link" onClick={() => setOpen(false)} href="/login">{t('signIn')}</Link>}
        {!isLoading && !user && <Link className="mobile-auth-link" onClick={() => setOpen(false)} href="/signup">{t('register')}</Link>}
        {user && <button className="mobile-auth-link logout-link" onClick={logout}><LogOut size={15} /> {t('signOut')}</button>}
      </nav>
      <div className="header-actions">
        <LanguageSwitcher />
        <Link className="header-favorites" href="/favorites" aria-label={t('favorites', { count: favorites.length })}><Heart size={19} /><span>{favorites.length > 0 && <i>{favorites.length}</i>}</span></Link>
        {!isLoading && user && <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button type="button" className="account-trigger" aria-label={`${user.name}, ${user.role}`}>
              <span className="account-avatar">{user.name.trim().charAt(0).toUpperCase()}</span>
              <span className="account-trigger-name">{user.name}<small className={`role-badge role-${user.role}`}>{user.role}</small></span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="account-menu" align="end" sideOffset={8}>
              <DropdownMenu.Label className="account-menu-label">
                <span>{user.name}</span><small>{user.email}</small>
                <span className={`role-badge role-${user.role}`}>{user.role === 'landlord' ? 'Landlord' : 'Tenant'}</span>
              </DropdownMenu.Label>
              {user.role === 'landlord' && <DropdownMenu.Item className="account-menu-item" asChild>
                <Link href="/owner-dashboard">{t('ownerDashboard')}<Check size={14} /></Link>
              </DropdownMenu.Item>}
              <DropdownMenu.Separator className="account-menu-separator" />
              <DropdownMenu.Item className="account-menu-item account-menu-logout" onSelect={logout}>
                <LogOut size={15} />{t('signOut')}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>}
        {!isLoading && !user && <Link className="header-login" href="/login">{t('signIn')}</Link>}
        {!isLoading && !user && <Link className="btn btn-primary owner-cta" href="/signup">{t('register')}</Link>}
        <button className="mobile-menu icon-button" onClick={() => setOpen(!open)} aria-label={open ? t('closeMenu') : t('openMenu')} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </div>
  </header>;
}
