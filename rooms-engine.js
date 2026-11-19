const ROOM_THEMES = [
  { id: 'sherwana', name: 'قەڵای شێروانە • کەلار', subtitle: 'مێژووی گەرمیان', accent: '#facc15', preview: 'linear-gradient(135deg,#451a03,#9a3412,#1c0a04)' },
  { id: 'erbil', name: 'قەڵای هەولێر', subtitle: 'پایتەختی مێژوو', accent: '#fb923c', preview: 'linear-gradient(135deg,#2e1065,#7c2d12,#0f0720)' },
  { id: 'sulaymaniyah', name: 'سلێمانی و چیای گۆیژە', subtitle: 'شاری ڕۆشنبیری', accent: '#38bdf8', preview: 'linear-gradient(135deg,#0c1936,#1e3a5f,#050b18)' },
  { id: 'duhok', name: 'دهۆک و ئامێدی', subtitle: 'سروشتی بادینان', accent: '#34d399', preview: 'linear-gradient(135deg,#064e3b,#0f172a,#020c0a)' },
  { id: 'kurdistan', name: 'ئاڵای کوردستان', subtitle: 'تیشکی خۆری ٢١ پەڕ', accent: '#fde047', preview: 'linear-gradient(180deg,#991b1b,#334155,#14532d)' },
  { id: 'galaxy', name: 'ئاسمانی ئەفسووناوی', subtitle: 'دیوەخانی VIP', accent: '#e879f9', preview: 'linear-gradient(135deg,#1e1b4b,#581c87,#090418)' }
];

const ROYAL_GIFTS_CATALOG = [
  { id: 'tea', name: 'چای چایخانە', icon: '🫖', cost: 5, xp: 15, tier: 'normal', cat: 'kurdish', desc: 'چای گەرمی دیوەخان' },
  { id: 'rose', name: 'گوڵی سوور', icon: '🌹', cost: 15, xp: 30, tier: 'normal', cat: 'hot', desc: 'ڕێزلێنانی تایبەت' },
  { id: 'scroll', name: 'فەرمانی شاهانە', icon: '📜', cost: 40, xp: 75, tier: 'normal', cat: 'kurdish', desc: 'پەیامی شکۆمەندی' },
  { id: 'lovebox', name: 'سندوقی دڵ', icon: '💝', cost: 99, xp: 160, tier: 'rare', cat: 'hot', desc: 'دیارییەکی پڕ سۆز' },
  { id: 'crown', name: 'تاجی پاشا', icon: '👑', cost: 299, xp: 450, tier: 'epic', cat: 'vip', desc: 'درەوشانەوەی زێڕین' },
  { id: 'sports_car', name: 'ئۆتۆمبێلی لوکس', icon: '🏎️', cost: 599, xp: 900, tier: 'epic', cat: 'hot', desc: 'هاتنەناوەوەی شاهانە' },
  { id: 'knight', name: 'سوارچاکی زێڕین', icon: '⚔️', cost: 1200, xp: 1800, tier: 'legendary', cat: 'vip', desc: 'ئەنیمەیشنی فول سکرین' },
  { id: 'whale', name: 'نەهەنگی گەردوونی', icon: '🐋', cost: 2500, xp: 3800, tier: 'legendary', cat: 'vip', desc: 'شەپۆلی گەردوونی!' },
  { id: 'eagle', name: 'هەڵۆی کوردستان', icon: '🦅', cost: 5000, xp: 8000, tier: 'mythic', cat: 'kurdish', desc: 'بەرزترین دیاریی پلاتفۆرم!' }
];

const COIN_STORE_PACKAGES = [
  { id: 'pkg_100', coins: 100, bonus: 15, priceIQD: '1,500 دینار', badge: 'سەرەتایی' },
  { id: 'pkg_550', coins: 550, bonus: 90, priceIQD: '7,500 دینار', badge: 'باوترین 🔥' },
  { id: 'pkg_1500', coins: 1500, bonus: 350, priceIQD: '18,000 دینار', badge: 'VIP 👑' },
  { id: 'pkg_5000', coins: 5000, bonus: 1500, priceIQD: '50,000 دینار', badge: 'ئەفسانەیی 💎' }
];

function getRoomLevelData(roomXp = 0) {
  const xp = Math.max(0, Number(roomXp) || 0);
  let level = 1;
  let threshold = 100;
  let rem = xp;
  while (rem >= threshold && level < 50) {
    rem -= threshold;
    level++;
    threshold = Math.round(threshold * 1.45);
  }
  let unlockedSeats = 5;
  if (level >= 5) unlockedSeats = 8;
  else if (level >= 3) unlockedSeats = 7;
  else if (level >= 2) unlockedSeats = 6;
  const progressPct = Math.min(100, Math.round((rem / threshold) * 100));
  return { level, currentXp: rem, nextXp: threshold, progressPct, unlockedSeats };
}

let currentVoiceRoomId = null;
let currentRoomMeta = null;
let currentRoomMembers = {};
let localAudioStream = null;
let isMicMuted = false;
let isSpeakerMuted = false;
let rtcPeers = {};
let rtcIceQueues = {};
let roomMetaRef = null;
let roomMembersRef = null;
let roomSignalsRef = null;
let roomChatRef = null;
let roomGiftsFxRef = null;
let voiceAnalyserInterval = null;
let stayXpInterval = null;
let roomBgAnimFrame = null;

let selectedGiftRecipient = 'ALL';
let selectedGiftId = 'tea';
let selectedGiftQty = 1;
let selectedGiftCat = 'all';
let lastSentGiftCombo = null;
let comboTimer = null;
let myUserCoins = 250;

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' }
  ]
};

function injectVipRoomStyles() {
  if (document.getElementById('ykVipRoomStyles')) return;
  const st = document.createElement('style');
  st.id = 'ykVipRoomStyles';
  st.textContent = `
    @keyframes ykSpinGlow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes ykVoiceWave {
      0% { transform: scale(1); opacity: 0.85; }
      100% { transform: scale(1.42); opacity: 0; }
    }
    @keyframes ykFloatHeart {
      0% { transform: translateY(0) scale(0.7) rotate(0deg); opacity: 1; }
      50% { transform: translateY(-110px) scale(1.15) rotate(-12deg); opacity: 0.9; }
      100% { transform: translateY(-240px) scale(0.9) rotate(14deg); opacity: 0; }
    }
    @keyframes ykGiftSlideIn {
      0% { transform: translateX(120%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes ykGrandGiftPop {
      0% { transform: scale(0.25) rotate(-12deg); opacity: 0; }
      35% { transform: scale(1.12) rotate(4deg); opacity: 1; }
      55% { transform: scale(0.98) rotate(-2deg); opacity: 1; }
      100% { transform: scale(1.04) rotate(0deg); opacity: 1; }
    }
    @keyframes ykPkShine {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .yk-vip-ring-host {
      background: conic-gradient(from 0deg, #fde047, #f97316, #ec4899, #fde047);
      animation: ykSpinGlow 3.2s linear infinite;
    }
    .yk-vip-ring-speak {
      background: conic-gradient(from 0deg, #34d399, #22d3ee, #facc15, #34d399);
      animation: ykSpinGlow 1.8s linear infinite;
    }
    .yk-speak-ripple {
      position: absolute;
      inset: -4px;
      border-radius: 9999px;
      border: 2.5px solid #34d399;
      animation: ykVoiceWave 1.15s ease-out infinite;
      pointer-events: none;
    }
    .yk-pk-bar {
      background: linear-gradient(90deg, #ec4899, #f59e0b, #06b6d4, #ec4899);
      background-size: 200% 100%;
      animation: ykPkShine 3.5s linear infinite;
    }
    .yk-no-scroll::-webkit-scrollbar { display: none; }
    .yk-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `;
  document.head.appendChild(st);
}

function syncPlayerCoinsListener() {
  if (typeof db === 'undefined' || typeof playerId === 'undefined' || !playerId) return;
  if (window._ykCoinsSynced) return;
  window._ykCoinsSynced = true;
  db.ref(`players/${playerId}/coins`).on('value', snap => {
    if (snap.exists()) {
      myUserCoins = Number(snap.val()) || 0;
    } else {
      myUserCoins = 250;
      db.ref(`players/${playerId}/coins`).set(250);
    }
    updateRoomCoinDisplays();
  });
}

function updateRoomCoinDisplays() {
  document.querySelectorAll('.yk-user-coin-balance').forEach(el => {
    el.textContent = myUserCoins.toLocaleString();
  });
}

function ensureGlobalCoinStoreModal() {
  let m = document.getElementById('ykGlobalCoinStore');
  if (m) return m;
  m = document.createElement('div');
  m.id = 'ykGlobalCoinStore';
  m.className = 'hidden fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md';
  m.style.zIndex = '10020';
  m.onclick = (e) => { if (e.target === m) closeCoinStoreModal(); };
  m.innerHTML = `
    <div class="royal-card max-w-md w-full rounded-3xl p-5 space-y-4 border-2 border-yellow-400 shadow-2xl" dir="rtl">
      <div class="flex items-center justify-between border-b border-amber-400/25 pb-3">
        <div>
          <h3 class="text-lg font-black gold-text">🪙 فرۆشگای سکەی YariKurdi</h3>
          <p class="text-[11px] text-amber-200/80">سکە بکڕە بۆ ناردنی دیاریی شاهانە و کردنەوەی کورسییەکان</p>
        </div>
        <button onclick="closeCoinStoreModal()" class="w-8 h-8 rounded-full bg-white/10 text-white font-bold">✕</button>
      </div>
      <div class="bg-black/50 rounded-2xl p-3 flex items-center justify-between border border-amber-400/35">
        <span class="text-xs text-amber-100 font-bold">باڵانسی ئێستات:</span>
        <span class="text-base font-black text-yellow-300">🪙 <span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span> سکە</span>
      </div>
      <div class="grid grid-cols-2 gap-2.5">
        ${COIN_STORE_PACKAGES.map(pkg => `
          <div onclick="purchaseCoinPackage('${pkg.id}')"
            class="cursor-pointer rounded-2xl p-3.5 bg-gradient-to-b from-amber-500/20 to-black/70 border border-amber-400/50 hover:border-yellow-300 transition flex flex-col justify-between gap-2 text-center">
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/25 text-amber-200 font-black self-center">${pkg.badge}</span>
            <div class="text-2xl">🪙</div>
            <div>
              <div class="text-sm font-black text-white">${pkg.coins.toLocaleString()} سکە</div>
              <div class="text-[10px] font-bold text-emerald-400">+${pkg.bonus} دیاری بەخۆڕایی</div>
            </div>
            <div class="py-1.5 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#1a0d06] text-xs font-black">${pkg.priceIQD}</div>
          </div>
        `).join('')}
      </div>
      <p class="text-[10px] text-center text-amber-200/70">پشتگیری لە FIB • Qi Card • FastPay دەکات</p>
    </div>
  `;
  document.body.appendChild(m);
  return m;
}

function openCoinStoreModal() {
  const m = ensureGlobalCoinStoreModal();
  updateRoomCoinDisplays();
  m.classList.remove('hidden');
}

function closeCoinStoreModal() {
  const m = document.getElementById('ykGlobalCoinStore');
  if (m) m.classList.add('hidden');
}

function purchaseCoinPackage(pkgId) {
  const pkg = COIN_STORE_PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;
  const totalAdd = pkg.coins + pkg.bonus;
  if (confirm(`کڕینی پاکێجی ${pkg.coins.toLocaleString()} سکە (+${pkg.bonus} دیاری) بە ${pkg.priceIQD}؟`)) {
    myUserCoins += totalAdd;
    updateRoomCoinDisplays();
    if (typeof db !== 'undefined' && typeof playerId !== 'undefined' && playerId) {
      db.ref(`players/${playerId}/coins`).set(myUserCoins);
    }
    if (typeof playChessSound === 'function') playChessSound('end');
    alert(`🎉 پیرۆزە! ${totalAdd.toLocaleString()} سکە زیاد کرا بۆ هەژمارەکەت.`);
    closeCoinStoreModal();
  }
}

function loadActiveVoiceRooms() {
  injectVipRoomStyles();
  syncPlayerCoinsListener();
  const lobby = document.getElementById('roomsLobbyPanel');
  if (!lobby) return;

  lobby.innerHTML = `
    <div class="royal-card rounded-3xl p-5 sm:p-6 space-y-4 border border-amber-400/45">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h2 class="text-xl sm:text-2xl font-black gold-text">🎙️ دیوەخان و ژوورە زیندووەکان</h2>
            <span class="px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black">
              🪙 <span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span>
            </span>
          </div>
          <p class="text-xs text-amber-100/80 mt-1">سەرەتا ٥ کورسی کراوەیە — پاشبنەمای قەڵای شێروانە، هەولێر و سلێمانی هەڵبژێرە یان وێنەی خۆت دابنێ!</p>
        </div>
        <button onclick="openCoinStoreModal()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#1a0d06] text-xs font-black shadow-lg">
          🪙 کڕینی سکە
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-amber-400/20">
        <input id="newRoomTitleInput" type="text" placeholder="ناوی دیوەخانەکەت (بۆ نموونە: دیوەخانی کەلار)..."
          class="sm:col-span-5 px-4 py-2.5 rounded-xl bg-[#120804] border border-amber-400/35 text-xs text-white focus:outline-none focus:border-yellow-400" />
        <select id="newRoomThemeSelect"
          class="sm:col-span-4 px-3 py-2.5 rounded-xl bg-[#120804] border border-amber-400/35 text-xs text-amber-200 font-bold">
          ${ROOM_THEMES.map(t => `<option value="${t.id}">🏰 ${t.name}</option>`).join('')}
        </select>
        <button onclick="createVoiceRoom()" class="sm:col-span-3 gold-btn py-2.5 px-4 rounded-xl text-xs font-black whitespace-nowrap">
          + کردنەوەی ژوور
        </button>
      </div>
    </div>

    <div id="activeRoomsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
      <p class="text-xs text-amber-200/70">چاوەڕێی بارکردنی ژوورەکانین...</p>
    </div>
  `;

  db.ref('voiceRooms').on('value', snap => {
    const grid = document.getElementById('activeRoomsGrid');
    if (!grid) return;
    const rooms = [];
    snap.forEach(c => {
      const val = c.val();
      if (val && val.members) {
        rooms.push({ id: c.key, ...val, count: Object.keys(val.members).length });
      }
    });

    if (rooms.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full royal-card rounded-3xl text-center py-10 px-4 space-y-2 border border-dashed border-amber-400/40">
          <div class="text-4xl">🏰</div>
          <div class="text-sm font-black text-amber-300">هیچ دیوەخانێکی کراوە نییە</div>
          <p class="text-xs text-slate-300">تۆ یەکەم ژوور بکەرەوە و شارەکەت وەک پاشبنەما هەڵبژێرە!</p>
        </div>`;
      return;
    }

    grid.innerHTML = rooms.map(r => {
      const lv = getRoomLevelData(r.roomXp || 0);
      const th = ROOM_THEMES.find(t => t.id === r.theme) || ROOM_THEMES[0];
      const bgStyle = r.customBg
        ? `background-image: linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.85)), url('${r.customBg}'); background-size: cover; background-position: center;`
        : `background: ${th.preview};`;
      return `
        <div class="relative overflow-hidden rounded-3xl p-5 flex flex-col justify-between gap-4 border-2 border-amber-400/50 shadow-2xl transition hover:scale-[1.02]" style="${bgStyle}">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full bg-black/65 border border-amber-400/50 text-amber-300 text-[11px] font-black">
                💎 Lv.${lv.level} • ${r.customBg ? 'وێنەی تایبەت' : th.name}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 text-xs font-black">
                👥 ${r.count} / ${lv.unlockedSeats}
              </span>
            </div>
            <h3 class="text-base font-black text-white drop-shadow">${escapeRoomHtml(r.title)}</h3>
            <div class="flex items-center justify-between text-[11px] text-amber-100/90">
              <span>👑 ${escapeRoomHtml(r.hostName || 'یاریزان')}</span>
              <span>🎁 ${(r.totalGiftCoins || 0).toLocaleString()}</span>
            </div>
            <div class="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/15">
              <div class="h-full yk-pk-bar" style="width:${Math.max(8, lv.progressPct)}%"></div>
            </div>
          </div>
          <button onclick="joinVoiceRoom('${r.id}')" class="gold-btn w-full py-2.5 rounded-xl text-xs font-black shadow-lg">
            چوونە ناو ژوور 🎙️
          </button>
        </div>
      `;
    }).join('');
  });
}

async function createVoiceRoom() {
  const titleInput = document.getElementById('newRoomTitleInput');
  const themeSelect = document.getElementById('newRoomThemeSelect');
  const title = (titleInput && titleInput.value.trim()) || `دیوەخانی ${playerName}`;
  const theme = (themeSelect && themeSelect.value) || 'sherwana';

  const rId = 'vroom_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
  await db.ref('voiceRooms/' + rId).set({
    title,
    theme,
    customBg: '',
    hostId: playerId,
    hostName: playerName,
    roomXp: 0,
    totalGiftCoins: 0,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
  if (titleInput) titleInput.value = '';
  joinVoiceRoom(rId);
}

function buildFullscreenVipRoomRoot() {
  injectVipRoomStyles();
  const existing = document.getElementById('ykVipRoomRoot');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'ykVipRoomRoot';
  root.setAttribute('dir', 'rtl');
  root.style.cssText = 'position:fixed; inset:0; width:100vw; height:100dvh; z-index:9990; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; background:#090512; user-select:none; -webkit-user-select:none;';

  root.innerHTML = `
    <canvas id="ykVipBgCanvas" style="position:absolute; inset:0; width:100%; height:100%; z-index:1; pointer-events:none;"></canvas>
    <div id="ykVipCustomBgLayer" style="position:absolute; inset:0; z-index:2; background-size:cover; background-position:center; display:none; pointer-events:none;">
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(6,4,12,0.58) 0%, rgba(6,4,12,0.34) 45%, rgba(6,4,12,0.88) 100%);"></div>
    </div>

    <div id="ykHeartsLayer" style="position:absolute; inset:0; z-index:35; pointer-events:none; overflow:hidden;"></div>
    <div id="ykFullGiftOverlay" class="hidden fixed inset-0 flex-col items-center justify-center pointer-events-none" style="z-index:10005;"></div>

    <button id="ykGiftComboBtn" onclick="triggerComboRepeat()"
      class="hidden fixed left-4 w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-rose-600 border-3 border-yellow-200 shadow-[0_0_28px_rgba(251,191,36,0.95)] flex flex-col items-center justify-center text-white font-black animate-bounce cursor-pointer"
      style="bottom: calc(82px + env(safe-area-inset-bottom)); z-index:10002;">
      <span class="text-xs leading-none">Combo</span>
      <span id="ykComboCountText" class="text-sm text-yellow-100 mt-0.5">x1</span>
    </button>

    <!-- هیدەری سەرەوەی هاوشێوەی TikTok Live -->
    <div class="relative z-20 px-3 pb-1.5 space-y-1.5" style="padding-top: max(10px, env(safe-area-inset-top)); background:linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 100%);">
      <div class="max-w-lg mx-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 bg-black/50 backdrop-blur-md border border-white/15 rounded-full pl-3 pr-1 py-1 min-w-0">
          <div id="vipHostAvatarBox" class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 text-[#1a0d06] font-black flex items-center justify-center overflow-hidden border border-yellow-200 shrink-0">👑</div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span id="currentRoomTitle" class="text-xs font-black text-white truncate max-w-[115px] sm:max-w-[170px]">دیوەخان</span>
              <span id="vipRoomLevelBadge" class="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white text-[9px] font-black shrink-0">Lv.1</span>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-amber-200/90">
              <span id="vipThemeNameTag" class="truncate max-w-[95px]">قەڵای شێروانە</span>
              <span>•</span>
              <span>🎁 <strong id="vipRoomTotalGifts">0</strong></span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="openThemePickerModal()" title="گۆڕینی وێنەی شار و پاشبنەما"
            class="w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-amber-400/50 text-amber-300 flex items-center justify-center text-sm shadow">
            🖼️
          </button>
          <div class="px-2 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-white text-[11px] font-black flex items-center gap-1">
            <span>👥</span><span id="vipRoomOnlineCount">1</span>
          </div>
          <button onclick="leaveVoiceRoom()" title="دەرچوون"
            class="w-8 h-8 rounded-full bg-rose-600/90 text-white font-black flex items-center justify-center text-xs shadow">
            ✕
          </button>
        </div>
      </div>

      <!-- شریتی وزە و لیڤڵی ژوور (وەک PK Bar ی تیکتۆک) -->
      <div class="max-w-lg mx-auto flex items-center gap-2 bg-black/45 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
        <span id="vipSeatsUnlockHint" class="text-[10px] font-black text-amber-300 whitespace-nowrap">🪑 5/8 کورسی</span>
        <div class="flex-1 h-2 rounded-full bg-white/15 overflow-hidden">
          <div id="vipRoomXpFill" class="h-full yk-pk-bar transition-all duration-500" style="width: 12%"></div>
        </div>
        <span id="vipRoomXpText" class="text-[9px] font-mono text-cyan-200 whitespace-nowrap">0/100 XP</span>
      </div>
    </div>

    <!-- ناوەڕاست: سەکۆی ٨ کورسیی VIP + چاتی شەفاف لەسەر وێنەی شارەکە -->
    <div class="relative z-20 flex-1 flex flex-col justify-between overflow-hidden max-w-lg w-full mx-auto px-2.5 pb-1">
      <div id="roomSeatsGrid" class="grid grid-cols-4 gap-2 pt-1 shrink-0"></div>

      <div class="flex-1 flex flex-col justify-end min-h-0 pt-1.5">
        <div id="ykFloatingGiftBannerBox" class="mb-1.5 min-h-[38px] flex items-center justify-start"></div>
        <div id="roomChatMessages"
          class="yk-no-scroll max-h-[26dvh] overflow-y-auto space-y-1.5 px-1.5 py-1 text-xs"
          style="mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 14%, black 100%);">
        </div>
      </div>
    </div>

    <!-- شریتی خوارەوەی کۆنترۆڵ (تەواو دیار لەسەر مۆبایل) -->
    <div class="relative z-20 px-3 pt-1.5" style="padding-bottom: max(12px, env(safe-area-inset-bottom)); background:linear-gradient(0deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 100%);">
      <div class="max-w-lg mx-auto flex items-center gap-1.5">
        <button id="roomMicToggleBtn" onclick="toggleRoomMicrophone()"
          class="w-10 h-10 rounded-full bg-emerald-500 text-[#050b18] font-black flex items-center justify-center text-lg shadow-lg shrink-0 transition">
          🎙️
        </button>
        <button id="roomSpeakerToggleBtn" onclick="toggleRoomSpeaker()"
          class="w-9 h-9 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center text-sm shrink-0">
          🔊
        </button>

        <div class="flex-1 flex items-center bg-black/55 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 min-w-0">
          <input id="roomChatInput" type="text" onkeydown="if(event.key==='Enter') sendRoomChatMessage()"
            placeholder="شتێک بڵێ..."
            class="flex-1 min-w-0 bg-transparent text-xs text-white placeholder-slate-300 focus:outline-none py-1" />
          <button onclick="sendRoomChatMessage()" class="text-amber-300 font-black text-xs pr-1.5 shrink-0">ناردن</button>
        </div>

        <button onclick="sendFloatingHeart()" title="لایک و دڵ"
          class="w-9 h-9 rounded-full bg-rose-500/25 border border-rose-400/50 text-rose-300 flex items-center justify-center text-base shrink-0 active:scale-90 transition">
          ❤️
        </button>

        <button onclick="openGiftDrawerModal()" title="ناردنی دیاری"
          class="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-amber-400 border-2 border-yellow-200 text-white flex items-center justify-center text-lg shadow-[0_0_18px_rgba(244,63,94,0.85)] shrink-0 active:scale-95 transition">
          🎁
        </button>
      </div>
    </div>

    <!-- پانێڵی دیاری ناردن (TikTok Style Bottom Sheet) -->
    <div id="ykGiftDrawerModal" class="hidden fixed inset-0 flex flex-col justify-end bg-black/55 backdrop-blur-xs" style="z-index:10010;" onclick="if(event.target===this) closeGiftDrawerModal()">
      <div class="bg-[#120b1a]/98 border-t-2 border-amber-400/75 rounded-t-3xl p-4 max-w-lg w-full mx-auto space-y-3 shadow-2xl" style="padding-bottom: max(16px, env(safe-area-inset-bottom));">
        <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div class="yk-no-scroll flex items-center gap-1.5 overflow-x-auto pb-0.5" id="ykGiftRecipientsRow"></div>
          <button onclick="closeGiftDrawerModal()" class="text-slate-300 hover:text-white text-sm font-bold px-1.5">✕</button>
        </div>

        <div class="flex items-center justify-between gap-2 text-[11px] font-black">
          <div class="flex items-center gap-2">
            <button onclick="setGiftCategory('all', this)" class="yk-gcat-btn text-amber-300 border-b-2 border-amber-300 pb-0.5">هەمووی</button>
            <button onclick="setGiftCategory('kurdish', this)" class="yk-gcat-btn text-slate-400 pb-0.5">کوردەواری</button>
            <button onclick="setGiftCategory('hot', this)" class="yk-gcat-btn text-slate-400 pb-0.5">باوترین</button>
            <button onclick="setGiftCategory('vip', this)" class="yk-gcat-btn text-slate-400 pb-0.5">شاهانە VIP</button>
          </div>
          <span id="ykSelectedGiftCostHint" class="text-yellow-300">🪙 5</span>
        </div>

        <div id="ykGiftsGrid" class="yk-no-scroll grid grid-cols-4 gap-2 max-h-48 overflow-y-auto"></div>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button onclick="openCoinStoreModal()" class="flex items-center gap-1 px-3 py-2 rounded-full bg-amber-400/15 border border-amber-400/50 text-yellow-300 text-xs font-black">
            <span>🪙</span>
            <span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span>
            <span class="text-emerald-400 mr-1">+ کڕین</span>
          </button>

          <div class="flex items-center gap-1.5">
            <div class="flex items-center bg-white/10 rounded-full p-0.5 text-[11px] font-black">
              <button onclick="setGiftQty(1, this)" class="yk-qty-btn px-2 py-1 rounded-full bg-amber-400 text-[#1a0d06]">1</button>
              <button onclick="setGiftQty(7, this)" class="yk-qty-btn px-2 py-1 rounded-full text-white">7</button>
              <button onclick="setGiftQty(77, this)" class="yk-qty-btn px-2 py-1 rounded-full text-white">77</button>
            </div>
            <button onclick="sendSelectedRoyalGift()" class="px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 text-white text-xs font-black shadow-lg">
              ناردن 🚀
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- مۆداڵی هەڵبژاردنی وێنەی شارەکان یان بەرزکردنەوەی وێنەی مۆبایل -->
    <div id="ykThemePickerModal" class="hidden fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" style="z-index:10015;" onclick="if(event.target===this) closeThemePickerModal()">
      <div class="royal-card max-w-md w-full rounded-3xl p-5 space-y-4 border-2 border-amber-400 shadow-2xl">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-black gold-text">🏰 پاشبنەمای شارە کوردییەکان</h3>
            <p class="text-[10px] text-amber-200/80">دیمەنی شارەکەت هەڵبژێرە یان وێنەیەک لە مۆبایلەکەت دابنێ</p>
          </div>
          <button onclick="closeThemePickerModal()" class="w-8 h-8 rounded-full bg-white/10 text-white font-bold">✕</button>
        </div>

        <label class="cursor-pointer w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-[#1a0d06] text-xs font-black flex items-center justify-center gap-2 shadow-lg">
          <span>📷 دانانی وێنەی ڕاستەقینە لە مۆبایلەوە</span>
          <input type="file" accept="image/*" onchange="uploadCustomRoomBg(this)" class="hidden" />
        </label>

        <div class="grid grid-cols-2 gap-2.5">
          ${ROOM_THEMES.map(t => `
            <button onclick="changeCurrentRoomTheme('${t.id}')"
              class="h-20 rounded-2xl p-3 flex flex-col justify-end text-right border-2 border-amber-400/50 hover:border-yellow-300 shadow-lg relative overflow-hidden"
              style="background: ${t.preview};">
              <span class="text-xs font-black text-white drop-shadow">${t.name}</span>
              <span class="text-[10px] text-amber-200/90">${t.subtitle}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <div id="remoteAudiosContainer" class="hidden"></div>
  `;

  root.addEventListener('pointerdown', unlockMobileRoomAudio, { passive: true });
  document.body.appendChild(root);
  startCityCanvasRenderer();
}

function unlockMobileRoomAudio() {
  document.querySelectorAll('#remoteAudiosContainer audio').forEach(a => {
    a.muted = isSpeakerMuted;
    if (a.paused && a.srcObject) a.play().catch(() => {});
  });
}

// کێشانی دیمەنی زیندووی شارە کوردییەکان (قەڵای شێروانە، قەڵای هەولێر، سلێمانی و گۆیژە، دهۆک، ئاڵای کوردستان) بە ئەنیمەیشنی ئەستێرە و تیشک
function startCityCanvasRenderer() {
  if (roomBgAnimFrame) cancelAnimationFrame(roomBgAnimFrame);
  const cvs = document.getElementById('ykVipBgCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  let w = 0, h = 0;
  const stars = Array.from({ length: 55 }, () => ({
    x: Math.random(), y: Math.random() * 0.58,
    r: Math.random() * 1.6 + 0.4,
    phase: Math.random() * Math.PI * 2,
    sp: Math.random() * 0.03 + 0.01
  }));
  const embers = Array.from({ length: 24 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 2.2 + 0.8,
    vy: -(Math.random() * 0.0012 + 0.0004),
    ph: Math.random() * Math.PI * 2
  }));

  function resize() {
    if (!cvs) return;
    const dpr = Math.min(window.devicePixelRatio || 1.5, 2);
    w = cvs.width = Math.round(window.innerWidth * dpr);
    h = cvs.height = Math.round(window.innerHeight * dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  let tick = 0;
  function draw() {
    if (!document.getElementById('ykVipRoomRoot')) return;
    tick += 0.016;
    const themeId = (currentRoomMeta && currentRoomMeta.theme) || 'sherwana';

    ctx.clearRect(0, 0, w, h);

    if (themeId === 'sherwana') {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#12081c');
      sky.addColorStop(0.38, '#3b1520');
      sky.addColorStop(0.68, '#7c2d12');
      sky.addColorStop(1, '#120704');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // مانگی درەوشاوە لە پشت قەڵای شێروانە
      const mx = w * 0.78, my = h * 0.24, mr = Math.min(w, h) * 0.085;
      const mg = ctx.createRadialGradient(mx, my, mr * 0.3, mx, my, mr * 2.6);
      mg.addColorStop(0, 'rgba(254, 240, 138, 0.72)');
      mg.addColorStop(0.45, 'rgba(245, 158, 11, 0.22)');
      mg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mg;
      ctx.beginPath(); ctx.arc(mx, my, mr * 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath(); ctx.arc(mx, my, mr * 0.65, 0, Math.PI * 2); ctx.fill();

      // تەپەی بەناوبانگی شێروانە (کەلار)
      ctx.fillStyle = '#1f0c07';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.76);
      ctx.quadraticCurveTo(w * 0.22, h * 0.72, w * 0.34, h * 0.63);
      ctx.lineTo(w * 0.66, h * 0.63);
      ctx.quadraticCurveTo(w * 0.78, h * 0.72, w, h * 0.76);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // کۆشکی قەڵای شێروانە (تەلاری دوو نهۆمی + قوللەی ناوەڕاست + کەوانە ڕووناکەکان)
      const cx = w * 0.5, base = h * 0.635, cw = Math.min(w * 0.52, 420), ch = cw * 0.42;
      ctx.fillStyle = '#2d1209';
      ctx.fillRect(cx - cw / 2, base - ch, cw, ch);
      // قوللە گۆشەییەکان و قوللەی گەورەی سەرەوە
      ctx.fillRect(cx - cw * 0.54, base - ch * 1.15, cw * 0.14, ch * 1.15);
      ctx.fillRect(cx + cw * 0.40, base - ch * 1.15, cw * 0.14, ch * 1.15);
      ctx.fillRect(cx - cw * 0.16, base - ch * 1.48, cw * 0.32, ch * 0.55);
      // گومەزی سەرەوەی شێروانە
      ctx.beginPath();
      ctx.arc(cx, base - ch * 1.48, cw * 0.12, Math.PI, 0);
      ctx.fill();

      // پەنجەرە کەوانەییە ڕووناکەکانی قەڵای شێروانە
      ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 12;
      for (let i = -2; i <= 2; i++) {
        const ax = cx + i * (cw * 0.17);
        ctx.beginPath();
        ctx.arc(ax, base - ch * 0.55, cw * 0.038, Math.PI, 0);
        ctx.lineTo(ax + cw * 0.038, base - ch * 0.22);
        ctx.lineTo(ax - cw * 0.038, base - ch * 0.22);
        ctx.closePath();
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, base - ch * 1.24, cw * 0.045, Math.PI, 0);
      ctx.lineTo(cx + cw * 0.045, base - ch * 1.02);
      ctx.lineTo(cx - cw * 0.045, base - ch * 1.02);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

    } else if (themeId === 'erbil') {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#13072e');
      sky.addColorStop(0.45, '#3b1047');
      sky.addColorStop(0.75, '#6b211a');
      sky.addColorStop(1, '#0e0514');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // تەپۆڵکە مێژووییەکەی قەڵای هەولێر
      ctx.fillStyle = '#240f17';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.72);
      ctx.lineTo(w * 0.14, h * 0.58);
      ctx.lineTo(w * 0.86, h * 0.58);
      ctx.lineTo(w, h * 0.72);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // شوورای خانووە دێرینەکانی سەر قەڵای هەولێر و دەروازە گەورەکە
      const wallY = h * 0.58;
      const wallH = Math.min(h * 0.1, 80);
      ctx.fillStyle = '#33151d';
      ctx.fillRect(w * 0.14, wallY - wallH, w * 0.72, wallH);

      // دەروازەی گەورەی قەڵای هەولێر لە ناوەڕاستدا
      const gx = w * 0.5, gw = Math.min(w * 0.24, 170);
      ctx.fillStyle = '#471d1d';
      ctx.fillRect(gx - gw / 2, wallY - wallH * 1.35, gw, wallH * 1.35);

      ctx.fillStyle = 'rgba(251, 191, 36, 0.88)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(gx, wallY - wallH * 0.55, gw * 0.22, Math.PI, 0);
      ctx.lineTo(gx + gw * 0.22, wallY);
      ctx.lineTo(gx - gw * 0.22, wallY);
      ctx.closePath();
      ctx.fill();

      // پەنجەرە ڕووناکەکانی سەر شوورای هەولێر
      for (let i = 0; i < 11; i++) {
        const wx = w * 0.17 + i * (w * 0.66 / 10);
        if (Math.abs(wx - gx) < gw * 0.6) continue;
        ctx.fillRect(wx - 4, wallY - wallH * 0.65, 8, 12);
      }
      ctx.shadowBlur = 0;

    } else if (themeId === 'sulaymaniyah') {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#040a1a');
      sky.addColorStop(0.45, '#0c2348');
      sky.addColorStop(0.76, '#133a5e');
      sky.addColorStop(1, '#040914');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // چیای گۆیژە و ئەزمەڕ
      ctx.fillStyle = '#08152b';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.62);
      ctx.quadraticCurveTo(w * 0.26, h * 0.42, w * 0.52, h * 0.56);
      ctx.quadraticCurveTo(w * 0.78, h * 0.38, w, h * 0.58);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // چرا و ڕووناکییەکانی شەوی شاری سلێمانی لە دامێنی گۆیژە
      for (let i = 0; i < 42; i++) {
        const lx = ((i * 73) % 100) / 100 * w;
        const ly = h * 0.64 + ((i * 41) % 22) / 100 * h;
        const pulse = 0.45 + 0.55 * Math.sin(tick * 2 + i);
        ctx.fillStyle = i % 3 === 0 ? `rgba(56, 189, 248, ${pulse})` : `rgba(253, 224, 71, ${pulse})`;
        ctx.beginPath();
        ctx.arc(lx, ly, (i % 4 === 0 ? 3 : 1.8), 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (themeId === 'duhok') {
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#021210');
      sky.addColorStop(0.48, '#064e3b');
      sky.addColorStop(0.82, '#0f2922');
      sky.addColorStop(1, '#020b09');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // شاخە سەختەکانی دهۆک و تەختی ئامێدی
      ctx.fillStyle = '#041f18';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.64);
      ctx.lineTo(w * 0.24, h * 0.48);
      ctx.lineTo(w * 0.76, h * 0.48);
      ctx.lineTo(w, h * 0.68);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      // ڕووناکییەکانی سەر شاری ئامێدی
      ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
      for (let i = 0; i < 16; i++) {
        const ax = w * 0.28 + i * (w * 0.44 / 15);
        ctx.fillRect(ax, h * 0.47, 5, 7);
      }

    } else if (themeId === 'kurdistan') {
      const band = h / 3;
      const g1 = ctx.createLinearGradient(0, 0, w, band);
      g1.addColorStop(0, '#4c0519'); g1.addColorStop(0.5, '#991b1b'); g1.addColorStop(1, '#450a0a');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, band);

      const g2 = ctx.createLinearGradient(0, band, w, band * 2);
      g2.addColorStop(0, '#1e293b'); g2.addColorStop(0.5, '#334155'); g2.addColorStop(1, '#0f172a');
      ctx.fillStyle = g2; ctx.fillRect(0, band, w, band);

      const g3 = ctx.createLinearGradient(0, band * 2, w, h);
      g3.addColorStop(0, '#052e16'); g3.addColorStop(0.5, '#14532d'); g3.addColorStop(1, '#022c22');
      ctx.fillStyle = g3; ctx.fillRect(0, band * 2, w, band + 2);

      // خۆری ٢١ تیشکی درەوشاوە بە خولانەوەی هێواش
      ctx.save();
      ctx.translate(w / 2, h * 0.48);
      ctx.rotate(tick * 0.08);
      const outerR = Math.min(w, h) * 0.22;
      const innerR = outerR * 0.5;
      const sg = ctx.createRadialGradient(0, 0, 4, 0, 0, outerR * 1.4);
      sg.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
      sg.addColorStop(0.6, 'rgba(245, 158, 11, 0.25)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(0, 0, outerR * 1.4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = 'rgba(250, 204, 21, 0.42)';
      ctx.beginPath();
      for (let i = 0; i < 42; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = (i * Math.PI) / 21;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();

    } else {
      const sky = ctx.createRadialGradient(w * 0.5, h * 0.3, 20, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      sky.addColorStop(0, '#3b0764');
      sky.addColorStop(0.45, '#1e1b4b');
      sky.addColorStop(1, '#060312');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
    }

    // ئەستێرە بریسکەدارەکان
    for (const s of stars) {
      s.phase += s.sp;
      const al = 0.25 + 0.65 * Math.abs(Math.sin(s.phase));
      ctx.fillStyle = `rgba(255, 250, 225, ${al.toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // تەنۆلکە زێڕینە سحراوییەکان (Floating Magic Embers)
    for (const e of embers) {
      e.y += e.vy;
      e.ph += 0.025;
      if (e.y < -0.02) { e.y = 1.02; e.x = Math.random(); }
      const ex = (e.x + Math.sin(e.ph) * 0.015) * w;
      const ey = e.y * h;
      const al = 0.25 + 0.45 * Math.sin(e.ph * 1.4);
      ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0.05, al).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(ex, ey, e.r, 0, Math.PI * 2);
      ctx.fill();
    }

    roomBgAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

async function joinVoiceRoom(rId) {
  syncPlayerCoinsListener();
  try {
    localAudioStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
    });
  } catch (e) {
    localAudioStream = null;
  }

  currentVoiceRoomId = rId;
  isMicMuted = !localAudioStream;
  document.body.style.overflow = 'hidden';

  buildFullscreenVipRoomRoot();
  updateMicButtonsUI();

  roomMetaRef = db.ref('voiceRooms/' + rId);
  roomMetaRef.on('value', snap => {
    const info = snap.val();
    if (!info) return;
    currentRoomMeta = info;

    const titleEl = document.getElementById('currentRoomTitle');
    if (titleEl) titleEl.textContent = info.title || 'دیوەخان';

    const th = ROOM_THEMES.find(t => t.id === info.theme) || ROOM_THEMES[0];
    const tagEl = document.getElementById('vipThemeNameTag');
    if (tagEl) tagEl.textContent = info.customBg ? 'وێنەی تایبەت' : th.name;

    const customLayer = document.getElementById('ykVipCustomBgLayer');
    if (customLayer) {
      if (info.customBg) {
        customLayer.style.backgroundImage = `url('${info.customBg}')`;
        customLayer.style.display = 'block';
      } else {
        customLayer.style.display = 'none';
      }
    }

    const lv = getRoomLevelData(info.roomXp || 0);
    const lvBadge = document.getElementById('vipRoomLevelBadge');
    const xpFill = document.getElementById('vipRoomXpFill');
    const xpText = document.getElementById('vipRoomXpText');
    const seatsHint = document.getElementById('vipSeatsUnlockHint');
    const totalGiftsEl = document.getElementById('vipRoomTotalGifts');

    if (lvBadge) lvBadge.textContent = `Lv.${lv.level}`;
    if (xpFill) xpFill.style.width = `${Math.max(8, lv.progressPct)}%`;
    if (xpText) xpText.textContent = `${lv.currentXp}/${lv.nextXp} XP`;
    if (seatsHint) seatsHint.textContent = `🪑 ${lv.unlockedSeats}/8 کورسی`;
    if (totalGiftsEl) totalGiftsEl.textContent = (info.totalGiftCoins || 0).toLocaleString();

    renderRoomSeats(currentRoomMembers);
  });

  const myMemberRef = db.ref(`voiceRooms/${rId}/members/${playerId}`);
  myMemberRef.onDisconnect().remove();
  await myMemberRef.set({
    name: playerName,
    avatar: playerAvatarData || '',
    muted: isMicMuted,
    speaking: false,
    supportCoins: 0,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });

  db.ref(`voiceRooms/${rId}/chat`).push({
    type: 'join',
    name: playerName,
    text: 'هاتە ناو ژوورەکە 👋',
    ts: firebase.database.ServerValue.TIMESTAMP
  });

  if (stayXpInterval) clearInterval(stayXpInterval);
  stayXpInterval = setInterval(() => {
    if (!currentVoiceRoomId) return;
    const count = Object.keys(currentRoomMembers || {}).length || 1;
    db.ref(`voiceRooms/${currentVoiceRoomId}/roomXp`).transaction(cur => (cur || 0) + count * 12);
  }, 30000);

  startLocalVoiceActivityDetector();

  roomSignalsRef = db.ref(`voiceRooms/${rId}/signals/${playerId}`);
  roomSignalsRef.onDisconnect().remove();
  roomSignalsRef.on('child_added', async snap => {
    const sig = snap.val();
    snap.ref.remove();
    if (!sig || !sig.from) return;
    await handleWebRTCSignal(sig.from, sig);
  });

  roomMembersRef = db.ref(`voiceRooms/${rId}/members`);
  roomMembersRef.on('value', snap => {
    currentRoomMembers = snap.val() || {};
    const onlineEl = document.getElementById('vipRoomOnlineCount');
    if (onlineEl) onlineEl.textContent = Object.keys(currentRoomMembers).length;

    renderRoomSeats(currentRoomMembers);

    Object.keys(currentRoomMembers).forEach(peerId => {
      if (peerId !== playerId && !rtcPeers[peerId] && playerId < peerId) {
        initiatePeerConnection(peerId);
      }
    });
    Object.keys(rtcPeers).forEach(peerId => {
      if (!currentRoomMembers[peerId]) {
        rtcPeers[peerId].close();
        delete rtcPeers[peerId];
        delete rtcIceQueues[peerId];
      }
    });
  });

  roomChatRef = db.ref(`voiceRooms/${rId}/chat`);
  roomChatRef.limitToLast(45).on('value', snap => {
    const box = document.getElementById('roomChatMessages');
    if (!box) return;
    const msgs = [];
    snap.forEach(c => msgs.push(c.val()));

    box.innerHTML = msgs.map(m => {
      if (m.type === 'join') {
        return `<div><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-amber-400/25 text-[11px] text-amber-200">
          ✨ <strong>@${escapeRoomHtml(m.name)}</strong> ${escapeRoomHtml(m.text)}
        </span></div>`;
      }
      if (m.type === 'gift') {
        return `<div class="p-2 rounded-2xl bg-gradient-to-l from-amber-500/30 via-rose-600/25 to-black/60 backdrop-blur-md border border-amber-400/50 flex items-center justify-between gap-2">
          <div class="leading-tight">
            <div class="text-[11px] font-black text-amber-300">${escapeRoomHtml(m.senderName)} ➔ <span class="text-white">@${escapeRoomHtml(m.targetName)}</span></div>
            <div class="text-[10px] text-amber-100">${escapeRoomHtml(m.giftName)} (+${m.coins} 🪙)</div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <span class="text-2xl">${m.giftIcon}</span>
            <span class="text-sm font-black text-yellow-300">x${m.qty}</span>
          </div>
        </div>`;
      }
      return `<div><span class="inline-block px-2.5 py-1 rounded-2xl bg-black/45 backdrop-blur-sm border border-white/10 leading-snug">
        <span class="px-1.5 py-0.2 rounded bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-[9px] ml-1">VIP</span>
        <span class="font-black text-amber-300">${escapeRoomHtml(m.name)}:</span>
        <span class="text-white">${escapeRoomHtml(m.text)}</span>
      </span></div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  });

  roomGiftsFxRef = db.ref(`voiceRooms/${rId}/liveGifts`);
  roomGiftsFxRef.limitToLast(1).on('child_added', snap => {
    const g = snap.val();
    if (!g || (Date.now() - (g.ts || 0) > 8000)) return;
    triggerFullScreenGiftAnimation(g);
  });
}

function renderRoomSeats(members) {
  const grid = document.getElementById('roomSeatsGrid');
  if (!grid) return;

  const lv = getRoomLevelData((currentRoomMeta && currentRoomMeta.roomXp) || 0);
  const unlocked = lv.unlockedSeats;
  const entries = Object.entries(members || {});
  const hostId = currentRoomMeta && currentRoomMeta.hostId;
  entries.sort((a, b) => (a[0] === hostId ? -1 : b[0] === hostId ? 1 : 0));

  if (hostId && members[hostId]) {
    const hostAv = document.getElementById('vipHostAvatarBox');
    if (hostAv && members[hostId].avatar) {
      hostAv.innerHTML = `<img src="${members[hostId].avatar}" class="w-full h-full object-cover" />`;
    }
  }

  let html = '';
  for (let i = 0; i < 8; i++) {
    const isLocked = i >= unlocked;
    const occupant = entries[i];

    if (occupant) {
      const [uid, m] = occupant;
      const isHost = (uid === hostId);
      const isSpeaking = m.speaking && !m.muted;
      const support = m.supportCoins || 0;
      const ringClass = isSpeaking ? 'yk-vip-ring-speak' : (isHost ? 'yk-vip-ring-host' : 'bg-white/25');

      html += `
        <div onclick="selectGiftRecipientAndOpen('${uid}')"
          class="cursor-pointer relative rounded-2xl p-1.5 bg-black/40 backdrop-blur-md border ${isHost ? 'border-amber-400/70' : 'border-white/15'} flex flex-col items-center text-center gap-1 transition active:scale-95">
          <div class="w-full flex items-center justify-between text-[9px] font-black px-0.5">
            <span class="px-1.5 rounded-full bg-rose-500/35 text-amber-200">🪙${support}</span>
            <span class="text-amber-300">${isHost ? '👑' : `#${i + 1}`}</span>
          </div>

          <div class="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
            ${isSpeaking ? '<div class="yk-speak-ripple"></div>' : ''}
            <div class="absolute inset-0 rounded-full p-[2.5px] ${ringClass}"></div>
            <div class="relative w-[43px] h-[43px] sm:w-[51px] sm:h-[51px] rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-sm font-black text-white border border-black">
              ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover" />` : escapeRoomHtml((m.name || 'ی')[0])}
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${m.muted ? 'bg-rose-600' : 'bg-emerald-500'} border border-black flex items-center justify-center text-[8px]">
              ${m.muted ? '🔇' : '🎙️'}
            </span>
          </div>

          <div class="text-[10px] font-black text-white truncate w-full leading-tight">${escapeRoomHtml(m.name)}</div>
          <span class="px-2 py-0.2 rounded-full bg-gradient-to-r from-purple-600/80 to-pink-600/80 border border-white/20 text-[9px] font-black text-white">
            Support
          </span>
        </div>
      `;
    } else if (!isLocked) {
      html += `
        <div class="rounded-2xl p-1.5 bg-black/30 backdrop-blur-sm border border-dashed border-amber-300/35 flex flex-col items-center justify-center text-center gap-1 min-h-[106px]">
          <div class="w-10 h-10 rounded-full bg-white/5 border border-amber-300/30 flex items-center justify-center text-amber-300/90 text-base">
            🪑
          </div>
          <div class="text-[10px] font-bold text-amber-100">کورسی #${i + 1}</div>
          <span class="text-[9px] text-emerald-300 font-black">کراوەیە</span>
        </div>
      `;
    } else {
      const reqLv = i === 5 ? 2 : (i === 6 ? 3 : 5);
      html += `
        <div onclick="alert('ئەم کورسییە لە لیڤڵی ${reqLv}ی ژوور دەکرێتەوە! بە مانەوە لە ژوورەکە یان ناردنی دیاری لیڤڵەکە بەرز بکەرەوە.')"
          class="cursor-pointer rounded-2xl p-1.5 bg-black/50 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center text-center gap-1 min-h-[106px] opacity-80">
          <div class="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-slate-400 text-base">
            🔒
          </div>
          <div class="text-[10px] font-black text-slate-300">کورسی #${i + 1}</div>
          <span class="px-2 rounded-full bg-amber-500/25 text-amber-300 text-[9px] font-black">Lv.${reqLv}</span>
        </div>
      `;
    }
  }
  grid.innerHTML = html;
}

function sendFloatingHeart() {
  const layer = document.getElementById('ykHeartsLayer');
  if (!layer) return;
  const icons = ['❤️', '💛', '✨', '👑', '🔥', '💖'];
  const el = document.createElement('div');
  el.textContent = icons[Math.floor(Math.random() * icons.length)];
  el.style.cssText = `position:absolute; left:${18 + Math.random() * 64}%; bottom:72px; font-size:${22 + Math.random() * 14}px; animation: ykFloatHeart 1.8s ease-out forwards; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.6));`;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1850);
}

function selectGiftRecipientAndOpen(uid) {
  selectedGiftRecipient = uid;
  openGiftDrawerModal();
}

function openGiftDrawerModal() {
  const modal = document.getElementById('ykGiftDrawerModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderGiftRecipientsRow();
  renderGiftsCatalogGrid();
}

function closeGiftDrawerModal() {
  const modal = document.getElementById('ykGiftDrawerModal');
  if (modal) modal.classList.add('hidden');
}

function setGiftCategory(cat, btn) {
  selectedGiftCat = cat;
  document.querySelectorAll('.yk-gcat-btn').forEach(b => {
    b.className = 'yk-gcat-btn text-slate-400 pb-0.5';
  });
  if (btn) btn.className = 'yk-gcat-btn text-amber-300 border-b-2 border-amber-300 pb-0.5';
  renderGiftsCatalogGrid();
}

function renderGiftRecipientsRow() {
  const row = document.getElementById('ykGiftRecipientsRow');
  if (!row) return;
  const members = Object.entries(currentRoomMembers || {});
  let html = `
    <button onclick="setGiftRecipient('ALL')"
      class="px-3 py-1 rounded-full text-[11px] font-black shrink-0 border ${selectedGiftRecipient === 'ALL' ? 'bg-amber-400 text-[#1a0d06] border-yellow-200' : 'bg-white/10 text-white border-white/15'}">
      All (هەمووان)
    </button>
  `;
  members.forEach(([uid, m], idx) => {
    const active = selectedGiftRecipient === uid;
    html += `
      <button onclick="setGiftRecipient('${uid}')"
        class="flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-[11px] font-black shrink-0 border ${active ? 'bg-rose-600 text-white border-yellow-300' : 'bg-white/10 text-slate-200 border-white/15'}">
        <span class="w-5 h-5 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-[9px]">
          ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover"/>` : escapeRoomHtml((m.name || 'ی')[0])}
        </span>
        <span class="max-w-[64px] truncate">${escapeRoomHtml(m.name)}</span>
        <span class="text-[9px] opacity-75">#${idx + 1}</span>
      </button>
    `;
  });
  row.innerHTML = html;
}

function setGiftRecipient(uid) {
  selectedGiftRecipient = uid;
  renderGiftRecipientsRow();
}

function setGiftQty(q, btn) {
  selectedGiftQty = q;
  document.querySelectorAll('.yk-qty-btn').forEach(b => {
    b.className = 'yk-qty-btn px-2 py-1 rounded-full text-white';
  });
  if (btn) btn.className = 'yk-qty-btn px-2 py-1 rounded-full bg-amber-400 text-[#1a0d06]';
  updateSelectedGiftCostHint();
}

function selectGiftItem(giftId) {
  selectedGiftId = giftId;
  renderGiftsCatalogGrid();
}

function renderGiftsCatalogGrid() {
  const grid = document.getElementById('ykGiftsGrid');
  if (!grid) return;
  const list = selectedGiftCat === 'all'
    ? ROYAL_GIFTS_CATALOG
    : ROYAL_GIFTS_CATALOG.filter(g => g.cat === selectedGiftCat);

  grid.innerHTML = list.map(g => {
    const isSel = g.id === selectedGiftId;
    const isBig = g.tier === 'legendary' || g.tier === 'mythic' || g.tier === 'epic';
    return `
      <div onclick="selectGiftItem('${g.id}')"
        class="cursor-pointer rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-0.5 border transition ${isSel ? 'bg-amber-400/25 border-yellow-300 shadow-[0_0_14px_rgba(250,204,21,0.5)]' : 'bg-white/5 border-white/10'}">
        <div class="w-full flex justify-end text-[8px]">
          ${isBig ? '<span class="px-1 rounded bg-rose-600 text-white font-black">3D</span>' : '<span class="opacity-0">.</span>'}
        </div>
        <div class="text-2xl">${g.icon}</div>
        <div class="text-[10px] font-black text-white truncate w-full">${g.name}</div>
        <div class="text-[10px] font-black text-yellow-300">🪙 ${g.cost.toLocaleString()}</div>
      </div>
    `;
  }).join('');
  updateSelectedGiftCostHint();
}

function updateSelectedGiftCostHint() {
  const hint = document.getElementById('ykSelectedGiftCostHint');
  const gift = ROYAL_GIFTS_CATALOG.find(g => g.id === selectedGiftId) || ROYAL_GIFTS_CATALOG[0];
  if (hint && gift) {
    hint.textContent = `کۆی گشتی: 🪙 ${(gift.cost * selectedGiftQty).toLocaleString()}`;
  }
}

function sendSelectedRoyalGift() {
  if (!currentVoiceRoomId) return;
  const gift = ROYAL_GIFTS_CATALOG.find(g => g.id === selectedGiftId) || ROYAL_GIFTS_CATALOG[0];
  const qty = selectedGiftQty || 1;
  const totalCost = gift.cost * qty;

  if (myUserCoins < totalCost) {
    if (confirm(`سکەکانت بەش ناکەن! (پێویستت بە ${totalCost.toLocaleString()} سکەیە).\nدەتەوێت ئێستا سکە بکڕیت؟`)) {
      openCoinStoreModal();
    }
    return;
  }

  myUserCoins -= totalCost;
  updateRoomCoinDisplays();
  if (db && playerId) db.ref(`players/${playerId}/coins`).set(myUserCoins);

  let targetName = 'هەموو دیوەخان';
  if (selectedGiftRecipient !== 'ALL' && currentRoomMembers[selectedGiftRecipient]) {
    targetName = currentRoomMembers[selectedGiftRecipient].name;
    db.ref(`voiceRooms/${currentVoiceRoomId}/members/${selectedGiftRecipient}/supportCoins`).transaction(c => (c || 0) + totalCost);
  } else {
    const hId = currentRoomMeta && currentRoomMeta.hostId;
    if (hId && currentRoomMembers[hId]) {
      db.ref(`voiceRooms/${currentVoiceRoomId}/members/${hId}/supportCoins`).transaction(c => (c || 0) + totalCost);
    }
  }

  db.ref(`voiceRooms/${currentVoiceRoomId}/roomXp`).transaction(cur => (cur || 0) + gift.xp * qty);
  db.ref(`voiceRooms/${currentVoiceRoomId}/totalGiftCoins`).transaction(cur => (cur || 0) + totalCost);

  const giftPayload = {
    type: 'gift',
    senderId: playerId,
    senderName: playerName,
    senderAvatar: playerAvatarData || '',
    targetName,
    giftId: gift.id,
    giftName: gift.name,
    giftIcon: gift.icon,
    tier: gift.tier,
    qty,
    coins: totalCost,
    ts: Date.now()
  };

  db.ref(`voiceRooms/${currentVoiceRoomId}/chat`).push(giftPayload);
  db.ref(`voiceRooms/${currentVoiceRoomId}/liveGifts`).push(giftPayload);

  closeGiftDrawerModal();
  showComboButton(gift.id, qty);
}

function showComboButton(giftId, qty) {
  const btn = document.getElementById('ykGiftComboBtn');
  const txt = document.getElementById('ykComboCountText');
  if (!btn || !txt) return;
  if (lastSentGiftCombo && lastSentGiftCombo.giftId === giftId) lastSentGiftCombo.streak += qty;
  else lastSentGiftCombo = { giftId, streak: qty };
  txt.textContent = `x${lastSentGiftCombo.streak}`;
  btn.classList.remove('hidden');
  if (comboTimer) clearTimeout(comboTimer);
  comboTimer = setTimeout(() => {
    btn.classList.add('hidden');
    lastSentGiftCombo = null;
  }, 4500);
}

function triggerComboRepeat() {
  if (!lastSentGiftCombo) return;
  selectedGiftId = lastSentGiftCombo.giftId;
  selectedGiftQty = 1;
  sendSelectedRoyalGift();
}

function triggerFullScreenGiftAnimation(g) {
  const bannerBox = document.getElementById('ykFloatingGiftBannerBox');
  if (bannerBox) {
    bannerBox.innerHTML = `
      <div style="animation: ykGiftSlideIn 0.35s ease-out;"
        class="inline-flex items-center gap-2 pl-3.5 pr-1 py-1 rounded-full bg-gradient-to-l from-amber-500 via-orange-500 to-rose-600 border-2 border-yellow-200 shadow-[0_6px_22px_rgba(245,158,11,0.8)]">
        <div class="w-7 h-7 rounded-full bg-black/40 overflow-hidden flex items-center justify-center text-xs font-black text-white border border-white">
          ${g.senderAvatar ? `<img src="${g.senderAvatar}" class="w-full h-full object-cover"/>` : escapeRoomHtml((g.senderName || 'ی')[0])}
        </div>
        <div class="text-right leading-tight">
          <div class="text-[10px] font-black text-white">${escapeRoomHtml(g.senderName)}</div>
          <div class="text-[9px] font-bold text-yellow-100">Send to @${escapeRoomHtml(g.targetName)}</div>
        </div>
        <span class="text-2xl drop-shadow">${g.giftIcon}</span>
        <span class="text-base font-black text-yellow-200 italic">x${g.qty}</span>
      </div>
    `;
  }

  for (let i = 0; i < 6; i++) setTimeout(sendFloatingHeart, i * 110);

  const overlay = document.getElementById('ykFullGiftOverlay');
  if (!overlay) return;
  const isGrand = g.tier === 'legendary' || g.tier === 'mythic' || g.tier === 'epic';
  if (!isGrand) return;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  overlay.innerHTML = `
    <div style="animation: ykGrandGiftPop 0.65s cubic-bezier(0.22,1,0.36,1) forwards;" class="relative flex flex-col items-center justify-center text-center p-6">
      <div class="absolute w-72 h-72 rounded-full bg-amber-400/35 blur-3xl"></div>
      <div class="text-[110px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] relative z-10">${g.giftIcon}</div>
      <div class="mt-2 px-6 py-2 rounded-full bg-black/85 border-2 border-yellow-300 shadow-2xl relative z-10">
        <div class="text-base font-black gold-text">${escapeRoomHtml(g.giftName)} x${g.qty}</div>
        <div class="text-xs font-bold text-white">${escapeRoomHtml(g.senderName)} ➔ @${escapeRoomHtml(g.targetName)}</div>
      </div>
    </div>
  `;
  if (typeof playChessSound === 'function') playChessSound('end');
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    overlay.innerHTML = '';
  }, 3200);
}

function openThemePickerModal() {
  const m = document.getElementById('ykThemePickerModal');
  if (m) m.classList.remove('hidden');
}

function closeThemePickerModal() {
  const m = document.getElementById('ykThemePickerModal');
  if (m) m.classList.add('hidden');
}

function changeCurrentRoomTheme(themeId) {
  if (!currentVoiceRoomId) return;
  db.ref(`voiceRooms/${currentVoiceRoomId}`).update({ theme: themeId, customBg: '' });
  closeThemePickerModal();
}

function uploadCustomRoomBg(inputEl) {
  const file = inputEl.files && inputEl.files[0];
  if (!file || !currentVoiceRoomId) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const cvs = document.createElement('canvas');
      const maxW = 720, maxH = 1280;
      let tw = img.width, th = img.height;
      const ratio = Math.min(maxW / tw, maxH / th, 1);
      tw = Math.round(tw * ratio);
      th = Math.round(th * ratio);
      cvs.width = tw; cvs.height = th;
      cvs.getContext('2d').drawImage(img, 0, 0, tw, th);
      const dataUrl = cvs.toDataURL('image/jpeg', 0.68);
      db.ref(`voiceRooms/${currentVoiceRoomId}`).update({ customBg: dataUrl });
      closeThemePickerModal();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function startLocalVoiceActivityDetector() {
  if (voiceAnalyserInterval) clearInterval(voiceAnalyserInterval);
  if (!localAudioStream) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const src = ctx.createMediaStreamSource(localAudioStream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let lastSpeaking = false;

    voiceAnalyserInterval = setInterval(() => {
      if (!currentVoiceRoomId || isMicMuted) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      const speaking = avg > 16;
      if (speaking !== lastSpeaking) {
        lastSpeaking = speaking;
        db.ref(`voiceRooms/${currentVoiceRoomId}/members/${playerId}/speaking`).set(speaking);
      }
    }, 220);
  } catch (e) {}
}

async function initiatePeerConnection(peerId) {
  const pc = createPeerConnection(peerId);
  const offer = await pc.createOffer({ offerToReceiveAudio: true });
  await pc.setLocalDescription(offer);
  db.ref(`voiceRooms/${currentVoiceRoomId}/signals/${peerId}`).push({
    from: playerId,
    type: 'offer',
    sdp: offer.sdp
  });
}

function createPeerConnection(peerId) {
  const pc = new RTCPeerConnection(rtcConfig);
  rtcPeers[peerId] = pc;
  rtcIceQueues[peerId] = [];

  if (localAudioStream) {
    localAudioStream.getTracks().forEach(t => pc.addTrack(t, localAudioStream));
  } else if (pc.addTransceiver) {
    pc.addTransceiver('audio', { direction: 'recvonly' });
  }

  pc.onicecandidate = e => {
    if (e.candidate && currentVoiceRoomId) {
      db.ref(`voiceRooms/${currentVoiceRoomId}/signals/${peerId}`).push({
        from: playerId,
        type: 'ice',
        candidate: e.candidate.toJSON()
      });
    }
  };

  pc.ontrack = e => {
    let audio = document.getElementById('audio_' + peerId);
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'audio_' + peerId;
      audio.autoplay = true;
      audio.playsInline = true;
      audio.setAttribute('playsinline', 'true');
      audio.volume = 1.0;
      const box = document.getElementById('remoteAudiosContainer') || document.body;
      box.appendChild(audio);
    }
    audio.srcObject = e.streams[0];
    audio.muted = isSpeakerMuted;
    audio.play().catch(() => {});
  };
  return pc;
}

async function flushQueuedIce(peerId, pc) {
  const q = rtcIceQueues[peerId] || [];
  rtcIceQueues[peerId] = [];
  for (const cand of q) {
    try { await pc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
  }
}

async function handleWebRTCSignal(peerId, sig) {
  let pc = rtcPeers[peerId] || createPeerConnection(peerId);
  try {
    if (sig.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: sig.sdp }));
      await flushQueuedIce(peerId, pc);
      const ans = await pc.createAnswer();
      await pc.setLocalDescription(ans);
      db.ref(`voiceRooms/${currentVoiceRoomId}/signals/${peerId}`).push({
        from: playerId,
        type: 'answer',
        sdp: ans.sdp
      });
    } else if (sig.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sig.sdp }));
      await flushQueuedIce(peerId, pc);
    } else if (sig.type === 'ice' && sig.candidate) {
      if (pc.remoteDescription && pc.remoteDescription.type) {
        await pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
      } else {
        if (!rtcIceQueues[peerId]) rtcIceQueues[peerId] = [];
        rtcIceQueues[peerId].push(sig.candidate);
      }
    }
  } catch (e) {}
}

async function toggleRoomMicrophone() {
  if (!localAudioStream) {
    try {
      localAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      isMicMuted = false;
      Object.entries(rtcPeers).forEach(([pid, pc]) => {
        localAudioStream.getTracks().forEach(t => pc.addTrack(t, localAudioStream));
        initiatePeerConnection(pid);
      });
      startLocalVoiceActivityDetector();
    } catch (e) {
      alert('تکایە ڕێگە بە مایکرۆفۆن بدە لە براوزەرەکەتدا!');
      return;
    }
  } else {
    isMicMuted = !isMicMuted;
    localAudioStream.getAudioTracks().forEach(t => (t.enabled = !isMicMuted));
  }

  if (currentVoiceRoomId) {
    db.ref(`voiceRooms/${currentVoiceRoomId}/members/${playerId}`).update({
      muted: isMicMuted,
      speaking: false
    });
  }
  updateMicButtonsUI();
}

function toggleRoomSpeaker() {
  isSpeakerMuted = !isSpeakerMuted;
  document.querySelectorAll('#remoteAudiosContainer audio').forEach(a => {
    a.muted = isSpeakerMuted;
    if (!isSpeakerMuted && a.paused && a.srcObject) a.play().catch(() => {});
  });
  const btn = document.getElementById('roomSpeakerToggleBtn');
  if (btn) btn.textContent = isSpeakerMuted ? '🔇' : '🔊';
}

function updateMicButtonsUI() {
  const btn = document.getElementById('roomMicToggleBtn');
  if (!btn) return;
  if (isMicMuted || !localAudioStream) {
    btn.textContent = '🔇';
    btn.className = 'w-10 h-10 rounded-full bg-rose-600 text-white font-black flex items-center justify-center text-lg shadow-lg shrink-0 transition';
  } else {
    btn.textContent = '🎙️';
    btn.className = 'w-10 h-10 rounded-full bg-emerald-500 text-[#050b18] font-black flex items-center justify-center text-lg shadow-lg shrink-0 transition';
  }
}

function sendRoomChatMessage() {
  const inp = document.getElementById('roomChatInput');
  const txt = (inp && inp.value.trim()) || '';
  if (!txt || !currentVoiceRoomId) return;
  inp.value = '';
  db.ref(`voiceRooms/${currentVoiceRoomId}/chat`).push({
    type: 'msg',
    name: playerName,
    text: txt,
    ts: firebase.database.ServerValue.TIMESTAMP
  });
}

function leaveVoiceRoom() {
  if (roomBgAnimFrame) { cancelAnimationFrame(roomBgAnimFrame); roomBgAnimFrame = null; }
  if (voiceAnalyserInterval) { clearInterval(voiceAnalyserInterval); voiceAnalyserInterval = null; }
  if (stayXpInterval) { clearInterval(stayXpInterval); stayXpInterval = null; }
  if (roomMetaRef) { roomMetaRef.off(); roomMetaRef = null; }
  if (roomMembersRef) { roomMembersRef.off(); roomMembersRef = null; }
  if (roomSignalsRef) { roomSignalsRef.off(); roomSignalsRef = null; }
  if (roomChatRef) { roomChatRef.off(); roomChatRef = null; }
  if (roomGiftsFxRef) { roomGiftsFxRef.off(); roomGiftsFxRef = null; }

  Object.values(rtcPeers).forEach(pc => pc.close());
  rtcPeers = {};
  rtcIceQueues = {};

  if (localAudioStream) {
    localAudioStream.getTracks().forEach(t => t.stop());
    localAudioStream = null;
  }

  if (currentVoiceRoomId) {
    const rId = currentVoiceRoomId;
    currentVoiceRoomId = null;
    db.ref(`voiceRooms/${rId}/members/${playerId}`).remove().then(() => {
      db.ref(`voiceRooms/${rId}/members`).once('value', s => {
        if (!s.exists()) db.ref(`voiceRooms/${rId}`).remove();
      });
    });
  }

  const root = document.getElementById('ykVipRoomRoot');
  if (root) root.remove();
  document.body.style.overflow = '';
}

function escapeRoomHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

let localVoiceStream = null;
let voicePeers = {};
let activeVoiceChannel = null;

async function toggleLiveVoiceMic(roomId = 'global-voice-room', btnId = 'ludoMicBtn', avatarId = 'ludoMyAvatar') {
  const btn = document.getElementById(btnId);
  const statusEl = document.getElementById('ludoVoiceStatus');
  const avatarEl = document.getElementById(avatarId);

  if (localVoiceStream) {
    stopLiveVoiceMic();
    if (btn) { btn.classList.remove('bg-emerald-600', 'mic-speaking-ring'); btn.classList.add('bg-slate-700'); }
    if (avatarEl) avatarEl.classList.remove('mic-speaking-ring');
    if (statusEl) statusEl.textContent = '🔇 مایک داخراوە';
    return;
  }

  try {
    localVoiceStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    activeVoiceChannel = roomId;
    if (btn) { btn.classList.remove('bg-slate-700'); btn.classList.add('bg-emerald-600', 'mic-speaking-ring'); }
    if (avatarEl) avatarEl.classList.add('mic-speaking-ring');
    if (statusEl) statusEl.textContent = '🎙️ مایک کراوەیە (دەنگت دەڕوات)';

    if (typeof db !== 'undefined' && typeof playerId !== 'undefined') {
      const roomRef = db.ref(`webrtc_voice/${roomId}`);
      const myMemberRef = roomRef.child(`members/${playerId}`);
      myMemberRef.set({ name: playerName || 'User', online: true });
      myMemberRef.onDisconnect().remove();

      roomRef.child('members').on('child_added', async (snap) => {
        const peerId = snap.key;
        if (peerId === playerId || voicePeers[peerId]) return;
        const pc = createVoicePeerConnection(roomId, peerId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        roomRef.child(`signals/${peerId}/${playerId}`).set({ type: 'offer', sdp: offer.sdp });
      });

      roomRef.child(`signals/${playerId}`).on('child_added', async (snap) => {
        const senderId = snap.key;
        const data = snap.val();
        if (!data) return;
        if (data.type === 'offer') {
          const pc = createVoicePeerConnection(roomId, senderId);
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: data.sdp }));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          roomRef.child(`signals/${senderId}/${playerId}`).set({ type: 'answer', sdp: answer.sdp });
        } else if (data.type === 'answer' && voicePeers[senderId]) {
          await voicePeers[senderId].setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: data.sdp }));
        } else if (data.candidate && voicePeers[senderId]) {
          await voicePeers[senderId].addIceCandidate(new RTCIceCandidate(data.candidate));
        }
        snap.ref.remove();
      });
    }
  } catch (err) {
    alert('تکایە ڕێگە بە مایکرۆفۆن بدە لە براوزەرەکەتدا تا دەنگت بڕوات.');
  }
}

function createVoicePeerConnection(roomId, peerId) {
  const pc = new RTCPeerConnection(rtcConfig);
  voicePeers[peerId] = pc;
  if (localVoiceStream) {
    localVoiceStream.getTracks().forEach(track => pc.addTrack(track, localVoiceStream));
  }
  pc.onicecandidate = (e) => {
    if (e.candidate && typeof db !== 'undefined') {
      db.ref(`webrtc_voice/${roomId}/signals/${peerId}/${playerId}`).push({ candidate: e.candidate.toJSON() });
    }
  };
  pc.ontrack = (e) => {
    let audio = document.getElementById('remote-audio-' + peerId);
    if (!audio) {
      audio = document.createElement('audio');
      audio.id = 'remote-audio-' + peerId;
      audio.autoplay = true;
      audio.playsInline = true;
      audio.setAttribute('playsinline', 'true');
      document.body.appendChild(audio);
    }
    audio.srcObject = e.streams[0];
    audio.play().catch(() => {});
  };
  return pc;
}

function stopLiveVoiceMic() {
  if (localVoiceStream) {
    localVoiceStream.getTracks().forEach(t => t.stop());
    localVoiceStream = null;
  }
  Object.values(voicePeers).forEach(pc => pc.close());
  voicePeers = {};
  if (activeVoiceChannel && typeof db !== 'undefined' && typeof playerId !== 'undefined') {
    db.ref(`webrtc_voice/${activeVoiceChannel}/members/${playerId}`).remove();
  }
  activeVoiceChannel = null;
}

function loadLeaderboard(gameKey) {
  document.querySelectorAll('.lb-tab').forEach(btn => {
    btn.classList.remove('bg-yellow-500', 'text-[#050b18]');
    btn.classList.add('text-slate-300');
  });
  const tabBtn = document.getElementById('lb-tab-' + gameKey);
  if (tabBtn) tabBtn.classList.add('bg-yellow-500', 'text-[#050b18]');
  const listEl = document.getElementById('leaderboardList');
  if (!listEl) return;

  db.ref('players').once('value', snap => {
    const players = [];
    snap.forEach(child => {
      const d = child.val();
      const score = gameKey === 'overall'
        ? Math.round((((d.elo && d.elo.chess) || 1200) + ((d.elo && d.elo.domino) || 1200)) / 2)
        : (d.elo && d.elo[gameKey]) || 1200;
      players.push({ id: child.key, name: d.name || 'یاریزان', avatar: d.avatar || '', score });
    });
    players.sort((a, b) => b.score - a.score);
    listEl.innerHTML = players.slice(0, 20).map((p, idx) => `
      <div class="px-5 py-3.5 flex items-center justify-between ${p.id === playerId ? 'bg-yellow-500/10' : ''}">
        <div class="flex items-center gap-3">
          <span class="font-extrabold text-yellow-400 w-6">#${idx + 1}</span>
          ${getAvatarBadgeHTML(p.avatar, p.name, 'w-9 h-9')}
          <span class="text-white font-bold text-sm">${p.name}</span>
        </div>
        <span class="gold-text font-extrabold text-base">${p.score}</span>
      </div>
    `).join('');
  });
}

function calculateAndSaveElo(gameKey, opponentElo, resultScore) {
  const oldElo = playerProfile.elo[gameKey] || 1200;
  const expected = 1 / (1 + Math.pow(10, (opponentElo - oldElo) / 400));
  const delta = Math.round(32 * (resultScore - expected));
  const newElo = Math.max(400, oldElo + delta);
  playerProfile.elo[gameKey] = newElo;
  playerProfile.games[gameKey] = (playerProfile.games[gameKey] || 0) + 1;
  if (resultScore === 1) playerProfile.wins[gameKey] = (playerProfile.wins[gameKey] || 0) + 1;
  db.ref('players/' + playerId).update({
    elo: playerProfile.elo,
    wins: playerProfile.wins,
    games: playerProfile.games
  });
  updateProfileUI();
  awardGameXp(resultScore === 1 ? 'win' : (resultScore === 0.5 ? 'draw' : 'loss'));
  return { oldElo, newElo, delta };
}