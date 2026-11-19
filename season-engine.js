const YK_SEASON_EPOCH_MS = Date.UTC(2026, 10, 1, 0, 0, 0);
const YK_SEASON_DURATION_MS = 60 * 24 * 60 * 60 * 1000;
const YK_SEASON_MAX_LEVEL = 50;
const YK_POINTS_PER_LEVEL = 5;
const YK_GOLDEN_TRACK_PRICE_USD = '$3';
const YK_GOLDEN_TRACK_PRICE_IQD = '4,500 دینار';

const YK_SEASON_NAMES = [
  'شکۆی شارەکانی کوردستان',
  'وەرزی نەورۆز و نیشتمان',
  'وەرزی کوێستان و بەهار',
  'وەرزی زێڕینی کوردەواری'
];

const YK_REAL_SCENES = {
  erbil_citadel: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erbil_Citadel_and_Machko_tea_house.jpg?width=640',
  sulaymaniyah_city: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sulaymaniyah.jpg?width=640',
  kalar_sherwana: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sherwana_Castle.jpg?width=640',
  duhok_amedi: 'https://commons.wikimedia.org/wiki/Special:FilePath/Amadiya_2009.jpg?width=640',
  kirkuk_citadel: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kirkuk_Citadel.jpg?width=640',
  halabja_ahmadawa: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ahmedawa_waterfall.jpg?width=640',
  zakho_delal: 'https://commons.wikimedia.org/wiki/Special:FilePath/Delal_Bridge_in_Zakho.jpg?width=640',
  akre_mountains: 'https://commons.wikimedia.org/wiki/Special:FilePath/Akre_Kurdistan.jpg?width=640',
  ranya_dukan: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dokan_Lake.jpg?width=640',
  soran_rawanduz: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rawandiz_canyon.jpg?width=640',
  koya_haibat: 'https://commons.wikimedia.org/wiki/Special:FilePath/Koya_Kurdistan.jpg?width=640',
  shaqlawa_safeen: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shaqlawa.jpg?width=640',
  penjwen_winter: 'https://commons.wikimedia.org/wiki/Special:FilePath/Penjwen.jpg?width=640',
  chamchamal_garmian: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kalar_View_from_Sherwana_Castle.jpg?width=640'
};

const YK_CITY_FILTERS = [
  { id: 'all', label: 'هەموو شارەکان' },
  { id: 'erbil', label: 'هەولێر' },
  { id: 'sulaymaniyah', label: 'سلێمانی' },
  { id: 'duhok', label: 'دهۆک و ئامێدی' },
  { id: 'kirkuk', label: 'کەرکووک' },
  { id: 'halabja', label: 'هەڵەبجە و هەورامان' },
  { id: 'kalar', label: 'کەلار و گەرمیان' },
  { id: 'zakho', label: 'زاخۆ' },
  { id: 'akre', label: 'ئاکرێ' },
  { id: 'ranya', label: 'ڕانیە و دووکان' },
  { id: 'soran', label: 'سۆران و ڕواندز' },
  { id: 'koya', label: 'کۆیە' },
  { id: 'shaqlawa', label: 'شەقڵاوە' },
  { id: 'penjwen', label: 'پێنجوێن' },
  { id: 'chamchamal', label: 'چەمچەماڵ' }
];

function getCurrentSeasonCycle() {
  const now = Date.now();
  const elapsed = Math.max(0, now - YK_SEASON_EPOCH_MS);
  const seasonNum = Math.floor(elapsed / YK_SEASON_DURATION_MS) + 1;
  const seasonStart = YK_SEASON_EPOCH_MS + (seasonNum - 1) * YK_SEASON_DURATION_MS;
  const seasonEnd = seasonStart + YK_SEASON_DURATION_MS;
  const remainingMs = Math.max(0, seasonEnd - now);
  const daysLeft = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  const title = YK_SEASON_NAMES[(seasonNum - 1) % YK_SEASON_NAMES.length];
  return { seasonNum, seasonKey: `season_${seasonNum}`, daysLeft, title };
}

function getRoyalCrownSVG(variant = 'gold', size = 56) {
  const palettes = {
    gold: { c1: '#fef08a', c2: '#f59e0b', c3: '#92400e', gem1: '#ef4444', gem2: '#10b981', gem3: '#38bdf8' },
    kurd: { c1: '#fde047', c2: '#dc2626', c3: '#15803d', gem1: '#facc15', gem2: '#ffffff', gem3: '#ef4444' },
    ice: { c1: '#e0f2fe', c2: '#38bdf8', c3: '#1d4ed8', gem1: '#ffffff', gem2: '#67e8f9', gem3: '#818cf8' },
    emerald: { c1: '#a7f3d0', c2: '#10b981', c3: '#064e3b', gem1: '#fde047', gem2: '#ef4444', gem3: '#ffffff' },
    ruby: { c1: '#fecdd3', c2: '#e11d48', c3: '#881337', gem1: '#fde047', gem2: '#38bdf8', gem3: '#ffffff' },
    imperial: { c1: '#fef9c3', c2: '#eab308', c3: '#78350f', gem1: '#dc2626', gem2: '#facc15', gem3: '#16a34a' }
  };
  const p = palettes[variant] || palettes.gold;
  const uid = 'cr_' + variant + '_' + Math.random().toString(36).slice(2, 6);
  return `
    <svg width="${size}" height="${Math.round(size * 0.78)}" viewBox="0 0 120 94" style="filter:drop-shadow(0 6px 14px rgba(0,0,0,0.85)); overflow:visible;">
      <defs>
        <linearGradient id="${uid}_g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${p.c1}"/>
          <stop offset="50%" stop-color="${p.c2}"/>
          <stop offset="100%" stop-color="${p.c3}"/>
        </linearGradient>
      </defs>
      <path d="M16 72 L10 30 L36 48 L60 16 L84 48 L110 30 L104 72 Z" fill="url(#${uid}_g)" stroke="#fef9c3" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="15" y="70" width="90" height="14" rx="6" fill="url(#${uid}_g)" stroke="#fef9c3" stroke-width="2"/>
      <circle cx="10" cy="26" r="5.5" fill="${p.c1}" stroke="${p.c3}" stroke-width="1.5"/>
      <circle cx="60" cy="12" r="7" fill="${p.c1}" stroke="${p.c3}" stroke-width="1.5"/>
      <circle cx="110" cy="26" r="5.5" fill="${p.c1}" stroke="${p.c3}" stroke-width="1.5"/>
      <polygon points="60,36 68,48 60,60 52,48" fill="${p.gem1}" stroke="#ffffff" stroke-width="1.4"/>
      <circle cx="34" cy="52" r="5" fill="${p.gem2}" stroke="#ffffff" stroke-width="1.2"/>
      <circle cx="86" cy="52" r="5" fill="${p.gem3}" stroke="#ffffff" stroke-width="1.2"/>
      <circle cx="36" cy="77" r="3.5" fill="${p.gem1}"/>
      <circle cx="60" cy="77" r="4" fill="${p.gem2}"/>
      <circle cx="84" cy="77" r="3.5" fill="${p.gem3}"/>
    </svg>
  `;
}

function getRoyalFrameRingSVG(variant = 'sherwana', size = 82) {
  const configs = {
    sherwana: { ring1: '#fde047', ring2: '#d97706', ring3: '#7c2d12', accent: '#facc15' },
    kurdistan: { ring1: '#ef4444', ring2: '#facc15', ring3: '#16a34a', accent: '#fde047' },
    frost: { ring1: '#e0f2fe', ring2: '#38bdf8', ring3: '#1e40af', accent: '#bae6fd' },
    nowruz: { ring1: '#fde047', ring2: '#f97316', ring3: '#dc2626', accent: '#fef08a' },
    emerald_city: { ring1: '#6ee7b7', ring2: '#059669', ring3: '#064e3b', accent: '#fde047' },
    ruby_star: { ring1: '#fda4af', ring2: '#e11d48', ring3: '#881337', accent: '#fde047' },
    royal_king: { ring1: '#fef9c3', ring2: '#eab308', ring3: '#991b1b', accent: '#fde047' }
  };
  const c = configs[variant] || configs.sherwana;
  const uid = 'fr_' + variant + '_' + Math.random().toString(36).slice(2, 6);
  const rays = [];
  for (let i = 0; i < 16; i++) {
    const a = (i * 360) / 16;
    rays.push(`<polygon points="60,2 63,12 57,12" fill="${c.accent}" transform="rotate(${a} 60 60)"/>`);
  }
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 120 120" style="pointer-events:none; overflow:visible;">
      <defs>
        <linearGradient id="${uid}_r" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c.ring1}"/>
          <stop offset="50%" stop-color="${c.ring2}"/>
          <stop offset="100%" stop-color="${c.ring3}"/>
        </linearGradient>
      </defs>
      <g class="yk-spin-slow" style="transform-origin:60px 60px;">${rays.join('')}</g>
      <circle cx="60" cy="60" r="49" fill="none" stroke="url(#${uid}_r)" stroke-width="6"/>
      <circle cx="60" cy="60" r="44" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="4 3" opacity="0.85"/>
      <polygon points="60,6 66,14 60,22 54,14" fill="${c.ring1}" stroke="#451a03" stroke-width="1.2"/>
      <polygon points="60,98 66,106 60,114 54,106" fill="${c.ring1}" stroke="#451a03" stroke-width="1.2"/>
      <polygon points="6,60 14,54 22,60 14,66" fill="${c.ring2}" stroke="#451a03" stroke-width="1.2"/>
      <polygon points="98,60 106,54 114,60 106,66" fill="${c.ring2}" stroke="#451a03" stroke-width="1.2"/>
    </svg>
  `;
}

const YK_SEASON_REWARDS = [
  { lv: 1, track: 'gold', city: 'erbil', cityLabel: 'هەولێر', id: 's_g1', name: 'قەڵای هەولێر و مەچکۆ', kind: 'scene', img: YK_REAL_SCENES.erbil_citadel, fallbackGrad: 'linear-gradient(135deg,#4c1d95,#9a3412)', snow: true, desc: 'وێنەی ڕاستەقینەی قەڵای دێرینی هەولێر بە بەفربارینی زیندوو' },
  { lv: 2, track: 'free', city: 'none', id: 's_f2', name: 'چوارچێوەی بەفر (خۆڕایی)', kind: 'frame', variant: 'frost', desc: 'چوارچێوەی سەهۆڵی بۆ هەموو یاریزانان بەبەلاش' },
  { lv: 3, track: 'gold', city: 'sulaymaniyah', cityLabel: 'سلێمانی', id: 's_g3', name: 'شاری سلێمانی و گۆیژە', kind: 'scene', img: YK_REAL_SCENES.sulaymaniyah_city, fallbackGrad: 'linear-gradient(135deg,#0c4a6e,#1e3a8a)', snow: true, desc: 'دیمەنی ڕاستەقینەی شاری ڕۆشنبیری سلێمانی بە بەفرەوە' },
  { lv: 4, track: 'gold', city: 'kalar', cityLabel: 'کەلار و گەرمیان', id: 's_g4', name: 'قەڵای شێروانە لە بەفردا', kind: 'scene', img: YK_REAL_SCENES.kalar_sherwana, fallbackGrad: 'linear-gradient(135deg,#7c2d12,#b45309)', snow: true, desc: 'وێنەی ڕاستەقینەی قەڵای شێروانەی کەلار بە بەفربارینی زیندوو' },
  { lv: 5, track: 'free', city: 'none', id: 's_f5', name: '٢٥٠ دراوی خۆری زێڕین', kind: 'coins', coins: 250, desc: 'دیاریی خۆڕایی دراوی YK بۆ هەموو یاریزانان' },
  { lv: 6, track: 'gold', city: 'duhok', cityLabel: 'دهۆک و ئامێدی', id: 's_g6', name: 'ئامێدی و شاخەکانی دهۆک', kind: 'scene', img: YK_REAL_SCENES.duhok_amedi, fallbackGrad: 'linear-gradient(135deg,#065f46,#0f766e)', snow: true, desc: 'دیمەنی سەرسوڕهێنەری ئامێدی و بادینان لە زستاندا' },
  { lv: 7, track: 'gold', city: 'erbil', cityLabel: 'هەولێر', id: 's_g7', name: 'تاجی پایتەخت (هەولێر)', kind: 'crown', variant: 'gold', desc: 'تاجی زێڕینی ٣ ڕەهەندی بە یاقووتی سوور لە سەرووی وێنەکەت' },
  { lv: 8, track: 'free', city: 'none', id: 's_f8', name: 'چوارچێوەی گڕی نەورۆز', kind: 'frame', variant: 'nowruz', desc: 'چوارچێوەی ئاگرینی خۆڕایی لە دەوری وێنەکەت' },
  { lv: 9, track: 'gold', city: 'kirkuk', cityLabel: 'کەرکووک', id: 's_g9', name: 'قەڵای مێژوویی کەرکووک', kind: 'scene', img: YK_REAL_SCENES.kirkuk_citadel, fallbackGrad: 'linear-gradient(135deg,#991b1b,#d97706)', snow: false, desc: 'وێنەی ڕاستەقینەی قەڵای کەرکووک بۆ پاشبنەما' },
  { lv: 10, track: 'gold', city: 'halabja', cityLabel: 'هەڵەبجە و هەورامان', id: 's_g10', name: 'تافگەی ئەحمەدئاوا و هەورامان', kind: 'scene', img: YK_REAL_SCENES.halabja_ahmadawa, fallbackGrad: 'linear-gradient(135deg,#047857,#0284c7)', snow: true, desc: 'دیمەنی ڕاستەقینەی ئەحمەدئاوا و هەڵەبجە بە بەفرەوە' },
  { lv: 11, track: 'free', city: 'none', id: 's_f11', name: 'ناوی زێڕینی بریقەدار', kind: 'nameStyle', css: 'background:linear-gradient(90deg,#fef08a,#f59e0b,#fde047);-webkit-background-clip:text;-webkit-text-fill-color:transparent;', desc: 'ناوەکەت بە تیشکی زێڕین دەنووسرێت (خۆڕایی)' },
  { lv: 12, track: 'gold', city: 'zakho', cityLabel: 'زاخۆ', id: 's_g12', name: 'پردی دەلالی زاخۆ', kind: 'scene', img: YK_REAL_SCENES.zakho_delal, fallbackGrad: 'linear-gradient(135deg,#1e3a8a,#0284c7)', snow: true, desc: 'وێنەی ڕاستەقینەی پردی مێژوویی دەلال لە زاخۆ' },
  { lv: 14, track: 'gold', city: 'sulaymaniyah', cityLabel: 'سلێمانی', id: 's_g14', name: 'تاجی شاری ڕۆشنبیری', kind: 'crown', variant: 'ice', desc: 'تاجی کریستاڵی شینی سلێمانی لە سەرووی پڕۆفایل' },
  { lv: 15, track: 'free', city: 'none', id: 's_f15', name: 'چوارچێوەی زمڕودی کوردستان', kind: 'frame', variant: 'emerald_city', desc: 'چوارچێوەی سەوز و زێڕینی خۆڕایی بۆ هەمووان' },
  { lv: 16, track: 'gold', city: 'akre', cityLabel: 'ئاکرێ', id: 's_g16', name: 'شاری ئاکرێ و چیاکان', kind: 'scene', img: YK_REAL_SCENES.akre_mountains, fallbackGrad: 'linear-gradient(135deg,#7c2d12,#dc2626)', snow: true, desc: 'دیمەنی ڕاستەقینەی پایتەختی نەورۆز (ئاکرێ)' },
  { lv: 18, track: 'gold', city: 'ranya', cityLabel: 'ڕانیە و دووکان', id: 's_g18', name: 'دەریاچەی دووکان و ڕانیە', kind: 'scene', img: YK_REAL_SCENES.ranya_dukan, fallbackGrad: 'linear-gradient(135deg,#0369a1,#0d9488)', snow: false, desc: 'دیمەنی دەریاچەی دووکان و دەروازەی ڕاپەڕین' },
  { lv: 20, track: 'free', city: 'none', id: 's_f20', name: '٤٥٠ دراوی خۆری زێڕین', kind: 'coins', coins: 450, desc: 'پاداشتی خۆڕایی ئاستی ٢٠ بۆ کڕین لە بازاڕدا' },
  { lv: 22, track: 'gold', city: 'soran', cityLabel: 'سۆران و ڕواندز', id: 's_g22', name: 'خەرەندی ڕواندز و سۆران', kind: 'scene', img: YK_REAL_SCENES.soran_rawanduz, fallbackGrad: 'linear-gradient(135deg,#064e3b,#1e40af)', snow: true, desc: 'دیمەنی ڕاستەقینەی خەرەندی ڕواندز بە بەفربارینەوە' },
  { lv: 24, track: 'gold', city: 'kalar', cityLabel: 'کەلار و گەرمیان', id: 's_g24', name: 'چوارچێوەی زێڕینی شێروانە', kind: 'frame', variant: 'sherwana', desc: 'چوارچێوەی شاهانەی گەرمیان لە دەوری پڕۆفایل' },
  { lv: 25, track: 'free', city: 'none', id: 's_f25', name: 'چوارچێوەی یاقووتی سوور', kind: 'frame', variant: 'ruby_star', desc: 'چوارچێوەی یاقووت و ئەستێرەی زێڕین (خۆڕایی)' },
  { lv: 27, track: 'gold', city: 'koya', cityLabel: 'کۆیە', id: 's_g27', name: 'کۆیە و چیای هەیبەت سوڵتان', kind: 'scene', img: YK_REAL_SCENES.koya_haibat, fallbackGrad: 'linear-gradient(135deg,#581c87,#b45309)', snow: true, desc: 'دیمەنی شاری کۆیە و هەیبەت سوڵتان لە زستاندا' },
  { lv: 29, track: 'gold', city: 'duhok', cityLabel: 'دهۆک و ئامێدی', id: 's_g29', name: 'تاجی زمڕودی بادینان', kind: 'crown', variant: 'emerald', desc: 'تاجی شاهانەی سەوز و زێڕین لە سەرووی وێنەکەت' },
  { lv: 30, track: 'free', city: 'none', id: 's_f30', name: '٦٠٠ دراوی خۆری زێڕین', kind: 'coins', coins: 600, desc: 'دیاریی خۆڕایی ئاستی ٣٠ بۆ هەموو یاریزانان' },
  { lv: 32, track: 'gold', city: 'shaqlawa', cityLabel: 'شەقڵاوە', id: 's_g32', name: 'شەقڵاوە و چیای سەفین', kind: 'scene', img: YK_REAL_SCENES.shaqlawa_safeen, fallbackGrad: 'linear-gradient(135deg,#0f766e,#1d4ed8)', snow: true, desc: 'دیمەنی شەقڵاوە و سەفین بە بەفربارینی زیندوو' },
  { lv: 35, track: 'free', city: 'none', id: 's_f35', name: 'ناوی ئاڵای کوردستان', kind: 'nameStyle', css: 'background:linear-gradient(90deg,#ef4444,#fde047,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;', desc: 'ناوەکەت بە سێ ڕەنگە پیرۆزەکە دەدرەوشێتەوە (خۆڕایی)' },
  { lv: 36, track: 'gold', city: 'penjwen', cityLabel: 'پێنجوێن', id: 's_g36', name: 'بەفرستانی پێنجوێن', kind: 'scene', img: YK_REAL_SCENES.penjwen_winter, fallbackGrad: 'linear-gradient(135deg,#1e3a8a,#38bdf8)', snow: true, desc: 'شاری بەفر و جوانی پێنجوێن بە بەفربارینی زیندوو' },
  { lv: 38, track: 'gold', city: 'kirkuk', cityLabel: 'کەرکووک', id: 's_g38', name: 'تاجی یاقووتی کەرکووک', kind: 'crown', variant: 'ruby', desc: 'تاجی ئاگرین و یاقووتی سوور لە سەرووی پڕۆفایل' },
  { lv: 40, track: 'free', city: 'none', id: 's_f40', name: 'چوارچێوەی خۆری ٢١ پەڕ', kind: 'frame', variant: 'kurdistan', desc: 'چوارچێوەی خۆری ٢١ تیشکی کوردستان (خۆڕایی)' },
  { lv: 42, track: 'gold', city: 'chamchamal', cityLabel: 'چەمچەماڵ', id: 's_g42', name: 'دیمەنی چەمچەماڵ و گەرمیان', kind: 'scene', img: YK_REAL_SCENES.chamchamal_garmian, fallbackGrad: 'linear-gradient(135deg,#92400e,#b91c1c)', snow: true, desc: 'دیمەنی چەمچەماڵ و دەشتی گەرمیان بۆ پاشبنەما' },
  { lv: 45, track: 'gold', city: 'all', cityLabel: 'کوردستان', id: 's_g45', name: '١,٥٠٠ دراوی خۆری زێڕین', kind: 'coins', coins: 1500, desc: 'گەنجینەی تایبەتی بەشداربووانی ڕێڕەوی زێڕین' },
  { lv: 46, track: 'free', city: 'none', id: 's_f46', name: '٨٥٠ دراوی خۆری زێڕین', kind: 'coins', coins: 850, desc: 'پاداشتی خۆڕایی نزیکبوونەوە لە کۆتایی وەرز' },
  { lv: 48, track: 'gold', city: 'all', cityLabel: 'کوردستان', id: 's_g48', name: 'چوارچێوەی پاشای کوردستان', kind: 'frame', variant: 'royal_king', desc: 'بەرزترین و ناوازەترین چوارچێوەی زێڕین و یاقووت' },
  { lv: 50, track: 'gold', city: 'all', cityLabel: 'کوردستان', id: 's_g50', name: 'تاجی ئیمپراتۆری ئاستی ٥٠ + ٣,٠٠٠ YK', kind: 'crown', variant: 'imperial', coins: 3000, desc: 'تاجی ئەفسانەیی ئاستی ٥٠ لەگەڵ ٣,٠٠٠ دراوی YK!' },
  { lv: 50, track: 'free', city: 'none', id: 's_f50', name: 'چوارچێوەی ئەفسانەی ئاستی ٥٠ + ١,٠٠٠ YK', kind: 'frame', variant: 'royal_king', coins: 1000, desc: 'دیاریی گەورەی خۆڕایی بۆ گەیشتن بە ئاستی ٥٠!' }
];

let ykSeasonState = {
  seasonKey: '',
  points: 0,
  todayPoints: 0,
  todayDate: '',
  goldenUnlocked: false,
  claimed: {},
  equippedCrown: '',
  equippedFrame: '',
  equippedScene: '',
  previewItemId: 's_g1',
  filterTrack: 'all',
  filterCity: 'all',
  syncedUid: null
};

function injectUniqueSeasonStyles() {
  if (document.getElementById('ykUniqueSeasonCss')) return;
  const st = document.createElement('style');
  st.id = 'ykUniqueSeasonCss';
  st.textContent = `
    @keyframes ykSpinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes ykCrownFloat {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-5px) scale(1.05); }
    }
    .yk-spin-slow { animation: ykSpinSlow 18s linear infinite; }
    .yk-crown-float { animation: ykCrownFloat 2.6s ease-in-out infinite; }
    .yk-summit-bg {
      background:
        radial-gradient(circle at 50% 12%, rgba(250, 204, 21, 0.22) 0%, transparent 48%),
        radial-gradient(circle at 15% 45%, rgba(185, 28, 28, 0.22) 0%, transparent 45%),
        radial-gradient(circle at 85% 75%, rgba(21, 128, 61, 0.22) 0%, transparent 45%),
        linear-gradient(180deg, #1b0c06 0%, #120704 52%, #090402 100%);
    }
    .yk-royal-glass {
      background: rgba(18, 9, 5, 0.78);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1.5px solid rgba(250, 204, 21, 0.35);
    }
    .yk-no-scrollbar::-webkit-scrollbar { display: none; }
    .yk-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(st);
}

function getTodayIsoDate() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function getSeasonProgressStats() {
  const pts = Math.max(0, Number(ykSeasonState.points) || 0);
  const level = Math.min(YK_SEASON_MAX_LEVEL, Math.floor(pts / YK_POINTS_PER_LEVEL));
  const inStep = pts % YK_POINTS_PER_LEVEL;
  const remaining = level >= YK_SEASON_MAX_LEVEL ? 0 : (YK_POINTS_PER_LEVEL - inStep);
  const pct = level >= YK_SEASON_MAX_LEVEL ? 100 : Math.round((inStep / YK_POINTS_PER_LEVEL) * 100);
  return { pts, level, inStep, remaining, pct };
}

function syncSeasonDataListener() {
  if (typeof db === 'undefined' || typeof playerId === 'undefined' || !playerId) return;
  const cycle = getCurrentSeasonCycle();
  if (ykSeasonState.syncedUid === playerId && ykSeasonState.seasonKey === cycle.seasonKey) return;

  ykSeasonState.syncedUid = playerId;
  ykSeasonState.seasonKey = cycle.seasonKey;

  db.ref(`players/${playerId}`).on('value', snap => {
    const rootData = snap.val() || {};
    const d = (rootData.seasons && rootData.seasons[cycle.seasonKey]) || {};
    const eq = rootData.equipped || {};
    const today = getTodayIsoDate();

    ykSeasonState.points = Number(d.points) || 0;
    ykSeasonState.todayPoints = d.todayDate === today ? (Number(d.todayPoints) || 0) : 0;
    ykSeasonState.todayDate = today;
    ykSeasonState.goldenUnlocked = !!d.goldenUnlocked;
    ykSeasonState.claimed = d.claimed || {};
    ykSeasonState.equippedCrown = eq.seasonCrown || '';
    ykSeasonState.equippedFrame = eq.seasonFrame || '';
    ykSeasonState.equippedScene = eq.seasonScene || '';

    applySeasonCosmeticsToTopHud();
    updateHubSeasonBannerLive();
    if (document.getElementById('ykSeasonRoot')) {
      renderSeasonPassModalBody();
      initAllSnowCanvases();
    }
  });
}

function applySeasonCosmeticsToTopHud() {
  const aura = document.querySelector('.yk-avatar-aura');
  if (!aura) return;

  let crownWrap = document.getElementById('ykHudEquippedCrown');
  if (ykSeasonState.equippedCrown) {
    const item = YK_SEASON_REWARDS.find(r => r.id === ykSeasonState.equippedCrown);
    if (item) {
      if (!crownWrap) {
        crownWrap = document.createElement('div');
        crownWrap.id = 'ykHudEquippedCrown';
        crownWrap.style.cssText = 'position:absolute; top:-20px; left:50%; transform:translateX(-50%); z-index:20; pointer-events:none;';
        aura.appendChild(crownWrap);
      }
      crownWrap.innerHTML = getRoyalCrownSVG(item.variant, 34);
    }
  } else if (crownWrap) {
    crownWrap.remove();
  }

  let frameWrap = document.getElementById('ykHudEquippedFrame');
  if (ykSeasonState.equippedFrame) {
    const fItem = YK_SEASON_REWARDS.find(r => r.id === ykSeasonState.equippedFrame);
    if (fItem) {
      if (!frameWrap) {
        frameWrap = document.createElement('div');
        frameWrap.id = 'ykHudEquippedFrame';
        frameWrap.style.cssText = 'position:absolute; inset:-8px; z-index:15; display:flex; align-items:center; justify-content:center; pointer-events:none;';
        aura.appendChild(frameWrap);
      }
      frameWrap.innerHTML = getRoyalFrameRingSVG(fItem.variant, 68);
    }
  } else if (frameWrap) {
    frameWrap.remove();
  }
}

function addSeasonPoints(delta) {
  if (typeof db === 'undefined' || !playerId) return;
  const cycle = getCurrentSeasonCycle();
  const today = getTodayIsoDate();
  const curToday = ykSeasonState.todayDate === today ? ykSeasonState.todayPoints : 0;
  const newToday = Math.min(35, curToday + delta);
  const actualAdd = Math.max(0, newToday - curToday);
  if (actualAdd <= 0) return 0;

  const mult = (typeof isUserPlusActive === 'function' && isUserPlusActive()) ? 2 : 1;
  const totalGain = actualAdd * mult;
  const nextPts = (ykSeasonState.points || 0) + totalGain;

  db.ref(`players/${playerId}/seasons/${cycle.seasonKey}`).update({
    points: nextPts,
    todayPoints: newToday,
    todayDate: today
  });
  return totalGain;
}

function claimDailySeasonCheckIn() {
  const today = getTodayIsoDate();
  const key = 'daily_' + today;
  if (ykSeasonState.claimed && ykSeasonState.claimed[key]) {
    alert('ئەمڕۆ پاداشتی ڕۆژانەت وەرگرتووە، سبەی بگەڕێوە یان یاری بکە بۆ خاڵی زیاتر!');
    return;
  }
  const cycle = getCurrentSeasonCycle();
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/seasons/${cycle.seasonKey}/claimed/${key}`).set(true);
  }
  const gained = addSeasonPoints(5);
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🔥 دەستخۆش! +${gained || 5} خاڵی وەرزت وەرگرت!`);
}

function purchaseGoldenSeasonTrack() {
  const cycle = getCurrentSeasonCycle();
  if (ykSeasonState.goldenUnlocked) {
    alert('تۆ پێشتر بەشداریت لە ڕێڕەوی زێڕینی ئەم وەرزەدا کردووە! 👑');
    return;
  }
  if (typeof openUnifiedCheckoutModal === 'function') {
    openUnifiedCheckoutModal({
      type: 'season_gold',
      title: `ڕێڕەوی زێڕینی وەرزی ${cycle.seasonNum} 👑`,
      priceLabel: `${YK_GOLDEN_TRACK_PRICE_USD} (${YK_GOLDEN_TRACK_PRICE_IQD})`
    });
    return;
  }
  if (confirm(`بەشداریکردن لە ڕێڕەوی زێڕین تەنها بە ${YK_GOLDEN_TRACK_PRICE_USD} (${YK_GOLDEN_TRACK_PRICE_IQD})؟`)) {
    if (typeof db !== 'undefined' && playerId) {
      db.ref(`players/${playerId}/seasons/${cycle.seasonKey}/goldenUnlocked`).set(true);
    }
  }
}

function giftGoldenSeasonToFriend() {
  const targetUser = prompt('ناوی بەکارهێنەری (Username) هاوڕێکەت بنووسە بۆ ناردنی ڕێڕەوی زێڕین بە $3:');
  if (!targetUser || targetUser.trim().length < 2) return;
  const cleanUser = targetUser.trim().toLowerCase().replace(/^@/, '');
  const uid = 'u_' + cleanUser;
  const cycle = getCurrentSeasonCycle();

  if (typeof db === 'undefined') return;
  db.ref('players/' + uid).once('value', snap => {
    if (!snap.exists()) {
      alert('هیچ یاریزانێک بەم ناوی بەکارهێنەرە نەدۆزرایەوە!');
      return;
    }
    if (typeof openUnifiedCheckoutModal === 'function') {
      openUnifiedCheckoutModal({
        type: 'season_gold',
        title: `دیاریی ڕێڕەوی زێڕین بۆ ${snap.val().name || cleanUser} 🎁`,
        priceLabel: `${YK_GOLDEN_TRACK_PRICE_USD} (${YK_GOLDEN_TRACK_PRICE_IQD})`,
        targetFriendUid: uid
      });
    } else if (confirm(`ناردنی ڕێڕەوی زێڕین ($3) وەک دیاری بۆ ${snap.val().name || cleanUser}؟`)) {
      db.ref(`players/${uid}/seasons/${cycle.seasonKey}/goldenUnlocked`).set(true);
      alert(`🎁 دیارییەکەت گەیشتە ${snap.val().name || cleanUser}!`);
    }
  });
}

function previewSeasonReward(itemId) {
  ykSeasonState.previewItemId = itemId;
  renderSeasonPassModalBody();
  initAllSnowCanvases();
  const root = document.getElementById('ykSeasonRoot');
  if (root) root.scrollTo({ top: 0, behavior: 'smooth' });
}

function claimOrEquipSeasonReward(itemId) {
  const item = YK_SEASON_REWARDS.find(r => r.id === itemId);
  if (!item) return;

  if (item.track === 'gold' && !ykSeasonState.goldenUnlocked) {
    purchaseGoldenSeasonTrack();
    return;
  }

  const isClaimed = !!(ykSeasonState.claimed && ykSeasonState.claimed[item.id]);
  if (isClaimed) {
    if (typeof db !== 'undefined' && playerId) {
      if (item.kind === 'crown') db.ref(`players/${playerId}/equipped/seasonCrown`).set(item.id);
      else if (item.kind === 'frame') db.ref(`players/${playerId}/equipped/seasonFrame`).set(item.id);
      else if (item.kind === 'scene') db.ref(`players/${playerId}/equipped/seasonScene`).set(item.id);
      else if (item.kind === 'nameStyle') db.ref(`players/${playerId}/equipped/nameStyle`).set(item.id);
    }
    if (typeof playChessSound === 'function') playChessSound('move');
    alert(`✨ «${item.name}» چالاک کرا لەسەر پڕۆفایلەکەت!`);
    return;
  }

  const stats = getSeasonProgressStats();
  if (stats.level < item.lv) {
    previewSeasonReward(item.id);
    return;
  }

  const cycle = getCurrentSeasonCycle();
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/seasons/${cycle.seasonKey}/claimed/${item.id}`).set(true);
    db.ref(`players/${playerId}/inventory/${item.id}`).set(true);
    if (item.kind === 'crown') db.ref(`players/${playerId}/equipped/seasonCrown`).set(item.id);
    if (item.kind === 'frame') db.ref(`players/${playerId}/equipped/seasonFrame`).set(item.id);
    if (item.kind === 'scene') db.ref(`players/${playerId}/equipped/seasonScene`).set(item.id);
  }

  if (item.coins && item.coins > 0 && typeof addUserCoins === 'function') {
    addUserCoins(item.coins);
  }
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🎉 پیرۆزە! خەڵاتی «${item.name}» وەرگیرا!`);
}

function openSeasonPassModal() {
  injectUniqueSeasonStyles();
  syncSeasonDataListener();

  const existing = document.getElementById('ykSeasonRoot');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'ykSeasonRoot';
  root.setAttribute('dir', 'rtl');
  root.style.cssText = 'position:fixed; inset:0; width:100vw; height:100dvh; z-index:9986; overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch;';
  root.className = 'yk-summit-bg text-white';

  root.innerHTML = `<div id="ykSeasonBody" class="relative z-10 max-w-xl mx-auto pb-24"></div>`;

  document.body.style.overflow = 'hidden';
  document.body.appendChild(root);
  renderSeasonPassModalBody();
  initAllSnowCanvases();
}

function closeSeasonPassModal() {
  const root = document.getElementById('ykSeasonRoot');
  if (root) root.remove();
  document.body.style.overflow = '';
}

function setSeasonTrackFilter(f) {
  ykSeasonState.filterTrack = f;
  renderSeasonPassModalBody();
  initAllSnowCanvases();
}

function setSeasonCityFilter(cityId) {
  ykSeasonState.filterCity = cityId;
  if (cityId !== 'all') {
    const firstCityReward = YK_SEASON_REWARDS.find(r => r.city === cityId);
    if (firstCityReward) ykSeasonState.previewItemId = firstCityReward.id;
  }
  renderSeasonPassModalBody();
  initAllSnowCanvases();
}

function renderRewardVisualArtwork(item, sizeMode = 'card') {
  const isHero = sizeMode === 'hero';
  const pName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزانی کورد';
  const pAv = (typeof playerAvatarData !== 'undefined') ? playerAvatarData : '';
  const avInner = (pAv && (pAv.startsWith('data:image') || pAv.startsWith('http')))
    ? `<img src="${pAv}" class="w-full h-full object-cover" />`
    : pName.charAt(0);

  if (item.kind === 'scene') {
    return `
      <div class="relative w-full h-full overflow-hidden" style="background:${item.fallbackGrad || '#1a0c06'};">
        <img src="${item.img}" alt="${item.name}"
          onerror="this.style.display='none'"
          class="w-full h-full object-cover ${isHero ? 'scale-105' : ''} transition-transform duration-700" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/30"></div>
        ${item.snow ? '<canvas class="yk-snow-canvas absolute inset-0 w-full h-full pointer-events-none"></canvas>' : ''}
        <div class="absolute bottom-1.5 right-2 left-2 flex items-center justify-between text-[10px] font-black text-amber-200 drop-shadow">
          <span>🏙️ ${item.cityLabel || 'کوردستان'}</span>
          ${item.snow ? '<span class="px-1.5 py-0.2 rounded-full bg-sky-500/45 border border-sky-300/60 text-white">❄️ بەفراوی</span>' : ''}
        </div>
      </div>
    `;
  }

  if (item.kind === 'crown') {
    const avSize = isHero ? 'w-16 h-16' : 'w-11 h-11';
    const crownSize = isHero ? 58 : 42;
    return `
      <div class="relative w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(250,204,21,0.32),rgba(20,9,4,0.95))] pt-4">
        <div class="relative flex flex-col items-center">
          <div class="yk-crown-float -mb-3 relative z-20">${getRoyalCrownSVG(item.variant, crownSize)}</div>
          <div class="${avSize} rounded-full bg-slate-800 border-2 border-yellow-300 overflow-hidden flex items-center justify-center text-base font-black text-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.65)]">
            ${avInner}
          </div>
        </div>
      </div>
    `;
  }

  if (item.kind === 'frame') {
    const wrapSize = isHero ? 92 : 68;
    const avSize = isHero ? 'w-[62px] h-[62px]' : 'w-[46px] h-[46px]';
    return `
      <div class="relative w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.22),rgba(18,8,4,0.96))]">
        <div class="relative flex items-center justify-center" style="width:${wrapSize}px; height:${wrapSize}px;">
          <div class="absolute inset-0 flex items-center justify-center z-20">${getRoyalFrameRingSVG(item.variant, wrapSize)}</div>
          <div class="${avSize} rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-sm font-black text-white z-10">
            ${avInner}
          </div>
        </div>
      </div>
    `;
  }

  if (item.kind === 'nameStyle') {
    return `
      <div class="relative w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.25),rgba(15,8,4,0.96))] px-2">
        <div class="px-3 py-1.5 rounded-2xl bg-black/75 border border-amber-400/50 shadow-lg">
          <span style="${item.css} font-size:${isHero ? '18px' : '13px'}; font-weight:900;">${pName}</span>
        </div>
      </div>
    `;
  }

  return `
    <div class="relative w-full h-full flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(250,204,21,0.34),rgba(24,11,4,0.96))]">
      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 border-2 border-yellow-100 flex items-center justify-center text-2xl shadow-[0_0_22px_rgba(250,204,21,0.8)]">☀️</div>
      <div class="mt-1 text-xs font-black text-yellow-300">+${(item.coins || 0).toLocaleString()} YK</div>
    </div>
  `;
}

function renderSeasonPassModalBody() {
  const body = document.getElementById('ykSeasonBody');
  if (!body) return;

  const cycle = getCurrentSeasonCycle();
  const stats = getSeasonProgressStats();
  const todayDone = !!(ykSeasonState.claimed && ykSeasonState.claimed['daily_' + getTodayIsoDate()]);
  const previewItem = YK_SEASON_REWARDS.find(r => r.id === ykSeasonState.previewItemId) || YK_SEASON_REWARDS[0];

  const filteredList = YK_SEASON_REWARDS.filter(r => {
    if (ykSeasonState.filterTrack === 'gold' && r.track !== 'gold') return false;
    if (ykSeasonState.filterTrack === 'free' && r.track !== 'free') return false;
    if (ykSeasonState.filterCity !== 'all') {
      return r.city === ykSeasonState.filterCity || r.city === 'all';
    }
    return true;
  });

  const goldCount = YK_SEASON_REWARDS.filter(r => r.track === 'gold').length;
  const freeCount = YK_SEASON_REWARDS.filter(r => r.track === 'free').length;

  const cardsHtml = filteredList.map(item => {
    const isGold = item.track === 'gold';
    const reached = stats.level >= item.lv;
    const claimed = !!(ykSeasonState.claimed && ykSeasonState.claimed[item.id]);
    const lockedByPass = isGold && !ykSeasonState.goldenUnlocked;
    const isSelectedPreview = ykSeasonState.previewItemId === item.id;

    let actionBtnHtml = '';
    if (claimed) {
      actionBtnHtml = `<button onclick="event.stopPropagation(); claimOrEquipSeasonReward('${item.id}')" class="w-full py-1.5 rounded-xl bg-emerald-500/25 border border-emerald-400 text-emerald-300 text-[11px] font-black">✓ وەرگیرا • بەکارهێنان</button>`;
    } else if (lockedByPass) {
      actionBtnHtml = `<button onclick="event.stopPropagation(); purchaseGoldenSeasonTrack()" class="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#1a0d06] text-[11px] font-black shadow">👑 تایبەت بە $3</button>`;
    } else if (reached) {
      actionBtnHtml = `<button onclick="event.stopPropagation(); claimOrEquipSeasonReward('${item.id}')" class="w-full py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-600 text-[#050b18] text-[11px] font-black shadow animate-pulse">وەرگرتنی خەڵات 🎁</button>`;
    } else {
      actionBtnHtml = `<div class="w-full py-1.5 rounded-xl bg-white/10 text-amber-200/80 text-[10px] font-black text-center">🔒 پێویستی بە ئاستی ${item.lv} هەیە</div>`;
    }

    return `
      <div onclick="previewSeasonReward('${item.id}')"
        class="cursor-pointer rounded-3xl overflow-hidden flex flex-col justify-between bg-[#160a05]/95 border-2 ${isSelectedPreview ? 'border-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.55)]' : (isGold ? 'border-amber-500/50' : 'border-white/15')} transition hover:scale-[1.02]">
        <div class="relative h-32 w-full">
          ${renderRewardVisualArtwork(item, 'card')}
          <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/75 border border-amber-400/50 text-amber-300 text-[10px] font-black">
            ئاستی ${item.lv}
          </span>
          <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full ${isGold ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1a0d06]' : 'bg-emerald-600 text-white'} text-[9px] font-black shadow">
            ${isGold ? '👑 زێڕین ($3)' : '🎁 خۆڕایی'}
          </span>
        </div>

        <div class="p-3 space-y-2 text-right">
          <div>
            <div class="text-xs font-black text-white truncate">${item.name}</div>
            <div class="text-[10px] text-amber-100/75 line-clamp-1 mt-0.5">${item.desc}</div>
          </div>
          ${actionBtnHtml}
        </div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <div class="sticky top-0 z-30 bg-[#140804]/92 backdrop-blur-lg border-b border-amber-400/35 px-3 py-2.5" style="padding-top: max(12px, env(safe-area-inset-top));">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[11px] font-black">
            ⏳ ${cycle.daysLeft} ڕۆژی ماوە
          </span>
          <span class="text-[10px] text-slate-300 hidden sm:inline">هەر ٢ مانگ جارێک سفر دەبێتەوە</span>
        </div>
        <div class="text-sm font-black gold-text">🏔️ ${cycle.title} • وەرزی ${cycle.seasonNum}</div>
        <button onclick="closeSeasonPassModal()" class="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white font-black text-sm flex items-center justify-center">✕</button>
      </div>
    </div>

    <div class="px-3 pt-3 space-y-3.5">
      <div class="rounded-3xl overflow-hidden border-2 border-yellow-400/75 shadow-[0_18px_45px_rgba(0,0,0,0.85)] bg-[#140804]">
        <div class="relative h-48 w-full">
          ${renderRewardVisualArtwork(previewItem, 'hero')}
          <div class="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/50 text-[11px] font-black text-yellow-300">
            👁️ پێشاندانی ڕاستەوخۆ • ئاستی ${previewItem.lv}
          </div>
        </div>
        <div class="p-4 bg-gradient-to-b from-[#241108] to-[#140804] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div class="text-base font-black text-white">${previewItem.name}</div>
            <p class="text-xs text-amber-100/85 mt-0.5">${previewItem.desc}</p>
          </div>
          <button onclick="purchaseGoldenSeasonTrack()"
            class="px-5 py-2.5 rounded-2xl ${ykSeasonState.goldenUnlocked ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300' : 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#1a0d06] shadow-xl'} text-xs font-black whitespace-nowrap shrink-0">
            ${ykSeasonState.goldenUnlocked ? '✓ وەرزی زێڕین چالاکە' : `👑 کردنەوەی هەموو شارەکان بە ${YK_GOLDEN_TRACK_PRICE_USD}`}
          </button>
        </div>
      </div>

      <div class="yk-royal-glass rounded-3xl p-4 space-y-3">
        <div class="flex items-center justify-between text-xs font-black">
          <span class="text-yellow-300">⭐ ئاستی ئێستات: ${stats.level} / ${YK_SEASON_MAX_LEVEL}</span>
          <span class="text-amber-200">🏆 ${stats.pts} خاڵ (${stats.inStep}/${YK_POINTS_PER_LEVEL})</span>
        </div>

        <div class="w-full h-3.5 rounded-full bg-black/70 border border-amber-400/40 overflow-hidden p-0.5">
          <div class="h-full rounded-full bg-gradient-to-l from-red-500 via-yellow-400 to-emerald-500 transition-all duration-500" style="width:${Math.max(8, stats.pct)}%"></div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button onclick="claimDailySeasonCheckIn()" class="px-3.5 py-2 rounded-xl ${todayDone ? 'bg-white/10 text-slate-300' : 'bg-emerald-500 text-[#050b18] animate-pulse'} text-xs font-black">
            ${todayDone ? '✓ خاڵی ئەمڕۆ وەرگیرا' : '🔥 وەرگرتنی +٥ خاڵی ئەمڕۆ'}
          </button>
          <button onclick="giftGoldenSeasonToFriend()" class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-amber-400/40 text-amber-200 text-xs font-black">
            🎁 ناردن بە دیاری ($3)
          </button>
        </div>
      </div>

      <div class="space-y-1.5">
        <div class="text-[11px] font-black text-amber-300 px-1">🏙️ شارەکەت هەڵبژێرە (تایبەت بە بەشداربووانی $3):</div>
        <div class="yk-no-scrollbar flex items-center gap-1.5 overflow-x-auto pb-1">
          ${YK_CITY_FILTERS.map(c => `
            <button onclick="setSeasonCityFilter('${c.id}')"
              class="px-3 py-1.5 rounded-full text-[11px] font-black whitespace-nowrap border transition ${ykSeasonState.filterCity === c.id ? 'bg-gradient-to-r from-amber-300 to-yellow-500 text-[#1a0d06] border-yellow-200 shadow' : 'bg-black/55 text-amber-100 border-amber-400/30 hover:border-amber-300'}">
              ${c.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 bg-black/50 p-1.5 rounded-2xl border border-amber-400/30 text-xs font-black">
        <button onclick="setSeasonTrackFilter('all')" class="py-2 rounded-xl ${ykSeasonState.filterTrack === 'all' ? 'bg-amber-400 text-[#1a0d06]' : 'text-amber-100'}">هەمووی (${YK_SEASON_REWARDS.length})</button>
        <button onclick="setSeasonTrackFilter('gold')" class="py-2 rounded-xl ${ykSeasonState.filterTrack === 'gold' ? 'bg-amber-400 text-[#1a0d06]' : 'text-amber-100'}">👑 زێڕین (${goldCount})</button>
        <button onclick="setSeasonTrackFilter('free')" class="py-2 rounded-xl ${ykSeasonState.filterTrack === 'free' ? 'bg-emerald-500 text-[#050b18]' : 'text-emerald-300'}">🎁 خۆڕایی (${freeCount})</button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        ${cardsHtml}
      </div>
    </div>
  `;
}

function initAllSnowCanvases() {
  document.querySelectorAll('canvas.yk-snow-canvas').forEach(cvs => {
    if (cvs.dataset.snowRunning) return;
    cvs.dataset.snowRunning = '1';
    const ctx = cvs.getContext('2d');
    const flakes = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.4 + 1.1,
      vy: Math.random() * 0.008 + 0.003,
      vx: (Math.random() - 0.5) * 0.003,
      a: Math.random() * 0.65 + 0.35
    }));

    function frame() {
      if (!document.body.contains(cvs)) return;
      const w = (cvs.width = cvs.offsetWidth || 260);
      const h = (cvs.height = cvs.offsetHeight || 140);
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy;
        f.x += f.vx;
        if (f.y > 1.05) { f.y = -0.05; f.x = Math.random(); }
        if (f.x < -0.05) f.x = 1.05;
        if (f.x > 1.05) f.x = -0.05;
        ctx.beginPath();
        ctx.arc(f.x * w, f.y * h, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.a})`;
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    frame();
  });
}

function updateHubSeasonBannerLive() {
  const cycle = getCurrentSeasonCycle();
  const stats = getSeasonProgressStats();
  const lvlTag = document.getElementById('hubSeasonLevelTag');
  const bar = document.getElementById('hubSeasonBar');
  if (lvlTag) lvlTag.textContent = `ئاستی ${stats.level}/${YK_SEASON_MAX_LEVEL} • ${cycle.daysLeft} ڕۆژ`;
  if (bar) {
    bar.style.width = `${Math.max(8, Math.round((stats.level / YK_SEASON_MAX_LEVEL) * 100))}%`;
    const bannerCard = bar.closest('.rounded-2xl');
    if (bannerCard && !bannerCard.dataset.ykSeasonWired) {
      bannerCard.dataset.ykSeasonWired = '1';
      bannerCard.style.cursor = 'pointer';
      bannerCard.onclick = () => openSeasonPassModal();
      const topRow = bannerCard.querySelector('.flex.items-center.justify-between');
      if (topRow && !document.getElementById('hubSeasonOpenBtn')) {
        const openPill = document.createElement('span');
        openPill.id = 'hubSeasonOpenBtn';
        openPill.className = 'px-2.5 py-0.5 rounded-full bg-amber-400 text-[#1a0d06] text-[10px] font-black shadow';
        openPill.textContent = '🏔️ شکۆی شارەکان ➔';
        topRow.appendChild(openPill);
      }
    }
  }
}

window.openSeasonPassModal = openSeasonPassModal;
window.closeSeasonPassModal = closeSeasonPassModal;
window.purchaseGoldenSeasonTrack = purchaseGoldenSeasonTrack;
window.giftGoldenSeasonToFriend = giftGoldenSeasonToFriend;
window.previewSeasonReward = previewSeasonReward;
window.claimOrEquipSeasonReward = claimOrEquipSeasonReward;
window.claimDailySeasonCheckIn = claimDailySeasonCheckIn;
window.setSeasonTrackFilter = setSeasonTrackFilter;
window.setSeasonCityFilter = setSeasonCityFilter;

(function initSeasonBootstrap() {
  const hookAwardXp = () => {
    if (typeof window.awardGameXp === 'function' && !window._ykSeasonXpHooked) {
      window._ykSeasonXpHooked = true;
      const origAward = window.awardGameXp;
      window.awardGameXp = function (resultType) {
        const res = origAward.apply(this, arguments);
        const sGain = resultType === 'win' ? 5 : (resultType === 'draw' ? 3 : 2);
        addSeasonPoints(sGain);
        return res;
      };
    }
  };

  const boot = () => {
    updateHubSeasonBannerLive();
    syncSeasonDataListener();
    hookAwardXp();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(() => { syncSeasonDataListener(); hookAwardXp(); }, 2000);
})();