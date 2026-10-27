'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { propertySchema } from '@/lib/schemas';
import { useOwnerListings } from '@/hooks/useOwnerListings';

export function OwnerPropertyForm({ listingId, starter }) {
  const router = useRouter();
  const { data: listings = [], isLoading: isLoadingListings, addListing, updateListing } = useOwnerListings();
  const [saveError, setSaveError] = useState('');
  const ownerListing = listings.find(item => item.id === listingId);
  const existing = ownerListing || starter;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: existing?.title || '', description: existing?.description || '', city: existing?.city || 'Addis Ababa',
      neighborhood: existing?.neighborhood || '', address: existing?.address || '', propertyType: existing?.propertyType || 'Apartment',
      monthlyRent: existing?.monthlyRent || '', bedrooms: existing?.bedrooms ?? 1, bathrooms: existing?.bathrooms ?? 1,
      areaSqm: existing?.areaSqm || '', imageUrl: existing?.images?.[0] || '', furnished: existing?.furnished || false, parking: existing?.parking || false, petFriendly: existing?.petFriendly || false
    }
  });
  useEffect(() => { if (existing) reset({ title: existing.title, description: existing.description, city: existing.city, neighborhood: existing.neighborhood, address: existing.address, propertyType: existing.propertyType, monthlyRent: existing.monthlyRent, bedrooms: existing.bedrooms, bathrooms: existing.bathrooms, areaSqm: existing.areaSqm, imageUrl: existing.images?.[0] || '', furnished: existing.furnished, parking: existing.parking, petFriendly: existing.petFriendly }); }, [existing, reset]);
  async function submit(values, status) {
    setSaveError('');
    try {
      if (listingId) updateListing(listingId, values, status);
      else addListing(values, status);
      router.push('/owner-dashboard/listings');
    } catch (error) {
      setSaveError(error.message || 'Unable to save this listing.');
    }
  }
  const field = (name, label, props = {}, required = true) => {
    const error = errors[name];
    const errorId = `property-${name}-error`;
    return <label className="form-field"><span>{label}{required && <b> *</b>}</span><input className={`form-control ${error ? 'invalid' : ''}`} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} required={required} {...register(name)} {...props} />{error && <small className="error-text" id={errorId}>{error.message}</small>}</label>;
  };
  if (listingId && (isLoadingListings || !ownerListing)) return <div className="owner-property-form surface"><p>{isLoadingListings ? 'Loading listing…' : 'This listing was not found in your account.'}</p></div>;
  return <form className="owner-property-form surface" noValidate onSubmit={handleSubmit(values => submit(values, 'active'))}>
    <div className="form-section"><span className="eyebrow">01 · The basics</span><h2>Property information</h2><div className="form-grid">{field('title', 'Listing title', { placeholder: 'e.g. Bright two-bedroom home', maxLength: 100 })}<label className="form-field"><span>Property type <b> *</b></span><select className={`form-control ${errors.propertyType ? 'invalid' : ''}`} aria-invalid={Boolean(errors.propertyType)} aria-describedby={errors.propertyType ? 'property-propertyType-error' : undefined} required {...register('propertyType')}>{['Apartment','Condominium','Villa','Studio','Townhouse'].map(item => <option key={item}>{item}</option>)}</select>{errors.propertyType && <small className="error-text" id="property-propertyType-error">{errors.propertyType.message}</small>}</label><label className="form-field form-span"><span>Description <b> *</b></span><textarea className={`form-control ${errors.description ? 'invalid' : ''}`} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'property-description-error' : undefined} required maxLength={2000} rows={4} {...register('description')} placeholder="Describe the home and what makes it comfortable." />{errors.description && <small className="error-text" id="property-description-error">{errors.description.message}</small>}</label></div></div>
    <div className="form-section"><span className="eyebrow">02 · Location</span><h2>Where is it?</h2><div className="form-grid"><label className="form-field"><span>City <b> *</b></span><select className={`form-control ${errors.city ? 'invalid' : ''}`} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'property-city-error' : undefined} required {...register('city')}>{['Addis Ababa','Adama','Hawassa','Bahir Dar','Dire Dawa','Mekelle'].map(item => <option key={item}>{item}</option>)}</select>{errors.city && <small className="error-text" id="property-city-error">{errors.city.message}</small>}</label>{field('neighborhood', 'Neighborhood', { placeholder: 'e.g. Bole', maxLength: 80 })}{field('address', 'Address or area details', { placeholder: 'Street, landmark, or area', maxLength: 160 })}</div></div>
    <div className="form-section"><span className="eyebrow">03 · Details & pricing</span><h2>Home details</h2><div className="form-grid">{field('monthlyRent', 'Monthly rent (ETB)', { type: 'number', min: '1', max: '10000000', step: '1' })}{field('bedrooms', 'Bedrooms', { type: 'number', min: '0', max: '20', step: '1' })}{field('bathrooms', 'Bathrooms', { type: 'number', min: '1', max: '20', step: '1' })}{field('areaSqm', 'Floor area (m²)', { type: 'number', min: '1', max: '100000', step: 'any' })}{field('imageUrl', 'Image URL (optional)', { type: 'url', placeholder: 'https://example.com/home.jpg' }, false)}</div><div className="checkbox-row">{[['furnished','Furnished'],['parking','Parking available'],['petFriendly','Pet friendly']].map(([name,label]) => <label key={name}><input type="checkbox" {...register(name)} /> {label}</label>)}</div></div>
    {saveError && <p className="error-text" role="alert">{saveError}</p>}<div className="form-actions"><button type="button" className="btn btn-secondary" onClick={handleSubmit(values => submit(values, 'draft'))} disabled={isSubmitting}>Save as draft</button><button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving…' : listingId ? 'Save changes' : 'Create listing'}</button></div>
  </form>;
}
