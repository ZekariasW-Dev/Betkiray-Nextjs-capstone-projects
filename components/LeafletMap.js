'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from '@/i18n/navigation';
import { formatETB } from '@/lib/data';

export default function LeafletMap({ items }) {
  const center = items.length ? [items[0].latitude, items[0].longitude] : [9.03, 38.75];
  return <MapContainer center={center} zoom={items.length && items[0].city !== 'Addis Ababa' ? 12 : 12} scrollWheelZoom className="leaflet-map">
    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {items.map(item => <CircleMarker key={item.id} center={[item.latitude, item.longitude]} radius={8} pathOptions={{ color: '#14532d', fillColor: '#1d6b3a', fillOpacity: .88 }}>
      <Popup><div className="map-popup"><img src={item.images[0]} alt="" /><strong>{item.title}</strong><span>{formatETB(item.monthlyRent)} / month</span><small>{item.neighborhood}, {item.city} · approximate area</small><Link href={`/properties/${item.id}`}>View home</Link></div></Popup>
    </CircleMarker>)}
  </MapContainer>;
}
