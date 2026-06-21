# Pellmaro — Demo Storefront (redesign)

A modern, conversion-focused storefront concept for **Pellmaro**, built to pitch the brand
a better website. Brand identity (logo, sand accent `#baad83`, ink `#121212`, Barlow) is
preserved; the design is elevated with editorial layout, a Fraunces serif display pairing,
and a full purchase flow.

## What's inside
- **Sticky header** + animated announcement marquee, mobile drawer nav
- **Cinematic hero** with real product banner, trust stats, dual CTA
- **Trust bar** (cuir / semelle Espagne / finitions Maroc / paiement livraison)
- **Product grid** with hover image-swap, badges, **quick-view modal** (gallery + size picker)
- **Add-to-cart drawer** with qty controls + live total
- **Cash-on-delivery order form** (the brand's real sales model)
- Editorial split, **7-step fabrication timeline**, **video reel** (live from Shopify CDN),
  brand story, **reviews**, guarantees, FAQ accordion, newsletter, full footer
- WhatsApp float button, scroll-reveal animations, fully responsive (375 → 1440px)

## Run it
No build step. Either open via a tiny static server:
```bash
cd site
python -m http.server 8000
# visit http://127.0.0.1:8000
```
(Use a server rather than double-clicking the file so the JS modules/images resolve cleanly.)

## Stack
Plain HTML + CSS + vanilla JS — zero dependencies, instant load, trivial to host
(Vercel / Netlify / any static host). Easy to later port to Next.js + Shopify Storefront API.

## Files
```
site/
├── index.html        # all sections
├── css/styles.css    # design system (brand tokens) + components
├── js/data.js        # catalogue (real scraped products/prices/images)
└── js/app.js         # cart, quick-view, COD order, reveal logic
```

## Orders dashboard (the value-add) — `admin.html`
A professional **back-office** the brand actually runs their day on — not just a spreadsheet:
- **Stat cards**: total orders, today's orders, pending, and chiffre d'affaires (revenue).
- **Orders table**: order #, date, client + phone, city, items, total.
- **Status workflow**: Nouvelle → Confirmée → Expédiée → Livrée / Annulée (color-coded, one click; persists).
- **Search & filter** by name / phone / city / order # and by status.
- **One-click "Exporter (Excel)"** → downloads a UTF-8 CSV (opens straight in Excel, FR `;` separator).
- **Contact client** button → opens WhatsApp pre-filled to that customer.
- Responsive (table on desktop, cards on mobile). Linked from the storefront footer ("Espace commandes").

Demo storage = `localStorage` (key `pellmaro_orders`), seeded with sample orders so it looks alive.
Every real order placed on the store appears here instantly. **To go production**, swap the
`localStorage` read/write for a DB/API call (or mirror to a Google Sheet) — the data shape is ready.

## Where orders go
The COD order form (`#orderForm` in `js/app.js`) now **forwards each order to WhatsApp**:
on submit it builds a formatted message (items, sizes, qty, total, customer name/phone/city/address)
and opens `https://wa.me/212640200728?text=…`. The customer taps **Envoyer** and the order lands
in Pellmaro's WhatsApp. Zero backend — the standard COD flow in Morocco.
Change the destination number via `WHATSAPP_NUMBER` in `js/app.js`.

### Upgrade paths (optional, for a real orders log)
- **Google Sheet** — add a `fetch(POST)` to a Google Apps Script web-app URL in the submit handler;
  every order appends a row. Free, no server. (Can run *alongside* the WhatsApp open.)
- **Email** — a no-code form service (Web3Forms / Formspree): `fetch(POST)` their endpoint.
- **Real backend / Shopify** — POST to your API or create a Shopify draft order via the Storefront API.

## Other production next steps
- Replace the demo reviews with real ones.
- Get permission to repost the Instagram UGC photos/reels before going public.
