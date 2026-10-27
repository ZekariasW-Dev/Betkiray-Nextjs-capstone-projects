import { z } from 'zod';

const requiredNumber = (label, schema) => z.preprocess(
  value => typeof value === 'string' && value.trim() === '' ? undefined : value,
  z.coerce.number({ invalid_type_error: `Enter a valid ${label}.` }).pipe(schema)
);

export const propertySchema = z.object({
  title: z.string().trim().min(5, 'Add a descriptive title of at least 5 characters.').max(100, 'Keep the title under 100 characters.'),
  description: z.string().trim().min(20, 'Description should be at least 20 characters.').max(2000, 'Keep the description under 2,000 characters.'),
  city: z.enum(['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Mekelle'], {
    errorMap: () => ({ message: 'Choose a city from the list.' })
  }),
  neighborhood: z.string().trim().min(2, 'Enter a neighborhood.').max(80, 'Keep the neighborhood under 80 characters.'),
  address: z.string().trim().min(4, 'Enter an address.').max(160, 'Keep the address under 160 characters.'),
  propertyType: z.enum(['Apartment', 'Condominium', 'Villa', 'Studio', 'Townhouse'], {
    errorMap: () => ({ message: 'Choose a property type.' })
  }),
  monthlyRent: requiredNumber('monthly rent', z.number().int('Rent must be a whole amount in ETB.').positive('Rent must be greater than zero.').max(10000000, 'Enter a monthly rent below ETB 10,000,000.')),
  bedrooms: requiredNumber('bedroom count', z.number().int('Bedrooms must be a whole number.').min(0, 'Bedrooms cannot be negative.').max(20, 'Enter 20 bedrooms or fewer.')),
  bathrooms: requiredNumber('bathroom count', z.number().int('Bathrooms must be a whole number.').min(1, 'A home must have at least one bathroom.').max(20, 'Enter 20 bathrooms or fewer.')),
  areaSqm: requiredNumber('floor area', z.number().positive('Area must be greater than zero.').max(100000, 'Enter a floor area below 100,000 m².')),
  imageUrl: z.union([
    z.string().trim().max(2048, 'Keep the image URL under 2,048 characters.').url('Enter a valid image URL.').refine(value => /^https?:\/\//i.test(value), 'Image URLs must start with http:// or https://.'),
    z.literal('')
  ]).optional(),
  furnished: z.boolean().default(false),
  parking: z.boolean().default(false),
  petFriendly: z.boolean().default(false)
});
