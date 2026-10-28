export function filterListings(listings, filters = {}) {
 const q = (filters.search || '').trim().toLowerCase();
 const max = filters.budget === '' || filters.budget == null ? Infinity : Number(filters.budget);
 const rows = listings.filter(p => (!q || `${p.project} ${p.district} ${p.id}`.toLowerCase().includes(q)) && (!filters.city || p.city === filters.city) && (!filters.status || p.status === filters.status) && Number.isFinite(p.price) && p.price <= max && (!filters.onlySaved || filters.saved.has(p.id)));
 return rows.sort((a,b) => filters.sort === 'price-desc' ? b.price-a.price : filters.sort === 'area-desc' ? b.area-a.area : a.price-b.price);
}
export function medianPricePerSqm(rows) {
 const values = rows.filter(p => p.area > 0 && Number.isFinite(p.price)).map(p => p.price/p.area).sort((a,b)=>a-b);
 if (!values.length) return null;
 const m=Math.floor(values.length/2); return values.length%2 ? values[m] : (values[m-1]+values[m])/2;
}
export function toCSV(rows) {
 const escape = v => '"'+String(v).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
 const fields=['id','project','city','district','area','bedrooms','price','status'];
 return [fields.join(','),...rows.map(p=>fields.map(f=>escape(p[f])).join(','))].join('\r\n');
}
