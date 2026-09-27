// Everything here is synthesized live with the Web Audio API: no audio files, nothing to license.
// The tunes are traditional / public-domain melodies played on a little music box.
(function(){
  // Where the pre-recorded MP3s live (used by the "simple" engine for older smart TVs).
  const SOUND_DIR = (function(){ try{ return new URL("sounds/", document.currentScript.src).href; }catch(e){ return "/sounds/"; } })();
  const store = (k, v) => { try{ if(v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); }catch(e){ return null; } };
  const S = {
    music: store("n18-music") !== "off",
    sfx: store("n18-sfx") !== "off",
    ready: false,
    volume: 0.8,
    mode: store("n18-soundmode") === "simple" ? "simple" : "auto",  // "auto" tries live audio first
    engine: null   // "web" (live, generated) or "simple" (MP3 files)
  };
  let ctx = null, out, musicBus, sfxBus, reverbIn, noiseBuf, song = null, nextSongT = null, songIndex = 0, songEndsAt = 0;

  function init(){
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4;
    out = ctx.createGain(); out.gain.value = S.volume * 1.1;
    comp.connect(out); out.connect(ctx.destination);

    // soft room reverb built from decaying noise
    const len = ctx.sampleRate * 2.4, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for(let c=0;c<2;c++){ const d = ir.getChannelData(c); for(let i=0;i<len;i++) d[i] = (Math.random()*2-1) * Math.pow(1 - i/len, 3); }
    const verb = ctx.createConvolver(); verb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    reverbIn = ctx.createGain(); reverbIn.connect(verb); verb.connect(wet); wet.connect(comp);

    musicBus = ctx.createGain(); musicBus.gain.value = S.music ? 0.32 : 0; musicBus.connect(comp); musicBus.connect(reverbIn);
    sfxBus = ctx.createGain(); sfxBus.gain.value = S.sfx ? 0.6 : 0; sfxBus.connect(comp);
    const sfxVerb = ctx.createGain(); sfxVerb.gain.value = 0.5; sfxBus.connect(sfxVerb); sfxVerb.connect(reverbIn);

    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for(let i=0;i<nd.length;i++) nd[i] = Math.random()*2-1;
  }

  // ---------- helpers ----------
  const NOTE = {C:0,"C#":1,D:2,"D#":3,E:4,F:5,"F#":6,G:7,"G#":8,A:9,"A#":10,B:11};
  function freq(n){ const m = n.match(/^([A-G]#?)(\d)$/); return 440 * Math.pow(2, (NOTE[m[1]] + (parseInt(m[2],10)+1)*12 - 69) / 12); }
  function env(g, t, peak, attack, release){
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + release);
  }
  // a music-box / glockenspiel note
  function bell(dest, t, f, vel, ring){
    const g = ctx.createGain(); env(g, t, vel, 0.004, ring || 1.4); g.connect(dest);
    [[1,1],[2,0.32],[3.01,0.1],[4.2,0.04]].forEach(([mult, amp])=>{
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f * mult;
      const a = ctx.createGain(); a.gain.value = amp; o.connect(a); a.connect(g);
      o.start(t); o.stop(t + (ring || 1.4) + 0.1);
    });
  }
  function noise(dest, t, dur){ const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.connect(dest); s.start(t); s.stop(t + dur); return s; }
  function duck(){ if(!S.music) return; const t = ctx.currentTime; musicBus.gain.cancelScheduledValues(t); musicBus.gain.setTargetAtTime(0.1, t, 0.05); musicBus.gain.setTargetAtTime(0.32, t + 1.8, 0.4); }

  // ---------- the tunes (traditional, public domain) ----------
  // [note, beats]; "R" = rest
  const SONGS = [
    { name:"Twinkle, Twinkle, Little Star", bpm:92, notes:[
      ["C5",1],["C5",1],["G5",1],["G5",1],["A5",1],["A5",1],["G5",2],["F5",1],["F5",1],["E5",1],["E5",1],["D5",1],["D5",1],["C5",2],
      ["G5",1],["G5",1],["F5",1],["F5",1],["E5",1],["E5",1],["D5",2],["G5",1],["G5",1],["F5",1],["F5",1],["E5",1],["E5",1],["D5",2],
      ["C5",1],["C5",1],["G5",1],["G5",1],["A5",1],["A5",1],["G5",2],["F5",1],["F5",1],["E5",1],["E5",1],["D5",1],["D5",1],["C5",3]]},
    { name:"Mary Had a Little Lamb", bpm:108, notes:[
      ["E5",1],["D5",1],["C5",1],["D5",1],["E5",1],["E5",1],["E5",2],["D5",1],["D5",1],["D5",2],["E5",1],["G5",1],["G5",2],
      ["E5",1],["D5",1],["C5",1],["D5",1],["E5",1],["E5",1],["E5",1],["E5",1],["D5",1],["D5",1],["E5",1],["D5",1],["C5",4]]},
    { name:"Row, Row, Row Your Boat", bpm:96, notes:[
      ["C5",1.5],["C5",1.5],["C5",1],["D5",0.5],["E5",1.5],["E5",1],["D5",0.5],["E5",1],["F5",0.5],["G5",3],
      ["C6",0.5],["C6",0.5],["C6",0.5],["G5",0.5],["G5",0.5],["G5",0.5],["E5",0.5],["E5",0.5],["E5",0.5],["C5",0.5],["C5",0.5],["C5",0.5],
      ["G5",1],["F5",0.5],["E5",1],["D5",0.5],["C5",3]]},
    { name:"Brahms' Lullaby", bpm:84, notes:[
      ["E5",0.5],["E5",0.5],["G5",2],["E5",0.5],["E5",0.5],["G5",2],["E5",0.5],["G5",0.5],["C6",1],["B5",1.5],["A5",0.5],["A5",1],["G5",1],
      ["D5",0.5],["E5",0.5],["F5",1],["D5",1],["D5",0.5],["E5",0.5],["F5",2],["D5",0.5],["F5",0.5],["B5",0.5],["A5",0.5],["G5",1],["B5",1],["C6",3]]},
    { name:"Happy Birthday", bpm:100, notes:[
      ["G5",0.75],["G5",0.25],["A5",1],["G5",1],["C6",1],["B5",2],["G5",0.75],["G5",0.25],["A5",1],["G5",1],["D6",1],["C6",2],
      ["G5",0.75],["G5",0.25],["G6",1],["E6",1],["C6",1],["B5",1],["A5",2],["F6",0.75],["F6",0.25],["E6",1],["C6",1],["D6",1],["C6",3]]},
    { name:"Baa Baa Black Sheep", bpm:100, notes:[
      ["C5",1],["C5",1],["G5",1],["G5",1],["A5",0.5],["A5",0.5],["A5",0.5],["A5",0.5],["G5",2],
      ["F5",1],["F5",1],["E5",1],["E5",1],["D5",1],["D5",1],["C5",2],
      ["G5",1],["G5",0.5],["G5",0.5],["F5",1],["F5",1],["E5",1],["E5",0.5],["E5",0.5],["D5",2],
      ["G5",1],["G5",0.5],["G5",0.5],["G5",0.5],["F5",0.5],["F5",0.5],["F5",0.5],["E5",1],["E5",0.5],["E5",0.5],["D5",2],
      ["C5",1],["C5",1],["G5",1],["G5",1],["A5",0.5],["A5",0.5],["A5",0.5],["A5",0.5],["G5",2],
      ["F5",1],["F5",1],["E5",1],["E5",1],["D5",1],["D5",1],["C5",3]]}
  ];

  function playSong(){
    clearTimeout(nextSongT);
    if(!S.music || !ctx || S.engine !== "web") return;
    const tune = SONGS[songIndex % SONGS.length]; songIndex++;
    songHook(tune.name);
    const g = ctx.createGain(); g.gain.value = 1; g.connect(musicBus);
    const beat = 60 / tune.bpm; let t = ctx.currentTime + 0.15;
    tune.notes.forEach(([n, b])=>{
      if(n !== "R"){
        bell(g, t, freq(n), 0.22, 1.6);
        // a soft low note on longer notes gives it some warmth
        if(b >= 2) bell(g, t, freq(n) / 4, 0.08, 1.8);
      }
      t += b * beat;
    });
    song = g; songEndsAt = t;
    const lengthMs = (t - ctx.currentTime) * 1000;
    nextSongT = setTimeout(playSong, lengthMs + 12000); // a quiet pause between tunes
  }
  // Start the music only if nothing is already playing (or waiting in the pause between tunes).
  function startMusic(){
    if(!ctx || S.engine !== "web") return;
    if(song && ctx.currentTime < songEndsAt + 13) return;
    playSong();
  }
  function songHook(name){ try{ if(typeof window.N18Sound.onSong === "function") setTimeout(()=>window.N18Sound.onSong(name), 300); }catch(e){} }
  function stopSong(){
    clearTimeout(nextSongT);
    if(song){ const g = song, t = ctx.currentTime; g.gain.setTargetAtTime(0, t, 0.15); setTimeout(()=>g.disconnect(), 1500); song = null; }
  }

  // ---------- sound effects ----------
  const FX = {
    // the new-page sparkle
    chime(){
      const t = ctx.currentTime;
      ["C6","E6","G6","C7","E7"].forEach((n,i)=>bell(sfxBus, t + i*0.075, freq(n), 0.28, 1.6));
    },
    // blackbird tweets
    tweet(){
      const t0 = ctx.currentTime;
      [0, 0.16, 0.42].forEach(off=>{
        const t = t0 + off, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine"; o.frequency.setValueAtTime(2600, t); o.frequency.exponentialRampToValueAtTime(4200, t+0.05); o.frequency.exponentialRampToValueAtTime(3000, t+0.1);
        env(g, t, 0.34, 0.01, 0.1); o.connect(g); g.connect(sfxBus); o.start(t); o.stop(t+0.14);
      });
    },
    // a page turning over
    whoosh(soft){
      const t = ctx.currentTime, f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = "bandpass"; f.Q.value = 0.8; f.frequency.setValueAtTime(700, t); f.frequency.exponentialRampToValueAtTime(3200, t+0.3);
      env(g, t, soft ? 0.25 : 0.55, 0.08, 0.35); f.connect(g); g.connect(sfxBus); noise(f, t, 0.5);
    },
    // the cow: a friendly moo...
    moo(){
      const t = ctx.currentTime, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = "sawtooth"; o.frequency.setValueAtTime(160, t); o.frequency.linearRampToValueAtTime(190, t+0.25); o.frequency.linearRampToValueAtTime(120, t+1.0);
      lfo.frequency.value = 5.5; lg.gain.value = 5; lfo.connect(lg); lg.connect(o.frequency);
      f.type = "lowpass"; f.frequency.setValueAtTime(500, t); f.frequency.linearRampToValueAtTime(1100, t+0.3); f.frequency.linearRampToValueAtTime(450, t+1.0); f.Q.value = 6;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.35, t+0.12); g.gain.setValueAtTime(0.35, t+0.7); g.gain.exponentialRampToValueAtTime(0.0001, t+1.15);
      o.connect(f); f.connect(g); g.connect(sfxBus); o.start(t); lfo.start(t); o.stop(t+1.2); lfo.stop(t+1.2);
    },
    // ...and a boing for the jump
    boing(){
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(520, t+0.35);
      lfo.frequency.value = 14; lg.gain.value = 30; lfo.connect(lg); lg.connect(o.frequency);
      env(g, t, 0.25, 0.01, 0.7); o.connect(g); g.connect(sfxBus); o.start(t); lfo.start(t); o.stop(t+0.8); lfo.stop(t+0.8);
    },
    // the little dog laughing: "ha ha ha"
    haha(){
      const t0 = ctx.currentTime;
      [0, 0.17, 0.34].forEach((off, i)=>{
        const t = t0 + off, o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = "square"; o.frequency.setValueAtTime(820 - i*60, t); o.frequency.exponentialRampToValueAtTime(520 - i*40, t+0.1);
        f.type = "lowpass"; f.frequency.value = 2200;
        env(g, t, 0.12, 0.008, 0.1); o.connect(f); f.connect(g); g.connect(sfxBus); o.start(t); o.stop(t+0.13);
      });
    },
    // Humpty's wobble: a slide whistle
    wobble(){
      const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), lfo = ctx.createOscillator(), lg = ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(620, t); o.frequency.linearRampToValueAtTime(900, t+0.5); o.frequency.linearRampToValueAtTime(480, t+1.2);
      lfo.frequency.value = 6; lg.gain.value = 70; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.24, t+0.08); g.gain.setValueAtTime(0.24, t+0.9); g.gain.exponentialRampToValueAtTime(0.0001, t+1.3);
      o.connect(g); g.connect(sfxBus); o.start(t); lfo.start(t); o.stop(t+1.35); lfo.stop(t+1.35);
    },
    // the cat's fiddle: a quick little jig
    fiddle(){
      const t0 = ctx.currentTime, step = 0.13;
      const tune = [["D5",1],["F#5",1],["A5",1],["D6",2],["A5",1],["B5",1],["A5",1],["F#5",1],["G5",1],["E5",1],["C#5",1],["D5",1],["E5",1],["F#5",1],["E5",1],["D5",3]];
      let t = t0;
      tune.forEach(([n, len])=>{
        const f = freq(n), d = len * step;
        const g = ctx.createGain(), lp = ctx.createBiquadFilter();
        lp.type = "lowpass"; lp.frequency.value = 2600; lp.Q.value = 1.2;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.03); g.gain.setValueAtTime(0.22, t + d * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.08);
        [0.997, 1.004].forEach(det => {
          const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = f * det;
          const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 6; vg.gain.value = f * 0.012;
          vib.connect(vg); vg.connect(o.frequency); o.connect(lp);
          o.start(t); vib.start(t); o.stop(t + d + 0.1); vib.stop(t + d + 0.1);
        });
        lp.connect(g); g.connect(sfxBus);
        t += d;
      });
    },
    // the cat: "mee-ow"
    meow(){
      const t = ctx.currentTime, o = ctx.createOscillator(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(520, t); o.frequency.linearRampToValueAtTime(780, t + 0.25); o.frequency.linearRampToValueAtTime(440, t + 0.75);
      bp.type = "bandpass"; bp.Q.value = 3;
      bp.frequency.setValueAtTime(1000, t); bp.frequency.linearRampToValueAtTime(2000, t + 0.2); bp.frequency.linearRampToValueAtTime(800, t + 0.75);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1.0, t + 0.08); g.gain.setValueAtTime(1.0, t + 0.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);
      o.connect(bp); bp.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.9);
    },
    // the little dog: "woof woof"
    woof(){
      const t0 = ctx.currentTime;
      [0, 0.28].forEach(off => {
        const t = t0 + off, o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = "sawtooth"; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(140, t + 0.16);
        lp.type = "lowpass"; lp.frequency.setValueAtTime(1400, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.16); lp.Q.value = 4;
        env(g, t, 0.45, 0.012, 0.17); o.connect(lp); lp.connect(g); g.connect(sfxBus); o.start(t); o.stop(t + 0.22);
        const nf = ctx.createBiquadFilter(), ng = ctx.createGain(); nf.type = "bandpass"; nf.frequency.value = 900; nf.Q.value = 1;
        env(ng, t, 0.18, 0.005, 0.08); nf.connect(ng); ng.connect(sfxBus); noise(nf, t, 0.1);
      });
    },
    // a shooting star: a sparkly run up the scale and back
    twinkle(){
      const t0 = ctx.currentTime;
      ["C6","D6","E6","G6","A6","C7","D7","E7","G7","E7","C7"].forEach((n, i) => bell(sfxBus, t0 + i * 0.06, freq(n), 0.12 + (i < 8 ? i * 0.012 : 0), 1.3));
    },
    // the black sheep: "baa baa"
    baa(){
      const t0 = ctx.currentTime;
      [[0, 300], [0.62, 270]].forEach(([off, f0]) => {
        const t = t0 + off, d = 0.5;
        const o = ctx.createOscillator(); o.type = "sawtooth";
        o.frequency.setValueAtTime(f0 * 1.08, t); o.frequency.linearRampToValueAtTime(f0, t + 0.12); o.frequency.linearRampToValueAtTime(f0 * 0.9, t + d);
        const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = 9; vg.gain.value = f0 * 0.05; vib.connect(vg); vg.connect(o.frequency);
        const trem = ctx.createOscillator(), tg = ctx.createGain(), amp = ctx.createGain(); trem.frequency.value = 9; tg.gain.value = 0.35; amp.gain.value = 0.65; trem.connect(tg); tg.connect(amp.gain);
        const f1 = ctx.createBiquadFilter(); f1.type = "bandpass"; f1.frequency.value = 850; f1.Q.value = 5;
        const f2 = ctx.createBiquadFilter(); f2.type = "bandpass"; f2.frequency.value = 1250; f2.Q.value = 6;
        const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(1.3, t + 0.06); g.gain.setValueAtTime(1.3, t + d - 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(amp); amp.connect(f1); amp.connect(f2); f1.connect(g); f2.connect(g); g.connect(sfxBus);
        [o, vib, trem].forEach(n => { n.start(t); n.stop(t + d + 0.05); });
      });
    },
    // the dish and the spoon, clinking along
    clinks(){
      const t0 = ctx.currentTime;
      for(let i=0;i<10;i++){
        const t = t0 + i*0.22 + Math.random()*0.04;
        bell(sfxBus, t, (i % 2 ? 2350 : 1980) * (1 + Math.random()*0.02), 0.13, 0.25);
      }
    }
  };

  // ---------- simple engine: plain <audio> + MP3 files, for older smart-TV browsers ----------
  const H = { music:null, fx:null, tune:0, nextT:null, lastNewPage:0, wantMusic:false };
  const SIMPLE_FX = { tweet:"newpage", chime:"chime", moo:"cow", wobble:"wobble", clinks:"clinks", fiddle:"fiddle", meow:"meow", woof:"woof", twinkle:"twinkle", baa:"baa" };
  function simplePrime(){
    // must run inside the click / key press so the TV allows these players to make sound later
    try{
      if(!H.music){ H.music = new Audio(); H.fx = new Audio(); H.music.preload = "auto"; H.fx.preload = "auto";
        H.music.addEventListener("ended", ()=>{ clearTimeout(H.nextT); H.nextT = setTimeout(simpleNextTune, 12000); });
        H.fx.addEventListener("ended", simpleResumeMusic);
        H.fx.addEventListener("error", simpleResumeMusic);
      }
      [H.music, H.fx].forEach(a=>{ a.src = SOUND_DIR + "silence.mp3"; const pr = a.play(); if(pr && pr.catch) pr.catch(()=>{}); });
    }catch(e){}
  }
  function simpleVol(){ if(H.music){ H.music.volume = Math.min(1, S.volume * 0.85); H.fx.volume = Math.min(1, S.volume); } }
  function simpleNextTune(){
    clearTimeout(H.nextT);
    if(!H.music || !S.music || S.engine !== "simple") return;
    H.wantMusic = true; H.tune = (H.tune % SONGS.length) + 1;
    songHook(SONGS[H.tune - 1].name);
    H.music.src = SOUND_DIR + "tune" + H.tune + ".mp3"; simpleVol();
    const pr = H.music.play(); if(pr && pr.catch) pr.catch(()=>{});
  }
  function simpleStartMusic(){ if(!H.wantMusic) simpleNextTune(); }
  function simpleStopMusic(){ clearTimeout(H.nextT); H.wantMusic = false; if(H.music){ try{ H.music.pause(); }catch(e){} } }
  // Some TVs can only play one sound at a time; if an effect interrupted the music, pick it back up.
  function simpleResumeMusic(){
    if(H.music && H.wantMusic && S.music && H.music.paused && !H.music.ended && H.music.currentTime > 0){ const pr = H.music.play(); if(pr && pr.catch) pr.catch(()=>{}); }
  }
  function simplePlay(name, arg){
    let file = SIMPLE_FX[name];
    if(name === "whoosh" && arg) file = "pageturn";              // quiet page turn
    if(name === "tweet") H.lastNewPage = Date.now();              // newpage.mp3 already has tweet + chime + whoosh
    if(name === "chime" && Date.now() - H.lastNewPage < 3000) return;
    if(!file || !H.fx) return;
    try{ H.fx.src = SOUND_DIR + file + ".mp3"; simpleVol(); const pr = H.fx.play(); if(pr && pr.catch) pr.catch(simpleResumeMusic); }catch(e){}
  }

  // ---------- choosing an engine ----------
  function startWeb(){
    if(!(window.AudioContext || window.webkitAudioContext)) return false;
    try{ if(!ctx) init(); if(ctx.state === "suspended" && ctx.resume) ctx.resume(); return true; }catch(e){ ctx = null; return false; }
  }
  function useEngine(which){
    if(S.engine === which) return;
    if(S.engine === "web") stopSong();
    if(S.engine === "simple") simpleStopMusic();
    S.engine = which;
    if(which === "simple"){ simpleVol(); if(S.music) setTimeout(simpleStartMusic, 400); }
    if(which === "web" && S.music) setTimeout(startMusic, 600);
  }
  function chooseEngine(){
    if(S.mode === "simple" || !startWeb()){ useEngine("simple"); return; }
    useEngine("web");
    // If live audio never actually starts (common on older TVs), fall back to the MP3 files.
    setTimeout(()=>{ if(S.engine === "web" && S.mode === "auto" && (!ctx || ctx.state !== "running")) useEngine("simple"); }, 900);
  }

  window.N18Sound = {
    get music(){ return S.music; }, get sfx(){ return S.sfx; }, get ready(){ return S.ready; },
    get engine(){ return S.engine; }, get mode(){ return S.mode; },
    // Browsers only allow sound after a click or key press on the page.
    unlock(){
      simplePrime();
      if(ctx && ctx.state === "suspended" && ctx.resume) ctx.resume();
      if(!S.ready){ S.ready = true; chooseEngine(); }
    },
    setMode(mode){
      mode = mode === "simple" ? "simple" : "auto";
      if(mode === S.mode) return;
      S.mode = mode; store("n18-soundmode", mode);
      if(S.ready) chooseEngine();
    },
    setMusic(on){
      S.music = on; store("n18-music", on ? "on" : "off");
      if(S.engine === "simple"){ if(on){ if(S.ready) simpleStartMusic(); } else simpleStopMusic(); return; }
      if(!ctx) return;
      musicBus.gain.setTargetAtTime(on ? 0.32 : 0, ctx.currentTime, 0.1);
      if(on){ if(S.ready) startMusic(); } else stopSong();
    },
    // 0 to 1, set from the host page
    setVolume(v){
      S.volume = Math.max(0, Math.min(1, v));
      simpleVol();
      if(ctx) out.gain.setTargetAtTime(S.volume * 1.1, ctx.currentTime, 0.1);
    },
    setSfx(on){
      S.sfx = on; store("n18-sfx", on ? "on" : "off");
      if(ctx) sfxBus.gain.setTargetAtTime(on ? 0.6 : 0, ctx.currentTime, 0.05);
    },
    play(name, arg){
      if(!S.ready || !S.sfx) return;
      if(S.engine === "simple"){ simplePlay(name, arg); return; }
      if(!ctx || !FX[name] || ctx.state !== "running") return;
      if(name === "chime" || name === "tweet") duck();
      try{ FX[name](arg); }catch(e){}
    }
  };
})();
