// Safari cast. Same seven roles and animation hooks as the nursery-rhyme cast.
(function(){
const INK = "#3B2A4A";
Object.assign(window.N18, {
  CAST: "safari",
  SAY: { jump:"Boing boing!", laugh:"Ha ha!", bark:"Roar!", song:"La la la!", walk:"Toot toot!" },
  SOUNDS: { moo:null, woof:"haha", meow:"twinkle", baa:"wobble", clinks:"boing" },

  // Jumper: a leaping gazelle
  COW:`<svg viewBox="0 0 170 120" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M34 50 q-12 -4 -14 -14" fill="none" stroke-width="5"/><path d="M20 36 l-6 -4 4 8z" fill="${INK}"/>
      <path d="M54 68 L28 88M64 72 L44 100M104 70 L132 86M96 74 L118 100" stroke-width="11"/>
      <path d="M54 68 L28 88M64 72 L44 100M104 70 L132 86M96 74 L118 100" stroke="#E0A96D" stroke-width="5"/>
      <circle cx="28" cy="89" r="4" fill="${INK}"/><circle cx="44" cy="101" r="4" fill="${INK}"/><circle cx="133" cy="87" r="4" fill="${INK}"/><circle cx="119" cy="101" r="4" fill="${INK}"/>
      <ellipse cx="80" cy="54" rx="48" ry="22" fill="#E0A96D"/>
      <path d="M40 60 q40 12 80 0" fill="none" stroke="#FFF4E0" stroke-width="8"/>
      <path d="M44 52 q36 6 74 0" fill="none" stroke="#9E6A3A" stroke-width="3"/>
      <path d="M112 44 Q122 28 130 20" fill="none" stroke-width="16"/><path d="M112 44 Q122 28 130 20" fill="none" stroke="#E0A96D" stroke-width="9"/>
      <path d="M130 14 q-4 -14 2 -24M142 12 q2 -14 12 -20" fill="none" stroke-width="4"/>
      <ellipse cx="124" cy="16" rx="8" ry="4" transform="rotate(-30 124 16)" fill="#E0A96D"/>
      <ellipse cx="142" cy="24" rx="16" ry="12" fill="#E0A96D"/>
      <ellipse cx="154" cy="29" rx="7" ry="6" fill="#FFF4E0"/>
      <circle cx="141" cy="20" r="3.4" fill="${INK}" stroke="none"/><circle cx="142.4" cy="18.8" r="1.2" fill="#fff" stroke="none"/>
      <circle cx="157" cy="28" r="1.6" fill="${INK}" stroke="none"/>
    </g>
  </svg>`,

  // Laugher: a lion cub (tail wags, head giggles)
  DOG:`<svg viewBox="0 0 110 110" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="d-tail"><path d="M80 84 q20 -6 18 -26" fill="none" stroke-width="5"/><circle cx="98" cy="56" r="6" fill="#B5652B"/></g>
      <ellipse cx="55" cy="80" rx="28" ry="22" fill="#F2B45A"/>
      <ellipse cx="42" cy="100" rx="9" ry="6" fill="#F2B45A"/><ellipse cx="68" cy="100" rx="9" ry="6" fill="#F2B45A"/>
      <g class="d-head">
        <circle cx="55" cy="44" r="33" fill="#C9772F"/>
        <path d="M24 36 q-4 -10 4 -16M86 36 q4 -10 -4 -16M36 16 q2 -8 10 -8M74 16 q-2 -8 -10 -8" fill="none" stroke="#9E5A22" stroke-width="4"/>
        <circle cx="32" cy="24" r="8" fill="#F2B45A"/><circle cx="78" cy="24" r="8" fill="#F2B45A"/>
        <circle cx="55" cy="46" r="24" fill="#F2B45A"/>
        <path d="M42 38 q5 -6 10 0M58 38 q5 -6 10 0" fill="none" stroke-width="3.5"/>
        <path d="M44 54 q11 16 22 0z" fill="#7A2E3A"/><path d="M50 60 q5 5 10 0" fill="#FF8FA7" stroke="none"/>
        <path d="M50 47 h10 l-5 5z" fill="${INK}"/>
        <circle cx="38" cy="52" r="4" fill="#FF9FB2" stroke="none"/><circle cx="72" cy="52" r="4" fill="#FF9FB2" stroke="none"/>
      </g>
    </g>
  </svg>`,

  // Musician: a monkey playing the fiddle
  CAT:`<svg viewBox="0 0 130 140" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M36 120 q-34 0 -28 -30 q4 -12 14 -8" fill="none" stroke="#8E5B36" stroke-width="8"/>
      <ellipse cx="58" cy="100" rx="30" ry="32" fill="#8E5B36"/>
      <ellipse cx="58" cy="104" rx="18" ry="20" fill="#E8C9A0"/>
      <circle cx="26" cy="50" r="12" fill="#8E5B36"/><circle cx="90" cy="50" r="12" fill="#8E5B36"/>
      <circle cx="26" cy="50" r="6" fill="#E8C9A0" stroke="none"/><circle cx="90" cy="50" r="6" fill="#E8C9A0" stroke="none"/>
      <circle cx="58" cy="50" r="28" fill="#8E5B36"/>
      <path d="M36 52 q0 -18 22 -14 q22 -4 22 14 q2 22 -22 22 q-24 0 -22 -22z" fill="#E8C9A0"/>
      <path d="M44 48 q5 -5 10 0M62 48 q5 -5 10 0" fill="none" stroke-width="3.5"/>
      <circle cx="54" cy="58" r="1.6" fill="${INK}" stroke="none"/><circle cx="62" cy="58" r="1.6" fill="${INK}" stroke="none"/>
      <path d="M50 64 q8 6 16 0" fill="none" stroke-width="3"/>
      <g transform="rotate(-38 88 86)">
        <ellipse cx="88" cy="74" rx="11" ry="10" fill="#B5652B"/>
        <ellipse cx="88" cy="94" rx="13" ry="12" fill="#B5652B"/>
        <rect x="80" y="80" width="16" height="6" fill="#B5652B" stroke="none"/>
        <path d="M88 64 V40" stroke-width="5"/><circle cx="88" cy="38" r="4" fill="${INK}"/>
        <path d="M84 78 v20M92 78 v20" stroke-width="1.5" stroke="#FFE3B8"/>
      </g>
      <path class="c-paw" d="M76 112 q8 -8 16 -6" fill="none" stroke="#8E5B36" stroke-width="9"/>
      <line class="c-bow" x1="70" y1="120" x2="118" y2="62" stroke="#6B4226" stroke-width="3"/>
    </g>
  </svg>`,

  // Wobbler on the wall: a chubby baby hippo
  HUMPTY:`<svg viewBox="0 0 120 160" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M40 124 v20M80 124 v20" stroke-width="18"/><path d="M40 124 v20M80 124 v20" stroke="#A7A2CF" stroke-width="11"/>
      <path class="h-arm-l" d="M24 92 q-16 4 -18 18" fill="none" stroke-width="12"/>
      <path class="h-arm-r" d="M96 92 q16 4 18 18" fill="none" stroke-width="12"/>
      <ellipse cx="60" cy="100" rx="40" ry="38" fill="#A7A2CF"/>
      <ellipse cx="60" cy="110" rx="24" ry="20" fill="#C9C5E6" stroke="none"/>
      <circle cx="34" cy="26" r="9" fill="#A7A2CF"/><circle cx="86" cy="26" r="9" fill="#A7A2CF"/>
      <circle cx="34" cy="26" r="4" fill="#FF9FB2" stroke="none"/><circle cx="86" cy="26" r="4" fill="#FF9FB2" stroke="none"/>
      <ellipse cx="60" cy="50" rx="32" ry="26" fill="#A7A2CF"/>
      <ellipse cx="60" cy="66" rx="30" ry="18" fill="#BFBBE0"/>
      <circle cx="48" cy="40" r="5.5" fill="${INK}" stroke="none"/><circle cx="72" cy="40" r="5.5" fill="${INK}" stroke="none"/>
      <circle cx="50" cy="38" r="1.8" fill="#fff" stroke="none"/><circle cx="74" cy="38" r="1.8" fill="#fff" stroke="none"/>
      <ellipse cx="50" cy="62" rx="3" ry="2" fill="${INK}" stroke="none"/><ellipse cx="70" cy="62" rx="3" ry="2" fill="${INK}" stroke="none"/>
      <path d="M50 72 q10 7 20 0" fill="none" stroke-width="3"/>
      <ellipse cx="34" cy="64" rx="5" ry="3.5" fill="#FF9FB2" stroke="none"/><ellipse cx="86" cy="64" rx="5" ry="3.5" fill="#FF9FB2" stroke="none"/>
    </g>
  </svg>`,

  // Runaway pair: two meerkats scampering
  DISHSPOON:`<svg viewBox="0 0 150 100" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="ds-legs-a"><path d="M30 64 l-8 26M44 64 l8 26" fill="none"/><ellipse cx="20" cy="92" rx="7" ry="4" fill="${INK}"/><ellipse cx="54" cy="92" rx="7" ry="4" fill="${INK}"/></g>
      <path d="M22 60 q-18 4 -20 -10" fill="none" stroke="#C9A06A" stroke-width="6"/>
      <ellipse cx="37" cy="48" rx="18" ry="22" fill="#D8B27E"/>
      <ellipse cx="37" cy="54" rx="10" ry="13" fill="#F3DDB8" stroke="none"/>
      <circle cx="40" cy="20" r="14" fill="#D8B27E"/>
      <ellipse cx="34" cy="18" rx="4.5" ry="5" fill="#6B4A2E" stroke="none"/><ellipse cx="47" cy="18" rx="4.5" ry="5" fill="#6B4A2E" stroke="none"/>
      <circle cx="35" cy="18" r="1.8" fill="#fff" stroke="none"/><circle cx="48" cy="18" r="1.8" fill="#fff" stroke="none"/>
      <path d="M38 27 q4 3 8 0" fill="none" stroke-width="2.6"/>
      <g class="ds-legs-b"><path d="M106 70 l-8 20M120 70 l8 20" fill="none"/><ellipse cx="96" cy="92" rx="7" ry="4" fill="${INK}"/><ellipse cx="130" cy="92" rx="7" ry="4" fill="${INK}"/></g>
      <path d="M100 66 q-16 2 -16 -10" fill="none" stroke="#C9A06A" stroke-width="6"/>
      <ellipse cx="113" cy="54" rx="16" ry="20" fill="#E0BE8A"/>
      <ellipse cx="113" cy="60" rx="9" ry="12" fill="#F3DDB8" stroke="none"/>
      <circle cx="116" cy="28" r="13" fill="#E0BE8A"/>
      <ellipse cx="111" cy="26" rx="4" ry="4.6" fill="#6B4A2E" stroke="none"/><ellipse cx="123" cy="26" rx="4" ry="4.6" fill="#6B4A2E" stroke="none"/>
      <circle cx="112" cy="26" r="1.6" fill="#fff" stroke="none"/><circle cx="124" cy="26" r="1.6" fill="#fff" stroke="none"/>
      <path d="M114 34 q4 3 8 0" fill="none" stroke-width="2.6"/>
    </g>
  </svg>`,

  // Walker: an elephant plodding across (trunk toots)
  SHEEP:`<svg viewBox="0 0 170 135" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke-linecap="round" stroke-linejoin="round">
      <g class="sh-legs-a"><path d="M52 92 v28M108 92 v28" stroke="${INK}" stroke-width="20"/><path d="M52 92 v28M108 92 v28" stroke="#9AA4B8" stroke-width="13"/></g>
      <g class="sh-legs-b"><path d="M68 94 v26M124 90 v28" stroke="${INK}" stroke-width="20"/><path d="M68 94 v26M124 90 v28" stroke="#8791A6" stroke-width="13"/></g>
      <g class="sh-body" stroke="${INK}" stroke-width="4">
        <path d="M34 70 q-16 4 -18 18" fill="none"/><path d="M16 88 l-4 6 8 0z" fill="${INK}"/>
        <ellipse cx="84" cy="70" rx="52" ry="36" fill="#9AA4B8"/>
        <path d="M50 58 q20 -10 44 -4" fill="none" stroke="#B9C1D1" stroke-width="6"/>
        <path d="M60 22 q30 -8 44 0" fill="none" stroke="#F6C75A" stroke-width="6"/>
        <path d="M58 22 l0 20 42 0 0 -18z" fill="#E0607E"/>
        <path d="M62 30 h34M62 36 h34" stroke="#F6C75A" stroke-width="3"/>
        <g class="sh-head">
          <path d="M150 64 q14 24 4 44 q-2 6 6 8" fill="none" stroke="${INK}" stroke-width="18"/>
          <path d="M150 64 q14 24 4 44 q-2 6 6 8" fill="none" stroke="#9AA4B8" stroke-width="11"/>
          <path d="M120 40 q-10 30 10 42 q10 -6 10 -22z" fill="#8791A6"/>
          <circle cx="142" cy="52" r="22" fill="#9AA4B8"/>
          <circle cx="146" cy="46" r="3.4" fill="${INK}" stroke="none"/><circle cx="147.2" cy="44.8" r="1.2" fill="#fff" stroke="none"/>
          <ellipse cx="136" cy="58" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/>
          <path d="M154 66 l12 -3" stroke="#FFFBEF" stroke-width="5"/>
          <path class="sh-mouth" d="M140 66 q5 4 10 0" fill="none" stroke="${INK}" stroke-width="2.6"/>
        </g>
      </g>
    </g>
  </svg>`,

  // Courier: a parrot carrying the letter
  BIRD:`<svg viewBox="0 0 140 130" overflow="visible" style="overflow:visible" aria-hidden="true">
    <path d="M70 70v18" stroke="${INK}" stroke-width="3"/>
    <g transform="translate(46 86) rotate(-6)"><rect width="50" height="34" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M3 4l22 16 22-16" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="25" cy="22" r="5" fill="#E0607E"/></g>
    <path d="M34 42q-26-6-30 10 16 2 30-2z" fill="#4C7FD6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="68" cy="46" rx="36" ry="30" fill="#E0453A" stroke="${INK}" stroke-width="4"/>
    <path class="wing" d="M50 40q-6 26 24 22-2-20-24-22z" fill="#F6C75A" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="86" cy="36" r="7" fill="#FFFBEF" stroke="${INK}" stroke-width="2"/><circle cx="87.5" cy="36" r="3" fill="${INK}"/>
    <path d="M100 34 q20 2 16 20 q-8 -10 -16 -8z" fill="#3B2A4A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  </svg>`
});
N18.wallColours("#F0D9B5", "#C98B4E", "#BF8145", "#D39658");
})();
