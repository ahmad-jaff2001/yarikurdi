const YK_CURRENCY_SYMBOL = 'YK';

const YK_PLUS_PLANS = [
  { id: 'plus_1m', months: 1, title: 'دەستپێکردنی VIP', sub: '١ مانگ', price: 5000, badge: '', color: 'from-sky-500 to-blue-700' },
  { id: 'plus_3m', months: 3, title: 'پاکێجی وەرز', sub: '٣ مانگ', price: 13500, badge: '١٠٪ هەرزانتر', color: 'from-amber-400 to-orange-600' },
  { id: 'plus_6m', months: 6, title: 'نیو ساڵی پڵەس', sub: '٦ مانگ', price: 24000, badge: '٢٠٪ هەرزانتر', color: 'from-purple-500 to-indigo-700' }
];

const YK_COIN_PACKS = [
  { id: 'yk_c_1000', coins: 1000, bonus: 150, usd: '$1', iqd: '1,500 دینار', tag: 'سەرەتایی' },
  { id: 'yk_c_5000', coins: 5000, bonus: 800, usd: '$4', iqd: '6,000 دینار', tag: 'باوترین 🔥' },
  { id: 'yk_c_15000', coins: 15000, bonus: 3000, usd: '$10', iqd: '15,000 دینار', tag: 'پڵەس 👑' },
  { id: 'yk_c_50000', coins: 50000, bonus: 12000, usd: '$25', iqd: '37,500 دینار', tag: 'پاشای مەیدان 💎' }
];

const YK_DIAMOND_PACKS = [
  { id: 'yk_d_50', diamonds: 50, bonus: 5, coinCost: 1000, tag: 'گەوهەری شین' },
  { id: 'yk_d_250', diamonds: 250, bonus: 40, coinCost: 4500, tag: 'پڕفرۆشترین 💎' },
  { id: 'yk_d_800', diamonds: 800, bonus: 150, coinCost: 13000, tag: 'شاهانە 👑' },
  { id: 'yk_d_2500', diamonds: 2500, bonus: 600, coinCost: 38000, tag: 'ئەفسانەیی ✨' }
];

const YK_CITY_BACKGROUNDS = [
  { id: 'city_erbil', name: 'قەڵای هەولێر و مەچکۆ', city: 'هەولێر', price: 1500, img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erbil_Citadel_and_Machko_tea_house.jpg?width=800', grad: 'linear-gradient(135deg,#4c1d95,#9a3412)', desc: 'پاشبنەمای قەڵای دێرینی هەولێر بۆ پڕۆفایلەکەت' },
  { id: 'city_sulaymaniyah', name: 'شاری سلێمانی و گۆیژە', city: 'سلێمانی', price: 1500, artKey: 'sulaymaniyah', grad: 'linear-gradient(135deg,#0c4a6e,#1e3a8a)', desc: 'دیمەنی شەوی شاری ڕۆشنبیری سلێمانی' },
  { id: 'city_kalar', name: 'قەڵای شێروانە • کەلار', city: 'کەلار و گەرمیان', price: 1500, img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sherwana_Castle.jpg?width=800', grad: 'linear-gradient(135deg,#7c2d12,#b45309)', desc: 'وێنەی قەڵای مێژوویی شێروانە لە پاشبنەمای پڕۆفایل' },
  { id: 'city_duhok', name: 'دهۆک و ئامێدی', city: 'دهۆک', price: 1500, img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Amadiya_2009.jpg?width=800', grad: 'linear-gradient(135deg,#065f46,#0f766e)', desc: 'دیمەنی شاخ و سروشتی بادینان و ئامێدی' },
  { id: 'city_kirkuk', name: 'قەڵای کەرکووک', city: 'کەرکووک', price: 1500, img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kirkuk_Citadel.jpg?width=800', grad: 'linear-gradient(135deg,#991b1b,#d97706)', desc: 'وێنەی قەڵای مێژوویی شاری کەرکووک' },
  { id: 'city_halabja', name: 'هەڵەبجە و ئەحمەدئاوا', city: 'هەڵەبجە', price: 1400, artKey: 'halabja', grad: 'linear-gradient(135deg,#047857,#0284c7)', desc: 'دیمەنی تاڤگەی ئەحمەدئاوا و هەورامان' },
  { id: 'city_zakho', name: 'پردی دەلالی زاخۆ', city: 'زاخۆ', price: 1400, artKey: 'zakho', grad: 'linear-gradient(135deg,#1e3a8a,#0284c7)', desc: 'پردی مێژوویی دەلال و ڕووباری خابوور' },
  { id: 'city_akre', name: 'شاری ئاکرێ و نەورۆز', city: 'ئاکرێ', price: 1400, artKey: 'akre', grad: 'linear-gradient(135deg,#7c2d12,#dc2626)', desc: 'دیمەنی پایتەختی نەورۆز و چیاکانی ئاکرێ' },
  { id: 'city_ranya', name: 'ڕانیە و دەریاچەی دووکان', city: 'ڕانیە', price: 1300, img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dokan_Lake.jpg?width=800', grad: 'linear-gradient(135deg,#0369a1,#0d9488)', desc: 'دیمەنی دەریاچەی دووکان و دەروازەی ڕاپەڕین' },
  { id: 'city_soran', name: 'سۆران و گەلی عەلی بەگ', city: 'سۆران', price: 1300, img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gali_Ali_Beg_Waterfall.jpg?width=800', grad: 'linear-gradient(135deg,#064e3b,#1e40af)', desc: 'وێنەی تاڤگەی گەلی عەلی بەگ و ڕواندز' },
  { id: 'city_koya', name: 'کۆیە و هەیبەت سوڵتان', city: 'کۆیە', price: 1200, artKey: 'koya', grad: 'linear-gradient(135deg,#581c87,#b45309)', desc: 'دیمەنی شاری کۆیە و چیای هەیبەت سوڵتان' },
  { id: 'city_shaqlawa', name: 'شەقڵاوە و چیای سەفین', city: 'شەقڵاوە', price: 1200, artKey: 'shaqlawa', grad: 'linear-gradient(135deg,#0f766e,#1d4ed8)', desc: 'دیمەنی سەرسوڕهێنەری شەقڵاوە و سەفین' },
  { id: 'city_penjwen', name: 'بەفرستانی پێنجوێن', city: 'پێنجوێن', price: 1200, artKey: 'penjwen', grad: 'linear-gradient(135deg,#1e3a8a,#38bdf8)', desc: 'شاری بەفر و کوێستانەکانی پێنجوێن' },
  { id: 'city_chamchamal', name: 'چەمچەماڵ و گەرمیان', city: 'چەمچەماڵ', price: 1200, artKey: 'chamchamal', grad: 'linear-gradient(135deg,#92400e,#b91c1c)', desc: 'دیمەنی خۆرئاوابوونی چەمچەماڵ' }
];

const YK_BAZAAR_ITEMS = {
  profile: [
    { id: 'frame_kurd', type: 'frame', name: 'چوارچێوەی ئاڵای کوردستان', icon: '☀️', price: 1200, preview: 'linear-gradient(135deg,#dc2626,#facc15,#15803d)', desc: 'چوارچێوەیەکی زێڕینی درەوشاوە بە ڕەنگەکانی ئاڵا' },
    { id: 'frame_sherwana', type: 'frame', name: 'چوارچێوەی قەڵای شێروانە', icon: '🏰', price: 1800, preview: 'linear-gradient(135deg,#f59e0b,#9a3412,#fde047)', desc: 'نەخشی مێژوویی گەرمیان و کەلار' },
    { id: 'frame_diamond', type: 'frame', name: 'تاجی ئەڵماس', icon: '💎', price: 3200, preview: 'linear-gradient(135deg,#38bdf8,#818cf8,#e879f9)', desc: 'درەوشانەوەی پاشایانی یاری کوردی' },
    { id: 'name_gold', type: 'nameStyle', name: 'ناوی زێڕینی شاهانە', icon: '✨', price: 1500, css: 'background:linear-gradient(90deg,#fef08a,#f59e0b,#fde047);-webkit-background-clip:text;-webkit-text-fill-color:transparent;', desc: 'ناوەکەت بە تیشکی زێڕین دەدرەوشێتەوە' },
    { id: 'name_kurd', type: 'nameStyle', name: 'ڕەنگی ئاڵای کوردستان', icon: '🌈', price: 2200, css: 'background:linear-gradient(90deg,#ef4444,#fde047,#22c55e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;', desc: 'تێکەڵەی سوور و زەرد و سەوز بۆ ناوەکەت' },
    { id: 'name_fire', type: 'nameStyle', name: 'ناوی ئاگرین', icon: '🔥', price: 1900, css: 'background:linear-gradient(90deg,#fb7185,#f97316,#facc15);-webkit-background-clip:text;-webkit-text-fill-color:transparent;', desc: 'ڕەنگی گڕی نەورۆز بۆ ناوەکەت' }
  ],
  chat: [
    { id: 'chat_royal_gold', type: 'chatBubble', name: 'بڵقی چاتی دیوەخان', icon: '💬', price: 900, preview: 'linear-gradient(135deg,#b45309,#facc15)', desc: 'نامەکانت بە لێواری زێڕین دەردەکەون' },
    { id: 'chat_kurd_emojis', type: 'emojiPack', name: 'ئیمۆجیی چایخانە و کوردی', icon: '🫖', price: 750, preview: 'linear-gradient(135deg,#dc2626,#15803d)', desc: 'پاکێجی چا، زار، تاج و سڵاوی کوردەواری' },
    { id: 'chat_vip_entry', type: 'entryFx', name: 'هاتنەژوورەوەی شاهانە', icon: '🦅', price: 2500, preview: 'linear-gradient(135deg,#7c3aed,#ec4899)', desc: 'لە کاتی چوونە ژوورەوە هەڵۆی زێڕین دەردەکەوێت' }
  ],
  themes: [
    { id: 'theme_qaysari', type: 'boardTheme', name: 'مێزی بازاڕی قەیسەری', icon: '🏛️', price: 2400, preview: 'linear-gradient(135deg,#78350f,#d97706)', desc: 'ڕووکاری دارگوێزی هەڵکۆڵراو بۆ دۆمینە و شەتڕەنج' },
    { id: 'theme_hawraman', type: 'boardTheme', name: 'سروشتی هەورامان', icon: '🏔️', price: 2100, preview: 'linear-gradient(135deg,#065f46,#0284c7)', desc: 'ڕووکاری شاخ و ئاوی سازگار' },
    { id: 'dice_gold', type: 'diceSkin', name: 'زاری زێڕینی عاج', icon: '🎲', price: 1600, preview: 'linear-gradient(135deg,#fef08a,#b45309)', desc: 'زاری ٣ ڕەهەندیی زێڕین بۆ یاریی لودۆ' }
  ],
  gifts: [
    { id: 'gift_pack_tea', type: 'giftPack', name: 'سینی چای دیوەخان (x5)', icon: '🫖', price: 500, preview: 'linear-gradient(135deg,#b45309,#f59e0b)', desc: '٥ دیاری چایخانە بۆ ناردن لە ژوورەکاندا' },
    { id: 'gift_pack_roses', type: 'giftPack', name: 'چەپکە گوڵی نەورۆز (x10)', icon: '💐', price: 1200, preview: 'linear-gradient(135deg,#e11d48,#f43f5e)', desc: '١٠ گوڵی تایبەت بۆ هاوڕێکانت' },
    { id: 'gift_pack_eagle', type: 'giftPack', name: 'مەدالیای هەڵۆی زێڕین', icon: '🦅', price: 4500, preview: 'linear-gradient(135deg,#f59e0b,#dc2626)', desc: 'دیاریی ئەفسانەیی بۆ پڕۆفایلی هاوڕێکانت' }
  ]
};

let ykBazaarState = {
  coins: 250,
  diamonds: 25,
  plusMonths: 0,
  plusUntil: 0,
  plusBadgeColor: '#38bdf8',
  inventory: {},
  equipped: {},
  activeTab: 'cities',
  syncedUid: null
};

function getCitySvgDataUrl(artKey) {
  const svgs = {
    sulaymaniyah: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#071330"/><stop offset="60%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><circle cx="490" cy="65" r="26" fill="#fef08a"/><path d="M0 210 Q140 110 290 175 Q440 95 600 185 L600 320 L0 320 Z" fill="#0b1d3a"/><path d="M0 225 Q180 155 340 205 Q480 140 600 210 L600 320 L0 320 Z" fill="#132c54"/><circle cx="150" cy="245" r="3" fill="#fde047"/><circle cx="290" cy="240" r="3.5" fill="#fde047"/><circle cx="420" cy="248" r="3" fill="#fde047"/></svg>`,
    halabja: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#064e3b"/><stop offset="60%" stop-color="#0284c7"/><stop offset="100%" stop-color="#062c22"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><polygon points="0,240 160,95 330,240" fill="#065f46"/><polygon points="220,240 430,80 600,240" fill="#047857"/><path d="M275 135 Q300 210 265 320 L345 320 Q320 210 315 135 Z" fill="#e0f2fe"/></svg>`,
    zakho: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#172554"/><stop offset="60%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#0f172a"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><rect x="0" y="230" width="600" height="90" fill="#0284c7"/><path d="M40 230 L40 165 Q300 120 560 165 L560 230 L470 230 A45 45 0 0 0 380 230 L345 230 A45 55 0 0 0 255 230 L220 230 A45 45 0 0 0 130 230 Z" fill="#d97706"/></svg>`,
    akre: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#450a0a"/><stop offset="55%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#1c0a04"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><polygon points="0,320 190,65 420,320" fill="#29120a"/><polygon points="180,320 420,55 600,320" fill="#1f0d07"/><circle cx="300" cy="130" r="6" fill="#fde047"/><circle cx="240" cy="145" r="5" fill="#fde047"/><circle cx="360" cy="142" r="5" fill="#fde047"/></svg>`,
    koya: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3b0764"/><stop offset="60%" stop-color="#9a3412"/><stop offset="100%" stop-color="#1a0905"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><path d="M0 245 Q150 90 310 165 Q460 85 600 190 L600 320 L0 320 Z" fill="#2e1065"/></svg>`,
    shaqlawa: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0c4a6e"/><stop offset="60%" stop-color="#0284c7"/><stop offset="100%" stop-color="#064e3b"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><polygon points="0,260 280,55 600,260" fill="#1e3a8a"/><polygon points="225,95 280,55 342,95" fill="#ffffff"/></svg>`,
    penjwen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e3a8a"/><stop offset="60%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#e0f2fe"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><polygon points="0,270 170,85 360,270" fill="#f8fafc"/><polygon points="230,270 440,75 600,270" fill="#e2e8f0"/></svg>`,
    chamchamal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7c2d12"/><stop offset="55%" stop-color="#d97706"/><stop offset="100%" stop-color="#1c0a04"/></linearGradient></defs><rect width="600" height="320" fill="url(#g)"/><circle cx="300" cy="135" r="52" fill="#fef08a"/><path d="M0 220 Q160 175 320 215 Q470 175 600 215 L600 320 L0 320 Z" fill="#451a03"/></svg>`
  };
  const raw = svgs[artKey] || svgs.sulaymaniyah;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(raw);
}

function getCityBgResolvedUrl(cityObj) {
  if (!cityObj) return '';
  if (cityObj.img) return cityObj.img;
  if (cityObj.artKey) return getCitySvgDataUrl(cityObj.artKey);
  return '';
}

function injectBazaarStyles() {
  if (document.getElementById('ykBazaarStyles')) return;
  const st = document.createElement('style');
  st.id = 'ykBazaarStyles';
  st.textContent = `
    .yk-kurd-flag-scroll-bg {
      background:
        radial-gradient(circle at 50% 48%, rgba(250, 204, 21, 0.22) 0%, transparent 32%),
        linear-gradient(180deg, #4a0710 0%, #7f101d 18%, #4c141c 33%, #252936 44%, #2f3545 50%, #1f2c2b 58%, #0e4025 74%, #072e19 90%, #041a0e 100%);
      background-attachment: local;
    }
    .yk-sun-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(76vw, 340px);
      height: min(76vw, 340px);
      opacity: 0.14;
      pointer-events: none;
      z-index: 1;
      filter: drop-shadow(0 0 35px rgba(250, 204, 21, 0.7));
      animation: ykSlowSunSpin 45s linear infinite;
    }
    @keyframes ykSlowSunSpin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
    @keyframes ykAvatarHaloSpin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .yk-royal-top-hud {
      background: linear-gradient(180deg, rgba(36, 17, 8, 0.96) 0%, rgba(20, 9, 4, 0.94) 100%);
      border-bottom: 3px solid transparent;
      border-image: repeating-linear-gradient(90deg, #dc2626 0 18px, #facc15 18px 36px, #15803d 36px 54px, #ffffff 54px 72px) 1;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.78);
    }
    .yk-avatar-aura {
      position: relative;
      width: 54px;
      height: 54px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .yk-avatar-aura::before {
      content: "";
      position: absolute;
      inset: -3px;
      border-radius: 9999px;
      background: conic-gradient(from 0deg, #fef08a, #f59e0b, #dc2626, #16a34a, #fde047, #fef08a);
      animation: ykAvatarHaloSpin 4.5s linear infinite;
      box-shadow: 0 0 18px rgba(250, 204, 21, 0.75);
    }
    .yk-lvl-shield {
      position: absolute;
      bottom: -3px;
      right: -4px;
      z-index: 12;
      min-width: 24px;
      height: 20px;
      padding: 0 5px;
      border-radius: 7px;
      background: linear-gradient(180deg, #991b1b 0%, #450a0a 100%);
      border: 1.5px solid #fde047;
      color: #ffffff;
      font-size: 10px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.85);
    }
    .yk-currency-pill {
      position: relative;
      height: 32px;
      border-radius: 9999px;
      background: linear-gradient(180deg, rgba(14, 7, 3, 0.92), rgba(28, 14, 6, 0.95));
      border: 1.5px solid rgba(250, 204, 21, 0.45);
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8), 0 4px 12px rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px;
      gap: 6px;
      min-width: 98px;
    }
    .yk-coin-orb {
      width: 28px;
      height: 28px;
      margin-right: -6px;
      border-radius: 9999px;
      background: radial-gradient(circle at 32% 28%, #fef9c3, #facc15 55%, #b45309 100%);
      border: 1.5px solid #fef08a;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 0 12px rgba(250, 204, 21, 0.65);
      flex-shrink: 0;
    }
    .yk-diamond-orb {
      width: 28px;
      height: 28px;
      margin-right: -6px;
      border-radius: 9999px;
      background: radial-gradient(circle at 32% 28%, #e0f2fe, #38bdf8 55%, #1d4ed8 100%);
      border: 1.5px solid #bae6fd;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.65);
      flex-shrink: 0;
    }
    .yk-plus-circle-btn {
      width: 23px;
      height: 23px;
      border-radius: 9999px;
      background: linear-gradient(180deg, #fde047 0%, #eab308 60%, #ca8a04 100%);
      border: 1.5px solid #fef9c3;
      color: #451a03;
      font-size: 15px;
      font-weight: 900;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);
      cursor: pointer;
      flex-shrink: 0;
    }
    .yk-hud-stat-box {
      background: linear-gradient(180deg, rgba(46, 22, 10, 0.85) 0%, rgba(22, 10, 4, 0.92) 100%);
      border: 1.5px solid rgba(250, 204, 21, 0.38);
      border-radius: 16px;
      box-shadow: inset 0 1px 1px rgba(254, 240, 138, 0.25), 0 6px 16px rgba(0, 0, 0, 0.55);
    }
    .yk-coin-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 9999px;
      background: radial-gradient(circle at 30% 30%, #fef08a, #f59e0b 65%, #b45309 100%);
      border: 1.5px solid #fef9c3;
      color: #451a03;
      font-size: 11px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .yk-glass-panel {
      background: rgba(12, 10, 18, 0.76);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1.5px solid rgba(250, 204, 21, 0.28);
    }
    .yk-bazaar-tab-active {
      color: #fde047 !important;
      border-bottom: 3px solid #facc15 !important;
      font-weight: 900 !important;
    }
    .yk-no-scrollbar::-webkit-scrollbar { display: none; }
    .yk-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(st);
}

function getKurdistanSunSVG(className = 'yk-sun-watermark') {
  const rays = [];
  for (let i = 0; i < 21; i++) {
    const a = (i * 360) / 21;
    rays.push(`<polygon points="100,8 106,56 94,56" transform="rotate(${a} 100 100)" />`);
  }
  return `
    <svg viewBox="0 0 200 200" class="${className}" aria-hidden="true">
      <circle cx="100" cy="100" r="42" fill="#facc15" />
      <g fill="#facc15">${rays.join('')}</g>
    </svg>
  `;
}

function getUserCoinsSync() {
  if (typeof db === 'undefined' || typeof playerId === 'undefined' || !playerId) return;
  if (ykBazaarState.syncedUid === playerId) return;
  ykBazaarState.syncedUid = playerId;

  db.ref(`players/${playerId}`).on('value', snap => {
    const d = snap.val() || {};
    if (typeof d.coins === 'number') {
      ykBazaarState.coins = d.coins;
    } else {
      ykBazaarState.coins = 250;
      db.ref(`players/${playerId}/coins`).set(250);
    }
    if (typeof d.diamonds === 'number') {
      ykBazaarState.diamonds = d.diamonds;
    } else {
      ykBazaarState.diamonds = 25;
      db.ref(`players/${playerId}/diamonds`).set(25);
    }
    ykBazaarState.plusUntil = (d.plus && d.plus.until) || 0;
    ykBazaarState.plusMonths = (d.plus && d.plus.months) || 0;
    ykBazaarState.plusBadgeColor = (d.plus && d.plus.badgeColor) || '#38bdf8';
    ykBazaarState.inventory = d.inventory || {};
    ykBazaarState.equipped = d.equipped || {};

    if (typeof myUserCoins !== 'undefined') myUserCoins = ykBazaarState.coins;
    updateAllBazaarCoinBadges();
    applyEquippedCityBgToProfile();
    refreshRoyalTopHudData();
    if (document.getElementById('ykBazaarRoot')) renderBazaarBody();
  });
}

function applyEquippedCityBgToProfile() {
  const eqCityId = ykBazaarState.equipped && ykBazaarState.equipped.profileCityBg;
  const cityObj = YK_CITY_BACKGROUNDS.find(c => c.id === eqCityId);
  const bgUrl = cityObj ? getCityBgResolvedUrl(cityObj) : '';

  const profileCard = document.querySelector('#editProfileModal .royal-card');
  if (profileCard) {
    if (bgUrl) {
      profileCard.style.backgroundImage = `linear-gradient(180deg, rgba(15, 8, 4, 0.45) 0%, rgba(12, 6, 3, 0.88) 65%, rgba(10, 5, 2, 0.96) 100%), url('${bgUrl}')`;
      profileCard.style.backgroundSize = 'cover';
      profileCard.style.backgroundPosition = 'center';
    } else {
      profileCard.style.backgroundImage = '';
    }
  }

  const topHud = document.querySelector('header.yk-royal-top-hud');
  if (topHud) {
    if (bgUrl) {
      topHud.style.backgroundImage = `linear-gradient(180deg, rgba(20, 9, 4, 0.72) 0%, rgba(14, 6, 3, 0.88) 100%), url('${bgUrl}')`;
      topHud.style.backgroundSize = 'cover';
      topHud.style.backgroundPosition = 'center';
    } else {
      topHud.style.backgroundImage = '';
    }
  }
}

function updateAllBazaarCoinBadges() {
  document.querySelectorAll('.yk-user-coin-balance, .yk-bazaar-coin-val').forEach(el => {
    el.textContent = (ykBazaarState.coins || 0).toLocaleString();
  });
  document.querySelectorAll('.yk-bazaar-diamond-val').forEach(el => {
    el.textContent = (ykBazaarState.diamonds || 0).toLocaleString();
  });
}

function isUserPlusActive() {
  return ykBazaarState.plusUntil > Date.now();
}

function refreshRoyalTopHudData() {
  const avInner = document.getElementById('ykHudAvatarInner');
  const lvlTag = document.getElementById('ykHudLevelNum');
  const leagueVal = document.getElementById('ykHudLeagueVal');
  const rankVal = document.getElementById('ykHudRankVal');

  const pName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'ی';
  const pAv = (typeof playerAvatarData !== 'undefined') ? playerAvatarData : '';

  if (avInner) {
    if (pAv && (pAv.startsWith('data:image') || pAv.startsWith('http'))) {
      avInner.innerHTML = `<img src="${pAv}" class="w-full h-full object-cover" />`;
    } else {
      avInner.textContent = pName.charAt(0);
    }
  }

  if (lvlTag && typeof getLevelInfo === 'function' && typeof playerProfile !== 'undefined') {
    const info = getLevelInfo(playerProfile.xp || 0);
    lvlTag.textContent = info.level;
  }

  if (leagueVal && typeof playerProfile !== 'undefined' && playerProfile.elo) {
    const chessElo = playerProfile.elo.chess || 1200;
    leagueVal.textContent = `${chessElo} ★`;
  }

  if (rankVal && typeof allPlayersCache !== 'undefined' && typeof playerId !== 'undefined' && playerId) {
    const list = Object.entries(allPlayersCache).map(([id, d]) => ({
      id,
      score: ((d.elo && d.elo.chess) || 1200) + ((d.elo && d.elo.domino) || 1200)
    }));
    list.sort((a, b) => b.score - a.score);
    const idx = list.findIndex(item => item.id === playerId);
    rankVal.textContent = idx !== -1 ? `No.${idx + 1}` : 'No.1';
  }
}

function addUserCoins(amount) {
  if (typeof db === 'undefined' || !playerId) return;
  const next = Math.max(0, (ykBazaarState.coins || 0) + amount);
  ykBazaarState.coins = next;
  db.ref(`players/${playerId}/coins`).set(next);
  updateAllBazaarCoinBadges();
}

function addUserDiamonds(amount) {
  if (typeof db === 'undefined' || !playerId) return;
  const next = Math.max(0, (ykBazaarState.diamonds || 0) + amount);
  ykBazaarState.diamonds = next;
  db.ref(`players/${playerId}/diamonds`).set(next);
  updateAllBazaarCoinBadges();
}

function spendUserCoins(cost) {
  if ((ykBazaarState.coins || 0) < cost) {
    if (confirm(`باڵانسەکەت بەش ناکات! پێویستت بە ${cost.toLocaleString()} ${YK_CURRENCY_SYMBOL} هەیە.\nدەتەوێت ئێستا کۆین بکڕیت؟`)) {
      ykBazaarState.activeTab = 'coins';
      if (!document.getElementById('ykBazaarRoot')) openBazaarModal('coins');
      else renderBazaarBody();
    }
    return false;
  }
  addUserCoins(-cost);
  return true;
}

function openBazaarModal(tab = 'cities') {
  injectBazaarStyles();
  getUserCoinsSync();
  ykBazaarState.activeTab = tab;

  const existing = document.getElementById('ykBazaarRoot');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'ykBazaarRoot';
  root.setAttribute('dir', 'rtl');
  root.style.cssText = 'position:fixed; inset:0; width:100vw; height:100dvh; z-index:9985; overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch;';
  root.className = 'yk-kurd-flag-scroll-bg text-white';

  root.innerHTML = `
    ${getKurdistanSunSVG()}

    <div class="sticky top-0 z-30 bg-[#18070a]/92 backdrop-blur-lg border-b border-amber-400/35">
      <div class="max-w-lg mx-auto px-3 pt-3 pb-2 space-y-2.5" style="padding-top: max(12px, env(safe-area-inset-top));">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5">
            <button onclick="openBazaarTab('coins')" class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 border border-amber-400/55 shadow">
              <span class="yk-coin-icon" style="width:17px;height:17px;font-size:9px;">☀️</span>
              <span class="yk-bazaar-coin-val text-xs font-black text-amber-300">${(ykBazaarState.coins || 0).toLocaleString()}</span>
              <span class="text-[10px] font-black text-emerald-400">+</span>
            </button>
            <button onclick="openBazaarTab('diamonds')" class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 border border-sky-400/55 shadow">
              <span class="text-xs">💎</span>
              <span class="yk-bazaar-diamond-val text-xs font-black text-sky-300">${(ykBazaarState.diamonds || 0).toLocaleString()}</span>
              <span class="text-[10px] font-black text-emerald-400">+</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-black gold-text">بازاڕی یاری کوردی</span>
            <button onclick="closeBazaarModal()" class="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white font-black flex items-center justify-center text-sm">✕</button>
          </div>
        </div>

        <div class="yk-no-scrollbar flex items-center justify-between text-xs font-bold text-slate-300 border-t border-white/10 pt-2 overflow-x-auto gap-1.5">
          <button id="ykBTab-cities" onclick="openBazaarTab('cities')" class="px-2 pb-1.5 whitespace-nowrap transition">🏙️ شارەکان</button>
          <button id="ykBTab-plus" onclick="openBazaarTab('plus')" class="px-2 pb-1.5 whitespace-nowrap transition">پڵەس</button>
          <button id="ykBTab-coins" onclick="openBazaarTab('coins')" class="px-2 pb-1.5 whitespace-nowrap transition">کۆین</button>
          <button id="ykBTab-diamonds" onclick="openBazaarTab('diamonds')" class="px-2 pb-1.5 whitespace-nowrap transition">ئەڵماس</button>
          <button id="ykBTab-profile" onclick="openBazaarTab('profile')" class="px-2 pb-1.5 whitespace-nowrap transition">پرۆفایل</button>
          <button id="ykBTab-chat" onclick="openBazaarTab('chat')" class="px-2 pb-1.5 whitespace-nowrap transition">چات</button>
          <button id="ykBTab-themes" onclick="openBazaarTab('themes')" class="px-2 pb-1.5 whitespace-nowrap transition">ڕووکار</button>
          <button id="ykBTab-gifts" onclick="openBazaarTab('gifts')" class="px-2 pb-1.5 whitespace-nowrap transition">دیاری</button>
        </div>
      </div>
    </div>

    <div id="ykBazaarContent" class="relative z-10 max-w-lg mx-auto px-3 py-4 pb-24 space-y-4"></div>
  `;

  document.body.style.overflow = 'hidden';
  document.body.appendChild(root);
  renderBazaarBody();
}

function closeBazaarModal() {
  const root = document.getElementById('ykBazaarRoot');
  if (root) root.remove();
  document.body.style.overflow = '';
}

function openBazaarTab(tab) {
  ykBazaarState.activeTab = tab;
  renderBazaarBody();
}

function renderBazaarBody() {
  const tabs = ['cities', 'plus', 'coins', 'diamonds', 'profile', 'chat', 'themes', 'gifts'];
  tabs.forEach(t => {
    const el = document.getElementById('ykBTab-' + t);
    if (!el) return;
    el.classList.toggle('yk-bazaar-tab-active', t === ykBazaarState.activeTab);
  });

  const box = document.getElementById('ykBazaarContent');
  if (!box) return;

  if (ykBazaarState.activeTab === 'cities') {
    const eqCityId = ykBazaarState.equipped && ykBazaarState.equipped.profileCityBg;
    const activeCity = YK_CITY_BACKGROUNDS.find(c => c.id === eqCityId) || YK_CITY_BACKGROUNDS[0];
    const heroBgUrl = getCityBgResolvedUrl(activeCity);

    box.innerHTML = `
      <div class="rounded-3xl overflow-hidden border-2 border-amber-400/75 shadow-2xl relative"
           style="background-image: linear-gradient(180deg, rgba(12,6,3,0.3) 0%, rgba(12,6,3,0.92) 100%), url('${heroBgUrl}'); background-size: cover; background-position: center;">
        <div class="p-5 pt-16 space-y-1 text-right">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-[#1a0d06] text-[10px] font-black">🏙️ پاشبنەمای پڕۆفایل</span>
          <h3 class="text-lg font-black text-white drop-shadow">پاشبنەمای شارەکانی کوردستان</h3>
          <p class="text-xs text-amber-100/90">وێنەی شارەکەت بکڕە و بیکە بە پاشبنەمای سەرەکیی پڕۆفایلەکەت</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        ${YK_CITY_BACKGROUNDS.map(c => {
          const owned = !!(ykBazaarState.inventory && ykBazaarState.inventory[c.id]);
          const equipped = eqCityId === c.id;
          const url = getCityBgResolvedUrl(c);
          return `
            <div class="yk-glass-panel rounded-3xl overflow-hidden flex flex-col justify-between border ${equipped ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.45)]' : 'border-amber-400/40'}">
              <div class="relative h-28 w-full overflow-hidden" style="background:${c.grad};">
                <img src="${url}" alt="${c.name}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25"></div>
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-amber-400/40 text-amber-200 text-[10px] font-black">${c.city}</span>
                ${equipped ? '<span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[#050b18] text-[9px] font-black">چالاکە ✓</span>' : ''}
              </div>
              <div class="p-3 space-y-2 text-right">
                <div>
                  <div class="text-xs font-black text-white truncate">${c.name}</div>
                  <div class="text-[10px] text-slate-300 line-clamp-1">${c.desc}</div>
                </div>
                ${owned
                  ? `<button onclick="equipBazaarCityBg('${c.id}')" class="w-full py-2 rounded-xl text-xs font-black ${equipped ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300' : 'bg-white/15 hover:bg-white/25 text-white'}">${equipped ? 'لەسەر پڕۆفایلە ✓' : 'دانان لە پڕۆفایل'}</button>`
                  : `<button onclick="buyBazaarCityBg('${c.id}')" class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 text-[#1a0d06] text-xs font-black flex items-center justify-center gap-1 shadow"><span>☀️</span><span>${c.price.toLocaleString()}</span></button>`
                }
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    return;
  }

  if (ykBazaarState.activeTab === 'plus') {
    const pName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزانی کورد';
    const avHtml = (typeof playerAvatarData !== 'undefined' && playerAvatarData)
      ? `<img src="${playerAvatarData}" class="w-full h-full object-cover" />`
      : pName.charAt(0);
    const activeBadgeColor = ykBazaarState.plusBadgeColor || '#38bdf8';

    const badgeMilestones = [
      { m: 1, col: '#38bdf8', label: '١' },
      { m: 3, col: '#22c55e', label: '٣' },
      { m: 5, col: '#a855f7', label: '٥' },
      { m: 8, col: '#f59e0b', label: '٨' },
      { m: 12, col: '#ef4444', label: '+١٢' }
    ];

    box.innerHTML = `
      <div class="relative overflow-hidden rounded-3xl p-5 text-center border-2 border-amber-400/60 shadow-2xl"
           style="background: linear-gradient(135deg, rgba(185,28,28,0.65) 0%, rgba(15,23,42,0.85) 50%, rgba(21,128,61,0.65) 100%);">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 border-2 border-yellow-300 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(56,189,248,0.8)] mb-2">✓</div>
        <h2 class="text-2xl font-black gold-text">یاری کوردی پڵەس</h2>
        <p class="text-xs text-amber-100/90 mt-0.5">نیشانە، ڕەنگ، پارێزگاری و سوودی زیاتر لە هەموو یارییەکاندا</p>
      </div>

      <div class="yk-glass-panel rounded-3xl p-4 space-y-3">
        <div class="flex items-center justify-center gap-1.5 text-xs font-black text-sky-300">
          <span>✓</span><span>دوای بەشداریکردن وا دەردەکەویت</span>
        </div>
        <div class="grid grid-cols-11 items-center gap-2">
          <div class="col-span-5 rounded-2xl p-2.5 bg-white/5 border border-white/15 space-y-2 text-center">
            <div class="flex items-center justify-center gap-1.5">
              <div class="w-7 h-7 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-xs font-black">${avHtml}</div>
              <span class="text-[11px] font-bold text-slate-300 truncate">${pName}</span>
            </div>
            <div class="grid grid-cols-2 gap-1 text-[9px]">
              <span class="py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold">هاوڕێ</span>
              <span class="py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold">نامە</span>
            </div>
          </div>

          <div class="col-span-1 text-center text-amber-300 font-black text-base">⬅</div>

          <div class="col-span-5 rounded-2xl p-2.5 bg-gradient-to-br from-amber-500/25 via-rose-500/20 to-emerald-500/25 border-2 border-amber-400/75 space-y-2 text-center shadow-lg">
            <div class="flex items-center justify-center gap-1">
              <div class="w-7 h-7 rounded-full bg-amber-400 overflow-hidden border-2 border-yellow-300 flex items-center justify-center text-xs font-black">${avHtml}</div>
              <span class="text-[11px] font-black text-yellow-200 truncate">${pName}</span>
              <span style="display:inline-flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:999px;background:${activeBadgeColor};color:#fff;font-size:9px;font-weight:900;">✓</span>
            </div>
            <div class="grid grid-cols-2 gap-1 text-[9px]">
              <span class="py-1 rounded-lg bg-sky-500 text-white font-black">هاوڕێ</span>
              <span class="py-1 rounded-lg bg-rose-500 text-white font-black">نامە</span>
            </div>
          </div>
        </div>
      </div>

      <div class="yk-glass-panel rounded-3xl p-4 space-y-3 text-center">
        <div class="text-sm font-black text-white">ڕەنگی نیشانەکەت</div>
        <div class="flex items-center justify-between px-2">
          ${badgeMilestones.map(b => `
            <button onclick="selectPlusBadgeColor('${b.col}')" class="flex flex-col items-center gap-1.5 group">
              <div style="background:${b.col}; box-shadow:0 0 12px ${b.col};" class="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm border-2 ${activeBadgeColor === b.col ? 'border-yellow-200 scale-110' : 'border-white/30 opacity-80'} transition">✓</div>
              <span class="text-[11px] font-black text-amber-100">${b.label}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2.5">
        ${YK_PLUS_PLANS.map(p => `
          <div onclick="buyYariKurdiPlus('${p.id}')" class="cursor-pointer yk-glass-panel rounded-2xl p-3 flex flex-col justify-between items-center text-center gap-2 border-amber-400/50 hover:border-yellow-300 transition active:scale-95">
            <span class="text-xs font-black text-amber-200">${p.sub}</span>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${p.color} border-2 border-yellow-200 flex items-center justify-center text-white text-2xl font-black shadow-lg">✓</div>
            <div>
              <div class="text-[11px] font-black text-white leading-tight">${p.title}</div>
              ${p.badge ? `<div class="text-[9px] font-black text-emerald-300 mt-0.5">${p.badge}</div>` : ''}
            </div>
            <div class="w-full py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[11px] font-black flex items-center justify-center gap-1 shadow">
              <span class="yk-coin-icon" style="width:15px;height:15px;font-size:8px;">☀️</span>
              <span>${p.price.toLocaleString()}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  if (ykBazaarState.activeTab === 'coins') {
    box.innerHTML = `
      <div class="yk-glass-panel rounded-3xl p-5 text-center space-y-2 border-amber-400/60">
        <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-700 border-2 border-yellow-100 flex items-center justify-center text-3xl shadow-[0_0_28px_rgba(250,204,21,0.85)]">☀️</div>
        <h3 class="text-xl font-black gold-text">دراوی خۆری زێڕین (${YK_CURRENCY_SYMBOL})</h3>
        <p class="text-xs text-amber-100/90">باڵانسی ئێستات: <strong class="text-yellow-300 text-sm">${(ykBazaarState.coins || 0).toLocaleString()} ${YK_CURRENCY_SYMBOL}</strong></p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        ${YK_COIN_PACKS.map(pk => `
          <div onclick="buyBazaarCoinPack('${pk.id}')" class="cursor-pointer yk-glass-panel rounded-3xl p-4 flex flex-col justify-between items-center text-center gap-2.5 border-amber-400/50 hover:border-yellow-300 transition active:scale-95">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[10px] font-black text-amber-200">${pk.tag}</span>
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-amber-600 border-2 border-yellow-100 flex items-center justify-center text-2xl shadow-lg">☀️</div>
            <div>
              <div class="text-base font-black text-white">${pk.coins.toLocaleString()} ${YK_CURRENCY_SYMBOL}</div>
              <div class="text-[10px] font-black text-emerald-400">+${pk.bonus.toLocaleString()} دیاری بەخۆڕایی</div>
            </div>
            <div class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#1a0d06] text-xs font-black shadow">
              ${pk.usd} • ${pk.iqd}
            </div>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  if (ykBazaarState.activeTab === 'diamonds') {
    box.innerHTML = `
      <div class="yk-glass-panel rounded-3xl p-5 text-center space-y-2 border-sky-400/60">
        <div class="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-sky-200 via-sky-400 to-blue-700 border-2 border-sky-100 flex items-center justify-center text-3xl shadow-[0_0_28px_rgba(56,189,248,0.85)]">💎</div>
        <h3 class="text-xl font-black text-sky-300">گەوهەر و ئەڵماسی یاری کوردی</h3>
        <p class="text-xs text-sky-100/90">باڵانسی ئەڵماسەکانت: <strong class="text-sky-300 text-sm">${(ykBazaarState.diamonds || 0).toLocaleString()} 💎</strong></p>
      </div>

      <div class="grid grid-cols-2 gap-3">
        ${YK_DIAMOND_PACKS.map(dp => `
          <div onclick="buyDiamondPackWithCoins('${dp.id}')" class="cursor-pointer yk-glass-panel rounded-3xl p-4 flex flex-col justify-between items-center text-center gap-2.5 border-sky-400/50 hover:border-sky-300 transition active:scale-95">
            <span class="px-2.5 py-0.5 rounded-full bg-sky-400/20 border border-sky-400/40 text-[10px] font-black text-sky-200">${dp.tag}</span>
            <div class="text-3xl drop-shadow">💎</div>
            <div>
              <div class="text-base font-black text-white">${dp.diamonds.toLocaleString()} ئەڵماس</div>
              <div class="text-[10px] font-black text-emerald-400">+${dp.bonus} ئەڵماسی دیاری</div>
            </div>
            <div class="w-full py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 text-white text-xs font-black flex items-center justify-center gap-1 shadow">
              <span>☀️</span><span>${dp.coinCost.toLocaleString()} ${YK_CURRENCY_SYMBOL}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    return;
  }

  const itemsList = YK_BAZAAR_ITEMS[ykBazaarState.activeTab] || [];
  box.innerHTML = `
    <div class="grid grid-cols-2 gap-3">
      ${itemsList.map(item => {
        const owned = !!(ykBazaarState.inventory && ykBazaarState.inventory[item.id]);
        const equipped = !!(ykBazaarState.equipped && ykBazaarState.equipped[item.type] === item.id);
        return `
          <div class="yk-glass-panel rounded-3xl p-3.5 flex flex-col justify-between gap-2.5 border-amber-400/40">
            <div class="h-24 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/15"
                 style="background: ${item.preview || 'linear-gradient(135deg,#1e1b4b,#3b0764)'};">
              ${item.css
                ? `<span style="${item.css} font-size:18px; font-weight:900;">ناوەکەت</span>`
                : `<span class="text-4xl drop-shadow-lg">${item.icon}</span>`
              }
              ${equipped ? '<span class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full bg-emerald-500 text-[#050b18] text-[9px] font-black">چالاکە ✓</span>' : ''}
            </div>
            <div class="text-right space-y-0.5">
              <div class="text-xs font-black text-white">${item.name}</div>
              <div class="text-[10px] text-slate-300 leading-snug">${item.desc}</div>
            </div>
            ${owned
              ? `<button onclick="equipBazaarItem('${item.id}','${item.type}')" class="w-full py-2 rounded-xl text-xs font-black ${equipped ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300' : 'bg-white/15 hover:bg-white/25 text-white'}">${equipped ? 'بەکاردەهێنرێت ✓' : 'بەکارهێنان'}</button>`
              : `<button onclick="buyBazaarItem('${item.id}','${ykBazaarState.activeTab}')" class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 text-[#1a0d06] text-xs font-black flex items-center justify-center gap-1 shadow"><span>☀️</span><span>${item.price.toLocaleString()}</span></button>`
            }
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function buyBazaarCityBg(cityId) {
  const city = YK_CITY_BACKGROUNDS.find(c => c.id === cityId);
  if (!city) return;
  if (!confirm(`کڕینی پاشبنەمای «${city.name}» بە ${city.price.toLocaleString()} ${YK_CURRENCY_SYMBOL}؟`)) return;
  if (!spendUserCoins(city.price)) return;

  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/inventory/${city.id}`).set(true);
    db.ref(`players/${playerId}/equipped/profileCityBg`).set(city.id);
  }
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🏙️ پیرۆزە! پاشبنەمای «${city.name}» کڕدرا و لەسەر پڕۆفایلەکەت دانرا!`);
}

function equipBazaarCityBg(cityId) {
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/equipped/profileCityBg`).set(cityId);
  }
  if (typeof playChessSound === 'function') playChessSound('move');
}

function buyDiamondPackWithCoins(packId) {
  const dp = YK_DIAMOND_PACKS.find(d => d.id === packId);
  if (!dp) return;
  const totalDiamonds = dp.diamonds + dp.bonus;
  if (!confirm(`گۆڕینەوەی ${dp.coinCost.toLocaleString()} ${YK_CURRENCY_SYMBOL} بە ${totalDiamonds} ئەڵماس 💎؟`)) return;
  if (!spendUserCoins(dp.coinCost)) return;
  addUserDiamonds(totalDiamonds);
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`💎 پیرۆزە! ${totalDiamonds} ئەڵماس زیاد کرا بۆ باڵانسەکەت!`);
  renderBazaarBody();
}

function selectPlusBadgeColor(col) {
  if (!isUserPlusActive()) {
    alert('سەرەتا بەشداری لە یاری کوردی پڵەس بکە تا بتوانیت ڕەنگی نیشانەکەت بگۆڕیت!');
    return;
  }
  ykBazaarState.plusBadgeColor = col;
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/plus/badgeColor`).set(col);
  }
  renderBazaarBody();
}

function buyYariKurdiPlus(planId) {
  const plan = YK_PLUS_PLANS.find(p => p.id === planId);
  if (!plan) return;
  if (!confirm(`بەشداریکردن لە ${plan.title} بە ${plan.price.toLocaleString()} ${YK_CURRENCY_SYMBOL}؟`)) return;
  if (!spendUserCoins(plan.price)) return;

  const baseTime = Math.max(Date.now(), ykBazaarState.plusUntil || 0);
  const newUntil = baseTime + plan.months * 30 * 24 * 60 * 60 * 1000;
  const newMonths = (ykBazaarState.plusMonths || 0) + plan.months;

  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/plus`).set({
      until: newUntil,
      months: newMonths,
      badgeColor: ykBazaarState.plusBadgeColor || '#38bdf8'
    });
  }
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🎉 پیرۆزە! یاری کوردی پڵەس بۆ ماوەی ${plan.months} مانگ چالاک کرا!`);
}

function buyBazaarCoinPack(packId) {
  const pk = YK_COIN_PACKS.find(p => p.id === packId);
  if (!pk) return;
  const total = pk.coins + pk.bonus;
  if (confirm(`کڕینی ${pk.coins.toLocaleString()} ${YK_CURRENCY_SYMBOL} (+${pk.bonus.toLocaleString()} دیاری) بە ${pk.usd} (${pk.iqd})؟`)) {
    addUserCoins(total);
    if (typeof playChessSound === 'function') playChessSound('end');
    alert(`🎉 پیرۆزە! ${total.toLocaleString()} ${YK_CURRENCY_SYMBOL} زیاد کرا بۆ هەژمارەکەت.`);
    renderBazaarBody();
  }
}

function buyBazaarItem(itemId, tabKey) {
  const item = (YK_BAZAAR_ITEMS[tabKey] || []).find(i => i.id === itemId);
  if (!item) return;
  if (!confirm(`کڕینی «${item.name}» بە ${item.price.toLocaleString()} ${YK_CURRENCY_SYMBOL}؟`)) return;
  if (!spendUserCoins(item.price)) return;

  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/inventory/${item.id}`).set(true);
    db.ref(`players/${playerId}/equipped/${item.type}`).set(item.id);
  }
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🎉 پیرۆزە! «${item.name}» کڕدرا و چالاک کرا!`);
}

function equipBazaarItem(itemId, itemType) {
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/equipped/${itemType}`).set(itemId);
  }
  if (typeof playChessSound === 'function') playChessSound('move');
}

function mountBazaarControlsInUI() {
  injectBazaarStyles();

  const header = document.querySelector('header');
  if (header && !document.getElementById('ykRoyalTopHudInner')) {
    header.className = 'yk-royal-top-hud sticky top-0 z-40';
    header.innerHTML = `
      <div id="ykRoyalTopHudInner" class="max-w-3xl mx-auto px-3 pt-2.5 pb-2.5 space-y-2.5" style="padding-top: max(10px, env(safe-area-inset-top));">
        <div class="flex items-center justify-between gap-2">
          <div onclick="openEditProfileModal()" title="دەستکاریکردنی پڕۆفایل" class="cursor-pointer flex items-center gap-2 shrink-0">
            <div class="yk-avatar-aura">
              <div id="ykHudAvatarInner" class="relative z-10 w-[48px] h-[48px] rounded-full bg-[#1a0d06] text-yellow-300 font-black text-lg flex items-center justify-center overflow-hidden border-2 border-[#1a0d06]">ی</div>
              <div id="ykHudLevelNum" class="yk-lvl-shield">1</div>
            </div>
          </div>

          <div class="flex items-center gap-2 flex-1 justify-center max-w-[260px]">
            <div onclick="openBazaarModal('coins')" class="cursor-pointer yk-currency-pill flex-1">
              <div class="yk-coin-orb">☀️</div>
              <span class="yk-bazaar-coin-val text-xs sm:text-sm font-black text-white tracking-wide">${(ykBazaarState.coins || 0).toLocaleString()}</span>
              <button type="button" class="yk-plus-circle-btn">+</button>
            </div>

            <div onclick="openBazaarModal('diamonds')" class="cursor-pointer yk-currency-pill flex-1">
              <div class="yk-diamond-orb">💎</div>
              <span class="yk-bazaar-diamond-val text-xs sm:text-sm font-black text-white tracking-wide">${(ykBazaarState.diamonds || 0).toLocaleString()}</span>
              <button type="button" class="yk-plus-circle-btn">+</button>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button onclick="openBazaarModal('cities')" title="بازاڕی یاری کوردی"
              class="w-10 h-10 rounded-2xl bg-gradient-to-b from-amber-300/20 to-amber-600/10 border border-amber-400/45 flex items-center justify-center text-xl shadow-lg hover:scale-105 transition">
              🛒
            </button>
            <button id="soundBtn" onclick="toggleSound()" title="دەنگ و ڕێکخستن"
              class="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-lg text-slate-200 hover:bg-white/15 transition">
              ⚙️
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          <div onclick="typeof openSeasonPassModal === 'function' ? openSeasonPassModal() : switchView('hub')"
            class="cursor-pointer yk-hud-stat-box px-3 py-1.5 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-lg shadow">🏆</div>
              <span class="text-[10px] font-black text-amber-300">خول • وەرز</span>
            </div>
            <span id="ykHudLeagueVal" class="text-xs sm:text-sm font-black text-white">1200 ★</span>
          </div>

          <div onclick="switchView('leaderboard')"
            class="cursor-pointer yk-hud-stat-box px-3 py-1.5 flex items-center justify-between">
            <span id="ykHudRankVal" class="text-xs sm:text-sm font-black text-white">No.1</span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black text-emerald-300">ڕیزبەندی</span>
              <div class="w-8 h-8 rounded-xl bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center text-lg shadow">🌍</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const dock = document.querySelector('.floating-bottom-dock');
  if (dock && !document.getElementById('dock-bazaar')) {
    const dBtn = document.createElement('button');
    dBtn.id = 'dock-bazaar';
    dBtn.onclick = () => openBazaarModal('cities');
    dBtn.className = 'dock-item';
    dBtn.title = 'بازاڕی یاری کوردی';
    dBtn.textContent = '🛒';
    const profileDock = document.getElementById('dock-profile');
    if (profileDock) dock.insertBefore(dBtn, profileDock);
    else dock.appendChild(dBtn);
  }

  applyEquippedCityBgToProfile();
  refreshRoyalTopHudData();
}

window.openBazaarModal = openBazaarModal;
window.closeBazaarModal = closeBazaarModal;
window.openBazaarTab = openBazaarTab;
window.buyBazaarCityBg = buyBazaarCityBg;
window.equipBazaarCityBg = equipBazaarCityBg;
window.buyYariKurdiPlus = buyYariKurdiPlus;
window.buyBazaarCoinPack = buyBazaarCoinPack;
window.buyDiamondPackWithCoins = buyDiamondPackWithCoins;
window.buyBazaarItem = buyBazaarItem;
window.equipBazaarItem = equipBazaarItem;
window.selectPlusBadgeColor = selectPlusBadgeColor;

(function initBazaarBootstrap() {
  const boot = () => {
    mountBazaarControlsInUI();
    getUserCoinsSync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(() => {
    getUserCoinsSync();
    applyEquippedCityBgToProfile();
    refreshRoyalTopHudData();
  }, 2000);
})();