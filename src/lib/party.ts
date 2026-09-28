import { db, settingsFor, type Party } from './db';
import { getTheme, DEFAULT_THEME, type Theme } from './story';
import { getPhotoTheme, PHOTO_THEMES, type PhotoTheme } from './photos';
import { isValidSlug } from './slug';

export type LoadedParty = { party: Party; theme: Theme; photoTheme: PhotoTheme; expired: boolean; disabled: boolean };

// Looks up a party by subdomain. null = no such party.
export async function findParty(slug: string): Promise<LoadedParty | null> {
  if (!isValidSlug(slug)) return null;
  const party = await db().bySlug(slug);
  if (!party) return null;
  return {
    party,
    theme: getTheme(settingsFor(party).theme) ?? DEFAULT_THEME,
    photoTheme: getPhotoTheme(party.style) ?? PHOTO_THEMES[0],
    expired: new Date(party.expiresAt).getTime() < Date.now(),
    disabled: Boolean(party.disabled),
  };
}
