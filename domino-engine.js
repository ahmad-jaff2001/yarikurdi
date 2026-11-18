// ============================================================================
// YARI KURDI - 4K SILK KURDISTAN FLAG CLASSIC DOMINO 101 ENGINE (PHASER 3)
// ============================================================================

const teahouseDom = {
  boneyard: [],
  myHand: [],
  botHand: [],
  chain: [],
  leftEnd: null,
  rightEnd: null,
  turn: 'player',
  myScore: 0,
  botScore: 0,
  roundOver: false,
  firstMoveRule: true,
  requiredOpeningDouble: null,
  activeDragIdx: null,
  roundBannerText: ''
};

let dominoPhaserGame = null;
let dominoSceneRef = null;
const DOM_DPR = Math.min(Math.max(window.devicePixelRatio || 2, 2.5), 3);

function playTeahouseWoodClack() {
  if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(175, now + 0.06);
    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {}
}

class RoyalDominoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoyalDominoScene' });
    this.leftSlotZone = null;
    this.rightSlotZone = null;
    this.centerSlotZone = null;
    this.dragGhost = null;
  }

  create() {
    dominoSceneRef = this;
    const w = this.scale.width;
    const h = this.scale.height;

    // دروستکردنی پاشبنەمای ئاڵای کوردستانی ئاوریشمی بە دیقەی 4K
    this.bakeKurdistanFlagBg(w, h);
    this.add.image(w / 2, h / 2, 'yk_domino_kurdflag_bg').setDisplaySize(w, h);

    this.ambientLayer = this.add.container(0, 0);
    this.boardLayer = this.add.container(0, 0);
    this.slotsLayer = this.add.container(0, 0);
    this.handLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);
    this.overlayLayer = this.add.container(0, 0);

    this.initGoldenSparkles(w, h);
    this.renderAll();
  }

  bakeKurdistanFlagBg(w, h) {
    const key = 'yk_domino_kurdflag_bg';
    if (this.textures.exists(key)) this.textures.remove(key);

    const canvasTex = this.textures.createCanvas(key, w, h);
    const ctx = canvasTex.getContext();
    const S = DOM_DPR;
    const tableH = h - 118 * S;
    const pad = 6 * S;
    const innerW = w - pad * 2;
    const innerH = tableH - pad * 1.5;

    // چوارچێوەی دەرەوەی تاریکی زێڕین
    ctx.fillStyle = '#140a05';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    this.roundRectPath(ctx, pad, pad, innerW, innerH, 20 * S);
    ctx.clip();

    // ١. سێ شریتە شاهانەکەی ئاڵای کوردستان بە تۆنی ئاوریشمی و قووڵ
    const bandH = innerH / 3;

    // شریتی سووری یاقووتی (سەرەوە)
    const redGrad = ctx.createLinearGradient(0, pad, w, pad + bandH);
    redGrad.addColorStop(0, '#b91c1c');
    redGrad.addColorStop(0.5, '#dc2626');
    redGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = redGrad;
    ctx.fillRect(pad, pad, innerW, bandH + 1);

    // شریتی سپیی مرواریی نەرم (ناوەڕاست — تۆزێک گەرمە تا پوولە سپییەکان بە زەقی دیار بن)
    const whiteGrad = ctx.createLinearGradient(0, pad + bandH, w, pad + bandH * 2);
    whiteGrad.addColorStop(0, '#e7e2d5');
    whiteGrad.addColorStop(0.5, '#f5f2e9');
    whiteGrad.addColorStop(1, '#dfd8c8');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(pad, pad + bandH, innerW, bandH + 1);

    // شریتی سەوزی زمڕوتی (خوارەوە)
    const greenGrad = ctx.createLinearGradient(0, pad + bandH * 2, w, pad + innerH);
    greenGrad.addColorStop(0, '#166534');
    greenGrad.addColorStop(0.5, '#15803d');
    greenGrad.addColorStop(1, '#14532d');
    ctx.fillStyle = greenGrad;
    ctx.fillRect(pad, pad + bandH * 2, innerW, bandH + 2);

    // ٢. شەپۆلی نەرمی قوماشی ئاوریشم (Silk Fabric Sheen) لەسەر هەموو ئاڵاکە
    const silkGrad = ctx.createLinearGradient(0, 0, w, tableH);
    silkGrad.addColorStop(0, 'rgba(255,255,255,0.14)');
    silkGrad.addColorStop(0.22, 'rgba(0,0,0,0.08)');
    silkGrad.addColorStop(0.48, 'rgba(255,255,255,0.16)');
    silkGrad.addColorStop(0.75, 'rgba(0,0,0,0.12)');
    silkGrad.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.fillStyle = silkGrad;
    ctx.fillRect(pad, pad, innerW, innerH);

    // ٣. خۆری ٢١ تیشکی زێڕینی کوردستان لە ناوەڕاستدا بە درەوشانەوەی شاهانە
    const cx = w / 2;
    const cy = pad + innerH / 2;
    const outerSunR = Math.min(w, innerH) * 0.25;
    const innerSunR = outerSunR * 0.52;

    // هالەی زێڕینی پشت خۆرەکە
    const halo = ctx.createRadialGradient(cx, cy, innerSunR * 0.4, cx, cy, outerSunR * 1.45);
    halo.addColorStop(0, 'rgba(250, 204, 21, 0.52)');
    halo.addColorStop(0.6, 'rgba(245, 158, 11, 0.16)');
    halo.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, outerSunR * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // کێشانی ٢١ تیشکەکەی خۆری کوردستان
    ctx.save();
    ctx.shadowColor = 'rgba(180, 83, 9, 0.45)';
    ctx.shadowBlur = 10 * S;
    const sunGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, outerSunR);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.55, '#facc15');
    sunGrad.addColorStop(1, '#d97706');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    const rays = 21;
    for (let i = 0; i < rays * 2; i++) {
      const r = i % 2 === 0 ? outerSunR : innerSunR;
      const a = (i * Math.PI) / rays - Math.PI / 2;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // ٤. سێبەری لێوارەکان (Soft Vignette) بۆ قووڵایی سینەمایی
    const vig = ctx.createRadialGradient(cx, cy, innerW * 0.25, cx, cy, Math.max(w, innerH) * 0.72);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.38)');
    ctx.fillStyle = vig;
    ctx.fillRect(pad, pad, innerW, innerH);

    ctx.restore();

    // چوارچێوەی زێڕینی بریقەدار لە دەوری مێزەکە
    const borderGrad = ctx.createLinearGradient(0, 0, w, tableH);
    borderGrad.addColorStop(0, '#fef08a');
    borderGrad.addColorStop(0.5, '#d97706');
    borderGrad.addColorStop(1, '#fde047');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 2.8 * S;
    this.roundRectPath(ctx, pad, pad, innerW, innerH, 20 * S);
    ctx.stroke();

    // ٥. پانێڵی خوارەوە بۆ دەستی یاریزان (تۆخ و شاهانە تا پوولەکانی دەستت بدرەوشێنەوە)
    const trayY = h - 110 * S;
    const trayH = 104 * S;
    const trayGrad = ctx.createLinearGradient(0, trayY, 0, h);
    trayGrad.addColorStop(0, 'rgba(28, 16, 8, 0.92)');
    trayGrad.addColorStop(1, 'rgba(14, 8, 4, 0.99)');
    ctx.fillStyle = trayGrad;
    this.roundRectPath(ctx, pad, trayY, innerW, trayH, 18 * S);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.65)';
    ctx.lineWidth = 1.8 * S;
    ctx.stroke();

    canvasTex.refresh();
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

  initGoldenSparkles(w, h) {
    const S = DOM_DPR;
    for (let i = 0; i < 14; i++) {
      const mote = this.add.circle(
        Phaser.Math.Between(24 * S, w - 24 * S),
        Phaser.Math.Between(22 * S, h - 135 * S),
        Phaser.Math.FloatBetween(1.4, 2.6) * S,
        0xfef08a,
        Phaser.Math.FloatBetween(0.18, 0.5)
      );
      this.ambientLayer.add(mote);
      this.tweens.add({
        targets: mote,
        y: mote.y - Phaser.Math.Between(10, 22) * S,
        alpha: { from: 0.12, to: 0.6 },
        duration: Phaser.Math.Between(2200, 3800),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  spawnGoldBurst(x, y) {
    const S = DOM_DPR;
    for (let i = 0; i < 16; i++) {
      const p = this.add.circle(x, y, Phaser.Math.FloatBetween(2, 4) * S, i % 2 === 0 ? 0xfacc15 : 0xffffff, 1);
      this.fxLayer.add(p);
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(22, 60) * S;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 520,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  // نووسینی زێڕینی درەوشاوە وەک "Domino!" لە وێنەکەتدا
  showDominoPopText(text) {
    const S = DOM_DPR;
    const w = this.scale.width;
    const h = (this.scale.height - 118 * S) / 2;

    const pop = this.add.text(w / 2, h, text, {
      fontFamily: 'Noto Kufi Arabic, Arial, sans-serif',
      fontSize: `${Math.round(32 * S)}px`,
      fontStyle: 'bold',
      color: '#fde047',
      stroke: '#451a03',
      strokeThickness: Math.round(7 * S),
      shadow: { offsetX: 0, offsetY: 4 * S, color: '#000000', blur: 10 * S, fill: true }
    }).setOrigin(0.5).setScale(0.3).setAlpha(0);

    this.fxLayer.add(pop);
    this.tweens.add({
      targets: pop,
      scale: 1.05,
      alpha: 1,
      duration: 360,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: pop,
          y: h - 24 * S,
          alpha: 0,
          delay: 1100,
          duration: 450,
          onComplete: () => pop.destroy()
        });
      }
    });
  }

  createCrispPillLabel(x, y, text, accentColor = '#fef08a') {
    const S = DOM_DPR;
    const grp = this.add.container(x, y);
    const txt = this.add.text(0, 0, text, {
      fontFamily: 'Noto Kufi Arabic, sans-serif',
      fontSize: `${Math.round(11.5 * S)}px`,
      fontStyle: 'bold',
      color: accentColor,
      stroke: '#000000',
      strokeThickness: Math.round(3 * S),
      align: 'center',
      wordWrap: { width: this.scale.width - 70 * S }
    }).setOrigin(0.5);

    const bw = txt.width + 24 * S;
    const bh = txt.height + 12 * S;
    const bg = this.add.graphics();
    bg.fillStyle(0x0f0804, 0.88);
    bg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, 14 * S);
    bg.lineStyle(1.6 * S, 0xfacc15, 0.9);
    bg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, 14 * S);

    grp.add([bg, txt]);
    return grp;
  }

  // پوولی سپیی ٣ ڕەهەندیی کلاسیک (وەک وێنەکە: سپیی بریقەدار، خاڵی ڕەشی قووڵ بە تروسکەی سپی)
  createDominoTileContainer(a, b, orientation = 'vertical', scale = 1, playable = false) {
    const S = DOM_DPR * scale;
    const container = this.add.container(0, 0);
    const isHoriz = orientation === 'horizontal';
    const tileW = (isHoriz ? 72 : 38) * S;
    const tileH = (isHoriz ? 38 : 72) * S;
    const rad = 7.5 * S;

    const gfx = this.add.graphics();

    // هالەی زێڕین بۆ پوولە ئامادەکان
    if (playable) {
      gfx.fillStyle(0xfacc15, 0.34);
      gfx.fillRoundedRect(-tileW / 2 - 3 * S, -tileH / 2 - 3 * S, tileW + 6 * S, tileH + 6 * S, rad + 2.5 * S);
    }

    // سێبەری قووڵی ژێر پوولەکە (بۆ ئەوەی لەسەر شریتی سپیی ئاڵاکەش زۆر بە زەقی دیار بێت)
    gfx.fillStyle(0x000000, 0.48);
    gfx.fillRoundedRect(-tileW / 2 + 2.5 * S, -tileH / 2 + 5 * S, tileW, tileH, rad);

    // ئەستووریی ٣ ڕەهەندیی خوارەوەی پوولەکە
    gfx.fillStyle(0xcbd5e1, 1);
    gfx.fillRoundedRect(-tileW / 2, -tileH / 2 + 2.6 * S, tileW, tileH, rad);

    // ڕووی سپیی پاک و بریقەدار
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

    // بریقەی سەرەوەی پوولەکە
    gfx.fillStyle(0xf8fafc, 0.9);
    gfx.fillRoundedRect(-tileW / 2 + 2 * S, -tileH / 2 + 1.5 * S, tileW - 4 * S, tileH * 0.25, rad * 0.6);

    // چوارچێوەی دەرەوە
    if (playable) {
      gfx.lineStyle(2.4 * S, 0xfacc15, 1);
    } else {
      gfx.lineStyle(1.3 * S, 0x94a3b8, 0.95);
    }
    gfx.strokeRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

    // هێڵی جیاکەرەوەی ناوەڕاست (وەک وێنەکە: پاک و باریک)
    gfx.lineStyle(1.5 * S, 0x94a3b8, 0.85);
    if (isHoriz) {
      gfx.beginPath();
      gfx.moveTo(0, -tileH * 0.38);
      gfx.lineTo(0, tileH * 0.38);
      gfx.strokePath();
    } else {
      gfx.beginPath();
      gfx.moveTo(-tileW * 0.38, 0);
      gfx.lineTo(tileW * 0.38, 0);
      gfx.strokePath();
    }

    // کێشانی خاڵە ڕەشە قووڵ و بریقەدارەکان (Glossy Recessed Black Pips)
    const drawHalfPips = (val, cx, cy, halfSize) => {
      const pipMap = {
        0: [],
        1: [[0, 0]],
        2: [[-1, -1], [1, 1]],
        3: [[-1, -1], [0, 0], [1, 1]],
        4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
        5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
        6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]
      };
      const pts = pipMap[val] || [];
      const spread = halfSize * 0.56;
      const r = (val === 1 ? 3.9 : 3.0) * S;

      pts.forEach(([ox, oy]) => {
        const px = cx + ox * spread;
        const py = cy + oy * spread;
        // لێواری سێبەری چاڵایی
        gfx.fillStyle(0x94a3b8, 0.6);
        gfx.fillCircle(px, py + 0.6 * S, r + 0.4 * S);
        // خاڵە ڕەشە تیژەکە
        gfx.fillStyle(0x0f172a, 1);
        gfx.fillCircle(px, py, r);
        // تروسکەیەکی بچووکی سپی لە گۆشەی خاڵەکە
        gfx.fillStyle(0xffffff, 0.45);
        gfx.fillCircle(px - r * 0.28, py - r * 0.28, r * 0.28);
      });
    };

    if (isHoriz) {
      drawHalfPips(a, -tileW / 4, 0, tileH / 2);
      drawHalfPips(b, tileW / 4, 0, tileH / 2);
    } else {
      drawHalfPips(a, 0, -tileH / 4, tileW / 2);
      drawHalfPips(b, 0, tileH / 4, tileW / 2);
    }

    container.add(gfx);
    container.setSize(tileW, tileH);
    return container;
  }

  renderAll() {
    const S = DOM_DPR;
    this.boardLayer.removeAll(true);
    this.slotsLayer.removeAll(true);
    this.handLayer.removeAll(true);
    this.overlayLayer.removeAll(true);
    this.leftSlotZone = null;
    this.rightSlotZone = null;
    this.centerSlotZone = null;

    const w = this.scale.width;
    const h = this.scale.height;
    const boardCenterY = (h - 118 * S) / 2;

    if (teahouseDom.chain.length === 0) {
      const hint = teahouseDom.firstMoveRule && teahouseDom.requiredOpeningDouble !== null
        ? `گەورەترین جووت (${teahouseDom.requiredOpeningDouble}-${teahouseDom.requiredOpeningDouble}) ڕابکێشە سەر ئاڵاکە`
        : 'یەکەم پوول ڕابکێشە سەر مێزەکە';

      const pill = this.createCrispPillLabel(w / 2, boardCenterY + 72 * S, hint, '#fef08a');
      this.boardLayer.add(pill);

      this.centerSlotZone = { x: w / 2, y: boardCenterY, w: 125 * S, h: 90 * S };
    } else {
      const count = teahouseDom.chain.length;
      const tileScale = count > 14 ? 0.64 : (count > 8 ? 0.76 : 0.88);
      const maxRowWidth = w - 76 * S;

      const rows = [[]];
      let curRowW = 0;

      teahouseDom.chain.forEach((t, idx) => {
        const isDbl = t.a === t.b;
        const tw = (isDbl ? 38 : 72) * tileScale * S + 3.5 * S;
        if (curRowW + tw > maxRowWidth && rows[rows.length - 1].length > 0) {
          rows.push([]);
          curRowW = 0;
        }
        rows[rows.length - 1].push({ t, idx, isDbl, tw });
        curRowW += tw;
      });

      const rowHeight = 64 * tileScale * S;
      const totalH = rows.length * rowHeight;
      const startY = Math.max(44 * S, boardCenterY - totalH / 2 + rowHeight / 2);

      let firstTilePos = null;
      let lastTilePos = null;

      rows.forEach((rowItems, rIdx) => {
        const isReversedRow = rIdx % 2 === 1;
        const ordered = isReversedRow ? [...rowItems].reverse() : rowItems;
        const rowTotalW = ordered.reduce((s, it) => s + it.tw, 0);
        let curX = (w - rowTotalW) / 2;
        const curY = startY + rIdx * rowHeight;

        ordered.forEach((item) => {
          const orient = item.isDbl ? 'vertical' : 'horizontal';
          const aVal = isReversedRow && !item.isDbl ? item.t.b : item.t.a;
          const bVal = isReversedRow && !item.isDbl ? item.t.a : item.t.b;
          const sprite = this.createDominoTileContainer(aVal, bVal, orient, tileScale, false);
          sprite.setPosition(curX + item.tw / 2, curY);
          this.boardLayer.add(sprite);

          if (item.idx === 0) firstTilePos = { x: curX, y: curY };
          if (item.idx === teahouseDom.chain.length - 1) lastTilePos = { x: curX + item.tw, y: curY, isRev: isReversedRow };
          curX += item.tw;
        });
      });

      if (firstTilePos) {
        this.leftSlotZone = { x: Math.max(38 * S, firstTilePos.x - 32 * S), y: firstTilePos.y, w: 62 * S, h: 56 * S };
      }
      if (lastTilePos) {
        const targetX = lastTilePos.isRev ? Math.max(38 * S, lastTilePos.x - 75 * S) : Math.min(w - 38 * S, lastTilePos.x + 32 * S);
        this.rightSlotZone = { x: targetX, y: lastTilePos.y, w: 62 * S, h: 56 * S };
      }
    }

    // خانە درەوشاوەکانی دانانی پوول کاتێک ڕادەکێشرێت
    if (teahouseDom.activeDragIdx !== null && teahouseDom.turn === 'player' && !teahouseDom.roundOver) {
      const draggedTile = teahouseDom.myHand[teahouseDom.activeDragIdx];
      if (draggedTile) {
        const fit = checkTeahouseTileFit(draggedTile);
        const drawDropTarget = (zone, label) => {
          if (!zone) return;
          const g = this.add.graphics();
          g.fillStyle(0x10b981, 0.42);
          g.fillRoundedRect(zone.x - zone.w / 2, zone.y - zone.h / 2, zone.w, zone.h, 12 * S);
          g.lineStyle(2.5 * S, 0xfacc15, 0.98);
          g.strokeRoundedRect(zone.x - zone.w / 2, zone.y - zone.h / 2, zone.w, zone.h, 12 * S);
          this.slotsLayer.add(g);

          const lbl = this.add.text(zone.x, zone.y, label, {
            fontFamily: 'Noto Kufi Arabic, sans-serif',
            fontSize: `${Math.round(12.5 * S)}px`,
            fontStyle: 'bold',
            color: '#fef08a',
            stroke: '#000000',
            strokeThickness: Math.round(3 * S)
          }).setOrigin(0.5);
          this.slotsLayer.add(lbl);
        };

        if (teahouseDom.chain.length === 0 && (fit.left || fit.right)) {
          drawDropTarget(this.centerSlotZone, 'لێرە دایبنێ');
        } else {
          if (fit.left) drawDropTarget(this.leftSlotZone, `[${teahouseDom.leftEnd}]`);
          if (fit.right) drawDropTarget(this.rightSlotZone, `[${teahouseDom.rightEnd}]`);
        }
      }
    }

    // دەستی یاریزان لە خوارەوە
    const handCount = teahouseDom.myHand.length;
    if (handCount > 0) {
      const maxHandWidth = w - 26 * S;
      const handScale = handCount > 8 ? Math.max(0.68, maxHandWidth / (handCount * 42 * S)) : 0.95;
      const stepX = Math.min(45 * handScale * S, maxHandWidth / handCount);
      const totalHandW = stepX * handCount;
      const startHandX = (w - totalHandW) / 2 + stepX / 2;
      const baseHandY = h - 58 * S;

      teahouseDom.myHand.forEach((tile, idx) => {
        const fit = (teahouseDom.turn === 'player' && !teahouseDom.roundOver)
          ? checkTeahouseTileFit(tile)
          : { left: false, right: false };
        const canPlay = fit.left || fit.right;
        const yPos = canPlay ? baseHandY - 10 * S : baseHandY;

        const card = this.createDominoTileContainer(tile.a, tile.b, 'vertical', handScale, canPlay);
        card.setPosition(startHandX + idx * stepX, yPos);
        if (!canPlay) card.setAlpha(0.75);

        if (canPlay) {
          card.setInteractive({ draggable: true, useHandCursor: true });

          card.on('dragstart', () => {
            teahouseDom.activeDragIdx = idx;
            card.setDepth(100);
            card.setScale(1.12);
            this.renderAll();
          });

          card.on('drag', (pointer) => {
            if (!this.dragGhost) {
              this.dragGhost = this.createDominoTileContainer(tile.a, tile.b, 'vertical', 1.1, true);
              this.dragGhost.setDepth(200);
              this.overlayLayer.add(this.dragGhost);
            }
            this.dragGhost.setPosition(pointer.x, pointer.y);
          });

          card.on('dragend', (pointer) => {
            const dropX = pointer.x;
            const dropY = pointer.y;
            teahouseDom.activeDragIdx = null;
            if (this.dragGhost) {
              this.dragGhost.destroy();
              this.dragGhost = null;
            }

            if (teahouseDom.chain.length === 0) {
              if (dropY < h - 110 * S) {
                this.spawnGoldBurst(w / 2, boardCenterY);
                executePlayerTeahouseMove(idx, 'right');
                return;
              }
            } else {
              const distLeft = (fit.left && this.leftSlotZone)
                ? Phaser.Math.Distance.Between(dropX, dropY, this.leftSlotZone.x, this.leftSlotZone.y)
                : 99999;
              const distRight = (fit.right && this.rightSlotZone)
                ? Phaser.Math.Distance.Between(dropX, dropY, this.rightSlotZone.x, this.rightSlotZone.y)
                : 99999;

              if (dropY < h - 108 * S) {
                if (fit.left && fit.right) {
                  const chosen = distLeft <= distRight ? 'left' : 'right';
                  const z = chosen === 'left' ? this.leftSlotZone : this.rightSlotZone;
                  if (z) this.spawnGoldBurst(z.x, z.y);
                  executePlayerTeahouseMove(idx, chosen);
                  return;
                } else if (fit.left) {
                  if (this.leftSlotZone) this.spawnGoldBurst(this.leftSlotZone.x, this.leftSlotZone.y);
                  executePlayerTeahouseMove(idx, 'left');
                  return;
                } else if (fit.right) {
                  if (this.rightSlotZone) this.spawnGoldBurst(this.rightSlotZone.x, this.rightSlotZone.y);
                  executePlayerTeahouseMove(idx, 'right');
                  return;
                }
              }
            }

            this.renderAll();
          });

          card.on('pointerup', (pointer) => {
            if (Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.upX, pointer.upY) < 8 * S) {
              if (teahouseDom.chain.length === 0) {
                this.spawnGoldBurst(w / 2, boardCenterY);
                executePlayerTeahouseMove(idx, 'right');
              } else if (fit.left && !fit.right) {
                if (this.leftSlotZone) this.spawnGoldBurst(this.leftSlotZone.x, this.leftSlotZone.y);
                executePlayerTeahouseMove(idx, 'left');
              } else if (fit.right && !fit.left) {
                if (this.rightSlotZone) this.spawnGoldBurst(this.rightSlotZone.x, this.rightSlotZone.y);
                executePlayerTeahouseMove(idx, 'right');
              } else if (fit.left && fit.right && teahouseDom.leftEnd === teahouseDom.rightEnd) {
                if (this.rightSlotZone) this.spawnGoldBurst(this.rightSlotZone.x, this.rightSlotZone.y);
                executePlayerTeahouseMove(idx, 'right');
              }
            }
          });
        }

        this.handLayer.add(card);
      });
    }

    if (teahouseDom.roundBannerText) {
      const bannerPill = this.createCrispPillLabel(w / 2, boardCenterY + 52 * S, teahouseDom.roundBannerText, '#fef08a');
      this.overlayLayer.add(bannerPill);
    }
  }
}

function initDominoPhaser() {
  const stage = document.getElementById('ykDomBoardStage');
  if (!stage) return;

  if (!dominoPhaserGame) {
    stage.innerHTML = '';
    stage.style.padding = '0';
    stage.style.overflow = 'hidden';
    const cssW = stage.clientWidth || 390;
    const cssH = Math.max(stage.clientHeight || 430, 420);

    dominoPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: Math.round(cssW * DOM_DPR),
      height: Math.round(cssH * DOM_DPR),
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Math.round(cssW * DOM_DPR),
        height: Math.round(cssH * DOM_DPR)
      },
      antialias: true,
      parent: 'ykDomBoardStage',
      transparent: true,
      scene: [RoyalDominoScene]
    });
  } else if (dominoSceneRef) {
    dominoSceneRef.renderAll();
  }
}

function startRoyalTeahouseDomino() {
  teahouseDom.myScore = 0;
  teahouseDom.botScore = 0;
  const pNameEl = document.getElementById('ykDomPlayerName');
  if (pNameEl) {
    pNameEl.textContent = (typeof playerName !== 'undefined' && playerName) ? playerName : 'تۆ';
  }
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
  teahouseDom.leftEnd = null;
  teahouseDom.rightEnd = null;
  teahouseDom.roundOver = false;
  teahouseDom.activeDragIdx = null;
  teahouseDom.roundBannerText = '';

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

  renderTeahouseDomino();
  if (teahouseDom.turn === 'bot') {
    setTimeout(runTeahouseBotTurn, 900);
  }
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

function executePlayerTeahouseMove(idx, side) {
  const tile = teahouseDom.myHand.splice(idx, 1)[0];
  teahouseDom.firstMoveRule = false;
  appendTeahouseChain(tile, side);
  playTeahouseWoodClack();

  if (teahouseDom.myHand.length === 0) {
    endTeahouseRound('player');
    return;
  }
  teahouseDom.turn = 'bot';
  renderTeahouseDomino();
  setTimeout(runTeahouseBotTurn, 800);
}

function appendTeahouseChain(tile, side) {
  if (teahouseDom.chain.length === 0) {
    teahouseDom.chain.push({ a: tile.a, b: tile.b });
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

function drawTeahouseBoneyard() {
  if (teahouseDom.turn !== 'player' || teahouseDom.roundOver) return;
  const hasAnyMove = teahouseDom.myHand.some(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });
  if (hasAnyMove) return;

  if (teahouseDom.boneyard.length > 0) {
    teahouseDom.myHand.push(teahouseDom.boneyard.pop());
    playTeahouseWoodClack();
    renderTeahouseDomino();
  } else {
    teahouseDom.turn = 'bot';
    renderTeahouseDomino();
    setTimeout(runTeahouseBotTurn, 800);
  }
}

function runTeahouseBotTurn() {
  if (teahouseDom.roundOver || teahouseDom.turn !== 'bot') return;
  let moveIdx = teahouseDom.botHand.findIndex(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });

  while (moveIdx === -1 && teahouseDom.boneyard.length > 0) {
    teahouseDom.botHand.push(teahouseDom.boneyard.pop());
    moveIdx = teahouseDom.botHand.findIndex(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });
  }

  if (moveIdx !== -1) {
    const tile = teahouseDom.botHand.splice(moveIdx, 1)[0];
    teahouseDom.firstMoveRule = false;
    const fit = checkTeahouseTileFit(tile);
    appendTeahouseChain(tile, fit.right ? 'right' : 'left');
    playTeahouseWoodClack();
    if (teahouseDom.botHand.length === 0) {
      endTeahouseRound('bot');
      return;
    }
  }

  const pCan = teahouseDom.myHand.some(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });
  const bCan = teahouseDom.botHand.some(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });
  if (!pCan && !bCan && teahouseDom.boneyard.length === 0) {
    endTeahouseRound('blocked');
    return;
  }

  teahouseDom.turn = 'player';
  renderTeahouseDomino();
}

function endTeahouseRound(reason) {
  teahouseDom.roundOver = true;
  const mySum = teahouseDom.myHand.reduce((s, t) => s + t.a + t.b, 0);
  const botSum = teahouseDom.botHand.reduce((s, t) => s + t.a + t.b, 0);

  let bannerMsg = '';
  if (reason === 'player' || (reason === 'blocked' && mySum < botSum)) {
    teahouseDom.myScore += botSum;
    bannerMsg = `🎉 دەستخۆش! ئەم دەورەت بردەوە (+${botSum} خاڵ)`;
    if (dominoSceneRef) dominoSceneRef.showDominoPopText('Domino! 🏆');
  } else {
    teahouseDom.botScore += mySum;
    bannerMsg = `🤖 بۆت ئەم دەورەی بردەوە (+${mySum} خاڵ)`;
  }

  if (teahouseDom.myScore >= 101 || teahouseDom.botScore >= 101) {
    const iWon = teahouseDom.myScore >= 101;
    if (typeof awardGameXp === 'function') awardGameXp(iWon ? 'win' : 'loss');
    teahouseDom.roundBannerText = iWon
      ? '🏆 پیرۆزە! گەیشتیتە ١٠١ و یارییەکەت بردەوە!'
      : '😔 بەرامبەر گەیشتە ١٠١ و یارییەکەی بردەوە!';
    renderTeahouseDomino();
    setTimeout(() => {
      if (confirm(teahouseDom.roundBannerText + '\nدەتەوێت یارییەکی نوێ دەستپێبکەیت؟')) {
        startRoyalTeahouseDomino();
      }
    }, 1200);
  } else {
    teahouseDom.roundBannerText = bannerMsg;
    renderTeahouseDomino();
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

function renderTeahouseDomino() {
  const myScoreEl = document.getElementById('ykDomMyScore');
  const botScoreEl = document.getElementById('ykDomBotScore');
  const botCountEl = document.getElementById('ykDomBotCountBadge');
  const boneNumEl = document.getElementById('ykDomBoneyardNum');

  if (myScoreEl) myScoreEl.textContent = teahouseDom.myScore;
  if (botScoreEl) botScoreEl.textContent = teahouseDom.botScore;
  if (botCountEl) botCountEl.textContent = teahouseDom.botHand.length;
  if (boneNumEl) boneNumEl.textContent = teahouseDom.boneyard.length;

  const miniBox = document.getElementById('ykDomBotMiniTiles');
  if (miniBox) {
    miniBox.innerHTML = Array(teahouseDom.botHand.length).fill('<span class="yk-bot-mini-tile"></span>').join('');
  }

  const turnPill = document.getElementById('ykDomTurnPill');
  const turnText = document.getElementById('ykDomTurnText');
  if (turnPill && turnText) {
    if (teahouseDom.turn === 'player') {
      turnPill.className = 'px-4 py-1.5 rounded-full bg-red-600 border-2 border-yellow-300 text-white text-xs font-black shadow-lg flex items-center gap-2';
      turnText.textContent = 'نۆرەی تۆیە';
    } else {
      turnPill.className = 'px-4 py-1.5 rounded-full bg-slate-800 border border-slate-500 text-amber-200 text-xs font-black shadow-lg flex items-center gap-2';
      turnText.textContent = 'نۆرەی بۆتە...';
    }
  }

  const endsLbl = document.getElementById('ykDomEndsLabel');
  if (endsLbl) {
    endsLbl.textContent = teahouseDom.chain.length === 0
      ? 'سەرەکان: دەستپێک'
      : `چەپ: [${teahouseDom.leftEnd}] • ڕاست: [${teahouseDom.rightEnd}]`;
  }

  const pCanMove = teahouseDom.myHand.some(t => { const f = checkTeahouseTileFit(t); return f.left || f.right; });
  const boneBtn = document.getElementById('ykDomBoneyardBtn');
  if (boneBtn) {
    boneBtn.disabled = (teahouseDom.turn !== 'player' || pCanMove || teahouseDom.roundOver);
    if (!boneBtn.disabled && teahouseDom.boneyard.length > 0) boneBtn.classList.add('animate-bounce');
    else boneBtn.classList.remove('animate-bounce');
  }

  const oldHandBox = document.getElementById('ykDomPlayerHand');
  if (oldHandBox) oldHandBox.style.display = 'none';

  setTimeout(initDominoPhaser, 30);
}