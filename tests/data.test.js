import test from 'node:test';
import assert from 'node:assert/strict';
import { filterProperties, formatETB, properties } from '../lib/data.js';
import { propertySchema } from '../lib/schemas.js';

const storage = new Map();
globalThis.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
  removeItem: key => storage.delete(key)
};
const { useComparisonStore, useFavoritesStore } = await import('../stores/usePropertyStores.js');
const { useOwnerListingsStore } = await import('../stores/useOwnerListingsStore.js');
const { useAuthStore } = await import('../stores/useAuthStore.js');

test('demo dataset contains at least 30 Ethiopian rental listings', () => {
  assert.ok(properties.length >= 30);
  assert.ok(properties.every(item => item.demo && item.city));
});

test('property filters can be combined and sorting is applied', () => {
  const result = filterProperties(properties, {
    city: 'Addis Ababa',
    bedrooms: '2',
    maxPrice: '50000',
    sort: 'price-asc'
  });
  assert.ok(result.length > 0);
  assert.ok(result.every(item => item.city === 'Addis Ababa' && item.bedrooms >= 2 && item.monthlyRent <= 50000));
  assert.deepEqual(result.map(item => item.monthlyRent), [...result.map(item => item.monthlyRent)].sort((a, b) => a - b));
});

test('ETB formatter uses Ethiopian Birr and whole amounts', () => {
  assert.match(formatETB(15000), /^ETB\s/);
  assert.match(formatETB(15000), /15,000/);
});

test('property schema rejects invalid rent and accepts valid sample listing data', () => {
  const good = { title: 'Bright two-bedroom home', description: 'A comfortable home close to shops and transport.', city: 'Addis Ababa', neighborhood: 'Bole', address: '12 Bole Road', propertyType: 'Apartment', monthlyRent: '28000', bedrooms: '2', bathrooms: '1', areaSqm: '95', furnished: false, parking: true, petFriendly: false };
  const parsed = propertySchema.safeParse(good);
  assert.equal(parsed.success, true);
  assert.equal(parsed.data.title, good.title);
  assert.equal(propertySchema.safeParse({ ...good, monthlyRent: '-1' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, monthlyRent: '28000.5' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, monthlyRent: '10000001' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, bedrooms: '' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, bedrooms: '1.5' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, city: 'Unknown city' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, propertyType: 'Cabin' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, imageUrl: 'javascript:alert(1)' }).success, false);
  assert.equal(propertySchema.safeParse({ ...good, title: '   Home   ' }).success, false);
  const trimmed = propertySchema.safeParse({ ...good, title: '  Bright two-bedroom home  ' });
  assert.equal(trimmed.success, true);
  assert.equal(trimmed.data.title, 'Bright two-bedroom home');
  assert.equal(propertySchema.safeParse({ ...good, imageUrl: '' }).success, true);
});

test('favorites and comparison stores toggle ids and enforce the four-home comparison limit', () => {
  useFavoritesStore.getState().clear();
  useComparisonStore.getState().clear();
  useFavoritesStore.getState().toggle('home-001');
  assert.deepEqual(useFavoritesStore.getState().ids, ['home-001']);
  useFavoritesStore.getState().toggle('home-001');
  assert.deepEqual(useFavoritesStore.getState().ids, []);
  ['home-001', 'home-002', 'home-003', 'home-004', 'home-005'].forEach(id => useComparisonStore.getState().toggle(id));
  assert.deepEqual(useComparisonStore.getState().ids, ['home-001', 'home-002', 'home-003', 'home-004']);
  useComparisonStore.getState().remove('home-002');
  assert.deepEqual(useComparisonStore.getState().ids, ['home-001', 'home-003', 'home-004']);
  useComparisonStore.getState().clear();
});

test('owner listing store persists CRUD changes and isolates records by landlord', () => {
  const store = useOwnerListingsStore;
  store.setState({ listings: [] });
  const first = store.getState().addListing('landlord-1', {
    title: 'Bright two-bedroom home',
    city: 'Addis Ababa',
    neighborhood: 'Bole',
    monthlyRent: 28000,
    imageUrl: 'https://example.com/home.jpg',
    furnished: true,
    parking: false,
    petFriendly: false
  }, 'draft');
  store.getState().addListing('landlord-2', {
    title: 'Another sample rental',
    city: 'Adama',
    neighborhood: 'Centre',
    monthlyRent: 15000,
    imageUrl: '',
    furnished: false,
    parking: false,
    petFriendly: false
  });

  assert.equal(first.status, 'draft');
  assert.deepEqual(store.getState().listings.filter(item => item.ownerId === 'landlord-1').map(item => item.id), [first.id]);
  store.getState().updateListing('landlord-1', first.id, { ...first, title: 'Updated Bole home' }, 'active');
  assert.equal(store.getState().listings.find(item => item.id === first.id).title, 'Updated Bole home');
  assert.throws(() => store.getState().deleteListing('landlord-2', first.id), /not found/);
  store.getState().deleteListing('landlord-1', first.id);
  assert.equal(store.getState().listings.some(item => item.id === first.id), false);

  const saved = JSON.parse(localStorage.getItem('betkiray-owner-listings'));
  assert.equal(saved.state.listings.length, 1);
  assert.equal(saved.state.listings[0].ownerId, 'landlord-2');
});

test('local auth store supports demo login, registration, and logout persistence', async () => {
  const store = useAuthStore;
  await store.persist.rehydrate();
  store.setState({ currentUser: null, isAuthenticated: false });

  await assert.rejects(store.getState().register('A', 'new@example.com', 'password321', 'tenant'), /at least 2 characters/);
  await assert.rejects(store.getState().register('New Tenant', 'not-an-email', 'password321', 'tenant'), /valid email/);
  await assert.rejects(store.getState().register('New Tenant', 'new@example.com', 'short', 'tenant'), /at least 8 characters/);
  await assert.rejects(store.getState().register('New Tenant', 'new@example.com', 'password321', 'admin'), /Choose landlord or tenant/);

  const landlord = await store.getState().login('LANDLORD@test.com', 'password123');
  assert.equal(landlord.role, 'landlord');
  assert.equal('passwordHash' in landlord, false);
  store.getState().logout();
  assert.equal(store.getState().isAuthenticated, false);

  const tenant = await store.getState().login('tenant@test.com', 'password123');
  assert.equal(tenant.role, 'tenant');
  await assert.rejects(store.getState().login('tenant@test.com', 'incorrect'), /incorrect/);

  const registered = await store.getState().register('New Landlord', 'NEW@TEST.COM', 'password321', 'landlord');
  assert.equal(registered.email, 'new@test.com');
  assert.equal(registered.role, 'landlord');
  assert.equal(store.getState().isAuthenticated, true);
  await assert.rejects(store.getState().register('Duplicate', 'new@test.com', 'password321', 'tenant'), /already exists/);
});
