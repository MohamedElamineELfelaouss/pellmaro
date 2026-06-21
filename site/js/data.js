/* Pellmaro — catalogue (données réelles extraites de pellmaro.ma) */
const IMG = 'assets/img/';

/* Bandeau d'annonce (icône + message) */
const ANNOUNCE = [
  { i:'truck',  t:'Livraison partout au Maroc' },
  { i:'wallet', t:'Paiement à la livraison' },
  { i:'refresh',t:'Échange gratuit sous 7 jours' },
  { i:'leaf',   t:'Cuir véritable façonné au Maroc' }
];
const ANN_ICONS = {
  truck:'<path d="M2 7h12v8H2z"/><path d="M14 10h4l3 3v2h-7z"/><circle cx="6" cy="16.5" r="1.6"/><circle cx="17.5" cy="16.5" r="1.6"/>',
  wallet:'<rect x="2.5" y="5.5" width="17" height="12" rx="2"/><path d="M2.5 9.5h17"/><circle cx="15.5" cy="13" r="1.1" fill="currentColor" stroke="none"/>',
  refresh:'<path d="M4 11a7 7 0 0 1 11.5-4.3L18 9"/><path d="M18 4v5h-5"/><path d="M20 13a7 7 0 0 1-11.5 4.3L6 15"/><path d="M6 20v-5h5"/>',
  leaf:'<path d="M5 19c0-7 5-12 14-13 0 9-5 14-13 14-1 0-1-1-1-1Z"/><path d="M5 19c3-4 6-6 10-7"/>'
};

const PRODUCTS = [
  {
    id: 'sabot-bleu', collection: 'sabots',
    name: 'Sabot en suède — Bleu',
    color: 'Bleu', swatch: '#2f4a6b',
    price: 389, compare: 520,
    images: [IMG+'13.png', IMG+'8.png', IMG+'ChatGPTImageFeb16_2026_01_23_25PM.png', IMG+'161.jpg'],
    badge: 'SAVE 25%'
  },
  {
    id: 'sabot-gris', collection: 'sabots',
    name: 'Sabot en suède — Gris',
    color: 'Gris', swatch: '#8a8a8a',
    price: 389, compare: 520,
    images: [IMG+'15.png', IMG+'10.png', IMG+'ChatGPT_Image_Feb_16_2026_01_17_29_PM.png', IMG+'163.jpg'],
    badge: 'SAVE 25%'
  },
  {
    id: 'sabot-noir', collection: 'sabots',
    name: 'Sabot en suède — Noir',
    color: 'Noir', swatch: '#1a1a1a',
    price: 389, compare: 520,
    images: [IMG+'16.png', IMG+'7.png', IMG+'ChatGPT_Image_Feb_16_2026_01_24_58_PM_e1afcb42-a880-4b14-9bc9-c63e1728f3e8.png', IMG+'162.jpg'],
    badge: 'SAVE 25%'
  },
  {
    id: 'sabot-marron', collection: 'sabots',
    name: 'Sabot en suède — Marron',
    color: 'Marron', swatch: '#6b4a2f',
    price: 389, compare: 520,
    images: [IMG+'ChatGPTImage28mars2026_16_11_57.png', IMG+'ChatGPTImage28mars2026_16_11_51.png', IMG+'ChatGPTImage28mars2026_16_11_54.png', IMG+'ChatGPTImage28mars2026_16_12_23.png'],
    badge: 'SAVE 25%'
  },
  {
    id: 'sabot-rose', collection: 'sabots',
    name: 'Sabot en suède — Rose bébé / Violet',
    color: 'Rose / Violet', swatch: '#c9a3c9',
    price: 389, compare: 520,
    images: [IMG+'rn-image_picker_lib_temp_87709bab-f1ce-444f-aecc-918fa63135ef.png', IMG+'ChatGPTImageFeb15_2026_05_52_36PM.png', IMG+'ChatGPTImageFeb16_2026_01_20_23PM.png', IMG+'165.jpg'],
    badge: 'SAVE 25%'
  },
  {
    id: 'sabot-beige', collection: 'sabots',
    name: 'Sabot en suède — Beige',
    color: 'Beige', swatch: '#cbb487',
    price: 389, compare: 520,
    images: [IMG+'18.png', IMG+'11.png', IMG+'164.jpg'],
    badge: 'SAVE 25%'
  },
  {
    id: 'sabot-olive', collection: 'sabots',
    name: 'Sabots Daim — Vert olive',
    color: 'Vert olive', swatch: '#6b6a3a',
    price: 389, compare: 599,
    images: [IMG+'IMG_1406.jpg', IMG+'IMG_1405.jpg', IMG+'IMG_1399.jpg', IMG+'IMG_1402.jpg'],
    badge: 'SAVE 35%'
  },
  {
    id: 'sabot-marine', collection: 'sabots',
    name: 'Sabots Daim — Bleu marine',
    color: 'Bleu marine', swatch: '#26344d',
    price: 389, compare: 599,
    images: [IMG+'IMG_1407.jpg', IMG+'IMG_1408.jpg', IMG+'IMG_1404.jpg', IMG+'IMG_1403.jpg'],
    badge: 'SAVE 35%'
  },
  {
    id: 'sandale-beige', collection: 'sandales',
    name: 'Sandale Daim — Beige & Marron',
    color: 'Beige & Marron', swatch: '#c2a06b',
    price: 449, compare: 599,
    images: [IMG+'ChatGPT_Image_Jun_20_2026_01_27_25_AM_5.png', IMG+'ChatGPT_Image_Jun_20_2026_01_27_25_AM_4.png', IMG+'ChatGPT_Image_Jun_20_2026_01_27_25_AM_2.png', IMG+'ChatGPT_Image_Jun_20_2026_01_27_25_AM_3.png'],
    badge: 'NOUVEAU'
  },
  {
    id: 'sandale-noir', collection: 'sandales',
    name: 'Sandale Daim — Noir',
    color: 'Noir', swatch: '#1a1a1a',
    price: 449, compare: 599,
    images: [IMG+'ChatGPTImageJun20_2026_01_17_34AM.png', IMG+'ChatGPTImageJun20_2026_01_17_28AM.png', IMG+'ChatGPTImageJun20_2026_01_17_19AM.png', IMG+'ChatGPTImageJun20_2026_01_17_11AM.png'],
    badge: 'NOUVEAU'
  }
];

const SIZES = [36,37,38,39,40,41,42,43,44,45,46];

/* Vidéos réelles de la marque (HD vertical), 100% locales — démo autonome.
   ig-1/ig-2 = reels produits (Instagram). hero-* = clips portés au quotidien.
   ig-3 (atelier/fabrication) est mis en avant dans la section Process. */
const VIDEOS = [
  { src:'assets/video/ig-1.mp4', poster:'assets/video/posters/ig-1.jpg' },
  { src:'assets/video/hero-1.mp4', poster:'assets/video/posters/hero-1.jpg' },
  { src:'assets/video/hero-2.mp4', poster:'assets/video/posters/hero-2.jpg' },
  { src:'assets/video/hero-3.mp4', poster:'assets/video/posters/hero-3.jpg' },
  { src:'assets/video/hero-4.mp4', poster:'assets/video/posters/hero-4.jpg' },
  { src:'assets/video/hero-5.mp4', poster:'assets/video/posters/hero-5.jpg' },
  { src:'assets/video/hero-6.mp4', poster:'assets/video/posters/hero-6.jpg' },
  { src:'assets/video/hero-7.mp4', poster:'assets/video/posters/hero-7.jpg' }
];

/* Communauté Instagram — @pellmaro_officiel (15K abonnés · 185 publications) */
const INSTAGRAM = {
  handle: 'pellmaro_officiel',
  url: 'https://www.instagram.com/pellmaro_officiel',
  followers: '15K',
  posts: [
    { img: IMG+'ig/ig-01.jpg', cap: 'Les mules khedithom men @pellmaro_officiel' },
    { img: IMG+'ig/ig-03.jpg', cap: 'Summer outfits are officially back ☀️' },
    { img: IMG+'ig/ig-09.jpg', cap: 'Backstage — Caftan Week 2026 ✨' },
    { img: IMG+'ig/ig-07.jpg', cap: 'Minimum effort, maximum allure' },
    { img: IMG+'ig/ig-11.jpg', cap: 'At @highcreative.studio' },
    { img: IMG+'ig/ig-05.jpg', cap: 'Eid in Morocco hits different 🇲🇦' },
    { img: IMG+'ig/ig-02.jpg', cap: 'Confort au quotidien 👣' },
    { img: IMG+'ig/ig-08.jpg', cap: 'Total black 🖤' },
    { img: IMG+'ig/ig-12.jpg', cap: 'Vert olive 💚' },
    { img: IMG+'ig/ig-06.jpg', cap: 'Pellmaro vous souhaite un bon Aïd ✨' },
    { img: IMG+'ig/ig-04.jpg', cap: 'La mule premium en daim' },
    { img: IMG+'ig/ig-10.jpg', cap: 'Pellmaro 🇲🇦' }
  ]
};

const REVIEWS = [
  { name: 'Salma B.', city: 'Casablanca', stars: 5, text: 'Confort immédiat, le cuir est superbe. Reçues en 48h, payées à la livraison. Je recommande à 100%.' },
  { name: 'Yassine E.', city: 'Rabat', stars: 5, text: 'Finitions vraiment propres pour le prix. On sent le travail d\'artisan. Taille parfaitement.' },
  { name: 'Imane K.', city: 'Marrakech', stars: 5, text: 'J\'hésitais à commander en ligne mais le paiement à la livraison m\'a rassurée. Aucun regret !' },
  { name: 'Omar T.', city: 'Tanger', stars: 5, text: 'La semelle est très confortable, je les porte tous les jours. Service client réactif sur WhatsApp.' },
  { name: 'Nadia R.', city: 'Fès', stars: 4, text: 'Très belles, la couleur est fidèle aux photos. Échange de pointure fait sans problème.' },
  { name: 'Karim L.', city: 'Agadir', stars: 5, text: 'Qualité au-dessus de mes attentes. Le cuir vieillit bien, exactement ce qu\'ils promettent.' }
];
