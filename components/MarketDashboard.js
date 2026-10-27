'use client';

import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Building2, Home, MapPin, TrendingUp } from 'lucide-react';
import { properties, formatETB } from '@/lib/data';

const colors = ['#14532d', '#2d8050', '#6cab7e', '#d5a34c', '#86a997'];
export function MarketDashboard() {
  const [city, setCity] = useState('');
  const data = useMemo(() => properties.filter(item => !city || item.city === city), [city]);
  const metrics = useMemo(() => {
    const rents = data.map(item => item.monthlyRent).sort((a, b) => a - b);
    const mean = rents.length ? Math.round(rents.reduce((sum, value) => sum + value, 0) / rents.length) : 0;
    const midpoint = Math.floor(rents.length / 2);
    const median = rents.length
      ? rents.length % 2 ? rents[midpoint] : Math.round((rents[midpoint - 1] + rents[midpoint]) / 2)
      : 0;
    return { mean, median, min: rents[0] || 0, max: rents[rents.length - 1] || 0 };
  }, [data]);
  const neighborhoodData = Object.values(data.reduce((acc, item) => {
    acc[item.neighborhood] ||= { name: item.neighborhood, rent: 0, count: 0 };
    acc[item.neighborhood].rent += item.monthlyRent;
    acc[item.neighborhood].count += 1;
    return acc;
  }, {})).map(item => ({ ...item, rent: Math.round(item.rent / item.count) })).slice(0, 9);
  const typeData = Object.entries(data.reduce((acc, item) => { acc[item.propertyType] = (acc[item.propertyType] || 0) + 1; return acc; }, {})).map(([name, count]) => ({ name, count }));
  const bedroomData = Object.entries(data.reduce((acc, item) => { const key = item.bedrooms === 0 ? 'Studio' : `${item.bedrooms} bedroom${item.bedrooms > 1 ? 's' : ''}`; acc[key] = (acc[key] || 0) + 1; return acc; }, {})).map(([name, value]) => ({ name, value }));
  const cards = [['Listings', data.length, Home], ['Average listed rent', formatETB(metrics.mean), TrendingUp], ['Median listed rent', formatETB(metrics.median), Building2], ['Neighborhoods', new Set(data.map(item => item.neighborhood)).size, MapPin]];
  return <section className="container insights-page">
    <div className="insights-toolbar"><p>Explore asking rents and home features by city.</p><label>City<select className="form-control" value={city} onChange={e => setCity(e.target.value)}><option value="">All cities</option>{Array.from(new Set(properties.map(item => item.city))).map(item => <option key={item}>{item}</option>)}</select></label></div>
    <div className="metric-grid">{cards.map(([label, value, Icon]) => <div className="metric-card surface" key={label}><span className="metric-icon"><Icon size={18} /></span><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="metric-inline"><span>Lowest listed rent <strong>{formatETB(metrics.min)}</strong></span><span>Highest listed rent <strong>{formatETB(metrics.max)}</strong></span><span>Areas represented <strong>{new Set(data.map(item => item.neighborhood)).size}</strong></span></div>
    <div className="charts-grid">
      <ChartCard title="Average listed rent by neighborhood" subtitle="ETB per month"><ResponsiveContainer width="100%" height={280}><BarChart data={neighborhoodData} margin={{ left: 0, right: 14, bottom: 35 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 11 }} /><YAxis tickFormatter={n => `${Math.round(n / 1000)}k`} tick={{ fontSize: 11 }} /><Tooltip formatter={v => formatETB(v)} /><Bar dataKey="rent" fill="#1d6b3a" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Property type mix" subtitle="Listings by type"><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={typeData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={94} label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}>{typeData.map((item, i) => <Cell key={item.name} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></ChartCard>
      <ChartCard title="Homes by bedroom count" subtitle="Listings by size"><ResponsiveContainer width="100%" height={250}><BarChart data={bedroomData}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" name="Homes" fill="#d5a34c" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></ChartCard>
    </div>
    <div className="surface insights-table"><div><h2>Neighborhood snapshot</h2><p>Average asking rent and listing count by area.</p></div><table><thead><tr><th>Neighborhood</th><th>Homes</th><th>Average listed rent</th></tr></thead><tbody>{neighborhoodData.map(item => <tr key={item.name}><td>{item.name}</td><td>{item.count}</td><td>{formatETB(item.rent)} / mo</td></tr>)}</tbody></table></div>
  </section>;
}
function ChartCard({ title, subtitle, children }) { return <article className="chart-card surface"><h2>{title}</h2><p>{subtitle}</p>{children}</article>; }
