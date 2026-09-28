import { ImageResponse } from 'next/og';
import { BRAND } from '@/lib/brand';

// The picture shown when the shop is shared on Facebook, WhatsApp, iMessage etc.
export const alt = `${BRAND.name}: party ideas for the TV`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#F4F8FE', padding: 64, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 560 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: '#C23A64' }}>{BRAND.name}</div>
          <div style={{ fontSize: 66, fontWeight: 800, color: '#2E2140', lineHeight: 1.05, marginTop: 18 }}>Party ideas for the big screen</div>
          <div style={{ fontSize: 28, color: '#5E4C70', marginTop: 22 }}>Guests scan a QR code. Their photos and messages pop up live on your TV.</div>
        </div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', width: 470, height: 290, background: '#2E2140', borderRadius: 26, padding: 14 }}>
              <div style={{ display: 'flex', flex: 1, borderRadius: 14, background: 'linear-gradient(135deg, #F4B183, #C8627A 55%, #4B3A78)', alignItems: 'flex-end', padding: 18 }}>
                <div style={{ display: 'flex', background: '#FFC857', color: '#2E2140', fontSize: 22, fontWeight: 800, borderRadius: 999, padding: '6px 16px' }}>New photo from Jess</div>
              </div>
            </div>
            <div style={{ display: 'flex', width: 90, height: 22, background: '#2E2140', borderRadius: '0 0 10px 10px' }} />
          </div>
        </div>
      </div>
    ),
    size,
  );
}
