'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { shrinkPhoto, inspectVideo } from '@/lib/shrink';
import { IMAGE_TYPES, VIDEO_TYPES } from '@/lib/slideshow-config';

type Item = { id: string; thumbUrl: string; kind: 'image' | 'video'; bytes: number };
type Job = { key: string; name: string; preview?: string; status: 'waiting' | 'preparing' | 'uploading' | 'failed'; progress: number; error?: string; file: File };
type Info = { title: string; tvUrl: string; mode: 'blob' | 'local'; items: Item[]; bytes: number; expiresAt: string;
  limits: { maxItems: number; maxTotalBytes: number; maxVideoBytes: number; maxVideoSeconds: number } };

const mb = (n: number) => { const m = n / 1024 / 1024; return m < 10 ? `${m.toFixed(1)} MB` : m < 1000 ? `${Math.round(m)} MB` : `${(m / 1024).toFixed(1)} GB`; };
const ext = (t: string) => ({ 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm' } as Record<string, string>)[t] ?? 'jpg';

export function Uploader({ slug }: { slug: string }) {
  const [key, setKey] = useState('');
  const [info, setInfo] = useState<Info | null>(null);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [drag, setDrag] = useState(false);
  const busy = useRef(false);
  const queue = useRef<Job[]>([]);

  // The emailed link carries ?key=… — keep it on this device, then tidy the address bar.
  useEffect(() => {
    const store = `slideshow-key:${slug}`;
    const fromUrl = new URLSearchParams(window.location.search).get('key');
    let k = fromUrl ?? '';
    try { if (fromUrl) localStorage.setItem(store, fromUrl); else k = localStorage.getItem(store) ?? ''; } catch {}
    if (fromUrl) window.history.replaceState(null, '', window.location.pathname);
    setKey(k);
  }, [slug]);

  const refresh = useCallback(async (k: string) => {
    const r = await fetch(`/api/slideshow/items?slug=${encodeURIComponent(slug)}&key=${encodeURIComponent(k)}`, { cache: 'no-store' });
    const j = await r.json();
    if (!r.ok) { setError(j.error ?? 'This upload link is not valid.'); return; }
    setError(''); setInfo(j);
  }, [slug]);

  useEffect(() => { if (key) refresh(key); else setError(''); }, [key, refresh]);

  const update = (k: string, patch: Partial<Job>) => setJobs((all) => all.map((j) => (j.key === k ? { ...j, ...patch } : j)));

  async function send(job: Job) {
    if (!info) return;
    const f = job.file;
    const isVideo = VIDEO_TYPES.includes(f.type) || /\.(mov|mp4|webm)$/i.test(f.name);
    const isImage = !isVideo && (f.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name));
    update(job.key, { status: 'preparing', error: undefined });
    try {
      let main: Blob, thumb: Blob, type: string;
      if (isVideo) {
        type = VIDEO_TYPES.includes(f.type) ? f.type : f.name.toLowerCase().endsWith('.mov') ? 'video/quicktime' : f.name.toLowerCase().endsWith('.webm') ? 'video/webm' : 'video/mp4';
        if (f.size > info.limits.maxVideoBytes) throw new Error(`Videos can be up to ${mb(info.limits.maxVideoBytes)}.`);
        const v = await inspectVideo(f).catch(() => { throw new Error("This video can't be read on this device."); });
        if (v.seconds > info.limits.maxVideoSeconds + 1) throw new Error(`Videos can be up to ${Math.round(info.limits.maxVideoSeconds / 60)} minutes long.`);
        main = f; thumb = v.thumb;
      } else if (isImage) {
        const p = await shrinkPhoto(f).catch(() => { throw new Error("This photo can't be read. Try a JPEG or PNG."); });
        main = p.full; thumb = p.thumb; type = 'image/jpeg';
      } else throw new Error('Only photos and videos can be added.');
      update(job.key, { preview: URL.createObjectURL(thumb), status: 'uploading' });

      let saved: Item;
      if (info.mode === 'blob') {
        const id = crypto.randomUUID();
        const common = { access: 'public' as const, handleUploadUrl: '/api/slideshow/token', clientPayload: JSON.stringify({ slug, key }) };
        const up = await upload(`slideshow/${slug}/${id}.${ext(type)}`, main, {
          ...common, contentType: type, multipart: main.size > 20 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => update(job.key, { progress: Math.round(percentage) }),
        });
        const t = await upload(`slideshow/${slug}/${id}-thumb.jpg`, thumb, { ...common, contentType: 'image/jpeg' });
        const r = await fetch('/api/slideshow/items', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, key, url: up.url, thumbUrl: t.url, kind: isVideo ? 'video' : 'image' }) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error ?? 'Upload failed');
        saved = j;
      } else {
        const fd = new FormData();
        fd.append('slug', slug); fd.append('key', key);
        fd.append('file', new File([main], `f.${ext(type)}`, { type })); fd.append('thumb', thumb, 't.jpg');
        const r = await fetch('/api/slideshow/local', { method: 'POST', body: fd });
        const j = await r.json(); if (!r.ok) throw new Error(j.error ?? 'Upload failed');
        saved = j;
      }
      setJobs((all) => all.filter((x) => x.key !== job.key));
      setInfo((i) => (i ? { ...i, items: [...i.items, saved], bytes: i.bytes + saved.bytes } : i));
    } catch (e) {
      update(job.key, { status: 'failed', error: e instanceof Error ? e.message : 'Upload failed' });
    }
  }

  async function pump() {
    if (busy.current) return;
    busy.current = true;
    while (queue.current.length) await send(queue.current.shift()!);
    busy.current = false;
  }

  function add(files: FileList | File[]) {
    const list = Array.from(files).map((file) => ({ key: crypto.randomUUID(), name: file.name, status: 'waiting' as const, progress: 0, file }));
    setJobs((all) => [...all, ...list]);
    queue.current.push(...list);
    pump();
  }
  function retry(job: Job) { update(job.key, { status: 'waiting', progress: 0 }); queue.current.push(job); pump(); }

  async function remove(id: string) {
    if (!confirm('Take this out of the slideshow?')) return;
    const r = await fetch('/api/slideshow/items', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, key, id }) });
    if (r.ok) setInfo((i) => (i ? { ...i, items: i.items.filter((x) => x.id !== id), bytes: i.bytes - (i.items.find((x) => x.id === id)?.bytes ?? 0) } : i));
  }

  if (!key || error) {
    return (
      <div className="section stack" style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 36 }}>Upload your photos and videos</h1>
        <p className="muted">{error || 'Open the upload link from your email to add photos and videos.'}</p>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); const k = new FormData(e.currentTarget).get('k'); if (k) { try { localStorage.setItem(`slideshow-key:${slug}`, String(k)); } catch {} setKey(String(k).trim()); } }}>
          <div className="field"><label htmlFor="k">Or paste the upload key from your email</label><input id="k" name="k" autoComplete="off" /></div>
          <button className="btn btn-dark" type="submit">Open</button>
        </form>
      </div>
    );
  }
  if (!info) return <div className="section"><p className="muted">Loading…</p></div>;

  const working = jobs.filter((j) => j.status !== 'failed').length;
  const used = Math.min(100, (info.bytes / info.limits.maxTotalBytes) * 100);
  const tvShort = info.tvUrl.replace(/^https?:\/\//, '');

  return (
    <div className="uploader">
      <div className="up-head">
        <div>
          <p className="muted small" style={{ margin: 0 }}>Your slideshow</p>
          <h1>{info.title}</h1>
          <p className="up-address">Plays at <a href={info.tvUrl} target="_blank" rel="noreferrer">{tvShort}</a></p>
        </div>
        <a className="btn btn-dark" href={info.tvUrl} target="_blank" rel="noreferrer">Open slideshow</a>
      </div>

      <label
        className={`dropzone${drag ? ' is-drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}>
        <input type="file" multiple accept={[...IMAGE_TYPES, ...VIDEO_TYPES, 'image/*', 'video/*'].join(',')} className="sr-only"
          onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ''; }} />
        <b>Add photos and videos</b>
        <span className="muted small">Tap to choose, or drag them here. Videos up to {Math.round(info.limits.maxVideoSeconds / 60)} minutes. They play in the order you add them.</span>
      </label>

      <div className="up-meter" aria-label="Space used">
        <div className="bar"><div style={{ width: `${used}%` }} /></div>
        <span className="muted small">{info.items.length} of {info.limits.maxItems} items · {mb(info.bytes)} of {mb(info.limits.maxTotalBytes)}</span>
      </div>

      {jobs.length > 0 && (
        <ul className="up-grid" aria-live="polite">
          {jobs.map((j) => (
            <li key={j.key} className={`up-item is-${j.status}`}>
              {j.preview ? <img src={j.preview} alt="" /> : <span className="up-name">{j.name}</span>}
              {j.status === 'failed' ? (
                <button className="up-tag up-retry" onClick={() => retry(j)} title={j.error}>Retry</button>
              ) : (
                <span className="up-tag">{j.status === 'uploading' ? `${j.progress}%` : j.status === 'preparing' ? 'Preparing' : 'Waiting'}</span>
              )}
              {j.error && <span className="up-err">{j.error}</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="section-head-row">
        <h2>In your slideshow</h2>
        {working === 0 && info.items.length > 0 && <span className="small" style={{ color: 'var(--teal)', fontWeight: 700 }}>All saved. It&rsquo;s live on your TV address.</span>}
      </div>
      {info.items.length === 0 ? (
        <p className="muted">Nothing yet. Add your first photos above.</p>
      ) : (
        <ol className="up-grid">
          {info.items.map((it, n) => (
            <li key={it.id} className="up-item">
              <img src={it.thumbUrl} alt="" loading="lazy" />
              <span className="up-num">{n + 1}</span>
              {it.kind === 'video' && <span className="up-video" aria-label="Video">▶</span>}
              <button className="up-remove" onClick={() => remove(it.id)} aria-label={`Remove item ${n + 1}`}>×</button>
            </li>
          ))}
        </ol>
      )}
      <p className="muted small" style={{ marginTop: 24 }}>
        This page is private to you, so keep the link. On the day, open <b>{tvShort}</b> on the TV and click once for sound. Anything that won&rsquo;t play on a TV is skipped automatically.
        Your slideshow plays until {new Date(info.expiresAt).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })}.
      </p>
    </div>
  );
}
