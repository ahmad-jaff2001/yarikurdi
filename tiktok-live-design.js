// =========================================================
// YariKurdi — TikTok Audio LIVE Magical Design Engine
// 5 Realistic Magical Backgrounds + PK + Treasure Box + Top 3 + Ambient Rain
// =========================================================

const YK_MAGICAL_BACKGROUNDS = [
  {
    id: 'magic_castle',
    name: 'قەڵای ئەفسووناویی شەو',
    subtitle: 'ئەستێرەباران و کرمی شەوق',
    localUrl: 'backgrounds/bg1.jpg',
    fallbackUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sherwana_Castle.jpg?width=1080',
    particleMode: 'fireflies',
    tint: 'rgba(15, 10, 32, 0.42)',
    accent: '#fde047'
  },
  {
    id: 'magic_lake',
    name: 'چایخانەی دەریاچە و باران',
    subtitle: 'بارانی هێمن و ئارامیی ڕۆح',
    localUrl: 'backgrounds/bg2.jpg',
    fallbackUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dokan_Lake.jpg?width=1080',
    particleMode: 'rain',
    tint: 'rgba(6, 18, 28, 0.44)',
    accent: '#38bdf8'
  },
  {
    id: 'magic_aurora',
    name: 'شەفەقی جەمسەری و شاخ',
    subtitle: 'شەپۆلی سەوز و بەفربارین',
    localUrl: 'backgrounds/bg3.jpg',
    fallbackUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Amadiya_2009.jpg?width=1080',
    particleMode: 'aurora_snow',
    tint: 'rgba(5, 16, 26, 0.38)',
    accent: '#34d399'
  },
  {
    id: 'magic_lanterns',
    name: 'ڕووباری فانۆسە فڕیوەکان',
    subtitle: 'ئاسمانی ئەفسووناوی و هیوا',
    localUrl: 'backgrounds/bg4.jpg',
    fallbackUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Erbil_Citadel_and_Machko_tea_house.jpg?width=1080',
    particleMode: 'lanterns',
    tint: 'rgba(18, 9, 6, 0.40)',
    accent: '#fb923c'
  },
  {
    id: 'magic_terrace',
    name: 'تەراسەی شاهانەی مانگەشەو',
    subtitle: 'دیوەخانی VIP و تیشکی مانگ',
    localUrl: 'backgrounds/bg5.jpg',
    fallbackUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gali_Ali_Beg_Waterfall.jpg?width=1080',
    particleMode: 'moon_dust',
    tint: 'rgba(10, 10, 24, 0.42)',
    accent: '#e879f9'
  }
];

let ykTtPkState = null;
let ykTtBoxState = null;
let ykTtPkTimerInterval = null;
let ykTtBoxTimerInterval = null;
let ykTtPkRef = null;
let ykTtBoxRef = null;
let ykTtAmbientNode = null;
let ykTtAmbientCtx = null;
let ykTtAmbientOn = false;
let ykTtParticleFrame = null;

function injectTikTokAudioLiveStyles() {
  if (document.getElementById('ykTikTokLiveCss')) return;
  const st = document.createElement('style');
  st.id = 'ykTikTokLiveCss';
  st.textContent = `
    @keyframes ykSlowBreatheBg {
      0% { transform: scale(1.0); }
      50% { transform: scale(1.07); }
      100% { transform: scale(1.0); }
    }
    @keyframes ykTtRipple1 {
      0% { transform: scale(1); opacity: 0.85; }
      100% { transform: scale(1.52); opacity: 0; }
    }
    @keyframes ykTtRipple2 {
      0% { transform: scale(1); opacity: 0.65; }
      100% { transform: scale(1.75); opacity: 0; }
    }
    @keyframes ykEqBar {
      0%, 100% { height: 4px; }
      50% { height: 13px; }
    }
    @keyframes ykChestPulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.1) rotate(-6deg); }
      75% { transform: scale(1.1) rotate(6deg); }
    }
    .yk-tt-photo-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      animation: ykSlowBreatheBg 24s ease-in-out infinite;
      transition: opacity 0.6s ease;
    }
    .yk-tt-seat-circle {
      background: rgba(15, 16, 26, 0.42);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(255, 255, 255, 0.22);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.18);
    }
    .yk-tt-seat-circle:hover {
      border-color: rgba(254, 240, 138, 0.7);
      background: rgba(250, 204, 21, 0.14);
    }
    .yk-tt-ring-live {
      background: linear-gradient(135deg, #fe2c55, #ff6b81, #25f4ee);
    }
    .yk-tt-ripple-a {
      position: absolute;
      inset: -2px;
      border-radius: 9999px;
      border: 2px solid #25f4ee;
      animation: ykTtRipple1 1.4s ease-out infinite;
      pointer-events: none;
    }
    .yk-tt-ripple-b {
      position: absolute;
      inset: -2px;
      border-radius: 9999px;
      border: 2px solid #fe2c55;
      animation: ykTtRipple2 1.4s ease-out 0.45s infinite;
      pointer-events: none;
    }
    .yk-tt-eq span {
      display: inline-block;
      width: 2.5px;
      border-radius: 2px;
      background: #25f4ee;
      animation: ykEqBar 0.55s ease-in-out infinite;
    }
    .yk-tt-eq span:nth-child(2) { animation-delay: 0.18s; background: #fde047; }
    .yk-tt-eq span:nth-child(3) { animation-delay: 0.34s; background: #fe2c55; }
    .yk-tt-glass-pill {
      background: rgba(12, 13, 22, 0.52);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid rgba(255, 255, 255, 0.16);
    }
    .yk-tt-chest-ready {
      animation: ykChestPulse 0.9s ease-in-out infinite;
      box-shadow: 0 0 26px rgba(250, 204, 21, 0.95);
    }
  `;
  document.head.appendChild(st);
}

function getMagicalBgByThemeId(themeId) {
  const found = YK_MAGICAL_BACKGROUNDS.find(b => b.id === themeId);
  if (found) return found;
  const legacyMap = {
    sherwana: 'magic_castle',
    erbil: 'magic_lanterns',
    sulaymaniyah: 'magic_lake',
    duhok: 'magic_aurora',
    kurdistan: 'magic_castle',
    galaxy: 'magic_terrace'
  };
  return YK_MAGICAL_BACKGROUNDS.find(b => b.id === (legacyMap[themeId] || 'magic_castle')) || YK_MAGICAL_BACKGROUNDS[0];
}

function applyMagicalRoomPhotoBg(themeId, customBg) {
  const imgEl = document.getElementById('ykTt_RealPhotoBg');
  const tintEl = document.getElementById('ykTt_PhotoTint');
  const tagEl = document.getElementById('ykVip_ThemeNameTag');
  const bgObj = getMagicalBgByThemeId(themeId);

  if (imgEl) {
    if (customBg) {
      imgEl.dataset.fallback = '';
      imgEl.src = customBg;
    } else {
      imgEl.dataset.fallback = bgObj.fallbackUrl;
      if (imgEl.dataset.bgId !== bgObj.id) {
        imgEl.dataset.bgId = bgObj.id;
        imgEl.src = bgObj.localUrl;
      }
    }
  }
  if (tintEl) {
    tintEl.style.background = `linear-gradient(180deg, rgba(6,7,14,0.62) 0%, ${bgObj.tint} 45%, rgba(5,6,12,0.88) 100%)`;
  }
  if (tagEl && !customBg) {
    tagEl.textContent = bgObj.name;
  }
}

// =========================================================
// Living Atmospheric Canvas (Fireflies / Rain / Aurora Snow / Lanterns / Moon Dust)
// =========================================================
window.startCityCanvasRenderer = function () {
  if (ykTtParticleFrame) cancelAnimationFrame(ykTtParticleFrame);
  const cvs = document.getElementById('ykVip_BgCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  let w = 0, h = 0;
  function resize() {
    if (!cvs) return;
    w = cvs.width = window.innerWidth;
    h = cvs.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 58 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 2.8 + 1.1,
    vx: (Math.random() - 0.5) * 0.0012,
    vy: (Math.random() * 0.002 + 0.0006),
    ph: Math.random() * Math.PI * 2,
    sp: Math.random() * 0.03 + 0.015
  }));

  function loop() {
    if (!document.getElementById('ykVipRoomRoot')) return;
    const themeId = (typeof currentRoomMeta !== 'undefined' && currentRoomMeta && currentRoomMeta.theme) || 'magic_castle';
    const bgObj = getMagicalBgByThemeId(themeId);
    const mode = bgObj.particleMode;

    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.ph += p.sp;

      if (mode === 'rain') {
        p.y += p.vy * 4.5;
        p.x -= 0.0012;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05;
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.34)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(p.x * w, p.y * h);
        ctx.lineTo(p.x * w - 5, p.y * h + 18);
        ctx.stroke();
      } else if (mode === 'lanterns') {
        p.y -= p.vy * 0.55;
        p.x += Math.sin(p.ph) * 0.0007;
        if (p.y < -0.06) { p.y = 1.06; p.x = Math.random(); }
        const gx = p.x * w, gy = p.y * h;
        const glow = 0.4 + 0.45 * Math.sin(p.ph * 1.4);
        const rad = ctx.createRadialGradient(gx, gy, 0.5, gx, gy, p.r * 5);
        rad.addColorStop(0, `rgba(254, 240, 138, ${glow})`);
        rad.addColorStop(0.5, `rgba(249, 115, 22, ${glow * 0.45})`);
        rad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(gx, gy, p.r * 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'aurora_snow') {
        p.y += p.vy * 0.65;
        p.x += Math.sin(p.ph) * 0.0008;
        if (p.y > 1.05) { p.y = -0.05; p.x = Math.random(); }
        const al = 0.35 + 0.5 * Math.abs(Math.sin(p.ph));
        ctx.fillStyle = p.r > 2.4 ? `rgba(110, 231, 183, ${al * 0.7})` : `rgba(224, 242, 254, ${al})`;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      } else if (mode === 'moon_dust') {
        p.y -= p.vy * 0.35;
        p.x += Math.cos(p.ph) * 0.0005;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        const al = 0.25 + 0.55 * Math.abs(Math.sin(p.ph));
        const gx = p.x * w, gy = p.y * h;
        ctx.fillStyle = `rgba(245, 208, 254, ${al})`;
        ctx.beginPath();
        ctx.arc(gx, gy, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // fireflies
        p.y -= p.vy * 0.4;
        p.x += Math.sin(p.ph) * 0.0009;
        if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        const gx = p.x * w, gy = p.y * h;
        const glow = 0.3 + 0.65 * Math.abs(Math.sin(p.ph));
        const rad = ctx.createRadialGradient(gx, gy, 0.5, gx, gy, p.r * 4.2);
        rad.addColorStop(0, `rgba(254, 249, 195, ${glow})`);
        rad.addColorStop(0.5, `rgba(250, 204, 21, ${glow * 0.35})`);
        rad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(gx, gy, p.r * 4.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ykTtParticleFrame = requestAnimationFrame(loop);
  }
  loop();
};

// =========================================================
// Ambient Peaceful Rain / Night Sound (Web Audio API - Zero External Files)
// =========================================================
window.toggleMagicalAmbientSound = function () {
  const btn = document.getElementById('ykTt_AmbientBtn');
  if (ykTtAmbientOn) {
    ykTtAmbientOn = false;
    try {
      if (ykTtAmbientNode) ykTtAmbientNode.stop();
      if (ykTtAmbientCtx) ykTtAmbientCtx.close();
    } catch (e) {}
    ykTtAmbientNode = null;
    ykTtAmbientCtx = null;
    if (btn) {
      btn.className = 'w-9 h-9 rounded-full yk-tt-glass-pill text-slate-200 flex items-center justify-center text-sm shrink-0 transition';
      btn.title = 'دەنگی بارانی ئارام (کوژاوەتەوە)';
    }
    return;
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 1.8;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 680;

    const gain = ctx.createGain();
    gain.gain.value = 0.09;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    ykTtAmbientCtx = ctx;
    ykTtAmbientNode = noise;
    ykTtAmbientOn = true;

    if (btn) {
      btn.className = 'w-9 h-9 rounded-full bg-sky-500/35 border border-sky-300 text-sky-200 flex items-center justify-center text-sm shrink-0 shadow-[0_0_14px_rgba(56,189,248,0.6)] transition';
      btn.title = 'دەنگی بارانی ئارام (چالاکە)';
    }
  } catch (e) {}
};

// =========================================================
// TikTok Audio LIVE Fullscreen Root Builder
// =========================================================
window.buildFullscreenVipRoomRoot = function () {
  injectVipRoomStyles();
  injectTikTokAudioLiveStyles();
  const existing = document.getElementById('ykVipRoomRoot');
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.id = 'ykVipRoomRoot';
  root.setAttribute('dir', 'rtl');
  root.style.cssText = 'position:fixed; inset:0; width:100vw; height:100dvh; z-index:9990; overflow:hidden; display:flex; flex-direction:column; justify-content:space-between; background:#070812; user-select:none; -webkit-user-select:none;';

  const defaultBg = YK_MAGICAL_BACKGROUNDS[0];

  root.innerHTML = `
    <!-- 5 Realistic Magical Photo Backgrounds Layer -->
    <div style="position:absolute; inset:0; z-index:0; overflow:hidden; pointer-events:none;">
      <img id="ykTt_RealPhotoBg" src="${defaultBg.localUrl}" data-bg-id="${defaultBg.id}" data-fallback="${defaultBg.fallbackUrl}"
        onerror="if(this.dataset.fallback && this.src !== this.dataset.fallback){this.src = this.dataset.fallback;}"
        class="yk-tt-photo-bg" />
      <div id="ykTt_PhotoTint" style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(6,7,14,0.62) 0%, ${defaultBg.tint} 45%, rgba(5,6,12,0.88) 100%);"></div>
    </div>

    <div id="ykVip_CustomBgLayer" style="position:absolute; inset:0; z-index:1; background-size:cover; background-position:center; display:none; pointer-events:none;">
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(6,7,14,0.58) 0%, rgba(6,7,14,0.34) 45%, rgba(6,7,14,0.88) 100%);"></div>
    </div>

    <!-- Living Atmospheric Magical Particles -->
    <canvas id="ykVip_BgCanvas" style="position:absolute; inset:0; width:100%; height:100%; z-index:2; pointer-events:none;"></canvas>

    <!-- Tap-Tap Hearts & 3D Full Gift Overlay -->
    <div id="ykVip_HeartsLayer" style="position:absolute; inset:0; z-index:35; pointer-events:none; overflow:hidden;"></div>
    <div id="ykVip_FullGiftOverlay" class="hidden fixed inset-0 flex-col items-center justify-center pointer-events-none" style="z-index:10005;"></div>

    <!-- Floating Combo Repeat Button -->
    <button id="ykVip_GiftComboBtn" onclick="triggerComboRepeat()"
      class="hidden fixed left-4 w-16 h-16 rounded-full bg-gradient-to-br from-[#fe2c55] via-rose-500 to-amber-400 border-2 border-yellow-200 shadow-[0_0_28px_rgba(254,44,85,0.9)] flex flex-col items-center justify-center text-white font-black animate-bounce cursor-pointer"
      style="bottom: calc(84px + env(safe-area-inset-bottom)); z-index:10002;">
      <span class="text-xs leading-none">Combo</span>
      <span id="ykVip_ComboCountText" class="text-sm text-yellow-100 mt-0.5">x1</span>
    </button>

    <!-- Floating Treasure Box Widget (TikTok Live Chest) -->
    <div id="ykTt_TreasureWidget" class="hidden fixed left-3 z-30" style="top: calc(106px + env(safe-area-inset-top));"></div>

    <!-- TOP TIKTOK AUDIO LIVE HEADER -->
    <div class="relative z-20 px-3 pb-1 space-y-2" style="padding-top: max(10px, env(safe-area-inset-top));">
      <div class="max-w-lg mx-auto flex items-center justify-between gap-2">
        <!-- Host Pill (TikTok Live Style) -->
        <div class="flex items-center gap-2 yk-tt-glass-pill rounded-full pl-3 pr-1 py-1 min-w-0">
          <div class="relative p-[2px] rounded-full yk-tt-ring-live shrink-0">
            <div id="ykVip_HostAvatar" class="w-8 h-8 rounded-full bg-slate-900 text-yellow-300 font-black flex items-center justify-center overflow-hidden text-xs">👑</div>
          </div>
          <div class="min-w-0 leading-tight">
            <div class="flex items-center gap-1">
              <span id="ykVip_Title" class="text-xs font-black text-white truncate max-w-[105px] sm:max-w-[155px]">دیوەخان</span>
              <span id="ykVip_LevelBadge" class="px-1.5 py-0.2 rounded-full bg-[#fe2c55] text-white text-[9px] font-black shrink-0">Lv.1</span>
            </div>
            <div class="flex items-center gap-1.5 text-[10px] text-slate-200/90">
              <span>❤️ <strong id="ykVip_TotalGifts">0</strong></span>
              <span>•</span>
              <span id="ykVip_ThemeNameTag" class="truncate max-w-[85px] text-amber-200">قەڵای شەو</span>
            </div>
          </div>
        </div>

        <!-- Top 3 Gifters + Viewers + Close -->
        <div class="flex items-center gap-1.5 shrink-0">
          <div id="ykTt_Top3Gifters" class="flex items-center -space-x-1.5 space-x-reverse"></div>

          <div class="px-2.5 h-8 rounded-full yk-tt-glass-pill text-white text-[11px] font-black flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-[#fe2c55] animate-pulse"></span>
            <span id="ykVip_OnlineCount">1</span>
          </div>

          <button onclick="leaveVoiceRoom()" title="دەرچوون"
            class="w-8 h-8 rounded-full yk-tt-glass-pill hover:bg-rose-600/80 text-white font-black flex items-center justify-center text-xs transition">
            ✕
          </button>
        </div>
      </div>

      <!-- Second Sleek Utility Strip (Room Progress + PK + Treasure Box + Magical Backgrounds) -->
      <div class="max-w-lg mx-auto flex items-center justify-between gap-1.5">
        <div class="flex-1 flex items-center gap-2 yk-tt-glass-pill rounded-full px-2.5 py-1 min-w-0">
          <span id="ykVip_SeatsUnlockHint" class="text-[10px] font-black text-amber-300 whitespace-nowrap">🪑 5/8</span>
          <div class="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div id="ykVip_XpFill" class="h-full yk-pk-bar transition-all duration-500" style="width: 12%"></div>
          </div>
          <span id="ykVip_XpText" class="text-[9px] font-mono text-cyan-200 whitespace-nowrap">0/100</span>
        </div>

        <button onclick="openPkControlModal()" title="جەولەی PK"
          class="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#fe2c55] to-blue-600 text-white text-[10px] font-black shadow flex items-center gap-1 shrink-0 active:scale-95 transition">
          ⚔️ PK
        </button>

        <button onclick="openDropTreasureModal()" title="سندوقی سکە"
          class="px-2.5 py-1 rounded-full bg-amber-400/25 border border-amber-300/60 text-amber-200 text-[10px] font-black shadow flex items-center gap-1 shrink-0 active:scale-95 transition">
          🪙 سندوق
        </button>

        <button onclick="openThemePickerModal()" title="٥ پاشبنەما ئەفسووناوییەکە"
          class="px-2.5 py-1 rounded-full yk-tt-glass-pill border-amber-300/50 text-amber-200 text-[10px] font-black flex items-center gap-1 shrink-0 active:scale-95 transition">
          ✨ دیمەن
        </button>
      </div>

      <!-- LIVE PK BATTLE BAR (Auto-shown when PK is active) -->
      <div id="ykTt_PkBarWrap" class="hidden max-w-lg mx-auto"></div>
    </div>

    <!-- CENTER: TIKTOK AUDIO LIVE 8-SEAT GLASS CIRCLE STAGE + TRANSPARENT CHAT -->
    <div id="ykTt_TapStage" class="relative z-20 flex-1 flex flex-col justify-between overflow-hidden max-w-lg w-full mx-auto px-3 pb-1">
      <div id="ykVip_SeatsGrid" class="grid grid-cols-4 gap-y-4 gap-x-2 pt-3 shrink-0"></div>

      <!-- Audience Avatars & Step Down -->
      <div class="flex items-center justify-between gap-2 mt-2 px-1 shrink-0">
        <div id="ykVip_AudienceRow" class="yk-no-scroll flex items-center gap-1.5 overflow-x-auto py-0.5"></div>
        <button id="ykVip_StandUpBtn" onclick="stepDownFromSeat()"
          class="hidden px-3 py-1 rounded-full yk-tt-glass-pill text-[10px] font-black text-amber-200 whitespace-nowrap shrink-0">
          🚶 دابەزین
        </button>
      </div>

      <!-- Bottom Transparent TikTok Chat Feed -->
      <div class="flex-1 flex flex-col justify-end min-h-0 pt-2">
        <div id="ykVip_FloatingGiftBanner" class="mb-1.5 min-h-[36px] flex items-center justify-start"></div>
        <div id="ykVip_ChatMessages"
          class="yk-no-scroll max-h-[26dvh] overflow-y-auto space-y-1.5 px-1 py-1 text-xs"
          style="mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 100%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 18%, black 100%);">
        </div>
      </div>
    </div>

    <!-- BOTTOM TIKTOK AUDIO LIVE ACTION DOCK -->
    <div class="relative z-20 px-3 pt-1.5" style="padding-bottom: max(12px, env(safe-area-inset-bottom));">
      <div class="max-w-lg mx-auto flex items-center gap-1.5">
        <button id="ykVip_MicBtn" onclick="toggleRoomMicrophone()"
          class="w-10 h-10 rounded-full bg-emerald-500 text-[#050b18] font-black flex items-center justify-center text-lg shadow-lg shrink-0 transition">
          🎙️
        </button>

        <button id="ykVip_SpeakerBtn" onclick="toggleRoomSpeaker()"
          class="w-9 h-9 rounded-full yk-tt-glass-pill text-white flex items-center justify-center text-sm shrink-0">
          🔊
        </button>

        <button id="ykTt_AmbientBtn" onclick="toggleMagicalAmbientSound()" title="دەنگی بارانی ئارام"
          class="w-9 h-9 rounded-full yk-tt-glass-pill text-slate-200 flex items-center justify-center text-sm shrink-0 transition">
          🌧️
        </button>

        <div class="flex-1 flex items-center yk-tt-glass-pill rounded-full px-3 py-1 min-w-0">
          <input id="ykVip_ChatInput" type="text" onkeydown="if(event.key==='Enter') sendRoomChatMessage()"
            placeholder="نامەیەک بنووسە..."
            class="flex-1 min-w-0 bg-transparent text-xs text-white placeholder-slate-300/85 focus:outline-none py-1" />
          <button onclick="sendRoomChatMessage()" class="text-[#25f4ee] font-black text-xs pr-1.5 shrink-0">ناردن</button>
        </div>

        <button onclick="sendFloatingHeart()" title="لایک و دڵ"
          class="w-9 h-9 rounded-full bg-[#fe2c55]/25 border border-[#fe2c55]/60 text-rose-300 flex items-center justify-center text-base shrink-0 active:scale-90 transition">
          ❤️
        </button>

        <button onclick="openGiftDrawerModal()" title="ناردنی دیاری"
          class="w-10 h-10 rounded-full bg-gradient-to-br from-[#fe2c55] via-pink-500 to-amber-400 border-2 border-yellow-200 text-white flex items-center justify-center text-lg shadow-[0_0_20px_rgba(254,44,85,0.85)] shrink-0 active:scale-95 transition">
          🎁
        </button>
      </div>
    </div>

    <!-- MY SEAT CONTROL MENU -->
    <div id="ykVip_MySeatMenu" class="hidden fixed inset-0 flex items-end justify-center bg-black/55 backdrop-blur-xs" style="z-index:10012;" onclick="if(event.target===this) closeMySeatMenu()">
      <div class="bg-[#12131f]/98 border-t-2 border-amber-400/70 rounded-t-3xl p-4 max-w-lg w-full mx-auto space-y-2.5 shadow-2xl" style="padding-bottom: max(18px, env(safe-area-inset-bottom));">
        <div class="text-center text-xs font-black text-amber-300 pb-1">کۆنترۆڵی کورسییەکەت</div>
        <button onclick="toggleRoomMicrophone(); closeMySeatMenu();" class="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-black">
          🎙️ کردنەوە / بێدەنگکردنی مایکرۆفۆن
        </button>
        <button onclick="stepDownFromSeat(); closeMySeatMenu();" class="w-full py-3 rounded-2xl bg-rose-600/25 border border-rose-500/40 text-rose-200 text-xs font-black">
          🚶 دابەزین لە کورسی (بوون بە گوێگر)
        </button>
        <button onclick="closeMySeatMenu()" class="w-full py-2.5 rounded-2xl bg-black/50 text-slate-300 text-xs font-bold">
          پاشگەزبوونەوە
        </button>
      </div>
    </div>

    <!-- GIFT DRAWER -->
    <div id="ykVip_GiftDrawer" class="hidden fixed inset-0 flex flex-col justify-end bg-black/60 backdrop-blur-xs" style="z-index:10015;" onclick="if(event.target===this) closeGiftDrawerModal()">
      <div class="bg-[#10111c]/98 border-t-2 border-[#fe2c55]/70 rounded-t-3xl p-4 max-w-lg w-full mx-auto space-y-3 shadow-2xl" style="padding-bottom: max(16px, env(safe-area-inset-bottom));">
        <div class="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div class="yk-no-scroll flex items-center gap-1.5 overflow-x-auto pb-0.5" id="ykVip_GiftRecipientsRow"></div>
          <button onclick="closeGiftDrawerModal()" class="text-slate-300 hover:text-white text-sm font-bold px-1.5">✕</button>
        </div>

        <div class="flex items-center justify-between gap-2 text-[11px] font-black">
          <div class="yk-no-scroll flex items-center gap-2.5 overflow-x-auto">
            <button onclick="setGiftCategory('all', this)" class="yk-gcat-btn text-amber-300 border-b-2 border-amber-300 pb-0.5 whitespace-nowrap">هەمووی</button>
            <button onclick="setGiftCategory('cheap', this)" class="yk-gcat-btn text-slate-400 pb-0.5 whitespace-nowrap">🌹 هەرزان</button>
            <button onclick="setGiftCategory('beasts', this)" class="yk-gcat-btn text-slate-400 pb-0.5 whitespace-nowrap">🦁 ئەفسووناوی</button>
            <button onclick="setGiftCategory('cars', this)" class="yk-gcat-btn text-slate-400 pb-0.5 whitespace-nowrap">🚘 ئۆتۆمبێل</button>
          </div>
          <span id="ykVip_SelectedGiftCostHint" class="text-yellow-300 whitespace-nowrap shrink-0">🪙 6</span>
        </div>

        <div class="text-[10px] text-emerald-300/90 text-center bg-emerald-500/10 border border-emerald-400/25 rounded-xl py-1">
          💰 ٥٠٪ ی دراوی هەر دیارییەک ڕاستەوخۆ دەچێتە سەر باڵانسی وەرگر!
        </div>

        <div id="ykVip_GiftsGrid" class="yk-no-scroll grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto"></div>

        <div class="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button onclick="openCoinStoreModal()" class="flex items-center gap-1 px-3 py-2 rounded-full bg-amber-400/15 border border-amber-400/50 text-yellow-300 text-xs font-black">
            <span>🪙</span>
            <span class="yk-user-coin-balance">${(typeof myUserCoins !== 'undefined' ? myUserCoins : 0).toLocaleString()}</span>
            <span class="text-emerald-400 mr-1">+ کڕین</span>
          </button>

          <div class="flex items-center gap-1.5">
            <div class="flex items-center bg-white/10 rounded-full p-0.5 text-[11px] font-black">
              <button onclick="setGiftQty(1, this)" class="yk-qty-btn px-2 py-1 rounded-full bg-amber-400 text-[#1a0d06]">1</button>
              <button onclick="setGiftQty(7, this)" class="yk-qty-btn px-2 py-1 rounded-full text-white">7</button>
              <button onclick="setGiftQty(77, this)" class="yk-qty-btn px-2 py-1 rounded-full text-white">77</button>
            </div>
            <button onclick="sendSelectedRoyalGift()" class="px-4 py-2 rounded-full bg-gradient-to-r from-[#fe2c55] to-amber-500 text-white text-xs font-black shadow-lg">
              ناردن 🚀
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 5 MAGICAL REALISTIC BACKGROUNDS PICKER -->
    <div id="ykVip_ThemePicker" class="hidden fixed inset-0 flex items-end sm:items-center justify-center p-3 bg-black/75 backdrop-blur-sm" style="z-index:10020;" onclick="if(event.target===this) closeThemePickerModal()">
      <div class="bg-[#10121e]/98 max-w-md w-full rounded-3xl p-5 space-y-3.5 border-2 border-amber-400/60 shadow-2xl max-h-[85dvh] overflow-y-auto">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-base font-black gold-text">✨ ٥ پاشبنەما ئەفسووناوییەکە</h3>
            <p class="text-[10px] text-slate-300">دیمەنێکی ئارام و سەحراوی هەڵبژێرە بۆ ژوورەکەت</p>
          </div>
          <button onclick="closeThemePickerModal()" class="w-8 h-8 rounded-full bg-white/10 text-white font-bold">✕</button>
        </div>

        <label class="cursor-pointer w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-500 text-[#1a0d06] text-xs font-black flex items-center justify-center gap-2 shadow-lg">
          <span>📷 دانانی وێنەی تایبەت لە مۆبایلەوە</span>
          <input type="file" accept="image/*" onchange="uploadCustomRoomBg(this)" class="hidden" />
        </label>

        <div class="grid grid-cols-1 gap-2.5">
          ${YK_MAGICAL_BACKGROUNDS.map(b => `
            <button onclick="changeCurrentRoomTheme('${b.id}')"
              class="relative h-24 rounded-2xl overflow-hidden border-2 border-white/20 hover:border-yellow-300 shadow-lg text-right transition active:scale-[0.98]">
              <img src="${b.localUrl}" onerror="if(this.src!=='${b.fallbackUrl}')this.src='${b.fallbackUrl}'"
                class="absolute inset-0 w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
              <div class="relative z-10 h-full p-3 flex flex-col justify-end">
                <span class="text-xs font-black text-white drop-shadow">✨ ${b.name}</span>
                <span class="text-[10px] text-amber-200/95">${b.subtitle}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <div id="ykVip_RemoteAudios" class="hidden"></div>
  `;

  // Tap empty background space to send floating hearts like TikTok LIVE
  const tapStage = root.querySelector('#ykTt_TapStage');
  if (tapStage) {
    tapStage.addEventListener('click', (e) => {
      if (e.target === tapStage && typeof sendFloatingHeart === 'function') {
        sendFloatingHeart();
      }
    });
  }

  root.addEventListener('pointerdown', unlockMobileRoomAudio, { passive: true });
  document.body.appendChild(root);
  startCityCanvasRenderer();
};

// =========================================================
// TikTok Audio LIVE Circular 8-Seat Renderer + Top 3 Gifters
// =========================================================
window.renderRoomSeats = function (members) {
  const grid = document.getElementById('ykVip_SeatsGrid');
  if (!grid) return;

  if (typeof currentRoomMeta !== 'undefined' && currentRoomMeta) {
    applyMagicalRoomPhotoBg(currentRoomMeta.theme, currentRoomMeta.customBg);
  }

  const lv = getRoomLevelData((currentRoomMeta && currentRoomMeta.roomXp) || 0);
  const unlocked = lv.unlockedSeats;
  const hostId = currentRoomMeta && currentRoomMeta.hostId;

  if (hostId && members[hostId]) {
    const hostAv = document.getElementById('ykVip_HostAvatar');
    if (hostAv && members[hostId].avatar) {
      hostAv.innerHTML = `<img src="${members[hostId].avatar}" class="w-full h-full object-cover" />`;
    }
  }

  // Update Top 3 Gifters in Top Header
  const top3Box = document.getElementById('ykTt_Top3Gifters');
  if (top3Box) {
    const sorted = Object.entries(members || {})
      .filter(([, m]) => (m.supportCoins || 0) > 0)
      .sort((a, b) => (b[1].supportCoins || 0) - (a[1].supportCoins || 0))
      .slice(0, 3);
    const crowns = ['border-yellow-300', 'border-slate-200', 'border-amber-600'];
    top3Box.innerHTML = sorted.map(([uid, m], idx) => `
      <div onclick="selectGiftRecipientAndOpen('${uid}')" title="${escapeRoomHtml(m.name)} (${m.supportCoins} 🪙)"
        class="cursor-pointer relative w-7 h-7 rounded-full border-2 ${crowns[idx]} bg-slate-900 overflow-hidden flex items-center justify-center text-[10px] font-black text-white shadow">
        ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover" />` : escapeRoomHtml((m.name || 'ی')[0])}
      </div>
    `).join('');
  }

  const seatMap = new Array(8).fill(null);
  const unassigned = [];
  const audience = [];

  Object.entries(members || {}).forEach(([uid, m]) => {
    if (typeof m.seatIndex === 'number') {
      if (m.seatIndex >= 0 && m.seatIndex < unlocked && !seatMap[m.seatIndex]) {
        seatMap[m.seatIndex] = [uid, m];
      } else if (m.seatIndex === -1) {
        audience.push([uid, m]);
      } else {
        unassigned.push([uid, m]);
      }
    } else {
      unassigned.push([uid, m]);
    }
  });

  unassigned.forEach(entry => {
    const emptyIdx = seatMap.findIndex((s, idx) => s === null && idx < unlocked);
    if (emptyIdx !== -1) seatMap[emptyIdx] = entry;
    else audience.push(entry);
  });

  const myMember = members && members[playerId];
  const standBtn = document.getElementById('ykVip_StandUpBtn');
  if (standBtn) {
    const amSeated = myMember && typeof myMember.seatIndex === 'number' && myMember.seatIndex >= 0;
    standBtn.classList.toggle('hidden', !amSeated);
  }

  const pkActive = ykTtPkState && ykTtPkState.endsAt > Date.now();

  let html = '';
  for (let i = 0; i < 8; i++) {
    const isLocked = i >= unlocked;
    const occupant = seatMap[i];
    const teamRing = pkActive
      ? (i < 4 ? 'ring-2 ring-[#fe2c55] shadow-[0_0_16px_rgba(254,44,85,0.65)]' : 'ring-2 ring-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.65)]')
      : '';

    if (occupant) {
      const [uid, m] = occupant;
      const isMe = (uid === playerId);
      const isHost = (uid === hostId);
      const isSpeaking = m.speaking && !m.muted;
      const support = m.supportCoins || 0;
      const clickHandler = isMe ? 'openMySeatMenu()' : `selectGiftRecipientAndOpen('${uid}')`;

      html += `
        <div onclick="${clickHandler}" class="cursor-pointer flex flex-col items-center text-center gap-1 transition active:scale-95">
          <div class="relative w-16 h-16 sm:w-[70px] sm:h-[70px] flex items-center justify-center">
            ${isSpeaking ? '<div class="yk-tt-ripple-a"></div><div class="yk-tt-ripple-b"></div>' : ''}
            <div class="relative w-full h-full rounded-full p-[2.5px] ${isHost ? 'yk-tt-ring-live' : (isSpeaking ? 'bg-[#25f4ee]' : 'bg-white/25')} ${teamRing}">
              <div class="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-base font-black text-white border-2 border-[#0b0c16]">
                ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover" />` : escapeRoomHtml((m.name || 'ی')[0])}
              </div>
            </div>

            ${isHost ? '<span class="absolute -top-2.5 text-sm drop-shadow">👑</span>' : ''}

            <span class="absolute -bottom-0.5 right-0 w-5 h-5 rounded-full ${m.muted ? 'bg-rose-600' : 'bg-emerald-500'} border-2 border-[#0b0c16] flex items-center justify-center text-[9px]">
              ${m.muted ? '🔇' : (isSpeaking ? '<div class="yk-tt-eq flex items-end gap-[1.5px] h-3"><span></span><span></span><span></span></div>' : '🎙️')}
            </span>
          </div>

          <div class="text-[11px] font-black text-white drop-shadow truncate max-w-[78px] leading-tight">
            ${escapeRoomHtml(m.name)}
          </div>
          <span class="px-2 py-0.2 rounded-full bg-black/55 border border-white/15 text-[9px] font-black text-amber-200">
            🪙 ${support.toLocaleString()}
          </span>
        </div>
      `;
    } else if (!isLocked) {
      html += `
        <div onclick="switchToRoomSeat(${i})" class="cursor-pointer flex flex-col items-center text-center gap-1.5 transition active:scale-95">
          <div class="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full yk-tt-seat-circle ${teamRing} flex flex-col items-center justify-center text-white/85">
            <span class="text-lg leading-none">🎙️</span>
            <span class="text-[9px] font-bold text-amber-200/90 mt-0.5">+</span>
          </div>
          <div class="text-[10px] font-bold text-white/80 drop-shadow">کورسی ${i + 1}</div>
        </div>
      `;
    } else {
      const reqLv = i === 5 ? 2 : (i === 6 ? 3 : 5);
      html += `
        <div onclick="alert('کورسی #${i + 1} لە لیڤڵی ${reqLv}ی ژوور دەکرێتەوە!')" class="cursor-pointer flex flex-col items-center text-center gap-1.5 opacity-65">
          <div class="w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-black/45 border border-white/15 flex flex-col items-center justify-center text-slate-300">
            <span class="text-base">🔒</span>
            <span class="text-[9px] font-black text-amber-300">Lv.${reqLv}</span>
          </div>
          <div class="text-[10px] font-bold text-slate-300">داخراوە</div>
        </div>
      `;
    }
  }
  grid.innerHTML = html;

  const audRow = document.getElementById('ykVip_AudienceRow');
  if (audRow) {
    const allList = Object.entries(members || {});
    audRow.innerHTML = allList.map(([uid, m]) => `
      <div onclick="${uid === playerId ? 'openMySeatMenu()' : `selectGiftRecipientAndOpen('${uid}')`}"
        title="${escapeRoomHtml(m.name)}"
        class="cursor-pointer relative w-7 h-7 rounded-full border ${m.seatIndex === -1 ? 'border-[#25f4ee]' : 'border-amber-300'} bg-slate-900 overflow-hidden flex items-center justify-center text-[10px] font-black text-white shrink-0">
        ${m.avatar ? `<img src="${m.avatar}" class="w-full h-full object-cover" />` : escapeRoomHtml((m.name || 'ی')[0])}
      </div>
    `).join('');
  }
};

// =========================================================
// TikTok PK Battle System (Team Red Seats 1-4 vs Team Blue Seats 5-8)
// =========================================================
window.openPkControlModal = function () {
  if (!currentVoiceRoomId || typeof db === 'undefined') return;
  const isActive = ykTtPkState && ykTtPkState.endsAt > Date.now();
  if (isActive) {
    if (confirm('جەولەی PK ئێستا چالاکە! دەتەوێت جەولەکە کۆتایی پێبهێنیت؟')) {
      db.ref(`voiceRooms/${currentVoiceRoomId}/pk`).remove();
    }
    return;
  }
  if (confirm('دەستپێکردنی جەولەی ⚔️ PK (٣ خولەک) لەنێوان:\n🔥 تیمی سوور (کورسی ١ تا ٤)\n⚡ تیمی شین (کورسی ٥ تا ٨)؟')) {
    db.ref(`voiceRooms/${currentVoiceRoomId}/pk`).set({
      redScore: 0,
      blueScore: 0,
      startedAt: Date.now(),
      endsAt: Date.now() + 180000
    });
    db.ref(`voiceRooms/${currentVoiceRoomId}/chat`).push({
      type: 'join',
      name: playerName,
      text: 'جەولەی ⚔️ PKـی دەستپێکرد! دیاری بنێرن بۆ تیمەکەتان 🔥',
      ts: firebase.database.ServerValue.TIMESTAMP
    });
  }
};

function renderLivePkBar() {
  const wrap = document.getElementById('ykTt_PkBarWrap');
  if (!wrap) return;
  if (!ykTtPkState || !ykTtPkState.endsAt) {
    wrap.classList.add('hidden');
    wrap.innerHTML = '';
    return;
  }

  const now = Date.now();
  const leftSec = Math.max(0, Math.ceil((ykTtPkState.endsAt - now) / 1000));
  const red = Number(ykTtPkState.redScore) || 0;
  const blue = Number(ykTtPkState.blueScore) || 0;
  const total = red + blue;
  const redPct = total === 0 ? 50 : Math.min(88, Math.max(12, Math.round((red / total) * 100)));
  const isX2 = leftSec > 0 && leftSec <= 30;
  const mins = String(Math.floor(leftSec / 60)).padStart(2, '0');
  const secs = String(leftSec % 60).padStart(2, '0');

  wrap.classList.remove('hidden');
  wrap.innerHTML = `
    <div class="rounded-2xl overflow-hidden border border-white/25 bg-black/60 backdrop-blur-md shadow-xl">
      <div class="relative h-6 w-full flex text-[11px] font-black">
        <div style="width:${redPct}%" class="bg-gradient-to-l from-[#fe2c55] to-rose-700 flex items-center justify-start px-2.5 transition-all duration-500">
          🔥 ${red.toLocaleString()}
        </div>
        <div style="width:${100 - redPct}%" class="bg-gradient-to-r from-sky-500 to-blue-700 flex items-center justify-end px-2.5 transition-all duration-500">
          ${blue.toLocaleString()} ⚡
        </div>
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span class="px-2.5 py-0.5 rounded-full bg-black/85 border border-yellow-300 text-yellow-300 text-[10px] font-black shadow">
            ${leftSec > 0 ? `⚔️ ${mins}:${secs} ${isX2 ? '• x2!' : ''}` : (red > blue ? '👑 تیمی سوور بردییەوە!' : blue > red ? '👑 تیمی شین بردییەوە!' : '🤝 یەکسانبوون!')}
          </span>
        </div>
      </div>
    </div>
  `;
}

// =========================================================
// TikTok Treasure Box (سندوقی سکەی خۆڕایی)
// =========================================================
window.openDropTreasureModal = function () {
  if (!currentVoiceRoomId || typeof db === 'undefined') return;
  const val = prompt('چەند کۆین دەخەیتە ناو سندوقی سکەی ژوورەکە؟ (بۆ نموونە: 50 یان 100):', '50');
  const amount = Math.floor(Number(val) || 0);
  if (amount < 20) {
    alert('کەمترین بڕ بۆ سندوقی سکە ٢٠ کۆینە!');
    return;
  }
  if (myUserCoins < amount) {
    alert('کۆینەکانت بەش ناکەن!');
    return;
  }

  myUserCoins -= amount;
  if (typeof updateRoomCoinDisplays === 'function') updateRoomCoinDisplays();
  db.ref(`players/${playerId}/coins`).set(myUserCoins);

  const boxId = 'box_' + Date.now();
  db.ref(`voiceRooms/${currentVoiceRoomId}/treasureBox`).set({
    id: boxId,
    senderName: playerName,
    totalCoins: amount,
    remainingCoins: amount,
    opensAt: Date.now() + 45000,
    expiresAt: Date.now() + 120000
  });

  db.ref(`voiceRooms/${currentVoiceRoomId}/chat`).push({
    type: 'join',
    name: playerName,
    text: `سندوقێکی ${amount} سکەیی دانا! دوای ٤٥ چرکە دەکرێتەوە 🎁`,
    ts: firebase.database.ServerValue.TIMESTAMP
  });
};

window.claimTreasureBoxCoins = function () {
  if (!currentVoiceRoomId || !ykTtBoxState || typeof db === 'undefined') return;
  if (Date.now() < ykTtBoxState.opensAt) return;
  if (ykTtBoxState.claimedBy && ykTtBoxState.claimedBy[playerId]) {
    alert('تۆ پێشتر پشکی خۆت لەم سندوقە وەرگرتووە!');
    return;
  }
  const rem = Number(ykTtBoxState.remainingCoins) || 0;
  if (rem <= 0) {
    alert('سندوقەکە بەتاڵ بووە! چاوەڕێی سندوقی داهاتوو بە.');
    return;
  }

  const share = Math.min(rem, Math.max(5, Math.floor(Math.random() * Math.ceil(rem * 0.45)) + 5));
  db.ref(`voiceRooms/${currentVoiceRoomId}/treasureBox/claimedBy/${playerId}`).set(share);
  db.ref(`voiceRooms/${currentVoiceRoomId}/treasureBox/remainingCoins`).transaction(c => Math.max(0, (Number(c) || 0) - share));
  db.ref(`players/${playerId}/coins`).transaction(c => (Number(c) || 0) + share);
  if (typeof playChessSound === 'function') playChessSound('end');
  alert(`🎉 پیرۆزە! +${share} سکەت لە سندوقەکە بردەوە!`);
};

function renderTreasureBoxWidget() {
  const boxEl = document.getElementById('ykTt_TreasureWidget');
  if (!boxEl) return;
  if (!ykTtBoxState || Date.now() > (ykTtBoxState.expiresAt || 0) || (ykTtBoxState.remainingCoins || 0) <= 0) {
    boxEl.classList.add('hidden');
    boxEl.innerHTML = '';
    return;
  }

  const leftSec = Math.max(0, Math.ceil((ykTtBoxState.opensAt - Date.now()) / 1000));
  const ready = leftSec === 0;
  const alreadyClaimed = !!(ykTtBoxState.claimedBy && ykTtBoxState.claimedBy[playerId]);

  boxEl.classList.remove('hidden');
  boxEl.innerHTML = `
    <button onclick="claimTreasureBoxCoins()"
      class="flex flex-col items-center justify-center px-2.5 py-2 rounded-2xl bg-gradient-to-b from-amber-400/90 to-orange-600/90 border-2 border-yellow-200 text-white shadow-2xl ${ready && !alreadyClaimed ? 'yk-tt-chest-ready' : ''}">
      <span class="text-2xl leading-none">🎁</span>
      <span class="text-[10px] font-black mt-0.5 text-yellow-100">
        ${alreadyClaimed ? 'وەرگیرا ✓' : (ready ? 'بیکەرەوە! ✨' : `00:${String(leftSec).padStart(2, '0')}`)}
      </span>
      <span class="text-[8px] font-bold bg-black/50 px-1.5 rounded-full mt-0.5">🪙 ${ykTtBoxState.remainingCoins}</span>
    </button>
  `;
}

// =========================================================
// Hook joinVoiceRoom, leaveVoiceRoom, and sendSelectedRoyalGift
// =========================================================
(function wireTikTokLiveHooks() {
  const attach = () => {
    if (typeof window.joinVoiceRoom === 'function' && !window._ykTtJoinHooked) {
      window._ykTtJoinHooked = true;
      const origJoin = window.joinVoiceRoom;
      window.joinVoiceRoom = async function (rId) {
        const res = await origJoin.apply(this, arguments);
        if (typeof db !== 'undefined' && rId) {
          if (ykTtPkRef) ykTtPkRef.off();
          ykTtPkRef = db.ref(`voiceRooms/${rId}/pk`);
          ykTtPkRef.on('value', s => {
            ykTtPkState = s.val();
            renderLivePkBar();
            if (typeof renderRoomSeats === 'function' && typeof currentRoomMembers !== 'undefined') {
              renderRoomSeats(currentRoomMembers);
            }
          });

          if (ykTtBoxRef) ykTtBoxRef.off();
          ykTtBoxRef = db.ref(`voiceRooms/${rId}/treasureBox`);
          ykTtBoxRef.on('value', s => {
            ykTtBoxState = s.val();
            renderTreasureBoxWidget();
          });

          if (ykTtPkTimerInterval) clearInterval(ykTtPkTimerInterval);
          ykTtPkTimerInterval = setInterval(() => {
            renderLivePkBar();
            renderTreasureBoxWidget();
          }, 1000);
        }
        return res;
      };
    }

    if (typeof window.leaveVoiceRoom === 'function' && !window._ykTtLeaveHooked) {
      window._ykTtLeaveHooked = true;
      const origLeave = window.leaveVoiceRoom;
      window.leaveVoiceRoom = function () {
        if (ykTtAmbientOn) toggleMagicalAmbientSound();
        if (ykTtParticleFrame) { cancelAnimationFrame(ykTtParticleFrame); ykTtParticleFrame = null; }
        if (ykTtPkTimerInterval) { clearInterval(ykTtPkTimerInterval); ykTtPkTimerInterval = null; }
        if (ykTtPkRef) { ykTtPkRef.off(); ykTtPkRef = null; }
        if (ykTtBoxRef) { ykTtBoxRef.off(); ykTtBoxRef = null; }
        ykTtPkState = null;
        ykTtBoxState = null;
        return origLeave.apply(this, arguments);
      };
    }

    if (typeof window.sendSelectedRoyalGift === 'function' && !window._ykTtGiftPkHooked) {
      window._ykTtGiftPkHooked = true;
      const origSendGift = window.sendSelectedRoyalGift;
      window.sendSelectedRoyalGift = async function () {
        const gift = (window.ROYAL_GIFTS_CATALOG || []).find(g => g.id === selectedGiftId) || { cost: 0 };
        const qty = (typeof selectedGiftQty !== 'undefined' && selectedGiftQty) || 1;
        const totalCost = (gift.cost || 0) * qty;
        const recipientUid = selectedGiftRecipient;

        const out = await origSendGift.apply(this, arguments);

        // Add points to active PK Battle automatically (x2 in last 30 seconds!)
        if (ykTtPkState && ykTtPkState.endsAt > Date.now() && currentVoiceRoomId && typeof db !== 'undefined' && totalCost > 0) {
          const isX2 = (ykTtPkState.endsAt - Date.now()) <= 30000;
          const pts = isX2 ? totalCost * 2 : totalCost;
          let targetSeat = 0;
          if (recipientUid !== 'ALL' && currentRoomMembers && currentRoomMembers[recipientUid]) {
            targetSeat = Number(currentRoomMembers[recipientUid].seatIndex) || 0;
          }
          const side = targetSeat >= 4 ? 'blueScore' : 'redScore';
          db.ref(`voiceRooms/${currentVoiceRoomId}/pk/${side}`).transaction(c => (Number(c) || 0) + pts);
        }
        return out;
      };
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
  setTimeout(attach, 1000);
})();