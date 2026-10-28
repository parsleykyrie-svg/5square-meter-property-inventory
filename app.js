import { filterListings, medianPricePerSqm, toCSV } from './core.mjs';
const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
let listings=[], saved=new Set();
try { const items=JSON.parse(localStorage.getItem('5sqm-shortlist')||'[]'); if(Array.isArray(items)) saved=new Set(items.filter(x=>typeof x==='string')); } catch { $('notice').textContent='Browser storage is unavailable. Your shortlist will last for this visit only.'; }
function element(tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;return el;}
function render(){
 const rows=filterListings(listings,{search:$('search').value,city:$('city').value,budget:$('budget').value,status:$('status').value,sort:$('sort').value,onlySaved:$('only-saved').checked,saved});
 $('count').textContent=rows.length;const median=medianPricePerSqm(rows);$('median').textContent=median==null?'—':money(median);$('saved').textContent=saved.size;
 $('result-label').textContent=`${rows.length} fictional ${rows.length===1?'unit':'units'} shown · USD asking prices`;
 $('export').disabled=!saved.size;$('listings').replaceChildren();
 if(!rows.length)$('listings').append(element('p','No units match. Change the filters or add units to your shortlist.','empty'));
 for(const p of rows){
  const card=element('article','','card'),visual=element('div','','visual'),body=element('div','','body');
  visual.append(element('span',p.id,'unit-id'),element('span',p.status,'status'));
  body.append(element('p',`${p.city} / ${p.district}`,'location'),element('h2',p.project),element('p',`${p.area} m² · ${p.bedrooms} ${p.bedrooms===1?'bedroom':'bedrooms'}`,'details'),element('p',money(p.price),'price'),element('span',`${money(p.price/p.area)} / m²`,'per-area'));
  const button=element('button',saved.has(p.id)?'Remove from shortlist':'Add to shortlist');button.type='button';button.setAttribute('aria-pressed',String(saved.has(p.id)));button.setAttribute('aria-label',`${button.textContent}: ${p.project}, ${p.id}`);
  button.addEventListener('click',()=>{saved.has(p.id)?saved.delete(p.id):saved.add(p.id);try{localStorage.setItem('5sqm-shortlist',JSON.stringify([...saved]));}catch{$('notice').textContent='Shortlist changes could not be saved to browser storage.';}render();});
  body.append(button);card.append(visual,body);$('listings').append(card);
 }
}
$('filters').addEventListener('submit',e=>e.preventDefault());$('filters').addEventListener('input',render);$('only-saved').addEventListener('change',render);
$('export').addEventListener('click',()=>{const blob=new Blob([toCSV(listings.filter(p=>saved.has(p.id)))],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='5square-meter-shortlist.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
try{const response=await fetch('inventory.json');if(!response.ok)throw Error('Inventory request failed');listings=await response.json();if(!Array.isArray(listings)||listings.some(p=>!p.id||!p.project||!p.city||!p.district||!Number.isFinite(p.price)||p.price<0||!Number.isFinite(p.area)||p.area<=0||!Number.isFinite(p.bedrooms)||!['available','reserved','sold'].includes(p.status)))throw Error('Invalid inventory');saved=new Set([...saved].filter(id=>listings.some(p=>p.id===id)));render();}catch{$('result-label').textContent='Inventory could not be loaded. Serve this folder over HTTP and reload.';$('export').disabled=true;}
