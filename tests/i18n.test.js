import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { locales } from '../i18n/routing.js';

const namespaces = ['Metadata', 'Navigation', 'LanguageSwitcher', 'Home', 'Search', 'PropertyCard', 'Footer'];
const messages = Object.fromEntries(locales.map(locale => [
  locale,
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), 'utf8'))
]));

function placeholders(value) {
  return [...value.matchAll(/\{([^}]+)\}/g)].map(([, name]) => name).sort();
}

test('all supported locales provide the same translation keys', () => {
  assert.deepEqual(locales, ['am', 'en', 'or', 'tg']);
  const englishKeys = Object.fromEntries(namespaces.map(namespace => [
    namespace,
    Object.keys(messages.en[namespace]).sort()
  ]));

  for (const locale of locales) {
    for (const namespace of namespaces) {
      assert.deepEqual(
        Object.keys(messages[locale][namespace]).sort(),
        englishKeys[namespace],
        `Translation keys in ${locale}.${namespace} should match English`
      );
      for (const key of englishKeys[namespace]) {
        assert.deepEqual(
          placeholders(messages[locale][namespace][key]),
          placeholders(messages.en[namespace][key]),
          `Message placeholders in ${locale}.${namespace}.${key} should match English`
        );
      }
    }
  }
});

test('homepage welcome and house-search translations are available for every locale', () => {
  for (const locale of locales) {
    assert.ok(messages[locale].Home.welcome);
    assert.ok(messages[locale].Home.searchHouses);
    assert.ok(messages[locale].Search.searchHouses);
  }
});
