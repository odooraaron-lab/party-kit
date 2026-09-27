// Under the Sea cast. Same seven roles and animation hooks as the nursery-rhyme cast.
(function(){
const INK = "#3B2A4A";
Object.assign(window.N18, {
  CAST: "ocean",
  SAY: { jump:"Splash!", laugh:"Ha ha!", bark:"Snap snap!", song:"La la la!", walk:"Hello!" },
  SOUNDS: { moo:null, woof:"haha", meow:"twinkle", baa:"tweet", clinks:"twinkle" },

  // Jumper: a dolphin leaping over the moon
  COW:`<svg viewBox="0 0 170 120" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M22 70 L6 54 L24 62Z M22 70 L10 88 L28 74Z" fill="#6E9FD6"/>
      <path d="M88 34 q6 -22 24 -26 q-6 14 -2 28z" fill="#6E9FD6"/>
      <path d="M20 72 Q42 24 108 28 Q146 32 162 50 Q154 60 132 58 Q96 56 66 74 Q42 88 20 72Z" fill="#8DB9E8"/>
      <path d="M60 72 q40 -18 92 -14" fill="none" stroke="#DCEBFA" stroke-width="7"/>
      <path d="M94 58 q-2 20 -18 26 q2 -14 0 -24z" fill="#6E9FD6"/>
      <circle cx="130" cy="42" r="4" fill="${INK}" stroke="none"/><circle cx="131.5" cy="40.5" r="1.4" fill="#fff" stroke="none"/>
      <path d="M142 52 q7 4 13 -1" fill="none" stroke-width="3"/>
      <ellipse cx="124" cy="50" rx="5" ry="3" fill="#FFB3C4" stroke="none"/>
      <circle cx="30" cy="30" r="4" fill="#fff" opacity=".8"/><circle cx="42" cy="18" r="3" fill="#fff" opacity=".8"/>
    </g>
  </svg>`,

  // Laugher: a red crab (claw waves, body giggles)
  DOG:`<svg viewBox="0 0 110 110" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M28 88 l-14 10M24 80 l-16 4M82 88 l14 10M86 80 l16 4" fill="none" stroke-width="5"/>
      <path d="M30 72 q-16 -4 -18 -22" fill="none" stroke-width="6"/>
      <path d="M4 48 q2 -14 14 -12 q-2 6 2 10 q-6 8 -16 2z" fill="#F07E6E"/>
      <g class="d-tail">
        <path d="M80 76 q18 -6 18 -28" fill="none" stroke-width="6"/>
        <path d="M88 44 q2 -16 16 -12 q-4 6 0 12 q-8 8 -16 0z" fill="#F07E6E"/>
      </g>
      <g class="d-head">
        <path d="M44 56 v-14M66 56 v-14" fill="none" stroke-width="4"/>
        <circle cx="44" cy="38" r="7" fill="#fff"/><circle cx="66" cy="38" r="7" fill="#fff"/>
        <circle cx="45" cy="39" r="3" fill="${INK}" stroke="none"/><circle cx="67" cy="39" r="3" fill="${INK}" stroke="none"/>
        <ellipse cx="55" cy="76" rx="32" ry="22" fill="#F07E6E"/>
        <path d="M44 74 q11 16 22 0z" fill="#7A2E3A"/><path d="M49 80 q6 4 12 0" fill="#FF8FA7" stroke="none"/>
        <circle cx="34" cy="78" r="4" fill="#FFB3A8" stroke="none"/><circle cx="76" cy="78" r="4" fill="#FFB3A8" stroke="none"/>
      </g>
    </g>
  </svg>`,

  // Musician: an octopus playing the fiddle
  CAT:`<svg viewBox="0 0 130 140" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke-linejoin="round" stroke-linecap="round">
      <path d="M38 84 q-12 22 -28 24M48 90 q-4 26 -18 38M64 92 q0 26 12 36M42 76 q-22 8 -30 -4" fill="none" stroke="${INK}" stroke-width="15"/>
      <path d="M38 84 q-12 22 -28 24M48 90 q-4 26 -18 38M64 92 q0 26 12 36M42 76 q-22 8 -30 -4" fill="none" stroke="#B58BD8" stroke-width="9"/>
      <g stroke="${INK}" stroke-width="4">
        <ellipse cx="56" cy="58" rx="32" ry="36" fill="#B58BD8"/>
        <circle cx="42" cy="34" r="4" fill="#D6BDEE" stroke="none"/><circle cx="70" cy="30" r="5" fill="#D6BDEE" stroke="none"/><circle cx="58" cy="22" r="3" fill="#D6BDEE" stroke="none"/>
        <path d="M42 56 q5 -5 10 0M60 56 q5 -5 10 0" fill="none" stroke-width="3.5"/>
        <path d="M49 70 q7 6 14 0" fill="none" stroke-width="3"/>
        <ellipse cx="38" cy="66" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/><ellipse cx="74" cy="66" rx="4.5" ry="3" fill="#FF9FB2" stroke="none"/>
        <g transform="rotate(-38 88 86)">
          <ellipse cx="88" cy="74" rx="11" ry="10" fill="#B5652B"/>
          <ellipse cx="88" cy="94" rx="13" ry="12" fill="#B5652B"/>
          <rect x="80" y="80" width="16" height="6" fill="#B5652B" stroke="none"/>
          <path d="M88 64 V40" stroke-width="5"/><circle cx="88" cy="38" r="4" fill="${INK}"/>
          <path d="M84 78 v20M92 78 v20" stroke-width="1.5" stroke="#FFE3B8"/>
        </g>
        <path class="c-paw" d="M72 90 q14 10 22 12" fill="none" stroke="#B58BD8" stroke-width="10"/>
        <line class="c-bow" x1="70" y1="120" x2="118" y2="62" stroke="#6B4226" stroke-width="3"/>
      </g>
    </g>
  </svg>`,

  // Wobbler on the wall: a round pufferfish
  HUMPTY:`<svg viewBox="0 0 120 160" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M60 46 l-4 -12 8 0z M28 58 l-10 -8 12 -4z M92 58 l10 -8 -12 -4z M18 96 l-12 0 8 -9z M102 96 l12 0 -8 -9z M34 136 l-8 8 -2 -12z M86 136 l8 8 2 -12z" fill="#F2B43C"/>
      <path class="h-arm-l" d="M18 100 q-14 -4 -16 10 q10 2 16 -4z" fill="#F6C75A"/>
      <path class="h-arm-r" d="M102 100 q14 -4 16 10 q-10 2 -16 -4z" fill="#F6C75A"/>
      <circle cx="60" cy="100" r="46" fill="#FFD66B"/>
      <path d="M26 118 q34 22 68 0" fill="none" stroke="#FFF1C2" stroke-width="8"/>
      <circle cx="42" cy="80" r="3" fill="#E0A93A" stroke="none"/><circle cx="80" cy="74" r="3" fill="#E0A93A" stroke="none"/><circle cx="60" cy="66" r="2.5" fill="#E0A93A" stroke="none"/>
      <circle cx="44" cy="94" r="9" fill="#fff"/><circle cx="76" cy="94" r="9" fill="#fff"/>
      <circle cx="46" cy="95" r="4.5" fill="${INK}" stroke="none"/><circle cx="78" cy="95" r="4.5" fill="${INK}" stroke="none"/>
      <ellipse cx="60" cy="114" rx="6" ry="5" fill="#E0607E"/>
      <ellipse cx="30" cy="106" rx="6" ry="4" fill="#FFB3A8" stroke="none"/><ellipse cx="90" cy="106" rx="6" ry="4" fill="#FFB3A8" stroke="none"/>
    </g>
  </svg>`,

  // Runaway pair: two little fish racing
  DISHSPOON:`<svg viewBox="0 0 150 100" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <path d="M14 42 L0 28 L2 56Z" fill="#F28B3C"/>
      <g class="ds-legs-a"><path d="M34 58 q-2 14 -12 20 q14 2 20 -14z" fill="#F28B3C"/></g>
      <ellipse cx="40" cy="42" rx="30" ry="21" fill="#F28B3C"/>
      <path d="M30 23 q-6 19 0 38M48 22 q-5 20 0 40" fill="none" stroke="#fff" stroke-width="6"/>
      <circle cx="58" cy="37" r="4" fill="${INK}" stroke="none"/><circle cx="59.5" cy="35.5" r="1.4" fill="#fff" stroke="none"/>
      <path d="M58 48 q5 4 10 0" fill="none" stroke-width="3"/>
      <path d="M90 46 L76 32 L78 60Z" fill="#F6D04D"/>
      <g class="ds-legs-b"><path d="M108 62 q-2 14 -12 18 q14 2 20 -14z" fill="#4C7FD6"/></g>
      <ellipse cx="112" cy="46" rx="26" ry="20" fill="#5A8FE6"/>
      <path d="M96 34 q10 -6 22 -4" fill="none" stroke="#2F5CB0" stroke-width="5"/>
      <circle cx="126" cy="41" r="3.6" fill="${INK}" stroke="none"/><circle cx="127.3" cy="39.7" r="1.2" fill="#fff" stroke="none"/>
      <path d="M126 52 q5 4 10 0" fill="none" stroke-width="3"/>
    </g>
  </svg>`,

  // Walker: a sea turtle paddling across
  SHEEP:`<svg viewBox="0 0 170 135" overflow="visible" style="overflow:visible" aria-hidden="true">
    <g stroke="${INK}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <g class="sh-legs-a"><path d="M52 94 q-6 18 -20 24 q18 4 30 -22z" fill="#7CC59A"/><path d="M126 94 q6 18 20 22 q-18 4 -28 -20z" fill="#7CC59A"/></g>
      <g class="sh-legs-b"><path d="M70 96 q-2 16 -14 22 q16 2 24 -20z" fill="#68B287"/><path d="M110 96 q4 16 16 20 q-16 4 -24 -18z" fill="#68B287"/></g>
      <g class="sh-body">
        <path d="M30 92 L20 100 L34 98Z" fill="#7CC59A"/>
        <path d="M34 94 Q38 38 92 36 Q146 38 150 94Z" fill="#6AAE5E"/>
        <path d="M30 94 H154" stroke-width="10"/><path d="M30 94 H154" stroke="#C8A868" stroke-width="5"/>
        <path d="M92 48 l14 10 -5 16 h-18 l-5 -16z M60 64 l12 -6 11 16 -6 14 h-14 z M124 64 l-12 -6 -11 16 6 14 h14z" fill="#86C574" stroke="#4E8A45" stroke-width="3"/>
        <g class="sh-head">
          <path d="M146 88 q6 -8 8 -14" fill="none" stroke-width="16"/><path d="M146 88 q6 -8 8 -14" fill="none" stroke="#7CC59A" stroke-width="9"/>
          <ellipse cx="156" cy="68" rx="15" ry="13" fill="#7CC59A"/>
          <circle cx="160" cy="64" r="3.2" fill="${INK}" stroke="none"/><circle cx="161" cy="63" r="1.1" fill="#fff" stroke="none"/>
          <ellipse cx="150" cy="72" rx="3.6" ry="2.4" fill="#FF9FB2" stroke="none"/>
          <path class="sh-mouth" d="M158 74 q5 3 9 -1" fill="none" stroke="${INK}" stroke-width="2.6"/>
        </g>
      </g>
    </g>
  </svg>`,

  // Courier: a seagull carrying the letter
  BIRD:`<svg viewBox="0 0 140 130" overflow="visible" style="overflow:visible" aria-hidden="true">
    <path d="M70 70v18" stroke="${INK}" stroke-width="3"/>
    <g transform="translate(46 86) rotate(-6)"><rect width="50" height="34" rx="4" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M3 4l22 16 22-16" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/><circle cx="25" cy="22" r="5" fill="#E0607E"/></g>
    <path d="M34 44q-24-4-28 8 16 4 28 0z" fill="#C9D1DC" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <ellipse cx="68" cy="46" rx="36" ry="28" fill="#FFFFFF" stroke="${INK}" stroke-width="4"/>
    <path class="wing" d="M50 40q-6 26 24 22-2-20-24-22z" fill="#C9D1DC" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="86" cy="36" r="5" fill="${INK}"/><circle cx="87.5" cy="34.5" r="1.6" fill="#fff"/>
    <path d="M100 40l18 6-18 6z" fill="#F6C75A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="116" cy="47" r="2" fill="#E0607E"/>
  </svg>`
});
N18.wallColours("#F6E3C3", "#E2B77E", "#D9AD74", "#E8C18C");
})();
