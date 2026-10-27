import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, BadgeCheck, Map, MapPin, ShieldCheck, Star } from 'lucide-react';
import { properties, neighborhoods, formatETB } from '@/lib/data';
import { PropertyCard } from '@/components/PropertyCard';
import { SearchPanel } from '@/components/SearchPanel';

/* Stable hero image — a well-lit Addis Ababa cityscape from Unsplash */
const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85';

export default function HomePage() {
  const t = useTranslations('Home');
  const propertyText = useTranslations('PropertyCard');
  const featured = [properties[0], properties[1], properties[2]];
  const spotlight = properties[3]; // use a different property from the featured row
  const featuredNeighborhoods = neighborhoods.slice(0, 3);

  return (
    <div className="home-layout">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="home-hero" aria-label={t('headline')}>
        {/* Background image */}
        <div className="home-hero-media">
          <Image
            src={HERO_IMAGE}
            alt="Rental homes in Ethiopia"
            fill
            priority
            sizes="100vw"
            className="home-hero-img"
          />
          <div className="home-hero-shade" aria-hidden="true" />
        </div>

        {/* Foreground content */}
        <div className="container home-hero-inner">
          <div className="home-hero-content">
            <span className="home-hero-kicker">
              <Star size={13} aria-hidden="true" />
              {t('kicker')}
            </span>
            <h1 className="home-hero-headline">{t('headline')}</h1>
            <p className="home-hero-sub">{t('intro')}</p>

            {/* Search panel floats inside the hero */}
            <div className="home-hero-search">
              <SearchPanel prominent />
            </div>

            {/* Trust signals */}
            <div className="home-hero-trust">
              <span><ShieldCheck size={14} aria-hidden="true" />{t('transparentListings')}</span>
              <span><Map size={14} aria-hidden="true" />{t('localGuides')}</span>
              <span><BadgeCheck size={14} aria-hidden="true" />{t('clarity')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPOTLIGHT ────────────────────────────────────────── */}
      <section className="container home-spotlight" aria-label={t('heroCaption')}>
        <Link href={`/properties/${spotlight.id}`} className="spotlight-image">
          <Image
            src={spotlight.images[0]}
            alt={`${spotlight.propertyType} in ${spotlight.neighborhood}`}
            fill
            sizes="(max-width: 768px) 100vw, 56vw"
            className="spotlight-img"
          />
          <div className="spotlight-shade" aria-hidden="true" />
          <span className="spotlight-image-caption">
            <small>{t('aPlaceToBegin')}</small>
            <strong>{spotlight.neighborhood} · {spotlight.city}</strong>
          </span>
        </Link>
        <div className="spotlight-copy">
          <span className="eyebrow">{t('confidentChoice')}</span>
          <h2>{t('heroCaption')}</h2>
          <p>{t('homesSectionIntro')}</p>
          <div className="spotlight-facts">
            <span>
              <strong>{formatETB(spotlight.monthlyRent)}</strong>
              <small>{propertyText('month')}</small>
            </span>
            <span>
              <strong>{spotlight.bedrooms}</strong>
              <small>{propertyText('bedrooms', { count: spotlight.bedrooms })}</small>
            </span>
            <span>
              <strong>{spotlight.areaSqm} m²</strong>
              <small>{propertyText('area', { count: spotlight.areaSqm })}</small>
            </span>
          </div>
          <Link className="spotlight-link" href={`/properties/${spotlight.id}`}>
            {t('viewAllHomes')} <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ────────────────────────────────── */}
      <section className="section container home-listings">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('aPlaceToBegin')}</span>
            <h2>{t('browseHomes')}</h2>
            <p>{t('homesSectionIntro')}</p>
          </div>
          <Link className="text-link" href="/properties">
            {t('viewAllHomes')} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid-3">
          {featured.map(item => <PropertyCard property={item} key={item.id} />)}
        </div>
      </section>

      {/* ── NEIGHBORHOODS ────────────────────────────────────── */}
      <section className="home-neighborhoods">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('findYourCorner')}</span>
              <h2>{t('neighborhoods')}</h2>
              <p>{t('neighborhoodsIntro')}</p>
            </div>
            <Link className="text-link" href="/neighborhoods">
              {t('allNeighborhoods')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="neighborhood-cards">
            {featuredNeighborhoods.map(area => (
              <Link
                key={area.slug}
                href={`/neighborhoods/${area.slug}`}
                className="neighborhood-card"
                aria-label={`${area.name}, ${area.city}`}
              >
                <div className="neighborhood-card-media">
                  <Image
                    src={area.image}
                    alt={`${area.name} neighborhood in ${area.city}`}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    className="neighborhood-card-img"
                  />
                  <div className="neighborhood-card-shade" aria-hidden="true" />
                </div>
                <div className="neighborhood-card-body">
                  <span className="neighborhood-card-count">
                    {t('neighborhoodHomeCount', { count: area.count })}
                  </span>
                  <strong className="neighborhood-card-name">{area.name}</strong>
                  <small className="neighborhood-card-city">
                    {area.city} · {formatETB(area.rent)} / mo
                  </small>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTION CARDS ─────────────────────────────────────── */}
      <section className="section container home-actions">
        <article className="home-action-card renter-action">
          <span className="eyebrow">{t('findYourCorner')}</span>
          <h2>{t('betterWay')}</h2>
          <p>{t('toolsIntro')}</p>
          <ul>
            <li><BadgeCheck size={15} aria-hidden="true" />{t('stepOneIntro')}</li>
            <li><BadgeCheck size={15} aria-hidden="true" />{t('stepTwoIntro')}</li>
            <li><BadgeCheck size={15} aria-hidden="true" />{t('stepThreeIntro')}</li>
          </ul>
          <Link className="btn btn-secondary" href="/properties">
            {t('exploreHomes')} <ArrowRight size={15} />
          </Link>
        </article>
        <article className="home-action-card owner-action">
          <span className="eyebrow">{t('owners')}</span>
          <h2>{t('ownerHeadline')}</h2>
          <p>{t('ownerIntro')}</p>
          <ul>
            <li><BadgeCheck size={15} aria-hidden="true" />{t('everythingTogether')}</li>
            <li><BadgeCheck size={15} aria-hidden="true" />{t('manageListings')}</li>
            <li><BadgeCheck size={15} aria-hidden="true" />{t('listingDetails')}</li>
          </ul>
          <Link className="btn btn-primary" href="/owner-dashboard">
            {t('ownerDashboard')} <ArrowRight size={15} />
          </Link>
        </article>
      </section>

      {/* ── TOOLS ────────────────────────────────────────────── */}
      <section className="section container home-tools">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{t('confidentChoice')}</span>
            <h2>{t('moreThanListings')}</h2>
            <p>{t('toolsIntro')}</p>
          </div>
        </div>
        <div className="feature-grid">
          <Link href="/map" className="feature-card">
            <span className="feature-icon"><Map size={22} aria-hidden="true" /></span>
            <h3>{t('mapTitle')}</h3>
            <p>{t('mapIntro')}</p>
            <span className="feature-link">{t('openMap')} <ArrowRight size={15} /></span>
          </Link>
          <Link href="/compare" className="feature-card">
            <span className="feature-icon"><BadgeCheck size={22} aria-hidden="true" /></span>
            <h3>{t('compareTitle')}</h3>
            <p>{t('compareIntro')}</p>
            <span className="feature-link">{t('compareHomes')} <ArrowRight size={15} /></span>
          </Link>
          <Link href="/market-insights" className="feature-card">
            <span className="feature-icon"><ShieldCheck size={22} aria-hidden="true" /></span>
            <h3>{t('marketTitle')}</h3>
            <p>{t('marketIntro')}</p>
            <span className="feature-link">{t('viewInsights')} <ArrowRight size={15} /></span>
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">{t('simpleByDesign')}</span>
              <h2>{t('betterWay')}</h2>
            </div>
          </div>
          <div className="how-grid">
            <div className="how-step">
              <span className="how-step-number" aria-hidden="true">01</span>
              <h3>{t('stepOne')}</h3>
              <p>{t('stepOneIntro')}</p>
            </div>
            <div className="how-step">
              <span className="how-step-number" aria-hidden="true">02</span>
              <h3>{t('stepTwo')}</h3>
              <p>{t('stepTwoIntro')}</p>
            </div>
            <div className="how-step">
              <span className="how-step-number" aria-hidden="true">03</span>
              <h3>{t('stepThree')}</h3>
              <p>{t('stepThreeIntro')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
