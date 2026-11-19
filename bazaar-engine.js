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

const YK_BAZAAR_ITEMS = {
  profile: [
    { id: 'frame_kurd', type: 'frame', name: 'چوارچێوەی ئاڵای کوردستان', icon: '☀️', price: 1200, preview: 'linear-gradient(135deg,#dc2626,#facc15,#15803d)', desc: 'چوارچێوەیەکی زێڕینی درەوشاوە بە ڕەنگەکانی ئاڵا' },
    { id: 'frame_sherwana', type: 'frame', name: 'قەڵای شێروانە', icon: '🏰', price: 1800, preview: 'linear-gradient(135deg,#f59e0b,#9a3412,#fde047)', desc: 'نەخشی مێژوویی گەرمیان و کەلار' },
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
  plusMonths: 0,
  plusUntil: 0,
  plusBadgeColor: '#38bdf8',
  inventory: {},
  equipped: {},
  activeTab: 'plus',
  syncedUid: null
};

function injectBazaarStyles() {
  if (document.getElementById('ykBazaarStyles')) return;
  const st = document.createElement('style');
  st.id = 'ykBazaarStyles';
  st.textContent = `
    .yk-kurd-flag-scroll-bg {
      background:
        radial-gradient(circle at 50% 48%, rgba(250, 204, 21, 0.22) 0%, transparent 32%),
        linear-gradient(
          180deg,
          #4a0710 0%,
          #7f101d 18%,
          #4c141c 33%,
          #252936 44%,
          #2f3545 50%,
          #1f2c2b 58%,
          #0e4025 74%,
          #072e19 90%,
          #041a0e 100%
        );
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
      box-shadow: 0 0 10px rgba(250, 204, 21, 0.6);
      flex-shrink: 0;
    }
    .yk-glass-panel {
      background: rgba(12, 10, 18, 0.72);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1.5px solid rgba(250, 204, 21, 0.28);
    }
    .yk-bazaar-tab-active {
      color: #fde047 !important;
      border-bottom: 3px solid #facc15 !important;
      font-weight: 900 !important;
    }
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
    ykBazaarState.plusUntil = (d.plus && d.plus.until) || 0;
    ykBazaarState.plusMonths = (d.plus && d.plus.months) || 0;
    ykBazaarState.plusBadgeColor = (d.plus && d.plus.badgeColor) || '#38bdf8';
    ykBazaarState.inventory = d.inventory || {};
    ykBazaarState.equipped = d.equipped || {};

    if (typeof myUserCoins !== 'undefined') myUserCoins = ykBazaarState.coins;
    updateAllBazaarCoinBadges();
    applyEquippedCosmeticsToHeader();
    if (document.getElementById('ykBazaarRoot')) renderBazaarBody();
  });
}

function updateAllBazaarCoinBadges() {
  document.querySelectorAll('.yk-user-coin-balance, .yk-bazaar-coin-val').forEach(el => {
    el.textContent = (ykBazaarState.coins || 0).toLocaleString();
  });
}

function isUserPlusActive() {
  return ykBazaarState.plusUntil > Date.now();
}

function applyEquippedCosmeticsToHeader() {
  const hName = document.getElementById('headerPlayerName');
  const hAvatar = document.getElementById('headerAvatar');
  if (hName && typeof playerName !== 'undefined' && playerName) {
    const plusBadge = isUserPlusActive()
      ? `<span title="YariKurdi Plus" style="display:inline-flex;align-items:center;justify-content:center;width:15px;height:15px;border-radius:999px;background:${ykBazaarState.plusBadgeColor};color:#fff;font-size:9px;font-weight:900;margin-right:4px;box-shadow:0 0 8px ${ykBazaarState.plusBadgeColor};">✓</span>`
      : '';
    const eqNameId = ykBazaarState.equipped && ykBazaarState.equipped.nameStyle;
    const styleItem = YK_BAZAAR_ITEMS.profile.find(it => it.id === eqNameId);
    const nameSpan = styleItem
      ? `<span style="${styleItem.css} font-weight:900;">${playerName}</span>`
      : `<span>${playerName}</span>`;
    const ownerBadge = typeof getVerifiedBadgeHTML === 'function' && typeof auth !== 'undefined'
      ? getVerifiedBadgeHTML(auth.currentUser && auth.currentUser.email)
      : '';
    hName.innerHTML = nameSpan + plusBadge + ownerBadge;
  }

  if (hAvatar) {
    const eqFrameId = ykBazaarState.equipped && ykBazaarState.equipped.frame;
    const frameItem = YK_BAZAAR_ITEMS.profile.find(it => it.id === eqFrameId);
    if (frameItem) {
      hAvatar.style.border = '2.5px solid #fde047';
      hAvatar.style.boxShadow = '0 0 14px rgba(250, 204, 21, 0.75)';
    }
  }
}

function addUserCoins(amount) {
  if (typeof db === 'undefined' || !playerId) return;
  const next = Math.max(0, (ykBazaarState.coins || 0) + amount);
  ykBazaarState.coins = next;
  db.ref(`players/${playerId}/coins`).set(next);
  updateAllBazaarCoinBadges();
}

function spendUserCoins(cost) {
  if ((ykBazaarState.coins || 0) < cost) {
    if (confirm(`باڵانسەکەت بەش ناکات! پێویستت بە ${cost.toLocaleString()} ${YK_CURRENCY_SYMBOL} هەیە.\nدەتەوێت ئێستا کۆین بکڕیت؟`)) {
      ykBazaarState.activeTab = 'coins';
      renderBazaarBody();
    }
    return false;
  }
  addUserCoins(-cost);
  return true;
}

function openBazaarModal(tab = 'plus') {
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

    <div class="sticky top-0 z-30 bg-[#18070a]/90 backdrop-blur-lg border-b border-amber-400/35">
      <div class="max-w-lg mx-auto px-3 pt-3 pb-2 space-y-2.5" style="padding-top: max(12px, env(safe-area-inset-top));">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <button onclick="openBazaarTab('coins')" class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/55 border border-amber-400/55 shadow">
              <span class="yk-coin-icon">☀️</span>
              <span class="yk-bazaar-coin-val text-xs font-black text-amber-300">${(ykBazaarState.coins || 0).toLocaleString()}</span>
              <span class="text-[10px] font-black text-emerald-400">+</span>
            </button>
            <div class="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-black text-white">
              ${isUserPlusActive() ? '💎 پڵەس چالاکە' : 'ناچالاک'}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-sm font-black gold-text">بازاڕی یاری کوردی</span>
            <button onclick="closeBazaarModal()" class="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white font-black flex items-center justify-center text-sm">✕</button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs font-bold text-slate-300 border-t border-white/10 pt-2 overflow-x-auto gap-1">
          <button id="ykBTab-plus" onclick="openBazaarTab('plus')" class="px-2.5 pb-1.5 whitespace-nowrap transition">پڵەس</button>
          <button id="ykBTab-coins" onclick="openBazaarTab('coins')" class="px-2.5 pb-1.5 whitespace-nowrap transition">کۆین</button>
          <button id="ykBTab-profile" onclick="openBazaarTab('profile')" class="px-2.5 pb-1.5 whitespace-nowrap transition">پرۆفایل</button>
          <button id="ykBTab-chat" onclick="openBazaarTab('chat')" class="px-2.5 pb-1.5 whitespace-nowrap transition">چات</button>
          <button id="ykBTab-themes" onclick="openBazaarTab('themes')" class="px-2.5 pb-1.5 whitespace-nowrap transition">ڕووکار</button>
          <button id="ykBTab-gifts" onclick="openBazaarTab('gifts')" class="px-2.5 pb-1.5 whitespace-nowrap transition">دیاری</button>
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
  const tabs = ['plus', 'coins', 'profile', 'chat', 'themes', 'gifts'];
  tabs.forEach(t => {
    const el = document.getElementById('ykBTab-' + t);
    if (!el) return;
    el.classList.toggle('yk-bazaar-tab-active', t === ykBazaarState.activeTab);
  });

  const box = document.getElementById('ykBazaarContent');
  if (!box) return;

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
        <p class="text-[11px] text-amber-200/80">هەر مانگێکی پڵەس نیشانەکەت بەرەو ڕەنگێکی شاهانەتر دەبات</p>
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

      <div onclick="buyYariKurdiPlus('plus_12m')" class="cursor-pointer rounded-3xl p-4 bg-gradient-to-l from-amber-500/30 via-yellow-600/20 to-black/75 border-2 border-yellow-400 text-center space-y-2 shadow-xl active:scale-98 transition">
        <div class="text-sm font-black text-yellow-300">👑 ١٢ مانگ • ساڵی شاهانە</div>
        <div class="text-xs font-bold text-emerald-300">٣٠٪ هەرزانتر • باشترین هەڵبژاردە</div>
        <div class="inline-flex items-center gap-1.5 px-6 py-2 rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#1a0d06] text-sm font-black shadow-lg">
          <span>☀️</span><span>42,000 ${YK_CURRENCY_SYMBOL}</span>
        </div>
      </div>

      <div class="yk-glass-panel rounded-3xl p-4 space-y-3">
        <div class="text-xs font-black text-amber-300">✨ چی لە یاری کوردی پڵەسدا هەیە؟</div>
        <div class="grid grid-cols-4 gap-2 text-center text-[10px] font-black text-white">
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-xl mb-1">✓</div>نیشانەی VIP</div>
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-xl mb-1">☀️</div>چوارچێوەی کوردی</div>
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-xl mb-1">🎨</div>٥ ڕەنگی ناو</div>
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-xl mb-1">⚡</div>خاڵی ٢x وەرز</div>
        </div>
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
        <p class="text-[11px] text-slate-300">بەکاری بهێنە بۆ کڕینی پڵەس، چوارچێوە، ڕووکاری یاری و ناردنی دیاری لە دیوەخاندا</p>
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

      <div class="yk-glass-panel rounded-2xl p-3.5 text-center text-[11px] text-amber-100/85">
        💳 شێوازەکانی پارەدان: <strong>FIB • Qi Card • FastPay • کۆدی کارتی یاری کوردی</strong>
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

function selectPlusBadgeColor(col) {
  if (!isUserPlusActive()) {
    alert('سەرەتا بەشداری لە یاری کوردی پڵەس بکە تا بتوانیت ڕەنگی نیشانەکەت بگۆڕیت!');
    return;
  }
  ykBazaarState.plusBadgeColor = col;
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/plus/badgeColor`).set(col);
  }
  applyEquippedCosmeticsToHeader();
  renderBazaarBody();
}

function buyYariKurdiPlus(planId) {
  const plan = planId === 'plus_12m'
    ? { months: 12, price: 42000, title: 'ساڵی شاهانە (١٢ مانگ)' }
    : YK_PLUS_PLANS.find(p => p.id === planId);
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
  const nav = document.querySelector('header nav');
  if (nav && !document.getElementById('nav-bazaar')) {
    const btn = document.createElement('button');
    btn.id = 'nav-bazaar';
    btn.onclick = () => openBazaarModal('plus');
    btn.className = 'px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-amber-400/20 to-rose-500/20 border border-amber-400/45 text-amber-300 hover:brightness-125 transition';
    btn.textContent = '🛒 بازاڕ';
    nav.appendChild(btn);
  }

  const soundBtn = document.getElementById('soundBtn');
  if (soundBtn && soundBtn.parentElement && !document.getElementById('headerYkCoinPill')) {
    const pill = document.createElement('button');
    pill.id = 'headerYkCoinPill';
    pill.onclick = () => openBazaarModal('coins');
    pill.title = 'باڵانس و کڕینی دراوی یاری کوردی';
    pill.className = 'px-2.5 h-9 rounded-xl bg-[#241208] border border-amber-400/50 flex items-center gap-1.5 text-amber-300 text-xs font-black hover:border-yellow-300 transition shadow';
    pill.innerHTML = `<span class="yk-coin-icon" style="width:18px;height:18px;font-size:10px;">☀️</span><span class="yk-bazaar-coin-val">${(ykBazaarState.coins || 0).toLocaleString()}</span>`;
    soundBtn.parentElement.insertBefore(pill, soundBtn);
  }

  const dock = document.querySelector('.floating-bottom-dock');
  if (dock && !document.getElementById('dock-bazaar')) {
    const dBtn = document.createElement('button');
    dBtn.id = 'dock-bazaar';
    dBtn.onclick = () => openBazaarModal('plus');
    dBtn.className = 'dock-item';
    dBtn.title = 'بازاڕی یاری کوردی';
    dBtn.textContent = '🛒';
    const profileDock = document.getElementById('dock-profile');
    if (profileDock) dock.insertBefore(dBtn, profileDock);
    else dock.appendChild(dBtn);
  }
}

window.openBazaarModal = openBazaarModal;
window.closeBazaarModal = closeBazaarModal;
window.openBazaarTab = openBazaarTab;
window.buyYariKurdiPlus = buyYariKurdiPlus;
window.buyBazaarCoinPack = buyBazaarCoinPack;
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
  setInterval(getUserCoinsSync, 2000);
})();