const YK_SEASON_EPOCH_MS = Date.UTC(2026, 10, 1, 0, 0, 0);
const YK_SEASON_DURATION_MS = 60 * 24 * 60 * 60 * 1000;
const YK_SEASON_MAX_LEVEL = 30;
const YK_POINTS_PER_LEVEL = 6;
const YK_GOLDEN_TRACK_PRICE_USD = '$3';
const YK_GOLDEN_TRACK_PRICE_IQD = '4,500 دینار';

const YK_SEASON_NAMES = [
  'وەرزی زستان و شێروانە',
  'وەرزی نەورۆز و بەهار',
  'وەرزی هاوین و هەورامان',
  'وەرزی پاییز و گۆیژە'
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
  return {
    seasonNum,
    seasonKey: `season_${seasonNum}`,
    daysLeft,
    title
  };
}

const YK_SEASON_REWARDS = [
  { lv: 1, gold: { id: 's_g1', name: 'تیشکی نەورۆز', type: 'name', icon: '🔥', preview: 'linear-gradient(90deg,#ef4444,#facc15)' }, free: null },
  { lv: 2, gold: { id: 's_g2', name: 'چوارچێوەی بەفر', type: 'frame', icon: '❄️', preview: 'linear-gradient(135deg,#0284c7,#38bdf8)' }, free: null },
  { lv: 3, gold: { id: 's_g3', name: 'چایخانە لە بەفردا', type: 'bg', icon: '🫖', preview: 'linear-gradient(135deg,#7c2d12,#f59e0b)' }, free: { id: 's_f3', name: 'ناوی سپی بەفری', type: 'name', icon: '✨', coins: 0 } },
  { lv: 4, gold: { id: 's_g4', name: 'هەستەکانی دیوەخان', type: 'emoji', icon: '🥳', preview: 'linear-gradient(135deg,#b91c1c,#f43f5e)' }, free: null },
  { lv: 5, gold: { id: 's_g5', name: 'چوارچێوەی خۆری ٢١ پەڕ', type: 'frame', icon: '☀️', preview: 'linear-gradient(135deg,#b91c1c,#facc15,#15803d)' }, free: null },
  { lv: 6, gold: { id: 's_g6', name: 'بازاڕی قەیسەری', type: 'bg', icon: '🏛️', preview: 'linear-gradient(135deg,#92400e,#d97706)' }, free: { id: 's_f6', name: '٢٠٠ دراوی خۆر', type: 'coins', icon: '☀️', coins: 200 } },
  { lv: 7, gold: { id: 's_g7', name: 'ناوی نیوەشەو', type: 'name', icon: '🌙', preview: 'linear-gradient(90deg,#6366f1,#38bdf8)' }, free: null },
  { lv: 8, gold: { id: 's_g8', name: 'سندوقی دیاری زێڕین', type: 'coins', icon: '🎁', coins: 500, preview: 'linear-gradient(135deg,#ca8a04,#fde047)' }, free: null },
  { lv: 9, gold: { id: 's_g9', name: 'پێنجوێن لە بەفردا', type: 'bg', icon: '🏔️', preview: 'linear-gradient(135deg,#1e3a8a,#0284c7)' }, free: { id: 's_f9', name: 'کریستاڵی کوردستان', type: 'badge', icon: '❄️', coins: 0 } },
  { lv: 10, gold: { id: 's_g10', name: 'ناوی پشکۆ', type: 'name', icon: '💥', preview: 'linear-gradient(90deg,#f97316,#ef4444)' }, free: null },
  { lv: 11, gold: { id: 's_g11', name: 'بڵقی چاتی بەفرباران', type: 'chat', icon: '💬', preview: 'linear-gradient(135deg,#0ea5e9,#1d4ed8)' }, free: null },
  { lv: 12, gold: { id: 's_g12', name: 'تافگەی ئەحمەدئاوا', type: 'bg', icon: '🌊', preview: 'linear-gradient(135deg,#047857,#0ea5e9)' }, free: { id: 's_f12', name: 'ئامێدی لە هەوردا', type: 'bg', icon: '⛰️', coins: 0 } },
  { lv: 13, gold: { id: 's_g13', name: 'ناوی چایخانە', type: 'name', icon: '🫖', preview: 'linear-gradient(90deg,#d97706,#fef08a)' }, free: null },
  { lv: 14, gold: { id: 's_g14', name: 'زاری سەهۆڵیی لودۆ', type: 'dice', icon: '🎲', preview: 'linear-gradient(135deg,#2563eb,#67e8f9)' }, free: null },
  { lv: 15, gold: { id: 's_g15', name: 'کۆڕەک و چیای سەفین', type: 'bg', icon: '🎿', preview: 'linear-gradient(135deg,#0369a1,#38bdf8)' }, free: { id: 's_f15', name: 'پارێزەری ستریک + ٣٠٠ YK', type: 'coins', icon: '🛡️', coins: 300 } },
  { lv: 16, gold: { id: 's_g16', name: 'بووکەبەفرینەی دیوەخان', type: 'emoji', icon: '⛄', preview: 'linear-gradient(135deg,#0284c7,#93c5fd)' }, free: null },
  { lv: 17, gold: { id: 's_g17', name: 'چوارچێوەی کریستاڵ', type: 'frame', icon: '💠', preview: 'linear-gradient(135deg,#6366f1,#22d3ee)' }, free: null },
  { lv: 18, gold: { id: 's_g18', name: 'شەوی یەڵدای دیوەخان', type: 'bg', icon: '🏮', preview: 'linear-gradient(135deg,#7f1d1d,#d97706)' }, free: { id: 's_f18', name: 'چوارچێوەی سنەوبەر', type: 'frame', icon: '🌲', coins: 0 } },
  { lv: 19, gold: { id: 's_g19', name: 'ناوی هەناری هەڵەبجە', type: 'name', icon: '🍎', preview: 'linear-gradient(90deg,#dc2626,#fb7185)' }, free: null },
  { lv: 20, gold: { id: 's_g20', name: 'فانۆسی زێڕینی کەلار', type: 'gift', icon: '🏮', coins: 750, preview: 'linear-gradient(135deg,#b45309,#facc15)' }, free: null },
  { lv: 21, gold: { id: 's_g21', name: 'دۆمینەی یاقووتی', type: 'skin', icon: '🁣', preview: 'linear-gradient(135deg,#991b1b,#dc2626)' }, free: { id: 's_f21', name: '٤٠٠ دراوی خۆر', type: 'coins', icon: '☀️', coins: 400 } },
  { lv: 22, gold: { id: 's_g22', name: 'قەڵای هەولێر لە شەودا', type: 'bg', icon: '🏯', preview: 'linear-gradient(135deg,#581c87,#ea580c)' }, free: null },
  { lv: 23, gold: { id: 's_g23', name: 'ناوی ئاڵای کوردستان', type: 'name', icon: '☀️', preview: 'linear-gradient(90deg,#dc2626,#fde047,#16a34a)' }, free: null },
  { lv: 24, gold: { id: 's_g24', name: 'گەلی عەلی بەگ', type: 'bg', icon: '🏞️', preview: 'linear-gradient(135deg,#065f46,#0284c7)' }, free: { id: 's_f24', name: 'پاراستنی ستریک x2', type: 'perk', icon: '🔥', coins: 0 } },
  { lv: 25, gold: { id: 's_g25', name: '١٠٠٠ دراوی خۆری زێڕین', type: 'coins', icon: '☀️', coins: 1000, preview: 'linear-gradient(135deg,#ca8a04,#fde047)' }, free: null },
  { lv: 26, gold: { id: 's_g26', name: 'جامی سەرکەوتن', type: 'badge', icon: '🏆', preview: 'linear-gradient(135deg,#d97706,#fef08a)' }, free: null },
  { lv: 27, gold: { id: 's_g27', name: 'چیای هەڵگورد', type: 'bg', icon: '🏔️', preview: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' }, free: { id: 's_f27', name: 'مانگەشەوی سلێمانی', type: 'bg', icon: '🌃', coins: 0 } },
  { lv: 28, gold: { id: 's_g28', name: 'ناوی بەفری زێڕین', type: 'name', icon: '👑', preview: 'linear-gradient(90deg,#fef08a,#f59e0b)' }, free: null },
  { lv: 29, gold: { id: 's_g29', name: 'تاجی پاشای وەرز', type: 'frame', icon: '👑', preview: 'linear-gradient(135deg,#b45309,#fde047,#dc2626)' }, free: null },
  { lv: 30, gold: { id: 's_g30', name: 'هەڵۆی زێڕین + ٢٥٠٠ YK', type: 'coins', icon: '🦅', coins: 2500, preview: 'linear-gradient(135deg,#dc2626,#f59e0b,#15803d)' }, free: { id: 's_f30', name: 'سپێدەچوونی کوردستان + ٥٠٠ YK', type: 'coins', icon: '🌅', coins: 500 } }
];

let ykSeasonState = {
  seasonKey: '',
  points: 0,
  todayPoints: 0,
  todayDate: '',
  goldenUnlocked: false,
  claimed: {},
  perks: { shield: 1, rename: 1, revive: 1 },
  syncedUid: null
};

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

  db.ref(`players/${playerId}/seasons/${cycle.seasonKey}`).on('value', snap => {
    const d = snap.val() || {};
    const today = getTodayIsoDate();
    ykSeasonState.points = Number(d.points) || 0;
    ykSeasonState.todayPoints = d.todayDate === today ? (Number(d.todayPoints) || 0) : 0;
    ykSeasonState.todayDate = today;
    ykSeasonState.goldenUnlocked = !!d.goldenUnlocked;
    ykSeasonState.claimed = d.claimed || {};
    ykSeasonState.perks = d.perks || { shield: 1, rename: 1, revive: 1 };

    updateHubSeasonBannerLive();
    if (document.getElementById('ykSeasonRoot')) renderSeasonPassModalBody();
  });
}

function addSeasonPoints(delta) {
  if (typeof db === 'undefined' || !playerId) return;
  const cycle = getCurrentSeasonCycle();
  const today = getTodayIsoDate();
  const newToday = Math.min(30, (ykSeasonState.todayDate === today ? ykSeasonState.todayPoints : 0) + delta);
  const actualAdd = Math.max(0, newToday - (ykSeasonState.todayDate === today ? ykSeasonState.todayPoints : 0));
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
  const gained = addSeasonPoints(6);
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🔥 دەستخۆش! +${gained || 6} خاڵی وەرزت وەرگرت!`);
}

function purchaseGoldenSeasonTrack() {
  const cycle = getCurrentSeasonCycle();
  if (ykSeasonState.goldenUnlocked) {
    alert('تۆ پێشتر بەشداریت لە ڕێڕەوی زێڕینی ئەم وەرزەدا کردووە! 👑');
    return;
  }
  const msg = `بەشداریکردن لە «ڕێڕەوی زێڕینی وەرزی ${cycle.seasonNum}» تەنها بە ${YK_GOLDEN_TRACK_PRICE_USD} (${YK_GOLDEN_TRACK_PRICE_IQD})؟\nهەموو ٣٠ خەڵاتە زێڕینەکەی ئەم ٢ مانگەت بۆ دەکرێتەوە!`;
  if (!confirm(msg)) return;

  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/seasons/${cycle.seasonKey}/goldenUnlocked`).set(true);
  }
  if (typeof playChessSound === 'function') playChessSound('end');
  alert('👑 پیرۆزە! ڕێڕەوی زێڕینی وەرزت بۆ کرایەوە — ئێستا هەموو خەڵاتە گەیشتووەکان وەربگرە!');
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
    if (confirm(`ناردنی ڕێڕەوی زێڕین ($3) وەک دیاری بۆ ${snap.val().name || cleanUser}؟`)) {
      db.ref(`players/${uid}/seasons/${cycle.seasonKey}/goldenUnlocked`).set(true);
      if (typeof playChessSound === 'function') playChessSound('end');
      alert(`🎁 دیارییەکەت بە سەرکەوتوویی گەیشتە ${snap.val().name || cleanUser}!`);
    }
  });
}

function claimSeasonRewardItem(lv, track) {
  const stats = getSeasonProgressStats();
  if (stats.level < lv) {
    const need = (lv * YK_POINTS_PER_LEVEL) - stats.pts;
    alert(`پێویستت بە ${need} خاڵی ترە بۆ گەیشتن بە ئاستی ${lv}!`);
    return;
  }
  if (track === 'gold' && !ykSeasonState.goldenUnlocked) {
    purchaseGoldenSeasonTrack();
    return;
  }

  const row = YK_SEASON_REWARDS.find(r => r.lv === lv);
  const item = row && row[track];
  if (!item) return;

  if (ykSeasonState.claimed && ykSeasonState.claimed[item.id]) return;

  const cycle = getCurrentSeasonCycle();
  if (typeof db !== 'undefined' && playerId) {
    db.ref(`players/${playerId}/seasons/${cycle.seasonKey}/claimed/${item.id}`).set(true);
    db.ref(`players/${playerId}/inventory/${item.id}`).set(true);
  }

  if (item.coins && item.coins > 0 && typeof addUserCoins === 'function') {
    addUserCoins(item.coins);
  }
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🎉 پیرۆزە! خەڵاتی «${item.name}» وەرگیرا!`);
}

function openSeasonPassModal() {
  if (typeof injectBazaarStyles === 'function') injectBazaarStyles();
  syncSeasonDataListener();

  const existing = document.getElementById('ykSeasonRoot');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'ykSeasonRoot';
  root.setAttribute('dir', 'rtl');
  root.style.cssText = 'position:fixed; inset:0; width:100vw; height:100dvh; z-index:9986; overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch;';
  root.className = 'yk-kurd-flag-scroll-bg text-white';

  root.innerHTML = `
    ${typeof getKurdistanSunSVG === 'function' ? getKurdistanSunSVG() : ''}
    <div id="ykSeasonBody" class="relative z-10 max-w-lg mx-auto pb-28"></div>
  `;

  document.body.style.overflow = 'hidden';
  document.body.appendChild(root);
  renderSeasonPassModalBody();
}

function closeSeasonPassModal() {
  const root = document.getElementById('ykSeasonRoot');
  if (root) root.remove();
  document.body.style.overflow = '';
}

function scrollToCurrentSeasonLevel() {
  const stats = getSeasonProgressStats();
  const targetLv = Math.max(1, Math.min(YK_SEASON_MAX_LEVEL, stats.level + 1));
  const el = document.getElementById('ykSeasonNode-' + targetLv);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function renderSeasonPassModalBody() {
  const body = document.getElementById('ykSeasonBody');
  if (!body) return;

  const cycle = getCurrentSeasonCycle();
  const stats = getSeasonProgressStats();
  const todayDone = !!(ykSeasonState.claimed && ykSeasonState.claimed['daily_' + getTodayIsoDate()]);

  const rowsHtml = YK_SEASON_REWARDS.map(row => {
    const reached = stats.level >= row.lv;
    const g = row.gold;
    const f = row.free;

    const gClaimed = g && ykSeasonState.claimed && ykSeasonState.claimed[g.id];
    const fClaimed = f && ykSeasonState.claimed && ykSeasonState.claimed[f.id];

    const renderCard = (item, track, claimed) => {
      if (!item) return '<div class="min-h-[120px]"></div>';
      const isGold = track === 'gold';
      const lockedByPass = isGold && !ykSeasonState.goldenUnlocked;
      const canClaim = reached && !claimed && !lockedByPass;

      let statusHtml = '';
      if (claimed) {
        statusHtml = '<span class="text-[10px] font-black text-emerald-300">✓ وەرگیرا</span>';
      } else if (canClaim) {
        statusHtml = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-500 text-[#050b18] text-[10px] font-black animate-pulse">وەرگرتن 🎁</span>';
      } else if (lockedByPass) {
        statusHtml = '<span class="text-[10px] font-bold text-amber-300">🔒 ڕێڕەوی زێڕین</span>';
      } else {
        statusHtml = `<span class="text-[10px] font-bold text-slate-300">🔒 ${row.lv * YK_POINTS_PER_LEVEL} خاڵ</span>`;
      }

      return `
        <div onclick="claimSeasonRewardItem(${row.lv}, '${track}')"
          class="cursor-pointer rounded-2xl p-2 bg-black/55 backdrop-blur-md border ${canClaim ? 'border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.5)]' : (isGold ? 'border-amber-400/50' : 'border-white/20')} flex flex-col items-center text-center gap-1.5 transition active:scale-95">
          <div class="w-full h-20 rounded-xl flex items-center justify-center relative overflow-hidden border border-white/15"
               style="background: ${item.preview || 'linear-gradient(135deg,#1e293b,#0f172a)'};">
            ${item.type === 'name'
              ? '<span class="px-2 py-1 rounded-lg bg-white/95 text-slate-900 font-black text-xs shadow">ناوەکەت</span>'
              : `<span class="text-3xl drop-shadow-lg">${item.icon}</span>`
            }
          </div>
          <div class="text-[11px] font-black text-white leading-tight line-clamp-1">${item.name}</div>
          <div>${statusHtml}</div>
        </div>
      `;
    };

    return `
      <div id="ykSeasonNode-${row.lv}" class="grid grid-cols-11 items-center gap-1.5 relative">
        <div class="col-span-5">${renderCard(f, 'free', fClaimed)}</div>

        <div class="col-span-1 flex flex-col items-center justify-center relative z-10">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shadow-lg ${reached ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-[#1a0d06] border-yellow-100' : 'bg-[#1a1523] text-amber-200 border-amber-400/55'}">
            ${row.lv}
          </div>
        </div>

        <div class="col-span-5">${renderCard(g, 'gold', gClaimed)}</div>
      </div>
    `;
  }).join('');

  body.innerHTML = `
    <!-- هیدەری وەرزی ٢ مانگە -->
    <div class="relative px-4 pb-5 text-center space-y-3" style="padding-top: max(14px, env(safe-area-inset-top));">
      <div class="flex items-center justify-between">
        <button onclick="alert('هەر ٢ مانگ (٦٠ ڕۆژ) جارێک وەرزێکی نوێی یاری کوردی دەست پێدەکات و هەموو ئاستەکان سفر دەبنەوە. بە یاریکردن خاڵ کۆبکەرەوە و بە تەنها $3 هەموو ٣٠ خەڵاتە زێڕینەکە بکەرەوە!')"
          class="w-9 h-9 rounded-full bg-black/50 border border-white/25 text-white font-black text-sm flex items-center justify-center">i</button>
        <div class="text-center">
          <div class="text-xs font-black text-amber-300">☀️ ڕێگای یاری کوردی • وەرزی ${cycle.seasonNum}</div>
        </div>
        <button onclick="closeSeasonPassModal()"
          class="w-9 h-9 rounded-full bg-white text-slate-950 font-black text-base flex items-center justify-center shadow-lg">➔</button>
      </div>

      <div class="inline-block px-7 py-2 rounded-2xl bg-gradient-to-r from-[#dc2626] via-[#b91c1c] to-[#991b1b] border-2 border-yellow-300 shadow-[0_8px_28px_rgba(0,0,0,0.65)]">
        <div class="text-xl font-black text-white">${cycle.title}</div>
      </div>
      <div class="text-xs font-black text-yellow-200">⏳ ${cycle.daysLeft} ڕۆژی ماوە تا سفربوونەوەی وەرز (هەر ٢ مانگ جارێک)</div>

      <!-- کارتی خاڵ و ئاست -->
      <div class="yk-glass-panel rounded-3xl p-4 space-y-3 border-amber-400/50">
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="text-base font-black text-white">🏆 ${stats.pts}</div>
            <div class="text-[10px] text-amber-200">خاڵ</div>
          </div>
          <div>
            <div class="text-base font-black text-white">🔥 ${ykSeasonState.todayPoints}/30</div>
            <div class="text-[10px] text-amber-200">ئەمڕۆ</div>
          </div>
          <div>
            <div class="text-base font-black text-emerald-300">⭐ ${stats.level}/${YK_SEASON_MAX_LEVEL}</div>
            <div class="text-[10px] text-amber-200">ئاستت</div>
          </div>
        </div>

        <div class="w-full h-5 rounded-full bg-black/65 border border-amber-400/40 overflow-hidden relative p-0.5">
          <div class="h-full rounded-full bg-gradient-to-l from-red-500 via-yellow-400 to-emerald-500 transition-all duration-500" style="width:${Math.max(8, stats.pct)}%"></div>
          <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow">${stats.inStep}/${YK_POINTS_PER_LEVEL}</span>
        </div>

        <div class="flex items-center justify-between text-[11px]">
          <span class="text-amber-100/90">${stats.remaining > 0 ? `${stats.remaining} خاڵی ماوە بۆ هەنگاوی داهاتوو` : 'گەیشتیتە کۆتا ئاستی وەرز! 👑'}</span>
          <button onclick="claimDailySeasonCheckIn()" class="px-3 py-1 rounded-full ${todayDone ? 'bg-white/10 text-slate-300' : 'bg-emerald-500 text-[#050b18] animate-pulse'} font-black text-[10px]">
            ${todayDone ? '✓ وەرگیرا' : '+٦ خاڵی ئەمڕۆ'}
          </button>
        </div>
      </div>

      <!-- پانێڵی بەشداریکردن لە ڕێڕەوی زێڕین تەنها بە $3 -->
      <div class="yk-glass-panel rounded-3xl p-4 space-y-2.5 border-2 border-yellow-400 shadow-2xl">
        <div class="flex items-center justify-between text-right">
          <div>
            <div class="text-sm font-black text-yellow-300">👑 ڕێڕەوی زێڕین (${YK_GOLDEN_TRACK_PRICE_USD})</div>
            <p class="text-[11px] text-amber-100/90">هەموو ٣٠ خەڵاتە زێڕینەکەی ئەم وەرزە بکەرەوە تەنها بە ٣ دۆلار</p>
          </div>
          <span class="text-3xl">🎁</span>
        </div>

        <button onclick="purchaseGoldenSeasonTrack()"
          class="w-full py-3 rounded-2xl ${ykSeasonState.goldenUnlocked ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300' : 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[#1a0d06] shadow-xl'} text-sm font-black">
          ${ykSeasonState.goldenUnlocked ? '✓ ڕێڕەوی زێڕین چالاکە بۆ ئەم وەرزە' : `ڕێڕەوی زێڕین بکڕە • ${YK_GOLDEN_TRACK_PRICE_USD} (${YK_GOLDEN_TRACK_PRICE_IQD})`}
        </button>

        <button onclick="giftGoldenSeasonToFriend()"
          class="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-black text-amber-100">
          🎁 بە دیاری بینێرە بۆ هاوڕێیەک (${YK_GOLDEN_TRACK_PRICE_USD})
        </button>
      </div>

      <!-- کاڵاکانم -->
      <div class="yk-glass-panel rounded-2xl p-3">
        <div class="text-[11px] font-black text-amber-300 mb-2">کاڵاکانم لەم وەرزەدا</div>
        <div class="grid grid-cols-3 gap-2 text-center text-[10px] font-black">
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-lg">🔥 x${ykSeasonState.perks.shield || 1}</div>پاراستنی ستریک</div>
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-lg">🎫 x${ykSeasonState.perks.rename || 1}</div>گۆڕینی ناو</div>
          <div class="p-2 rounded-xl bg-white/5 border border-white/10"><div class="text-lg">❤️‍🩹 x${ykSeasonState.perks.revive || 1}</div>ڕزگارم بکە</div>
        </div>
      </div>
    </div>

    <!-- سەردێڕی دوو ڕێڕەوەکە -->
    <div class="sticky top-0 z-20 px-3 py-2 bg-[#160a0d]/85 backdrop-blur-md border-y border-amber-400/35 grid grid-cols-11 text-center text-xs font-black">
      <div class="col-span-5 text-emerald-300">بۆ هەمووان</div>
      <div class="col-span-1 text-yellow-300">☀️</div>
      <div class="col-span-5 text-amber-300">👑 ڕێڕەوی زێڕین</div>
    </div>

    <!-- ڕێگای ٣٠ ئاستەکە بە هێڵی زێڕینی ناوەڕاست -->
    <div class="relative px-3 pt-4 space-y-3">
      <div style="position:absolute; top:0; bottom:0; left:50%; transform:translateX(-50%); width:4px; background:linear-gradient(180deg,#dc2626,#facc15,#fde047,#15803d); z-index:0; border-radius:999px;"></div>
      ${rowsHtml}
    </div>

    <!-- دوگمەی خێرا بۆ بازدان بۆ ئاستی ئێستات -->
    <button onclick="scrollToCurrentSeasonLevel()"
      class="fixed left-4 bottom-5 z-30 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#1a0d06] font-black text-xs shadow-2xl border-2 border-yellow-100">
      ${stats.level} ↓
    </button>
  `;
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
        openPill.textContent = 'ڕێگای یاری کوردی ➔';
        topRow.appendChild(openPill);
      }
    }
  }
}

window.openSeasonPassModal = openSeasonPassModal;
window.closeSeasonPassModal = closeSeasonPassModal;
window.purchaseGoldenSeasonTrack = purchaseGoldenSeasonTrack;
window.giftGoldenSeasonToFriend = giftGoldenSeasonToFriend;
window.claimSeasonRewardItem = claimSeasonRewardItem;
window.claimDailySeasonCheckIn = claimDailySeasonCheckIn;
window.scrollToCurrentSeasonLevel = scrollToCurrentSeasonLevel;

(function initSeasonBootstrap() {
  const hookAwardXp = () => {
    if (typeof window.awardGameXp === 'function' && !window._ykSeasonXpHooked) {
      window._ykSeasonXpHooked = true;
      const origAward = window.awardGameXp;
      window.awardGameXp = function (resultType) {
        const res = origAward.apply(this, arguments);
        const sGain = resultType === 'win' ? 6 : (resultType === 'draw' ? 4 : 2);
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