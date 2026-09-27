// Shared helpers for the Photo Wall pages (guest, TV, host, cards).
window.PW = {
  // Words on every screen. The host can change these on /host. {name} = the event name.
  TEXT_DEFAULTS: {
    title:     "{name}",
    intro:     "Add your photos from today. They'll pop up on the big screen and go into the shared album.",
    qrLabel:   "Scan to add your photos",
    addButton: "Add photos",
    thanks:    "Thank you! Your photos are on the wall.",
    cardTitle: "Share your photos",
    cardText:  "Point your phone camera at the code and add your photos to {name}. No app needed.",
    emptyTv:   "Be the first to add a photo"
  },
  last: {},
  apply(s){ this.last = s || {}; return this; },
  t(key, s){
    s = s || this.last || {};
    const custom = s.text && typeof s.text[key] === "string" && s.text[key].trim() ? s.text[key] : null;
    return (custom || this.TEXT_DEFAULTS[key] || "").replace(/\{name\}/g, (s.name || "").trim() || "the party");
  },
  $(id){ return document.getElementById(id); },

  // Shrink a photo in the browser before sending: faster on phone data, no location
  // data left in the file, and always a normal JPEG the TV can show.
  async shrink(file){
    const img = await this.decode(file);
    try {
      return { full: await this.draw(img, 2048, 0.85), thumb: await this.draw(img, 480, 0.72) };
    } finally { img.close(); }
  },
  async decode(file){
    if(window.createImageBitmap){
      try { const b = await createImageBitmap(file, { imageOrientation: "from-image" }); return { src: b, w: b.width, h: b.height, close: () => b.close && b.close() }; } catch(e){}
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    try { await (img.decode ? img.decode() : new Promise((ok, no) => { img.onload = ok; img.onerror = no; })); }
    catch(e){ URL.revokeObjectURL(url); throw new Error("decode"); }
    return { src: img, w: img.naturalWidth, h: img.naturalHeight, close: () => URL.revokeObjectURL(url) };
  },
  draw(img, max, quality){
    const scale = Math.min(1, max / Math.max(img.w, img.h));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.w * scale)); c.height = Math.max(1, Math.round(img.h * scale));
    const x = c.getContext("2d");
    x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(img.src, 0, 0, c.width, c.height);
    return new Promise((ok, no) => c.toBlob(b => b ? ok(b) : no(new Error("encode")), "image/jpeg", quality));
  },
  plural(n, one, many){ return n + " " + (n === 1 ? one : many); }
};
