// =========================================================================
// YARI KURDI - MAGICAL KURDISH TEAHOUSE KONKAN ENGINE (4K PROCEDURAL ART)
// =========================================================================

let konkCardsPerPlayer = 10;
let konkIsOnline = false;
let konkRoomRef = null;
let konkQueueRef = null;
let konkMyRole = 'p1';
let konkState = null;
let konkSelectedIds = [];
let konkOppInfo = { id: null, name: 'بۆتی کۆنکان', elo: 1250, avatar: '' };

let konkanPhaserGame = null;
let konkanSceneRef = null;
const KONK_DPR = Math.min(Math.max(window.devicePixelRatio || 2, 2.5), 3);

function selectKonkanCardsCount(cnt) {
  konkCardsPerPlayer = cnt;
  const b10 = document.getElementById('konk-mode-10');
  const b8 = document.getElementById('konk-mode-8');
  if (!b10 || !b8) return;
  if (cnt === 10) {
    b10.className = 'py-2.5 rounded-xl text-xs font-black bg-amber-400 text-[#1a0d06] border border-amber-300 shadow transition';
    b8.className = 'py-2.5 rounded-xl text-xs font-bold bg-[#1a0d06] text-amber-100 border border-amber-500/30 transition';
  } else {
    b8.className = 'py-2.5 rounded-xl text-xs font-black bg-amber-400 text-[#1a0d06] border border-amber-300 shadow transition';
    b10.className = 'py-2.5 rounded-xl text-xs font-bold bg-[#1a0d06] text-amber-100 border border-amber-500/30 transition';
  }
}

function createKonkanDeck() {
  const suits = ['S', 'H', 'D', 'C'];
  const deck = [];
  for (const s of suits) {
    for (let r = 1; r <= 13; r++) {
      deck.push({ id: `${r}${s}`, r, s });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function initNewKonkanGame(cardsCount = 10) {
  const deck = createKonkanDeck();
  const p1Hand = deck.splice(0, cardsCount);
  const p2Hand = deck.splice(0, cardsCount);
  const discard = [deck.pop()];
  return {
    cardsCount,
    deck,
    discard,
    p1Hand,
    p2Hand,
    melds: [],
    turn: 'p1',
    phase: 'draw',
    mustMeldCardId: null,
    log: 'کارتێک لە Deck ڕابکێشە یان کارتی فڕێدراو هەڵبگرەوە',
    winner: null
  };
}

class RoyalKonkanScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoyalKonkanScene' });
    this.meldZones = [];
    this.discardZone = null;
    this.steamParticles = [];
    this.magicMotes = [];
  }

  create() {
    konkanSceneRef = this;
    const w = this.scale.width;
    const h = this.scale.height;

    // دروستکردنی پاشبنەمای چایخانەی فۆلکلۆری و ئاڵای کوردستان بە دیقەی 4K
    this.bakeTeahouseTableTexture(w, h);
    this.add.image(w / 2, h / 2, 'yk_konkan_teahouse_bg').setDisplaySize(w, h);

    // دروستکردنی نەخشی پشتی کارتی شاهانە
    this.bakeRoyalCardBackTexture();

    // تەنۆلکەی سحراویی بریسکە و هەڵمی چا
    this.ambientLayer = this.add.container(0, 0);
    this.tableLayer = this.add.container(0, 0);
    this.meldsLayer = this.add.container(0, 0);
    this.handLayer = this.add.container(0, 0);
    this.fxLayer = this.add.container(0, 0);

    this.initMagicalAmbientFX(w, h);
    this.renderAll();
  }

  // کێشانی مێزی چایخانەی کوردی بە Canvas 2D (دارگوێز، جاجم، مەدالیای ئاڵای کوردستان، چا و قۆری)
  bakeTeahouseTableTexture(w, h) {
    const key = 'yk_konkan_teahouse_bg';
    if (this.textures.exists(key)) this.textures.remove(key);

    const canvasTex = this.textures.createCanvas(key, w, h);
    const ctx = canvasTex.getContext();
    const S = KONK_DPR;

    // ١. تەختەی دارگوێزی چایخانەی کوردی (Walnut Wood Planks)
    const woodGrad = ctx.createLinearGradient(0, 0, 0, h);
    woodGrad.addColorStop(0, '#3b1d0d');
    woodGrad.addColorStop(0.5, '#261107');
    woodGrad.addColorStop(1, '#170903');
    ctx.fillStyle = woodGrad;
    ctx.fillRect(0, 0, w, h);

    // هێڵی تەختە دارینەکان و دەمارەکانی دار
    const plankCount = 10;
    const pw = w / plankCount;
    for (let i = 0; i < plankCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 190, 120, 0.035)' : 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(i * pw, 0, pw - 1.5 * S, h);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1.5 * S;
      ctx.beginPath();
      ctx.moveTo(i * pw, 0);
      ctx.lineTo(i * pw, h);
      ctx.stroke();
    }

    // ٢. چوارچێوەی نەخشی جاجم و فەرشی فۆلکلۆری کوردی لە دەوری مێزەکە
    const pad = 10 * S;
    const innerW = w - pad * 2;
    const innerH = h - pad * 2;

    ctx.save();
    this.roundRectPath(ctx, pad, pad, innerW, innerH, 22 * S);
    ctx.clip();

    // مەخمەڵی شاهانەی ناوەوەی مێز (تێکەڵەی سووری مەخمەڵی/ئەزمڕی چایخانەی شاهانە)
    const feltGrad = ctx.createRadialGradient(w / 2, h * 0.36, 20 * S, w / 2, h * 0.45, Math.max(w, h) * 0.65);
    feltGrad.addColorStop(0, '#0f5c43');
    feltGrad.addColorStop(0.52, '#093b2c');
    feltGrad.addColorStop(0.88, '#06261d');
    feltGrad.addColorStop(1, '#041711');
    ctx.fillStyle = feltGrad;
    ctx.fillRect(pad, pad, innerW, innerH);

    // نەخشی شەبەکەی ناسک لەسەر مەخمەڵەکە بۆ هەستی قووڵایی
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.05)';
    ctx.lineWidth = 1 * S;
    const step = 28 * S;
    for (let x = -h; x < w + h; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + h, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // ٣. ڕووناکیی فانۆسی زێڕینی چایخانە لە سەرەوە
    const lanternGlow = ctx.createRadialGradient(w / 2, h * 0.14, 10 * S, w / 2, h * 0.25, w * 0.55);
    lanternGlow.addColorStop(0, 'rgba(253, 224, 71, 0.22)');
    lanternGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.07)');
    lanternGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = lanternGlow;
    ctx.fillRect(pad, pad, innerW, innerH);

    // ٤. پۆرترێت و مەدالیای شاهانەی ئاڵای کوردستان لە ناوەڕاستی مێزەکە
    const cx = w / 2;
    const cy = h * 0.43;
    const medR = Math.min(w * 0.17, 74 * S);

    // هالەی زێڕینی دەوری مەدالیاکە
    const halo = ctx.createRadialGradient(cx, cy, medR * 0.6, cx, cy, medR * 1.45);
    halo.addColorStop(0, 'rgba(250, 204, 21, 0.34)');
    halo.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, medR * 1.45, 0, Math.PI * 2);
    ctx.fill();

    // کێشانی ئاڵای کوردستان لە ناو مەدالیا بازنەییەکەدا (Portrait Crest)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, medR, 0, Math.PI * 2);
    ctx.clip();

    const fTop = cy - medR;
    const fBand = (medR * 2) / 3;
    ctx.fillStyle = 'rgba(220, 38, 38, 0.52)'; // سوور
    ctx.fillRect(cx - medR, fTop, medR * 2, fBand);
    ctx.fillStyle = 'rgba(255, 253, 245, 0.45)'; // سپی
    ctx.fillRect(cx - medR, fTop + fBand, medR * 2, fBand);
    ctx.fillStyle = 'rgba(21, 128, 61, 0.52)'; // سەوز
    ctx.fillRect(cx - medR, fTop + fBand * 2, medR * 2, fBand);

    // خۆری کوردستان (٢١ تیشک) بە درەوشانەوەی زێڕین
    const innerSunR = medR * 0.25;
    const outerSunR = medR * 0.48;
    const sunGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, outerSunR);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.65, '#facc15');
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

    // چوارچێوەی زێڕینی دوو-هێڵی دەوری مەدالیای ئاڵای کوردستان
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
    ctx.lineWidth = 2.6 * S;
    ctx.beginPath();
    ctx.arc(cx, cy, medR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.42)';
    ctx.lineWidth = 1.2 * S;
    ctx.setLineDash([5 * S, 4 * S]);
    ctx.beginPath();
    ctx.arc(cx, cy, medR + 7 * S, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ٥. نەخشی جاجمی کوردی لە سەرەوە و خوارەوەی مێزەکە
    const rugColors = ['#dc2626', '#facc15', '#15803d', '#fffbeb'];
    const segW = 16 * S;
    for (let x = pad + 18 * S; x < w - pad - 24 * S; x += segW) {
      const col = rugColors[Math.floor(x / segW) % rugColors.length];
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x, pad + 3 * S, segW - 2 * S, 4.5 * S);
      ctx.fillRect(x, h - pad - 7.5 * S, segW - 2 * S, 4.5 * S);
    }
    ctx.globalAlpha = 1;

    // ٦. ئیستکانە چای کەمەرباریک و قۆریی چایخانە لە گۆشەکاندا
    this.drawKurdishTeacup(ctx, w - 42 * S, 46 * S, S);
    this.drawCopperTeapot(ctx, 44 * S, 46 * S, S);

    // ٧. ناوچەی تایبەتی دەستی یاریزان لە خوارەوە (شووشەی تاریکی شاهانە)
    const trayY = h - 148 * S;
    const trayH = 132 * S;
    const trayGrad = ctx.createLinearGradient(0, trayY, 0, h);
    trayGrad.addColorStop(0, 'rgba(20, 9, 4, 0.72)');
    trayGrad.addColorStop(1, 'rgba(10, 4, 2, 0.94)');
    ctx.fillStyle = trayGrad;
    this.roundRectPath(ctx, pad + 8 * S, trayY, innerW - 16 * S, trayH, 18 * S);
    ctx.fill();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = 1.6 * S;
    ctx.stroke();

    ctx.restore();

    // چوارچێوەی زێڕینی دەرەوەی مێزەکە
    const borderGrad = ctx.createLinearGradient(0, 0, w, h);
    borderGrad.addColorStop(0, '#fde047');
    borderGrad.addColorStop(0.5, '#d97706');
    borderGrad.addColorStop(1, '#fef08a');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 3.2 * S;
    this.roundRectPath(ctx, pad, pad, innerW, innerH, 22 * S);
    ctx.stroke();

    canvasTex.refresh();
  }

  drawKurdishTeacup(ctx, x, y, S) {
    ctx.save();
    // سێبەر
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(x + 2 * S, y + 12 * S, 19 * S, 7 * S, 0, 0, Math.PI * 2);
    ctx.fill();

    // ژێرپیاڵەی سپی و سوور (فۆلکلۆری چایخانە)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(x, y + 10 * S, 18 * S, 6.5 * S, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.5 * S;
    ctx.beginPath();
    ctx.ellipse(x, y + 10 * S, 14 * S, 4.5 * S, 0, 0, Math.PI * 2);
    ctx.stroke();

    // چای ڕەشی گەرمی ناو ئیستکانە کەمەرباریکەکە
    const teaGrad = ctx.createLinearGradient(x - 7 * S, y - 10 * S, x + 7 * S, y + 8 * S);
    teaGrad.addColorStop(0, '#b91c1c');
    teaGrad.addColorStop(0.5, '#7c2d12');
    teaGrad.addColorStop(1, '#431407');
    ctx.fillStyle = teaGrad;
    ctx.beginPath();
    ctx.moveTo(x - 7.5 * S, y - 9 * S);
    ctx.quadraticCurveTo(x - 4.5 * S, y - 1 * S, x - 8 * S, y + 8 * S);
    ctx.lineTo(x + 8 * S, y + 8 * S);
    ctx.quadraticCurveTo(x + 4.5 * S, y - 1 * S, x + 7.5 * S, y - 9 * S);
    ctx.closePath();
    ctx.fill();

    // بریقەی شووشەی ئیستکانەکە
    ctx.strokeStyle = 'rgba(255,255,255,0.82)';
    ctx.lineWidth = 1.4 * S;
    ctx.stroke();

    // کڵۆ قەندی سپی لە تەنیشت ئیستکانەکە
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 13 * S, y + 7 * S, 4.5 * S, 4 * S);
    ctx.restore();
  }

  drawCopperTeapot(ctx, x, y, S) {
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(x + 2 * S, y + 12 * S, 16 * S, 6 * S, 0, 0, Math.PI * 2);
    ctx.fill();

    const potGrad = ctx.createRadialGradient(x - 4 * S, y - 2 * S, 2 * S, x, y + 2 * S, 16 * S);
    potGrad.addColorStop(0, '#fde68a');
    potGrad.addColorStop(0.45, '#d97706');
    potGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = potGrad;
    ctx.beginPath();
    ctx.arc(x, y + 2 * S, 13 * S, 0, Math.PI * 2);
    ctx.fill();

    // سەرقاپ و دەسک
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(x, y - 11 * S, 4 * S, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.2 * S;
    ctx.beginPath();
    ctx.arc(x - 13 * S, y + 1 * S, 6 * S, Math.PI * 0.4, Math.PI * 1.6);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 11 * S, y + 2 * S);
    ctx.quadraticCurveTo(x + 19 * S, y - 4 * S, x + 20 * S, y - 10 * S);
    ctx.stroke();
    ctx.restore();
  }

  bakeRoyalCardBackTexture() {
    const key = 'yk_royal_card_back';
    if (this.textures.exists(key)) return;
    const S = KONK_DPR;
    const cw = Math.round(70 * S);
    const ch = Math.round(102 * S);
    const cTex = this.textures.createCanvas(key, cw, ch);
    const ctx = cTex.getContext();

    // لێواری سپی عاجی
    this.roundRectPath(ctx, 1 * S, 1 * S, cw - 2 * S, ch - 2 * S, 9 * S);
    ctx.fillStyle = '#fffdf7';
    ctx.fill();

    // ناوەوەی سووری شاهانەی فەرشی کوردی
    const g = ctx.createLinearGradient(0, 0, cw, ch);
    g.addColorStop(0, '#991b1b');
    g.addColorStop(0.5, '#7f1d1d');
    g.addColorStop(1, '#450a0a');
    this.roundRectPath(ctx, 5 * S, 5 * S, cw - 10 * S, ch - 10 * S, 6 * S);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.6 * S;
    ctx.stroke();

    // نەخشی ئەندازەیی و خۆری زێڕین لە ناوەڕاستی پشتی کارتەکە
    const cx = cw / 2;
    const cy = ch / 2;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
    ctx.lineWidth = 1.2 * S;
    ctx.beginPath();
    ctx.moveTo(cx, 13 * S);
    ctx.lineTo(cw - 13 * S, cy);
    ctx.lineTo(cx, ch - 13 * S);
    ctx.lineTo(13 * S, cy);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(cx, cy, 9 * S, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5 * S, 0, Math.PI * 2);
    ctx.fill();

    cTex.refresh();
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

  // هەڵمی گەرمی چا و بریسکەی زێڕینی سحراوی
  initMagicalAmbientFX(w, h) {
    const S = KONK_DPR;
    // هەڵمی چایخانە لەسەر ئیستکانەکە
    this.time.addEvent({
      delay: 650,
      loop: true,
      callback: () => {
        if (!this.scene || !this.scene.isActive()) return;
        const puff = this.add.circle(w - 42 * S + Phaser.Math.Between(-4, 4) * S, 32 * S, 4.5 * S, 0xffffff, 0.24);
        this.ambientLayer.add(puff);
        this.tweens.add({
          targets: puff,
          y: puff.y - 26 * S,
          x: puff.x + Phaser.Math.Between(-8, 8) * S,
          scale: 2.2,
          alpha: 0,
          duration: 1800,
          ease: 'Sine.easeOut',
          onComplete: () => puff.destroy()
        });
      }
    });

    // تەنۆلکە زێڕینە سحراوییەکان لە ناو ڕووناکیی چایخانەکەدا
    for (let i = 0; i < 14; i++) {
      const mote = this.add.circle(
        Phaser.Math.Between(30 * S, w - 30 * S),
        Phaser.Math.Between(25 * S, h - 160 * S),
        Phaser.Math.FloatBetween(1.4, 2.8) * S,
        0xfde047,
        Phaser.Math.FloatBetween(0.15, 0.45)
      );
      this.ambientLayer.add(mote);
      this.tweens.add({
        targets: mote,
        y: mote.y - Phaser.Math.Between(12, 28) * S,
        alpha: { from: 0.1, to: 0.55 },
        duration: Phaser.Math.Between(2400, 4200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  spawnGoldBurst(x, y) {
    const S = KONK_DPR;
    for (let i = 0; i < 14; i++) {
      const p = this.add.circle(x, y, Phaser.Math.FloatBetween(2, 4) * S, i % 2 === 0 ? 0xfacc15 : 0xffffff, 1);
      this.fxLayer.add(p);
      const ang = Phaser.Math.FloatBetween(0, Math.PI * 2);
      const dist = Phaser.Math.FloatBetween(24, 65) * S;
      this.tweens.add({
        targets: p,
        x: x + Math.cos(ang) * dist,
        y: y + Math.sin(ang) * dist,
        alpha: 0,
        scale: 0.2,
        duration: 550,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  // دروستکردنی کارتی کۆنکانی شاهانە بە دیقەی 4K و بریقەی زێڕین
  createPlayingCard(card, scale = 1, isSelected = false, isFaceDown = false) {
    const S = KONK_DPR * scale;
    const cw = 70 * S;
    const ch = 102 * S;
    const rad = 9 * S;
    const container = this.add.container(0, 0);

    if (isFaceDown) {
      const shadow = this.add.graphics();
      shadow.fillStyle(0x000000, 0.55);
      shadow.fillRoundedRect(-cw / 2 + 3 * S, -ch / 2 + 5 * S, cw, ch, rad);
      container.add(shadow);

      const backImg = this.add.image(0, 0, 'yk_royal_card_back').setDisplaySize(cw, ch);
      container.add(backImg);

      if (isSelected) {
        const glow = this.add.graphics();
        glow.lineStyle(3 * S, 0xfacc15, 1);
        glow.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);
        container.add(glow);
      }

      container.setSize(cw, ch);
      return container;
    }

    const gfx = this.add.graphics();

    // هالەی زێڕین بۆ کارتی هەڵبژێردراو
    if (isSelected) {
      gfx.fillStyle(0xfacc15, 0.35);
      gfx.fillRoundedRect(-cw / 2 - 4 * S, -ch / 2 - 4 * S, cw + 8 * S, ch + 8 * S, rad + 3 * S);
    }

    // سێبەری قووڵ
    gfx.fillStyle(0x000000, 0.52);
    gfx.fillRoundedRect(-cw / 2 + 3 * S, -ch / 2 + 5.5 * S, cw, ch, rad);

    // ڕووی عاجیی شاهانە
    gfx.fillStyle(0xfffdf9, 1);
    gfx.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);

    // چوارچێوەی ناسکی ناوەوەی کارت
    gfx.lineStyle(1 * S, 0xe2e8f0, 0.9);
    gfx.strokeRoundedRect(-cw / 2 + 4 * S, -ch / 2 + 4 * S, cw - 8 * S, ch - 8 * S, rad * 0.65);

    if (isSelected) {
      gfx.lineStyle(3.2 * S, 0xf59e0b, 1);
    } else {
      gfx.lineStyle(1.6 * S, 0xcbd5e1, 1);
    }
    gfx.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);
    container.add(gfx);

    const suitIcons = { S: '♠', H: '♥', D: '♦', C: '♣' };
    const rankLabels = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    const isRed = card.s === 'H' || card.s === 'D';
    const hexColor = isRed ? '#dc2626' : '#0f172a';
    const rTxt = rankLabels[card.r] || String(card.r);
    const sTxt = suitIcons[card.s];
    const isRoyal = card.r === 1 || card.r >= 11;

    // تاجی زێڕین لە پشت هێمای ناوەڕاستی کارتە شاهانەکان (A, J, Q, K)
    if (isRoyal) {
      const badge = this.add.graphics();
      badge.fillStyle(isRed ? 0xfee2e2 : 0xf1f5f9, 0.9);
      badge.fillCircle(0, 3 * S, 18 * S);
      badge.lineStyle(1.5 * S, 0xd97706, 0.7);
      badge.strokeCircle(0, 3 * S, 18 * S);
      container.add(badge);
    }

    const topRank = this.add.text(-cw / 2 + 7 * S, -ch / 2 + 5 * S, rTxt, {
      fontFamily: 'Georgia, serif',
      fontSize: `${Math.round(16 * S)}px`,
      fontStyle: 'bold',
      color: hexColor
    });
    const topSuit = this.add.text(-cw / 2 + 7.5 * S, -ch / 2 + 22 * S, sTxt, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(14 * S)}px`,
      color: hexColor
    });

    const centerSuit = this.add.text(0, 3 * S, isRoyal && card.r >= 11 ? `${rTxt}${sTxt}` : sTxt, {
      fontFamily: 'Georgia, serif',
      fontSize: `${Math.round((isRoyal && card.r >= 11 ? 22 : 34) * S)}px`,
      fontStyle: 'bold',
      color: hexColor
    }).setOrigin(0.5);

    const botRank = this.add.text(cw / 2 - 7 * S, ch / 2 - 5 * S, rTxt, {
      fontFamily: 'Georgia, serif',
      fontSize: `${Math.round(16 * S)}px`,
      fontStyle: 'bold',
      color: hexColor
    }).setOrigin(0, 0).setRotation(Math.PI);

    container.add([topRank, topSuit, centerSuit, botRank]);
    container.setSize(cw, ch);
    return container;
  }

  // دروستکردنی کەپسوولی نووسینی زەق و ڕوون (هەرگیز کاڵ نابێت!)
  createCrispPillLabel(x, y, text, accentColor = '#fef08a') {
    const S = KONK_DPR;
    const grp = this.add.container(x, y);
    const txt = this.add.text(0, 0, text, {
      fontFamily: 'Noto Kufi Arabic, sans-serif',
      fontSize: `${Math.round(11.5 * S)}px`,
      fontStyle: 'bold',
      color: accentColor,
      stroke: '#000000',
      strokeThickness: Math.round(3 * S)
    }).setOrigin(0.5);

    const bw = txt.width + 20 * S;
    const bh = txt.height + 8 * S;
    const bg = this.add.graphics();
    bg.fillStyle(0x0c0704, 0.85);
    bg.fillRoundedRect(-bw / 2, -bh / 2, bw, bh, bh / 2);
    bg.lineStyle(1.3 * S, 0xf59e0b, 0.75);
    bg.strokeRoundedRect(-bw / 2, -bh / 2, bw, bh, bh / 2);

    grp.add([bg, txt]);
    return grp;
  }

  renderAll() {
    if (!konkState) return;
    const S = KONK_DPR;
    const w = this.scale.width;
    const h = this.scale.height;

    this.tableLayer.removeAll(true);
    this.meldsLayer.removeAll(true);
    this.handLayer.removeAll(true);
    this.meldZones = [];

    const myHand = konkMyRole === 'p1' ? konkState.p1Hand : konkState.p2Hand;
    const isMyTurn = konkState.turn === konkMyRole;
    const drawPhase = isMyTurn && konkState.phase === 'draw';

    // ١. شوێنی Deck و Discard لە سەرەوەی مێزەکە
    const topRowY = 74 * S;
    const deckX = w / 2 - 66 * S;
    const discardX = w / 2 + 66 * S;

    // کۆمەڵە کارتی ژێر Deck بۆ هەستی ٣ ڕەهەندی
    for (let layer = 2; layer >= 1; layer--) {
      const stackGhost = this.add.image(deckX - layer * 2 * S, topRowY + layer * 2 * S, 'yk_royal_card_back')
        .setDisplaySize(70 * 0.9 * S, 102 * 0.9 * S)
        .setAlpha(0.75);
      this.tableLayer.add(stackGhost);
    }

    const deckCard = this.createPlayingCard(null, 0.9, drawPhase, true);
    deckCard.setPosition(deckX, topRowY);
    deckCard.setInteractive({ useHandCursor: true });
    deckCard.on('pointerup', () => konkanDrawFromDeck());

    if (drawPhase) {
      this.tweens.add({
        targets: deckCard,
        scale: { from: 1, to: 1.04 },
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const deckLbl = this.createCrispPillLabel(deckX, topRowY + 58 * S, `Deck (${konkState.deck.length})`, '#ffffff');
    this.tableLayer.add([deckCard, deckLbl]);

    // شوێنی کارتی فڕێدراو (Discard Pile)
    const dFrame = this.add.graphics();
    dFrame.fillStyle(0x000000, 0.28);
    dFrame.fillRoundedRect(discardX - 35 * S, topRowY - 50 * S, 70 * S, 100 * S, 10 * S);
    dFrame.lineStyle(2.2 * S, 0xfacc15, 0.8);
    dFrame.strokeRoundedRect(discardX - 35 * S, topRowY - 50 * S, 70 * S, 100 * S, 10 * S);
    this.tableLayer.add(dFrame);
    this.discardZone = { x: discardX, y: topRowY, w: 78 * S, h: 106 * S };

    if (konkState.discard.length > 0) {
      const topDiscard = konkState.discard[konkState.discard.length - 1];
      const dSprite = this.createPlayingCard(topDiscard, 0.9, drawPhase, false);
      dSprite.setPosition(discardX, topRowY);
      dSprite.setInteractive({ useHandCursor: true });
      dSprite.on('pointerup', () => konkanTakeDiscard());
      this.tableLayer.add(dSprite);
    }

    const disLbl = this.createCrispPillLabel(discardX, topRowY + 58 * S, 'فڕێدراوەکان', '#fef08a');
    this.tableLayer.add(disLbl);

    // ٢. سێتە داگیراوەکانی سەر مێز (Melds)
    const meldsStartY = 165 * S;
    if (konkState.melds.length === 0) {
      const emptyPill = this.createCrispPillLabel(w / 2, h * 0.61, '✨ سێتە داگیراوەکان لێرە دەردەکەون ✨', '#fef08a');
      this.meldsLayer.add(emptyPill);
    } else {
      let curX = 28 * S;
      let curY = meldsStartY + 34 * S;
      const mScale = 0.62;
      const cardStep = 24 * S;

      konkState.melds.forEach((m, mIdx) => {
        const groupW = (m.cards.length - 1) * cardStep + 46 * S;
        if (curX + groupW > w - 24 * S) {
          curX = 28 * S;
          curY += 72 * S;
        }

        const bg = this.add.graphics();
        bg.fillStyle(0x0c0704, 0.55);
        bg.fillRoundedRect(curX - 8 * S, curY - 34 * S, groupW + 16 * S, 68 * S, 10 * S);
        bg.lineStyle(1.6 * S, 0xfacc15, 0.75);
        bg.strokeRoundedRect(curX - 8 * S, curY - 34 * S, groupW + 16 * S, 68 * S, 10 * S);
        this.meldsLayer.add(bg);

        const zoneRect = new Phaser.Geom.Rectangle(curX - 8 * S, curY - 34 * S, groupW + 16 * S, 68 * S);
        this.meldZones.push({ idx: mIdx, rect: zoneRect });

        m.cards.forEach((c, cIdx) => {
          const cs = this.createPlayingCard(c, mScale, false, false);
          cs.setPosition(curX + 20 * S + cIdx * cardStep, curY);
          cs.setInteractive({ useHandCursor: true });
          cs.on('pointerup', () => konkanLayOffToMeld(mIdx));
          this.meldsLayer.add(cs);
        });

        curX += groupW + 20 * S;
      });
    }

    // ٣. دەستی یاریزان بە شێوەی کەوانەی شاهانە (Curved Royal Fan)
    const count = myHand.length;
    if (count > 0) {
      const availW = w - 64 * S;
      const cardScale = count > 9 ? 0.86 : 0.96;
      const cardW = 70 * S * cardScale;
      const stepX = count > 1 ? Math.min(cardW * 0.76, (availW - cardW) / (count - 1)) : 0;
      const totalSpan = cardW + stepX * (count - 1);
      const startX = (w - totalSpan) / 2 + cardW / 2;
      const baseY = h - 78 * S;
      const midIdx = (count - 1) / 2;

      myHand.forEach((c, idx) => {
        const isSel = konkSelectedIds.includes(c.id);
        const normOffset = count > 1 ? (idx - midIdx) / Math.max(midIdx, 1) : 0;
        const arcDrop = Math.pow(normOffset, 2) * 14 * S;
        const fanAngle = normOffset * 0.14; // خواربوونەوەی نەرمی کەوانەیی

        const restX = startX + idx * stepX;
        const restY = baseY + arcDrop - (isSel ? 22 * S : 0);

        const sprite = this.createPlayingCard(c, cardScale, isSel, false);
        sprite.setPosition(restX, restY);
        sprite.setRotation(isSel ? 0 : fanAngle);
        sprite.setInteractive({ draggable: true, useHandCursor: true });

        let moved = false;
        sprite.on('dragstart', () => {
          moved = false;
          sprite.setDepth(300);
          sprite.setRotation(0);
          sprite.setScale(1.1);
        });

        sprite.on('drag', (pointer, dragX, dragY) => {
          if (Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.x, pointer.y) > 8 * S) {
            moved = true;
          }
          sprite.setPosition(dragX, dragY);
        });

        sprite.on('dragend', (pointer) => {
          if (!moved) {
            toggleKonkanCardSelect(c.id);
            return;
          }

          if (isMyTurn && konkState.phase === 'play' && this.discardZone) {
            const distDiscard = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.discardZone.x, this.discardZone.y);
            if (distDiscard < 62 * S) {
              konkSelectedIds = [c.id];
              this.spawnGoldBurst(this.discardZone.x, this.discardZone.y);
              konkanDiscardSelected();
              return;
            }
          }

          if (isMyTurn && konkState.phase === 'play') {
            for (const mz of this.meldZones) {
              if (mz.rect.contains(pointer.x, pointer.y)) {
                konkSelectedIds = [c.id];
                this.spawnGoldBurst(pointer.x, pointer.y);
                konkanLayOffToMeld(mz.idx);
                return;
              }
            }
          }

          this.renderAll();
        });

        this.handLayer.add(sprite);
      });
    }
  }
}

function initKonkanPhaser() {
  const container = document.getElementById('konkanPhaserStage');
  if (!container) return;

  container.style.height = '490px';

  if (!konkanPhaserGame) {
    container.innerHTML = '';
    const cssW = container.clientWidth || 720;
    const cssH = 490;

    konkanPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: Math.round(cssW * KONK_DPR),
      height: Math.round(cssH * KONK_DPR),
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: Math.round(cssW * KONK_DPR),
        height: Math.round(cssH * KONK_DPR)
      },
      antialias: true,
      parent: 'konkanPhaserStage',
      transparent: true,
      scene: [RoyalKonkanScene]
    });
  } else if (konkanSceneRef) {
    konkanSceneRef.renderAll();
  }
}

function startKonkanBotGame() {
  konkIsOnline = false;
  konkMyRole = 'p1';
  konkSelectedIds = [];
  konkOppInfo = { id: null, name: 'بۆتی کۆنکانی شاهانە', elo: 1300, avatar: '' };
  konkState = initNewKonkanGame(konkCardsPerPlayer);

  document.getElementById('konkanSetupPanel').classList.add('hidden');
  document.getElementById('konkanActiveArea').classList.remove('hidden');
  document.getElementById('konkOppName').textContent = konkOppInfo.name;
  document.getElementById('konkOppElo').textContent = `(${konkOppInfo.elo})`;
  renderKonkanTable();
}

function startKonkanOnlineMatchmaking() {
  document.getElementById('konkanSetupPanel').classList.add('hidden');
  document.getElementById('konkanSearchingPanel').classList.remove('hidden');
  const qBase = db.ref('konkanQueue_' + konkCardsPerPlayer);
  konkQueueRef = qBase.child(playerId);
  konkQueueRef.onDisconnect().remove();

  qBase.once('value', snap => {
    let opp = null;
    snap.forEach(c => { if (c.key !== playerId && !c.val().roomId) opp = { id: c.key, ...c.val() }; });
    if (opp) {
      const rId = 'konk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const st = initNewKonkanGame(konkCardsPerPlayer);
      db.ref('konkanRooms/' + rId).set({
        p1: { id: opp.id, name: opp.name, elo: opp.elo, avatar: opp.avatar || '' },
        p2: { id: playerId, name: playerName, elo: playerProfile.elo.konkan || 1200, avatar: playerAvatarData },
        state: st
      });
      qBase.child(opp.id).update({ roomId: rId });
      joinKonkanOnlineRoom(rId, 'p2', { id: opp.id, name: opp.name, elo: opp.elo, avatar: opp.avatar || '' });
    } else {
      konkQueueRef.set({
        name: playerName,
        elo: playerProfile.elo.konkan || 1200,
        avatar: playerAvatarData,
        roomId: null,
        ts: firebase.database.ServerValue.TIMESTAMP
      });
      konkQueueRef.on('value', qSnap => {
        const val = qSnap.val();
        if (val && val.roomId) {
          const rId = val.roomId;
          konkQueueRef.off();
          konkQueueRef.remove();
          db.ref('konkanRooms/' + rId).once('value', rSnap => {
            const rData = rSnap.val();
            if (rData) joinKonkanOnlineRoom(rId, 'p1', { id: rData.p2.id, name: rData.p2.name, elo: rData.p2.elo, avatar: rData.p2.avatar || '' });
          });
        }
      });
    }
  });
}

function cancelKonkanMatchmaking() {
  if (konkQueueRef) { konkQueueRef.off(); konkQueueRef.remove(); konkQueueRef = null; }
  document.getElementById('konkanSearchingPanel').classList.add('hidden');
  document.getElementById('konkanSetupPanel').classList.remove('hidden');
}

function joinKonkanOnlineRoom(rId, role, opp) {
  document.getElementById('konkanSearchingPanel').classList.add('hidden');
  document.getElementById('konkanActiveArea').classList.remove('hidden');
  konkIsOnline = true;
  konkMyRole = role;
  konkOppInfo = opp;
  konkSelectedIds = [];
  document.getElementById('konkOppName').textContent = opp.name;
  document.getElementById('konkOppElo').textContent = `(${opp.elo})`;

  konkRoomRef = db.ref('konkanRooms/' + rId);
  konkRoomRef.on('value', snap => {
    const data = snap.val();
    if (!data || !data.state) return;
    konkState = {
      ...data.state,
      deck: data.state.deck || [],
      discard: data.state.discard || [],
      p1Hand: data.state.p1Hand || [],
      p2Hand: data.state.p2Hand || [],
      melds: data.state.melds || []
    };
    renderKonkanTable();
    if (konkState.winner) {
      const iWon = konkState.winner === konkMyRole;
      finishKonkanMatch(iWon, iWon ? 'کۆنکان! یارییەکەت بردەوە 🏆' : 'بەرامبەر کۆنکانی کرد!');
    }
  });
}

function exitKonkanGame() {
  if (konkRoomRef) { konkRoomRef.off(); konkRoomRef = null; }
  konkState = null;
  konkSelectedIds = [];
  document.getElementById('konkanActiveArea').classList.add('hidden');
  document.getElementById('konkanSetupPanel').classList.remove('hidden');
}

function validateKonkanMeld(cards) {
  if (!cards || cards.length < 3) return null;
  if (cards.length <= 4) {
    const sameRank = cards.every(c => c.r === cards[0].r);
    const uniqueSuits = new Set(cards.map(c => c.s)).size === cards.length;
    if (sameRank && uniqueSuits) return { type: 'set', cards: [...cards] };
  }
  const sameSuit = cards.every(c => c.s === cards[0].s);
  if (sameSuit) {
    const sorted = [...cards].sort((a, b) => a.r - b.r);
    let isSeq = true;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].r !== sorted[i - 1].r + 1) { isSeq = false; break; }
    }
    if (isSeq) return { type: 'run', cards: sorted };
    const hasAce = sorted.some(c => c.r === 1);
    if (hasAce) {
      const highSorted = cards.map(c => ({ ...c, sortR: c.r === 1 ? 14 : c.r })).sort((a, b) => a.sortR - b.sortR);
      let isHighSeq = true;
      for (let i = 1; i < highSorted.length; i++) {
        if (highSorted[i].sortR !== highSorted[i - 1].sortR + 1) { isHighSeq = false; break; }
      }
      if (isHighSeq) return { type: 'run', cards: highSorted.map(({ r, s, id }) => ({ r, s, id })) };
    }
  }
  return null;
}

function renderKonkanTable() {
  if (!konkState) return;
  const myHand = konkMyRole === 'p1' ? konkState.p1Hand : konkState.p2Hand;
  const oppHand = konkMyRole === 'p1' ? konkState.p2Hand : konkState.p1Hand;
  const isMyTurn = konkState.turn === konkMyRole;

  const oppCountEl = document.getElementById('konkOppCountBadge');
  const myCountEl = document.getElementById('konkMyCount');
  const logEl = document.getElementById('konkActionLog');
  const banner = document.getElementById('konkTurnBanner');

  if (oppCountEl) oppCountEl.textContent = `${oppHand.length} کارت`;
  if (myCountEl) myCountEl.textContent = myHand.length;
  if (logEl) logEl.textContent = konkState.log || '';

  if (banner) {
    if (isMyTurn) {
      banner.textContent = konkState.phase === 'draw'
        ? '🟢 نۆرەی تۆیە: کلیک لە Deck یان کارتی فڕێدراو بکە'
        : '🟡 سێت دابگرە یان کارتێک فڕێ بدە';
      banner.className = 'px-3.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400 text-emerald-200 text-xs font-black shadow';
    } else {
      banner.textContent = '⏳ چاوەڕێی جوڵەی بەرامبەرین...';
      banner.className = 'px-3.5 py-1 rounded-full bg-amber-500/25 border border-amber-400 text-amber-100 text-xs font-bold';
    }
  }

  setTimeout(initKonkanPhaser, 30);
}

function toggleKonkanCardSelect(cardId) {
  if (konkSelectedIds.includes(cardId)) konkSelectedIds = konkSelectedIds.filter(id => id !== cardId);
  else konkSelectedIds.push(cardId);
  if (typeof playChessSound === 'function') playChessSound('move');
  renderKonkanTable();
}

function konkanSortHand(mode) {
  if (!konkState) return;
  const key = konkMyRole === 'p1' ? 'p1Hand' : 'p2Hand';
  if (mode === 'rank') {
    konkState[key].sort((a, b) => a.r - b.r || a.s.localeCompare(b.s));
  } else {
    konkState[key].sort((a, b) => a.s.localeCompare(b.s) || a.r - b.r);
  }
  renderKonkanTable();
}

function konkanDrawFromDeck() {
  if (!konkState || konkState.turn !== konkMyRole || konkState.phase !== 'draw') return;
  if (konkState.deck.length === 0) {
    if (konkState.discard.length <= 1) {
      finishKonkanMatch(true, 'کارتەکان تەواو بوون و یاری یەکسان بوو!');
      return;
    }
    const top = konkState.discard.pop();
    konkState.deck = konkState.discard.sort(() => Math.random() - 0.5);
    konkState.discard = [top];
  }
  const card = konkState.deck.pop();
  const key = konkMyRole === 'p1' ? 'p1Hand' : 'p2Hand';
  konkState[key].push(card);
  konkState.phase = 'play';
  konkState.mustMeldCardId = null;
  konkState.log = `${playerName} کارتێکی لە Deck ڕاکێشا`;
  if (typeof playChessSound === 'function') playChessSound('move');
  syncOrRenderKonkan();
}

function konkanTakeDiscard() {
  if (!konkState || konkState.turn !== konkMyRole || konkState.phase !== 'draw') return;
  if (konkState.discard.length === 0) return;
  const topCard = konkState.discard[konkState.discard.length - 1];
  const key = konkMyRole === 'p1' ? 'p1Hand' : 'p2Hand';
  const testHand = [...konkState[key], topCard];

  let canUse = false;
  for (let i = 0; i < testHand.length; i++) {
    for (let j = i + 1; j < testHand.length; j++) {
      for (let k = j + 1; k < testHand.length; k++) {
        const trio = [testHand[i], testHand[j], testHand[k]];
        if (trio.some(c => c.id === topCard.id) && validateKonkanMeld(trio)) { canUse = true; break; }
      }
      if (canUse) break;
    }
    if (canUse) break;
  }
  if (!canUse) {
    for (const m of konkState.melds) {
      if (validateKonkanMeld([...m.cards, topCard])) { canUse = true; break; }
    }
  }
  if (!canUse) {
    alert('بەپێی یاسای کۆنکان، تەنها کاتێک دەتوانیت کارتی فڕێدراو هەڵبگریتەوە کە یەکسەر سێتێکی پێ دابگریت!');
    return;
  }

  konkState.discard.pop();
  konkState[key].push(topCard);
  konkState.phase = 'play';
  konkState.mustMeldCardId = topCard.id;
  konkSelectedIds = [topCard.id];
  konkState.log = `${playerName} کارتی فڕێدراوی هەڵگرتەوە (پێویستە دایبگرێت)`;
  if (typeof playChessSound === 'function') playChessSound('capture');
  syncOrRenderKonkan();
}

function konkanLayDownMeld() {
  if (!konkState || konkState.turn !== konkMyRole || konkState.phase !== 'play') return;
  const key = konkMyRole === 'p1' ? 'p1Hand' : 'p2Hand';
  const chosenCards = konkState[key].filter(c => konkSelectedIds.includes(c.id));
  const validMeld = validateKonkanMeld(chosenCards);
  if (!validMeld) {
    alert('کارتە هەڵبژێردراوەکان سێت (٣-٤ هاوژمارە) یان ڕیز (٣+ یەک جۆر بە دوای یەکدا) نین!');
    return;
  }

  konkState[key] = konkState[key].filter(c => !konkSelectedIds.includes(c.id));
  konkState.melds.push(validMeld);
  if (konkState.mustMeldCardId && konkSelectedIds.includes(konkState.mustMeldCardId)) {
    konkState.mustMeldCardId = null;
  }
  konkSelectedIds = [];
  konkState.log = `${playerName} سێتێکی داگرتە سەر مێز!`;
  if (typeof playChessSound === 'function') playChessSound('domino');
  if (konkanSceneRef) konkanSceneRef.spawnGoldBurst(konkanSceneRef.scale.width / 2, konkanSceneRef.scale.height * 0.45);

  if (konkState[key].length === 0) {
    konkState.winner = konkMyRole;
    syncOrRenderKonkan();
    if (!konkIsOnline) finishKonkanMatch(true, 'کۆنکان! هەموو کارتەکانت داگرت 🏆');
    return;
  }
  syncOrRenderKonkan();
}

function konkanLayOffToMeld(meldIdx) {
  if (!konkState || konkState.turn !== konkMyRole || konkState.phase !== 'play') return;
  if (konkSelectedIds.length !== 1) {
    alert('تەنها ١ کارت هەڵبژێرە بۆ زیادکردن بۆ سەر ئەم سێتە');
    return;
  }
  const key = konkMyRole === 'p1' ? 'p1Hand' : 'p2Hand';
  const card = konkState[key].find(c => c.id === konkSelectedIds[0]);
  const targetMeld = konkState.melds[meldIdx];
  const updated = validateKonkanMeld([...targetMeld.cards, card]);
  if (!updated) {
    alert('ئەم کارتە ناگونجێت لەگەڵ ئەم سێتە!');
    return;
  }

  konkState.melds[meldIdx] = updated;
  konkState[key] = konkState[key].filter(c => c.id !== card.id);
  if (konkState.mustMeldCardId === card.id) konkState.mustMeldCardId = null;
  konkSelectedIds = [];
  konkState.log = `${playerName} کارتێکی خستە سەر سێتێکی سەر مێز`;
  if (typeof playChessSound === 'function') playChessSound('domino');

  if (konkState[key].length === 0) {
    konkState.winner = konkMyRole;
    syncOrRenderKonkan();
    if (!konkIsOnline) finishKonkanMatch(true, 'کۆنکان! هەموو کارتەکانت تەواو کرد 🏆');
    return;
  }
  syncOrRenderKonkan();
}

function konkanDiscardSelected() {
  if (!konkState || konkState.turn !== konkMyRole || konkState.phase !== 'play') return;
  if (konkState.mustMeldCardId) {
    alert('تۆ کارتی فڕێدراوت هەڵگرتووەتەوە؛ دەبێت سەرەتا سێتەکەی پێ دابگریت!');
    return;
  }
  if (konkSelectedIds.length !== 1) {
    alert('تەنها ١ کارت دیاری بکە بۆ فڕێدان!');
    return;
  }
  const key = konkMyRole === 'p1' ? 'p1Hand' : 'p2Hand';
  const oppRole = konkMyRole === 'p1' ? 'p2' : 'p1';
  const idx = konkState[key].findIndex(c => c.id === konkSelectedIds[0]);
  if (idx === -1) return;

  const discarded = konkState[key].splice(idx, 1)[0];
  konkState.discard.push(discarded);
  konkSelectedIds = [];
  if (typeof playChessSound === 'function') playChessSound('move');

  if (konkState[key].length === 0) {
    konkState.winner = konkMyRole;
    syncOrRenderKonkan();
    if (!konkIsOnline) finishKonkanMatch(true, 'کۆنکان! دوایین کارتت فڕێ دا و بردتەوە 🏆');
    return;
  }

  konkState.turn = oppRole;
  konkState.phase = 'draw';
  konkState.log = `${playerName} کارتێکی فڕێ دا`;
  syncOrRenderKonkan();
  if (!konkIsOnline && konkState.turn === 'p2') setTimeout(runKonkanBotTurn, 850);
}

function syncOrRenderKonkan() {
  if (konkIsOnline && konkRoomRef) konkRoomRef.child('state').set(konkState);
  else renderKonkanTable();
}

function runKonkanBotTurn() {
  if (!konkState || konkIsOnline || konkState.turn !== 'p2' || konkState.winner) return;
  if (konkState.deck.length === 0 && konkState.discard.length > 1) {
    const top = konkState.discard.pop();
    konkState.deck = konkState.discard.sort(() => Math.random() - 0.5);
    konkState.discard = [top];
  }
  if (konkState.deck.length > 0) konkState.p2Hand.push(konkState.deck.pop());

  let foundMeld = true;
  while (foundMeld && konkState.p2Hand.length >= 3) {
    foundMeld = false;
    const h = konkState.p2Hand;
    for (let i = 0; i < h.length && !foundMeld; i++) {
      for (let j = i + 1; j < h.length && !foundMeld; j++) {
        for (let k = j + 1; k < h.length && !foundMeld; k++) {
          const m = validateKonkanMeld([h[i], h[j], h[k]]);
          if (m) {
            const ids = new Set([h[i].id, h[j].id, h[k].id]);
            konkState.p2Hand = konkState.p2Hand.filter(c => !ids.has(c.id));
            konkState.melds.push(m);
            foundMeld = true;
            if (typeof playChessSound === 'function') playChessSound('domino');
          }
        }
      }
    }
  }

  if (konkState.p2Hand.length === 0) {
    konkState.winner = 'p2';
    renderKonkanTable();
    finishKonkanMatch(false, 'بۆت کۆنکانی کرد!');
    return;
  }

  konkState.p2Hand.sort((a, b) => b.r - a.r);
  const botDiscard = konkState.p2Hand.shift();
  konkState.discard.push(botDiscard);
  if (typeof playChessSound === 'function') playChessSound('move');

  if (konkState.p2Hand.length === 0) {
    konkState.winner = 'p2';
    renderKonkanTable();
    finishKonkanMatch(false, 'بۆت دوایین کارتی فڕێ دا و کۆنکانی کرد!');
    return;
  }

  konkState.turn = 'p1';
  konkState.phase = 'draw';
  konkState.log = 'بۆت کارتێکی فڕێ دا — نۆرەی تۆیە';
  renderKonkanTable();
}

function finishKonkanMatch(iWon, reason) {
  if (konkRoomRef) { konkRoomRef.off(); konkRoomRef = null; }
  if (typeof playChessSound === 'function') playChessSound('end');
  document.getElementById('modalIcon').textContent = iWon ? '🏆' : '🃏';
  document.getElementById('modalTitle').textContent = iWon ? 'کۆنکان!' : 'کۆتایی یاری';
  document.getElementById('modalSubtitle').textContent = reason;
  if (konkIsOnline) {
    document.getElementById('eloChangeBox').classList.remove('hidden');
    const res = calculateAndSaveElo('konkan', konkOppInfo.elo, iWon ? 1 : 0);
    document.getElementById('eloChangeText').textContent = `${res.oldElo} ➔ ${res.newElo} (${res.delta >= 0 ? '+' : ''}${res.delta})`;
  } else {
    document.getElementById('eloChangeBox').classList.add('hidden');
  }
  document.getElementById('konkanActiveArea').classList.add('hidden');
  document.getElementById('konkanSetupPanel').classList.remove('hidden');
  document.getElementById('gameOverModal').classList.remove('hidden');
}