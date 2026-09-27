// Browser-only helpers: shrink photos and grab a still from videos before upload.

type Decoded = { src: CanvasImageSource; w: number; h: number; close: () => void };

async function decode(file: Blob): Promise<Decoded> {
  if ('createImageBitmap' in window) {
    try {
      const b = await createImageBitmap(file, { imageOrientation: 'from-image' });
      return { src: b, w: b.width, h: b.height, close: () => b.close() };
    } catch { /* fall back to <img> */ }
  }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.src = url;
  try { await img.decode(); } catch { URL.revokeObjectURL(url); throw new Error('decode'); }
  return { src: img, w: img.naturalWidth, h: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
}

function draw(src: CanvasImageSource, w: number, h: number, max: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, max / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * scale));
  c.height = Math.max(1, Math.round(h * scale));
  const x = c.getContext('2d')!;
  x.fillStyle = '#000';
  x.fillRect(0, 0, c.width, c.height);
  x.drawImage(src, 0, 0, c.width, c.height);
  return new Promise((ok, no) => c.toBlob((b) => (b ? ok(b) : no(new Error('encode'))), 'image/jpeg', quality));
}

// A TV-sized JPEG (sharp on a 4K screen, much smaller than a phone original) plus a thumbnail.
export async function shrinkPhoto(file: File): Promise<{ full: Blob; thumb: Blob }> {
  const d = await decode(file);
  try {
    return { full: await draw(d.src, d.w, d.h, 2560, 0.86), thumb: await draw(d.src, d.w, d.h, 360, 0.7) };
  } finally { d.close(); }
}

// Reads a video's length and grabs a still for the thumbnail.
export function inspectVideo(file: File): Promise<{ seconds: number; thumb: Blob }> {
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'metadata'; v.src = url;
    const done = (fn: () => void) => { fn(); URL.revokeObjectURL(url); };
    const timeout = setTimeout(() => done(() => no(new Error('video'))), 15000);
    v.onerror = () => { clearTimeout(timeout); done(() => no(new Error('video'))); };
    v.onloadedmetadata = () => { v.currentTime = Math.min(1, (v.duration || 2) / 2); };
    v.onseeked = async () => {
      clearTimeout(timeout);
      try {
        const thumb = await draw(v, v.videoWidth || 640, v.videoHeight || 360, 360, 0.7);
        done(() => ok({ seconds: v.duration, thumb }));
      } catch (e) { done(() => no(e)); }
    };
  });
}
