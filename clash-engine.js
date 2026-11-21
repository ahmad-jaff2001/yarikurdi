/* === جەنگی قەڵاکان — YariKurdi Royal Clash Engine (AAA Trophy Edition 🏆) === */
(function initYariKurdiRoyalClash() {
  const CLASH_CARDS = [
    { id: 'knight', name: 'سوارچاکی قەڵا', role: 'بەرگری و هێرش', cost: 3, img: 'card-knight.png', type: 'troop', flying: false, targetBuildings: false, hp: 1050, dmg: 135, range: 36, speed: 58, hitSpeed: 1.05, count: 1, splash: 0, radius: 19, color: '#38bdf8' },
    { id: 'archer', name: 'تیرهاوێژی شاژن', role: 'تیرهاوێژی دوورمەودا', cost: 3, img: 'card-archer.png', type: 'troop', flying: false, targetBuildings: false, hp: 420, dmg: 92, range: 150, speed: 64, hitSpeed: 0.95, count: 2, splash: 0, radius: 16, color: '#34d399', proj: 'arrow' },
    { id: 'giant', name: 'زەبەلاحی بەردین', role: 'تەنها هێرشی قەڵا', cost: 5, img: 'card-giant.png', type: 'troop', flying: false, targetBuildings: true, hp: 2550, dmg: 195, range: 38, speed: 38, hitSpeed: 1.45, count: 1, splash: 0, radius: 25, color: '#f59e0b' },
    { id: 'wizard', name: 'جادووگەری ئاگر', role: 'هێرشی بەکۆمەڵ (Splash)', cost: 5, img: 'card-wizard.png', type: 'troop', flying: false, targetBuildings: false, hp: 580, dmg: 165, range: 142, speed: 56, hitSpeed: 1.3, count: 1, splash: 56, radius: 18, color: '#fb923c', proj: 'fireorb' },
    { id: 'dragon', name: 'ئەژدیهای ئاسمان', role: 'فڕیو • گڕی بەکۆمەڵ', cost: 4, img: 'card-dragon.png', type: 'troop', flying: true, targetBuildings: false, hp: 920, dmg: 128, range: 118, speed: 66, hitSpeed: 1.2, count: 1, splash: 50, radius: 21, color: '#a855f7', proj: 'dragonfire' },
    { id: 'bomber', name: 'بۆمبهاوێژی قەڵا', role: 'بۆمبی تەقینەوەی زەمینی', cost: 2, img: 'card-bomber.png', type: 'troop', flying: false, targetBuildings: false, hp: 380, dmg: 145, range: 128, speed: 60, hitSpeed: 1.35, count: 1, splash: 58, radius: 16, color: '#facc15', proj: 'bomb' },
    { id: 'skeletons', name: 'لەشکری ئێسک', role: '٦ جەنگاوەری خێرا', cost: 3, img: 'card-skeletons.png', type: 'troop', flying: false, targetBuildings: false, hp: 120, dmg: 56, range: 28, speed: 82, hitSpeed: 0.85, count: 6, splash: 0, radius: 12, color: '#cbd5e1' },
    { id: 'fireball', name: 'تۆپی ئاگرین', role: 'جادووی وێرانکەر', cost: 4, img: 'card-fireball.png', type: 'spell', flying: true, targetBuildings: false, hp: 0, dmg: 430, range: 0, speed: 0, hitSpeed: 0, count: 1, splash: 82, radius: 82, color: '#ef4444' }
  ];

  const ARENA_W = 420;
  const ARENA_H = 660;
  const RIVER_Y = 330;
  const BRIDGES_X = [96, 324];

  let myClashTrophies = Number(localStorage.getItem('yk_clash_trophies') || 0);
  let myClashWins = Number(localStorage.getItem('yk_clash_wins') || 0);
  let selectedCardIdx = 0;
  let clashMuted = false;
  let clashMode = 'bot';
  let onlineRoomId = null;
  let onlineSide = 'blue';
  let onlinePlaysRef = null;
  let onlineRoomRef = null;
  let onlineQueueRef = null;
  let processedPlayKeys = new Set();
  let animFrameId = null;
  let lastFrameTs = 0;
  let sfxCtx = null;
  let battle = null;

  let pointerHover = { active: false, x: 210, y: 460 };
  let dragState = { active: false, slotIdx: -1, x: 210, y: 460, overCanvas: false };

  const assets = {};
  const assetList = [
    ['arena', 'clash-arena.jpg'],
    ['tower-blue-side', 'tower-blue-side.png'],
    ['tower-blue-king', 'tower-blue-king.png'],
    ['tower-red-side', 'tower-red-side.png'],
    ['tower-red-king', 'tower-red-king.png'],
    ['tower-ruins', 'tower-ruins.png'],
    ...CLASH_CARDS.map(c => [c.id, c.img])
  ];

  function preloadAssets() {
    assetList.forEach(([key, src]) => {
      if (assets[key]) return;
      const img = new Image();
      img.src = src;
      assets[key] = img;
    });
  }

  function playSfx(type) {
    if (clashMuted) return;
    try {
      if (!sfxCtx) sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (sfxCtx.state === 'suspended') sfxCtx.resume();
      const now = sfxCtx.currentTime;
      const osc = sfxCtx.createOscillator();
      const gain = sfxCtx.createGain();
      osc.connect(gain);
      gain.connect(sfxCtx.destination);

      if (type === 'horn') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(146, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.65);
        osc.start(now); osc.stop(now + 0.68);
      } else if (type === 'deploy') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.13);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
        osc.start(now); osc.stop(now + 0.16);
      } else if (type === 'shoot') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(720, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.07);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.08);
        osc.start(now); osc.stop(now + 0.09);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.07);
        osc.start(now); osc.stop(now + 0.08);
      } else if (type === 'boom') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(135, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.38);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.4);
        osc.start(now); osc.stop(now + 0.42);
      } else if (type === 'crown' || type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.11);
        osc.frequency.setValueAtTime(783.99, now + 0.22);
        if (type === 'win') osc.frequency.setValueAtTime(1046.5, now + 0.34);
        gain.gain.setValueAtTime(0.26, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.58);
        osc.start(now); osc.stop(now + 0.6);
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.55);
        osc.start(now); osc.stop(now + 0.56);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.045);
        osc.start(now); osc.stop(now + 0.05);
      }
    } catch (e) {}
  }

  function getLeagueInfo(trophies) {
    if (trophies >= 1000) return { name: 'دیوەخانی ئەفسانەکان 👑', tier: 4, min: 1000, next: 2000 };
    if (trophies >= 600) return { name: 'قەڵای هەولێر 🏰', tier: 3, min: 600, next: 1000 };
    if (trophies >= 300) return { name: 'گۆڕەپانی گەرمیان ⚔️', tier: 2, min: 300, next: 600 };
    return { name: 'قەڵای شێروانە 🛡️', tier: 1, min: 0, next: 300 };
  }

  function syncMyTrophiesFromFirebase() {
    if (typeof db !== 'undefined' && typeof playerId !== 'undefined' && playerId) {
      db.ref('players/' + playerId).once('value', snap => {
        if (!snap.exists()) return;
        const d = snap.val();
        if (typeof d.clashTrophies === 'number') myClashTrophies = d.clashTrophies;
        if (typeof d.clashWins === 'number') myClashWins = d.clashWins;
        localStorage.setItem('yk_clash_trophies', myClashTrophies);
        localStorage.setItem('yk_clash_wins', myClashWins);
        updateLobbyStatsUI();
      });
    }
    updateLobbyStatsUI();
  }

  function saveTrophiesDelta(delta, isWin) {
    myClashTrophies = Math.max(0, myClashTrophies + delta);
    if (isWin) myClashWins += 1;
    localStorage.setItem('yk_clash_trophies', myClashTrophies);
    localStorage.setItem('yk_clash_wins', myClashWins);
    if (typeof db !== 'undefined' && typeof playerId !== 'undefined' && playerId) {
      db.ref('players/' + playerId).update({
        clashTrophies: myClashTrophies,
        clashWins: myClashWins
      });
    }
    if (typeof awardGameXp === 'function') {
      awardGameXp(isWin ? 'win' : (delta === 0 ? 'draw' : 'loss'));
    }
    updateLobbyStatsUI();
  }

  function updateLobbyStatsUI() {
    const lg = getLeagueInfo(myClashTrophies);
    const pct = Math.min(100, Math.round(((myClashTrophies - lg.min) / Math.max(1, lg.next - lg.min)) * 100));
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('clashMyTrophiesVal', myClashTrophies);
    set('clashLobbyTrophiesBig', myClashTrophies);
    set('clashLobbyWinsBig', myClashWins);
    set('clashLeagueName', `${lg.name} • ئاستی ${lg.tier}`);
    set('clashRoadNextLbl', `${myClashTrophies} / ${lg.next} 🏆`);
    const bar = document.getElementById('clashRoadBar');
    if (bar) bar.style.width = pct + '%';
  }

  function injectClashStyles() {
    if (document.getElementById('ykClashStyles')) return;
    const st = document.createElement('style');
    st.id = 'ykClashStyles';
    st.textContent = `
      @keyframes ykElixirGlow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
      }
      @keyframes ykBannerPop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.55); }
        18% { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
        82% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -62%) scale(0.95); }
      }
      @keyframes ykEmoteFloat {
        0% { opacity: 0; transform: scale(0.4) translateY(10px); }
        20% { opacity: 1; transform: scale(1.15) translateY(0); }
        80% { opacity: 1; transform: scale(1) translateY(-4px); }
        100% { opacity: 0; transform: scale(0.8) translateY(-16px); }
      }
      #view-clash {
        min-height: 100dvh;
        width: 100%;
        background:
          radial-gradient(ellipse 80% 45% at 50% 0%, rgba(168,85,247,0.38) 0%, transparent 65%),
          linear-gradient(180deg, #170330 0%, #090114 60%, #15022b 100%);
        color: #fff;
        user-select: none;
        -webkit-user-select: none;
      }
      .yk-clash-arena-frame {
        position: relative;
        width: 100%;
        max-width: 430px;
        aspect-ratio: 420 / 660;
        max-height: calc(100dvh - 190px);
        border-radius: 22px;
        overflow: hidden;
        border: 2.5px solid #facc15;
        box-shadow: 0 18px 50px rgba(0,0,0,0.9), 0 0 34px rgba(192,38,211,0.5), inset 0 0 18px rgba(250,204,21,0.25);
        background: #122c18;
        touch-action: none;
      }
      #ykClashCanvas {
        width: 100%;
        height: 100%;
        display: block;
        cursor: crosshair;
        touch-action: none;
      }
      .yk-clash-banner-pop {
        position: absolute;
        top: 46%;
        left: 50%;
        z-index: 30;
        pointer-events: none;
        white-space: nowrap;
        padding: 10px 22px;
        border-radius: 9999px;
        background: linear-gradient(135deg, rgba(44,6,84,0.95), rgba(15,2,32,0.96));
        border: 2px solid #fef08a;
        box-shadow: 0 10px 30px rgba(0,0,0,0.85), 0 0 28px rgba(250,204,21,0.75);
        font-size: 16px;
        font-weight: 900;
        color: #fef08a;
        text-shadow: 0 2px 8px rgba(0,0,0,0.95);
        animation: ykBannerPop 2.1s cubic-bezier(0.22,1,0.36,1) forwards;
      }
      .yk-clash-emote-bubble {
        position: absolute;
        z-index: 28;
        pointer-events: none;
        width: 52px;
        height: 52px;
        border-radius: 18px;
        background: rgba(255,255,255,0.96);
        border: 2.5px solid #facc15;
        box-shadow: 0 8px 24px rgba(0,0,0,0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        animation: ykEmoteFloat 2.2s ease-out forwards;
      }
      .yk-clash-hand-dock {
        width: 100%;
        max-width: 430px;
        background: linear-gradient(180deg, rgba(40,6,78,0.96), rgba(14,2,28,0.99));
        border: 2px solid rgba(250,204,21,0.72);
        border-radius: 20px;
        padding: 7px 9px 9px 9px;
        box-shadow: 0 12px 34px rgba(0,0,0,0.88), 0 0 26px rgba(192,38,211,0.4);
      }
      .yk-clash-card-slot {
        position: relative;
        aspect-ratio: 1 / 1.15;
        border-radius: 14px;
        overflow: hidden;
        border: 2px solid rgba(250,204,21,0.48);
        background: #1a0433;
        cursor: grab;
        touch-action: none;
        transition: transform 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
      }
      .yk-clash-card-slot.selected {
        transform: translateY(-7px) scale(1.06);
        border-color: #fef08a;
        box-shadow: 0 10px 24px rgba(250,204,21,0.78), 0 0 18px rgba(217,70,239,0.85);
        z-index: 5;
      }
      .yk-clash-card-slot.disabled {
        opacity: 0.45;
        filter: grayscale(0.75);
      }
      .yk-elixir-fill {
        background: linear-gradient(90deg, #9333ea 0%, #e879f9 55%, #f5d0fe 100%);
        box-shadow: 0 0 16px rgba(232,121,249,0.9);
        animation: ykElixirGlow 1.7s ease-in-out infinite;
        transition: width 0.08s linear;
      }
      .yk-elixir-ticks {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        pointer-events: none;
      }
      .yk-elixir-ticks span {
        border-left: 1px solid rgba(0,0,0,0.45);
      }
    `;
    document.head.appendChild(st);
  }

  function injectClashHubCard() {
    const hub = document.getElementById('view-hub');
    if (!hub || document.getElementById('ykHubClashCard')) return;
    const readyGrid = hub.querySelector('.grid');
    if (!readyGrid) return;

    const card = document.createElement('div');
    card.id = 'ykHubClashCard';
    card.onclick = () => window.switchView('clash');
    card.className = 'pito-game-card cursor-pointer';
    card.innerHTML = `
      <img src="card-knight.png" alt="جەنگی قەڵاکان" />
      <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow z-20">نوێ 🏆</span>
      <div class="pito-card-overlay">
        <span class="pito-card-title">جەنگی قەڵاکان</span>
      </div>
    `;
    readyGrid.prepend(card);
  }

  function injectClashViewSection() {
    if (document.getElementById('view-clash')) return;
    const sec = document.createElement('section');
    sec.id = 'view-clash';
    sec.className = 'hidden px-2.5 py-2.5 flex flex-col items-center';
    sec.setAttribute('dir', 'rtl');
    sec.innerHTML = `
      <!-- لۆبی شاهانەی جەنگی قەڵاکان -->
      <div id="clashLobbyPanel" class="w-full max-w-md space-y-3.5 my-auto py-3">
        <div class="flex items-center justify-between gap-2">
          <button onclick="switchView('hub')" class="px-3.5 py-2 rounded-xl bg-purple-950/90 border border-yellow-400/55 text-xs font-black text-yellow-200 shadow active:scale-95 transition">
            ↩ ناوەندی یارییەکان
          </button>
          <div class="flex items-center gap-1.5">
            <button onclick="clashToggleLeaderboard()" class="px-3 py-2 rounded-xl bg-purple-900/85 border border-yellow-400/50 text-xs font-black text-yellow-200 shadow active:scale-95 transition">
              🏆 ڕیزبەندی
            </button>
            <div class="px-3.5 py-1.5 rounded-full bg-[#1a0433] border-2 border-yellow-400 text-xs font-black text-yellow-300 shadow-[0_0_18px_rgba(250,204,21,0.45)]">
              🏆 <span id="clashMyTrophiesVal">0</span>
            </div>
          </div>
        </div>

        <div class="rounded-3xl p-4 sm:p-5 bg-gradient-to-b from-[#2b0854]/95 via-[#180330]/96 to-[#0e011d]/98 border-2 border-yellow-400/75 shadow-2xl text-center space-y-4">
          <div class="flex items-center justify-center gap-3">
            <div class="w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-yellow-300 via-fuchsia-500 to-amber-500 shadow-[0_0_28px_rgba(217,70,239,0.65)] shrink-0">
              <img src="card-knight.png" class="w-full h-full object-cover rounded-[13px]" alt="Clash" />
            </div>
            <div class="text-right flex-1">
              <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-amber-500 leading-tight">
                جەنگی قەڵاکان
              </h2>
              <p id="clashLeagueName" class="text-xs font-extrabold text-fuchsia-200 mt-1">قەڵای شێروانە 🛡️ • ئاستی ١</p>
              <div class="mt-2 space-y-1">
                <div class="flex justify-between text-[10px] font-bold text-yellow-200">
                  <span>ڕێگای کاسەکان</span>
                  <span id="clashRoadNextLbl">0 / 300 🏆</span>
                </div>
                <div class="w-full h-2.5 rounded-full bg-black/65 border border-yellow-400/40 overflow-hidden">
                  <div id="clashRoadBar" class="h-full bg-gradient-to-l from-yellow-300 via-amber-400 to-fuchsia-500 transition-all duration-500" style="width: 0%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5 text-xs">
            <div class="p-2.5 rounded-2xl bg-black/45 border border-yellow-400/35">
              <div class="text-purple-200 text-[10px] font-bold">کۆی کاسەکانت</div>
              <div class="text-lg font-black text-yellow-300 mt-0.5">🏆 <span id="clashLobbyTrophiesBig">0</span></div>
            </div>
            <div class="p-2.5 rounded-2xl bg-black/45 border border-yellow-400/35">
              <div class="text-purple-200 text-[10px] font-bold">سەرکەوتنەکانت</div>
              <div class="text-lg font-black text-emerald-300 mt-0.5">👑 <span id="clashLobbyWinsBig">0</span></div>
            </div>
          </div>

          <!-- دەستەی ٨ جەنگاوەرەکە (کلیک بۆ بینینی هێز) -->
          <div class="text-right space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-black text-yellow-200">
              <span>🃏 دەستەی جەنگاوەرەکانت (٨ کارت)</span>
              <span class="text-[10px] text-fuchsia-200 font-bold">کلیک بکە بۆ زانیاری</span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${CLASH_CARDS.map(c => `
                <button type="button" onclick="clashSelectCardInfo('${c.id}')" class="relative rounded-xl overflow-hidden border border-yellow-400/55 bg-purple-950 aspect-square hover:scale-105 transition active:scale-95">
                  <img src="${c.img}" class="w-full h-full object-cover" alt="${c.name}" />
                  <span class="absolute top-1 left-1 w-5 h-5 rounded-full bg-fuchsia-600 border border-yellow-200 text-[10px] font-black flex items-center justify-center shadow text-white">${c.cost}</span>
                  <div class="absolute inset-x-0 bottom-0 bg-black/80 text-[9px] font-black text-yellow-100 text-center py-0.5 truncate px-0.5">${c.name}</div>
                </button>
              `).join('')}
            </div>
            <div id="clashCardInfoBox" class="hidden mt-2 p-2.5 rounded-2xl bg-black/55 border border-yellow-400/45 text-[11px] flex items-center justify-between gap-2"></div>
          </div>

          <div class="space-y-2 pt-1">
            <button onclick="startClashMatch('bot')" class="w-full py-3.5 rounded-2xl bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 text-[#261002] font-black text-sm border border-yellow-100 shadow-[0_6px_26px_rgba(250,204,21,0.65)] hover:brightness-105 active:scale-95 transition">
              ⚔️ دەستپێکردنی شەڕی خێرا (+30 🏆)
            </button>
            <button onclick="startClashMatch('online')" class="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-700 hover:brightness-110 text-white font-black text-xs border border-yellow-300/60 shadow-lg active:scale-95 transition">
              🌍 شەڕی ئۆنلاین 1v1 (لەگەڵ یاریزانان)
            </button>
          </div>
        </div>

        <!-- ڕیزبەندی کاسەکانی جەنگی قەڵاکان -->
        <div id="clashLbCard" class="hidden rounded-3xl p-4 bg-[#17032d]/95 border-2 border-yellow-400/60 space-y-2.5 shadow-2xl">
          <div class="flex items-center justify-between border-b border-yellow-400/25 pb-2">
            <span class="text-sm font-black text-yellow-300">🏆 پاڵەوانانی جەنگی قەڵاکان</span>
            <button onclick="clashToggleLeaderboard()" class="text-xs font-black text-purple-200 hover:text-white">✕</button>
          </div>
          <div id="clashLbList" class="space-y-1.5 max-h-60 overflow-y-auto text-xs"></div>
        </div>
      </div>

      <!-- گەڕان بەدوای ڕکابەری ئۆنلاین -->
      <div id="clashSearchingPanel" class="hidden w-full max-w-sm my-auto rounded-3xl p-7 bg-[#1d0538] border-2 border-yellow-400 text-center space-y-5 shadow-2xl">
        <div class="text-5xl animate-bounce">⚔️</div>
        <h3 class="text-lg font-black text-yellow-300">گەڕان بەدوای ڕکابەرێکدا...</h3>
        <p class="text-xs text-purple-200 leading-relaxed">چاوەڕێی یاریزانێکی کوردین بۆ شەڕی ١ بەرامبەر ١</p>
        <div class="flex gap-2 justify-center">
          <button onclick="cancelClashOnlineSearch()" class="px-5 py-2.5 rounded-xl bg-rose-600/30 border border-rose-400 text-xs font-black text-rose-200">هەڵوەشاندنەوە ✕</button>
          <button onclick="cancelClashOnlineSearch(); startClashMatch('bot');" class="px-5 py-2.5 rounded-xl bg-amber-400 text-[#261002] text-xs font-black">شەڕ لەگەڵ بۆت ⚔️</button>
        </div>
      </div>

      <!-- مەیدانی شەڕی زیندوو -->
      <div id="clashBattlePanel" class="hidden w-full flex flex-col items-center gap-1.5">
        <!-- شریتی سەرەوە -->
        <div class="w-full max-w-[430px] flex items-center justify-between px-2.5 py-1.5 rounded-2xl bg-[#1a0433]/95 border border-yellow-400/60 shadow-lg">
          <div class="flex items-center gap-1.5">
            <button onclick="forfeitClashBattle()" class="px-2 py-1 rounded-lg bg-rose-600/85 text-[10px] font-black text-white shadow">🏳️</button>
            <button id="clashMuteBtn" onclick="clashToggleMute()" class="px-2 py-1 rounded-lg bg-purple-900/90 border border-yellow-400/35 text-[11px]">🔊</button>
            <div class="leading-tight">
              <div id="clashOppNameLabel" class="text-[11px] font-black text-rose-300 max-w-[105px] truncate">پاشای ڕکابەر</div>
              <div class="text-[10px] font-bold text-yellow-300">🏆 <span id="clashOppTrophiesLabel">0</span></div>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full border border-yellow-400/45 shadow-inner">
            <span class="text-xs font-black text-sky-300">👑 <span id="clashBlueCrowns">0</span></span>
            <span class="text-[10px] text-slate-400">VS</span>
            <span class="text-xs font-black text-rose-400"><span id="clashRedCrowns">0</span> 👑</span>
          </div>

          <div class="text-left min-w-[54px]">
            <div id="clashTimerText" class="font-mono text-sm font-black text-yellow-200">03:00</div>
            <div id="clashOvertimeTag" class="hidden text-[9px] font-black text-fuchsia-300 animate-pulse">⚡ 2x</div>
          </div>
        </div>

        <!-- کانڤاسی مەیدانی شەڕ -->
        <div id="clashArenaFrame" class="yk-clash-arena-frame">
          <canvas id="ykClashCanvas" width="420" height="660"></canvas>
          <!-- دوگمەی ئیمۆجی خێرا لە گۆشەی خوارەوە -->
          <div class="absolute bottom-2 left-2 z-20 flex items-center gap-1 bg-black/65 backdrop-blur-md px-1.5 py-1 rounded-full border border-yellow-400/45">
            <button type="button" onclick="clashSendEmote('👑')" class="w-6 h-6 text-sm hover:scale-125 transition">👑</button>
            <button type="button" onclick="clashSendEmote('🔥')" class="w-6 h-6 text-sm hover:scale-125 transition">🔥</button>
            <button type="button" onclick="clashSendEmote('😂')" class="w-6 h-6 text-sm hover:scale-125 transition">😂</button>
            <button type="button" onclick="clashSendEmote('👏')" class="w-6 h-6 text-sm hover:scale-125 transition">👏</button>
            <button type="button" onclick="clashSendEmote('😡')" class="w-6 h-6 text-sm hover:scale-125 transition">😡</button>
          </div>
        </div>

        <!-- دەستی ٤ کارتەکە + داهاتوو + ئێلیکسیر -->
        <div class="yk-clash-hand-dock space-y-1.5">
          <div class="flex items-center gap-2">
            <div class="flex flex-col items-center justify-center w-11 shrink-0">
              <span class="text-[9px] font-black text-yellow-200 mb-0.5">داهاتوو</span>
              <div class="w-10 h-11 rounded-lg overflow-hidden border border-yellow-400/55 bg-black/65 relative">
                <img id="clashNextCardImg" src="card-dragon.png" class="w-full h-full object-cover" alt="Next" />
                <span id="clashNextCardCost" class="absolute bottom-0 right-0 px-1 bg-fuchsia-700 text-[9px] font-black text-white">4</span>
              </div>
            </div>
            <div id="clashHandGrid" class="flex-1 grid grid-cols-4 gap-1.5"></div>
          </div>

          <!-- شریتی ئێلیکسیر بە ١٠ بەشەوە -->
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-gradient-to-b from-fuchsia-400 to-purple-800 border-2 border-yellow-200 flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(232,121,249,0.85)]">
              <span id="clashElixirNum">5</span>
            </div>
            <div class="flex-1 h-4 rounded-full bg-black/80 border border-fuchsia-400/60 overflow-hidden relative">
              <div id="clashElixirBar" class="yk-elixir-fill h-full rounded-full" style="width: 50%"></div>
              <div class="yk-elixir-ticks">${'<span></span>'.repeat(10)}</div>
            </div>
            <span id="clashElixirRateTag" class="text-[10px] font-black text-fuchsia-200 min-w-[38px] text-center">1x ⚡</span>
          </div>
        </div>
      </div>

      <!-- پەنجەرەی ئەنجامی کۆتایی و کاسەکان -->
      <div id="clashResultModal" class="hidden fixed inset-0 z-[9995] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
        <div class="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#2e0759] to-[#100120] border-2 border-yellow-400 text-center space-y-4 shadow-2xl">
          <div id="clashResIcon" class="text-6xl">🏆</div>
          <h3 id="clashResTitle" class="text-2xl font-black text-yellow-300">سەرکەوتنی شاهانە!</h3>
          <div id="clashResCrowns" class="text-lg font-black text-white">👑 3 - 0 👑</div>
          <div class="p-3.5 rounded-2xl bg-black/50 border border-yellow-400/45 space-y-1">
            <div class="text-xs text-purple-200 font-bold">گۆڕانکاری کاسەکانت:</div>
            <div id="clashResTrophyDelta" class="text-3xl font-black text-emerald-400">+30 🏆</div>
            <div class="text-xs font-black text-yellow-200">کۆی گشتی کاس: 🏆 <span id="clashResTotalTrophies">30</span></div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button onclick="closeClashResultAndLobby(); startClashMatch('bot');" class="py-3 rounded-2xl bg-gradient-to-b from-yellow-200 to-amber-500 text-[#261002] font-black text-xs shadow-lg">شەڕێکی تر ⚔️</button>
            <button onclick="closeClashResultAndLobby()" class="py-3 rounded-2xl bg-purple-900 border border-yellow-400/50 text-yellow-100 font-black text-xs">لۆبی 🏰</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(sec);
    bindArenaControls();
  }

  // ==================== زانیاری کارت و ڕیزبەندی کاسەکان ====================
  window.clashSelectCardInfo = function (cardId) {
    playSfx('click');
    const c = CLASH_CARDS.find(x => x.id === cardId);
    const box = document.getElementById('clashCardInfoBox');
    if (!c || !box) return;
    box.classList.remove('hidden');
    box.innerHTML = `
      <div class="flex items-center gap-2 text-right">
        <img src="${c.img}" class="w-10 h-10 rounded-xl border border-yellow-400 object-cover" />
        <div>
          <div class="font-black text-yellow-200">${c.name} <span class="text-fuchsia-300">(${c.cost} ئێلیکسیر)</span></div>
          <div class="text-[10px] text-purple-200">${c.role}</div>
        </div>
      </div>
      <div class="text-left text-[10px] font-bold space-y-0.5 shrink-0">
        ${c.hp > 0 ? `<div class="text-emerald-300">❤️ خوێن: ${c.hp}${c.count > 1 ? ' ×' + c.count : ''}</div>` : ''}
        <div class="text-amber-300">⚔️ زیان: ${c.dmg}</div>
      </div>
    `;
  };

  window.clashToggleLeaderboard = function () {
    playSfx('click');
    const card = document.getElementById('clashLbCard');
    const list = document.getElementById('clashLbList');
    if (!card || !list) return;
    card.classList.toggle('hidden');
    if (card.classList.contains('hidden')) return;

    list.innerHTML = '<div class="text-center text-purple-200 py-4">چاوەڕێبە...</div>';
    if (typeof db === 'undefined') {
      list.innerHTML = `<div class="p-2.5 rounded-xl bg-black/40 flex justify-between"><span>١. تۆ</span><span class="text-yellow-300 font-black">🏆 ${myClashTrophies}</span></div>`;
      return;
    }
    db.ref('players').once('value', snap => {
      const rows = [];
      snap.forEach(ch => {
        const v = ch.val() || {};
        rows.push({
          id: ch.key,
          name: v.name || v.username || 'یاریزان',
          trophies: Number(v.clashTrophies || 0),
          wins: Number(v.clashWins || 0)
        });
      });
      rows.sort((a, b) => b.trophies - a.trophies);
      const top = rows.slice(0, 15);
      if (top.length === 0) {
        list.innerHTML = '<div class="text-center text-purple-300 py-4">هێشتا کەس کاسى تۆمار نەکردووە</div>';
        return;
      }
      list.innerHTML = top.map((p, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
        const isMe = typeof playerId !== 'undefined' && p.id === playerId;
        return `
          <div class="flex items-center justify-between px-3 py-2 rounded-xl ${isMe ? 'bg-yellow-500/20 border border-yellow-400' : 'bg-black/35 border border-white/5'}">
            <div class="flex items-center gap-2">
              <span class="font-black text-yellow-300 w-6">${medal}</span>
              <span class="font-bold text-white">${p.name}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-emerald-300">👑 ${p.wins}</span>
              <span class="font-black text-yellow-300">🏆 ${p.trophies}</span>
            </div>
          </div>
        `;
      }).join('');
    });
  };

  window.clashToggleMute = function () {
    clashMuted = !clashMuted;
    const btn = document.getElementById('clashMuteBtn');
    if (btn) btn.textContent = clashMuted ? '🔇' : '🔊';
  };

  function showArenaBanner(text) {
    const frame = document.getElementById('clashArenaFrame');
    if (!frame) return;
    frame.querySelectorAll('.yk-clash-banner-pop').forEach(el => el.remove());
    const div = document.createElement('div');
    div.className = 'yk-clash-banner-pop';
    div.textContent = text;
    frame.appendChild(div);
    setTimeout(() => div.remove(), 2200);
  }

  function showEmoteBubble(side, emoji) {
    const frame = document.getElementById('clashArenaFrame');
    if (!frame) return;
    const div = document.createElement('div');
    div.className = 'yk-clash-emote-bubble';
    div.style.left = '50%';
    div.style.marginLeft = '-26px';
    div.style[side === 'blue' ? 'bottom' : 'top'] = '92px';
    div.textContent = emoji;
    frame.appendChild(div);
    setTimeout(() => div.remove(), 2250);
  }

  window.clashSendEmote = function (emoji) {
    playSfx('click');
    showEmoteBubble('blue', emoji);
    if (clashMode === 'online' && onlinePlaysRef) {
      onlinePlaysRef.push({ kind: 'emote', side: onlineSide, emoji, ts: Date.now() });
    } else if (battle && battle.running && Math.random() < 0.45) {
      const botReplies = ['👑', '🔥', '😂', '👏'];
      setTimeout(() => showEmoteBubble('red', botReplies[Math.floor(Math.random() * botReplies.length)]), 700);
    }
  };

  // ==================== دروستکردنی دۆخی شەڕ ====================
  function createBattleState(oppName, oppTrophies) {
    const deck = [...CLASH_CARDS].sort(() => Math.random() - 0.5);
    return {
      running: true,
      overtime: false,
      doubleNotified: false,
      timeLeft: 180,
      elixir: 5.5,
      botElixir: 5.5,
      botThink: 1.9,
      oppName: oppName || 'پاشای قەڵا (Bot)',
      oppTrophies: oppTrophies || 0,
      deck,
      hand: [0, 1, 2, 3],
      nextPtr: 4,
      towers: [
        { id: 'b_left', side: 'blue', isKing: false, x: 96, y: 495, hp: 1700, maxHp: 1700, range: 172, dmg: 80, cd: 0, hitSpeed: 0.9, radius: 30, flash: 0, recoil: 0, dead: false },
        { id: 'b_right', side: 'blue', isKing: false, x: 324, y: 495, hp: 1700, maxHp: 1700, range: 172, dmg: 80, cd: 0, hitSpeed: 0.9, radius: 30, flash: 0, recoil: 0, dead: false },
        { id: 'b_king', side: 'blue', isKing: true, x: 210, y: 582, hp: 3100, maxHp: 3100, range: 192, dmg: 112, cd: 0, hitSpeed: 1.0, radius: 38, awake: false, flash: 0, recoil: 0, dead: false },
        { id: 'r_left', side: 'red', isKing: false, x: 96, y: 165, hp: 1700, maxHp: 1700, range: 172, dmg: 80, cd: 0, hitSpeed: 0.9, radius: 30, flash: 0, recoil: 0, dead: false },
        { id: 'r_right', side: 'red', isKing: false, x: 324, y: 165, hp: 1700, maxHp: 1700, range: 172, dmg: 80, cd: 0, hitSpeed: 0.9, radius: 30, flash: 0, recoil: 0, dead: false },
        { id: 'r_king', side: 'red', isKing: true, x: 210, y: 78, hp: 3100, maxHp: 3100, range: 192, dmg: 112, cd: 0, hitSpeed: 1.0, radius: 38, awake: false, flash: 0, recoil: 0, dead: false }
      ],
      units: [],
      projectiles: [],
      particles: [],
      floatTexts: [],
      rings: [],
      shake: 0,
      waterPhase: 0
    };
  }

  function getValidDeployMinY(x) {
    if (!battle) return RIVER_Y + 18;
    const rLeft = battle.towers.find(t => t.id === 'r_left');
    const rRight = battle.towers.find(t => t.id === 'r_right');
    if (x < ARENA_W / 2 && rLeft && rLeft.dead) return 215;
    if (x >= ARENA_W / 2 && rRight && rRight.dead) return 215;
    return RIVER_Y + 18;
  }

  function renderHandUI() {
    if (!battle) return;
    const grid = document.getElementById('clashHandGrid');
    if (!grid) return;

    grid.innerHTML = battle.hand.map((deckIdx, slotIdx) => {
      const c = battle.deck[deckIdx];
      const afford = battle.elixir >= c.cost;
      const sel = selectedCardIdx === slotIdx;
      return `
        <div data-slot="${slotIdx}" class="yk-clash-card-slot ${sel ? 'selected' : ''} ${!afford ? 'disabled' : ''}">
          <img src="${c.img}" class="w-full h-full object-cover pointer-events-none" alt="${c.name}" />
          <span class="absolute top-1 left-1 w-5 h-5 rounded-full bg-fuchsia-600 border border-yellow-200 text-[11px] font-black text-white flex items-center justify-center shadow pointer-events-none">${c.cost}</span>
          <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent text-[9px] font-black text-yellow-100 text-center py-1 px-0.5 truncate pointer-events-none">${c.name}</div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.yk-clash-card-slot').forEach(el => {
      const slotIdx = Number(el.dataset.slot);
      el.onpointerdown = (ev) => {
        ev.preventDefault();
        selectedCardIdx = slotIdx;
        playSfx('click');
        renderHandUI();
        dragState = { active: true, slotIdx, x: 210, y: 460, overCanvas: false };
      };
    });

    const nextCard = battle.deck[battle.nextPtr % battle.deck.length];
    const nextImg = document.getElementById('clashNextCardImg');
    const nextCost = document.getElementById('clashNextCardCost');
    if (nextImg && nextCard) nextImg.src = nextCard.img;
    if (nextCost && nextCard) nextCost.textContent = nextCard.cost;
  }

  function getCanvasCoords(clientX, clientY) {
    const cvs = document.getElementById('ykClashCanvas');
    if (!cvs) return null;
    const r = cvs.getBoundingClientRect();
    const inside = clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    return {
      inside,
      x: Math.max(24, Math.min(ARENA_W - 24, ((clientX - r.left) / r.width) * ARENA_W)),
      y: Math.max(24, Math.min(ARENA_H - 24, ((clientY - r.top) / r.height) * ARENA_H))
    };
  }

  function bindArenaControls() {
    const cvs = document.getElementById('ykClashCanvas');
    if (!cvs || cvs.dataset.bound) return;
    cvs.dataset.bound = '1';

    cvs.addEventListener('pointerdown', (ev) => {
      if (!battle || !battle.running) return;
      const pos = getCanvasCoords(ev.clientX, ev.clientY);
      if (!pos) return;
      tryDeploySelectedCard(pos.x, pos.y);
    });

    cvs.addEventListener('pointermove', (ev) => {
      const pos = getCanvasCoords(ev.clientX, ev.clientY);
      if (pos && pos.inside) {
        pointerHover = { active: true, x: pos.x, y: pos.y };
      } else {
        pointerHover.active = false;
      }
    });
    cvs.addEventListener('pointerleave', () => { pointerHover.active = false; });

    window.addEventListener('pointermove', (ev) => {
      if (!dragState.active) return;
      const pos = getCanvasCoords(ev.clientX, ev.clientY);
      if (pos) {
        dragState.x = pos.x;
        dragState.y = pos.y;
        dragState.overCanvas = pos.inside;
      }
    });

    window.addEventListener('pointerup', (ev) => {
      if (!dragState.active) return;
      const pos = getCanvasCoords(ev.clientX, ev.clientY);
      const slot = dragState.slotIdx;
      dragState.active = false;
      if (pos && pos.inside && battle && battle.running) {
        selectedCardIdx = slot;
        tryDeploySelectedCard(pos.x, pos.y);
      }
    });
  }

  function tryDeploySelectedCard(rawX, rawY) {
    if (!battle || !battle.running) return;
    const deckIdx = battle.hand[selectedCardIdx];
    const card = battle.deck[deckIdx];
    if (!card) return;
    if (battle.elixir < card.cost) {
      spawnFloatText(rawX, rawY, 'ئێلیکسیر بەش ناکات!', '#f472b6');
      return;
    }

    let x = Math.max(28, Math.min(ARENA_W - 28, rawX));
    let y = Math.max(28, Math.min(ARENA_H - 28, rawY));
    if (card.type !== 'spell') {
      const minY = getValidDeployMinY(x);
      if (y < minY) y = minY;
    }

    battle.elixir -= card.cost;
    const nextDeckIdx = battle.nextPtr % battle.deck.length;
    battle.hand[selectedCardIdx] = nextDeckIdx;
    battle.nextPtr = (battle.nextPtr + 1) % battle.deck.length;
    renderHandUI();

    if (clashMode === 'online' && onlinePlaysRef) {
      const sendY = onlineSide === 'blue' ? y : (ARENA_H - y);
      onlinePlaysRef.push({
        kind: 'card',
        side: onlineSide,
        cardId: card.id,
        x: Math.round(x),
        y: Math.round(sendY),
        ts: Date.now()
      });
    }
    spawnCard('blue', card.id, x, y);
  }

  function spawnCard(side, cardId, x, y) {
    if (!battle || !battle.running) return;
    const card = CLASH_CARDS.find(c => c.id === cardId);
    if (!card) return;
    playSfx('deploy');

    if (card.type === 'spell') {
      const king = battle.towers.find(t => t.side === side && t.isKing);
      battle.projectiles.push({
        kind: 'fireball',
        side,
        sx: king ? king.x : 210,
        sy: king ? king.y : (side === 'blue' ? 580 : 80),
        x: king ? king.x : 210,
        y: king ? king.y : (side === 'blue' ? 580 : 80),
        tx: x,
        ty: y,
        progress: 0,
        duration: 0.72,
        dmg: card.dmg,
        splash: card.splash
      });
      battle.rings.push({ x, y, r: card.splash, maxR: card.splash, color: '#fb923c', life: 0.72, maxLife: 0.72, fill: true });
      return;
    }

    battle.rings.push({ x, y, r: 8, maxR: 42, color: side === 'blue' ? '#38bdf8' : '#fb7185', life: 0.5, maxLife: 0.5 });

    for (let i = 0; i < card.count; i++) {
      const angle = (i / Math.max(1, card.count)) * Math.PI * 2;
      const spread = card.count === 1 ? 0 : (card.count === 2 ? 18 : 24);
      const ux = Math.max(26, Math.min(ARENA_W - 26, x + Math.cos(angle) * spread));
      const uy = Math.max(26, Math.min(ARENA_H - 26, y + Math.sin(angle) * spread));
      battle.units.push({
        id: Math.random().toString(36).slice(2),
        cardId: card.id,
        side,
        x: ux,
        y: uy,
        hp: card.hp,
        maxHp: card.hp,
        dmg: card.dmg,
        range: card.range,
        speed: card.speed,
        hitSpeed: card.hitSpeed,
        cd: 0.2,
        deployDelay: 0.65,
        flying: card.flying,
        targetBuildings: card.targetBuildings,
        splash: card.splash,
        radius: card.radius,
        proj: card.proj || null,
        color: card.color,
        walkPhase: Math.random() * 6,
        attackAnim: 0,
        flash: 0
      });
    }
  }

  function spawnParticles(x, y, color, count, speed = 120) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = (0.3 + Math.random() * 0.8) * speed;
      battle.particles.push({
        x, y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        r: Math.random() * 4 + 2,
        color,
        life: 0.35 + Math.random() * 0.35,
        maxLife: 0.7
      });
    }
  }

  function spawnFloatText(x, y, text, color) {
    if (!battle) return;
    battle.floatTexts.push({ x, y, text, color, life: 0.85, maxLife: 0.85 });
  }

  // ==================== هۆشی دەستکردی زیرەکی ڕکابەر (BOT AI) ====================
  function updateBotAI(dt, elixirRate) {
    if (clashMode !== 'bot' || !battle || !battle.running) return;
    battle.botElixir = Math.min(10, battle.botElixir + dt * elixirRate);
    battle.botThink -= dt;
    if (battle.botThink > 0) return;

    const scale = Math.min(0.45, myClashTrophies / 2500);
    battle.botThink = Math.max(1.0, (2.4 - scale) + Math.random() * 1.1);

    // پشکنینی هێرشی یاریزان بۆ بەرگری
    const threats = battle.units.filter(u => u.side === 'blue' && u.y < RIVER_Y + 40);
    if (threats.length >= 3 && battle.botElixir >= 4) {
      const t = threats[0];
      battle.botElixir -= 4;
      spawnCard('red', 'fireball', t.x, t.y);
      return;
    }

    if (threats.length > 0 && battle.botElixir >= 3) {
      const t = threats[0];
      const defPool = t.cardId === 'giant' ? ['skeletons', 'knight', 'dragon'] : ['knight', 'archer', 'bomber', 'wizard'];
      const pick = CLASH_CARDS.find(c => c.id === defPool[Math.floor(Math.random() * defPool.length)]);
      if (pick && battle.botElixir >= pick.cost) {
        battle.botElixir -= pick.cost;
        const dx = Math.max(45, Math.min(ARENA_W - 45, t.x + (Math.random() * 30 - 15)));
        const dy = Math.max(115, Math.min(RIVER_Y - 24, t.y - 45));
        spawnCard('red', pick.id, dx, dy);
        return;
      }
    }

    if (battle.botElixir >= 5.5) {
      const pushCards = CLASH_CARDS.filter(c => c.type === 'troop' && c.cost <= battle.botElixir);
      if (pushCards.length > 0) {
        const pick = pushCards[Math.floor(Math.random() * pushCards.length)];
        battle.botElixir -= pick.cost;
        const laneX = Math.random() < 0.5 ? 96 : 324;
        const spawnY = pick.id === 'giant' ? 140 : 230 + Math.random() * 55;
        spawnCard('red', pick.id, laneX + (Math.random() * 24 - 12), spawnY);
      }
    }
  }

  // ==================== لۆجیکی شەڕ و پێکدادان ====================
  function damageEntity(target, amount, isTower) {
    if (!target || target.hp <= 0) return;
    target.hp = Math.max(0, target.hp - amount);
    target.flash = 0.14;
    if (isTower && target.isKing && !target.awake) {
      target.awake = true;
      showArenaBanner('👑 قەڵای پاشا بەئاگا هات!');
      playSfx('horn');
    }
    if (isTower && target.hp <= 0 && !target.dead) {
      onTowerDestroyed(target);
    }
  }

  function onTowerDestroyed(tower) {
    tower.dead = true;
    battle.shake = 14;
    playSfx('boom');
    playSfx('crown');
    spawnParticles(tower.x, tower.y, '#facc15', 28, 175);
    spawnParticles(tower.x, tower.y, '#fb7185', 22, 145);
    battle.rings.push({ x: tower.x, y: tower.y, r: 10, maxR: 92, color: '#fef08a', life: 0.65, maxLife: 0.65 });
    spawnFloatText(tower.x, tower.y - 18, '👑 +1 تاج!', '#fef08a');

    // بەئاگاهێنانی قەڵای پاشای هەمان لایەن
    const king = battle.towers.find(t => t.side === tower.side && t.isKing);
    if (king && !king.dead && !king.awake) {
      king.awake = true;
    }

    updateCrownsUI();

    // ئەگەر قەڵای پاشا ڕووخا یان لە کاتی زیادکراودا بووین -> کۆتایی یەکسەر!
    if (tower.isKing) {
      battle.towers.forEach(t => { if (t.side === tower.side) { t.hp = 0; t.dead = true; } });
      updateCrownsUI();
      endClashBattle(tower.side === 'red' ? 'blue' : 'red');
    } else if (battle.overtime) {
      endClashBattle(tower.side === 'red' ? 'blue' : 'red');
    }
  }

  function getCrownCounts() {
    if (!battle) return { blue: 0, red: 0 };
    const blue = battle.towers.filter(t => t.side === 'red' && t.dead).length;
    const red = battle.towers.filter(t => t.side === 'blue' && t.dead).length;
    return { blue, red };
  }

  function updateCrownsUI() {
    const c = getCrownCounts();
    const b = document.getElementById('clashBlueCrowns');
    const r = document.getElementById('clashRedCrowns');
    if (b) b.textContent = c.blue;
    if (r) r.textContent = c.red;
  }

  function findTargetForUnit(u) {
    const enemySide = u.side === 'blue' ? 'red' : 'blue';
    let best = null;
    let bestDist = Infinity;

    if (!u.targetBuildings) {
      for (const e of battle.units) {
        if (e.side !== enemySide || e.hp <= 0 || e.deployDelay > 0) continue;
        // جەنگاوەری زەمینی ناتوانێت لە ئەژدیهای فڕیو بدات ئەگەر مەودای کورت بێت
        if (e.flying && u.range < 70) continue;
        const d = Math.hypot(e.x - u.x, e.y - u.y);
        if (d < 155 && d < bestDist) {
          bestDist = d;
          best = { entity: e, isTower: false, dist: d };
        }
      }
    }
    if (best) return best;

    for (const t of battle.towers) {
      if (t.side !== enemySide || t.dead) continue;
      const d = Math.hypot(t.x - u.x, t.y - u.y);
      if (d < bestDist) {
        bestDist = d;
        best = { entity: t, isTower: true, dist: d };
      }
    }
    return best;
  }

  function stepBattle(dt) {
    if (!battle || !battle.running) return;
    battle.waterPhase += dt * 2.2;
    if (battle.shake > 0) battle.shake = Math.max(0, battle.shake - dt * 36);

    // کات و خێرایی ئێلیکسیر
    battle.timeLeft = Math.max(0, battle.timeLeft - dt);
    const isDouble = battle.overtime || battle.timeLeft <= 60;
    if (isDouble && !battle.doubleNotified) {
      battle.doubleNotified = true;
      showArenaBanner('⚡ ٢ هێندە ئێلیکسیر! (2x ELIXIR)');
      playSfx('horn');
      const ot = document.getElementById('clashOvertimeTag');
      const rt = document.getElementById('clashElixirRateTag');
      if (ot) ot.classList.remove('hidden');
      if (rt) rt.textContent = '2x 🔥';
    }

    const elixirRate = isDouble ? 0.72 : 0.36;
    const prevIntElixir = Math.floor(battle.elixir);
    battle.elixir = Math.min(10, battle.elixir + dt * elixirRate);
    if (Math.floor(battle.elixir) !== prevIntElixir) renderHandUI();

    // نوێکردنەوەی کاتژمێر و شریتی ئێلیکسیر
    const mm = String(Math.floor(battle.timeLeft / 60)).padStart(2, '0');
    const ss = String(Math.floor(battle.timeLeft % 60)).padStart(2, '0');
    const tEl = document.getElementById('clashTimerText');
    if (tEl) tEl.textContent = `${mm}:${ss}`;
    const eBar = document.getElementById('clashElixirBar');
    const eNum = document.getElementById('clashElixirNum');
    if (eBar) eBar.style.width = `${(battle.elixir / 10) * 100}%`;
    if (eNum) eNum.textContent = Math.floor(battle.elixir);

    if (battle.timeLeft <= 0) {
      const cr = getCrownCounts();
      if (cr.blue !== cr.red) {
        endClashBattle(cr.blue > cr.red ? 'blue' : 'red');
        return;
      }
      if (!battle.overtime) {
        battle.overtime = true;
        battle.timeLeft = 60;
        showArenaBanner('🔥 کاتی زیادکراو! یەک تاج = بردنەوە!');
        playSfx('horn');
      } else {
        // Tiebreaker بەپێی کەمترین خوێنی تاوەر
        const bMin = Math.min(...battle.towers.filter(t => t.side === 'blue' && !t.dead).map(t => t.hp));
        const rMin = Math.min(...battle.towers.filter(t => t.side === 'red' && !t.dead).map(t => t.hp));
        endClashBattle(bMin > rMin ? 'blue' : (rMin > bMin ? 'red' : 'draw'));
        return;
      }
    }

    updateBotAI(dt, elixirRate);

    // تەقەی قەڵاکان
    for (const t of battle.towers) {
      if (t.flash > 0) t.flash -= dt;
      if (t.recoil > 0) t.recoil = Math.max(0, t.recoil - dt * 18);
      if (t.dead) continue;
      if (t.isKing && !t.awake) continue;
      t.cd -= dt;
      if (t.cd > 0) continue;

      const enemySide = t.side === 'blue' ? 'red' : 'blue';
      let nearest = null;
      let minD = t.range;
      for (const u of battle.units) {
        if (u.side !== enemySide || u.hp <= 0 || u.deployDelay > 0) continue;
        const d = Math.hypot(u.x - t.x, u.y - t.y);
        if (d <= minD) { minD = d; nearest = u; }
      }
      if (nearest) {
        t.cd = t.hitSpeed;
        t.recoil = 5;
        playSfx('shoot');
        battle.projectiles.push({
          kind: t.isKing ? 'cannon' : 'arrow',
          side: t.side,
          x: t.x,
          y: t.y - 16,
          target: nearest,
          tx: nearest.x,
          ty: nearest.y,
          speed: t.isKing ? 340 : 410,
          dmg: t.dmg,
          splash: 0
        });
      }
    }

    // جووڵە و شەڕی جەنگاوەرەکان
    for (const u of battle.units) {
      if (u.hp <= 0) continue;
      if (u.flash > 0) u.flash -= dt;
      if (u.attackAnim > 0) u.attackAnim = Math.max(0, u.attackAnim - dt * 4);
      if (u.deployDelay > 0) {
        u.deployDelay -= dt;
        continue;
      }

      const tgt = findTargetForUnit(u);
      if (!tgt) continue;
      const e = tgt.entity;
      const effRange = u.range + (tgt.isTower ? e.radius : e.radius);

      if (tgt.dist <= effRange) {
        u.cd -= dt;
        if (u.cd <= 0) {
          u.cd = u.hitSpeed;
          u.attackAnim = 1;
          if (u.proj) {
            playSfx('shoot');
            battle.projectiles.push({
              kind: u.proj,
              side: u.side,
              x: u.x,
              y: u.y - (u.flying ? 16 : 6),
              target: e,
              isTowerTarget: tgt.isTower,
              tx: e.x,
              ty: e.y,
              speed: u.proj === 'bomb' ? 245 : 350,
              dmg: u.dmg,
              splash: u.splash
            });
          } else {
            playSfx('hit');
            damageEntity(e, u.dmg, tgt.isTower);
            spawnParticles(e.x, e.y, u.color, 5, 85);
            spawnFloatText(e.x, e.y - 14, `-${u.dmg}`, '#fef08a');
          }
        }
      } else {
        // ڕێدۆزینەوە بەسەر دوو پردەکەدا بۆ جەنگاوەرە زەمینییەکان
        let destX = e.x;
        let destY = e.y;
        if (!u.flying) {
          const needsCross = (u.y > RIVER_Y + 12 && e.y < RIVER_Y - 12) || (u.y < RIVER_Y - 12 && e.y > RIVER_Y + 12);
          if (needsCross) {
            const bridgeX = Math.abs(u.x - BRIDGES_X[0]) < Math.abs(u.x - BRIDGES_X[1]) ? BRIDGES_X[0] : BRIDGES_X[1];
            if (Math.abs(u.x - bridgeX) > 22) {
              destX = bridgeX;
              destY = u.y > RIVER_Y ? RIVER_Y + 18 : RIVER_Y - 18;
            } else {
              destX = bridgeX;
              destY = u.y > RIVER_Y ? RIVER_Y - 24 : RIVER_Y + 24;
            }
          }
        }
        const dx = destX - u.x;
        const dy = destY - u.y;
        const len = Math.hypot(dx, dy) || 1;
        u.x += (dx / len) * u.speed * dt;
        u.y += (dy / len) * u.speed * dt;
        u.walkPhase += dt * (u.speed * 0.16);
      }
    }

    // دوورخستنەوەی نەرم لە نێوان جەنگاوەرەکاندا (Separation)
    for (let i = 0; i < battle.units.length; i++) {
      const a = battle.units[i];
      if (a.hp <= 0) continue;
      for (let j = i + 1; j < battle.units.length; j++) {
        const b = battle.units[j];
        if (b.hp <= 0 || a.flying !== b.flying) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minSep = (a.radius + b.radius) * 0.85;
        const d = Math.hypot(dx, dy);
        if (d > 0.1 && d < minSep) {
          const push = (minSep - d) * 0.35;
          const nx = dx / d, ny = dy / d;
          a.x -= nx * push; a.y -= ny * push;
          b.x += nx * push; b.y += ny * push;
        }
      }
    }

    // لابردنی جەنگاوەرە کوژراوەکان
    battle.units = battle.units.filter(u => {
      if (u.hp <= 0) {
        spawnParticles(u.x, u.y, u.side === 'blue' ? '#38bdf8' : '#f43f5e', 10, 110);
        return false;
      }
      return true;
    });

    // تۆپ و تیر و تۆپی ئاگرین
    battle.projectiles = battle.projectiles.filter(p => {
      if (p.kind === 'fireball') {
        p.progress += dt / p.duration;
        const t = Math.min(1, p.progress);
        p.x = p.sx + (p.tx - p.sx) * t;
        p.y = p.sy + (p.ty - p.sy) * t - Math.sin(t * Math.PI) * 115;
        if (Math.random() < 0.7) spawnParticles(p.x, p.y, '#fb923c', 2, 45);
        if (p.progress >= 1) {
          playSfx('boom');
          battle.shake = 11;
          spawnParticles(p.tx, p.ty, '#f97316', 28, 190);
          spawnParticles(p.tx, p.ty, '#fef08a', 18, 140);
          battle.rings.push({ x: p.tx, y: p.ty, r: 12, maxR: p.splash, color: '#fb923c', life: 0.45, maxLife: 0.45 });
          const enemySide = p.side === 'blue' ? 'red' : 'blue';
          battle.units.forEach(u => {
            if (u.side !== enemySide || u.hp <= 0) return;
            const d = Math.hypot(u.x - p.tx, u.y - p.ty);
            if (d <= p.splash + u.radius) {
              damageEntity(u, p.dmg, false);
              spawnFloatText(u.x, u.y - 14, `-${p.dmg}`, '#fb923c');
              // پاڵپێوەنان (Knockback)
              const k = d > 1 ? 18 / d : 0;
              u.x = Math.max(24, Math.min(ARENA_W - 24, u.x + (u.x - p.tx) * k));
              u.y = Math.max(24, Math.min(ARENA_H - 24, u.y + (u.y - p.ty) * k));
            }
          });
          battle.towers.forEach(tw => {
            if (tw.side !== enemySide || tw.dead) return;
            if (Math.hypot(tw.x - p.tx, tw.y - p.ty) <= p.splash + tw.radius) {
              const tDmg = Math.round(p.dmg * 0.45);
              damageEntity(tw, tDmg, true);
              spawnFloatText(tw.x, tw.y - 20, `-${tDmg}`, '#fb923c');
            }
          });
          return false;
        }
        return true;
      }

      if (p.target && p.target.hp > 0) {
        p.tx = p.target.x;
        p.ty = p.target.y;
      }
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= p.speed * dt + 8) {
        const enemySide = p.side === 'blue' ? 'red' : 'blue';
        if (p.splash > 0) {
          playSfx(p.kind === 'bomb' ? 'boom' : 'hit');
          spawnParticles(p.tx, p.ty, p.kind === 'dragonfire' ? '#e879f9' : '#f97316', 12, 120);
          battle.rings.push({ x: p.tx, y: p.ty, r: 6, maxR: p.splash, color: '#fb923c', life: 0.28, maxLife: 0.28 });
          battle.units.forEach(u => {
            if (u.side === enemySide && u.hp > 0 && Math.hypot(u.x - p.tx, u.y - p.ty) <= p.splash + u.radius) {
              damageEntity(u, p.dmg, false);
            }
          });
          battle.towers.forEach(tw => {
            if (tw.side === enemySide && !tw.dead && Math.hypot(tw.x - p.tx, tw.y - p.ty) <= p.splash + tw.radius) {
              damageEntity(tw, p.dmg, true);
            }
          });
        } else if (p.target && p.target.hp > 0) {
          playSfx('hit');
          damageEntity(p.target, p.dmg, !!p.isTowerTarget);
          spawnParticles(p.tx, p.ty, '#fef08a', 4, 70);
        }
        return false;
      }
      p.x += (dx / dist) * p.speed * dt;
      p.y += (dy / dist) * p.speed * dt;
      return true;
    });

    // نوێکردنەوەی گەردیلە و بازنە و نووسینەکان
    battle.particles = battle.particles.filter(pt => {
      pt.x += pt.vx * dt; pt.y += pt.vy * dt;
      pt.vx *= 0.94; pt.vy *= 0.94;
      pt.life -= dt;
      return pt.life > 0;
    });
    battle.rings = battle.rings.filter(rg => { rg.life -= dt; return rg.life > 0; });
    battle.floatTexts = battle.floatTexts.filter(ft => { ft.y -= dt * 36; ft.life -= dt; return ft.life > 0; });
  }

  // ==================== نەخشاندنی سینەمایی 60FPS ====================
  function drawBattle() {
    const cvs = document.getElementById('ykClashCanvas');
    if (!cvs || !battle) return;
    const ctx = cvs.getContext('2d');
    ctx.save();

    if (battle.shake > 0.2) {
      ctx.translate((Math.random() - 0.5) * battle.shake, (Math.random() - 0.5) * battle.shake);
    }

    // ١. وێنەی گۆڕەپانەکە (clash-arena.jpg)
    const arenaImg = assets['arena'];
    if (arenaImg && arenaImg.complete && arenaImg.naturalWidth > 0) {
      ctx.drawImage(arenaImg, 0, 0, ARENA_W, ARENA_H);
    } else {
      ctx.fillStyle = '#1b4324';
      ctx.fillRect(0, 0, ARENA_W, ARENA_H);
    }

    // ٢. بریقەی نەرمی ڕووبارەکە لە ناوەڕاستدا
    ctx.save();
    ctx.globalAlpha = 0.14 + 0.08 * Math.sin(battle.waterPhase);
    const riverGrad = ctx.createLinearGradient(0, RIVER_Y - 14, 0, RIVER_Y + 14);
    riverGrad.addColorStop(0, 'transparent');
    riverGrad.addColorStop(0.5, '#67e8f9');
    riverGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = riverGrad;
    ctx.fillRect(0, RIVER_Y - 14, ARENA_W, 28);
    ctx.restore();

    // ٣. پیشاندانی ناوچەی قەدەغەکراو و بازنەی دانان لە کاتی ڕاکێشان یان هەڵبژاردنی کارت
    const activeCard = battle.deck[battle.hand[selectedCardIdx]];
    const previewPos = dragState.active && dragState.overCanvas ? dragState : (pointerHover.active ? pointerHover : null);
    if (activeCard && (dragState.active || pointerHover.active)) {
      if (activeCard.type !== 'spell') {
        const rLeftDead = battle.towers.find(t => t.id === 'r_left')?.dead;
        const rRightDead = battle.towers.find(t => t.id === 'r_right')?.dead;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.fillRect(0, 0, ARENA_W / 2, rLeftDead ? 215 : RIVER_Y + 14);
        ctx.fillRect(ARENA_W / 2, 0, ARENA_W / 2, rRightDead ? 215 : RIVER_Y + 14);
      }
      if (previewPos) {
        const px = previewPos.x;
        const py = activeCard.type === 'spell' ? previewPos.y : Math.max(getValidDeployMinY(px), previewPos.y);
        const pr = activeCard.type === 'spell' ? activeCard.splash : activeCard.radius + 10;
        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = activeCard.type === 'spell' ? 'rgba(249, 115, 22, 0.24)' : 'rgba(56, 189, 248, 0.22)';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = activeCard.type === 'spell' ? '#fde047' : '#7dd3fc';
        ctx.stroke();
        ctx.restore();
      }
    }

    // ٤. بازنەکانی تەقینەوە و بانگهێشت
    for (const rg of battle.rings) {
      const p = 1 - rg.life / rg.maxLife;
      const curR = rg.fill ? rg.maxR : (rg.r + (rg.maxR - rg.r) * p);
      ctx.save();
      ctx.globalAlpha = Math.max(0, rg.life / rg.maxLife);
      ctx.beginPath();
      ctx.arc(rg.x, rg.y, curR, 0, Math.PI * 2);
      if (rg.fill) {
        ctx.fillStyle = 'rgba(249,115,22,0.22)';
        ctx.fill();
      }
      ctx.lineWidth = 3;
      ctx.strokeStyle = rg.color;
      ctx.stroke();
      ctx.restore();
    }

    // ٥. قەڵاکان (بە وێنە ٣ ڕەهەندییەکانت)
    for (const t of battle.towers) {
      const imgKey = t.dead
        ? 'tower-ruins'
        : `tower-${t.side}-${t.isKing ? 'king' : 'side'}`;
      const img = assets[imgKey];
      const size = t.isKing ? 96 : 78;
      const recoilY = t.side === 'blue' ? t.recoil : -t.recoil;

      // سێبەری قەڵا
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      ctx.beginPath();
      ctx.ellipse(t.x, t.y + size * 0.34, size * 0.42, size * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      if (img && img.complete && img.naturalWidth > 0) {
        if (t.flash > 0) ctx.filter = 'brightness(1.85)';
        ctx.drawImage(img, t.x - size / 2, t.y - size / 2 + recoilY, size, size);
        ctx.filter = 'none';
      } else {
        ctx.fillStyle = t.dead ? '#475569' : (t.side === 'blue' ? '#0284c7' : '#dc2626');
        ctx.fillRect(t.x - 26, t.y - 26, 52, 52);
      }
      ctx.restore();

      // شریتی خوێنی قەڵا
      if (!t.dead) {
        const bw = t.isKing ? 68 : 54;
        const bh = 8;
        const bx = t.x - bw / 2;
        const by = t.y - size * 0.52;
        ctx.fillStyle = 'rgba(10, 5, 22, 0.85)';
        ctx.fillRect(bx - 1, by - 1, bw + 2, bh + 2);
        ctx.fillStyle = t.side === 'blue' ? '#38bdf8' : '#f43f5e';
        ctx.fillRect(bx, by, bw * (t.hp / t.maxHp), bh);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9.5px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(Math.ceil(t.hp), t.x, by - 2);
      }
    }

    // ٦. جەنگاوەرەکان (زەمینی پاشان فڕیو بۆ قووڵیی 3D)
    const sortedUnits = [...battle.units].sort((a, b) => (a.flying - b.flying) || (a.y - b.y));
    for (const u of sortedUnits) {
      const hover = u.flying ? (15 + Math.sin(u.walkPhase * 1.4) * 4) : Math.abs(Math.sin(u.walkPhase)) * 3.5;
      const lunge = u.attackAnim > 0 ? Math.sin(u.attackAnim * Math.PI) * 6 * (u.side === 'blue' ? -1 : 1) : 0;
      const drawY = u.y - hover + lunge;

      // سێبەر لەسەر زەوی
      ctx.fillStyle = u.flying ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.ellipse(u.x, u.y + u.radius * 0.55, u.radius * 0.85, u.radius * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // بازنەی ئامادەبوون (Deploy Clock)
      if (u.deployDelay > 0) {
        ctx.save();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(u.x, drawY, u.radius + 5, -Math.PI / 2, -Math.PI / 2 + (1 - u.deployDelay / 0.65) * Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // مەدالیای ٣ ڕەهەندی بە وێنەی جەنگاوەرەکەت
      ctx.save();
      ctx.beginPath();
      ctx.arc(u.x, drawY, u.radius, 0, Math.PI * 2);
      ctx.clip();
      const cImg = assets[u.cardId];
      if (cImg && cImg.complete && cImg.naturalWidth > 0) {
        if (u.flash > 0) ctx.filter = 'brightness(2)';
        ctx.drawImage(cImg, u.x - u.radius, drawY - u.radius, u.radius * 2, u.radius * 2);
        ctx.filter = 'none';
      } else {
        ctx.fillStyle = u.color;
        ctx.fillRect(u.x - u.radius, drawY - u.radius, u.radius * 2, u.radius * 2);
      }
      ctx.restore();

      // چوارچێوەی تیم (شین و زێڕین بۆ تۆ / سوور و مۆر بۆ بەرامبەر)
      ctx.save();
      ctx.beginPath();
      ctx.arc(u.x, drawY, u.radius, 0, Math.PI * 2);
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = u.side === 'blue' ? '#38bdf8' : '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.shadowColor = u.side === 'blue' ? '#38bdf8' : '#f43f5e';
      ctx.stroke();
      ctx.restore();

      // شریتی خوێنی جەنگاوەر
      if (u.hp < u.maxHp || u.maxHp >= 900) {
        const bw = Math.max(24, u.radius * 1.8);
        const bx = u.x - bw / 2;
        const by = drawY - u.radius - 8;
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(bx - 1, by - 1, bw + 2, 5.5);
        ctx.fillStyle = u.side === 'blue' ? '#38bdf8' : '#fb7185';
        ctx.fillRect(bx, by, bw * (u.hp / u.maxHp), 3.5);
      }
    }

    // ٧. تۆپ و تیر و تۆپی ئاگرین
    for (const p of battle.projectiles) {
      ctx.save();
      if (p.kind === 'fireball') {
        const g = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, 22);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.35, '#fef08a');
        g.addColorStop(0.7, '#f97316');
        g.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'cannon') {
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (p.kind === 'bomb') {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(p.x + 3, p.y - 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.kind === 'fireorb' || p.kind === 'dragonfire') {
        ctx.fillStyle = p.kind === 'dragonfire' ? '#e879f9' : '#fb923c';
        ctx.shadowBlur = 12;
        ctx.shadowColor = ctx.fillStyle;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // تیر
        const ang = Math.atan2(p.ty - p.y, p.tx - p.x);
        ctx.translate(p.x, p.y);
        ctx.rotate(ang);
        ctx.strokeStyle = p.side === 'blue' ? '#7dd3fc' : '#fda4af';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(-9, 0);
        ctx.lineTo(7, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ٨. گەردیلەکانی تەقینەوە
    for (const pt of battle.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ٩. ژمارەی زیان و تاج
    for (const ft of battle.floatTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
      ctx.font = '900 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      ctx.lineWidth = 3;
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  function battleLoop(ts) {
    if (!battle || !battle.running) return;
    const dt = Math.min(0.05, (ts - lastFrameTs) / 1000 || 0.016);
    lastFrameTs = ts;
    stepBattle(dt);
    drawBattle();
    animFrameId = requestAnimationFrame(battleLoop);
  }

  // ==================== دەستپێکردن، ئۆنلاین و کۆتایی شەڕ ====================
  function showBattleScreen(oppName, oppTrophies) {
    document.getElementById('clashLobbyPanel').classList.add('hidden');
    document.getElementById('clashSearchingPanel').classList.add('hidden');
    document.getElementById('clashResultModal').classList.add('hidden');
    document.getElementById('clashBattlePanel').classList.remove('hidden');

    document.getElementById('clashOppNameLabel').textContent = oppName;
    document.getElementById('clashOppTrophiesLabel').textContent = oppTrophies;
    document.getElementById('clashOvertimeTag').classList.add('hidden');
    const rt = document.getElementById('clashElixirRateTag');
    if (rt) rt.textContent = '1x ⚡';

    battle = createBattleState(oppName, oppTrophies);
    selectedCardIdx = 0;
    updateCrownsUI();
    renderHandUI();
    playSfx('horn');
    showArenaBanner('⚔️ جەنگی قەڵاکان دەستی پێکرد!');

    if (animFrameId) cancelAnimationFrame(animFrameId);
    lastFrameTs = performance.now();
    animFrameId = requestAnimationFrame(battleLoop);
  }

  window.startClashMatch = function (mode) {
    preloadAssets();
    clashMode = mode;
    if (mode === 'bot') {
      const botNames = ['پاشای قەڵا', 'سوارچاکی گەرمیان', 'شێری هەولێر', 'مامۆستای شێروانە'];
      const bName = botNames[Math.floor(Math.random() * botNames.length)] + ' (Bot)';
      const bTroph = Math.max(0, myClashTrophies + Math.floor(Math.random() * 60 - 25));
      showBattleScreen(bName, bTroph);
      return;
    }

    // شەڕی ئۆنلاین 1v1 بە Firebase
    if (typeof db === 'undefined' || typeof playerId === 'undefined' || !playerId) {
      alert('بۆ یاریی ئۆنلاین دەبێت لە ئەکاونتەکەتدا بیت!');
      return;
    }

    document.getElementById('clashLobbyPanel').classList.add('hidden');
    document.getElementById('clashSearchingPanel').classList.remove('hidden');
    processedPlayKeys = new Set();

    const myName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزان';
    const qRef = db.ref('clashQueue');
    qRef.once('value', snap => {
      let matched = null;
      snap.forEach(ch => {
        if (ch.key !== playerId && !matched) {
          matched = { id: ch.key, ...ch.val() };
        }
      });

      if (matched) {
        qRef.child(matched.id).remove();
        const rId = 'cr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        db.ref('clashRooms/' + rId).set({
          blue: { id: matched.id, name: matched.name, trophies: matched.trophies || 0 },
          red: { id: playerId, name: myName, trophies: myClashTrophies },
          status: 'active',
          createdAt: Date.now()
        }).then(() => {
          db.ref('clashInvites/' + matched.id).set({ roomId: rId, oppName: myName, oppTrophies: myClashTrophies });
          joinOnlineClashRoom(rId, 'red', matched.name, matched.trophies || 0);
        });
      } else {
        onlineQueueRef = qRef.child(playerId);
        onlineQueueRef.onDisconnect().remove();
        onlineQueueRef.set({ name: myName, trophies: myClashTrophies, ts: Date.now() });

        const invRef = db.ref('clashInvites/' + playerId);
        invRef.on('value', s => {
          const inv = s.val();
          if (inv && inv.roomId) {
            invRef.off();
            invRef.remove();
            if (onlineQueueRef) onlineQueueRef.remove();
            joinOnlineClashRoom(inv.roomId, 'blue', inv.oppName || 'ڕکابەر', inv.oppTrophies || 0);
          }
        });
      }
    });
  };

  function joinOnlineClashRoom(rId, mySide, oppName, oppTrophies) {
    onlineRoomId = rId;
    onlineSide = mySide;
    processedPlayKeys = new Set();
    showBattleScreen(oppName, oppTrophies);

    onlinePlaysRef = db.ref(`clashRooms/${rId}/plays`);
    onlinePlaysRef.on('child_added', snap => {
      if (processedPlayKeys.has(snap.key)) return;
      processedPlayKeys.add(snap.key);
      const ev = snap.val();
      if (!ev || ev.side === onlineSide) return;
      if (ev.kind === 'emote') {
        showEmoteBubble('red', ev.emoji);
      } else if (ev.kind === 'card' && battle && battle.running) {
        const localY = onlineSide === 'blue' ? ev.y : (ARENA_H - ev.y);
        spawnCard('red', ev.cardId, ev.x, localY);
      } else if (ev.kind === 'forfeit' && battle && battle.running) {
        endClashBattle('blue');
      }
    });
  }

  window.cancelClashOnlineSearch = function () {
    if (onlineQueueRef) onlineQueueRef.remove();
    if (typeof db !== 'undefined' && typeof playerId !== 'undefined' && playerId) {
      db.ref('clashInvites/' + playerId).off();
    }
    document.getElementById('clashSearchingPanel').classList.add('hidden');
    document.getElementById('clashLobbyPanel').classList.remove('hidden');
  };

  function cleanupOnlineRoom() {
    if (onlinePlaysRef) { onlinePlaysRef.off(); onlinePlaysRef = null; }
    if (onlineRoomRef) { onlineRoomRef.off(); onlineRoomRef = null; }
    onlineRoomId = null;
  }

  window.forfeitClashBattle = function () {
    if (!battle || !battle.running) return;
    if (clashMode === 'online' && onlinePlaysRef) {
      onlinePlaysRef.push({ kind: 'forfeit', side: onlineSide, ts: Date.now() });
    }
    endClashBattle('red');
  };

  function endClashBattle(winner) {
    if (!battle || !battle.running) return;
    battle.running = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    cleanupOnlineRoom();

    const cr = getCrownCounts();
    let delta = 0;
    let title = 'یەکسانبوون!';
    let icon = '🤝';
    let deltaColor = 'text-yellow-300';

    if (winner === 'blue') {
      delta = 30;
      title = 'سەرکەوتنی شاهانە!';
      icon = '🏆';
      deltaColor = 'text-emerald-400';
      playSfx('win');
    } else if (winner === 'red') {
      delta = myClashTrophies > 0 ? -Math.min(18, myClashTrophies) : 0;
      title = 'دۆڕایت!';
      icon = '💔';
      deltaColor = 'text-rose-400';
      playSfx('lose');
    }

    saveTrophiesDelta(delta, winner === 'blue');

    document.getElementById('clashResIcon').textContent = icon;
    document.getElementById('clashResTitle').textContent = title;
    document.getElementById('clashResCrowns').textContent = `👑 ${cr.blue}  -  ${cr.red} 👑`;
    const dEl = document.getElementById('clashResTrophyDelta');
    dEl.className = `text-3xl font-black ${deltaColor}`;
    dEl.textContent = `${delta >= 0 ? '+' : ''}${delta} 🏆`;
    document.getElementById('clashResTotalTrophies').textContent = myClashTrophies;
    document.getElementById('clashResultModal').classList.remove('hidden');
  }

  window.closeClashResultAndLobby = function () {
    document.getElementById('clashResultModal').classList.add('hidden');
    document.getElementById('clashBattlePanel').classList.add('hidden');
    document.getElementById('clashLobbyPanel').classList.remove('hidden');
    updateLobbyStatsUI();
  };

  // ==================== بەستنەوەی بێ کێشە بە switchViewـی پلاتفۆرم ====================
  function patchSwitchView() {
    if (typeof window.switchView !== 'function' || window.switchView.__ykClashPatched) return;
    const origSwitch = window.switchView;
    window.switchView = function (view, subTab) {
      const clashSec = document.getElementById('view-clash');
      const topBar = document.getElementById('ykCleanTopBar');
      const dock = document.querySelector('.floating-bottom-dock');

      if (view === 'clash') {
        origSwitch('hub', subTab);
        const hub = document.getElementById('view-hub');
        if (hub) hub.classList.add('hidden');
        if (clashSec) clashSec.classList.remove('hidden');
        if (topBar) topBar.style.display = 'none';
        if (dock) dock.style.display = 'none';
        syncMyTrophiesFromFirebase();
        return;
      }

      if (battle && battle.running) {
        battle.running = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);
        cleanupOnlineRoom();
      }
      if (clashSec) clashSec.classList.add('hidden');
      const isOtherGame = ['chess', 'domino', 'konkan', 'ludo'].includes(view);
      if (topBar) topBar.style.display = isOtherGame ? 'none' : '';
      origSwitch(view, subTab);
    };
    window.switchView.__ykClashPatched = true;
  }

  function bootClash() {
    preloadAssets();
    injectClashStyles();
    injectClashHubCard();
    injectClashViewSection();
    patchSwitchView();
    setTimeout(patchSwitchView, 600);
    setTimeout(syncMyTrophiesFromFirebase, 1200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootClash);
  } else {
    bootClash();
  }
})();