const photo = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;

const neighborhoods = [
  { name: 'Bole', city: 'Addis Ababa', slug: 'bole', rent: 42000, count: 18, image: photo('photo-1600607687939-ce8a6c25118c'), description: 'A lively, well-connected district with cafés, shops, offices, and easy access to the airport.', landmarks: ['Bole International Airport', 'Edna Mall'], amenities: ['Restaurants', 'Shopping', 'Transport'] },
  { name: 'Kazanchis', city: 'Addis Ababa', slug: 'kazanchis', rent: 36000, count: 12, image: photo('photo-1600210492486-724fe5c67fb0'), description: 'A central business district with a mix of modern apartments, hotels, and everyday conveniences.', landmarks: ['UNECA', 'Meskel Square'], amenities: ['Transit', 'Restaurants', 'Offices'] },
  { name: 'CMC', city: 'Addis Ababa', slug: 'cmc', rent: 24500, count: 14, image: photo('photo-1600607687920-4e2a09cf159d'), description: 'A growing residential area with newer housing, local markets, and a relaxed suburban feel.', landmarks: ['CMC Road', 'Gurd Shola'], amenities: ['Markets', 'Parking', 'Schools'] },
  { name: 'Ayat', city: 'Addis Ababa', slug: 'ayat', rent: 19500, count: 10, image: photo('photo-1600566753086-00f18fb6b3ea'), description: 'An expanding neighborhood with accessible housing options and a strong local community.', landmarks: ['Ayat Junction', 'Bole Arabsa'], amenities: ['Markets', 'Transport', 'Parks'] },
  { name: 'Megenagna', city: 'Addis Ababa', slug: 'megenagna', rent: 29000, count: 9, image: photo('photo-1600607687939-ce8a6c25118c'), description: 'A major transport hub connecting north and east Addis with convenient shopping and services.', landmarks: ['Megenagna Circle', 'Century Mall'], amenities: ['Transit', 'Shopping', 'Clinics'] },
  { name: 'Sar Bet', city: 'Addis Ababa', slug: 'sar-bet', rent: 33000, count: 8, image: photo('photo-1600210492486-724fe5c67fb0'), description: 'A central residential district known for its established streets and proximity to key destinations.', landmarks: ['Sar Bet Square', 'Africa Avenue'], amenities: ['Restaurants', 'Transit', 'Clinics'] },
  { name: 'Piassa', city: 'Addis Ababa', slug: 'piassa', rent: 22000, count: 11, image: photo('photo-1600566753086-00f18fb6b3ea'), description: 'Historic central Addis with distinctive character, busy streets, and a wide range of local services.', landmarks: ['St. George Cathedral', 'National Museum'], amenities: ['Markets', 'Culture', 'Transit'] },
  { name: 'Bahir Dar Centre', city: 'Bahir Dar', slug: 'bahir-dar-centre', rent: 16500, count: 7, image: photo('photo-1600607687920-4e2a09cf159d'), description: 'A convenient city-center base close to Lake Tana, local businesses, and the waterfront.', landmarks: ['Lake Tana', 'Bahir Dar Stadium'], amenities: ['Waterfront', 'Markets', 'Transit'] }
];

const places = [
  ['Bole', 8.995, 38.785], ['Kazanchis', 9.013, 38.765], ['CMC', 9.040, 38.820], ['Ayat', 9.050, 38.855],
  ['Megenagna', 9.020, 38.805], ['Sar Bet', 8.990, 38.750], ['Piassa', 9.035, 38.750], ['Bahir Dar Centre', 11.593, 37.390],
  ['Summit', 9.015, 38.870], ['Old Airport', 8.985, 38.775], ['Gurd Shola', 9.035, 38.795], ['Adama Centre', 8.540, 39.270],
  ['Hawassa Centre', 7.050, 38.480], ['Dire Dawa Centre', 9.590, 41.860], ['Mekelle Centre', 13.500, 39.470]
];
const types = ['Apartment', 'Condominium', 'Villa', 'Studio', 'Townhouse'];
const titles = ['Bright family apartment', 'Contemporary city home', 'Quiet garden residence', 'Spacious corner apartment', 'Sunny furnished studio', 'Modern two-bedroom home', 'Newly finished townhouse', 'Calm courtyard apartment'];
const amenitiesList = [['Internet', 'Balcony', 'Security'], ['Parking', 'Laundry', 'Security'], ['Internet', 'Garden', 'Pet-friendly'], ['Balcony', 'Water tank', 'Generator'], ['Security', 'Furnished', 'Internet'], ['Parking', 'Balcony', 'Laundry']];
const imageIds = ['photo-1600607687939-ce8a6c25118c', 'photo-1600210492486-724fe5c67fb0', 'photo-1600607687920-4e2a09cf159d', 'photo-1600566753086-00f18fb6b3ea', 'photo-1600585154340-be6161a56a0c', 'photo-1600573472591-ee6b68d14c68'];

export const properties = Array.from({ length: 36 }, (_, index) => {
  const [neighborhood, latitude, longitude] = places[index % places.length];
  const cityByNeighborhood = { 'Bahir Dar Centre': 'Bahir Dar', 'Adama Centre': 'Adama', 'Hawassa Centre': 'Hawassa', 'Dire Dawa Centre': 'Dire Dawa', 'Mekelle Centre': 'Mekelle' };
  const city = cityByNeighborhood[neighborhood] || 'Addis Ababa';
  const bedrooms = index % 5;
  return {
    id: `home-${String(index + 1).padStart(3, '0')}`,
    title: `${titles[index % titles.length]}${bedrooms ? ` in ${neighborhood}` : ''}`,
    city,
    neighborhood,
    address: `${12 + index} ${['Africa Avenue', 'Bole Road', 'Cape Verde Street', 'Cameroon Street'][index % 4]}`,
    propertyType: types[index % types.length],
    monthlyRent: 12000 + ((index * 7913) % 49000),
    bedrooms,
    bathrooms: Math.max(1, Math.ceil(bedrooms / 2)),
    areaSqm: 38 + ((index * 17) % 115),
    furnished: index % 3 === 0,
    parking: index % 2 === 0,
    petFriendly: index % 4 === 0,
    amenities: amenitiesList[index % amenitiesList.length],
    images: [photo(imageIds[index % imageIds.length]), photo(imageIds[(index + 2) % imageIds.length])],
    latitude: latitude + (index % 5) * 0.0017,
    longitude: longitude + (index % 4) * 0.0018,
    status: 'available',
    createdAt: `2026-0${1 + (index % 9)}-${String(1 + ((index * 3) % 27)).padStart(2, '0')}`,
    description: `A thoughtfully laid-out ${types[index % types.length].toLowerCase()} in ${neighborhood}, with practical features for comfortable everyday living. The home has bright rooms, useful storage, and convenient access to local shops and transport.`,
    owner: {
      name: ['Abebe Girma', 'Tigist Haile', 'Dawit Bekele', 'Meron Tadesse', 'Samuel Tesfaye'][index % 5],
      phone: `+2519${String(10000000 + ((index * 7331) % 89999999)).slice(0, 8)}`,
      whatsapp: `+2519${String(10000000 + ((index * 7331) % 89999999)).slice(0, 8)}`,
      email: `owner${index + 1}@betkiray.et`,
      responseTime: ['Usually responds within 1 hour', 'Usually responds within 3 hours', 'Usually responds same day'][index % 3],
    },
    demo: true
  };
});

export { neighborhoods };
export const propertyTypes = types;
export function formatETB(value) {
  return `ETB ${new Intl.NumberFormat('en-ET', { maximumFractionDigits: 0 }).format(value)}`;
}
export function filterProperties(items, filters = {}) {
  const filtered = items.filter(property =>
    (!filters.city || property.city === filters.city) &&
    (!filters.neighborhood || property.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) &&
    (!filters.propertyType || property.propertyType === filters.propertyType) &&
    (!filters.bedrooms || property.bedrooms >= Number(filters.bedrooms)) &&
    (!filters.bathrooms || property.bathrooms >= Number(filters.bathrooms)) &&
    (!filters.minPrice || property.monthlyRent >= Number(filters.minPrice)) &&
    (!filters.maxPrice || property.monthlyRent <= Number(filters.maxPrice)) &&
    (!filters.furnished || String(property.furnished) === filters.furnished) &&
    (!filters.parking || String(property.parking) === filters.parking) &&
    (!filters.petFriendly || String(property.petFriendly) === filters.petFriendly) &&
    (!filters.amenity || property.amenities.some(item => item.toLowerCase() === filters.amenity.toLowerCase())) &&
    (!filters.search || `${property.title} ${property.neighborhood} ${property.city}`.toLowerCase().includes(filters.search.toLowerCase()))
  );
  if (filters.sort === 'price-asc') return filtered.sort((a, b) => a.monthlyRent - b.monthlyRent);
  if (filters.sort === 'price-desc') return filtered.sort((a, b) => b.monthlyRent - a.monthlyRent);
  if (filters.sort === 'newest') return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return filtered;
}
