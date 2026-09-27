// Woodland Night cast. Same seven roles and animation hooks as the nursery-rhyme cast.
(function(){
const INK = "#3B2A4A";
Object.assign(window.N18, {
  CAST: "woodland",
  SAY: { jump:"Over the moon!", laugh:"Ha ha!", bark:"Hop hop!", song:"La la la!", walk:"Goodnight!" },
  SOUNDS: { moo:null, woof:"haha", meow:"twinkle", baa:"tweet", clinks:"twinkle" },

  // Jumper: a fox leaping over the moon
  COW:`<svg viewBox="0 0 170 120" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M36 52 Q10 60 2 36 Q18 26 40 42Z" fill="#E8793A"/>
      <path d="M4 38 Q8 30 16 30 Q10 40 12 46Z" fill="#FFFBEF"/>
      <path d="M56 68 L34 92M64 72 L48 98M104 70 L130 88M96 74 L116 100" stroke-width="13"/>
      <path d="M56 68 L34 92M64 72 L48 98M104 70 L130 88M96 74 L116 100" stroke="#E8793A" stroke-width="6"/>
      <circle cx="34" cy="93" r="4.5" fill="${INK}"/><circle cx="48" cy="99" r="4.5" fill="${INK}"/><circle cx="131" cy="89" r="4.5" fill="${INK}"/><circle cx="117" cy="101" r="4.5" fill="${INK}"/>
      <ellipse cx="80" cy="54" rx="48" ry="24" fill="#E8793A"/>
      <path d="M50 66 q30 10 60 0" fill="none" stroke="#FFE9D6" stroke-width="8"/>
      <path d="M122 26 L126 6 L136 22Z M140 22 L150 4 L152 24Z" fill="#E8793A"/>
      <path d="M116 40 q4 -20 26 -18 q14 2 26 20 q-10 10 -30 10 q-20 0 -22 -12z" fill="#E8793A"/>
      <path d="M140 44 q14 -2 28 -2 q-8 10 -22 10z" fill="#FFFBEF"/>
      <circle cx="168" cy="42" r="3" fill="${INK}" stroke="none"/>
      <path d="M134 34 q4 -4 8 0" fill="none" stroke-width="3"/>
      <ellipse cx="128" cy="42" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/>
    </g>
  </svg>`,

  // Laugher: a bunny (tail wiggles, head giggles)
  DOG:`<svg viewBox="0 0 110 110" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="d-tail"><circle cx="86" cy="84" r="10" fill="#FFFFFF"/></g>
      <ellipse cx="55" cy="80" rx="28" ry="22" fill="#E6E1EE"/>
      <ellipse cx="42" cy="100" rx="11" ry="6" fill="#E6E1EE"/><ellipse cx="68" cy="100" rx="11" ry="6" fill="#E6E1EE"/>
      <g class="d-head">
        <path d="M40 30 q-10 -30 2 -34 q10 2 8 34z" fill="#E6E1EE"/><path d="M42 26 q-4 -18 2 -22 q4 4 3 22z" fill="#FFB3C4" stroke="none"/>
        <path d="M70 30 q10 -30 -2 -34 q-10 2 -8 34z" fill="#E6E1EE"/><path d="M68 26 q4 -18 -2 -22 q-4 4 -3 22z" fill="#FFB3C4" stroke="none"/>
        <circle cx="55" cy="46" r="25" fill="#E6E1EE"/>
        <path d="M42 40 q5 -6 10 0M58 40 q5 -6 10 0" fill="none" stroke-width="3.5"/>
        <path d="M46 56 q9 14 18 0z" fill="#7A2E3A"/>
        <path d="M51 50 h8 l-4 4z" fill="#FF8FA7"/>
        <circle cx="38" cy="52" r="4" fill="#FF9FB2" stroke="none"/><circle cx="72" cy="52" r="4" fill="#FF9FB2" stroke="none"/>
      </g>
    </g>
  </svg>`,

  // Musician: a bear playing the fiddle
  CAT:`<svg viewBox="0 0 130 140" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <ellipse cx="58" cy="100" rx="32" ry="33" fill="#9C6B45"/>
      <ellipse cx="58" cy="104" rx="18" ry="20" fill="#D9B48A" stroke="none"/>
      <circle cx="34" cy="28" r="11" fill="#9C6B45"/><circle cx="82" cy="28" r="11" fill="#9C6B45"/>
      <circle cx="34" cy="28" r="5" fill="#D9B48A" stroke="none"/><circle cx="82" cy="28" r="5" fill="#D9B48A" stroke="none"/>
      <circle cx="58" cy="52" r="28" fill="#9C6B45"/>
      <ellipse cx="58" cy="62" rx="13" ry="10" fill="#D9B48A"/>
      <ellipse cx="58" cy="57" rx="5" ry="3.6" fill="${INK}"/>
      <path d="M44 48 q5 -5 10 0M62 48 q5 -5 10 0" fill="none" stroke-width="3.5"/>
      <path d="M52 66 q6 5 12 0" fill="none" stroke-width="3"/>
      <ellipse cx="38" cy="60" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/><ellipse cx="78" cy="60" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/>
      <g transform="rotate(-38 88 86)">
        <ellipse cx="88" cy="74" rx="11" ry="10" fill="#B5652B"/>
        <ellipse cx="88" cy="94" rx="13" ry="12" fill="#B5652B"/>
        <rect x="80" y="80" width="16" height="6" fill="#B5652B" stroke="none"/>
        <path d="M88 64 V40" stroke-width="5"/><circle cx="88" cy="38" r="4" fill="${INK}"/>
        <path d="M84 78 v20M92 78 v20" stroke-width="1.5" stroke="#FFE3B8"/>
      </g>
      <path class="c-paw" d="M76 112 q8 -8 16 -6" fill="none" stroke="#9C6B45" stroke-width="11"/>
      <line class="c-bow" x1="70" y1="120" x2="118" y2="62" stroke="#6B4226" stroke-width="3"/>
    </g>
  </svg>`,

  // Wobbler on the wall: a round little owl
  HUMPTY:`<svg viewBox="0 0 120 160" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M46 138 l-6 10M46 138 l0 12M46 138 l6 10M74 138 l-6 10M74 138 l0 12M74 138 l6 10" fill="none" stroke="#F2B43C" stroke-width="4"/>
      <path class="h-arm-l" d="M22 70 q-18 18 -8 48 q14 -8 18 -28z" fill="#8B6B9E"/>
      <path class="h-arm-r" d="M98 70 q18 18 8 48 q-14 -8 -18 -28z" fill="#8B6B9E"/>
      <path d="M26 30 L22 6 L44 22Z M94 30 L98 6 L76 22Z" fill="#A386B5"/>
      <ellipse cx="60" cy="80" rx="40" ry="58" fill="#A386B5"/>
      <ellipse cx="60" cy="104" rx="24" ry="30" fill="#E6D8EE" stroke="none"/>
      <path d="M48 96 q4 4 8 0M64 96 q4 4 8 0M52 110 q4 4 8 0M60 118 q4 4 8 0M46 122 q4 4 8 0" fill="none" stroke="#A386B5" stroke-width="3"/>
      <circle cx="42" cy="48" r="16" fill="#FFFBEF"/><circle cx="78" cy="48" r="16" fill="#FFFBEF"/>
      <circle cx="44" cy="49" r="7" fill="${INK}" stroke="none"/><circle cx="76" cy="49" r="7" fill="${INK}" stroke="none"/>
      <circle cx="46.5" cy="46.5" r="2.4" fill="#fff" stroke="none"/><circle cx="78.5" cy="46.5" r="2.4" fill="#fff" stroke="none"/>
      <path d="M54 62 L60 74 L66 62Z" fill="#F2B43C"/>
      <ellipse cx="30" cy="68" rx="5" ry="3.5" fill="#FF9FB2" stroke="none"/><ellipse cx="90" cy="68" rx="5" ry="3.5" fill="#FF9FB2" stroke="none"/>
    </g>
  </svg>`,

  // Runaway pair: two little mushrooms running off
  DISHSPOON:`<svg viewBox="0 0 150 100" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <g class="ds-legs-a"><path d="M30 66 l-8 22M44 66 l8 22" fill="none"/><ellipse cx="20" cy="90" rx="7" ry="4" fill="${INK}"/><ellipse cx="54" cy="90" rx="7" ry="4" fill="${INK}"/></g>
      <rect x="22" y="34" width="30" height="36" rx="12" fill="#FFF4E0"/>
      <path d="M4 38 Q8 2 37 2 Q66 2 70 38Z" fill="#E0453A"/>
      <circle cx="24" cy="18" r="5" fill="#FFFBEF" stroke="none"/><circle cx="46" cy="12" r="4" fill="#FFFBEF" stroke="none"/><circle cx="56" cy="26" r="4.5" fill="#FFFBEF" stroke="none"/>
      <circle cx="31" cy="48" r="3.2" fill="${INK}" stroke="none"/><circle cx="43" cy="48" r="3.2" fill="${INK}" stroke="none"/>
      <path d="M31 57 q6 6 12 0" fill="none" stroke-width="3"/>
      <g class="ds-legs-b"><path d="M106 72 l-8 20M120 72 l8 20" fill="none"/><ellipse cx="96" cy="94" rx="7" ry="4" fill="${INK}"/><ellipse cx="130" cy="94" rx="7" ry="4" fill="${INK}"/></g>
      <rect x="100" y="42" width="26" height="32" rx="11" fill="#FFF4E0"/>
      <path d="M86 46 Q90 16 113 16 Q136 16 140 46Z" fill="#C98B4E"/>
      <circle cx="104" cy="30" r="3.5" fill="#F3DDB8" stroke="none"/><circle cx="124" cy="28" r="4" fill="#F3DDB8" stroke="none"/>
      <circle cx="108" cy="56" r="3" fill="${INK}" stroke="none"/><circle cx="119" cy="56" r="3" fill="${INK}" stroke="none"/>
      <path d="M108 64 q5.5 5 11 0" fill="none" stroke-width="3"/>
    </g>
  </svg>`,

  // Walker: a deer strolling through the woods
  SHEEP:`<svg viewBox="0 0 170 135" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke-linecap="round" stroke-linejoin="round">
      <g class="sh-legs-a"><path d="M52 90 v30M108 90 v30" stroke="${INK}" stroke-width="13"/><path d="M52 90 v30M108 90 v30" stroke="#C9884E" stroke-width="7"/></g>
      <g class="sh-legs-b"><path d="M66 92 v28M122 88 v30" stroke="${INK}" stroke-width="13"/><path d="M66 92 v28M122 88 v30" stroke="#B87A42" stroke-width="7"/></g>
      <g class="sh-body" stroke="${INK}" stroke-width="4">
        <path d="M34 66 q-10 -8 -6 -18 q8 6 10 14z" fill="#FFFBEF"/>
        <ellipse cx="82" cy="74" rx="50" ry="26" fill="#C9884E"/>
        <circle cx="62" cy="66" r="3.5" fill="#FFF4E0" stroke="none"/><circle cx="78" cy="62" r="3" fill="#FFF4E0" stroke="none"/><circle cx="94" cy="66" r="3.5" fill="#FFF4E0" stroke="none"/><circle cx="72" cy="74" r="2.6" fill="#FFF4E0" stroke="none"/>
        <g class="sh-head">
          <path d="M118 62 Q128 46 134 34" fill="none" stroke="${INK}" stroke-width="18"/>
          <path d="M118 62 Q128 46 134 34" fill="none" stroke="#C9884E" stroke-width="11"/>
          <path d="M132 16 q-6 -12 -2 -20M130 8 l-8 -4M146 14 q6 -12 2 -20M148 6 l8 -4" fill="none" stroke="#8E5B36" stroke-width="4"/>
          <ellipse cx="124" cy="22" rx="9" ry="4.5" transform="rotate(-25 124 22)" fill="#C9884E"/>
          <ellipse cx="142" cy="30" rx="16" ry="13" fill="#C9884E"/>
          <ellipse cx="154" cy="35" rx="6" ry="5" fill="#FFF4E0"/>
          <circle cx="157" cy="33" r="2.4" fill="${INK}" stroke="none"/>
          <circle cx="142" cy="26" r="3.2" fill="${INK}" stroke="none"/><circle cx="143" cy="25" r="1.1" fill="#fff" stroke="none"/>
          <ellipse cx="136" cy="34" rx="4" ry="2.6" fill="#FF9FB2" stroke="none"/>
          <path class="sh-mouth" d="M146 40 q4 3 8 0" fill="none" stroke="${INK}" stroke-width="2.6"/>
        </g>
      </g>
    </g>
  </svg>`,

  // Courier: a little bluebird carrying the letter
  BIRD:`<svg viewBox="0 0 140 130" overflow="visible" style="overflow:visible" aria-hidden="true">
    <path d="M70 70v18" stroke="${INK}" stroke-width="3"/>
    <g transform="translate(46 86) rotate(-6)"><rect width="50" height="34" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M3 4l22 16 22-16" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="25" cy="22" r="5" fill="#E0607E"/></g>
    <path d="M30 42q-22-6-26 6 14 4 26 2z" fill="#3E6FC2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="68" cy="46" rx="36" ry="30" fill="#5B8FE0" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="74" cy="58" rx="20" ry="14" fill="#F2A65A"/>
    <path class="wing" d="M52 40q-6 26 22 22-2-20-22-22z" fill="#3E6FC2" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="86" cy="36" r="5" fill="${INK}"/><circle cx="87.5" cy="34.5" r="1.6" fill="#fff"/>
    <path d="M102 40l14 5-14 5z" fill="#F6C75A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
  </svg>`
});
N18.wallColours("#6B6358", "#857B6C", "#7A7163", "#90867A");
})();
