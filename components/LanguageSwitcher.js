'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown, Globe2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('LanguageSwitcher');

  function changeLocale(nextLocale) {
    const query = new URLSearchParams(window.location.search).toString();
    router.replace(`${pathname}${query ? `?${query}` : ''}`, { locale: nextLocale, scroll: false });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="language-trigger" type="button" aria-label={`${t('label')}: ${t(locale)}`}>
          <Globe2 size={15} aria-hidden="true" />
          <span>{t(locale)}</span>
          <ChevronDown size={13} aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="language-menu" align="end" sideOffset={8} aria-label={t('label')}>
          <DropdownMenu.Label className="language-menu-label">{t('label')}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={locale} onValueChange={changeLocale}>
            {locales.map(option => (
              <DropdownMenu.RadioItem className="language-option" value={option} key={option}>
                <span>{t(option)}</span>
                <DropdownMenu.ItemIndicator><Check size={15} aria-hidden="true" /></DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
