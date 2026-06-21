/* ===== Pellmaro storefront logic ===== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const dh = n => n.toLocaleString('fr-FR') + ' dh';
const byId = id => PRODUCTS.find(p => p.id === id);

let cart = [];
let pv = { product: null, size: null }; // current quick-view state

/* ---------- Announcement marquee ---------- */
(() => {
  const unit = ANNOUNCE.map(a =>
    `<span class="ann"><svg class="ann__i" viewBox="0 0 22 22" aria-hidden="true">${ANN_ICONS[a.i]||''}</svg>${a.t}</span><span class="ann__d" aria-hidden="true"></span>`
  ).join('');
  // repeat enough to fill very wide screens, then duplicate the whole block for a seamless -50% loop
  const half = unit.repeat(3);
  const track = $('#announceTrack');
  if(track) track.innerHTML = half + half;
})();

/* ---------- Render product cards ---------- */
function card(p){
  const off = Math.round((1 - p.price / p.compare) * 100);
  return `
  <article class="card" data-id="${p.id}">
    <div class="card__media">
      <span class="card__badge">${p.badge}</span>
      <img class="main" src="${p.images[0]}" alt="${p.name}" loading="lazy">
      <img class="alt" src="${p.images[1] || p.images[0]}" alt="" loading="lazy">
      <button class="card__quick" data-quick="${p.id}">Aperçu rapide</button>
    </div>
    <div class="card__body">
      <h3><span class="card__swatch" style="background:${p.swatch}"></span>${p.name}</h3>
      <div class="card__price"><span class="now">${dh(p.price)}</span><span class="was">${dh(p.compare)}</span></div>
    </div>
  </article>`;
}
$('#gridSabots').innerHTML = PRODUCTS.filter(p=>p.collection==='sabots').map(card).join('');
$('#gridSandales').innerHTML = PRODUCTS.filter(p=>p.collection==='sandales').map(card).join('');

/* ---------- Reviews ---------- */
$('#reviewsGrid').innerHTML = REVIEWS.map(r=>`
  <div class="review">
    <div class="review__stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
    <p>“${r.text}”</p>
    <div class="review__who"><span class="review__av">${r.name[0]}</span><div><strong>${r.name}</strong><span>${r.city}</span></div></div>
  </div>`).join('');

/* ---------- Instagram UGC grid ---------- */
$('#instaGrid').innerHTML = INSTAGRAM.posts.map(p=>`
  <a class="insta__cell" href="${INSTAGRAM.url}" target="_blank" rel="noopener" aria-label="Voir sur Instagram">
    <img src="${p.img}" alt="${p.cap.replace(/"/g,'&quot;')}" loading="lazy">
    <svg class="insta__ig" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
    <span class="insta__cap">${p.cap}</span>
  </a>`).join('');

/* ---------- Video reel (lazy <video> from CDN) ---------- */
$('#reelTrack').innerHTML = VIDEOS.map(v=>`
  <div class="reel__item"><video src="${v.src}"${v.poster?` poster="${v.poster}"`:''} autoplay muted loop playsinline preload="auto"></video></div>`).join('');
// kick off playback (some mobile browsers need an explicit play() after load)
$$('.reel__item video').forEach(v=>{ v.play().catch(()=>{}); });
// play on hover / auto-play when in view
const reelObs = new IntersectionObserver(es=>es.forEach(e=>{
  const vid = e.target.querySelector('video');
  if(e.isIntersecting){ vid.play().catch(()=>{}); } else { vid.pause(); }
}),{threshold:.5});
$$('.reel__item').forEach(i=>reelObs.observe(i));

/* Autoplay the atelier (process) video when in view */
const procVid = $('.process__video');
if(procVid){
  new IntersectionObserver(es=>es.forEach(e=>{
    const v=e.target.querySelector('video');
    if(e.isIntersecting){ v.play().catch(()=>{}); } else { v.pause(); }
  }),{threshold:.4}).observe(procVid);
}

/* ---------- Open / close helpers ---------- */
const overlay = $('#overlay');
function openMobile(){ $('#mobileNav').classList.add('open'); overlay.classList.add('show'); }
function closeAll(){
  $('#mobileNav').classList.remove('open');
  $('#cartDrawer').classList.remove('open');
  overlay.classList.remove('show');
}
$('#menuBtn').onclick = openMobile;
$('#mobileClose').onclick = closeAll;
overlay.onclick = closeAll;
$$('#mobileNav a').forEach(a=>a.onclick=closeAll);

/* ---------- Quick view ---------- */
function openQuick(id){
  const p = byId(id); pv = { product:p, size:null };
  const off = Math.round((1 - p.price / p.compare) * 100);
  $('#pvBadge').textContent = p.badge;
  $('#pvName').textContent = p.name;
  $('#pvPrice').textContent = dh(p.price);
  $('#pvCompare').textContent = dh(p.compare);
  $('#pvOff').textContent = `-${off}%`;
  $('#pvMain').src = p.images[0];
  $('#pvThumbs').innerHTML = p.images.map((im,i)=>`<img src="${im}" class="${i?'':'active'}" data-i="${i}" alt="">`).join('');
  $('#pvSizes').innerHTML = SIZES.map(s=>`<button data-size="${s}">${s}</button>`).join('');
  $('#productModal').classList.add('open');
}
$('#productModal').addEventListener('click', e=>{
  if(e.target.id==='productModal' || e.target.id==='modalClose'){ $('#productModal').classList.remove('open'); return; }
  const t = e.target.closest('[data-i]');
  if(t){ $('#pvMain').src = pv.product.images[t.dataset.i]; $$('#pvThumbs img').forEach(x=>x.classList.remove('active')); t.classList.add('active'); }
  const sz = e.target.closest('[data-size]');
  if(sz){ pv.size = sz.dataset.size; $$('#pvSizes button').forEach(x=>x.classList.remove('sel')); sz.classList.add('sel'); }
});
$('#modalClose').onclick = ()=>$('#productModal').classList.remove('open');

// grid clicks
document.addEventListener('click', e=>{
  const q = e.target.closest('[data-quick]');
  if(q){ e.stopPropagation(); openQuick(q.dataset.quick); return; }
  const c = e.target.closest('.card');
  if(c){ openQuick(c.dataset.id); }
});

/* ---------- Cart ---------- */
function addToCart(p, size, qty=1){
  if(!size){ flashSize(); return false; }
  const key = p.id + '-' + size;
  const found = cart.find(i=>i.key===key);
  if(found){ found.qty += qty; }
  else cart.push({ key, id:p.id, name:p.name, size, price:p.price, img:p.images[0], qty });
  renderCart(); bumpCart(); return true;
}
function flashSize(){
  const box = $('#pvSizes');
  box.animate([{boxShadow:'0 0 0 0 rgba(154,59,47,.4)'},{boxShadow:'0 0 0 6px rgba(154,59,47,0)'}],{duration:600});
  $('.field label').style.color = 'var(--sale)';
  setTimeout(()=>$('.field label').style.color='',1200);
}
function renderCart(){
  const body = $('#cartItems');
  if(!cart.length){ body.innerHTML = `<div class="drawer__empty">Votre panier est vide.<br>Découvrez nos sabots ✦</div>`; }
  else body.innerHTML = cart.map(i=>`
    <div class="cart-item" data-key="${i.key}">
      <img src="${i.img}" alt="">
      <div>
        <h4>${i.name}</h4>
        <div class="ci-meta">Pointure ${i.size}</div>
        <div class="ci-price">${dh(i.price)}</div>
        <div class="ci-qty"><button data-act="dec">−</button><span>${i.qty}</span><button data-act="inc">+</button></div>
      </div>
      <button class="ci-remove" data-act="rm">&times;</button>
    </div>`).join('');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  $('#cartTotal').textContent = dh(total);
  $('#cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);
}
function bumpCart(){
  const c = $('#cartCount');
  c.animate([{transform:'scale(1)'},{transform:'scale(1.5)'},{transform:'scale(1)'}],{duration:300});
}
$('#cartItems').addEventListener('click', e=>{
  const act = e.target.dataset.act; if(!act) return;
  const key = e.target.closest('.cart-item').dataset.key;
  const item = cart.find(i=>i.key===key);
  if(act==='inc') item.qty++;
  if(act==='dec') item.qty = Math.max(1,item.qty-1);
  if(act==='rm') cart = cart.filter(i=>i.key!==key);
  renderCart();
});
$('#cartBtn').onclick = ()=>{ $('#cartDrawer').classList.add('open'); overlay.classList.add('show'); };
$('#cartClose').onclick = closeAll;

$('#pvAdd').onclick = ()=>{ if(addToCart(pv.product, pv.size)){ $('#productModal').classList.remove('open'); $('#cartBtn').click(); } };
$('#pvBuy').onclick = ()=>{ if(addToCart(pv.product, pv.size)){ $('#productModal').classList.remove('open'); openOrder(); } };

/* ---------- Order (Cash on Delivery) ---------- */
function openOrder(){
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const first = cart[0];
  $('#orderSummary').innerHTML = first ? `
    <img src="${first.img}" alt="">
    <div><strong>${cart.length} article${cart.length>1?'s':''}</strong><br><span class="muted">${first.name}${cart.length>1?' + autres':''}</span></div>` : '';
  $('#orderTotal').textContent = dh(total);
  $('#orderSuccess').classList.remove('show');
  $('#orderForm').reset();
  closeAll();
  $('#orderModal').classList.add('open');
}
$('#checkoutBtn').onclick = ()=>{ if(cart.length) openOrder(); };
$('#orderClose').onclick = ()=>$('#orderModal').classList.remove('open');
$('#orderModal').addEventListener('click', e=>{ if(e.target.id==='orderModal') $('#orderModal').classList.remove('open'); });
const WHATSAPP_NUMBER = '212640200728'; // numéro Pellmaro (réception des commandes)
$('#orderForm').addEventListener('submit', e=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const c = { name:(fd.get('name')||'').trim(), phone:(fd.get('phone')||'').trim(),
              city:(fd.get('city')||'').trim(), address:(fd.get('address')||'').trim() };
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const lines = cart.map(i=>`• ${i.name} — pointure ${i.size} ×${i.qty} = ${dh(i.price*i.qty)}`).join('\n');
  const msg =
`🛍️ *Nouvelle commande — Pellmaro*

${lines}

*Total : ${dh(total)}*  (paiement à la livraison)

👤 ${c.name}
📞 ${c.phone}
📍 ${c.city} — ${c.address}`;

  // 1) Enregistre la commande dans l'espace pro (démo : localStorage ; prod : API/DB).
  const order = {
    id: 'PM-' + String(Date.now()).slice(-6),
    date: new Date().toISOString(),
    name:c.name, phone:c.phone, city:c.city, address:c.address,
    items: cart.map(i=>({name:i.name, size:i.size, qty:i.qty, price:i.price})),
    total, status:'Nouvelle'
  };
  try {
    const K='pellmaro_orders';
    const all = JSON.parse(localStorage.getItem(K) || '[]');
    all.unshift(order);
    localStorage.setItem(K, JSON.stringify(all));
  } catch(e){}

  // 2) Envoie aussi la commande au WhatsApp de la marque (flux COD standard au Maroc).
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

  $('#orderSuccess').classList.add('show');
  setTimeout(()=>{ cart=[]; renderCart(); $('#orderModal').classList.remove('open'); }, 3000);
});

/* ---------- Header shrink + scroll reveal ---------- */
window.addEventListener('scroll', ()=>{
  $('#header').style.boxShadow = window.scrollY>10 ? '0 6px 24px -16px rgba(18,18,18,.4)' : 'none';
});
[ '.section__head','.card','.split__media','.split__text','.story__text','.story__media','.steps li','.review','.guarantees>div','.insta__cell' ]
  .forEach(sel=>$$(sel).forEach(el=>el.classList.add('reveal')));
const rev = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); rev.unobserve(e.target); } }),{threshold:.12});
$$('.reveal').forEach((el,i)=>{ el.style.transitionDelay = (i%4*60)+'ms'; rev.observe(el); });

renderCart();
