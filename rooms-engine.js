// ============================================================================
// YARI KURDI - ROYAL VIP VOICE ROOMS, PK GIFTS & COIN STORE ENGINE
// ============================================================================

const ROOM_THEMES = [
  {
    id: 'sherwana',
    name: 'قەڵای شێروانە',
    css: 'radial-gradient(circle at 50% 18%, rgba(245, 158, 11, 0.32) 0%, transparent 55%), linear-gradient(180deg, #2b1409 0%, #140804 52%, #090302 100%)',
    accent: '#facc15'
  },
  {
    id: 'cosmos',
    name: 'ئاسمانی گەردوونی',
    css: 'radial-gradient(circle at 25% 20%, rgba(139, 92, 246, 0.35) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(14, 165, 233, 0.28) 0%, transparent 50%), linear-gradient(180deg, #0f0c29 0%, #1a103c 50%, #070514 100%)',
    accent: '#38bdf8'
  },
  {
    id: 'kurdistan',
    name: 'ئاڵای کوردستان',
    css: 'linear-gradient(180deg, rgba(185, 28, 28, 0.42) 0%, rgba(255, 255, 255, 0.14) 38%, rgba(21, 128, 61, 0.42) 72%, #090d0a 100%)',
    accent: '#fde047'
  },
  {
    id: 'ruby_palace',
    name: 'کۆشکی یاقووت',
    css: 'radial-gradient(circle at 50% 25%, rgba(225, 29, 72, 0.38) 0%, transparent 58%), linear-gradient(180deg, #2e0914 0%, #17040a 60%, #0a0204 100%)',
    accent: '#fb7185'
  },
  {
    id: 'emerald_diwan',
    name: 'دیوەخانی زمڕود',
    css: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 55%), linear-gradient(180deg, #062c22 0%, #041a14 55%, #020d0a 100%)',
    accent: '#34d399'
  },
  {
    id: 'teahouse',
    name: 'چایخانەی فۆلکلۆر',
    css: 'radial-gradient(circle at 50% 15%, rgba(217, 119, 6, 0.28) 0%, transparent 50%), repeating-linear-gradient(90deg, #261308 0px, #2f180b 28px, #1f0f06 30px)',
    accent: '#fbbf24'
  }
];

const ROYAL_GIFTS_CATALOG = [
  { id: 'tea', name: 'ئیستکانە چا', icon: '🫖', cost: 5, xp: 10, tier: 'normal', desc: 'چای گەرمی چایخانەی کوردی' },
  { id: 'rose', name: 'گوڵی سوور', icon: '🌹', cost: 15, xp: 25, tier: 'normal', desc: 'دیارییەکی ناسک بۆ هاوڕێیان' },
  { id: 'scroll', name: 'فەرمانی شاهانە', icon: '📜', cost: 40, xp: 60, tier: 'normal', desc: 'ڕێزلێنانی تایبەتی دیوەخان' },
  { id: 'lovebox', name: 'سندوقی دڵ', icon: '💝', cost: 99, xp: 140, tier: 'rare', desc: 'دیارییەکی پڕ لە خۆشەویستی' },
  { id: 'sports_car', name: 'ئۆتۆمبێلی لوکس', icon: '🏎️', cost: 499, xp: 700, tier: 'epic', desc: 'دەرکەوتنی شاهانە لەسەر شاشە' },
  { id: 'knight', name: 'سوارچاکی زێڕین', icon: '⚔️', cost: 999, xp: 1500, tier: 'legendary', desc: 'ئەنیمەیشنی شەڕی سوارچاکان!' },
  { id: 'whale', name: 'نەهەنگی گەردوونی', icon: '🐋', cost: 1999, xp: 3000, tier: 'legendary', desc: 'نەهەنگی شینی ئاسمانی بە شەپۆلەوە!' },
  { id: 'eagle', name: 'هەڵۆی پاشا', icon: '🦅', cost: 4999, xp: 7500, tier: 'mythic', desc: 'بەرزترین شکۆی دیوەخانی کوردی!' }
];

const COIN_STORE_PACKAGES = [
  { id: 'pkg_100', coins: 100, bonus: 10, priceIQD: '1,500 دینار', badge: 'سەرەتایی' },
  { id: 'pkg_550', coins: 550, bonus: 75, priceIQD: '7,500 دینار', badge: 'باوترین 🔥' },
  { id: 'pkg_1500', coins: 1500, bonus: 300, priceIQD: '18,000 دینار', badge: 'VIP 👑' },
  { id: 'pkg_5000', coins: 5000, bonus: 1200, priceIQD: '50,000 دینار', badge: 'پاشای دیوەخان 💎' }
];

// هەژمارکردنی لیڤڵی ژوور و ژمارەی کورسییە کراوەکان (سەرەتا ٥ کورسی، بە مانەوە و دیاری زیاد دەکات)
function getRoomLevelData(roomXp = 0) {
  const xp = Math.max(0, Number(roomXp) || 0);
  let level = 1;
  let threshold = 100; // یەکەم لیڤڵ ١٠٠ خاڵ (٥ خولەک مانەوە یان دیارییەک)
  let rem = xp;

  while (rem >= threshold && level < 50) {
    rem -= threshold;
    level++;
    threshold = Math.round(threshold * 1.45);
  }

  // سەرەتا ٥ کورسی کراوەیە، بە بەرزبوونەوەی لیڤڵ تا ٨ کورسی دەکرێتەوە
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
let roomMetaRef = null;
let roomMembersRef = null;
let roomSignalsRef = null;
let roomChatRef = null;
let roomGiftsFxRef = null;
let voiceAnalyserInterval = null;
let stayXpInterval = null;

// دۆخی پانێڵی دیاری و فرۆشگای سکە
let selectedGiftRecipient = 'ALL'; // 'ALL' یان uid ی کەسێک
let selectedGiftId = 'tea';
let selectedGiftQty = 1;
let lastSentGiftCombo = null;
let comboTimer = null;
let myUserCoins = 250; // سکەی سەرەتایی دیاری بۆ هەر ئەکاونتێکی نوێ

const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

// بارکردن و هاوکاتکردنی سکەکانی یاریزان لە Firebase
function syncPlayerCoinsListener() {
  if (typeof db === 'undefined' || typeof playerId === 'undefined' || !playerId) return;
  db.ref(`players/${playerId}/coins`).on('value', snap => {
    if (snap.exists()) {
      myUserCoins = Number(snap.val()) || 0;
    } else {
      // پێدانی ٢٥٠ سکەی بەخێرهاتن ئەگەر یەکەمجاری بێت
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

// ==================== ١. لیستی ژوورەکانی دیوەخان (LOBBY) ====================
function loadActiveVoiceRooms() {
  syncPlayerCoinsListener();
  const lobby = document.getElementById('roomsLobbyPanel');
  if (!lobby) return;

  lobby.innerHTML = `
    <div class="royal-card rounded-3xl p-5 sm:p-6 space-y-4 border border-amber-400/40">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <h2 class="text-xl sm:text-2xl font-black gold-text">🎙️ دیوەخان و ژوورە زیندووەکان</h2>
            <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-black">
              🪙 <span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span>
            </span>
          </div>
          <p class="text-xs text-amber-100/80 mt-1">سەرەتا هەر ژوورێک ٥ کورسی کراوەیە — بە مانەوە و ناردنی دیاری لیڤڵی ژوور بەرز دەبێتەوە!</p>
        </div>
        <button onclick="openCoinStoreModal()" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-600 text-[#1a0d06] text-xs font-black shadow-lg hover:scale-105 transition">
          🪙 کڕینی سکە (Coin Shop)
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-2 border-t border-amber-400/20">
        <input id="newRoomTitleInput" type="text" placeholder="ناوی دیوەخانەکەت (بۆ نموونە: دیوەخانی گەرمیان و کەلار)..."
          class="sm:col-span-5 px-4 py-2.5 rounded-xl bg-[#120804] border border-amber-400/35 text-xs text-white focus:outline-none focus:border-yellow-400" />
        <select id="newRoomThemeSelect"
          class="sm:col-span-4 px-3 py-2.5 rounded-xl bg-[#120804] border border-amber-400/35 text-xs text-amber-200 font-bold">
          ${ROOM_THEMES.map(t => `<option value="${t.id}">🎨 پاشبنەما: ${t.name}</option>`).join('')}
        </select>
        <button onclick="createVoiceRoom()" class="sm:col-span-3 gold-btn py-2.5 px-4 rounded-xl text-xs font-black whitespace-nowrap">
          + کردنەوەی دیوەخان
        </button>
      </div>
    </div>

    <div id="activeRoomsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div class="text-4xl">👑</div>
          <div class="text-sm font-black text-amber-300">لەم کاتەدا هیچ دیوەخانێکی کراوە نییە</div>
          <p class="text-xs text-slate-300">تۆ یەکەم دیوەخان بکەرەوە، مایکەکەت چالاک بکە و میوانداری هاوڕێکانت بکە!</p>
        </div>`;
      return;
    }

    grid.innerHTML = rooms.map(r => {
      const lv = getRoomLevelData(r.roomXp || 0);
      const th = ROOM_THEMES.find(t => t.id === r.theme) || ROOM_THEMES[0];
      return `
        <div class="relative overflow-hidden rounded-3xl p-5 flex flex-col justify-between gap-4 border-2 border-amber-400/45 shadow-2xl transition hover:scale-[1.02]"
             style="background: ${th.css};">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full bg-black/60 border border-amber-400/50 text-amber-300 text-[11px] font-black">
                💎 Lv.${lv.level} • ${th.name}
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-xs font-black">
                👥 ${r.count} / ${lv.unlockedSeats}
              </span>
            </div>
            <h3 class="text-base font-black text-white drop-shadow">${escapeRoomHtml(r.title)}</h3>
            <div class="flex items-center justify-between text-[11px] text-amber-100/90">
              <span>👑 خاوەن ژوور: <strong>${escapeRoomHtml(r.hostName || 'یاریزان')}</strong></span>
              <span>🎁 ${(r.totalGiftCoins || 0).toLocaleString()}</span>
            </div>
            <!-- شریتی پێشکەوتنی لیڤڵی ژوور -->
            <div class="w-full h-2 rounded-full bg-black/60 overflow-hidden border border-white/15">
              <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-200" style="width:${lv.progressPct}%"></div>
            </div>
          </div>
          <button onclick="joinVoiceRoom('${r.id}')" class="gold-btn w-full py-2.5 rounded-xl text-xs font-black shadow-lg">
            چوونە ناو دیوەخان 🎙️
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
    hostId: playerId,
    hostName: playerName,
    roomXp: 0,
    totalGiftCoins: 0,
    announcement: 'بەخێربێن بۆ دیوەخانی YariKurdi 👑 تکایە ڕێز لە یەکتر بگرن و کاتێکی خۆش بەسەر ببەن.',
    createdAt: firebase.database.ServerValue.TIMESTAMP
  });
  if (titleInput) titleInput.value = '';
  joinVoiceRoom(rId);
}

// ==================== ٢. ڕووکاری ناو ژوور (TIKTOK / YALLA VIP STAGE) ====================
function buildVipRoomShell() {
  const panel = document.getElementById('insideRoomPanel');
  if (!panel) return;

  panel.className = 'fixed inset-0 z-50 flex flex-col justify-between overflow-hidden select-none';
  panel.style.background = ROOM_THEMES[0].css;

  panel.innerHTML = `
    <!-- چینی ئەنیمەیشنی دیارییە گەورەکان (Full Screen Gift Stage) -->
    <div id="ykFullGiftOverlay" class="fixed inset-0 z-[70] pointer-events-none hidden flex-col items-center justify-center"></div>

    <!-- دوگمەی Combo ی خێرا (وەک تیکتۆک لە گۆشەی خوارەوەی ڕاست) -->
    <button id="ykGiftComboBtn" onclick="triggerComboRepeat()"
      class="hidden fixed bottom-24 left-5 z-[65] w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-rose-600 border-4 border-yellow-200 shadow-[0_0_30px_rgba(251,191,36,0.9)] flex flex-col items-center justify-center text-white font-black animate-bounce cursor-pointer">
      <span class="text-lg leading-none">Combo</span>
      <span id="ykComboCountText" class="text-xs text-yellow-200 mt-0.5">x1</span>
    </button>

    <!-- بەشی سەرەوە: زانیاری ژوور + لیڤڵ + گۆڕینی پاشبنەما + دەرچوون -->
    <div class="relative z-20 px-3 pt-3 pb-2 space-y-2 bg-gradient-to-b from-black/75 via-black/40 to-transparent">
      <div class="max-w-2xl mx-auto flex items-center justify-between gap-2">
        <!-- پڕۆفایل و ناوی ژوور -->
        <div class="flex items-center gap-2.5 bg-black/55 backdrop-blur-md border border-amber-400/40 rounded-full pl-3.5 pr-1.5 py-1">
          <div id="vipHostAvatarBox" class="w-9 h-9 rounded-full bg-amber-400 text-[#1a0d06] font-black flex items-center justify-center overflow-hidden border border-yellow-200">👑</div>
          <div>
            <div class="flex items-center gap-1.5">
              <span id="currentRoomTitle" class="text-xs sm:text-sm font-black text-white truncate max-w-[140px] sm:max-w-[200px]">دیوەخان</span>
              <span id="vipRoomLevelBadge" class="px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black shadow">Lv.1</span>
            </div>
            <div class="flex items-center gap-2 text-[10px] text-amber-200">
              <span>🎁 <strong id="vipRoomTotalGifts">0</strong></span>
              <span>•</span>
              <span>👥 <strong id="vipRoomOnlineCount">1</strong></span>
            </div>
          </div>
        </div>

        <!-- دوگمەکانی کۆنترۆڵ (پاشبنەما، فرۆشگای سکە، دەرچوون) -->
        <div class="flex items-center gap-1.5">
          <button onclick="openThemePickerModal()" title="گۆڕینی پاشبنەمای ژوور"
            class="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/45 text-amber-300 flex items-center justify-center text-base shadow">
            🖼️
          </button>
          <button onclick="openCoinStoreModal()" title="کڕینی سکە"
            class="px-2.5 h-9 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/50 text-yellow-300 text-xs font-black flex items-center gap-1 shadow">
            <span>🪙</span><span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span>
          </button>
          <button onclick="leaveVoiceRoom()" title="دەرچوون لە ژوور"
            class="w-9 h-9 rounded-full bg-rose-600/85 hover:bg-rose-500 text-white font-black flex items-center justify-center text-sm shadow">
            ✕
          </button>
        </div>
      </div>

      <!-- شریتی پێشکەوتنی لیڤڵی ژوور (XP Bar بۆ کردنەوەی کورسیی زیاتر) -->
      <div class="max-w-2xl mx-auto bg-black/50 backdrop-blur-sm border border-amber-400/25 rounded-full px-3 py-1 flex items-center gap-2.5">
        <span id="vipSeatsUnlockHint" class="text-[10px] font-black text-amber-300 whitespace-nowrap">کورسی کراوە: 5/8</span>
        <div class="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
          <div id="vipRoomXpFill" class="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 transition-all duration-500" style="width: 10%"></div>
        </div>
        <span id="vipRoomXpText" class="text-[10px] font-mono text-slate-300">0/100 XP</span>
      </div>
    </div>

    <!-- ناوەڕاست: سەکۆی کورسییەکانی مایک (VIP Seats Grid) -->
    <div class="relative z-10 flex-1 overflow-y-auto px-3 py-1 flex flex-col justify-between max-w-2xl w-full mx-auto">
      <div id="roomSeatsGrid" class="grid grid-cols-4 gap-2.5 sm:gap-3.5 pt-1"></div>

      <!-- شریتی ڕاگەیاندنی دیارییەکانی سەر چات (Gift Banner) -->
      <div id="ykFloatingGiftBannerBox" class="my-1.5 min-h-[44px] flex items-center justify-start"></div>

      <!-- چاتی زیندووی ناو ژوورەکە -->
      <div id="roomChatMessages"
        class="h-36 sm:h-44 overflow-y-auto space-y-1.5 px-2 py-1.5 rounded-2xl bg-black/35 backdrop-blur-sm border border-white/10 text-xs">
      </div>
    </div>

    <!-- شریتی خوارەوە: مایک + دەنگ + نووسین + دوگمەی دیاری (Gift Box) -->
    <div class="relative z-20 px-3 pb-3 pt-2 bg-gradient-to-t from-black/90 via-black/65 to-transparent">
      <div class="max-w-2xl mx-auto flex items-center gap-2">
        <button id="roomMicToggleBtn" onclick="toggleRoomMicrophone()"
          class="w-10 h-10 rounded-full bg-emerald-500 text-[#050b18] font-black flex items-center justify-center text-lg shadow-lg shrink-0 transition">
          🎙️
        </button>
        <button id="roomSpeakerToggleBtn" onclick="toggleRoomSpeaker()"
          class="w-10 h-10 rounded-full bg-white/10 text-white border border-white/20 flex items-center justify-center text-base shrink-0">
          🔊
        </button>

        <div class="flex-1 flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1">
          <input id="roomChatInput" type="text" onkeydown="if(event.key==='Enter') sendRoomChatMessage()"
            placeholder="شتێک بڵێ لە دیوەخان..."
            class="flex-1 bg-transparent text-xs text-white placeholder-slate-300 focus:outline-none py-1.5" />
          <button onclick="sendRoomChatMessage()" class="text-amber-300 font-black text-xs px-2">ناردن</button>
        </div>

        <!-- دوگمەی دیاری ناردن (Gift Button وەک تیکتۆک) -->
        <button onclick="openGiftDrawerModal()"
          class="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 border-2 border-yellow-200 text-white flex items-center justify-center text-xl shadow-[0_0_20px_rgba(244,63,94,0.75)] hover:scale-110 transition shrink-0">
          🎁
        </button>
      </div>
    </div>

    <!-- پانێڵی هەڵبژاردنی دیاری (TikTok / Yalla Gift Drawer) -->
    <div id="ykGiftDrawerModal" class="hidden fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-xs" onclick="if(event.target===this) closeGiftDrawerModal()">
      <div class="bg-[#140c18]/98 border-t-2 border-amber-400/70 rounded-t-3xl p-4 max-w-2xl w-full mx-auto space-y-3 shadow-2xl">
        <!-- هەڵبژاردنی وەرگر (All یان کەسێکی دیاریکراو) -->
        <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1" id="ykGiftRecipientsRow"></div>
          <button onclick="closeGiftDrawerModal()" class="text-slate-400 hover:text-white text-sm font-bold px-2">✕</button>
        </div>

        <!-- زانیاری خاڵی دیاریی هەڵبژێردراو -->
        <div id="ykSelectedGiftInfoBar" class="flex items-center justify-between bg-white/5 rounded-xl px-3 py-1.5 text-[11px] text-amber-200">
          <span>دیارییەک هەڵبژێرە بۆ ناردن</span>
          <span class="font-black text-yellow-300">🪙 5</span>
        </div>

        <!-- لیستی دیارییەکان -->
        <div id="ykGiftsGrid" class="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-0.5"></div>

        <!-- خوارەوەی پانێڵی دیاری: باڵانسی سکە + کڕینی سکە + ژمارە (x1, x7, x77) + ناردن -->
        <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button onclick="openCoinStoreModal()" class="flex items-center gap-1.5 px-3 py-2 rounded-full bg-amber-400/15 border border-amber-400/50 text-yellow-300 text-xs font-black">
            <span>🪙</span>
            <span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span>
            <span class="text-emerald-400 mr-1">+ کڕین</span>
          </button>

          <div class="flex items-center gap-1.5">
            <div class="flex items-center bg-white/10 rounded-full p-0.5 text-[11px] font-black">
              <button onclick="setGiftQty(1, this)" class="yk-qty-btn px-2.5 py-1 rounded-full bg-amber-400 text-[#1a0d06]">1</button>
              <button onclick="setGiftQty(7, this)" class="yk-qty-btn px-2.5 py-1 rounded-full text-white">7</button>
              <button onclick="setGiftQty(77, this)" class="yk-qty-btn px-2.5 py-1 rounded-full text-white">77</button>
            </div>
            <button onclick="sendSelectedRoyalGift()" class="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 text-white text-xs font-black shadow-lg hover:brightness-110">
              ناردن 🚀
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- مۆداڵی گۆڕینی پاشبنەمای ژوور (Background Theme Picker) -->
    <div id="ykThemePickerModal" class="hidden fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm" onclick="if(event.target===this) closeThemePickerModal()">
      <div class="royal-card max-w-md w-full rounded-3xl p-5 space-y-4 border-2 border-amber-400">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-black gold-text">🖼️ هەڵبژاردنی پاشبنەمای ژوور</h3>
          <button onclick="closeThemePickerModal()" class="text-slate-300 hover:text-white font-bold">✕</button>
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          ${ROOM_THEMES.map(t => `
            <button onclick="changeCurrentRoomTheme('${t.id}')"
              class="h-20 rounded-2xl p-3 flex flex-col justify-end text-right border-2 border-amber-400/50 hover:border-yellow-300 shadow-lg relative overflow-hidden"
              style="background: ${t.css};">
              <span class="text-xs font-black text-white drop-shadow">${t.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- مۆداڵی فرۆشگای کڕینی سکە (Coin Top-Up Shop) -->
    <div id="ykCoinStoreModal" class="hidden fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onclick="if(event.target===this) closeCoinStoreModal()">
      <div class="royal-card max-w-md w-full rounded-3xl p-5 space-y-4 border-2 border-yellow-400 shadow-2xl">
        <div class="flex items-center justify-between border-b border-amber-400/25 pb-3">
          <div>
            <h3 class="text-lg font-black gold-text">🪙 فرۆشگای سکەی YariKurdi</h3>
            <p class="text-[11px] text-amber-200/80">سکە بکڕە بۆ ناردنی دیاریی شاهانە و بەرزکردنەوەی لیڤڵی ژوور</p>
          </div>
          <button onclick="closeCoinStoreModal()" class="text-slate-300 hover:text-white text-lg font-bold">✕</button>
        </div>

        <div class="bg-black/45 rounded-2xl p-3 flex items-center justify-between border border-amber-400/30">
          <span class="text-xs text-amber-100 font-bold">باڵانسی ئێستات:</span>
          <span class="text-base font-black text-yellow-300">🪙 <span class="yk-user-coin-balance">${myUserCoins.toLocaleString()}</span> سکە</span>
        </div>

        <div class="grid grid-cols-2 gap-2.5">
          ${COIN_STORE_PACKAGES.map(pkg => `
            <div onclick="purchaseCoinPackage('${pkg.id}')"
              class="cursor-pointer rounded-2xl p-3.5 bg-gradient-to-b from-amber-500/15 to-black/60 border border-amber-400/45 hover:border-yellow-300 transition flex flex-col justify-between gap-2 text-center">
              <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-black self-center">${pkg.badge}</span>
              <div class="text-2xl">🪙</div>
              <div>
                <div class="text-sm font-black text-white">${pkg.coins.toLocaleString()} سکە</div>
                <div class="text-[10px] font-bold text-emerald-400">+${pkg.bonus} دیاری بەخۆڕایی</div>
              </div>
              <div class="py-1.5 rounded-xl bg-amber-400 text-[#1a0d06] text-xs font-black">${pkg.priceIQD}</div>
            </div>
          `).join('')}
        </div>

        <p class="text-[10px] text-center text-slate-400">پشتگیری لە FIB • Qi Card • FastPay دەکات</p>
      </div>
    </div>

    <div id="remoteAudiosContainer" class="hidden"></div>
  `;
}

// ==================== ٣. چوونە ناو ژوور و بەڕێوەبردنی مایک و XP ====================
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
  isMicMuted = false;

  document.getElementById('roomsLobbyPanel').classList.add('hidden');
  const insidePanel = document.getElementById('insideRoomPanel');
  insidePanel.classList.remove('hidden');
  buildVipRoomShell();
  updateMicButtonsUI();

  // چاودێریکردنی زانیارییەکانی ژوور (پاشبنەما، لیڤڵ، XP، کۆی دیارییەکان)
  roomMetaRef = db.ref('voiceRooms/' + rId);
  roomMetaRef.on('value', snap => {
    const info = snap.val();
    if (!info) return;
    currentRoomMeta = info;

    const titleEl = document.getElementById('currentRoomTitle');
    if (titleEl) titleEl.textContent = info.title || 'دیوەخان';

    const th = ROOM_THEMES.find(t => t.id === info.theme) || ROOM_THEMES[0];
    insidePanel.style.background = th.css;

    const lv = getRoomLevelData(info.roomXp || 0);
    const lvBadge = document.getElementById('vipRoomLevelBadge');
    const xpFill = document.getElementById('vipRoomXpFill');
    const xpText = document.getElementById('vipRoomXpText');
    const seatsHint = document.getElementById('vipSeatsUnlockHint');
    const totalGiftsEl = document.getElementById('vipRoomTotalGifts');

    if (lvBadge) lvBadge.textContent = `Lv.${lv.level}`;
    if (xpFill) xpFill.style.width = `${lv.progressPct}%`;
    if (xpText) xpText.textContent = `${lv.currentXp}/${lv.nextXp} XP`;
    if (seatsHint) seatsHint.textContent = `کورسی کراوە: ${lv.unlockedSeats}/8`;
    if (totalGiftsEl) totalGiftsEl.textContent = (info.totalGiftCoins || 0).toLocaleString();

    renderRoomSeats(currentRoomMembers);
  });

  // تۆمارکردنی ئەندام لە ژوورەکەدا
  const myMemberRef = db.ref(`voiceRooms/${rId}/members/${playerId}`);
  myMemberRef.onDisconnect().remove();
  await myMemberRef.set({
    name: playerName,
    avatar: playerAvatarData || '',
    muted: !localAudioStream,
    speaking: false,
    supportCoins: 0,
    joinedAt: firebase.database.ServerValue.TIMESTAMP
  });

  // ناردنی پەیامی هاتنەژوورەوە بۆ ناو چاتی ژوور
  db.ref(`voiceRooms/${rId}/chat`).push({
    type: 'join',
    name: playerName,
    text: `هاتە ناو دیوەخان 👋`,
    ts: firebase.database.ServerValue.TIMESTAMP
  });

  // زیادکردنی XP ی ژوور هەر ٦٠ چرکە جارێک بەهۆی مانەوەی ئەندامان لە ژوورەکەدا
  if (stayXpInterval) clearInterval(stayXpInterval);
  stayXpInterval = setInterval(() => {
    if (!currentVoiceRoomId) return;
    const count = Object.keys(currentRoomMembers || {}).length || 1;
    db.ref(`voiceRooms/${currentVoiceRoomId}/roomXp`).transaction(cur => (cur || 0) + count * 12);
  }, 30000);

  startLocalVoiceActivityDetector();

  // WebRTC Signals
  roomSignalsRef = db.ref(`voiceRooms/${rId}/signals/${playerId}`);
  roomSignalsRef.onDisconnect().remove();
  roomSignalsRef.on('child_added', async snap => {
    const sig = snap.val();
    snap.ref.remove();
    if (!sig || !sig.from) return;
    await handleWebRTCSignal(sig.from, sig);
  });

  // Members Listener
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
      }
    });
  });

  // Chat Listener
  roomChatRef = db.ref(`voiceRooms/${rId}/chat`);
  roomChatRef.limitToLast(45).on('value', snap => {
    const box = document.getElementById('roomChatMessages');
    if (!box) return;
    const msgs = [];
    snap.forEach(c => msgs.push(c.val()));

    box.innerHTML = msgs.map(m => {
      if (m.type === 'join') {
        return `<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] text-amber-200">
          <span>✨</span><strong>${escapeRoomHtml(m.name)}</strong><span>${escapeRoomHtml(m.text)}</span>
        </div>`;
      }
      if (m.type === 'gift') {
        return `<div class="p-2 rounded-2xl bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-transparent border border-amber-400/45 flex items-center justify-between gap-2">
          <div class="space-y-0.5">
            <div class="text-[11px] font-black text-amber-300">
              ${escapeRoomHtml(m.senderName)} ➔ <span class="text-white">@${escapeRoomHtml(m.targetName)}</span>
            </div>
            <div class="text-[10px] text-amber-100">دیاریی <strong>${escapeRoomHtml(m.giftName)}</strong> نارد (+${m.coins} 🪙)</div>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-2xl">${m.giftIcon}</span>
            <span class="text-sm font-black text-yellow-300">x${m.qty}</span>
          </div>
        </div>`;
      }
      return `<div class="leading-relaxed">
        <span class="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-black text-[10px] ml-1">VIP</span>
        <span class="font-black text-yellow-300">${escapeRoomHtml(m.name)}:</span>
        <span class="text-white">${escapeRoomHtml(m.text)}</span>
      </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  });

  // Live Gift Animation Listener (بۆ ئەوەی هەموو ئەوانەی لە ژوورەکەدان ئەنیمەیشنە گەورەکە ببینن)
  roomGiftsFxRef = db.ref(`voiceRooms/${rId}/liveGifts`);
  roomGiftsFxRef.limitToLast(1).on('child_added', snap => {
    const g = snap.val();
    if (!g || (Date.now() - (g.ts || 0) > 8000)) return;
    triggerFullScreenGiftAnimation(g);
  });
}

// کێشانی ٨ کورسییەکەی دیوەخان (وەک وێنەکە: کورسیی کراوە + چوارچێوەی ئاگری/زێڕین + کورسیی قفڵدراو تا لیڤڵ بەرز دەبێتەوە)
function renderRoomSeats(members) {
  const grid = document.getElementById('roomSeatsGrid');
  if (!grid) return;

  const lv = getRoomLevelData((currentRoomMeta && currentRoomMeta.roomXp) || 0);
  const unlocked = lv.unlockedSeats; // سەرەتا ٥، دواتر ٦، ٧، ٨
  const entries = Object.entries(members || {});

  // دانانی خاوەنی ژوور لە کورسیی ١ و ئەندامانی تر لە کورسییەکانی دواتر
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

      html += `
        <div onclick="selectGiftRecipientAndOpen('${uid}')"
          class="cursor-pointer relative rounded-2xl p-2 bg-black/45 backdrop-blur-sm border ${isHost ? 'border-amber-400/75' : 'border-white/15'} flex flex-col items-center text-center gap-1 transition hover:scale-105">
          <!-- باجی خاڵی پشتگیریی سەر کورسی (وەک 1.1k لە وێنەکەدا) -->
          <div class="w-full flex items-center justify-between text-[9px] font-black px-0.5">
            <span class="px-1.5 py-0.2 rounded-full bg-rose-500/30 text-amber-200">🪙 ${support}</span>
            <span class="text-slate-300">${isHost ? '👑' : `#${i + 1}`}</span>
          </div>

          <!-- وێنەی ئەندام بە بازنەی دەنگی زیندوو -->
          <div class="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 ${isSpeaking ? 'bg-gradient-to-tr from-emerald-400 via-yellow-300 to-emerald-500 mic-speaking' : (isHost ? 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-rose-500' : 'bg-white/25')}">
            <div class="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center text-base font-black text-white">
              ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover" />` : escapeRoomHtml((m.name || 'ی')[0])}
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full ${m.muted ? 'bg-rose-600' : 'bg-emerald-500'} border border-black flex items-center justify-center text-[8px]">
              ${m.muted ? '🔇' : '🎙️'}
            </span>
          </div>

          <div class="text-[10px] font-black text-white truncate w-full">${escapeRoomHtml(m.name)}</div>
          <span class="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-[9px] font-black text-amber-300">
            🎁 Support
          </span>
        </div>
      `;
    } else if (!isLocked) {
      // کورسیی کراوەی بەتاڵ
      html += `
        <div class="rounded-2xl p-2 bg-white/5 border border-dashed border-amber-400/35 flex flex-col items-center justify-center text-center gap-1 min-h-[112px]">
          <div class="w-11 h-11 rounded-full bg-black/40 border border-amber-400/30 flex items-center justify-center text-amber-300/80 text-base">
            🪑
          </div>
          <div class="text-[10px] font-bold text-amber-200/80">کورسی #${i + 1}</div>
          <span class="text-[9px] text-emerald-400 font-bold">کراوەیە</span>
        </div>
      `;
    } else {
      // کورسیی قفڵدراو تا لیڤڵی ژوور بەرز دەبێتەوە
      const reqLv = i === 5 ? 2 : (i === 6 ? 3 : 5);
      html += `
        <div onclick="alert('ئەم کورسییە لە لیڤڵی ${reqLv}ی ژوور دەکرێتەوە! بە مانەوە لە ژوورەکە یان ناردنی دیاری لیڤڵەکە بەرز بکەرەوە.')"
          class="cursor-pointer rounded-2xl p-2 bg-black/55 border border-white/10 flex flex-col items-center justify-center text-center gap-1 min-h-[112px] opacity-75 hover:opacity-100">
          <div class="w-11 h-11 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-slate-400 text-base">
            🔒
          </div>
          <div class="text-[10px] font-black text-slate-300">کورسی #${i + 1}</div>
          <span class="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-black">Lv.${reqLv}</span>
        </div>
      `;
    }
  }

  grid.innerHTML = html;
}

// ==================== ٤. سیستەمی دیاری ناردن (TIKTOK STYLE GIFTS & COMBO) ====================
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

function renderGiftRecipientsRow() {
  const row = document.getElementById('ykGiftRecipientsRow');
  if (!row) return;
  const members = Object.entries(currentRoomMembers || {});

  let html = `
    <button onclick="setGiftRecipient('ALL')"
      class="px-3 py-1.5 rounded-full text-xs font-black shrink-0 border transition ${selectedGiftRecipient === 'ALL' ? 'bg-amber-400 text-[#1a0d06] border-yellow-200' : 'bg-white/10 text-white border-white/15'}">
      All (هەمووان)
    </button>
  `;

  members.forEach(([uid, m], idx) => {
    const active = selectedGiftRecipient === uid;
    html += `
      <button onclick="setGiftRecipient('${uid}')"
        class="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full text-[11px] font-black shrink-0 border transition ${active ? 'bg-rose-600 text-white border-yellow-300 shadow' : 'bg-white/10 text-slate-200 border-white/15'}">
        <span class="w-5 h-5 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-[10px]">
          ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover"/>` : escapeRoomHtml((m.name || 'ی')[0])}
        </span>
        <span class="max-w-[72px] truncate">${escapeRoomHtml(m.name)}</span>
        <span class="text-[9px] opacity-80">#${idx + 1}</span>
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
    b.className = 'yk-qty-btn px-2.5 py-1 rounded-full text-white';
  });
  if (btn) btn.className = 'yk-qty-btn px-2.5 py-1 rounded-full bg-amber-400 text-[#1a0d06]';
  updateSelectedGiftInfoBar();
}

function selectGiftItem(giftId) {
  selectedGiftId = giftId;
  renderGiftsCatalogGrid();
}

function renderGiftsCatalogGrid() {
  const grid = document.getElementById('ykGiftsGrid');
  if (!grid) return;

  grid.innerHTML = ROYAL_GIFTS_CATALOG.map(g => {
    const isSel = g.id === selectedGiftId;
    const isBig = g.tier === 'legendary' || g.tier === 'mythic' || g.tier === 'epic';
    return `
      <div onclick="selectGiftItem('${g.id}')"
        class="cursor-pointer rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 border transition ${isSel ? 'bg-amber-400/20 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.45)] scale-[1.03]' : 'bg-white/5 border-white/10 hover:bg-white/10'}">
        <div class="w-full flex justify-between items-center text-[9px]">
          <span class="${isBig ? 'text-amber-300 font-black' : 'text-transparent'}">✨</span>
          ${isBig ? '<span class="px-1 rounded bg-rose-600/80 text-white font-bold">3D</span>' : ''}
        </div>
        <div class="text-3xl my-0.5">${g.icon}</div>
        <div class="text-[10px] font-black text-white truncate w-full">${g.name}</div>
        <div class="text-[10px] font-black text-yellow-300">🪙 ${g.cost.toLocaleString()}</div>
      </div>
    `;
  }).join('');

  updateSelectedGiftInfoBar();
}

function updateSelectedGiftInfoBar() {
  const bar = document.getElementById('ykSelectedGiftInfoBar');
  const gift = ROYAL_GIFTS_CATALOG.find(g => g.id === selectedGiftId) || ROYAL_GIFTS_CATALOG[0];
  if (!bar || !gift) return;
  const totalCost = gift.cost * selectedGiftQty;
  bar.innerHTML = `
    <span>${gift.icon} <strong>${gift.name}</strong> — ${gift.desc}</span>
    <span class="font-black text-yellow-300 whitespace-nowrap">کۆی گشتی: 🪙 ${totalCost.toLocaleString()}</span>
  `;
}

function sendSelectedRoyalGift() {
  if (!currentVoiceRoomId) return;
  const gift = ROYAL_GIFTS_CATALOG.find(g => g.id === selectedGiftId) || ROYAL_GIFTS_CATALOG[0];
  const qty = selectedGiftQty || 1;
  const totalCost = gift.cost * qty;

  if (myUserCoins < totalCost) {
    if (confirm(`سکەکانت بەش ناکەن! (پێویستت بە ${totalCost.toLocaleString()} سکەیە و تۆ ${myUserCoins.toLocaleString()} سکەت هەیە).\nدەتەوێت ئێستا سکە بکڕیت؟`)) {
      openCoinStoreModal();
    }
    return;
  }

  // کەمکردنەوەی سکە لە باڵانسی نێرەر
  myUserCoins -= totalCost;
  updateRoomCoinDisplays();
  if (db && playerId) {
    db.ref(`players/${playerId}/coins`).set(myUserCoins);
  }

  // دیاریکردنی ناوی وەرگر
  let targetName = 'هەموو دیوەخان';
  if (selectedGiftRecipient !== 'ALL' && currentRoomMembers[selectedGiftRecipient]) {
    targetName = currentRoomMembers[selectedGiftRecipient].name;
    // زیادکردنی خاڵی پشتگیری بۆ وەرگر
    db.ref(`voiceRooms/${currentVoiceRoomId}/members/${selectedGiftRecipient}/supportCoins`)
      .transaction(c => (c || 0) + totalCost);
  } else {
    // ئەگەر بۆ هەمووان بوو، بۆ خاوەن ژوور زیاد دەبێت
    const hId = currentRoomMeta && currentRoomMeta.hostId;
    if (hId && currentRoomMembers[hId]) {
      db.ref(`voiceRooms/${currentVoiceRoomId}/members/${hId}/supportCoins`)
        .transaction(c => (c || 0) + totalCost);
    }
  }

  // زیادکردنی XP و کۆی دیارییەکانی ژوور
  const gainedXp = gift.xp * qty;
  db.ref(`voiceRooms/${currentVoiceRoomId}/roomXp`).transaction(cur => (cur || 0) + gainedXp);
  db.ref(`voiceRooms/${currentVoiceRoomId}/totalGiftCoins`).transaction(cur => (cur || 0) + totalCost);

  // ناردنی پەیامی دیاری بۆ چات و پەخشی ئەنیمەیشن
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

  if (lastSentGiftCombo && lastSentGiftCombo.giftId === giftId) {
    lastSentGiftCombo.streak += qty;
  } else {
    lastSentGiftCombo = { giftId, streak: qty };
  }

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

// ئەنیمەیشنی دیاری لەسەر شاشە (سوارچاک، نەهەنگ، هەڵۆ، ئۆتۆمبێل، و بنەڕەتی دیاری)
function triggerFullScreenGiftAnimation(g) {
  // ١. بنەڕەتی دیاری ناردن لەسەر چات (Send to @... x1)
  const bannerBox = document.getElementById('ykFloatingGiftBannerBox');
  if (bannerBox) {
    bannerBox.innerHTML = `
      <div class="inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 border-2 border-yellow-200 shadow-[0_6px_24px_rgba(245,158,11,0.75)] animate-pulse">
        <div class="w-8 h-8 rounded-full bg-black/40 overflow-hidden flex items-center justify-center text-xs font-black text-white border border-white">
          ${g.senderAvatar ? `<img src="${g.senderAvatar}" class="w-full h-full object-cover"/>` : escapeRoomHtml((g.senderName || 'ی')[0])}
        </div>
        <div class="text-right leading-tight">
          <div class="text-[11px] font-black text-white">${escapeRoomHtml(g.senderName)}</div>
          <div class="text-[10px] font-bold text-yellow-100">Send to @${escapeRoomHtml(g.targetName)}</div>
        </div>
        <span class="text-3xl drop-shadow">${g.giftIcon}</span>
        <span class="text-lg font-black text-yellow-200 italic">x${g.qty}</span>
      </div>
    `;
  }

  // ٢. ئەنیمەیشنی فول سکرین بۆ دیارییە گەورەکان
  const overlay = document.getElementById('ykFullGiftOverlay');
  if (!overlay) return;

  const isGrand = g.tier === 'legendary' || g.tier === 'mythic' || g.tier === 'epic';
  if (!isGrand) return;

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  overlay.innerHTML = `
    <div class="relative flex flex-col items-center justify-center text-center p-6 animate-bounce">
      <div class="absolute w-72 h-72 rounded-full bg-amber-400/30 blur-3xl"></div>
      <div class="text-[110px] sm:text-[140px] drop-shadow-[0_15px_35px_rgba(0,0,0,0.95)] relative z-10">${g.giftIcon}</div>
      <div class="mt-2 px-6 py-2 rounded-full bg-black/80 border-2 border-yellow-300 shadow-2xl relative z-10">
        <div class="text-base sm:text-lg font-black gold-text">${escapeRoomHtml(g.giftName)} x${g.qty}</div>
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

// ==================== ٥. گۆڕینی پاشبنەما و فرۆشگای کڕینی سکە ====================
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
  db.ref(`voiceRooms/${currentVoiceRoomId}/theme`).set(themeId);
  closeThemePickerModal();
}

function openCoinStoreModal() {
  const m = document.getElementById('ykCoinStoreModal');
  if (m) m.classList.remove('hidden');
}
function closeCoinStoreModal() {
  const m = document.getElementById('ykCoinStoreModal');
  if (m) m.classList.add('hidden');
}

function purchaseCoinPackage(pkgId) {
  const pkg = COIN_STORE_PACKAGES.find(p => p.id === pkgId);
  if (!pkg) return;

  const totalAdd = pkg.coins + pkg.bonus;
  if (confirm(`کڕینی پاکێجی ${pkg.coins.toLocaleString()} سکە (+${pkg.bonus} دیاری) بە ${pkg.priceIQD}؟`)) {
    myUserCoins += totalAdd;
    updateRoomCoinDisplays();
    if (db && playerId) {
      db.ref(`players/${playerId}/coins`).set(myUserCoins);
    }
    if (typeof playChessSound === 'function') playChessSound('end');
    alert(`🎉 پیرۆزە! ${totalAdd.toLocaleString()} سکە زیاد کرا بۆ هەژمارەکەت.`);
    closeCoinStoreModal();
  }
}

// ==================== ٦. دەنگ و مایکرۆفۆنی WebRTC ====================
function startLocalVoiceActivityDetector() {
  if (voiceAnalyserInterval) clearInterval(voiceAnalyserInterval);
  if (!localAudioStream) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(localAudioStream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let lastSpeaking = false;

    voiceAnalyserInterval = setInterval(() => {
      if (!currentVoiceRoomId || isMicMuted) return;
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      const speaking = avg > 18;
      if (speaking !== lastSpeaking) {
        lastSpeaking = speaking;
        db.ref(`voiceRooms/${currentVoiceRoomId}/members/${playerId}/speaking`).set(speaking);
      }
    }, 240);
  } catch (e) {}
}

async function initiatePeerConnection(peerId) {
  const pc = createPeerConnection(peerId);
  const offer = await pc.createOffer();
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
  if (localAudioStream) {
    localAudioStream.getTracks().forEach(t => pc.addTrack(t, localAudioStream));
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
      const box = document.getElementById('remoteAudiosContainer');
      if (box) box.appendChild(audio);
    }
    audio.srcObject = e.streams[0];
    audio.muted = isSpeakerMuted;
  };
  return pc;
}

async function handleWebRTCSignal(peerId, sig) {
  let pc = rtcPeers[peerId] || createPeerConnection(peerId);
  if (sig.type === 'offer') {
    await pc.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: sig.sdp }));
    const ans = await pc.createAnswer();
    await pc.setLocalDescription(ans);
    db.ref(`voiceRooms/${currentVoiceRoomId}/signals/${peerId}`).push({
      from: playerId,
      type: 'answer',
      sdp: ans.sdp
    });
  } else if (sig.type === 'answer') {
    await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: sig.sdp }));
  } else if (sig.type === 'ice' && sig.candidate) {
    await pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
  }
}

function toggleRoomMicrophone() {
  if (!localAudioStream) {
    alert('تکایە ڕێگە بە مایکرۆفۆن بدە لە براوزەرەکەتدا!');
    return;
  }
  isMicMuted = !isMicMuted;
  localAudioStream.getAudioTracks().forEach(t => (t.enabled = !isMicMuted));
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
  document.querySelectorAll('#remoteAudiosContainer audio').forEach(a => (a.muted = isSpeakerMuted));
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
  if (voiceAnalyserInterval) { clearInterval(voiceAnalyserInterval); voiceAnalyserInterval = null; }
  if (stayXpInterval) { clearInterval(stayXpInterval); stayXpInterval = null; }
  if (roomMetaRef) { roomMetaRef.off(); roomMetaRef = null; }
  if (roomMembersRef) { roomMembersRef.off(); roomMembersRef = null; }
  if (roomSignalsRef) { roomSignalsRef.off(); roomSignalsRef = null; }
  if (roomChatRef) { roomChatRef.off(); roomChatRef = null; }
  if (roomGiftsFxRef) { roomGiftsFxRef.off(); roomGiftsFxRef = null; }

  Object.values(rtcPeers).forEach(pc => pc.close());
  rtcPeers = {};
  const audioBox = document.getElementById('remoteAudiosContainer');
  if (audioBox) audioBox.innerHTML = '';

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

  const panel = document.getElementById('insideRoomPanel');
  if (panel) panel.classList.add('hidden');
  const lobby = document.getElementById('roomsLobbyPanel');
  if (lobby) lobby.classList.remove('hidden');
}

function escapeRoomHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// ==================== ٧. مایکی ناو یارییەکان (LUDO LIVE MIC) ====================
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
      document.body.appendChild(audio);
    }
    audio.srcObject = e.streams[0];
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

// ==================== ٨. ڕیزبەندی و هەژمارکردنی ELO ====================
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