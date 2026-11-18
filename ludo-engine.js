// ============================================================================
// YARI KURDI - ROYAL KURDISTAN FLAG & 4K YALLA-STYLE LUDO ENGINE (PHASER 3)
// ============================================================================

const LUDO_DPR = Math.min(Math.max(window.devicePixelRatio || 2, 2.5), 3);

// ڕێڕەوی ستانداردی ٥٢ خانەیی لودۆ (بە ئاڕاستەی میلی کاتژمێر)
// خانەی 0: خاڵی دەستپێکی زەرد (خوارەوەی چەپ: ڕیز 13، ستوون 6)
// خانەی 26: خاڵی دەستپێکی سوور (سەرەوەی ڕاست: ڕیز 1، ستوون 8)
const LUDO_MAIN_PATH = [
  [13,6],[12,6],[11,6],[10,6],[9,6],
  [8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
  [7,0],[6,0],
  [6,1],[6,2],[6,3],[6,4],[6,5],
  [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
  [0,7],[0,8],
  [1,8],[2,8],[3,8],[4,8],[5,8],
  [6,9],[6,10],[6,11],[6,12],[6,13],[6,14],
  [7,14],[8,14],
  [8,13],[8,12],[8,11],[8,10],[8,9],
  [9,8],[10,8],[11,8],[12,8],[13,8],[14,8],
  [14,7],[14,6]
];

// ڕێڕەوی ناوەوەی سەرکەوتن بەرەو خۆری کوردستان (Home Stretch)
const LUDO_HOME_PATHS = {
  yellow: [[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]],
  red:    [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]]
};

// شوێنی وەستانی ٤ داشەکە لەناو قەڵاکانیاندا (Base Sockets)
const LUDO_BASE_SOCKETS = {
  yellow: [[10.6, 1.6], [10.6, 3.4], [12.4, 1.6], [12.4, 3.4]],
  red:    [[1.6, 10.6], [1.6, 12.4], [3.4, 10.6], [3.4, 12.4]],
  pearl:  [[1.6, 1.6],  [1.6, 3.4],  [3.4, 1.6],  [3.4, 3.4]],
  green:  [[10.6, 10.6],[10.6, 12.4],[12.4, 10.6],[12.4, 12.4]]
};

// ٨ خانە ئارامەکان (ئەستێرە و خاڵی دەستپێک کە داشیان تێدا ناخورێت)
const LUDO_SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

const ludoState = {
  mode: 'bot', // 'bot' | 'online'
  roomRef: null,
  queueRef: null,
  myColor: 'yellow',
  turn: 'yellow',
  diceValue: null,
  diceRolled: false,
  isAnimating: false,
  consecutiveSixes: 0,
  // شوێنی داشەکان: -1 = لەناو قەڵایە، 0..50 = لەسەر ڕێڕەوە، 51..55 = ڕێڕەوی ناوەوە، 56 = گەیشتووەتە تاجی خۆر
  tokens: {
    yellow: [-1, -1, -1, -1],
    red:    [-1, -1, -1, -1]
  },
  winner: null
};

let ludoPhaserGame = null;
let ludoSceneRef = null;

function playLudoSfx(type) {
  if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    if (type === 'hop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.065);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.075);
    } else if (type === 'dice') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.08);
      gain.gain.setValueAtTime(0.26, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.09);
    } else if (type === 'capture') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.2);
    } else if (type === 'home') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(660, now + 0.1);
      osc.frequency.setValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.4);
    }
  } catch (e) {}
}

class RoyalKurdistanLudoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoyalKurdistanLudoScene' });
    this.tokenSprites = { yellow: [], red: [] };
    this.pulseRings = [];
  }

  create() {
    ludoSceneRef = this;
    const w = this.scale.width;
    const h = this.scale.height;
    this.cellSize = w / 15;

    // دروستکردنی تەختەی لودۆی شاهانەی ئاڵای کوردستان بە دیقەی 4K
    this.bakeKurdistanLudoBoardTexture(w, h);
    this.add.image(w / 2, h / 2, 'yk_kurdistan_ludo_board').setDisplaySize(w, h);

    this.highlightsLayer = this.add.container(0, 0);
    this.tokensLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);

    this.renderTokens();
  }

  bakeKurdistanLudoBoardTexture(w, h) {
    const key = 'yk_kurdistan_ludo_board';
    if (this.textures.exists(key)) this.textures.remove(key);

    const canvasTex = this.textures.createCanvas(key, w, h);
    const ctx = canvasTex.getContext();
    const cs = w / 15;
    const S = LUDO_DPR;

    // ١. پاشبنەمای عاجی و مەڕمەڕیی خانەکان
    ctx.fillStyle = '#fffdf7';
    ctx.fillRect(0, 0, w, h);

    // ڕەنگە شاهانەکانی ئاڵای کوردستان
    const C_RED = '#d91b2e';       // سووری ئاڵای کوردستان (سەرەوەی ڕاست)
    const C_RED_DARK = '#880e1b';
    const C_YELLOW = '#f59e0b';    // زەردی زێڕینی خۆری کوردستان (خوارەوەی چەپ)
    const C_YELLOW_DARK = '#b45309';
    const C_GREEN = '#15803d';     // سەوزی ئاڵای کوردستان (خوارەوەی ڕاست)
    const C_GREEN_DARK = '#064e3b';
    const C_PEARL = '#e2d9c5';     // سپی مەڕمەڕی/پلاتینی شاهانە (سەرەوەی چەپ)
    const C_PEARL_DARK = '#64748b';

    // ٢. ڕەنگکردنی ڕێڕەوە ناوخۆییەکان (Home Stretches) و خانەکانی دەستپێک
    for (let i = 1; i <= 5; i++) {
      // ڕێڕەوی زەرد (خوارەوە بۆ ناوەڕاست)
      this.fillCell(ctx, 14 - i, 7, cs, '#fef08a');
      // ڕێڕەوی سوور (سەرەوە بۆ ناوەڕاست)
      this.fillCell(ctx, i, 7, cs, '#fecaca');
      // ڕێڕەوی سپی مەڕمەڕی (چەپ بۆ ناوەڕاست)
      this.fillCell(ctx, 7, i, cs, '#f1f5f9');
      // ڕێڕەوی سەوز (ڕاست بۆ ناوەڕاست)
      this.fillCell(ctx, 7, 14 - i, cs, '#bbf7d0');
    }

    // ٤ خانەی دەستپێک بە ڕەنگی تۆخی شاهانە
    this.fillCell(ctx, 13, 6, cs, C_YELLOW);
    this.fillCell(ctx, 1, 8, cs, C_RED);
    this.fillCell(ctx, 6, 1, cs, C_PEARL_DARK);
    this.fillCell(ctx, 8, 13, cs, C_GREEN);

    // ٣. هێڵکاری تۆڕی ١٥×١٥ی خانەکان
    ctx.strokeStyle = 'rgba(120, 53, 15, 0.26)';
    ctx.lineWidth = 1.2 * S;
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        const inBase = (r < 6 && c < 6) || (r < 6 && c > 8) || (r > 8 && c < 6) || (r > 8 && c > 8);
        const inCenter = (r >= 6 && r <= 8 && c >= 6 && c <= 8);
        if (!inBase && !inCenter) {
          ctx.strokeRect(c * cs, r * cs, cs, cs);
        }
      }
    }

    // ٤. کێشانی ٤ قەڵا سەرەکییەکە (6x6 Bases) بە ستایلی ٣ ڕەهەندی وەک ڤیدیۆکە
    this.drawRoyalBaseZone(ctx, 0, 0, cs * 6, C_PEARL, C_PEARL_DARK, LUDO_BASE_SOCKETS.pearl, cs, S, true);
    this.drawRoyalBaseZone(ctx, cs * 9, 0, cs * 6, C_RED, C_RED_DARK, LUDO_BASE_SOCKETS.red, cs, S, false);
    this.drawRoyalBaseZone(ctx, 0, cs * 9, cs * 6, C_YELLOW, C_YELLOW_DARK, LUDO_BASE_SOCKETS.yellow, cs, S, false);
    this.drawRoyalBaseZone(ctx, cs * 9, cs * 9, cs * 6, C_GREEN, C_GREEN_DARK, LUDO_BASE_SOCKETS.green, cs, S, false);

    // ٥. کێشانی ئەستێرەکان و سەهمی چوونەژوورەوە لەسەر تەختەکە
    const starCells = [
      { r: 13, c: 6, col: '#ffffff' },
      { r: 1, c: 8, col: '#ffffff' },
      { r: 6, c: 1, col: '#ffffff' },
      { r: 8, c: 13, col: '#ffffff' },
      { r: 8, c: 2, col: '#94a3b8' },
      { r: 2, c: 6, col: '#94a3b8' },
      { r: 6, c: 12, col: '#94a3b8' },
      { r: 12, c: 8, col: '#94a3b8' }
    ];
    starCells.forEach(st => {
      this.drawStarIcon(ctx, (st.c + 0.5) * cs, (st.r + 0.5) * cs, cs * 0.34, st.col, S);
    });

    // سەهمە بچووکەکانی دەروازەی Home Stretch (ڕێک وەک Yalla Ludo)
    this.drawMiniArrow(ctx, 7.5 * cs, 14.35 * cs, 0, C_YELLOW_DARK, cs);
    this.drawMiniArrow(ctx, 7.5 * cs, 0.65 * cs, Math.PI, C_RED_DARK, cs);
    this.drawMiniArrow(ctx, 0.65 * cs, 7.5 * cs, Math.PI / 2, C_PEARL_DARK, cs);
    this.drawMiniArrow(ctx, 14.35 * cs, 7.5 * cs, -Math.PI / 2, C_GREEN_DARK, cs);

    // ٦. ناوەڕاستی تەختەکە (3x3 Home Center): ٤ سێگۆشە بە ڕەنگەکانی ئاڵا + خۆری ٢١ تیشکی کوردستان
    const cx = w / 2;
    const cy = h / 2;
    const cLeft = 6 * cs;
    const cRight = 9 * cs;
    const cTop = 6 * cs;
    const cBot = 9 * cs;

    const drawHomeTri = (x1, y1, x2, y2, color1, color2) => {
      const g = ctx.createLinearGradient(cx, cy, (x1 + x2) / 2, (y1 + y2) / 2);
      g.addColorStop(0, color1);
      g.addColorStop(1, color2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.6 * S;
      ctx.stroke();
    };

    // سەرەوە (سوور)، خوارەوە (زەرد)، چەپ (سپی مەڕمەڕی)، ڕاست (سەوز)
    drawHomeTri(cLeft, cTop, cRight, cTop, '#ef4444', '#991b1b');
    drawHomeTri(cLeft, cBot, cRight, cBot, '#facc15', '#b45309');
    drawHomeTri(cLeft, cTop, cLeft, cBot, '#f8fafc', '#94a3b8');
    drawHomeTri(cRight, cTop, cRight, cBot, '#22c55e', '#15803d');

    // خۆری ٢١ تیشکی زێڕینی کوردستان لە چەقی چوارگۆشەی ناوەڕاستدا
    const sunOuter = cs * 0.72;
    const sunInner = cs * 0.38;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 8 * S;
    const sunG = ctx.createRadialGradient(cx, cy, 2, cx, cy, sunOuter);
    sunG.addColorStop(0, '#ffffff');
    sunG.addColorStop(0.45, '#fef08a');
    sunG.addColorStop(1, '#d97706');
    ctx.fillStyle = sunG;
    ctx.beginPath();
    const rays = 21;
    for (let i = 0; i < rays * 2; i++) {
      const r = i % 2 === 0 ? sunOuter : sunInner;
      const a = (i * Math.PI) / rays - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2.4 * S;
    ctx.strokeRect(cLeft, cTop, cs * 3, cs * 3);

    canvasTex.refresh();
  }

  fillCell(ctx, r, c, cs, color) {
    ctx.fillStyle = color;
    ctx.fillRect(c * cs, r * cs, cs, cs);
  }

  drawRoyalBaseZone(ctx, x, y, size, mainCol, darkCol, sockets, cs, S, isPearl) {
    const g = ctx.createLinearGradient(x, y, x + size, y + size);
    g.addColorStop(0, mainCol);
    g.addColorStop(1, darkCol);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.45)';
    ctx.lineWidth = 2 * S;
    ctx.strokeRect(x, y, size, size);

    // بازنەی گەورەی ناو قەڵاکان (ڕێک وەک دیزاینەکەی Yalla Ludo لە ڤیدیۆکەتدا)
    const cx = x + size / 2;
    const cy = y + size / 2;
    const ringR = size * 0.39;

    ctx.save();
    ctx.fillStyle = isPearl ? 'rgba(255, 255, 255, 0.72)' : 'rgba(0, 0, 0, 0.16)';
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isPearl ? '#d97706' : 'rgba(254, 240, 138, 0.55)';
    ctx.lineWidth = 2.2 * S;
    ctx.stroke();

    // ٤ چاڵی بازنەیی بۆ وەستانی داشەکان (Sockets)
    const sockR = cs * 0.46;
    sockets.forEach(([sr, sc]) => {
      const sx = (sc + 0.5) * cs;
      const sy = (sr + 0.5) * cs;

      const sg = ctx.createRadialGradient(sx - sockR * 0.2, sy - sockR * 0.2, 2, sx, sy, sockR);
      sg.addColorStop(0, isPearl ? '#cbd5e1' : 'rgba(0, 0, 0, 0.28)');
      sg.addColorStop(1, isPearl ? '#94a3b8' : 'rgba(0, 0, 0, 0.48)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, sockR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isPearl ? '#f59e0b' : 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.6 * S;
      ctx.stroke();
    });
    ctx.restore();
  }

  drawStarIcon(ctx, cx, cy, outerR, color, S) {
    const innerR = outerR * 0.46;
    ctx.save();
    ctx.fillStyle = color;
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 1 * S;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / 5 - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawMiniArrow(ctx, cx, cy, angle, color, cs) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, -cs * 0.22);
    ctx.lineTo(cs * 0.18, cs * 0.14);
    ctx.lineTo(-cs * 0.18, cs * 0.14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // گۆڕینی پلەی هەنگاو (step) بۆ شوێنی وردی (x, y) لەسەر تەختەکە
  getStepPixelCoord(color, step, tokenIndex) {
    const cs = this.cellSize;
    if (step === -1) {
      const [sr, sc] = LUDO_BASE_SOCKETS[color][tokenIndex];
      return { x: (sc + 0.5) * cs, y: (sr + 0.5) * cs, key: `base_${color}_${tokenIndex}` };
    }
    if (step >= 56) {
      const homeOffsets = [[-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22]];
      const [ox, oy] = homeOffsets[tokenIndex];
      const baseR = color === 'yellow' ? 8.15 : 6.85;
      const baseC = 7.5;
      return { x: (baseC + ox) * cs, y: (baseR + oy) * cs, key: `home_${color}_${tokenIndex}` };
    }
    if (step >= 51) {
      const hIdx = step - 51;
      const [hr, hc] = LUDO_HOME_PATHS[color][hIdx];
      return { x: (hc + 0.5) * cs, y: (hr + 0.5) * cs, key: `h_${color}_${hIdx}` };
    }
    const offset = color === 'yellow' ? 0 : 26;
    const globalIdx = (step + offset) % 52;
    const [r, c] = LUDO_MAIN_PATH[globalIdx];
    return { x: (c + 0.5) * cs, y: (r + 0.5) * cs, key: `m_${globalIdx}` };
  }

  // دروستکردنی پوولی ٣ ڕەهەندی بە نیشانەی تاجەوە (ڕێک وەک ڤیدیۆکەی Yalla Ludo)
  createRoyalCrownToken(color, scale = 1, isMovable = false) {
    const S = LUDO_DPR * scale;
    const r = this.cellSize * 0.39 * scale;
    const container = this.add.container(0, 0);
    const gfx = this.add.graphics();

    // بازنەی درەوشاوە بۆ داشێک کە ئێستا دەتوانرێت بجووڵێنرێت
    if (isMovable) {
      const ring = this.add.graphics();
      ring.lineStyle(2.8 * S, 0xffffff, 0.95);
      ring.strokeCircle(0, 0, r * 1.25);
      ring.lineStyle(1.6 * S, 0xfacc15, 0.9);
      ring.strokeCircle(0, 0, r * 1.42);
      container.add(ring);
      this.tweens.add({
        targets: ring,
        scale: { from: 0.92, to: 1.18 },
        alpha: { from: 0.95, to: 0.25 },
        duration: 620,
        yoyo: true,
        repeat: -1
      });
    }

    // سێبەری ژێر داشەکە
    gfx.fillStyle(0x000000, 0.45);
    gfx.fillCircle(1.5 * S, 3 * S, r);

    // لێواری دەرەوەی زێڕین/سپی
    gfx.fillStyle(color === 'yellow' ? 0xfef08a : 0xfecaca, 1);
    gfx.fillCircle(0, 0, r);

    // ناوەوەی گەوهەریی داشەکە
    const mainHex = color === 'yellow' ? 0xd97706 : 0xdc2626;
    const lightHex = color === 'yellow' ? 0xfacc15 : 0xef4444;
    gfx.fillStyle(mainHex, 1);
    gfx.fillCircle(0, 0, r * 0.84);

    gfx.fillStyle(lightHex, 1);
    gfx.fillCircle(-r * 0.14, -r * 0.14, r * 0.56);

    // بریقەی شووشەیی سەرەوە
    gfx.fillStyle(0xffffff, 0.45);
    gfx.fillEllipse(-r * 0.22, -r * 0.32, r * 0.52, r * 0.26);

    container.add(gfx);

    // هێمای تاجی شاهانە لە ناوەڕاستی داشەکەدا (وەک دیزاینی پەڕەکانی ناو ڤیدیۆکە)
    const crownTxt = this.add.text(0, 0, '👑', {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(r * 0.95)}px`
    }).setOrigin(0.5);
    container.add(crownTxt);

    container.setSize(r * 2.2, r * 2.2);
    return container;
  }

  spawnGoldBurst(x, y) {
    const S = LUDO_DPR;
    for (let i = 0; i < 14; i++) {
      const p = this.add.circle(x, y, Phaser.Math.FloatBetween(2, 4) * S, i % 2 === 0 ? 0xfacc15 : 0xffffff, 1);
      this.fxLayer.add(p);
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(18, 52) * S;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 500,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  renderTokens() {
    this.tokensLayer.removeAll(true);
    this.tokenSprites = { yellow: [], red: [] };

    const isMyTurnToMove = (
      !ludoState.isAnimating &&
      ludoState.diceRolled &&
      ludoState.turn === ludoState.myColor
    );
    const validMoves = isMyTurnToMove ? getValidLudoTokenIndices(ludoState.myColor, ludoState.diceValue) : [];

    // کۆکردنەوەی هەموو داشەکان بۆ ڕێکخستنی جوان کاتێک چەند داشێک لە یەک خانەدان
    const cellGroups = {};
    ['yellow', 'red'].forEach(col => {
      ludoState.tokens[col].forEach((step, idx) => {
        const pos = this.getStepPixelCoord(col, step, idx);
        if (!cellGroups[pos.key]) cellGroups[pos.key] = [];
        cellGroups[pos.key].push({ col, idx, step, x: pos.x, y: pos.y });
      });
    });

    const stackOffsets = {
      1: [[0, 0]],
      2: [[-0.18, -0.12], [0.18, 0.12]],
      3: [[-0.2, -0.15], [0.2, -0.15], [0, 0.2]],
      4: [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]
    };

    Object.values(cellGroups).forEach(group => {
      const count = group.length;
      const scale = count > 1 ? 0.82 : 1;
      const offs = stackOffsets[Math.min(count, 4)];

      group.forEach((item, gIdx) => {
        const isMovable = (item.col === ludoState.myColor && validMoves.includes(item.idx));
        const sprite = this.createRoyalCrownToken(item.col, scale, isMovable);
        const [ox, oy] = offs[gIdx % 4];
        sprite.setPosition(item.x + ox * this.cellSize, item.y + oy * this.cellSize);

        if (isMovable) {
          sprite.setDepth(50 + gIdx);
          sprite.setInteractive({ useHandCursor: true });
          sprite.on('pointerup', () => executeLudoTokenMove(item.col, item.idx));
        } else {
          sprite.setDepth(10 + gIdx);
        }

        this.tokensLayer.add(sprite);
        this.tokenSprites[item.col][item.idx] = sprite;
      });
    });
  }

  // جووڵاندنی هەنگاو بە هەنگاوی داشەکان بە بازی نەرمەوە (Step-by-Step Hopping Animation)
  animateTokenHopPath(color, tokenIdx, fromStep, toStep, onDone) {
    const sprite = this.tokenSprites[color] && this.tokenSprites[color][tokenIdx];
    if (!sprite) {
      if (onDone) onDone();
      return;
    }
    sprite.setDepth(200);

    const waypoints = [];
    if (fromStep === -1 && toStep === 0) {
      waypoints.push(this.getStepPixelCoord(color, 0, tokenIdx));
    } else {
      for (let s = fromStep + 1; s <= toStep; s++) {
        waypoints.push(this.getStepPixelCoord(color, s, tokenIdx));
      }
    }

    const hopNext = (wIdx) => {
      if (wIdx >= waypoints.length) {
        if (onDone) onDone();
        return;
      }
      const pt = waypoints[wIdx];
      playLudoSfx('hop');

      this.tweens.add({
        targets: sprite,
        x: pt.x,
        y: pt.y,
        duration: 155,
        ease: 'Sine.easeInOut'
      });

      this.tweens.add({
        targets: sprite,
        scale: 1.28,
        duration: 77,
        yoyo: true,
        ease: 'Quad.easeOut',
        onComplete: () => hopNext(wIdx + 1)
      });
    };

    hopNext(0);
  }
}

// ڕازاندنەوەی زارەکە بە خاڵی ٣ ڕەهەندی و سەهمی سەوزی نۆرە (وەک ڤیدیۆکەت)
function get3DDicePipHTML(val, isTurnArrow = false) {
  const pipPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };
  const active = pipPositions[val] || [];
  let gridHTML = '<div style="display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);width:36px;height:36px;padding:3px;gap:2px;">';
  for (let i = 0; i < 9; i++) {
    if (active.includes(i)) {
      const col = val === 1 ? '#dc2626' : '#0f172a';
      const sz = val === 1 ? '10px' : '7.5px';
      gridHTML += `<span style="width:${sz};height:${sz};border-radius:999px;background:${col};margin:auto;box-shadow:inset 0 1px 1px rgba(255,255,255,0.4);"></span>`;
    } else {
      gridHTML += '<span></span>';
    }
  }
  gridHTML += '</div>';

  const arrowHTML = isTurnArrow
    ? `<span style="position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:18px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.8));" class="animate-bounce">⬇️</span>`
    : '';

  return `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;">${arrowHTML}${gridHTML}</div>`;
}

function initLudoPhaser() {
  const boardEl = document.getElementById('ludoBoard');
  if (!boardEl) return;

  if (!ludoPhaserGame) {
    boardEl.innerHTML = '';
    const cssSize = Math.min(boardEl.clientWidth || 380, 440);

    ludoPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: Math.round(cssSize * LUDO_DPR),
      height: Math.round(cssSize * LUDO_DPR),
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Math.round(cssSize * LUDO_DPR),
        height: Math.round(cssSize * LUDO_DPR)
      },
      antialias: true,
      parent: 'ludoBoard',
      transparent: true,
      scene: [RoyalKurdistanLudoScene]
    });
  } else if (ludoSceneRef) {
    ludoSceneRef.renderTokens();
  }
}

function initLudoGame() {
  if (ludoState.roomRef) { ludoState.roomRef.off(); ludoState.roomRef = null; }
  ludoState.mode = 'bot';
  ludoState.myColor = 'yellow';
  ludoState.turn = 'yellow';
  ludoState.diceValue = null;
  ludoState.diceRolled = false;
  ludoState.isAnimating = false;
  ludoState.consecutiveSixes = 0;
  ludoState.tokens = {
    yellow: [-1, -1, -1, -1],
    red:    [-1, -1, -1, -1]
  };
  ludoState.winner = null;

  const onlineBar = document.getElementById('ludoOnlineBar');
  if (onlineBar) onlineBar.classList.add('hidden');

  const myNameEl = document.getElementById('ludoMyName');
  if (myNameEl) myNameEl.textContent = (typeof playerName !== 'undefined' && playerName) ? playerName : 'تۆ (خۆری کوردستان)';

  const oppNameEl = document.getElementById('ludoOppName');
  if (oppNameEl) oppNameEl.textContent = 'بۆتی YariKurdi';

  updateLudoHUD('کلیک لە زارەکە بکە 🎲');
  setTimeout(initLudoPhaser, 30);
}

function getValidLudoTokenIndices(color, diceVal) {
  if (!diceVal) return [];
  const valid = [];
  ludoState.tokens[color].forEach((step, idx) => {
    if (step === -1) {
      if (diceVal === 6) valid.push(idx);
    } else if (step + diceVal <= 56) {
      valid.push(idx);
    }
  });
  return valid;
}

function rollLudoDice() {
  if (ludoState.isAnimating || ludoState.diceRolled || ludoState.winner) return;
  if (ludoState.turn !== ludoState.myColor) return;

  performDiceRollAnimation(ludoState.myColor);
}

function performDiceRollAnimation(color) {
  ludoState.isAnimating = true;
  playLudoSfx('dice');

  const isMyColor = (color === ludoState.myColor);
  const diceBox = document.getElementById(isMyColor ? 'ludoDiceBox' : 'ludoOppDiceBox');
  if (diceBox) {
    diceBox.classList.add('dice-rolling');
    setTimeout(() => diceBox.classList.remove('dice-rolling'), 360);
  }

  setTimeout(() => {
    // ئەگەر هەموو داشەکان لەناو قەڵادا بن، چانسی هاتنی ٦ کەمێک باشتر بێت تا یارییەکە خێرا و خۆش بێت
    const allInBase = ludoState.tokens[color].every(s => s === -1);
    let val = Math.floor(Math.random() * 6) + 1;
    if (allInBase && val !== 6 && Math.random() < 0.25) val = 6;

    ludoState.diceValue = val;
    ludoState.diceRolled = true;
    ludoState.isAnimating = false;

    if (val === 6) {
      ludoState.consecutiveSixes++;
      if (ludoState.consecutiveSixes >= 3) {
        updateLudoHUD('٣ شەشی لەسەریەک! نۆرە دەگۆڕێت');
        setTimeout(passLudoTurn, 900);
        return;
      }
    } else {
      ludoState.consecutiveSixes = 0;
    }

    const validMoves = getValidLudoTokenIndices(color, val);
    updateLudoHUD(
      validMoves.length > 0
        ? (color === ludoState.myColor ? `ژمارە ${val} هات — داشێک هەڵبژێرە` : `بۆت ژمارە ${val}ی هێنا`)
        : `ژمارە ${val} هات (جووڵە نییە)`
    );

    if (ludoSceneRef) ludoSceneRef.renderTokens();

    if (validMoves.length === 0) {
      setTimeout(passLudoTurn, 950);
    } else if (color === ludoState.myColor && validMoves.length === 1) {
      // ئەگەر تەنها ١ داش بجووڵێت، خۆکارانە بیجووڵێنە بۆ خێرایی یارییەکە (وەک Yalla Ludo)
      setTimeout(() => executeLudoTokenMove(color, validMoves[0]), 320);
    } else if (color !== ludoState.myColor && ludoState.mode === 'bot') {
      setTimeout(() => chooseAndMoveBotLudoToken(color, validMoves), 650);
    }
  }, 360);
}

function chooseAndMoveBotLudoToken(color, validMoves) {
  const diceVal = ludoState.diceValue;
  const oppColor = color === 'yellow' ? 'red' : 'yellow';
  let bestIdx = validMoves[0];
  let bestScore = -999;

  validMoves.forEach(idx => {
    const curStep = ludoState.tokens[color][idx];
    const nextStep = curStep === -1 ? 0 : curStep + diceVal;
    let score = nextStep;

    // ١. ئەگەر دەچێتە ناو تاجی خۆر (Home)
    if (nextStep === 56) score += 120;
    // ٢. ئەگەر داشێک لە قەڵا دەردەهێنێت
    if (curStep === -1 && diceVal === 6) score += 75;
    // ٣. ئەگەر داشی بەرامبەر دەخوات
    if (nextStep <= 50) {
      const myGlobal = (nextStep + (color === 'yellow' ? 0 : 26)) % 52;
      if (!LUDO_SAFE_INDICES.includes(myGlobal)) {
        const oppOffset = oppColor === 'yellow' ? 0 : 26;
        const canCapture = ludoState.tokens[oppColor].some(os => {
          if (os < 0 || os > 50) return false;
          return ((os + oppOffset) % 52) === myGlobal;
        });
        if (canCapture) score += 150;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });

  executeLudoTokenMove(color, bestIdx);
}

function executeLudoTokenMove(color, tokenIdx) {
  if (ludoState.isAnimating || !ludoState.diceRolled) return;
  const diceVal = ludoState.diceValue;
  const validMoves = getValidLudoTokenIndices(color, diceVal);
  if (!validMoves.includes(tokenIdx)) return;

  ludoState.isAnimating = true;
  const fromStep = ludoState.tokens[color][tokenIdx];
  const toStep = fromStep === -1 ? 0 : fromStep + diceVal;

  const finishMoveLogic = () => {
    ludoState.tokens[color][tokenIdx] = toStep;
    let earnedBonusTurn = (diceVal === 6);

    // پشکنینی گەیشتن بە خۆری ناوەڕاست (Home = 56)
    if (toStep === 56) {
      playLudoSfx('home');
      earnedBonusTurn = true;
      if (ludoSceneRef) {
        const pt = ludoSceneRef.getStepPixelCoord(color, 56, tokenIdx);
        ludoSceneRef.spawnGoldBurst(pt.x, pt.y);
      }
    }

    // پشکنینی خواردنی داشی بەرامبەر (Capture)
    if (toStep >= 0 && toStep <= 50) {
      const myOffset = color === 'yellow' ? 0 : 26;
      const myGlobal = (toStep + myOffset) % 52;

      if (!LUDO_SAFE_INDICES.includes(myGlobal)) {
        const oppColor = color === 'yellow' ? 'red' : 'yellow';
        const oppOffset = oppColor === 'yellow' ? 0 : 26;
        const oppIndicesHere = [];

        ludoState.tokens[oppColor].forEach((os, oIdx) => {
          if (os >= 0 && os <= 50 && ((os + oppOffset) % 52) === myGlobal) {
            oppIndicesHere.push(oIdx);
          }
        });

        // ئەگەر ١ داشی بەرامبەری لێ بوو، بیخۆ و بیگەڕێنەوە بۆ قەڵاکەی
        if (oppIndicesHere.length === 1) {
          const capturedIdx = oppIndicesHere[0];
          ludoState.tokens[oppColor][capturedIdx] = -1;
          earnedBonusTurn = true;
          playLudoSfx('capture');
          if (ludoSceneRef) {
            const pt = ludoSceneRef.getStepPixelCoord(color, toStep, tokenIdx);
            ludoSceneRef.spawnGoldBurst(pt.x, pt.y);
          }
        }
      }
    }

    ludoState.isAnimating = false;
    if (ludoSceneRef) ludoSceneRef.renderTokens();

    // پشکنینی سەرکەوتنی کۆتایی (٤ تاج)
    const homeCount = ludoState.tokens[color].filter(s => s === 56).length;
    if (homeCount === 4) {
      ludoState.winner = color;
      const iWon = (color === ludoState.myColor);
      if (typeof awardGameXp === 'function') awardGameXp(iWon ? 'win' : 'loss');
      updateLudoHUD(iWon ? '🏆 پیرۆزە! یارییەکەت بردەوە!' : 'بەرامبەر یارییەکەی بردەوە!');
      syncLudoRoomIfNeeded();
      setTimeout(() => {
        alert(iWon ? '🏆 پیرۆزە پاڵەوان! هەر ٤ داشەکەت گەیاندە خۆری کوردستان!' : 'بەرامبەر یارییەکەی بردەوە!');
      }, 400);
      return;
    }

    if (earnedBonusTurn) {
      ludoState.diceRolled = false;
      ludoState.diceValue = null;
      updateLudoHUD(color === ludoState.myColor ? '🎁 نۆرەی زیادە! دووبارە زار هەڵبدە' : 'بۆت دووبارە زار هەڵدەدات...');
      syncLudoRoomIfNeeded();
      if (ludoSceneRef) ludoSceneRef.renderTokens();
      if (color !== ludoState.myColor && ludoState.mode === 'bot') {
        setTimeout(() => performDiceRollAnimation(color), 850);
      }
    } else {
      passLudoTurn();
    }
  };

  if (ludoSceneRef) {
    ludoSceneRef.animateTokenHopPath(color, tokenIdx, fromStep, toStep, finishMoveLogic);
  } else {
    finishMoveLogic();
  }
}

function passLudoTurn() {
  ludoState.turn = ludoState.turn === 'yellow' ? 'red' : 'yellow';
  ludoState.diceValue = null;
  ludoState.diceRolled = false;
  ludoState.consecutiveSixes = 0;

  updateLudoHUD(
    ludoState.turn === ludoState.myColor
      ? 'نۆرەی تۆیە — کلیک لە زارەکە بکە 🎲'
      : 'نۆرەی بەرامبەرە...'
  );
  if (ludoSceneRef) ludoSceneRef.renderTokens();
  syncLudoRoomIfNeeded();

  if (ludoState.mode === 'bot' && ludoState.turn !== ludoState.myColor && !ludoState.winner) {
    setTimeout(() => performDiceRollAnimation(ludoState.turn), 800);
  }
}

function updateLudoHUD(statusMsg) {
  const turnBadge = document.getElementById('ludoTurnBadge');
  if (turnBadge) {
    turnBadge.textContent = ludoState.turn === ludoState.myColor
      ? 'نۆرەی تۆیە (زەردی خۆری)'
      : 'نۆرەی بەرامبەرە (سووری ئاڵا)';
  }

  const stText = document.getElementById('ludoStatusText');
  if (stText && statusMsg) stText.textContent = statusMsg;

  const yHome = ludoState.tokens.yellow.filter(s => s === 56).length;
  const rHome = ludoState.tokens.red.filter(s => s === 56).length;
  const yHomeEl = document.getElementById('ludoYellowHome');
  const rHomeEl = document.getElementById('ludoRedHome');
  if (yHomeEl) yHomeEl.textContent = `تاج: ${yHome}/4 👑`;
  if (rHomeEl) rHomeEl.textContent = `تاج: ${rHome}/4 👑`;

  const myDiceBox = document.getElementById('ludoDiceBox');
  const oppDiceBox = document.getElementById('ludoOppDiceBox');
  const isMyTurn = (ludoState.turn === ludoState.myColor);

  if (myDiceBox) {
    if (isMyTurn && ludoState.diceValue) {
      myDiceBox.innerHTML = get3DDicePipHTML(ludoState.diceValue, false);
    } else {
      myDiceBox.innerHTML = get3DDicePipHTML(6, isMyTurn && !ludoState.diceRolled);
    }
    myDiceBox.style.opacity = isMyTurn ? '1' : '0.55';
  }

  if (oppDiceBox) {
    if (!isMyTurn && ludoState.diceValue) {
      oppDiceBox.innerHTML = get3DDicePipHTML(ludoState.diceValue, false);
    } else {
      oppDiceBox.innerHTML = '🎲';
    }
    oppDiceBox.style.opacity = !isMyTurn ? '1' : '0.6';
  }
}

function sendLudoQuickReaction(txt) {
  updateLudoHUD(txt);
  playLudoSfx('hop');
}

// ==================== ONLINE & PRIVATE ROOMS (FIREBASE) ====================
function syncLudoRoomIfNeeded() {
  if (ludoState.mode === 'online' && ludoState.roomRef) {
    ludoState.roomRef.child('state').set({
      turn: ludoState.turn,
      diceValue: ludoState.diceValue,
      diceRolled: ludoState.diceRolled,
      tokens: ludoState.tokens,
      winner: ludoState.winner || null
    });
  }
}

function createPrivateLudoRoom() {
  if (typeof db === 'undefined') return;
  const code = Math.random().toString(36).substring(2, 7).toUpperCase();
  const onlineBar = document.getElementById('ludoOnlineBar');
  const codeText = document.getElementById('ludoRoomCodeText');
  if (onlineBar) onlineBar.classList.remove('hidden');
  if (codeText) codeText.textContent = `کۆدی ژوور: ${code}`;

  initLudoGame();
  ludoState.mode = 'online';
  ludoState.myColor = 'yellow';
  ludoState.roomRef = db.ref('ludoRooms/' + code);
  ludoState.roomRef.set({
    host: (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزانی ١',
    guest: null,
    state: {
      turn: 'yellow',
      diceValue: null,
      diceRolled: false,
      tokens: ludoState.tokens,
      winner: null
    }
  });

  attachOnlineLudoListener(code);
  updateLudoHUD(`کۆدی ژوورەکەت (${code}) بنێرە بۆ هاوڕێکەت`);
}

function joinPrivateLudoRoom() {
  if (typeof db === 'undefined') return;
  const inp = document.getElementById('ludoJoinCodeInput');
  const code = (inp ? inp.value : '').trim().toUpperCase();
  if (code.length < 4) { alert('تکایە کۆدی ژوورەکە بە دروستی بنووسە'); return; }

  const ref = db.ref('ludoRooms/' + code);
  ref.once('value', snap => {
    if (!snap.exists()) { alert('ئەم ژوورە نەدۆزرایەوە!'); return; }
    initLudoGame();
    ludoState.mode = 'online';
    ludoState.myColor = 'red';
    ludoState.roomRef = ref;
    const gName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزانی ٢';
    ref.update({ guest: gName });
    attachOnlineLudoListener(code);
  });
}

function findOnlineLudoMatch() {
  const onlineBar = document.getElementById('ludoOnlineBar');
  if (onlineBar) onlineBar.classList.remove('hidden');
  createPrivateLudoRoom();
}

function attachOnlineLudoListener(code) {
  if (!ludoState.roomRef) return;
  ludoState.roomRef.on('value', snap => {
    const data = snap.val();
    if (!data || !data.state) return;

    const oppNameEl = document.getElementById('ludoOppName');
    if (oppNameEl) {
      oppNameEl.textContent = ludoState.myColor === 'yellow'
        ? (data.guest || 'چاوەڕوانی هاوڕێ...')
        : (data.host || 'بەرامبەر');
    }

    ludoState.turn = data.state.turn || 'yellow';
    ludoState.diceValue = data.state.diceValue || null;
    ludoState.diceRolled = !!data.state.diceRolled;
    if (data.state.tokens) ludoState.tokens = data.state.tokens;
    ludoState.winner = data.state.winner || null;

    updateLudoHUD(
      ludoState.turn === ludoState.myColor ? 'نۆرەی تۆیە 🎲' : 'نۆرەی بەرامبەرە...'
    );
    if (ludoSceneRef) ludoSceneRef.renderTokens();
  });
}

function leaveLudoRoom() {
  if (ludoState.roomRef) { ludoState.roomRef.off(); ludoState.roomRef = null; }
  if (typeof switchView === 'function') switchView('hub');
}

// خۆکارانە لودۆ ئامادە دەکات هەر کاتێک چوویتە ناو بەشی لودۆ
document.addEventListener('click', (e) => {
  const card = e.target.closest('[onclick*="switchView(\'ludo\')"]');
  if (card) setTimeout(initLudoGame, 80);
});