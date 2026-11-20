// ============================================================================
// YARI KURDI - FULLSCREEN 4K ROYAL TEAHOUSE DOMINO ENGINE (PHASER 3)
// Pito-Style Vertical/Snaking Chain + 1:1 Smooth Physics Drag + Dealing FX
// ============================================================================

const teahouseDom = {
  boneyard: [],
  myHand: [],
  botHand: [],
  chain: [],
  rootIndex: 0,
  leftEnd: null,  // سەری سەرەوە (UP branch)
  rightEnd: null, // سەری خوارەوە (DOWN branch)
  turn: 'player',
  myScore: 0,
  botScore: 0,
  targetScore: 101,
  roundOver: false,
  isDealing: false,
  firstMoveRule: true,
  requiredOpeningDouble: null,
  selectedHandIdx: null
};

let dominoPhaserGame = null;
let dominoSceneRef = null;
let dominoShellBuilt = false;
const DOM_DPR = Math.min(Math.max(window.devicePixelRatio || 2, 2.2), 3);

// دەنگی تەقەی ڕاستەقینەی دار و عاج
function playTeahouseWoodClack(pitch = 1) {
  if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!window._ykDomAudioCtx) window._ykDomAudioCtx = new AudioCtx();
    const ctx = window._ykDomAudioCtx;
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // تەقەی یەکەم (تەقەی پوولە عاجییەکە)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(980 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(160 * pitch, now + 0.055);
    gain.gain.setValueAtTime(0.32, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);

    // تەقەی دووەم (دەنگدانەوەی تەختەی دارگوێز)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(220 * pitch, now + 0.01);
    osc2.frequency.exponentialRampToValueAtTime(85, now + 0.09);
    gain2.gain.setValueAtTime(0.22, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.1);
  } catch (e) {}
}

// دروستکردنی ڕووکاری فول سکرین ڕێک وەک ئەپی مۆبایل لەسەر #view-domino
function ensureDominoFullscreenShell() {
  const sec = document.getElementById('view-domino');
  if (!sec) return;

  sec.classList.remove('max-w-md', 'mx-auto', 'px-2', 'py-2');
  sec.style.cssText = [
    'position: fixed',
    'inset: 0',
    'width: 100vw',
    'height: 100dvh',
    'max-width: 100vw',
    'margin: 0',
    'padding: 0',
    'z-index: 65',
    'overflow: hidden',
    'background: #140904',
    'touch-action: none',
    'user-select: none',
    '-webkit-user-select: none'
  ].join(' !important; ') + ' !important;';

  if (dominoShellBuilt && document.getElementById('ykDomFullStage')) return;
  dominoShellBuilt = true;

  sec.innerHTML = `
    <div id="ykDomFullStage" dir="ltr" style="position:absolute; inset:0; width:100%; height:100%; z-index:1;"></div>

    <!-- HUD ی سەرەوە (فڵۆتینگ و شەفاف لەسەر مێزەکە) -->
    <div style="position:absolute; top:0; left:0; right:0; z-index:20; pointer-events:none; padding: max(10px, env(safe-area-inset-top)) 12px 0;">
      <div style="max-width:500px; margin:0 auto; display:flex; flex-direction:column; gap:7px;">

        <!-- ڕیزی ١: دوگمەی یاری نوێ + ناونیشان/نۆرە + ئاڵای دەرچوون -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <button onclick="confirmLeaveTeahouseDomino()" title="وازهێنان و دەرچوون"
            style="pointer-events:auto; width:40px; height:40px; border-radius:999px; background:rgba(255,253,248,0.95); color:#1c1917; border:2px solid #f59e0b; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 6px 18px rgba(0,0,0,0.55); cursor:pointer;">
            🏳️
          </button>

          <div id="ykDomTopPill"
            style="pointer-events:auto; padding:6px 18px; border-radius:999px; background:rgba(16,8,4,0.78); backdrop-filter:blur(10px); border:1.5px solid rgba(250,204,21,0.45); color:#fef3c7; font-size:13px; font-weight:900; box-shadow:0 6px 20px rgba(0,0,0,0.5); transition:all 0.25s ease; display:flex; align-items:center; gap:7px;">
            <span id="ykDomTopPillText">یاری دۆمینە</span>
          </div>

          <button onclick="startRoyalTeahouseDomino()" title="دەستپێکردنەوەی یاری"
            style="pointer-events:auto; width:40px; height:40px; border-radius:999px; background:rgba(255,253,248,0.95); color:#1c1917; border:2px solid #f59e0b; display:flex; align-items:center; justify-content:center; font-size:17px; box-shadow:0 6px 18px rgba(0,0,0,0.55); cursor:pointer;">
            🔄
          </button>
        </div>

        <!-- ڕیزی ٢: شریتی بۆت (هاوشێوەی پیتۆ بەڵام بە ستایلی شاهانەی YariKurdi) -->
        <div id="ykDomOppStrip"
          style="pointer-events:auto; background:rgba(15,8,4,0.76); backdrop-filter:blur(10px); border:1.8px solid rgba(250,204,21,0.28); border-radius:999px; padding:5px 12px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 8px 22px rgba(0,0,0,0.48); transition:all 0.25s ease;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="width:32px; height:32px; border-radius:999px; background:linear-gradient(135deg,#fde047,#b45309); border:2px solid #fef9c3; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 2px 8px rgba(0,0,0,0.5);">🤖</div>
            <span style="font-size:12px; font-weight:900; color:#fffbeb;">ژیریی دەستکرد • چایخانە</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <div id="ykDomBotMiniTiles" style="display:flex; gap:2.5px; align-items:center;"></div>
            <span id="ykDomBotScore" style="min-width:22px; text-align:center; font-size:14px; font-weight:900; color:#fde047;">0</span>
          </div>
        </div>

        <!-- ڕیزی ٣: کەپسوولی بازاڕ (پوولی ماوە) -->
        <div style="display:flex; justify-content:center;">
          <button id="ykDomBoneyardBtn" onclick="drawTeahouseBoneyard()"
            style="pointer-events:auto; background:linear-gradient(180deg,#ffffff,#fef3c7); color:#1c1917; border:2px solid #f59e0b; border-radius:999px; padding:4px 14px; font-size:12px; font-weight:900; display:inline-flex; align-items:center; gap:7px; box-shadow:0 8px 20px rgba(0,0,0,0.55); cursor:pointer; transition:transform 0.18s ease, box-shadow 0.2s ease;">
            <span style="width:14px; height:19px; border-radius:3px; background:linear-gradient(135deg,#dc2626,#991b1b); border:1px solid #facc15; display:inline-block; transform:rotate(-12deg);"></span>
            <span><span id="ykDomBoneyardNum">14</span> پوول ماوە</span>
          </button>
        </div>
      </div>
    </div>

    <!-- سپلاشی ناوەڕاستی دەستپێک و بردنەوە (وەک دۆمینە 101 🚩 لە ڤیدیۆکە) -->
    <div id="ykDomCenterSplash" style="position:absolute; inset:0; z-index:25; pointer-events:none; display:none; flex-direction:column; align-items:center; justify-content:center; gap:10px;">
      <div id="ykDomSplashTitle" style="font-size:44px; font-weight:900; color:#ffffff; text-shadow:0 6px 24px rgba(0,0,0,0.9), 0 0 24px rgba(250,204,21,0.55); letter-spacing:0.5px;">دۆمینە</div>
      <div id="ykDomSplashSub" style="padding:5px 20px; border-radius:999px; background:rgba(255,253,247,0.96); color:#1c1917; font-size:16px; font-weight:900; border:2px solid #f59e0b; box-shadow:0 10px 25px rgba(0,0,0,0.65); display:flex; align-items:center; gap:6px;">
        <span>101</span><span>🚩</span>
      </div>
    </div>

    <!-- HUD ی خوارەوە (شریتی یاریزان لە خوارەوەی شاشە) -->
    <div style="position:absolute; bottom:0; left:0; right:0; z-index:20; pointer-events:none; padding:0 12px max(10px, env(safe-area-inset-bottom));">
      <div id="ykDomPlayerStrip"
        style="max-width:500px; margin:0 auto; pointer-events:auto; background:linear-gradient(90deg, rgba(24,14,8,0.88), rgba(45,22,10,0.92), rgba(24,14,8,0.88)); backdrop-filter:blur(12px); border:2px solid rgba(250,204,21,0.55); border-radius:18px; padding:6px 14px; display:flex; align-items:center; justify-content:space-between; box-shadow:0 -4px 24px rgba(0,0,0,0.65); transition:all 0.25s ease;">
        <div style="display:flex; align-items:center; gap:9px;">
          <div id="ykDomMyAvatar" style="width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#fde047,#d97706); color:#1a0d06; font-weight:900; font-size:13px; display:flex; align-items:center; justify-content:center; border:1.5px solid #fef9c3; overflow:hidden;">👑</div>
          <div>
            <div id="ykDomPlayerName" style="font-size:13px; font-weight:900; color:#ffffff; line-height:1.2;">یاریزان</div>
            <div id="ykDomStatusSub" style="font-size:10px; font-weight:700; color:#fde68a;">ئامادەیە</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:10px; font-weight:700; color:#fcd34d;">خاڵ</span>
          <span id="ykDomMyScore" style="padding:2px 10px; border-radius:999px; background:rgba(250,204,21,0.18); border:1px solid rgba(250,204,21,0.5); font-size:14px; font-weight:900; color:#fef08a;">0</span>
        </div>
      </div>
    </div>
  `;
}

// پێشاندانی سپلاشی ناوەڕاستی شاشە (دۆمینە / 101 🚩 یان بردنەوەی دەور)
function showDominoSplash(title, sub, durationMs = 1100) {
  const wrap = document.getElementById('ykDomCenterSplash');
  const tEl = document.getElementById('ykDomSplashTitle');
  const sEl = document.getElementById('ykDomSplashSub');
  if (!wrap || !tEl || !sEl) return;

  tEl.textContent = title;
  sEl.innerHTML = sub;
  wrap.style.display = 'flex';
  wrap.style.opacity = '0';
  wrap.style.transform = 'scale(0.82)';
  wrap.style.transition = 'opacity 0.28s ease, transform 0.32s cubic-bezier(0.22,1,0.36,1)';

  requestAnimationFrame(() => {
    wrap.style.opacity = '1';
    wrap.style.transform = 'scale(1)';
  });

  if (durationMs > 0) {
    setTimeout(() => {
      wrap.style.opacity = '0';
      wrap.style.transform = 'scale(1.06)';
      setTimeout(() => { wrap.style.display = 'none'; }, 300);
    }, durationMs);
  }
}

class RoyalTeahouseDominoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoyalTeahouseDominoScene' });
    this.handSprites = [];
    this.dragState = null;
    this.lastChainLayout = null;
    this.ghostLeftSprite = null;
    this.ghostRightSprite = null;
    this.ghostCenterSprite = null;
    this.ghostLeftScreen = null;
    this.ghostRightScreen = null;
    this.ghostCenterScreen = null;
  }

  create() {
    dominoSceneRef = this;
    const w = this.scale.width;
    const h = this.scale.height;

    // ١. دروستکردنی مێزی 4K ی چایخانەی شاهانەی کوردستان
    this.bakeKurdishTeahouseTable(w, h);
    this.bgImage = this.add.image(w / 2, h / 2, 'yk_dom_master_table').setDisplaySize(w, h);

    // چینەکان بە ڕیزبەندی دروست
    this.ambientLayer = this.add.container(0, 0);
    this.boardCamContainer = this.add.container(w / 2, h / 2);
    this.boardTilesLayer = this.add.container(0, 0);
    this.ghostLayer = this.add.container(0, 0);
    this.boardCamContainer.add([this.boardTilesLayer, this.ghostLayer]);

    this.handLayer = this.add.container(0, 0);
    this.dragLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);

    this.initAmbientTeahouseFX(w, h);
    this.setupGlobalSmoothDrag();

    if (teahouseDom.myHand.length > 0 && !teahouseDom.isDealing) {
      this.renderBoard();
      this.renderHand();
    }
  }

  // کێشانی مێزی دارگوێزی فۆلکلۆری کوردی بە دیقەی 4K (تەزبیحی کارەبا، سینی چا، ئاڵای کوردستان، قاپە فۆلکلۆرییەکان)
  bakeKurdishTeahouseTable(w, h) {
    const key = 'yk_dom_master_table';
    if (this.textures.exists(key)) this.textures.remove(key);

    const cTex = this.textures.createCanvas(key, w, h);
    const ctx = cTex.getContext();
    const S = DOM_DPR;

    // ١. تەختەی دارگوێزی گەرم و قووڵ
    const baseGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 20 * S, w * 0.5, h * 0.48, Math.max(w, h) * 0.78);
    baseGrad.addColorStop(0, '#5a2d14');
    baseGrad.addColorStop(0.45, '#3f1e0d');
    baseGrad.addColorStop(0.82, '#281207');
    baseGrad.addColorStop(1, '#160903');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // هێڵی تەختە دارینەکان و دەمارەکانی دارگوێز
    const plankW = Math.max(58 * S, w / 6);
    for (let x = 0; x < w; x += plankW) {
      ctx.fillStyle = (Math.floor(x / plankW) % 2 === 0) ? 'rgba(255, 195, 130, 0.04)' : 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(x, 0, plankW - 1.5 * S, h);

      // دەمارە ناسکەکانی دار
      ctx.strokeStyle = 'rgba(255, 180, 100, 0.032)';
      ctx.lineWidth = 1.2 * S;
      for (let g = 0; g < 6; g++) {
        const gx = x + (g + 0.5) * (plankW / 6);
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.bezierCurveTo(gx + 6 * S, h * 0.33, gx - 6 * S, h * 0.66, gx + 2 * S, h);
        ctx.stroke();
      }

      // درزی نێوان تەختەکان
      ctx.strokeStyle = 'rgba(10, 4, 1, 0.58)';
      ctx.lineWidth = 2 * S;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // ٢. نەخشی باریکی جاجم و فەرشی کوردی لە لێواری ڕاست و چەپی مێزەکە
    const rugColors = ['#b91c1c', '#facc15', '#15803d', '#fffbeb'];
    const stripW = 5 * S;
    const segH = 16 * S;
    for (let y = 0; y < h; y += segH) {
      ctx.fillStyle = rugColors[Math.floor(y / segH) % rugColors.length];
      ctx.globalAlpha = 0.55;
      ctx.fillRect(0, y, stripW, segH - 2 * S);
      ctx.fillRect(w - stripW, y, stripW, segH - 2 * S);
    }
    ctx.globalAlpha = 1;

    // ٣. ڕازاندنەوەی گۆشەکانی مێز بە کەلوپەلی فۆلکلۆری کوردی (لە دەرەوەی ناوەڕاستی یارییەکە)
    const centerLeft = Math.max(24 * S, w / 2 - 220 * S);
    const centerRight = Math.min(w - 24 * S, w / 2 + 220 * S);

    // تەزبیحی کارەبای زێڕین (دەوری سەرەوەی چەپ — هاوشێوەی کەشوهەوای دیوەخان)
    this.drawAmberTesbih(ctx, centerLeft + 46 * S, 165 * S, S);

    // سینی مسینی گەورە و ئیستکانە چای گەرمی چایخانە (گۆشەی سەرەوەی ڕاست)
    this.drawCopperTeaTray(ctx, centerRight - 20 * S, 118 * S, S);

    // مەدالیای ئاڵای کوردستانی نەخشێنراو لەسەر تەختەکە (لای ڕاستی مێزەکە)
    this.drawInlaidKurdistanFlag(ctx, centerRight - 56 * S, h * 0.36, S);

    // قاپی فۆلکلۆری شین و قاوەیی چایخانە لە قەراغی چەپ و خوارەوە
    this.drawCeramicBowl(ctx, centerLeft - 4 * S, h * 0.44, 34 * S, '#1e3a5f', S);
    this.drawCeramicBowl(ctx, centerLeft + 10 * S, h * 0.62, 28 * S, '#7c2d12', S);

    // ٤. هێڵێکی زێڕینی ناسکی نێوان مێز و دەستی یاریزان لە خوارەوە
    const handAreaTop = h - 172 * S;
    const gradBot = ctx.createLinearGradient(0, handAreaTop, 0, h);
    gradBot.addColorStop(0, 'rgba(12, 5, 2, 0)');
    gradBot.addColorStop(0.35, 'rgba(12, 5, 2, 0.48)');
    gradBot.addColorStop(1, 'rgba(8, 3, 1, 0.85)');
    ctx.fillStyle = gradBot;
    ctx.fillRect(0, handAreaTop, w, h - handAreaTop);

    // ٥. ڕووناکیی فانۆسی گەرمی چایخانە لە ناوەڕاستدا + سێبەری سینەمایی لێوارەکان
    const spot = ctx.createRadialGradient(w / 2, h * 0.44, 10 * S, w / 2, h * 0.44, Math.min(w, h) * 0.56);
    spot.addColorStop(0, 'rgba(254, 215, 130, 0.14)');
    spot.addColorStop(0.65, 'rgba(217, 119, 6, 0.03)');
    spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, w, h);

    const vig = ctx.createRadialGradient(w / 2, h * 0.46, Math.min(w, h) * 0.32, w / 2, h * 0.46, Math.max(w, h) * 0.74);
    vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vig.addColorStop(1, 'rgba(0, 0, 0, 0.52)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    cTex.refresh();
  }

  drawAmberTesbih(ctx, cx, cy, S) {
    ctx.save();
    const beadCount = 24;
    const rx = 54 * S;
    const ry = 42 * S;

    // کێشانی دەنکە کارەبا بریقەدارەکان بە شێوەی ئەڵقەیی
    for (let i = 0; i < beadCount; i++) {
      const a = (i / beadCount) * Math.PI * 2;
      const bx = cx + Math.cos(a) * rx + Math.sin(a * 2) * 6 * S;
      const by = cy + Math.sin(a) * ry;
      const br = 5.4 * S;

      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath();
      ctx.arc(bx + 1.8 * S, by + 2.6 * S, br, 0, Math.PI * 2);
      ctx.fill();

      const bg = ctx.createRadialGradient(bx - 1.8 * S, by - 1.8 * S, 1, bx, by, br);
      bg.addColorStop(0, '#fef08a');
      bg.addColorStop(0.45, '#d97706');
      bg.addColorStop(1, '#78350f');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // گوڵینکی زێڕینی تەزبیحەکە
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5 * S;
    ctx.beginPath();
    ctx.moveTo(cx + rx * 0.72, cy + ry * 0.6);
    ctx.quadraticCurveTo(cx + rx * 0.95, cy + ry * 1.1, cx + rx * 0.78, cy + ry * 1.45);
    ctx.stroke();
    ctx.restore();
  }

  drawCopperTeaTray(ctx, x, y, S) {
    ctx.save();
    const trayR = 54 * S;
    // سێبەر
    ctx.fillStyle = 'rgba(0,0,0,0.48)';
    ctx.beginPath();
    ctx.arc(x + 4 * S, y + 6 * S, trayR, 0, Math.PI * 2);
    ctx.fill();

    // سینی مسینی نەخشدار
    const tg = ctx.createRadialGradient(x - 12 * S, y - 12 * S, 6 * S, x, y, trayR);
    tg.addColorStop(0, '#d9a45b');
    tg.addColorStop(0.55, '#8c5321');
    tg.addColorStop(1, '#4a250b');
    ctx.fillStyle = tg;
    ctx.beginPath();
    ctx.arc(x, y, trayR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2 * S;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.lineWidth = 1.2 * S;
    ctx.setLineDash([4 * S, 3 * S]);
    ctx.beginPath();
    ctx.arc(x, y, trayR - 8 * S, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ئیستکانە چا لەسەر سینییەکە (دیمەنی سەرەوە)
    const cx = x - 10 * S;
    const cy = y + 8 * S;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy, 18 * S, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5 * S;
    ctx.stroke();

    const teaG = ctx.createRadialGradient(cx - 2 * S, cy - 2 * S, 2 * S, cx, cy, 12 * S);
    teaG.addColorStop(0, '#dc2626');
    teaG.addColorStop(0.6, '#7f1d1d');
    teaG.addColorStop(1, '#3b0a0a');
    ctx.fillStyle = teaG;
    ctx.beginPath();
    ctx.arc(cx, cy, 11.5 * S, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 1.4 * S;
    ctx.stroke();

    // کڵۆ قەند
    ctx.fillStyle = '#fffbeb';
    ctx.fillRect(cx + 15 * S, cy - 6 * S, 6 * S, 6 * S);
    ctx.fillRect(cx + 18 * S, cy + 3 * S, 5.5 * S, 5.5 * S);
    ctx.restore();
  }

  drawInlaidKurdistanFlag(ctx, x, y, S) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.18);

    const fw = 48 * S;
    const fh = 32 * S;

    // سێبەر
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    this.roundRectPath(ctx, -fw / 2 + 2 * S, -fh / 2 + 3.5 * S, fw, fh, 5 * S);
    ctx.fill();

    ctx.save();
    this.roundRectPath(ctx, -fw / 2, -fh / 2, fw, fh, 5 * S);
    ctx.clip();

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-fw / 2, -fh / 2, fw, fh / 3 + 0.5);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-fw / 2, -fh / 2 + fh / 3, fw, fh / 3 + 0.5);
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-fw / 2, -fh / 2 + (fh * 2) / 3, fw, fh / 3 + 1);

    // خۆری ٢١ تیشک
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    const rays = 21;
    for (let i = 0; i < rays * 2; i++) {
      const r = i % 2 === 0 ? 7.8 * S : 4.2 * S;
      const a = (i * Math.PI) / rays - Math.PI / 2;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // بریقەی شووشەیی سەر ئاڵاکە
    const shine = ctx.createLinearGradient(-fw / 2, -fh / 2, fw / 2, fh / 2);
    shine.addColorStop(0, 'rgba(255,255,255,0.28)');
    shine.addColorStop(0.5, 'rgba(0,0,0,0.06)');
    shine.addColorStop(1, 'rgba(0,0,0,0.22)');
    ctx.fillStyle = shine;
    ctx.fillRect(-fw / 2, -fh / 2, fw, fh);
    ctx.restore();

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
    ctx.lineWidth = 1.6 * S;
    this.roundRectPath(ctx, -fw / 2, -fh / 2, fw, fh, 5 * S);
    ctx.stroke();

    ctx.restore();
  }

  drawCeramicBowl(ctx, x, y, r, color, S) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.48)';
    ctx.beginPath();
    ctx.arc(x + 3 * S, y + 5 * S, r, 0, Math.PI * 2);
    ctx.fill();

    const g = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, 2, x, y, r);
    g.addColorStop(0, '#334155');
    g.addColorStop(0.7, color);
    g.addColorStop(1, '#0f172a');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.5)';
    ctx.lineWidth = 2 * S;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.2 * S;
    ctx.beginPath();
    ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  initAmbientTeahouseFX(w, h) {
    const S = DOM_DPR;
    const centerRight = Math.min(w - 24 * S, w / 2 + 220 * S);

    // هەڵمی گەرمی سەر ئیستکانە چاکە
    this.time.addEvent({
      delay: 850,
      loop: true,
      callback: () => {
        if (!this.scene || !this.scene.isActive()) return;
        const puff = this.add.circle(
          centerRight - 30 * S + Phaser.Math.Between(-3, 3) * S,
          122 * S,
          4 * S,
          0xffffff,
          0.18
        );
        this.ambientLayer.add(puff);
        this.tweens.add({
          targets: puff,
          y: puff.y - 26 * S,
          x: puff.x + Phaser.Math.Between(-8, 8) * S,
          scale: 2.3,
          alpha: 0,
          duration: 1850,
          ease: 'Sine.easeOut',
          onComplete: () => puff.destroy()
        });
      }
    });

    // تۆزە زێڕینە سحراوییەکان لە ناو ڕووناکیی چایخانەدا
    for (let i = 0; i < 12; i++) {
      const mote = this.add.circle(
        Phaser.Math.Between(30 * S, w - 30 * S),
        Phaser.Math.Between(140 * S, h - 180 * S),
        Phaser.Math.FloatBetween(1.1, 2.2) * S,
        0xfde68a,
        Phaser.Math.FloatBetween(0.08, 0.3)
      );
      this.ambientLayer.add(mote);
      this.tweens.add({
        targets: mote,
        y: mote.y - Phaser.Math.Between(12, 26) * S,
        alpha: { from: 0.05, to: 0.34 },
        duration: Phaser.Math.Between(2800, 4800),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  // دروستکردنی پوولی ٣ ڕەهەندی عاجیی شاهانە (وەک پیتۆ بەڵام قووڵتر و بریقەدارتر)
  createDominoSprite(a, b, orientation = 'vertical', scale = 1, options = {}) {
    const S = DOM_DPR * scale;
    const isHoriz = orientation === 'horizontal';
    const tileW = (isHoriz ? 74 : 40) * S;
    const tileH = (isHoriz ? 40 : 74) * S;
    const rad = 8.5 * S;

    const container = this.add.container(0, 0);
    const gfx = this.add.graphics();

    const isGhost = !!options.ghost;
    const isHighlighted = !!options.highlight;
    const isBack = !!options.faceDown;
    const isPlayable = !!options.playable;

    if (isBack) {
      // پشتی پوولی YariKurdi (سووری یاقووتی بە چوارچێوەی زێڕین)
      gfx.fillStyle(0x000000, 0.5);
      gfx.fillRoundedRect(-tileW / 2 + 2.5 * S, -tileH / 2 + 4.5 * S, tileW, tileH, rad);
      gfx.fillStyle(0x991b1b, 1);
      gfx.fillRoundedRect(-tileW / 2, -tileH / 2 + 2.5 * S, tileW, tileH, rad);
      gfx.fillStyle(0xdc2626, 1);
      gfx.fillRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);
      gfx.lineStyle(1.8 * S, 0xfacc15, 0.95);
      gfx.strokeRoundedRect(-tileW / 2 + 3 * S, -tileH / 2 + 3 * S, tileW - 6 * S, tileH - 6 * S, rad * 0.6);
      container.add(gfx);

      const yk = this.add.text(0, 0, 'YK', {
        fontFamily: 'Georgia, serif',
        fontSize: `${Math.round(13 * S)}px`,
        fontStyle: 'bold',
        color: '#fef08a'
      }).setOrigin(0.5);
      container.add(yk);
      container.setSize(tileW, tileH);
      return container;
    }

    if (isGhost) {
      // سێبەری شەفافی شوێنی دانان (Ghost Preview) ڕێک وەک ڤیدیۆکەی پیتۆ
      if (isHighlighted) {
        gfx.fillStyle(0x10b981, 0.36);
        gfx.fillRoundedRect(-tileW / 2 - 4 * S, -tileH / 2 - 4 * S, tileW + 8 * S, tileH + 8 * S, rad + 3 * S);
      }
      gfx.fillStyle(0xfffbeb, isHighlighted ? 0.58 : 0.32);
      gfx.fillRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);
      gfx.lineStyle(isHighlighted ? 3 * S : 2 * S, isHighlighted ? 0xfacc15 : 0xfef3c7, isHighlighted ? 1 : 0.8);
      gfx.strokeRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

      // هێڵی ناوەڕاست
      gfx.lineStyle(1.4 * S, 0xfef3c7, 0.65);
      if (isHoriz) {
        gfx.beginPath(); gfx.moveTo(0, -tileH * 0.36); gfx.lineTo(0, tileH * 0.36); gfx.strokePath();
      } else {
        gfx.beginPath(); gfx.moveTo(-tileW * 0.36, 0); gfx.lineTo(tileW * 0.36, 0); gfx.strokePath();
      }

      this.drawPipsOnGraphics(gfx, a, b, isHoriz, tileW, tileH, S, isHighlighted ? 0.92 : 0.62);
      container.add(gfx);
      container.setSize(tileW, tileH);
      return container;
    }

    // هالەی زێڕینی نەرم بۆ پوولە ئامادەکان
    if (isPlayable) {
      gfx.fillStyle(0xfacc15, 0.22);
      gfx.fillRoundedRect(-tileW / 2 - 2.5 * S, -tileH / 2 - 2.5 * S, tileW + 5 * S, tileH + 5 * S, rad + 2 * S);
    }

    // سێبەری قووڵ لەسەر مێزەکە
    gfx.fillStyle(0x000000, 0.54);
    gfx.fillRoundedRect(-tileW / 2 + 2.5 * S, -tileH / 2 + 5.5 * S, tileW, tileH, rad);

    // لێواری ئەستووری خوارەوەی ٣ ڕەهەندی (عاجی تۆختر)
    gfx.fillStyle(0xc6b28f, 1);
    gfx.fillRoundedRect(-tileW / 2, -tileH / 2 + 3.2 * S, tileW, tileH, rad);

    // ڕووی سەرەوەی عاجی گەرم و پاک
    gfx.fillStyle(0xfffaf0, 1);
    gfx.fillRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

    // بریقەی شووشەیی سەرەوە
    gfx.fillStyle(0xffffff, 0.85);
    gfx.fillRoundedRect(-tileW / 2 + 2 * S, -tileH / 2 + 1.5 * S, tileW - 4 * S, tileH * 0.24, rad * 0.65);

    // چوارچێوەی دەرەوە
    gfx.lineStyle(isPlayable ? 2.2 * S : 1.3 * S, isPlayable ? 0xf59e0b : 0xd6c3a1, 1);
    gfx.strokeRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

    // هێڵ و بزماری زێڕینی ناوەڕاست
    gfx.lineStyle(1.7 * S, 0x92400e, 0.65);
    if (isHoriz) {
      gfx.beginPath(); gfx.moveTo(0, -tileH * 0.37); gfx.lineTo(0, tileH * 0.37); gfx.strokePath();
    } else {
      gfx.beginPath(); gfx.moveTo(-tileW * 0.37, 0); gfx.lineTo(tileW * 0.37, 0); gfx.strokePath();
    }
    gfx.fillStyle(0xd97706, 1);
    gfx.fillCircle(0, 0, 2.7 * S);
    gfx.fillStyle(0xfef08a, 1);
    gfx.fillCircle(-0.6 * S, -0.6 * S, 1.1 * S);

    this.drawPipsOnGraphics(gfx, a, b, isHoriz, tileW, tileH, S, 1);

    container.add(gfx);
    container.setSize(tileW, tileH);
    return container;
  }

  drawPipsOnGraphics(gfx, a, b, isHoriz, tileW, tileH, S, alpha = 1) {
    const pipMap = {
      0: [],
      1: [[0, 0]],
      2: [[-1, -1], [1, 1]],
      3: [[-1, -1], [0, 0], [1, 1]],
      4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
      5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
      6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
    };
    // ڕەنگە دڵگیر و زەقەکانی پیتۆ و چایخانە
    const colorMap = {
      1: 0xdc2626, // سووری یاقووتی
      2: 0x059669, // سەوزی زمڕوتی
      3: 0xea580c, // پرتەقاڵیی گەرم
      4: 0x2563eb, // شینی شاهانە
      5: 0x0284c7, // شینی فیروزەیی
      6: 0xb91c1c  // سووری تۆخ
    };

    const drawHalf = (val, cx, cy, halfSize) => {
      const pts = pipMap[val] || [];
      const col = colorMap[val] || 0x1e293b;
      const spread = halfSize * 0.56;
      const r = (val === 1 ? 4.3 : 3.2) * S;

      pts.forEach(([ox, oy]) => {
        const px = cx + ox * spread;
        const py = cy + oy * spread;
        gfx.fillStyle(0x000000, 0.22 * alpha);
        gfx.fillCircle(px, py + 0.8 * S, r);
        gfx.fillStyle(col, alpha);
        gfx.fillCircle(px, py, r);
        gfx.fillStyle(0xffffff, 0.42 * alpha);
        gfx.fillCircle(px - r * 0.28, py - r * 0.28, r * 0.28);
      });
    };

    if (isHoriz) {
      drawHalf(a, -tileW / 4, 0, tileH / 2);
      drawHalf(b, tileW / 4, 0, tileH / 2);
    } else {
      drawHalf(a, 0, -tileH / 4, tileW / 2);
      drawHalf(b, 0, tileH / 4, tileW / 2);
    }
  }

  // ئەلگۆریزمی زنجیرەی ستوونی و پێچاوپێچ (بەبێ هیچ تێکەڵبوونێک — ڕێک وەک ڤیدیۆکەی پیتۆ!)
  computeChainLayout() {
    const LONG = 74;
    const SHORT = 40;
    const GAP = 2;
    const TURN_Y = 148;
    const TURN_X = 96;

    const placed = [];
    if (teahouseDom.chain.length === 0) {
      return {
        placed,
        upAnchor: { x: 0, y: 0 },
        upDir: 'U',
        downAnchor: { x: 0, y: 0 },
        downDir: 'D'
      };
    }

    const stepPlacement = (anchor, dir, innerVal, outerVal, branch) => {
      const isDbl = (innerVal === outerVal);
      let orient, cx, cy, v1, v2, w, h, nextAnchor, nextDir = dir;

      if (dir === 'U') {
        if (isDbl) {
          orient = 'horizontal'; w = LONG; h = SHORT;
          cx = anchor.x; cy = anchor.y - SHORT / 2;
          v1 = innerVal; v2 = outerVal;
          nextAnchor = { x: cx, y: cy - SHORT / 2 - GAP };
        } else {
          orient = 'vertical'; w = SHORT; h = LONG;
          cx = anchor.x; cy = anchor.y - LONG / 2;
          v1 = outerVal; v2 = innerVal;
          if (branch === 'up' && cy < -TURN_Y) {
            nextDir = 'R';
            nextAnchor = { x: cx + SHORT / 2 + GAP, y: cy - LONG / 2 + SHORT / 2 };
          } else {
            nextAnchor = { x: cx, y: cy - LONG / 2 - GAP };
          }
        }
      } else if (dir === 'R') {
        if (isDbl) {
          orient = 'vertical'; w = SHORT; h = LONG;
          cx = anchor.x + SHORT / 2; cy = anchor.y;
          v1 = innerVal; v2 = outerVal;
          nextAnchor = { x: cx + SHORT / 2 + GAP, y: cy };
        } else {
          orient = 'horizontal'; w = LONG; h = SHORT;
          cx = anchor.x + LONG / 2; cy = anchor.y;
          v1 = innerVal; v2 = outerVal;
          if (branch === 'up' && cx > TURN_X) {
            nextDir = 'D';
            nextAnchor = { x: cx + LONG / 2 - SHORT / 2, y: cy + SHORT / 2 + GAP };
          } else {
            nextAnchor = { x: cx + LONG / 2 + GAP, y: cy };
          }
        }
      } else if (dir === 'D') {
        if (isDbl) {
          orient = 'horizontal'; w = LONG; h = SHORT;
          cx = anchor.x; cy = anchor.y + SHORT / 2;
          v1 = innerVal; v2 = outerVal;
          nextAnchor = { x: cx, y: cy + SHORT / 2 + GAP };
        } else {
          orient = 'vertical'; w = SHORT; h = LONG;
          cx = anchor.x; cy = anchor.y + LONG / 2;
          v1 = innerVal; v2 = outerVal;
          if (branch === 'down' && cy > TURN_Y) {
            nextDir = 'L';
            nextAnchor = { x: cx - SHORT / 2 - GAP, y: cy + LONG / 2 - SHORT / 2 };
          } else {
            nextAnchor = { x: cx, y: cy + LONG / 2 + GAP };
          }
        }
      } else { // 'L'
        if (isDbl) {
          orient = 'vertical'; w = SHORT; h = LONG;
          cx = anchor.x - SHORT / 2; cy = anchor.y;
          v1 = innerVal; v2 = outerVal;
          nextAnchor = { x: cx - SHORT / 2 - GAP, y: cy };
        } else {
          orient = 'horizontal'; w = LONG; h = SHORT;
          cx = anchor.x - LONG / 2; cy = anchor.y;
          v1 = outerVal; v2 = innerVal;
          if (branch === 'down' && cx < -TURN_X) {
            nextDir = 'U';
            nextAnchor = { x: cx - LONG / 2 + SHORT / 2, y: cy - SHORT / 2 - GAP };
          } else {
            nextAnchor = { x: cx - LONG / 2 - GAP, y: cy };
          }
        }
      }

      return { cx, cy, orient, v1, v2, w, h, nextAnchor, nextDir };
    };

    const rootIdx = Math.min(Math.max(teahouseDom.rootIndex, 0), teahouseDom.chain.length - 1);
    const root = teahouseDom.chain[rootIdx];
    const rootIsDbl = (root.a === root.b);

    let upAnchor, downAnchor;
    if (rootIsDbl) {
      placed.push({ cx: 0, cy: 0, orient: 'horizontal', v1: root.a, v2: root.b, w: LONG, h: SHORT });
      upAnchor = { x: 0, y: -SHORT / 2 - GAP };
      downAnchor = { x: 0, y: SHORT / 2 + GAP };
    } else {
      placed.push({ cx: 0, cy: 0, orient: 'vertical', v1: root.a, v2: root.b, w: SHORT, h: LONG });
      upAnchor = { x: 0, y: -LONG / 2 - GAP };
      downAnchor = { x: 0, y: LONG / 2 + GAP };
    }

    // لقی سەرەوە (left side of chain array: rootIdx - 1 down to 0)
    let curA = upAnchor, curDir = 'U';
    for (let i = rootIdx - 1; i >= 0; i--) {
      const t = teahouseDom.chain[i];
      const res = stepPlacement(curA, curDir, t.b, t.a, 'up');
      placed.push(res);
      curA = res.nextAnchor;
      curDir = res.nextDir;
    }
    const finalUpAnchor = curA, finalUpDir = curDir;

    // لقی خوارەوە (right side of chain array: rootIdx + 1 up to end)
    curA = downAnchor; curDir = 'D';
    for (let i = rootIdx + 1; i < teahouseDom.chain.length; i++) {
      const t = teahouseDom.chain[i];
      const res = stepPlacement(curA, curDir, t.a, t.b, 'down');
      placed.push(res);
      curA = res.nextAnchor;
      curDir = res.nextDir;
    }
    const finalDownAnchor = curA, finalDownDir = curDir;

    return {
      placed,
      upAnchor: finalUpAnchor,
      upDir: finalUpDir,
      downAnchor: finalDownAnchor,
      downDir: finalDownDir,
      stepPlacement
    };
  }

  // خۆگونجاندنی ئۆتۆماتیکی کامێرای مێز (Auto-Center & Auto-Zoom) لە نێوان HUD ی سەرەوە و دەستی خوارەوە
  fitBoardCamera(extraPoints = []) {
    const S = DOM_DPR;
    const w = this.scale.width;
    const h = this.scale.height;

    const safeTop = 152 * S;
    const safeBot = h - 182 * S;
    const safeH = Math.max(180 * S, safeBot - safeTop);
    const safeW = Math.min(w - 36 * S, 460 * S);
    const centerY = (safeTop + safeBot) / 2;

    const layout = this.lastChainLayout;
    if (!layout || (layout.placed.length === 0 && extraPoints.length === 0)) {
      this.boardCamContainer.setPosition(w / 2, centerY);
      this.boardCamContainer.setScale(1.12);
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    const expand = (cx, cy, hw, hh) => {
      minX = Math.min(minX, cx - hw);
      maxX = Math.max(maxX, cx + hw);
      minY = Math.min(minY, cy - hh);
      maxY = Math.max(maxY, cy + hh);
    };

    layout.placed.forEach(p => expand(p.cx * S, p.cy * S, (p.w * S) / 2, (p.h * S) / 2));
    extraPoints.forEach(p => expand(p.cx * S, p.cy * S, (p.w * S) / 2, (p.h * S) / 2));

    const spanW = Math.max(120 * S, maxX - minX + 44 * S);
    const spanH = Math.max(120 * S, maxY - minY + 44 * S);

    const targetScale = Math.min(1.18, Math.max(0.56, Math.min(safeW / spanW, safeH / spanH)));
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    const targetX = w / 2 - midX * targetScale;
    const targetY = centerY - midY * targetScale;

    this.tweens.add({
      targets: this.boardCamContainer,
      x: targetX,
      y: targetY,
      scale: targetScale,
      duration: 240,
      ease: 'Cubic.easeOut'
    });
  }

  worldBoardToScreen(bx, by) {
    const S = DOM_DPR;
    const sc = this.boardCamContainer.scale;
    return {
      x: this.boardCamContainer.x + bx * S * sc,
      y: this.boardCamContainer.y + by * S * sc
    };
  }

  renderBoard() {
    const S = DOM_DPR;
    this.boardTilesLayer.removeAll(true);
    this.lastChainLayout = this.computeChainLayout();

    this.lastChainLayout.placed.forEach(item => {
      const sp = this.createDominoSprite(item.v1, item.v2, item.orient, 1, {});
      sp.setPosition(item.cx * S, item.cy * S);
      this.boardTilesLayer.add(sp);
    });

    this.fitBoardCamera();
  }

  clearGhostSlots() {
    this.ghostLayer.removeAll(true);
    this.ghostLeftSprite = null;
    this.ghostRightSprite = null;
    this.ghostCenterSprite = null;
    this.ghostLeftScreen = null;
    this.ghostRightScreen = null;
    this.ghostCenterScreen = null;
  }

  // پیشاندانی شوێنە شەفافەکانی دانان (وەک پیتۆ) بۆ پوولی دیاریکراو یان ڕاکێشراو
  showGhostSlotsForTile(tile, idx, highlightSide = null) {
    this.clearGhostSlots();
    if (!tile || teahouseDom.turn !== 'player' || teahouseDom.roundOver) return;

    const S = DOM_DPR;
    const fit = checkTeahouseTileFit(tile);
    const extraPts = [];

    if (teahouseDom.chain.length === 0) {
      if (!fit.left && !fit.right) return;
      const isDbl = tile.a === tile.b;
      const orient = isDbl ? 'horizontal' : 'vertical';
      const sp = this.createDominoSprite(tile.a, tile.b, orient, 1, { ghost: true, highlight: highlightSide === 'center' });
      sp.setPosition(0, 0);
      sp.setInteractive({ useHandCursor: true });
      sp.on('pointerup', () => this.commitMoveWithAnimation(idx, 'right', 0, 0));
      this.ghostLayer.add(sp);
      this.ghostCenterSprite = sp;
      this.ghostCenterScreen = this.worldBoardToScreen(0, 0);
      return;
    }

    const layout = this.lastChainLayout || this.computeChainLayout();

    // لقی سەرەوە ('left')
    if (fit.left) {
      const inner = teahouseDom.leftEnd;
      const outer = (tile.a === inner) ? tile.b : tile.a;
      const pos = layout.stepPlacement(layout.upAnchor, layout.upDir, inner, outer, 'up');
      const sp = this.createDominoSprite(pos.v1, pos.v2, pos.orient, 1, { ghost: true, highlight: highlightSide === 'left' });
      sp.setPosition(pos.cx * S, pos.cy * S);
      sp.setInteractive({ useHandCursor: true });
      sp.on('pointerup', () => this.commitMoveWithAnimation(idx, 'left', pos.cx, pos.cy));
      this.ghostLayer.add(sp);
      this.ghostLeftSprite = sp;
      this.ghostLeftScreen = this.worldBoardToScreen(pos.cx, pos.cy);
      extraPts.push(pos);
    }

    // لقی خوارەوە ('right')
    if (fit.right) {
      const inner = teahouseDom.rightEnd;
      const outer = (tile.a === inner) ? tile.b : tile.a;
      const pos = layout.stepPlacement(layout.downAnchor, layout.downDir, inner, outer, 'down');
      const sp = this.createDominoSprite(pos.v1, pos.v2, pos.orient, 1, { ghost: true, highlight: highlightSide === 'right' });
      sp.setPosition(pos.cx * S, pos.cy * S);
      sp.setInteractive({ useHandCursor: true });
      sp.on('pointerup', () => this.commitMoveWithAnimation(idx, 'right', pos.cx, pos.cy));
      this.ghostLayer.add(sp);
      this.ghostRightSprite = sp;
      this.ghostRightScreen = this.worldBoardToScreen(pos.cx, pos.cy);
      extraPts.push(pos);
    }

    if (extraPts.length > 0 && !this.dragState) {
      this.fitBoardCamera(extraPts);
    }
  }

  getHandTileLayout(count) {
    const S = DOM_DPR;
    const w = this.scale.width;
    const h = this.scale.height;
    const maxW = Math.min(w - 20 * S, 480 * S);
    const baseScale = count > 7 ? Math.max(0.74, maxW / (count * 47 * S)) : Math.min(1.06, maxW / (7 * 48 * S));
    const stepX = Math.min(48 * baseScale * S, maxW / Math.max(count, 1));
    const totalW = stepX * count;
    const startX = (w - totalW) / 2 + stepX / 2;
    const baseY = h - 104 * S;
    return { baseScale, stepX, startX, baseY };
  }

  renderHand() {
    const S = DOM_DPR;
    this.handLayer.removeAll(true);
    this.handSprites = [];

    const count = teahouseDom.myHand.length;
    if (count === 0) return;

    const { baseScale, stepX, startX, baseY } = this.getHandTileLayout(count);

    teahouseDom.myHand.forEach((tile, idx) => {
      const fit = (teahouseDom.turn === 'player' && !teahouseDom.roundOver && !teahouseDom.isDealing)
        ? checkTeahouseTileFit(tile)
        : { left: false, right: false };
      const canPlay = fit.left || fit.right;
      const isSelected = (teahouseDom.selectedHandIdx === idx);

      const restX = startX + idx * stepX;
      const restY = baseY - (isSelected ? 18 * S : (canPlay ? 7 * S : 0));

      const sp = this.createDominoSprite(tile.a, tile.b, 'vertical', baseScale, { playable: canPlay });
      sp.setPosition(restX, restY);
      if (!canPlay && teahouseDom.turn === 'player' && !teahouseDom.isDealing) {
        sp.setAlpha(0.68);
      }

      if (canPlay) {
        sp.setInteractive({ useHandCursor: true });
        sp.on('pointerdown', (pointer) => {
          if (this.dragState || teahouseDom.isDealing || teahouseDom.roundOver) return;
          this.startTileGrab(idx, tile, sp, restX, restY, baseScale, fit, pointer);
        });
      }

      this.handLayer.add(sp);
      this.handSprites[idx] = { sp, restX, restY, baseScale };
    });
  }

  // سیستەمی ڕاکێشانی زۆر نەرمی ١:١ (بەبێ تێکدانی سپرایتەکە — ڕێک بە دەست و ماوسەوە دێت!)
  startTileGrab(idx, tile, sp, restX, restY, baseScale, fit, pointer) {
    const S = DOM_DPR;
    teahouseDom.selectedHandIdx = idx;

    // گواستنەوەی پوولەکە بۆ چینی سەرەوە تا لەسەر هەموو شتێک بێت
    this.handLayer.remove(sp);
    this.dragLayer.add(sp);

    this.tweens.killTweensOf(sp);
    this.tweens.add({
      targets: sp,
      scale: 1.14,
      duration: 110,
      ease: 'Back.easeOut'
    });

    this.dragState = {
      idx,
      tile,
      sp,
      restX,
      restY,
      baseScale,
      fit,
      startX: pointer.x,
      startY: pointer.y,
      lastX: pointer.x,
      isDragging: false,
      activeHighlight: null
    };

    // پیشاندانی شوێنە گونجاوەکان لەسەر مێز
    this.showGhostSlotsForTile(tile, idx, null);
    playTeahouseWoodClack(1.25);
  }

  setupGlobalSmoothDrag() {
    const S = DOM_DPR;

    this.input.on('pointermove', (pointer) => {
      const ds = this.dragState;
      if (!ds) return;

      const dist = Phaser.Math.Distance.Between(ds.startX, ds.startY, pointer.x, pointer.y);
      if (dist > 6 * S) ds.isDragging = true;
      if (!ds.isDragging) return;

      // ڕاکێشانی ڕاستەوخۆ لەگەڵ ماوس/پەنجە
      const isTouch = (pointer.pointerType === 'touch');
      const targetX = pointer.x;
      const targetY = pointer.y - (isTouch ? 24 * S : 0);

      const vx = pointer.x - ds.lastX;
      ds.lastX = pointer.x;
      ds.sp.setPosition(targetX, targetY);
      ds.sp.setRotation(Phaser.Math.Clamp(vx * 0.012, -0.24, 0.24));

      // پشکنینی نزیکبوونەوە لە شوێنی دانانی سەرەوە یان خوارەوە بۆ درەوشانەوەی موگناتیسی
      const handLimitY = this.scale.height - 155 * S;
      let newHighlight = null;

      if (targetY < handLimitY) {
        if (teahouseDom.chain.length === 0) {
          newHighlight = 'center';
        } else if (ds.fit.left && ds.fit.right) {
          const dL = this.ghostLeftScreen
            ? Phaser.Math.Distance.Between(targetX, targetY, this.ghostLeftScreen.x, this.ghostLeftScreen.y)
            : 99999;
          const dR = this.ghostRightScreen
            ? Phaser.Math.Distance.Between(targetX, targetY, this.ghostRightScreen.x, this.ghostRightScreen.y)
            : 99999;
          newHighlight = dL <= dR ? 'left' : 'right';
        } else if (ds.fit.left) {
          newHighlight = 'left';
        } else if (ds.fit.right) {
          newHighlight = 'right';
        }
      }

      if (newHighlight !== ds.activeHighlight) {
        ds.activeHighlight = newHighlight;
        this.showGhostSlotsForTile(ds.tile, ds.idx, newHighlight);
      }
    });

    this.input.on('pointerup', (pointer) => {
      const ds = this.dragState;
      if (!ds) return;
      this.dragState = null;

      const handLimitY = this.scale.height - 150 * S;

      if (ds.isDragging) {
        // ئەگەر ڕاکێشرا بوو و لە ناو مێزەکەدا بەردرا:
        if (ds.sp.y < handLimitY && ds.activeHighlight) {
          const chosenSide = ds.activeHighlight === 'center' ? 'right' : ds.activeHighlight;
          const targetScreen = ds.activeHighlight === 'left'
            ? this.ghostLeftScreen
            : (ds.activeHighlight === 'right' ? this.ghostRightScreen : this.ghostCenterScreen);

          this.snapDraggedTileAndPlay(ds, chosenSide, targetScreen);
          return;
        }

        // گەڕاندنەوەی نەرمی پوولەکە بۆ ناو دەست ئەگەر ڕاکێشانەکە هەڵوەشێنرایەوە
        teahouseDom.selectedHandIdx = null;
        this.clearGhostSlots();
        this.tweens.add({
          targets: ds.sp,
          x: ds.restX,
          y: ds.restY,
          scale: 1,
          rotation: 0,
          duration: 180,
          ease: 'Back.easeOut',
          onComplete: () => {
            this.dragLayer.removeAll(true);
            this.renderHand();
          }
        });
      } else {
        // ئەگەر تەنها کلیک/تاپێکی خێرا بوو:
        this.dragLayer.remove(ds.sp);
        this.handLayer.add(ds.sp);
        ds.sp.setScale(1).setRotation(0);

        if (teahouseDom.chain.length === 0) {
          this.commitMoveWithAnimation(ds.idx, 'right', 0, 0);
        } else if (ds.fit.left && !ds.fit.right) {
          this.commitMoveWithAnimation(ds.idx, 'left');
        } else if (ds.fit.right && !ds.fit.left) {
          this.commitMoveWithAnimation(ds.idx, 'right');
        } else if (ds.fit.left && ds.fit.right && teahouseDom.leftEnd === teahouseDom.rightEnd) {
          this.commitMoveWithAnimation(ds.idx, 'right');
        } else {
          // هەردوو سەر دەبێت و جیاوازن: هەردوو سێبەرە شەفافەکە لەسەر مێز دەمێننەوە تا یەکێکیان کلیک بکەیت!
          this.renderHand();
          this.showGhostSlotsForTile(ds.tile, ds.idx, null);
        }
      }
    });
  }

  snapDraggedTileAndPlay(ds, side, targetScreen) {
    const tx = targetScreen ? targetScreen.x : this.scale.width / 2;
    const ty = targetScreen ? targetScreen.y : this.scale.height / 2;

    this.clearGhostSlots();
    this.tweens.add({
      targets: ds.sp,
      x: tx,
      y: ty,
      scale: this.boardCamContainer.scale,
      rotation: 0,
      duration: 130,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        this.dragLayer.removeAll(true);
        this.spawnGoldRipple(tx, ty);
        executePlayerTeahouseMove(ds.idx, side);
      }
    });
  }

  commitMoveWithAnimation(idx, side) {
    const handInfo = this.handSprites[idx];
    const targetScreen = (teahouseDom.chain.length === 0)
      ? this.worldBoardToScreen(0, 0)
      : (side === 'left' ? this.ghostLeftScreen : this.ghostRightScreen);

    this.clearGhostSlots();
    teahouseDom.selectedHandIdx = null;

    if (handInfo && handInfo.sp && targetScreen) {
      const sp = handInfo.sp;
      this.handLayer.remove(sp);
      this.dragLayer.add(sp);
      this.tweens.add({
        targets: sp,
        x: targetScreen.x,
        y: targetScreen.y,
        scale: this.boardCamContainer.scale,
        duration: 190,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          this.dragLayer.removeAll(true);
          this.spawnGoldRipple(targetScreen.x, targetScreen.y);
          executePlayerTeahouseMove(idx, side);
        }
      });
    } else {
      executePlayerTeahouseMove(idx, side);
    }
  }

  // ئەنیمەیشنی دابەشکردنی پوولەکان لە سەرەتای یارییەکەدا (وەک پیتۆ!)
  playDealingAnimation(onComplete) {
    const S = DOM_DPR;
    const w = this.scale.width;
    const h = this.scale.height;

    this.boardTilesLayer.removeAll(true);
    this.ghostLayer.removeAll(true);
    this.handLayer.removeAll(true);
    this.dragLayer.removeAll(true);

    const centerX = w / 2;
    const centerY = h * 0.45;
    const deckStack = this.createDominoSprite(0, 0, 'vertical', 0.95, { faceDown: true });
    deckStack.setPosition(centerX, centerY);
    this.fxLayer.add(deckStack);

    const { baseScale, stepX, startX, baseY } = this.getHandTileLayout(7);

    for (let i = 0; i < 7; i++) {
      this.time.delayedCall(i * 70, () => {
        playTeahouseWoodClack(1.1 + i * 0.04);

        // پوولی خۆت دەفڕێتە خوارەوە
        const myFly = this.createDominoSprite(0, 0, 'vertical', baseScale, { faceDown: true });
        myFly.setPosition(centerX, centerY);
        this.fxLayer.add(myFly);
        this.tweens.add({
          targets: myFly,
          x: startX + i * stepX,
          y: baseY,
          duration: 240,
          ease: 'Cubic.easeOut',
          onComplete: () => myFly.destroy()
        });

        // پوولی بۆت دەفڕێتە سەرەوە
        const botFly = this.createDominoSprite(0, 0, 'vertical', 0.45, { faceDown: true });
        botFly.setPosition(centerX, centerY);
        this.fxLayer.add(botFly);
        this.tweens.add({
          targets: botFly,
          x: w * 0.35 + i * 10 * S,
          y: 78 * S,
          alpha: 0.2,
          duration: 240,
          ease: 'Cubic.easeOut',
          onComplete: () => botFly.destroy()
        });
      });
    }

    this.time.delayedCall(7 * 70 + 280, () => {
      this.tweens.add({
        targets: deckStack,
        alpha: 0,
        scale: 0.4,
        duration: 180,
        onComplete: () => {
          deckStack.destroy();
          if (onComplete) onComplete();
        }
      });
    });
  }

  // ئەنیمەیشنی فڕینی پوولی بۆت بۆ سەر مێزەکە
  playBotTileFlight(tile, side, onComplete) {
    const w = this.scale.width;
    const S = DOM_DPR;
    const layout = this.lastChainLayout || this.computeChainLayout();

    let targetScreen = this.worldBoardToScreen(0, 0);
    if (teahouseDom.chain.length > 0) {
      if (side === 'left') {
        const inner = teahouseDom.leftEnd;
        const outer = tile.a === inner ? tile.b : tile.a;
        const pos = layout.stepPlacement(layout.upAnchor, layout.upDir, inner, outer, 'up');
        targetScreen = this.worldBoardToScreen(pos.cx, pos.cy);
      } else {
        const inner = teahouseDom.rightEnd;
        const outer = tile.a === inner ? tile.b : tile.a;
        const pos = layout.stepPlacement(layout.downAnchor, layout.downDir, inner, outer, 'down');
        targetScreen = this.worldBoardToScreen(pos.cx, pos.cy);
      }
    }

    const fly = this.createDominoSprite(tile.a, tile.b, 'vertical', 0.85, {});
    fly.setPosition(w / 2, 85 * S);
    this.fxLayer.add(fly);

    this.tweens.add({
      targets: fly,
      x: targetScreen.x,
      y: targetScreen.y,
      scale: this.boardCamContainer.scale,
      duration: 280,
      ease: 'Cubic.easeOut',
      onComplete: () => {
        fly.destroy();
        this.spawnGoldRipple(targetScreen.x, targetScreen.y);
        if (onComplete) onComplete();
      }
    });
  }

  spawnGoldRipple(x, y) {
    const S = DOM_DPR;
    const ring = this.add.circle(x, y, 10 * S);
    ring.setStrokeStyle(2.5 * S, 0xfacc15, 0.9);
    this.fxLayer.add(ring);
    this.tweens.add({
      targets: ring,
      scale: 3.4,
      alpha: 0,
      duration: 380,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });
  }
}

function initDominoPhaser() {
  ensureDominoFullscreenShell();
  const stage = document.getElementById('ykDomFullStage');
  if (!stage) return;

  const w = Math.max(window.innerWidth, 320);
  const h = Math.max(window.innerHeight, 520);

  if (!dominoPhaserGame) {
    stage.innerHTML = '';
    dominoPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: Math.round(w * DOM_DPR),
      height: Math.round(h * DOM_DPR),
      scale: {
        mode: Phaser.Scale.ENVELOP,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Math.round(w * DOM_DPR),
        height: Math.round(h * DOM_DPR)
      },
      antialias: true,
      parent: 'ykDomFullStage',
      transparent: true,
      scene: [RoyalTeahouseDominoScene]
    });
  } else if (dominoSceneRef) {
    dominoSceneRef.renderBoard();
    dominoSceneRef.renderHand();
  }
}

// خۆگونجاندن لە کاتی گۆڕینی قەبارەی شاشە یان سووڕاندنی مۆبایل
window.addEventListener('resize', () => {
  const sec = document.getElementById('view-domino');
  if (!sec || sec.classList.contains('hidden') || !dominoPhaserGame) return;
  const w = Math.round(window.innerWidth * DOM_DPR);
  const h = Math.round(window.innerHeight * DOM_DPR);
  dominoPhaserGame.scale.resize(w, h);
  if (dominoSceneRef) {
    dominoSceneRef.bakeKurdishTeahouseTable(w, h);
    dominoSceneRef.bgImage.setTexture('yk_dom_master_table').setPosition(w / 2, h / 2).setDisplaySize(w, h);
    dominoSceneRef.renderBoard();
    dominoSceneRef.renderHand();
  }
});

function startRoyalTeahouseDomino() {
  ensureDominoFullscreenShell();
  teahouseDom.myScore = 0;
  teahouseDom.botScore = 0;

  const pNameEl = document.getElementById('ykDomPlayerName');
  if (pNameEl) {
    pNameEl.textContent = (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزان';
  }
  const myAv = document.getElementById('ykDomMyAvatar');
  if (myAv && typeof playerAvatarData !== 'undefined' && playerAvatarData) {
    myAv.innerHTML = `<img src="${playerAvatarData}" style="width:100%;height:100%;object-fit:cover;" />`;
  }

  initDominoPhaser();
  startTeahouseDominoRound();
}

function startTeahouseDominoRound() {
  let deck = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) deck.push({ a: i, b: j });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[k]] = [deck[k], deck[i]];
  }

  teahouseDom.myHand = deck.slice(0, 7);
  teahouseDom.botHand = deck.slice(7, 14);
  teahouseDom.boneyard = deck.slice(14);
  teahouseDom.chain = [];
  teahouseDom.rootIndex = 0;
  teahouseDom.leftEnd = null;
  teahouseDom.rightEnd = null;
  teahouseDom.roundOver = false;
  teahouseDom.isDealing = true;
  teahouseDom.selectedHandIdx = null;

  let myMaxD = -1, botMaxD = -1;
  teahouseDom.myHand.forEach(t => { if (t.a === t.b && t.a > myMaxD) myMaxD = t.a; });
  teahouseDom.botHand.forEach(t => { if (t.a === t.b && t.a > botMaxD) botMaxD = t.a; });

  if (myMaxD >= botMaxD && myMaxD !== -1) {
    teahouseDom.turn = 'player';
    teahouseDom.firstMoveRule = true;
    teahouseDom.requiredOpeningDouble = myMaxD;
  } else if (botMaxD > myMaxD) {
    teahouseDom.turn = 'bot';
    teahouseDom.firstMoveRule = true;
    teahouseDom.requiredOpeningDouble = botMaxD;
  } else {
    teahouseDom.turn = 'player';
    teahouseDom.firstMoveRule = false;
    teahouseDom.requiredOpeningDouble = null;
  }

  updateDominoHUD();
  showDominoSplash('دۆمینە', `<span>${teahouseDom.targetScore}</span><span>🚩</span>`, 850);

  setTimeout(() => {
    const afterDeal = () => {
      teahouseDom.isDealing = false;
      updateDominoHUD();
      if (dominoSceneRef) {
        dominoSceneRef.renderBoard();
        dominoSceneRef.renderHand();
      }
      if (teahouseDom.turn === 'bot') {
        setTimeout(runTeahouseBotTurn, 700);
      }
    };

    if (dominoSceneRef) {
      dominoSceneRef.playDealingAnimation(afterDeal);
    } else {
      setTimeout(() => {
        if (dominoSceneRef) dominoSceneRef.playDealingAnimation(afterDeal);
        else afterDeal();
      }, 220);
    }
  }, 800);
}

function checkTeahouseTileFit(tile) {
  if (teahouseDom.chain.length === 0) {
    if (teahouseDom.firstMoveRule && teahouseDom.requiredOpeningDouble !== null) {
      const ok = (tile.a === teahouseDom.requiredOpeningDouble && tile.b === teahouseDom.requiredOpeningDouble);
      return { left: ok, right: ok };
    }
    return { left: true, right: true };
  }
  return {
    left: (tile.a === teahouseDom.leftEnd || tile.b === teahouseDom.leftEnd),
    right: (tile.a === teahouseDom.rightEnd || tile.b === teahouseDom.rightEnd)
  };
}

function appendTeahouseChain(tile, side) {
  if (teahouseDom.chain.length === 0) {
    teahouseDom.chain.push({ a: tile.a, b: tile.b });
    teahouseDom.rootIndex = 0;
    teahouseDom.leftEnd = tile.a;
    teahouseDom.rightEnd = tile.b;
    return;
  }
  if (side === 'left') {
    if (tile.b === teahouseDom.leftEnd) {
      teahouseDom.chain.unshift({ a: tile.a, b: tile.b });
      teahouseDom.leftEnd = tile.a;
    } else {
      teahouseDom.chain.unshift({ a: tile.b, b: tile.a });
      teahouseDom.leftEnd = tile.b;
    }
    teahouseDom.rootIndex++;
  } else {
    if (tile.a === teahouseDom.rightEnd) {
      teahouseDom.chain.push({ a: tile.a, b: tile.b });
      teahouseDom.rightEnd = tile.b;
    } else {
      teahouseDom.chain.push({ a: tile.b, b: tile.a });
      teahouseDom.rightEnd = tile.a;
    }
  }
}

function executePlayerTeahouseMove(idx, side) {
  const tile = teahouseDom.myHand.splice(idx, 1)[0];
  if (!tile) return;
  teahouseDom.firstMoveRule = false;
  teahouseDom.selectedHandIdx = null;
  appendTeahouseChain(tile, side);
  playTeahouseWoodClack(1);

  if (dominoSceneRef) {
    dominoSceneRef.renderBoard();
    dominoSceneRef.renderHand();
  }

  if (teahouseDom.myHand.length === 0) {
    endTeahouseRound('player');
    return;
  }

  teahouseDom.turn = 'bot';
  updateDominoHUD();
  setTimeout(runTeahouseBotTurn, 780);
}

function drawTeahouseBoneyard() {
  if (teahouseDom.turn !== 'player' || teahouseDom.roundOver || teahouseDom.isDealing) return;
  const hasAnyMove = teahouseDom.myHand.some(t => {
    const f = checkTeahouseTileFit(t);
    return f.left || f.right;
  });
  if (hasAnyMove) return;

  if (teahouseDom.boneyard.length > 0) {
    teahouseDom.myHand.push(teahouseDom.boneyard.pop());
    playTeahouseWoodClack(1.3);
    updateDominoHUD();
    if (dominoSceneRef) dominoSceneRef.renderHand();
  } else {
    showDominoSplash('پاس', '<span>هیچ پوولێک نەماوە</span>', 900);
    teahouseDom.turn = 'bot';
    updateDominoHUD();
    setTimeout(runTeahouseBotTurn, 900);
  }
}

function runTeahouseBotTurn() {
  if (teahouseDom.roundOver || teahouseDom.turn !== 'bot') return;

  let moveIdx = teahouseDom.botHand.findIndex(t => {
    const f = checkTeahouseTileFit(t);
    return f.left || f.right;
  });

  while (moveIdx === -1 && teahouseDom.boneyard.length > 0) {
    teahouseDom.botHand.push(teahouseDom.boneyard.pop());
    playTeahouseWoodClack(1.35);
    moveIdx = teahouseDom.botHand.findIndex(t => {
      const f = checkTeahouseTileFit(t);
      return f.left || f.right;
    });
  }

  if (moveIdx !== -1) {
    const tile = teahouseDom.botHand.splice(moveIdx, 1)[0];
    teahouseDom.firstMoveRule = false;
    const fit = checkTeahouseTileFit(tile);
    const side = fit.right ? 'right' : 'left';

    const finishBotPlay = () => {
      appendTeahouseChain(tile, side);
      playTeahouseWoodClack(0.95);
      if (dominoSceneRef) {
        dominoSceneRef.renderBoard();
      }
      if (teahouseDom.botHand.length === 0) {
        endTeahouseRound('bot');
        return;
      }
      checkPostBotBlocked();
    };

    if (dominoSceneRef) {
      dominoSceneRef.playBotTileFlight(tile, side, finishBotPlay);
    } else {
      finishBotPlay();
    }
    return;
  }

  checkPostBotBlocked();
}

function checkPostBotBlocked() {
  const pCan = teahouseDom.myHand.some(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });
  const bCan = teahouseDom.botHand.some(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });

  if (!pCan && !bCan && teahouseDom.boneyard.length === 0) {
    endTeahouseRound('blocked');
    return;
  }

  teahouseDom.turn = 'player';
  updateDominoHUD();
  if (dominoSceneRef) dominoSceneRef.renderHand();
}

function endTeahouseRound(reason) {
  teahouseDom.roundOver = true;
  const mySum = teahouseDom.myHand.reduce((s, t) => s + t.a + t.b, 0);
  const botSum = teahouseDom.botHand.reduce((s, t) => s + t.a + t.b, 0);

  let title = '';
  let sub = '';
  if (reason === 'player' || (reason === 'blocked' && mySum < botSum)) {
    teahouseDom.myScore += botSum;
    title = 'دۆمینە! 🏆';
    sub = `<span>+${botSum} خاڵ بۆ تۆ</span>`;
  } else {
    teahouseDom.botScore += mySum;
    title = 'بۆت بردیەوە';
    sub = `<span>+${mySum} خاڵ بۆ بۆت</span>`;
  }

  updateDominoHUD();
  showDominoSplash(title, sub, 2100);

  if (teahouseDom.myScore >= teahouseDom.targetScore || teahouseDom.botScore >= teahouseDom.targetScore) {
    const iWon = teahouseDom.myScore >= teahouseDom.targetScore;
    if (typeof awardGameXp === 'function') awardGameXp(iWon ? 'win' : 'loss');
    setTimeout(() => {
      const msg = iWon
        ? `🏆 پیرۆزە پاڵەوان! گەیشتیتە ${teahouseDom.myScore} خاڵ و یارییەکەت بردەوە!\nدەتەوێت یارییەکی نوێ دەستپێبکەیت؟`
        : `بۆت گەیشتە ${teahouseDom.botScore} خاڵ و یارییەکەی بردەوە.\nدەتەوێت دووبارە یاری بکەیتەوە؟`;
      if (confirm(msg)) startRoyalTeahouseDomino();
    }, 2200);
  } else {
    setTimeout(startTeahouseDominoRound, 2400);
  }
}

function confirmLeaveTeahouseDomino() {
  if (teahouseDom.roundOver || teahouseDom.chain.length === 0) {
    switchView('hub');
    return;
  }
  if (confirm('دڵنیایت دەتەوێت لەم یارییە وازبهێنیت و بگەڕێیتەوە؟')) {
    teahouseDom.roundOver = true;
    switchView('hub');
  }
}

function updateDominoHUD() {
  const myScoreEl = document.getElementById('ykDomMyScore');
  const botScoreEl = document.getElementById('ykDomBotScore');
  const boneNumEl = document.getElementById('ykDomBoneyardNum');
  const miniBox = document.getElementById('ykDomBotMiniTiles');
  const topPill = document.getElementById('ykDomTopPill');
  const topPillText = document.getElementById('ykDomTopPillText');
  const oppStrip = document.getElementById('ykDomOppStrip');
  const playerStrip = document.getElementById('ykDomPlayerStrip');
  const statusSub = document.getElementById('ykDomStatusSub');
  const boneBtn = document.getElementById('ykDomBoneyardBtn');

  if (myScoreEl) myScoreEl.textContent = teahouseDom.myScore;
  if (botScoreEl) botScoreEl.textContent = teahouseDom.botScore;
  if (boneNumEl) boneNumEl.textContent = teahouseDom.boneyard.length;

  if (miniBox) {
    miniBox.innerHTML = Array(teahouseDom.botHand.length)
      .fill('<span style="width:9px;height:15px;border-radius:2.5px;background:linear-gradient(180deg,#ef4444,#991b1b);border:1px solid #fca5a5;display:inline-block;box-shadow:0 2px 4px rgba(0,0,0,0.4);"></span>')
      .join('');
  }

  const pCanMove = teahouseDom.myHand.some(t => {
    const f = checkTeahouseTileFit(t);
    return f.left || f.right;
  });

  if (topPill && topPillText) {
    if (teahouseDom.isDealing) {
      topPill.style.background = 'rgba(16,8,4,0.82)';
      topPill.style.borderColor = 'rgba(250,204,21,0.45)';
      topPillText.textContent = 'دابەشکردنی پوولەکان...';
    } else if (teahouseDom.turn === 'player') {
      topPill.style.background = 'linear-gradient(135deg,#dc2626,#991b1b)';
      topPill.style.borderColor = '#fde047';
      topPillText.textContent = pCanMove ? 'نۆرەی تۆیە' : 'پوول ڕابکێشە 👆';
    } else {
      topPill.style.background = 'rgba(16,8,4,0.82)';
      topPill.style.borderColor = 'rgba(250,204,21,0.35)';
      topPillText.textContent = 'نۆرەی بۆتە...';
    }
  }

  if (oppStrip) {
    oppStrip.style.borderColor = (teahouseDom.turn === 'bot' && !teahouseDom.isDealing)
      ? '#ef4444'
      : 'rgba(250,204,21,0.28)';
  }

  if (playerStrip) {
    playerStrip.style.borderColor = (teahouseDom.turn === 'player' && !teahouseDom.isDealing)
      ? '#fde047'
      : 'rgba(250,204,21,0.3)';
  }

  if (statusSub) {
    if (teahouseDom.chain.length === 0 && teahouseDom.firstMoveRule && teahouseDom.requiredOpeningDouble !== null) {
      statusSub.textContent = `بە جووتی (${teahouseDom.requiredOpeningDouble}-${teahouseDom.requiredOpeningDouble}) دەست پێبکە`;
    } else if (teahouseDom.turn === 'player') {
      statusSub.textContent = pCanMove ? 'پوولێک ڕابکێشە یان کلیکی لێ بکە' : 'هیچ جووڵەیەکت نییە — کلیک لە بازاڕ بکە';
    } else {
      statusSub.textContent = 'چاوەڕێی جووڵەی بۆت...';
    }
  }

  if (boneBtn) {
    const mustDraw = (teahouseDom.turn === 'player' && !pCanMove && !teahouseDom.roundOver && !teahouseDom.isDealing);
    boneBtn.disabled = !mustDraw;
    boneBtn.style.opacity = mustDraw ? '1' : '0.88';
    boneBtn.style.boxShadow = mustDraw
      ? '0 0 22px rgba(250,204,21,0.95), 0 8px 20px rgba(0,0,0,0.6)'
      : '0 8px 20px rgba(0,0,0,0.55)';
    if (mustDraw) boneBtn.classList.add('animate-bounce');
    else boneBtn.classList.remove('animate-bounce');
  }
}

// دڵنیابوونەوە لە گەڕانەوە بۆ دۆخی فول سکرین هەر کاتێک دۆمینە کرایەوە
document.addEventListener('click', (e) => {
  const card = e.target.closest('[onclick*="switchView(\'domino\')"]');
  if (card) {
    setTimeout(() => {
      ensureDominoFullscreenShell();
      if (!dominoPhaserGame) startRoyalTeahouseDomino();
      else {
        const w = Math.round(window.innerWidth * DOM_DPR);
        const h = Math.round(window.innerHeight * DOM_DPR);
        dominoPhaserGame.scale.resize(w, h);
        if (dominoSceneRef) {
          dominoSceneRef.renderBoard();
          dominoSceneRef.renderHand();
        }
      }
    }, 60);
  }
});