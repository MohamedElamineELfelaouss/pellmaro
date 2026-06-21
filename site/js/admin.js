/* Pellmaro — Espace commandes (dashboard) */
const KEY = 'pellmaro_orders';
const STATUSES = ['Nouvelle','Confirmée','Expédiée','Livrée','Annulée'];
const $ = s => document.querySelector(s);
const dh = n => Number(n).toLocaleString('fr-FR') + ' dh';

function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e){ return []; } }
function save(o){ localStorage.setItem(KEY, JSON.stringify(o)); }

/* Seed realistic demo orders the first time, so the dashboard looks alive for the pitch */
function seedIfEmpty(){
  if(load().length) return;
  const now = Date.now(), D = 86400000;
  const demo = [
    { id:'PM-481209', date:new Date(now-1*3600e3).toISOString(), name:'Salma Bennani', phone:'0661234567', city:'Casablanca', address:'Rue 12, Maârif',
      items:[{name:'Sabot en suède — Noir',size:39,qty:1,price:389}], total:389, status:'Nouvelle' },
    { id:'PM-481155', date:new Date(now-5*3600e3).toISOString(), name:'Yassine El Amrani', phone:'0640200111', city:'Rabat', address:'Av. Hassan II, Agdal',
      items:[{name:'Sabots Daim — Vert olive',size:42,qty:1,price:389},{name:'Sabot en suède — Gris',size:41,qty:1,price:389}], total:778, status:'Confirmée' },
    { id:'PM-480988', date:new Date(now-1*D).toISOString(), name:'Imane Karimi', phone:'0655987321', city:'Marrakech', address:'Quartier Gueliz',
      items:[{name:'Sandale Daim — Beige & Marron',size:38,qty:1,price:449}], total:449, status:'Expédiée' },
    { id:'PM-480842', date:new Date(now-2*D).toISOString(), name:'Omar Tahiri', phone:'0612345678', city:'Tanger', address:'Bd Mohamed V',
      items:[{name:'Sabot en suède — Bleu',size:44,qty:2,price:389}], total:778, status:'Livrée' },
    { id:'PM-480710', date:new Date(now-3*D).toISOString(), name:'Nadia Rachidi', phone:'0699112233', city:'Fès', address:'Route d\'Imouzzer',
      items:[{name:'Sabot en suède — Rose bébé / Violet',size:37,qty:1,price:389}], total:389, status:'Livrée' },
    { id:'PM-480655', date:new Date(now-4*D).toISOString(), name:'Karim Lahlou', phone:'0677889900', city:'Agadir', address:'Secteur Founty',
      items:[{name:'Sabots Daim — Bleu marine',size:43,qty:1,price:389}], total:389, status:'Annulée' }
  ];
  save(demo);
}

const WA_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11a8 8 0 1 1 3 6l-3 1 1-3a8 8 0 0 1-1-4Z"/></svg>';
const DEL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>';

function fmtDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'short'}) + ' · ' +
         d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
}
function itemsText(o){ return o.items.map(i=>`${i.name.replace('Pellmaro ','')} (${i.size}) ×${i.qty}`).join(', '); }
function isToday(iso){ const d=new Date(iso), n=new Date(); return d.toDateString()===n.toDateString(); }

/* ---- Stats ---- */
function renderStats(orders){
  const active = orders.filter(o=>o.status!=='Annulée');
  const ca = active.reduce((s,o)=>s+o.total,0);
  const today = orders.filter(o=>isToday(o.date)).length;
  const pending = orders.filter(o=>o.status==='Nouvelle').length;
  const cards = [
    {ic:'<path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>', v:orders.length, l:'Commandes'},
    {ic:'<path d="M3 7h13v8H3zM16 10h3l2 3v2h-5z"/><circle cx="7" cy="17" r="1.4"/><circle cx="17.5" cy="17" r="1.4"/>', v:today, l:'Aujourd\'hui'},
    {ic:'<path d="M12 8v5l3 2"/><circle cx="12" cy="12" r="9"/>', v:pending, l:'En attente'},
    {ic:'<path d="M3 17l5-5 4 4 8-9"/>', v:dh(ca), l:'Chiffre d\'affaires', accent:true}
  ];
  $('#stats').innerHTML = cards.map(c=>`
    <div class="stat ${c.accent?'stat--accent':''}">
      <div class="stat__ic"><svg viewBox="0 0 24 24">${c.ic}</svg></div>
      <div class="stat__v">${c.v}</div>
      <div class="stat__l">${c.l}</div>
    </div>`).join('');
}

/* ---- Table + mobile cards ---- */
function statusSelect(o){
  return `<select class="status st-${o.status}" data-id="${o.id}" data-act="status">
    ${STATUSES.map(s=>`<option ${s===o.status?'selected':''}>${s}</option>`).join('')}
  </select>`;
}
function render(){
  const all = load();
  const q = ($('#search').value||'').toLowerCase().trim();
  const sf = $('#filterStatus').value;
  let orders = all.filter(o=>{
    const hay = `${o.id} ${o.name} ${o.phone} ${o.city}`.toLowerCase();
    return (!q || hay.includes(q)) && (!sf || o.status===sf);
  });
  renderStats(all);

  const rows = $('#rows'), mcards = $('#mcards');
  if(!orders.length){
    const msg = all.length ? 'Aucune commande ne correspond à votre recherche.' :
      'Aucune commande pour l\'instant. <a href="index.html">Passez une commande test</a> sur la boutique.';
    rows.innerHTML = `<tr><td colspan="7"><div class="empty"><svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><div>${msg}</div></div></td></tr>`;
    mcards.innerHTML = `<div class="empty">${msg}</div>`;
    return;
  }
  rows.innerHTML = orders.map(o=>`
    <tr>
      <td class="c-id">${o.id}<small>${fmtDate(o.date)}</small></td>
      <td class="c-client"><b>${o.name}</b><small>${o.phone}</small></td>
      <td>${o.city}</td>
      <td class="c-items">${itemsText(o)}</td>
      <td class="c-total">${dh(o.total)}</td>
      <td>${statusSelect(o)}</td>
      <td><div class="row-act">
        <button class="iconbtn iconbtn--wa" title="Contacter le client" data-act="wa" data-id="${o.id}">${WA_ICON}</button>
        <button class="iconbtn iconbtn--del" title="Supprimer" data-act="del" data-id="${o.id}">${DEL_ICON}</button>
      </div></td>
    </tr>`).join('');
  mcards.innerHTML = orders.map(o=>`
    <div class="ocard">
      <div class="ocard__top">
        <div><b>${o.name}</b><small>${o.id} · ${fmtDate(o.date)}</small></div>
        <div class="c-total">${dh(o.total)}</div>
      </div>
      <div class="ocard__row"><span>Téléphone</span><span>${o.phone}</span></div>
      <div class="ocard__row"><span>Ville</span><span>${o.city}</span></div>
      <div class="ocard__row"><span>Articles</span><span style="text-align:right;max-width:60%">${itemsText(o)}</span></div>
      <div class="ocard__foot">
        ${statusSelect(o)}
        <button class="iconbtn iconbtn--wa" data-act="wa" data-id="${o.id}">${WA_ICON}</button>
        <button class="iconbtn iconbtn--del" data-act="del" data-id="${o.id}">${DEL_ICON}</button>
      </div>
    </div>`).join('');
}

/* ---- Actions ---- */
document.addEventListener('change', e=>{
  const sel = e.target.closest('[data-act="status"]'); if(!sel) return;
  const all = load(); const o = all.find(x=>x.id===sel.dataset.id);
  if(o){ o.status = sel.value; save(all); render(); }
});
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-act]'); if(!b) return;
  const id = b.dataset.id; const all = load(); const o = all.find(x=>x.id===id);
  if(b.dataset.act==='del'){
    if(confirm('Supprimer cette commande ?')){ save(all.filter(x=>x.id!==id)); render(); }
  }
  if(b.dataset.act==='wa' && o){
    const txt = `Bonjour ${o.name}, c'est Pellmaro 👋 Nous confirmons votre commande ${o.id} (${dh(o.total)}, paiement à la livraison). Pouvez-vous confirmer votre adresse à ${o.city} ?`;
    window.open(`https://wa.me/${o.phone.replace(/[^0-9]/g,'').replace(/^0/,'212')}?text=${encodeURIComponent(txt)}`,'_blank');
  }
});

/* ============================================================
   Export Excel — vrai fichier .xlsx (OOXML), sans librairie.
   On construit un ZIP (méthode "stored") contenant les parties XML.
   ============================================================ */
function xmlEsc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

const _crcTable = (()=>{ const t=[]; for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c = c&1 ? (0xEDB88320^(c>>>1)) : (c>>>1); t[n]=c>>>0; } return t; })();
function _crc32(b){ let c=0xFFFFFFFF; for(let i=0;i<b.length;i++) c=(c>>>8)^_crcTable[(c^b[i])&0xFF]; return (c^0xFFFFFFFF)>>>0; }
function _zip(files){
  const enc=new TextEncoder();
  const u16=n=>[n&255,(n>>8)&255];
  const u32=n=>[n&255,(n>>8)&255,(n>>16)&255,(n>>24)&255];
  const parts=[], central=[]; let offset=0;
  for(const f of files){
    const name=enc.encode(f.name), data=f.data, crc=_crc32(data), sz=data.length;
    const lh=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(sz),...u32(sz),...u16(name.length),...u16(0)]);
    parts.push(lh,name,data);
    central.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(sz),...u32(sz),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset)]),name);
    offset += lh.length+name.length+data.length;
  }
  const cstart=offset; let csize=0; central.forEach(c=>csize+=c.length);
  const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(csize),...u32(cstart),...u16(0)]);
  return new Blob([...parts,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function buildXlsx(orders){
  const enc=new TextEncoder();
  const header=['N° commande','Date','Client','Téléphone','Ville','Adresse','Articles','Total','Statut'];
  const L=i=>String.fromCharCode(65+i);
  const statusXf={'Nouvelle':7,'Confirmée':8,'Expédiée':9,'Livrée':10,'Annulée':11};
  const S=(ref,s,v)=>`<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${xmlEsc(v)}</t></is></c>`;
  const N=(ref,s,v)=>`<c r="${ref}" s="${s}"><v>${v}</v></c>`;

  let body = `<row r="1" ht="30" customHeight="1">`+S('A1',1,`Commandes Pellmaro — exporté le ${new Date().toLocaleDateString('fr-FR')}`)+`</row>`;
  body += `<row r="2" ht="22" customHeight="1">`+header.map((h,i)=>S(L(i)+'2',2,h)).join('')+`</row>`;
  orders.forEach((o,k)=>{
    const r=k+3, z=(k%2===1);
    const vals=[o.id, new Date(o.date).toLocaleString('fr-FR'), o.name, o.phone, o.city, o.address, itemsText(o), o.total, o.status];
    body += `<row r="${r}" ht="18" customHeight="1">`+vals.map((v,i)=>{
      const ref=L(i)+r;
      if(i===7) return N(ref, z?6:5, o.total);                  // Total (numérique + format dh)
      if(i===8) return S(ref, statusXf[o.status]||3, o.status); // Statut (cellule colorée)
      return S(ref, z?4:3, v);
    }).join('')+`</row>`;
  });
  const cols='<cols>'+[15,18,22,14,14,26,42,12,13].map((w,i)=>`<col min="${i+1}" max="${i+1}" width="${w}"/>`).join('')+'</cols>';
  const views='<sheetViews><sheetView workbookViewId="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>';
  const merge='<mergeCells count="1"><mergeCell ref="A1:I1"/></mergeCells>';
  const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0&quot; dh&quot;"/></numFmts><fonts count="9"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="15"/><color rgb="FF1C1A17"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF1C1A17"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFB9791F"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF2A6BB0"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF5B4BB3"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FF2F7D46"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFB23A2F"/><name val="Calibri"/></font></fonts><fills count="9"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1C1A17"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF6F3EC"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFBF0DD"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE4EEFA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEBE8FA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE6F4EA"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFBE7E4"/></patternFill></fill></fills><borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFE0DDD4"/></left><right style="thin"><color rgb="FFE0DDD4"/></right><top style="thin"><color rgb="FFE0DDD4"/></top><bottom style="thin"><color rgb="FFE0DDD4"/></bottom><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="12"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf><xf numFmtId="164" fontId="3" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf><xf numFmtId="164" fontId="3" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf><xf numFmtId="0" fontId="4" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="5" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="6" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="7" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="8" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${views}${cols}<sheetData>${body}</sheetData>${merge}</worksheet>`;
  const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
  const rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbook=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Commandes" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const wbRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  return _zip([
    {name:'[Content_Types].xml', data:enc.encode(contentTypes)},
    {name:'_rels/.rels', data:enc.encode(rels)},
    {name:'xl/workbook.xml', data:enc.encode(workbook)},
    {name:'xl/_rels/workbook.xml.rels', data:enc.encode(wbRels)},
    {name:'xl/styles.xml', data:enc.encode(styles)},
    {name:'xl/worksheets/sheet1.xml', data:enc.encode(sheet)}
  ]);
}
$('#exportBtn').onclick = ()=>{
  const orders = load();
  if(!orders.length){ alert('Aucune commande à exporter.'); return; }
  const blob = buildXlsx(orders);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `commandes-pellmaro-${new Date().toISOString().slice(0,10)}.xlsx`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
};

$('#search').addEventListener('input', render);
$('#filterStatus').addEventListener('change', render);

seedIfEmpty();
render();
