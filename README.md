# Party shop — technical starter

## Birthday Storybook TV (main product) — how the automation works

Your storybook party app, turned into one deployment that hosts every customer's party.
Guests scan a QR code, write a birthday message, and it appears on the TV as a storybook page.
It's a single-event app: the site stays up for a few months afterwards so parents can download every page.

1. Customer fills in name, age, email and theme on `/tv-story` and pays with Stripe.
2. Stripe calls `/api/webhook` → `src/lib/provision.ts` creates the party (unique subdomain `ari`, `ari2`…,
   private host key) and emails: TV link, QR cards, private host link, setup guide.
   The success page runs the same step as a backup.
3. `src/middleware.ts` routes `ari.yourdomain` to that party:
   `/` guest note page · `/tv` · `/host` · `/card` · `/guide` · `/api/*`.
   Nothing is deployed per order, and Railway is no longer needed.

Where things live:
- `party-app/templates/` — the app's HTML pages (index, tv, host, card), served per party in the chosen style.
- `public/party-app/` — shared script, styles and sounds.
- `src/app/party/[slug]/api/[...path]/route.ts` — the app's API (same endpoints as before, per party).
- `src/lib/story.ts` — price, how long sites stay live, max messages, and the five themes.
- `public/party-app/cast-*.js` — each theme's animal cast (the farm cast lives in `shared.js`).
- `public/party-app/shared.js` — `TEXT_DEFAULTS`: the original wording for every screen.

**Themes are fixed, tested bundles** (animals + colours + fonts): Nursery Rhyme Farm, Dino Valley,
Under the Sea, Safari Adventure, Woodland Night. Each cast fills the same seven roles on the TV
(jumper, laugher, musician, wobbler on the wall, runaway pair, walker, letter courier) using the same
animation hooks, so the TV's choreography and timing are identical in every theme. Each theme also maps
animal noises to neutral sounds so no animal makes the wrong noise.

The theme is locked in at purchase (it's part of what they paid for). Parents can change all wording on the host page (TV, phones,
QR cards, and the four message types, which can each be switched off). Nothing else is customisable,
on purpose — fewer moving parts on the TV.

### One-time setup for subdomains
1. Vercel Pro plan (needed for selling anyway).
2. Point your domain's nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com` (required for wildcard SSL).
3. In the Vercel project → Domains, add `yourdomain` and `*.yourdomain`.
4. Vercel → Storage → create a Neon Postgres database and connect it (adds `DATABASE_URL`). Tables create themselves.
5. Set `NEXT_PUBLIC_ROOT_DOMAIN=yourdomain` and `NEXT_PUBLIC_SITE_URL=https://yourdomain`.

### Test without paying (local only)
Open `http://localhost:3000/api/dev/create-party?name=Ari&age=1&style=starry` — it returns the links,
including the host link. Then open `http://ari.localhost:3000/tv`. This route is off in production.

### Add a sixth theme later
Copy a `cast-*.js` file and redraw its seven characters (keep the class names on the moving parts),
then add an entry to `THEMES` in `src/lib/story.ts` with its colours and fonts. Test every moment on a
real TV with `window.__n18moment("cow")` etc. in the browser console before selling it.

### The printable storybook (PDF)
After the party the host taps "Download the printable storybook (PDF)" on their host page
(`/api/storybook.pdf?key=…`). `src/lib/storybook-pdf.ts` builds it on the fly from every message:
a themed cover, one open-book page per message (styled like the TV, with the theme's animals,
colours and fonts, plus the host's custom wording), and a thank-you page.
- A4 landscape, all vector, fonts embedded (`party-app/fonts/`, SIL Open Font Licence).
- Emoji are left out (fonts can't print them); names with macrons print correctly in every theme.
- The sample images on the product page (`public/images/storybook-pdf/`) are real pages from the
  generator. Regenerate them if you change the design.

## Party Photo Wall (second automated product)

For grown-up parties. Guests scan a QR code and add photos from their phone; photos go into one
shared album and play on the TV as a live slideshow. One-time payment, same flow as the storybook:
`/photo-wall` → Stripe → `provisionParty()` creates the party (`product: 'photos'`) at its own
subdomain and emails the TV link, QR cards, private host link and guide.

- Pages: `party-app/photos/` (guest upload + album, TV slideshow, host, QR cards), `public/photo-app/`.
- API: `src/lib/photo-api.ts`. Config (price, looks, limits): `src/lib/photo-config.ts`.
- Storage: Vercel Blob (`BLOB_READ_WRITE_TOKEN`). Phones shrink photos to 2048px JPEG before sending,
  which also strips location data, and upload a small thumbnail for the album grid.
- Host can remove photos, hide the album from guests, close uploads, change wording, and download every
  photo as a zip. Four looks, locked in at purchase: Champagne, Garden Party, Neon Night, Gallery White.
- Albums stay online for `monthsLive` (6) months. `vercel.json` runs `/api/cron/cleanup` daily to delete
  expired albums' photos. Set `CRON_SECRET` in Vercel.
- Test locally: `/api/dev/create-party?product=photos&name=Sam%27s%2040th&theme=neon`, then open
  `http://sams-40th.localhost:3000/tv`.

## TV Slideshow (third product — the cheap, set-it-up-ahead one)

Buyer picks a web address and a title, pays, then uploads their own photos and videos. The address
plays them on a loop on any TV. No guests, no host tools.

- Buy: `/tv-slideshow` → Stripe → `provisionParty()` (`product: 'slideshow'`) emails the private upload
  link and the TV address. The success page sends them straight to the upload page.
- Upload page: `/upload/<slug>?key=…` on the main site (`src/app/(shop)/upload/[slug]/`). Photos are
  shrunk to 2560px in the browser; videos go straight from the device to Vercel Blob (they're too big
  to pass through a server), then `/api/slideshow/items` checks the file really is in this slideshow's
  folder before recording it. They can remove things from the same page. The key is remembered on that device.
- TV: `party-app/slideshow/tv.html` at the subdomain root. Title card, then every photo (7 s) and video
  (full length) in upload order, then repeats. One click turns sound on. A video the TV can't play is
  skipped after 8 s so the show never stops.
- Limits in `src/lib/slideshow-config.ts`: 150 items, 2 GB total, videos up to 250 MB / 3 minutes,
  online for 2 months. The daily cleanup job deletes the files afterwards.
- iPhone videos recorded in High Efficiency (HEVC) may not play on some TVs; they're skipped. Adding a
  video-conversion service later would fix this for good.
- Test locally: `/api/dev/create-party?product=slideshow&name=Happy%2050th&slug=dad50` → open the `upload` link it returns.

## Connected to the admin (HQ)

The three apps report to the Admin Portal (`admin.yourbrand.nz`) as products `story`, `photos` and `slideshow`.
- `src/lib/hq.ts` — signs reports with each product's own secret, and adds the admin's beacon to every party
  page (TV pages also send a check-in every 5 minutes).
- New sites are reported from `provisionParty()`; checkouts carry `metadata.product` so orders land under the right app.
- `src/app/api/hq/action/route.ts` — the admin's Turn off / Turn on / Add 30 days / Resend email buttons.
  A turned-off party shows a "paused" page to guests and the TV.
- Env: `HQ_URL`, `HQ_SECRET_STORY`, `HQ_SECRET_PHOTOS`, `HQ_SECRET_SLIDESHOW` (Admin → Products → each app).
  Set each product's app URL in the admin to this site's main address. Without `HQ_URL` everything runs as before.

## Shop layout
- `src/lib/listings.ts` — the shop grid, in display order: the three instant apps placed among stock
  listings (sold out / coming soon, display-only until physical products are switched on).
- `src/components/ShopGrid.tsx` — apps show as wide tiles with a mini TV preview and an "Instant" badge.
- `src/components/ProductStory.tsx` — each app's page: the idea, a party scene with the real product on the
  TV (`PartyScene.tsx`, illustrated until real photos are ready), how it works, why it gets people involved,
  numbers, what you get, then the order form.
- The numbers on product pages are facts about the product (limits, timings), not survey results.
  Only add percentages or research claims you can back up.

## Product pages, reviews, sign-ups, contact
- Every stock listing has its own page at `/products/<id>` (content in `src/lib/listings.ts`): illustration,
  description, what's included, details, "Pairs well with", and a **Notify me** sign-up. Specs are placeholders.
- **Reviews** on every product page (`src/components/Reviews.tsx`, `/api/reviews`). New reviews are hidden
  until you approve them: you get an email with signed Approve / Reject links (needs `ADMIN_SECRET` and
  `SHOP_OWNER_EMAIL`). Reviewers who bought that app with the same email get a "Verified buyer" tag.
  Emails are never shown. The homepage shows the latest approved reviews (hidden until there are some).
  Only publish genuine reviews — fake or cherry-picked reviews are misleading under the Fair Trading Act.
- **Sign-ups** (`/api/signup`): "news" (homepage newsletter) and "restock:<id>" (Notify me). Stored in the
  `signups` table — export them from Neon to email people when stock is back.
- **Contact and about** at `/contact`. Messages are emailed to `SHOP_OWNER_EMAIL` with reply-to set to the
  sender. The about text has [PLACEHOLDERS] for your own story.
- All public forms have a hidden honeypot field and per-IP rate limits.

## Brand
The name, tagline and announcement line live in `src/lib/brand.ts` ("Wishcast" is a working name).
The logo is `src/components/Logo.tsx`. The shop uses the storybook's own colours and display font.

## How an order flows

1. Customer builds a pack (theme + guest count + add-ons). The cart is saved in their browser.
2. In the cart they pick a delivery region and whether the address is rural. The shipping estimate updates live.
3. **Checkout** sends the cart to `/api/checkout`. The server **re-prices everything from the catalogue**, so nobody can edit prices in their browser. It then opens Stripe's hosted payment page with standard and express shipping options.
4. Stripe takes payment (card, Apple Pay, Google Pay) and collects the NZ address, phone, party date and child's name.
5. Stripe calls `/api/webhook`. That emails the customer (with printable download links) and emails you the order to pack.
6. The customer lands on `/success`, which shows their downloads straight away.

## Where to change things

| What | File |
|---|---|
| Packs, prices, themes, what's included, printable files | `src/lib/catalog.ts` |
| Shipping zones, rural fee, express fee, free-shipping threshold | `src/lib/shipping.ts` |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |
| Printable files (PDFs) | `private-files/printables/` — name them `invite-dino.pdf`, `thankyou-dino.pdf`, `welcome-sign-dino.pdf` etc. |

Prices marked `PLACEHOLDER` are not decided yet. All money is in cents.

## Run it on your computer

1. Install Node.js 20+.
2. `npm install`
3. Copy `.env.example` to `.env.local` and add your Stripe **test** secret key.
4. `npm run dev` and open http://localhost:3000
5. To test the webhook locally, install the Stripe CLI, run `stripe login`, then `npm run stripe:listen`. Copy the `whsec_…` value it prints into `.env.local`.
6. Pay with Stripe's test card `4242 4242 4242 4242`, any future date, any CVC.

Without `RESEND_API_KEY`, emails print in the terminal instead of sending.

## Go live on Vercel (same as Property Wars)

1. Push this folder to a new GitHub repo.
2. In Vercel, import the repo. It detects Next.js automatically.
3. Add the environment variables from `.env.example` in Project → Settings → Environment Variables. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
4. In Stripe → Developers → Webhooks, add an endpoint `https://yourdomain/api/webhook` listening for the three events listed under Stripe setup below. Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
5. Hobby (free) is fine while you build and test. **Switch to Pro before taking real payments** — Hobby doesn't allow commercial use.

## Or go live on Cloudflare (free for commercial use)

Uses the OpenNext adapter: `npm i -D @opennextjs/cloudflare wrangler`, then follow the
OpenNext Cloudflare guide. The Stripe calls and webhook work there too. The download route
reads files from disk, so on Cloudflare move printables to R2 storage (small change in
`src/app/api/download/.../route.ts`).

## Stripe setup (payment options)

Code switches live in `src/lib/stripe-options.ts`. Everything else is a toggle in the Stripe Dashboard.

**Payment methods** — Dashboard → Settings → Payment methods. The code deliberately doesn't list
payment methods, so whatever you switch on there appears at checkout for eligible customers.
Recommended for NZ:

| Method | Notes |
|---|---|
| Cards | On by default |
| Apple Pay / Google Pay | On by default; show automatically on supported phones |
| Link | Stripe's saved-details checkout; speeds up repeat buyers |
| Afterpay | NZ customers only; pay in 4. Big with parents buying $100+ packs |
| Klarna | Another pay-later option |
| NZ BECS Direct Debit | Takes days to confirm, so only turn on if you're happy waiting; failed payments email you "do not ship" |

Zip isn't available through Stripe for NZ businesses, so it's not offered.

**Discount codes** — `promotionCodes: true` adds a code box to checkout. Create codes in
Dashboard → Product catalogue → Coupons → add a promotion code (e.g. `PARTY10`). Stripe applies the discount;
your order email shows it.

**Pay-later line on product and cart pages** — add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and Stripe shows
"or 4 interest-free payments…" under prices when the amount is eligible.

**Receipts** — Dashboard → Settings → Customer emails → turn on successful payment emails.

**Tax invoices** — set `taxInvoices: true` once you're GST-registered and want Stripe to generate invoice PDFs (extra per-invoice fee).

**Terms checkbox** — add your Terms URL in Dashboard → Settings → Public details, then set `requireTerms: true`.

**Webhook events** — subscribe to `checkout.session.completed`, `checkout.session.async_payment_succeeded`
and `checkout.session.async_payment_failed`.

## Before launch checklist

- [ ] Real prices and shipping rates in `catalog.ts` / `shipping.ts`
- [ ] Printable PDFs in `private-files/printables/` for every theme
- [ ] Stripe account verified with NZ bank details; switch to live keys
- [ ] Resend account with your domain verified; set `EMAIL_FROM`
- [ ] Decide on GST registration and replace `[GST NOTE]` in the cart
- [ ] Terms, privacy and returns pages
- [ ] Replace `[BRAND]` everywhere

## Next steps (not built yet)

- **Database (Neon Postgres, free tier)** — only needed once you want stock levels, an admin page, or discount codes. Until then Stripe holds every order.
- **Rural check** — verify rural addresses automatically with NZ Post's address API instead of trusting the tick box.
- **NZ Post live rates + labels** — swap the zone table for the NZ Post ShippingOptions API once you have a business account.
- **Personalised printables** — generate PDFs with the child's name from Stripe's custom field.
- **QR guest app hookup** — create the party page automatically in the webhook and email its QR code.
- **Party-date warning** — warn at checkout if standard shipping won't arrive before the party.

## QR Buddy on the same wildcard

QR Buddy (github.com/odooraaron-lab/QRpet) gives each buddy an address like `teddy.myqr.co.nz`. This
site owns `*.myqr.co.nz`, so `src/middleware.ts` asks the buddy app (`BUDDY_ORIGIN/api/registry/<name>`,
cached for a few minutes) and forwards buddy names to `BUDDY_ORIGIN/b/<name>/…` with an `x-qb-buddy` header.
Both apps check each other before giving out a name: new parties skip buddy names (`src/lib/provision.ts`),
and the buddy app calls `/api/slug-status?s=<name>` here. `create`, `login` and `buddy` are reserved.
Set `BUDDY_ORIGIN=https://create.myqr.co.nz` in Vercel to switch it on.
