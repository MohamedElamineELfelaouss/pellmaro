# Pellmaro demo — deploy & pitch kit

You send a **link**, not files. The `dist/` folder is the protected, minified build to deploy.
Keep `site/` as your private editable source.

> Before deploying: open `dist/index.html` and replace **[Votre nom]** in the demo badge
> `title` with your name (and in the footer credit if you want).

---

## 1. Deploy (pick one — both free, ~2 min)

### Option A — Netlify Drop (easiest, no install)
1. Go to **https://app.netlify.com/drop**
2. Drag the **`dist`** folder onto the page.
3. You instantly get a URL like `https://gentle-otter-1234.netlify.app`.
4. (Recommended) Create a free account to keep the site, then **Site settings → rename**
   to something like `pellmaro-concept.netlify.app`.

### Option B — Vercel CLI
```bash
npm i -g vercel
cd dist
vercel            # logs in via browser, accept the defaults
vercel --prod     # gives the final URL
```

### Keeping it private / revocable
- The **watermark** ("Démo · concept") is already on every page, so it can't be used as a real live site.
- Only share the URL with Pellmaro — don't post it publicly.
- **Password protection** (so even the link needs a password) is a paid feature on
  Netlify/Vercel. Free alternative: Cloudflare Pages + Cloudflare Access (email-gated).
  For a first pitch, an unlisted URL + watermark is plenty.
- You can **delete the deployment anytime** after they reply.

> ⚠️ Honesty: any front-end can be viewed in the browser. The watermark + private link +
> minified code make casual copying pointless; your real protection is that the **backend,
> the real orders database and the admin login don't exist in this demo** — that's the paid build.

---

## 2. Message to send

### A) WhatsApp / Instagram DM (short — Pellmaro is active on both)
```
Bonjour l'équipe Pellmaro 👋

Je suis [Votre nom], développeur web. J'adore votre marque et vos mules en cuir —
du coup j'ai réalisé, gratuitement et sans engagement, une version modernisée de
votre site pour vous montrer ce qui est possible.

C'est plus rapide, plus haut de gamme, et pensé pour vendre (paiement à la livraison,
tunnel de commande simplifié). J'y ai même ajouté un espace de gestion des commandes
avec export Excel.

👉 Démo privée : [VOTRE_URL]

Dites-moi ce que vous en pensez ? Je peux vous l'expliquer en 10 min quand vous voulez.
```

### B) Email (plus complet)
**Objet :** Une version modernisée de votre site Pellmaro (démo gratuite)

```
Bonjour,

Je m'appelle [Votre nom], je suis développeur web full-stack.

Je suis tombé sur Pellmaro et j'ai beaucoup aimé vos modèles en cuir. En tant que
développeur, j'ai vu quelques points qui pourraient augmenter vos ventes — alors
j'ai pris l'initiative de recréer une version modernisée de votre site, gratuitement
et sans aucun engagement, pour vous montrer concrètement le potentiel.

Ce que la démo apporte :
• Un design plus haut de gamme, fidèle à votre identité (logo, couleurs).
• Un site plus rapide et 100% responsive (mobile soigné).
• Un tunnel de commande optimisé pour le paiement à la livraison.
• En bonus : un espace de gestion des commandes (statuts, recherche, export Excel).

👉 Démo (lien privé) : [VOTRE_URL]

Si ça vous parle, je serais ravi d'en discuter 10 minutes pour vous montrer les détails
et voir comment on pourrait l'adapter et la mettre en ligne pour vous.

Bien à vous,
[Votre nom]
[Téléphone / WhatsApp] — [email]
```

> Tip: send the DM first (faster reply), keep the email as the formal follow-up.

---

## 3. After they reply
- Interested → propose a 10-min call, then a quote. **Take a deposit (30–50%) before
  delivering source.** Full source + the real backend/admin (database + login) on final payment.
- The live build replaces the demo's `localStorage` with a real database + protected
  admin login (see `site/README.md` → "how it works in the real world").

---

## Rebuilding `dist/` after edits
If you change anything in `site/`, regenerate the deploy build:
```bash
python build.py        # (the minify script) — or just re-copy site/ if you skip minifying
```
(Optional cleanup: `dist/assets/img` keeps all originals ~50 MB; you can delete unused
images to shrink the deploy, but it's not required — it hosts fine as-is.)
