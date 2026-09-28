import type Stripe from 'stripe';
import crypto from 'node:crypto';
import { db, SlugTaken, SessionExists, type Party } from './db';
import { slugCandidates } from './slug';
import { STORY_PRODUCT, getTheme, cleanName } from './story';
import { PHOTO_PRODUCT, getPhotoTheme, cleanEventName } from './photos';
import { SLIDESHOW_PRODUCT, cleanTitle } from './slideshow-config';
import { baseSlug } from './slug';
import { partyUrl } from './urls';
import { siteUrl } from './stripe';
import { sendEmail, escapeHtml } from './email';
import { money } from './money';
import { reportToHQ } from './hq';

// Turns a paid Stripe session into a live party site (storybook or photo wall),
// then emails the links. Safe to call more than once for the same session
// (webhook + success page): only the first call creates the site and sends the email.
export async function provisionParty(session: Stripe.Checkout.Session): Promise<Party> {
  if (session.payment_status !== 'paid') throw new Error('Session not paid');
  const existing = await db().bySession(session.id);
  if (existing) return existing;

  const m = session.metadata ?? {};
  const email = session.customer_details?.email ?? session.customer_email ?? m.email;
  const photos = m.kind === 'photos';
  const slideshow = m.kind === 'slideshow';
  let childName: string | null, style: string | undefined, age = 0, months: number, slugBase: string;
  if (slideshow) {
    childName = cleanTitle(m.name);
    style = 'default';
    months = SLIDESHOW_PRODUCT.monthsLive;
    slugBase = baseSlug(m.slug || childName || '');
  } else if (photos) {
    childName = cleanEventName(m.name);
    style = getPhotoTheme(m.theme ?? '')?.id;
    months = PHOTO_PRODUCT.monthsLive;
    slugBase = baseSlug(m.slug || childName || '');
  } else {
    childName = cleanName(m.name);
    style = getTheme(m.theme ?? '')?.id;
    age = Number(m.age);
    months = STORY_PRODUCT.monthsLive;
    slugBase = childName ?? '';
  }
  if (!childName || !style || !Number.isInteger(age) || !email) throw new Error(`Bad metadata on ${session.id}`);

  const now = new Date();
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + months);

  for (const slug of slugCandidates(slugBase)) {
    const party: Party = {
      slug, product: slideshow ? 'slideshow' : photos ? 'photos' : 'story', childName, age, style, email, sessionId: session.id,
      hostKey: newHostKey(), settings: {},
      createdAt: now.toISOString(), expiresAt: expires.toISOString(),
    };
    try {
      await db().insert(party);
    } catch (e) {
      if (e instanceof SlugTaken) continue;
      if (e instanceof SessionExists) return (await db().bySession(session.id))!;
      throw e;
    }
    await sendWelcomeEmail(party, session.amount_total ?? 0);
    await notifyOwner(party, session.amount_total ?? 0);
    await reportSite(party);
    return party;
  }
  throw new Error('No free subdomain for ' + childName);
}
export const provisionStory = provisionParty;

// The "your site is ready" email for any product. `resend` skips the idempotency key so the admin's "Resend email" works.
export async function sendWelcomeEmail(p: Party, paid: number, resend = false) {
  if (p.product === 'slideshow') await sendSlideshowEmail(p, paid, resend);
  else if (p.product === 'photos') await sendPhotoEmail(p, paid, resend);
  else await sendStoryEmail(p, paid, resend);
}

// Tells the admin about a site (new, turned off/on, or new expiry).
export function reportSite(p: Party) {
  return reportToHQ(p.product, {
    type: 'site.upsert', slug: p.slug, url: partyUrl(p.slug), owner_email: p.email, owner_name: p.childName,
    theme: p.style, status: p.disabled ? 'disabled' : 'live', expires_at: p.expiresAt, order_id: p.sessionId,
  });
}

// 12 easy-to-read characters (no 0/O/1/l), e.g. "k7vq-m3xp-w9ha"
function newHostKey(): string {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  const chars = Array.from(bytes, (b) => abc[b % abc.length]).join('');
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`;
}

export const hostLink = (p: Party) => `${partyUrl(p.slug, '/host')}?key=${encodeURIComponent(p.hostKey)}`;

async function sendStoryEmail(p: Party, paid: number, resend = false) {
  const n = escapeHtml(p.childName);
  const button = (url: string, label: string, note: string) =>
    `<tr><td style="padding:0 0 18px"><a href="${url}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#3B2A4A;color:#FFFDF6;text-decoration:none;font-weight:700">${label}</a>` +
    `<div style="font-size:14px;color:#5E4C70;margin-top:6px">${note}</div></td></tr>`;
  await sendEmail({
    to: p.email,
    subject: `${p.childName}'s birthday storybook is ready`,
    idempotencyKey: resend ? undefined : `story-${p.sessionId}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#3B2A4A">
      <h1 style="font-size:26px;margin:0 0 8px">${n}'s storybook is live!</h1>
      <p style="margin:0 0 20px">Everything you need for the party is below. Keep this email — the host link is private to you.</p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        ${button(partyUrl(p.slug, '/tv'), 'Open on the TV', 'Open this in the TV browser on the day. It shows the QR code and every note as it arrives.')}
        ${button(partyUrl(p.slug, '/card'), 'Print the QR cards', 'Print a few for the tables so everyone can join in.')}
        ${button(hostLink(p), 'Your host page (private)', `Change the wording, control TV sound, remove messages, and download the finished storybook as a printable PDF. Host key: <b>${p.hostKey}</b>`)}
        ${button(partyUrl(p.slug, '/guide'), 'Read the setup guide', 'Five minutes to get the TV ready.')}
      </table>
      <p style="font-size:14px;color:#5E4C70">Guests go to <a href="${partyUrl(p.slug)}">${partyUrl(p.slug).replace(/^https?:\/\//, '')}</a> (that's where the QR code points).</p>
      <p style="font-size:13px;color:#5E4C70">Paid ${money(paid)}. Your party site stays online until ${new Date(p.expiresAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })} — download the storybook from your host page before then.</p>
    </div>`,
  });
}

async function sendPhotoEmail(p: Party, paid: number, resend = false) {
  const n = escapeHtml(p.childName);
  const button = (url: string, label: string, note: string) =>
    `<tr><td style="padding:0 0 18px"><a href="${url}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#141414;color:#FFFFFF;text-decoration:none;font-weight:700">${label}</a>` +
    `<div style="font-size:14px;color:#595959;margin-top:6px">${note}</div></td></tr>`;
  await sendEmail({
    to: p.email,
    subject: `Your photo wall for ${p.childName} is ready`,
    idempotencyKey: resend ? undefined : `photos-${p.sessionId}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#141414">
      <h1 style="font-size:26px;margin:0 0 8px">${n}: your photo wall is live</h1>
      <p style="margin:0 0 20px">Everything you need is below. Keep this email — the host link is private to you.</p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        ${button(partyUrl(p.slug, '/tv'), 'Open the slideshow on the TV', 'Shows every photo as it arrives, with the QR code on screen.')}
        ${button(partyUrl(p.slug, '/card'), 'Print the QR cards', 'Put them on the tables and by the door.')}
        ${button(hostLink(p), 'Your host page (private)', `Change the wording, hide or remove photos, close uploads, and download every photo. Host key: <b>${p.hostKey}</b>`)}
        ${button(partyUrl(p.slug, '/guide'), 'Read the setup guide', 'Five minutes before guests arrive.')}
      </table>
      <p style="font-size:14px;color:#595959">Guests go to <a href="${partyUrl(p.slug)}">${partyUrl(p.slug).replace(/^https?:\/\//, '')}</a> (that's where the QR code points).</p>
      <p style="font-size:13px;color:#595959">Paid ${money(paid)}. Your album stays online until ${new Date(p.expiresAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}, then the photos are deleted. Download them from your host page before then.</p>
    </div>`,
  });
}

// Private link to the upload page (on the main site, not the TV address).
export const uploadLink = (p: Party) => `${siteUrl()}/upload/${p.slug}?key=${encodeURIComponent(p.hostKey)}`;

async function sendSlideshowEmail(p: Party, paid: number, resend = false) {
  const button = (url: string, label: string, note: string) =>
    `<tr><td style="padding:0 0 18px"><a href="${url}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:#2E2140;color:#FFFFFF;text-decoration:none;font-weight:700">${label}</a>` +
    `<div style="font-size:14px;color:#5E4C70;margin-top:6px">${note}</div></td></tr>`;
  await sendEmail({
    to: p.email,
    subject: `Your TV slideshow "${p.childName}" is ready for photos`,
    idempotencyKey: resend ? undefined : `slideshow-${p.sessionId}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#2E2140">
      <h1 style="font-size:26px;margin:0 0 8px">${escapeHtml(p.childName)}</h1>
      <p style="margin:0 0 20px">Your slideshow address is ready. Add your photos and videos, then open the address on the TV on the day.</p>
      <table role="presentation" cellpadding="0" cellspacing="0">
        ${button(uploadLink(p), 'Upload photos and videos', 'Private to you. Come back any time to add or remove things.')}
        ${button(partyUrl(p.slug), 'Your slideshow', `Open this on the TV: <b>${partyUrl(p.slug).replace(/^https?:\/\//, '')}</b>`)}
      </table>
      <p style="font-size:13px;color:#5E4C70">Paid ${money(paid)}. Your slideshow plays until ${new Date(p.expiresAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}, then the files are deleted.</p>
    </div>`,
  });
}

async function notifyOwner(p: Party, paid: number) {
  if (!process.env.SHOP_OWNER_EMAIL) return;
  await sendEmail({
    to: process.env.SHOP_OWNER_EMAIL,
    subject: `New ${p.product === 'slideshow' ? 'TV slideshow' : p.product === 'photos' ? 'photo wall' : 'TV story'} ${money(paid)} — ${p.childName}`,
    idempotencyKey: `story-owner-${p.sessionId}`,
    html: `<p>${escapeHtml(p.childName)}, age ${p.age}, style ${p.style}<br>${escapeHtml(p.email)}<br><a href="${partyUrl(p.slug)}">${partyUrl(p.slug)}</a></p>`,
  });
}
