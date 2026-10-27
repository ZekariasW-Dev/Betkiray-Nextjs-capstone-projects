import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  House, Instagram, Facebook, Linkedin, MapPin,
  ShieldCheck, BadgeCheck, Map, PhoneCall, Mail,
} from 'lucide-react';

export function SiteFooter() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Navigation');

  return (
    <footer className="site-footer">

      {/* ── ASSURANCE STRIP ──────────────────────────────────── */}
      <div className="footer-assurance">
        <div className="container footer-assurance-grid">
          <div className="footer-assurance-item">
            <span className="footer-assurance-icon"><ShieldCheck size={18} /></span>
            <div>
              <strong>{t('assuranceVerifiedTitle')}</strong>
              <small>{t('assuranceVerifiedDesc')}</small>
            </div>
          </div>
          <div className="footer-assurance-item">
            <span className="footer-assurance-icon"><Map size={18} /></span>
            <div>
              <strong>{t('assuranceMapTitle')}</strong>
              <small>{t('assuranceMapDesc')}</small>
            </div>
          </div>
          <div className="footer-assurance-item">
            <span className="footer-assurance-icon"><BadgeCheck size={18} /></span>
            <div>
              <strong>{t('assurancePriceTitle')}</strong>
              <small>{t('assurancePriceDesc')}</small>
            </div>
          </div>
          <div className="footer-assurance-item">
            <span className="footer-assurance-icon"><House size={18} /></span>
            <div>
              <strong>{t('assuranceListingsTitle')}</strong>
              <small>{t('assuranceListingsDesc')}</small>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER BODY ──────────────────────────────────────── */}
      <div className="container footer-top">

        {/* Brand + tagline + contact */}
        <div className="footer-brand">
          <Link className="brand" href="/" aria-label="BetKiray home">
            <span className="brand-mark"><House size={19} /></span>
            <span>BetKiray<span className="brand-ethiopia"> Ethiopia</span></span>
          </Link>
          <p>{t('tagline')}</p>
          <div className="footer-contact">
            <a href="mailto:hello@betkiray.et">
              <Mail size={13} aria-hidden="true" />
              hello@betkiray.et
            </a>
            <a href="tel:+251911000000">
              <PhoneCall size={13} aria-hidden="true" />
              +251 911 000 000
            </a>
            <span>
              <MapPin size={13} aria-hidden="true" />
              Bole, Addis Ababa, Ethiopia
            </span>
          </div>
        </div>

        {/* Explore links */}
        <div className="footer-links">
          <strong>{t('explore')}</strong>
          <Link href="/properties">{t('rentalHomes')}</Link>
          <Link href="/neighborhoods">{nav('neighborhoods')}</Link>
          <Link href="/map">{t('map')}</Link>
          <Link href="/compare">{t('compare')}</Link>
        </div>

        {/* Brand links */}
        <div className="footer-links">
          <strong>{t('brand')}</strong>
          <Link href="/market-insights">{t('marketInsights')}</Link>
          <Link href="/about">{t('about')}</Link>
          <Link href="/owner-dashboard">{t('listProperty')}</Link>
          <Link href="/settings">{t('preferences')}</Link>
        </div>

        {/* Social */}
        <div className="footer-social">
          <strong>{t('follow')}</strong>
          <div>
            <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Instagram size={16} />
            </a>
            <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <Facebook size={16} />
            </a>
            <a href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <Linkedin size={16} />
            </a>
          </div>
        </div>

      </div>

      {/* ── LEGAL BAR ────────────────────────────────────────── */}
      <div className="footer-legal">
        <div className="container footer-bottom">
          <span>© 2026 BetKiray Ethiopia. {t('allRightsReserved')}</span>
          <div className="footer-bottom-links">
            <Link href="/settings">{t('preferences')}</Link>
            <span className="footer-bottom-sep" aria-hidden="true">·</span>
            <Link href="/about">{t('about')}</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
