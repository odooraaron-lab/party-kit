// Shared bits for every page: prompts, dates, and the original storybook artwork.
window.N18 = {
  // ---------- Words on every screen. The host can change any of these on /host. ----------
  // {name} = child's name, {birthday} = "first birthday", "third birthday"…
  TEXT_DEFAULTS: {
    tvTitle:      "A storybook for {name}",
    qrLabel:      "Scan to add your page",
    signOff:      "With love from",
    emptyBanner:  "Once upon a {birthday}",
    emptyText:    "The first page is still blank. Scan the code with your phone camera, write something for {name}, and watch the blackbird fly it in.",
    guestTitle:   "Add a page to {name}'s storybook",
    guestIntro:   "Write a birthday message for {name}. It'll pop up on the big screen as a page in the storybook!",
    sendButton:   "Add my page",
    thanksTitle:  "Your page is in the book!",
    thanksText:   "A blackbird is flying it to the TV right now. Look up and watch it land.",
    cardTitle:    "Add a page to {name}'s storybook",
    cardText:     "Scan the QR code with your phone camera and write a birthday message for {name}. Watch it appear on the TV!",
    // "How to join" steps that rotate under the QR code on the TV. Plain words for everyone.
    howto1:       "Open the camera on your phone",
    howto2:       "Point it at the square above",
    howto3:       "Tap the link that pops up",
    howto4:       "Write a message for {name}",
    howto5:       "Watch it appear on this TV!",
    howto6:       "No camera? Type the address above into your phone",
    wish_label:   "A birthday wish",        wish_ph:   "Happy birthday! I wish you…",
    advice_label: "Words of wisdom",        advice_ph: "My best advice for you is…",
    guess_label:  "I bet this year you'll", guess_ph:  "This year I bet you'll…",
    today_label:  "A party memory",         today_ph:  "My favourite moment today was…"
  },
  // The four kinds of page. Labels/placeholders come from the text above; the host can switch kinds off.
  KIND_ORDER: ["wish", "advice", "guess", "today"],
  KINDS: {},
  last: {},

  // ---------- The cast. Each theme's cast-*.js file replaces the artwork below, plus these. ----------
  CAST: "farm",
  SAY: { jump:"Hey diddle diddle!", laugh:"Ha ha!", bark:"Woof woof!", song:"Meow!", walk:"Baa baa!" },
  SOUNDS: {}, // map a sound name to another (or null for silence); empty = the farm sounds
  // Recolour the brick wall that holds the QR sign.
  wallColours(bg, a, b, c){
    const e = x => x.replace("#", "%23");
    const svg = "%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='30'%3E%3Crect x='1.5' y='1.5' width='57' height='12' rx='2' fill='" + e(a) + "'/%3E%3Crect x='-28.5' y='16.5' width='57' height='12' rx='2' fill='" + e(b) + "'/%3E%3Crect x='31.5' y='16.5' width='57' height='12' rx='2' fill='" + e(c) + "'/%3E%3C/svg%3E";
    const st = document.createElement("style");
    st.textContent = ".brick{background-color:" + bg + ";background-image:url(\"data:image/svg+xml," + svg + "\")}";
    document.head.appendChild(st);
  },

  birthdayWord(s){
    const w = ["","first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth","eleventh","twelfth"];
    const a = Number(s && s.age);
    return (w[a] ? w[a] + " " : "") + "birthday";
  },
  // Text for a key, with the host's version if they changed it.
  t(key, s){
    s = s || this.last || {};
    const custom = s.text && typeof s.text[key] === "string" ? s.text[key] : null;
    const raw = custom !== null && custom.trim() !== "" ? custom : (this.TEXT_DEFAULTS[key] || "");
    const name = (s.name || "").trim() || "the birthday star";
    return raw.replace(/\{name\}/g, name).replace(/\{birthday\}/g, this.birthdayWord(s));
  },
  // Call whenever settings arrive: updates the page kinds from the host's text.
  apply(s){
    this.last = s || {};
    const custom = (this.last.text) || {};
    const kinds = {};
    this.KIND_ORDER.forEach(k => {
      const hidden = custom[k + "_off"] === "1";
      if(!hidden) kinds[k] = { label: this.t(k + "_label"), ph: this.t(k + "_ph") };
    });
    if(!Object.keys(kinds).length) kinds.wish = { label: this.TEXT_DEFAULTS.wish_label, ph: this.TEXT_DEFAULTS.wish_ph };
    this.KINDS = kinds;
    return this;
  },
  kindOf(k){ return this.KINDS[k] ? k : (this.TEXT_DEFAULTS[k + "_label"] ? k : "wish"); },
  label(k){ const kk = this.kindOf(k); return this.KINDS[kk] ? this.KINDS[kk].label : this.t(kk + "_label"); },

  // Little chapter icons, one per prompt.
  ICONS: {
    wish:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6l7.6 16.2 17.4 2.2-12.8 12 3.3 17.4L32 45.2 16.5 53.8l3.3-17.4L7 24.4l17.4-2.2z" fill="#FFC857" stroke="#3B2A4A" stroke-width="3" stroke-linejoin="round"/><circle cx="26" cy="31" r="2.6" fill="#3B2A4A"/><circle cx="38" cy="31" r="2.6" fill="#3B2A4A"/><path d="M27 37q5 4 10 0" fill="none" stroke="#3B2A4A" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    advice:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 18 L18 4 L28 14Z M50 18 L46 4 L36 14Z" fill="#7E68B5" stroke="#3B2A4A" stroke-width="3" stroke-linejoin="round"/><ellipse cx="32" cy="36" rx="22" ry="24" fill="#9C84C8" stroke="#3B2A4A" stroke-width="3"/><ellipse cx="32" cy="44" rx="13" ry="13" fill="#F1E8FF"/><circle cx="23" cy="28" r="8" fill="#fff" stroke="#3B2A4A" stroke-width="2.5"/><circle cx="41" cy="28" r="8" fill="#fff" stroke="#3B2A4A" stroke-width="2.5"/><circle cx="24" cy="29" r="3.5" fill="#3B2A4A"/><circle cx="40" cy="29" r="3.5" fill="#3B2A4A"/><path d="M29 35h6l-3 5z" fill="#FFC857" stroke="#3B2A4A" stroke-width="2" stroke-linejoin="round"/></svg>`,
    guess:`<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="28" r="19" fill="#C9B8F5" stroke="#3B2A4A" stroke-width="3"/><path d="M24 20q4-5 10-5" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M37 30l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" fill="#fff"/><path d="M18 50q14-8 28 0l-3 6H21z" fill="#E0607E" stroke="#3B2A4A" stroke-width="3" stroke-linejoin="round"/></svg>`,
    today:`<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 45q-3 6 2 10t-1 7" fill="none" stroke="#3B2A4A" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="32" cy="24" rx="15" ry="18" fill="#FF8FA7" stroke="#3B2A4A" stroke-width="3"/><path d="M29 42h6l-3 4z" fill="#FF8FA7" stroke="#3B2A4A" stroke-width="2.5" stroke-linejoin="round"/><path d="M25 16q2-5 7-6" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>`
  },

  // ---------- Nursery-rhyme artwork (all original drawings of public-domain rhymes) ----------
  HILLS:`<svg class="hills" viewBox="0 0 1600 320" preserveAspectRatio="__PAR__" aria-hidden="true">
    <path class="hill-back" d="M0 170 C220 90 420 110 640 160 C860 210 1080 90 1300 110 C1440 122 1540 150 1600 160 V320 H0Z"/>
    <path class="hill-front" d="M0 230 C260 170 520 200 760 236 C1000 272 1240 190 1600 214 V320 H0Z"/>
    <g class="flowers">
      <circle cx="520" cy="236" r="9" fill="#FFC857"/><circle cx="560" cy="246" r="7" fill="#FF8FA7"/>
      <circle cx="980" cy="250" r="9" fill="#FFFFFF"/><circle cx="1020" cy="240" r="7" fill="#FFC857"/>
      <circle cx="1180" cy="226" r="8" fill="#FF8FA7"/><circle cx="300" cy="222" r="7" fill="#FFFFFF"/>
    </g>
  </svg>`,
  hills(par){ return this.HILLS.replace("__PAR__", par || "xMidYMax slice"); },

  // Humpty Dumpty, sitting (his legs hang over the front of whatever he sits on)
  HUMPTY:`<svg viewBox="0 0 120 160" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M44 108 v34" stroke-width="12"/><path d="M44 108 v34" stroke="#fff" stroke-width="5"/>
      <path d="M76 108 v34" stroke-width="12"/><path d="M76 108 v34" stroke="#fff" stroke-width="5"/>
      <path d="M44 120 h0M44 132h0M76 120h0M76 132h0" stroke="#E0607E" stroke-width="6"/>
      <ellipse cx="40" cy="148" rx="12" ry="7" fill="#4C6FD6"/><ellipse cx="80" cy="148" rx="12" ry="7" fill="#4C6FD6"/>
      <path class="h-arm-l" d="M22 74 q-16 4 -18 18" fill="none" stroke-width="5"/>
      <path class="h-arm-r" d="M98 74 q16 4 18 18" fill="none" stroke-width="5"/>
      <circle cx="4" cy="94" r="7" fill="#fff"/><circle cx="116" cy="94" r="7" fill="#fff"/>
      <ellipse cx="60" cy="62" rx="40" ry="52" fill="#FBEFD5"/>
      <path d="M21 80 q39 16 78 0 l-1 13 q-38 14 -76 0z" fill="#E0607E"/>
      <path d="M46 70 l14 7 -14 7z M74 70 l-14 7 14 7z" fill="#4C6FD6"/><circle cx="60" cy="77" r="4" fill="#4C6FD6"/>
      <circle cx="46" cy="48" r="7" fill="#3B2A4A" stroke="none"/><circle cx="74" cy="48" r="7" fill="#3B2A4A" stroke="none"/>
      <circle cx="48.5" cy="45.5" r="2.4" fill="#fff" stroke="none"/><circle cx="76.5" cy="45.5" r="2.4" fill="#fff" stroke="none"/>
      <path d="M38 36 q8 -6 15 -1M67 35 q7 -5 15 1" fill="none" stroke-width="3.5"/>
      <path d="M48 62 q12 10 24 0" fill="none"/>
      <ellipse cx="34" cy="60" rx="6" ry="4" fill="#FFB3C4" stroke="none"/><ellipse cx="86" cy="60" rx="6" ry="4" fill="#FFB3C4" stroke="none"/>
      <path d="M40 22 q20 -14 40 0" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>
    </g>
  </svg>`,

  // The cow, mid-jump
  COW:`<svg viewBox="0 0 170 120" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M32 48 q-16 -4 -20 -20" fill="none"/><circle cx="12" cy="26" r="5" fill="#3B2A4A"/>
      <path d="M52 70 L30 96M62 74 L44 100M106 72 L132 92M98 76 L118 102" stroke-width="14"/>
      <path d="M52 70 L30 96M62 74 L44 100M106 72 L132 92M98 76 L118 102" stroke="#fff" stroke-width="7"/>
      <circle cx="30" cy="97" r="5" fill="#3B2A4A"/><circle cx="44" cy="101" r="5" fill="#3B2A4A"/><circle cx="133" cy="93" r="5" fill="#3B2A4A"/><circle cx="119" cy="103" r="5" fill="#3B2A4A"/>
      <ellipse cx="80" cy="56" rx="50" ry="28" fill="#fff"/>
      <path d="M58 32 q16 -4 20 10 q-6 13 -21 9 q-9 -9 1 -19z" fill="#3B2A4A" stroke="none"/>
      <path d="M96 58 q13 -5 17 8 q-4 11 -17 6z" fill="#3B2A4A" stroke="none"/>
      <ellipse cx="86" cy="82" rx="9" ry="6" fill="#FFB3C4"/>
      <path d="M127 24 q-3 -10 4 -13M146 23 q4 -9 11 -8" fill="none" stroke="#E8B64C" stroke-width="5"/>
      <ellipse cx="121" cy="31" rx="9" ry="5" transform="rotate(-30 121 31)" fill="#fff"/>
      <ellipse cx="137" cy="40" rx="19" ry="17" fill="#fff"/>
      <ellipse cx="150" cy="49" rx="13" ry="10" fill="#FFB3C4"/>
      <circle cx="146" cy="48" r="2" fill="#3B2A4A" stroke="none"/><circle cx="154" cy="48" r="2" fill="#3B2A4A" stroke="none"/>
      <circle cx="135" cy="35" r="3.5" fill="#3B2A4A" stroke="none"/>
    </g>
  </svg>`,

  // The little dog who laughed
  DOG:`<svg viewBox="0 0 110 110" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path class="d-tail" d="M80 82 q20 -6 18 -26" fill="none" stroke-width="7"/>
      <ellipse cx="55" cy="80" rx="28" ry="22" fill="#D9985F"/>
      <ellipse cx="42" cy="100" rx="9" ry="6" fill="#D9985F"/><ellipse cx="68" cy="100" rx="9" ry="6" fill="#D9985F"/>
      <g class="d-head">
        <ellipse cx="28" cy="40" rx="10" ry="18" transform="rotate(20 28 40)" fill="#8E5B36"/>
        <ellipse cx="82" cy="40" rx="10" ry="18" transform="rotate(-20 82 40)" fill="#8E5B36"/>
        <circle cx="55" cy="44" r="25" fill="#D9985F"/>
        <path d="M42 38 q5 -6 10 0M58 38 q5 -6 10 0" fill="none" stroke-width="3.5"/>
        <path d="M44 52 q11 16 22 0z" fill="#7A2E3A"/><path d="M50 58 q5 5 10 0" fill="#FF8FA7" stroke="none"/>
        <ellipse cx="55" cy="48" rx="5.5" ry="4" fill="#3B2A4A"/>
        <circle cx="38" cy="50" r="4" fill="#FF9FB2" stroke="none"/><circle cx="72" cy="50" r="4" fill="#FF9FB2" stroke="none"/>
      </g>
    </g>
  </svg>`,

  // The cat with the fiddle
  CAT:`<svg viewBox="0 0 130 140" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M36 118 q-30 -2 -26 -30" fill="none" stroke="#F2A65A" stroke-width="9"/>
      <path d="M36 118 q-30 -2 -26 -30" fill="none" stroke-width="0"/>
      <ellipse cx="58" cy="100" rx="30" ry="32" fill="#F2A65A"/>
      <path d="M44 84 q14 8 28 0" fill="none" stroke="#FFD7A8" stroke-width="6"/>
      <path d="M36 34 L30 8 L52 24Z M80 34 L86 8 L64 24Z" fill="#F2A65A"/>
      <circle cx="58" cy="50" r="27" fill="#F2A65A"/>
      <path d="M46 26 q12 -4 24 0" fill="none" stroke="#D9803A" stroke-width="4"/>
      <path d="M44 48 q5 -5 10 0M62 48 q5 -5 10 0" fill="none" stroke-width="3.5"/>
      <path d="M55 58 h6 l-3 4z" fill="#FF8FA7"/><path d="M52 64 q6 5 12 0" fill="none" stroke-width="3"/>
      <path d="M40 60 h-14M40 65 l-13 4M76 60 h14M76 65 l13 4" stroke-width="2"/>
      <g transform="rotate(-38 88 86)">
        <ellipse cx="88" cy="74" rx="11" ry="10" fill="#B5652B"/>
        <ellipse cx="88" cy="94" rx="13" ry="12" fill="#B5652B"/>
        <rect x="80" y="80" width="16" height="6" fill="#B5652B" stroke="none"/>
        <path d="M88 64 V40" stroke-width="5"/><circle cx="88" cy="38" r="4" fill="#3B2A4A"/>
        <path d="M84 78 v20M92 78 v20" stroke-width="1.5" stroke="#FFE3B8"/>
      </g>
      <path class="c-paw" d="M76 112 q8 -8 16 -6" fill="none" stroke="#F2A65A" stroke-width="9"/>
      <line class="c-bow" x1="70" y1="120" x2="118" y2="62" stroke="#6B4226" stroke-width="3"/>
    </g>
  </svg>`,

  // The dish ran away with the spoon
  DISHSPOON:`<svg viewBox="0 0 150 100" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="ds-legs-a"><path d="M30 60 l-8 30M44 60 l8 30" fill="none"/><ellipse cx="20" cy="92" rx="7" ry="4" fill="#3B2A4A"/><ellipse cx="54" cy="92" rx="7" ry="4" fill="#3B2A4A"/></g>
      <circle cx="37" cy="36" r="28" fill="#fff"/>
      <circle cx="37" cy="36" r="19" fill="none" stroke="#6C8BD8" stroke-width="3" stroke-dasharray="4 5"/>
      <circle cx="30" cy="32" r="3.2" fill="#3B2A4A" stroke="none"/><circle cx="44" cy="32" r="3.2" fill="#3B2A4A" stroke="none"/>
      <path d="M30 42 q7 7 14 0" fill="none" stroke-width="3"/>
      <path d="M64 44 q12 -8 24 -2" fill="none"/>
      <g class="ds-legs-b"><path d="M110 74 l-8 18M116 74 l8 18" fill="none"/><ellipse cx="100" cy="94" rx="7" ry="4" fill="#3B2A4A"/><ellipse cx="126" cy="94" rx="7" ry="4" fill="#3B2A4A"/></g>
      <rect x="107" y="44" width="12" height="34" rx="6" fill="#D9DEE8"/>
      <ellipse cx="113" cy="26" rx="17" ry="22" fill="#D9DEE8"/>
      <path d="M104 14 q6 -6 12 -4" fill="none" stroke="#fff" stroke-width="4"/>
      <circle cx="107" cy="26" r="3" fill="#3B2A4A" stroke="none"/><circle cx="119" cy="26" r="3" fill="#3B2A4A" stroke="none"/>
      <path d="M107 35 q6 6 12 0" fill="none" stroke-width="3"/>
    </g>
  </svg>`,

  // Baa Baa Black Sheep, with three bags full on its back
  SHEEP:`<svg viewBox="0 0 170 135" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke-linecap="round" stroke-linejoin="round">
      <g class="sh-legs-a"><path d="M52 92 v28M108 92 v28" stroke="#2B2635" stroke-width="10"/><ellipse cx="52" cy="122" rx="7" ry="4" fill="#1B1824"/><ellipse cx="108" cy="122" rx="7" ry="4" fill="#1B1824"/></g>
      <g class="sh-legs-b"><path d="M66 94 v26M122 90 v28" stroke="#2B2635" stroke-width="10"/><ellipse cx="66" cy="122" rx="7" ry="4" fill="#1B1824"/><ellipse cx="122" cy="120" rx="7" ry="4" fill="#1B1824"/></g>
      <g class="sh-body">
        <g fill="#4A4460" stroke="#1B1824" stroke-width="5">
          <circle cx="28" cy="66" r="10"/>
          <circle cx="50" cy="72" r="24"/><circle cx="72" cy="60" r="26"/><circle cx="98" cy="62" r="24"/><circle cx="116" cy="76" r="20"/><circle cx="86" cy="86" r="24"/><circle cx="60" cy="88" r="19"/>
        </g>
        <g fill="#4A4460">
          <circle cx="28" cy="66" r="7.6"/>
          <circle cx="50" cy="72" r="21.6"/><circle cx="72" cy="60" r="23.6"/><circle cx="98" cy="62" r="21.6"/><circle cx="116" cy="76" r="17.6"/><circle cx="86" cy="86" r="21.6"/><circle cx="60" cy="88" r="16.6"/>
        </g>
        <path d="M42 70 q5 -6 10 0M64 58 q5 -6 10 0M88 64 q5 -6 10 0M74 84 q5 -6 10 0M104 78 q5 -6 10 0M52 88 q5 -6 10 0" fill="none" stroke="#7A7298" stroke-width="3"/>
        <!-- three bags full -->
        <g stroke="#3B2A4A" stroke-width="3.2" stroke-linejoin="round"><path d="M36 34 q-3 -14 6 -19 h16 q9 5 6 19 q-1 11 -14 11 q-13 0 -14 -11z" fill="#E6C48C"/><path d="M42 15 q8 3 16 0" fill="none" stroke="#8E5B36" stroke-width="3.2"/><path d="M44 30 q2 4 0 8M55 28 q2 5 0 9" fill="none" stroke="#C49A5A" stroke-width="2"/><circle cx="46" cy="10" r="4.6" fill="#fff"/><circle cx="54" cy="9" r="5" fill="#fff"/><circle cx="50" cy="5" r="4.6" fill="#fff"/><path d="M62 26 q-3 -14 6 -19 h16 q9 5 6 19 q-1 11 -14 11 q-13 0 -14 -11z" fill="#EFD19C"/><path d="M68 7 q8 3 16 0" fill="none" stroke="#8E5B36" stroke-width="3.2"/><path d="M70 22 q2 4 0 8M81 20 q2 5 0 9" fill="none" stroke="#C49A5A" stroke-width="2"/><circle cx="72" cy="2" r="4.6" fill="#fff"/><circle cx="80" cy="1" r="5" fill="#fff"/><circle cx="76" cy="-3" r="4.6" fill="#fff"/><path d="M88 34 q-3 -14 6 -19 h16 q9 5 6 19 q-1 11 -14 11 q-13 0 -14 -11z" fill="#E6C48C"/><path d="M94 15 q8 3 16 0" fill="none" stroke="#8E5B36" stroke-width="3.2"/><path d="M96 30 q2 4 0 8M107 28 q2 5 0 9" fill="none" stroke="#C49A5A" stroke-width="2"/><circle cx="98" cy="10" r="4.6" fill="#fff"/><circle cx="106" cy="9" r="5" fill="#fff"/><circle cx="102" cy="5" r="4.6" fill="#fff"/></g>
        <g class="sh-head">
          <ellipse cx="120" cy="52" rx="10" ry="6" transform="rotate(-25 120 52)" fill="#2E2A3A" stroke="#1B1824" stroke-width="3.5"/>
          <ellipse cx="150" cy="47" rx="10" ry="6" transform="rotate(20 150 47)" fill="#2E2A3A" stroke="#1B1824" stroke-width="3.5"/>
          <ellipse cx="121" cy="52" rx="5" ry="2.6" transform="rotate(-25 121 52)" fill="#FF9FB2"/>
          <ellipse cx="136" cy="64" rx="17" ry="21" fill="#2E2A3A" stroke="#1B1824" stroke-width="4"/>
          <circle cx="130" cy="44" r="7" fill="#4A4460" stroke="#1B1824" stroke-width="3"/><circle cx="140" cy="42" r="7" fill="#4A4460" stroke="#1B1824" stroke-width="3"/>
          <circle cx="129" cy="60" r="5" fill="#fff"/><circle cx="143" cy="60" r="5" fill="#fff"/>
          <circle cx="130" cy="61" r="2.4" fill="#1B1824"/><circle cx="144" cy="61" r="2.4" fill="#1B1824"/>
          <ellipse cx="125" cy="72" rx="4" ry="2.6" fill="#FF9FB2" opacity=".85"/><ellipse cx="148" cy="72" rx="4" ry="2.6" fill="#FF9FB2" opacity=".85"/>
          <path class="sh-mouth" d="M131 76 q5 4 10 0" fill="none" stroke="#FFB3C4" stroke-width="2.6"/>
        </g>
      </g>
    </g>
  </svg>`,

  // A blackbird from "Sing a Song of Sixpence", carrying a letter
  BIRD:`<svg viewBox="0 0 140 130" overflow="visible" style="overflow:visible" aria-hidden="true">
    <path d="M70 70v18" stroke="#3B2A4A" stroke-width="3"/>
    <g transform="translate(46 86) rotate(-6)"><rect width="50" height="34" rx="4" fill="#fff" stroke="#3B2A4A" stroke-width="4"/><path d="M3 4l22 16 22-16" fill="none" stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round"/><circle cx="25" cy="22" r="5" fill="#E0607E"/></g>
    <path d="M30 42q-22-6-26 6 14 4 26 2z" fill="#231F2E" stroke="#3B2A4A" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="68" cy="46" rx="36" ry="30" fill="#34304A" stroke="#1B1824" stroke-width="4"/>
    <ellipse cx="72" cy="56" rx="20" ry="14" fill="#4A4563"/>
    <path class="wing" d="M52 40q-6 26 22 22-2-20-22-22z" fill="#231F2E" stroke="#1B1824" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="86" cy="36" r="6.5" fill="#FFC857" stroke="#1B1824" stroke-width="2"/><circle cx="87" cy="36" r="3" fill="#1B1824"/>
    <path d="M102 40l16 6-16 6z" fill="#FF9F43" stroke="#1B1824" stroke-width="3" stroke-linejoin="round"/>
  </svg>`,

  // Split text into letters for a one-time bounce-in.
  bounceText(el, text){
    el.textContent = "";
    el.setAttribute("aria-label", text);
    let i = 0;
    text.split(" ").forEach((word, wi, arr) => {
      const w = document.createElement("span"); w.className = "word"; w.setAttribute("aria-hidden","true");
      Array.from(word).forEach(ch => {
        const s = document.createElement("span"); s.className = "letter"; s.textContent = ch;
        s.style.animationDelay = (i++ * 45) + "ms"; w.append(s);
      });
      el.append(w);
      if(wi < arr.length - 1) el.append(document.createTextNode(" "));
    });
  }
};
window.N18.apply({});
