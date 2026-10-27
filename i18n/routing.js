import { defineRouting } from 'next-intl/routing';

export const locales = ['am', 'en', 'or', 'tg'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'am',
  localePrefix: 'always'
});
