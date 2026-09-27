// Dino Valley cast. Fills the same seven roles as the nursery-rhyme cast, with the same
// animation hooks (d-tail, d-head, c-bow, c-paw, h-arm-*, ds-legs-*, sh-*, wing), so the
// TV choreography is unchanged.
(function(){
const INK = "#3B2A4A";
Object.assign(window.N18, {
  CAST: "dino",
  SAY: { jump:"Dino leap!", laugh:"Ha ha!", bark:"Rawr!", song:"La la la!", walk:"Stomp stomp!" },
  SOUNDS: { moo:null, woof:"haha", meow:"twinkle", baa:"wobble", clinks:"boing" },

  // Jumper: a leaping green dino
  COW:`<svg viewBox="0 0 170 120" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M38 52 Q12 46 2 22 Q24 32 44 38Z" fill="#7CC576"/>
      <path d="M56 70 L36 96M66 74 L52 100M104 72 L128 92M96 76 L114 102" stroke-width="15"/>
      <path d="M56 70 L36 96M66 74 L52 100M104 72 L128 92M96 76 L114 102" stroke="#7CC576" stroke-width="8"/>
      <path d="M50 36 L57 22 L64 33Z M66 31 L74 17 L82 30Z M85 30 L92 17 L99 31Z M101 34 L107 23 L113 37Z" fill="#F2A65A"/>
      <ellipse cx="80" cy="56" rx="50" ry="27" fill="#7CC576"/>
      <path d="M52 70 q30 14 62 0" fill="none" stroke="#C9EBA0" stroke-width="7"/>
      <circle cx="66" cy="48" r="5" fill="#5FA85A" stroke="none"/><circle cx="86" cy="42" r="4" fill="#5FA85A" stroke="none"/><circle cx="100" cy="52" r="4.5" fill="#5FA85A" stroke="none"/>
      <path d="M116 42 q2 -22 24 -22 q18 0 24 18 q4 14 -8 20 q-14 6 -30 0 q-10 -4 -10 -16z" fill="#7CC576"/>
      <circle cx="138" cy="34" r="4" fill="${INK}" stroke="none"/><circle cx="139.5" cy="32.5" r="1.4" fill="#fff" stroke="none"/>
      <path d="M144 50 q8 5 14 -2" fill="none" stroke-width="3"/>
      <circle cx="158" cy="40" r="1.8" fill="${INK}" stroke="none"/>
      <ellipse cx="130" cy="46" rx="5" ry="3.2" fill="#FFB3C4" stroke="none"/>
    </g>
  </svg>`,

  // Laugher: a little purple T-rex (tail wags, head giggles)
  DOG:`<svg viewBox="0 0 110 110" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="d-tail"><path d="M78 88 q24 -2 28 -24" fill="none" stroke-width="15"/><path d="M78 88 q24 -2 28 -24" fill="none" stroke="#A98FD8" stroke-width="8"/></g>
      <ellipse cx="55" cy="80" rx="28" ry="22" fill="#A98FD8"/>
      <path d="M44 72 q11 10 22 0" fill="none" stroke="#D9CCF2" stroke-width="6"/>
      <path d="M36 70 q-8 2 -8 9M74 70 q8 2 8 9" fill="none" stroke-width="5"/>
      <ellipse cx="42" cy="100" rx="10" ry="6" fill="#A98FD8"/><ellipse cx="68" cy="100" rx="10" ry="6" fill="#A98FD8"/>
      <g class="d-head">
        <path d="M44 22 L50 10 L56 21Z M56 20 L62 7 L68 20Z" fill="#F2A65A"/>
        <circle cx="55" cy="44" r="26" fill="#A98FD8"/>
        <path d="M42 36 q5 -6 10 0M58 36 q5 -6 10 0" fill="none" stroke-width="3.5"/>
        <path d="M40 50 q15 20 30 0z" fill="#7A2E3A"/>
        <path d="M43 51 l3 5 3 -5M61 51 l3 5 3 -5" fill="#fff" stroke-width="2"/>
        <circle cx="50" cy="45" r="1.6" fill="${INK}" stroke="none"/><circle cx="60" cy="45" r="1.6" fill="${INK}" stroke="none"/>
        <circle cx="36" cy="48" r="4" fill="#FF9FB2" stroke="none"/><circle cx="74" cy="48" r="4" fill="#FF9FB2" stroke="none"/>
      </g>
    </g>
  </svg>`,

  // Musician: a triceratops playing the fiddle
  CAT:`<svg viewBox="0 0 130 140" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M36 118 q-30 -2 -26 -30" fill="none" stroke="#5DBB8E" stroke-width="10"/>
      <ellipse cx="58" cy="100" rx="30" ry="32" fill="#5DBB8E"/>
      <path d="M44 86 q14 8 28 0" fill="none" stroke="#B8E6CF" stroke-width="6"/>
      <path d="M20 54 a38 36 0 0 1 76 0z" fill="#F6C75A"/>
      <circle cx="30" cy="40" r="4" fill="#E0607E" stroke="none"/><circle cx="58" cy="24" r="4" fill="#E0607E" stroke="none"/><circle cx="86" cy="40" r="4" fill="#E0607E" stroke="none"/>
      <circle cx="58" cy="54" r="26" fill="#5DBB8E"/>
      <path d="M44 38 L38 18 L52 32Z M72 38 L78 18 L64 32Z" fill="#FFFBEF"/>
      <path d="M55 60 L58 50 L61 60Z" fill="#FFFBEF" stroke-width="3"/>
      <path d="M44 50 q5 -5 10 0M62 50 q5 -5 10 0" fill="none" stroke-width="3.5"/>
      <path d="M50 66 q8 6 16 0" fill="none" stroke-width="3"/>
      <ellipse cx="42" cy="60" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/><ellipse cx="74" cy="60" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/>
      <g transform="rotate(-38 88 86)">
        <ellipse cx="88" cy="74" rx="11" ry="10" fill="#B5652B"/>
        <ellipse cx="88" cy="94" rx="13" ry="12" fill="#B5652B"/>
        <rect x="80" y="80" width="16" height="6" fill="#B5652B" stroke="none"/>
        <path d="M88 64 V40" stroke-width="5"/><circle cx="88" cy="38" r="4" fill="${INK}"/>
        <path d="M84 78 v20M92 78 v20" stroke-width="1.5" stroke="#FFE3B8"/>
      </g>
      <path class="c-paw" d="M76 112 q8 -8 16 -6" fill="none" stroke="#5DBB8E" stroke-width="10"/>
      <line class="c-bow" x1="70" y1="120" x2="118" y2="62" stroke="#6B4226" stroke-width="3"/>
    </g>
  </svg>`,

  // Wobbler on the wall: a spotty dino egg with a crack (the Humpty role)
  HUMPTY:`<svg viewBox="0 0 120 160" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M44 108 v34" stroke-width="12"/><path d="M44 108 v34" stroke="#7CC576" stroke-width="5"/>
      <path d="M76 108 v34" stroke-width="12"/><path d="M76 108 v34" stroke="#7CC576" stroke-width="5"/>
      <ellipse cx="40" cy="148" rx="12" ry="7" fill="#F2A65A"/><ellipse cx="80" cy="148" rx="12" ry="7" fill="#F2A65A"/>
      <path class="h-arm-l" d="M22 74 q-16 4 -18 18" fill="none" stroke-width="5"/>
      <path class="h-arm-r" d="M98 74 q16 4 18 18" fill="none" stroke-width="5"/>
      <circle cx="4" cy="94" r="7" fill="#7CC576"/><circle cx="116" cy="94" r="7" fill="#7CC576"/>
      <ellipse cx="60" cy="62" rx="40" ry="52" fill="#FBF3DA"/>
      <circle cx="36" cy="30" r="6" fill="#9FD08C" stroke="none"/><circle cx="84" cy="36" r="7" fill="#9FD08C" stroke="none"/><circle cx="30" cy="92" r="6" fill="#9FD08C" stroke="none"/><circle cx="88" cy="94" r="5" fill="#9FD08C" stroke="none"/><circle cx="60" cy="104" r="5" fill="#9FD08C" stroke="none"/>
      <path d="M22 76 l9 -7 8 8 9 -8 8 8 8 -8 9 8 8 -8 9 7" fill="none" stroke-width="3.5"/>
      <circle cx="46" cy="50" r="7" fill="${INK}" stroke="none"/><circle cx="74" cy="50" r="7" fill="${INK}" stroke="none"/>
      <circle cx="48.5" cy="47.5" r="2.4" fill="#fff" stroke="none"/><circle cx="76.5" cy="47.5" r="2.4" fill="#fff" stroke="none"/>
      <path d="M50 62 q10 8 20 0" fill="none"/>
      <ellipse cx="34" cy="60" rx="6" ry="4" fill="#FFB3C4" stroke="none"/><ellipse cx="86" cy="60" rx="6" ry="4" fill="#FFB3C4" stroke="none"/>
      <path d="M40 22 q20 -14 40 0" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>
    </g>
  </svg>`,

  // Runaway pair: two baby dinos racing
  DISHSPOON:`<svg viewBox="0 0 150 100" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="ds-legs-a"><path d="M30 58 l-8 30M44 58 l8 30" fill="none"/><ellipse cx="20" cy="90" rx="7" ry="4" fill="${INK}"/><ellipse cx="54" cy="90" rx="7" ry="4" fill="${INK}"/></g>
      <path d="M14 40 q-12 -2 -14 -14 q10 6 18 6z" fill="#F2A65A"/>
      <path d="M22 16 l5 -9 5 8Z M34 11 l5 -10 5 10Z M46 14 l5 -8 4 9Z" fill="#E0607E"/>
      <circle cx="37" cy="36" r="26" fill="#F2A65A"/>
      <circle cx="44" cy="30" r="3.4" fill="${INK}" stroke="none"/><circle cx="56" cy="30" r="3.4" fill="${INK}" stroke="none"/>
      <path d="M44 42 q7 7 14 0" fill="none" stroke-width="3"/>
      <g class="ds-legs-b"><path d="M106 70 l-8 20M120 70 l8 20" fill="none"/><ellipse cx="96" cy="92" rx="7" ry="4" fill="${INK}"/><ellipse cx="130" cy="92" rx="7" ry="4" fill="${INK}"/></g>
      <path d="M92 50 q-12 0 -16 -12 q10 5 18 4z" fill="#6FA8DC"/>
      <path d="M102 24 l5 -9 5 8Z M114 21 l5 -10 5 10Z" fill="#F6C75A"/>
      <ellipse cx="113" cy="46" rx="22" ry="24" fill="#6FA8DC"/>
      <circle cx="118" cy="40" r="3" fill="${INK}" stroke="none"/><circle cx="129" cy="40" r="3" fill="${INK}" stroke="none"/>
      <path d="M118 52 q6 6 12 0" fill="none" stroke-width="3"/>
    </g>
  </svg>`,

  // Walker: a long-necked dino strolling across
  SHEEP:`<svg viewBox="0 0 170 135" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke-linecap="round" stroke-linejoin="round">
      <g class="sh-legs-a"><path d="M52 92 v28M108 92 v28" stroke="${INK}" stroke-width="17"/><path d="M52 92 v28M108 92 v28" stroke="#6FA8DC" stroke-width="10"/></g>
      <g class="sh-legs-b"><path d="M66 94 v26M122 90 v28" stroke="${INK}" stroke-width="17"/><path d="M66 94 v26M122 90 v28" stroke="#5B92C8" stroke-width="10"/></g>
      <g class="sh-body" stroke="${INK}" stroke-width="4">
        <path d="M40 80 Q14 80 0 58 Q22 66 44 66Z" fill="#6FA8DC"/>
        <ellipse cx="82" cy="78" rx="48" ry="30" fill="#6FA8DC"/>
        <path d="M50 92 q32 14 64 0" fill="none" stroke="#B7D5F2" stroke-width="7"/>
        <circle cx="70" cy="66" r="6" fill="#5B92C8" stroke="none"/><circle cx="92" cy="60" r="5" fill="#5B92C8" stroke="none"/><circle cx="104" cy="74" r="5" fill="#5B92C8" stroke="none"/>
        <g class="sh-head">
          <path d="M112 70 Q128 50 132 22" fill="none" stroke="${INK}" stroke-width="20"/>
          <path d="M112 70 Q128 50 132 22" fill="none" stroke="#6FA8DC" stroke-width="12"/>
          <ellipse cx="142" cy="20" rx="18" ry="12" fill="#6FA8DC"/>
          <circle cx="144" cy="15" r="3" fill="${INK}" stroke="none"/><circle cx="145" cy="14" r="1.1" fill="#fff" stroke="none"/>
          <ellipse cx="136" cy="24" rx="4" ry="2.6" fill="#FF9FB2" stroke="none"/>
          <path class="sh-mouth" d="M146 25 q5 4 10 0" fill="none" stroke="${INK}" stroke-width="2.6"/>
        </g>
      </g>
    </g>
  </svg>`,

  // Courier: a little pterodactyl carrying the letter
  BIRD:`<svg viewBox="0 0 140 130" overflow="visible" style="overflow:visible" aria-hidden="true">
    <path d="M70 66v22" stroke="${INK}" stroke-width="3"/>
    <g transform="translate(46 86) rotate(-6)"><rect width="50" height="34" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M3 4l22 16 22-16" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="25" cy="22" r="5" fill="#E0607E"/></g>
    <path d="M76 30 L54 16 L78 22Z" fill="#E0825A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="70" cy="48" rx="26" ry="20" fill="#F2A65A" stroke="${INK}" stroke-width="4"/>
    <path class="wing" d="M58 44 Q28 8 4 30 Q24 34 32 54 Q46 46 58 44Z" fill="#E0825A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="82" cy="40" r="6" fill="#FFFBEF" stroke="${INK}" stroke-width="2"/><circle cx="83.5" cy="40" r="2.8" fill="${INK}"/>
    <path d="M92 42 L126 48 L92 54Z" fill="#F6C75A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  </svg>`
});
N18.wallColours("#BDB6A9", "#958F84", "#8B857A", "#A09A8F");
})();
