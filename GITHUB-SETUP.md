# Getting the party site onto GitHub and Vercel

This project is the shop plus all three instant apps (Birthday Storybook TV, Party Photo Wall,
TV Slideshow) in one Next.js app. One GitHub repo, one Vercel project.

## 1. Unzip and install (your computer)

1. Unzip `party-kit.zip` somewhere easy, e.g. `C:\Users\<you>\party-kit`.
2. Install **Node.js 20 or newer** from nodejs.org if you don't have it.
3. Open a terminal in the folder and run:
   ```
   npm install
   ```

## 2. Try it locally (optional but worth 5 minutes)

1. Copy `.env.example` to `.env.local`. For a first look you only need:
   ```
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ALLOW_DEV_ROUTES=true
   ```
2. `npm run dev`, then open http://localhost:3000
3. Make a test party without paying:
   http://localhost:3000/api/dev/create-party?name=Ari&age=1&theme=dino
   It returns links. Open the `tv` one (e.g. http://ari.localhost:3000/tv) — `*.localhost` works in Chrome and Edge.

## 3. Put it on GitHub

The project has more than 100 files, which is too many for GitHub's drag-and-drop upload, so use
**GitHub Desktop** (easiest) or git on the command line.

**GitHub Desktop:** File → Add local repository → choose the folder → "create a repository" →
Publish repository (tick "Keep this code private").

**Command line:**
```
git init
git add .
git commit -m "Party site: shop, storybook, photo wall, slideshow"
git branch -M main
git remote add origin https://github.com/<your-account>/party-kit.git
git push -u origin main
```
`.gitignore` already keeps out `node_modules`, `.env.local` and local test data. Never commit `.env.local`.

## 4. Vercel

1. vercel.com → Add New → Project → import the repo. It detects Next.js; keep the defaults.
2. **Storage:** in the project, Storage → create a **Neon Postgres** database and a **Blob** store,
   and connect both. That adds `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` for you.
3. **Environment variables** (Settings → Environment Variables). See `.env.example` for all of them:
   - `NEXT_PUBLIC_SITE_URL` = https://yourdomain
   - `NEXT_PUBLIC_ROOT_DOMAIN` = yourdomain (no https, no www)
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `RESEND_API_KEY`, `EMAIL_FROM`, `SHOP_OWNER_EMAIL`
   - `ADMIN_SECRET` (any long random string — signs the review approval links)
   - `CRON_SECRET` (any long random string — protects the daily cleanup job)
   - Do **not** set `ALLOW_DEV_ROUTES` in production.
4. **Domain:** Settings → Domains → add `yourdomain` **and** `*.yourdomain`. For the wildcard to work,
   point your domain's nameservers to Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
5. **Plan:** Hobby is fine for testing. Switch to **Pro** before taking real payments (Hobby is non-commercial),
   and Pro is needed for the daily cleanup cron to run on schedule.

## 5. Stripe

1. Developers → Webhooks → add `https://yourdomain/api/webhook` with events
   `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
   Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
2. Settings → Payment methods: switch on Afterpay, Klarna, Link etc. as you like (no code changes needed).
3. Test with card `4242 4242 4242 4242` before switching to live keys.

## 6. Before launch

Placeholders to replace (search the code for `[`):
- Business name: `src/lib/brand.ts` ("Wishcast" is a working name)
- About us, contact email, town: `src/app/(shop)/contact/page.tsx`, homepage "Made by parents" card
- Prices marked PLACEHOLDER: `src/lib/story.ts`, `src/lib/photo-config.ts`, `src/lib/slideshow-config.ts`, `src/lib/catalog.ts`
- Storybook page video: `STORY_VIDEO` in `src/lib/story.ts` (put the file in `public/videos/` or use a YouTube ID)
- Stock product specs: `src/lib/listings.ts`

The full technical guide is in `README.md`.
