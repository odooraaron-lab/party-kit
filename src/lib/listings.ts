import type { ArtKind } from '@/components/ProductArt';

// Everything shown in the shop grid: the three instant apps, plus stock listings.
// Stock items are display-only for now (sold out / coming soon): each has its own
// page with a "tell me when it's back" sign-up. Sizes and specs are PLACEHOLDERS —
// confirm them with your supplier before taking orders.
export type AppListing = { kind: 'app'; id: 'story' | 'photos' | 'slideshow'; href: string; name: string; price: number; blurb: string; tag: string };
export type StockListing = {
  kind: 'stock'; id: string; name: string; price: number; blurb: string; art: ArtKind; bg: string;
  status: 'sold-out' | 'coming-soon'; category: string;
  description: string; includes: string[]; details: [string, string][]; related: string[];
};
export type Listing = AppListing | StockListing;

export const APPS: AppListing[] = [
  { kind: 'app', id: 'story', href: '/tv-story', name: 'Birthday Storybook TV', price: 2900, blurb: 'Guests scan a QR code and write a birthday message that pops up on your TV as a storybook page.', tag: 'Kids’ parties' },
  { kind: 'app', id: 'photos', href: '/photo-wall', name: 'Party Photo Wall', price: 3900, blurb: 'Guests scan and add their photos. Every photo plays on the TV live, and you keep them all.', tag: 'Grown-up parties' },
  { kind: 'app', id: 'slideshow', href: '/tv-slideshow', name: 'TV Slideshow', price: 1900, blurb: 'Upload your photos and videos ahead of time and get a web address that plays them on any TV.', tag: 'Any occasion' },
];

export const STOCK: StockListing[] = [
  {
    kind: 'stock', id: 'party-pack', name: 'Party Pack', price: 10000, art: 'plates', bg: '#FDEBC4', status: 'sold-out', category: 'Tableware',
    blurb: 'Plates, cups, cutlery and decorations, all matched to your theme.',
    description: 'Everything for the table and the room in one box, colour-matched to one theme. Open it, set the table, done. Sized for ten guests, with extra guest packs available.',
    includes: ['10 large plates and 10 small plates', '10 cups with paper straws', '10 sets of wooden cutlery', '20 napkins', 'Table runner and 6 hanging decorations'],
    details: [['Guests', '10 (add more in packs of 10)'], ['Materials', 'Paper and wood, compostable'], ['Themes', 'Dinosaur, Under the Sea, Safari and more'], ['Ships', 'Within 2 working days, NZ-wide']],
    related: ['story', 'cups', 'bunting'],
  },
  {
    kind: 'stock', id: 'balloon-kit', name: 'Balloon Garland Kit', price: 4500, art: 'balloons', bg: '#E9F1FC', status: 'coming-soon', category: 'Decorations',
    blurb: 'Everything for a four-metre balloon garland, pump included.',
    description: 'The balloon arch you see on every party feed, without the guesswork. Mixed sizes in a colour palette that actually goes together, plus the tape strip and hand pump to put it up in about half an hour.',
    includes: ['About 100 balloons in mixed sizes', 'Garland tape strip and glue dots', 'Hand pump', 'Step-by-step instructions'],
    details: [['Length', 'About 4 metres'], ['Time to build', 'About 30 minutes'], ['Colours', 'Pastel, Bright or Neutral'], ['Latex', 'Natural latex, not for under-3s']],
    related: ['bunting', 'confetti', 'photos'],
  },
  {
    kind: 'stock', id: 'invite-set', name: 'Printable Invitation Set', price: 1200, art: 'invite', bg: '#F9D8CE', status: 'sold-out', category: 'Printables',
    blurb: 'Invitations, thank-you cards and a welcome sign. Print at home.',
    description: 'A matching set of printables, personalised with your child’s name and party details. Download, print at home or at the shop, and you’re sorted from the invite to the thank-you.',
    includes: ['A5 invitation', 'A6 thank-you card', 'A3 welcome sign', 'Food labels and drink tags'],
    details: [['Format', 'PDF, emailed straight away'], ['Personalised', 'Name, age, date and address'], ['Print', 'Home printer or any print shop'], ['Themes', 'Matches every storybook theme']],
    related: ['story', 'party-pack', 'toppers'],
  },
  {
    kind: 'stock', id: 'candles', name: 'Number Candle Set', price: 1500, art: 'candles', bg: '#EDE4F7', status: 'sold-out', category: 'Cake',
    blurb: 'Chunky pastel number candles with matching sparklers.',
    description: 'The candles are the photo, so make them count. Chunky number candles in soft pastels, with cake sparklers for the big moment.',
    includes: ['One number candle (0–9, choose at checkout)', '5 matching tall candles', '4 cake sparklers'],
    details: [['Height', 'About 8 cm (number)'], ['Colours', 'Pastel pink, blue, mint, lilac'], ['Sparklers', 'Indoor-safe, about 45 seconds'], ['Burn', 'Up to 10 minutes']],
    related: ['toppers', 'confetti', 'story'],
  },
  {
    kind: 'stock', id: 'party-bags', name: 'Party Bag Fillers (10)', price: 3500, art: 'partybag', bg: '#DDF2E8', status: 'coming-soon', category: 'Party bags',
    blurb: 'Ten ready-filled party bags. No plastic junk.',
    description: 'Ten ready-to-go party bags with things kids actually use: a colouring book, crayons, a wooden toy and a sweet treat. Tied, tagged and ready for the door.',
    includes: ['10 cotton drawstring bags', 'Mini colouring book and crayons in each', 'A small wooden toy in each', 'A sweet treat in each', 'Name tags'],
    details: [['Bags', '10 (add more in 5s)'], ['Ages', '3 and up'], ['Plastic', 'None in the toys or bags'], ['Allergens', 'Treat list sent before shipping']],
    related: ['party-pack', 'props', 'story'],
  },
  {
    kind: 'stock', id: 'bunting', name: 'Fabric Bunting', price: 2800, art: 'banner', bg: '#FFF4E0', status: 'sold-out', category: 'Decorations',
    blurb: 'Five metres of reusable cotton bunting.',
    description: 'Soft cotton bunting that goes up for this party and every one after it. Machine washable, and it folds flat into its own bag.',
    includes: ['5 metres of bunting with 15 flags', 'Cotton storage bag'],
    details: [['Length', '5 metres'], ['Material', '100% cotton'], ['Care', 'Cold machine wash'], ['Colours', 'Rainbow, Pastel or Neutral']],
    related: ['balloon-kit', 'party-pack', 'photos'],
  },
  {
    kind: 'stock', id: 'cups', name: 'Compostable Cup Set (24)', price: 1400, art: 'cups', bg: '#E9F1FC', status: 'sold-out', category: 'Tableware',
    blurb: 'Sturdy paper cups with paper straws.',
    description: 'Cups that don’t go soggy halfway through the party, and paper straws that last until the cake. Home-compostable when it’s all over.',
    includes: ['24 paper cups (250 ml)', '24 paper straws'],
    details: [['Size', '250 ml'], ['Material', 'Paper, plant-based lining'], ['Compostable', 'Home compost'], ['Colours', 'Mixed pastels']],
    related: ['party-pack', 'confetti', 'slideshow'],
  },
  {
    kind: 'stock', id: 'props', name: 'Photo Booth Props', price: 2200, art: 'props', bg: '#FDEBC4', status: 'coming-soon', category: 'Games & photos',
    blurb: 'Twenty props on sticks for the silliest photos.',
    description: 'Moustaches, crowns, speech bubbles and more on sturdy sticks. Put them by the photo spot and let the guests do the rest. Pairs perfectly with the Party Photo Wall.',
    includes: ['20 printed props on wooden sticks', '2 blank speech bubbles you can write on'],
    details: [['Props', '20'], ['Material', 'Thick card, wooden sticks'], ['Ages', 'Everyone'], ['Reusable', 'Yes']],
    related: ['photos', 'balloon-kit', 'confetti'],
  },
  {
    kind: 'stock', id: 'confetti', name: 'Confetti Cannons (4)', price: 1800, art: 'confetti', bg: '#F9D8CE', status: 'sold-out', category: 'Games & photos',
    blurb: 'Biodegradable paper confetti. Big finish, easy clean-up.',
    description: 'Twist, pop, cheer. Four cannons filled with biodegradable paper confetti for the candles, the speech, or the moment the storybook hits page fifty.',
    includes: ['4 twist-release confetti cannons'],
    details: [['Length', '30 cm'], ['Confetti', 'Biodegradable tissue paper'], ['Range', 'About 5 metres'], ['Use', 'Outdoors or big rooms, adults only']],
    related: ['candles', 'photos', 'balloon-kit'],
  },
  {
    kind: 'stock', id: 'toppers', name: 'Cake Topper Set', price: 1600, art: 'toppers', bg: '#EDE4F7', status: 'sold-out', category: 'Cake',
    blurb: 'Star toppers and a custom name topper.',
    description: 'Turn a plain cake into the centrepiece: a custom name topper cut to order, plus three star toppers to fill the gaps.',
    includes: ['1 custom name topper', '3 star toppers on sticks'],
    details: [['Name', 'Up to 10 letters'], ['Material', 'Glitter card'], ['Width', 'About 15 cm'], ['Food-safe', 'Sticks only touch the cake']],
    related: ['candles', 'invite-set', 'story'],
  },
];

// Only the three apps are shown for now. The stock items stay defined above so they can come back later.
export const LISTINGS: Listing[] = [...APPS];

export const getStock = (id: string) => STOCK.find((x) => x.id === id);
export const listingHref = (l: Listing) => (l.kind === 'app' ? l.href : `/products/${l.id}`);
export const findListing = (id: string): Listing | undefined => APPS.find((a) => a.id === id) ?? getStock(id);

// Every product that can be reviewed: the three apps and each stock item.
export const REVIEWABLE = new Set<string>([...APPS.map((a) => a.id), ...STOCK.map((s) => s.id)]);
export const productName = (id: string) => findListing(id)?.name ?? id;
