// ========================================================
// YARI KURDI - ULTRA HD ROYAL KURDISH TEAHOUSE DOMINO 101
// ========================================================

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

function playTeahouseWoodClack() {
  if (typeof soundEnabled !== 'undefined' && !soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(165, now + 0.065);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.075);
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
    this.bgGfx = this.add.graphics();
    this.folkloreLayer = this.add.container(0, 0);
    this.boardLayer = this.add.container(0, 0);
    this.slotsLayer = this.add.container(0, 0);
    this.handLayer = this.add.container(0, 0);
    this.overlayLayer = this.add.container(0, 0);

    this.drawFolkloreTeahouseTable();
    this.renderAll();
  }

  // کێشانەوەی مێزی چایخانەی فۆلکلۆری کوردی بە دیقەی بەرز
  drawFolkloreTeahouseTable() {
    const w = this.scale.width;
    const h = this.scale.height;
    const tableH = h - 126;
    this.bgGfx.clear();
    this.folkloreLayer.removeAll(true);

    // ١. پاشبنەمای دارگوێزی تۆخی چایخانە
    this.bgGfx.fillStyle(0x1e0f07, 1);
    this.bgGfx.fillRect(0, 0, w, h);

    // تەختە دارینەکانی مێزەکە
    const plankCount = 7;
    const plankW = (w - 16) / plankCount;
    for (let i = 0; i < plankCount; i++) {
      const shade = i % 2 === 0 ? 0x3b2010 : 0x321a0c;
      this.bgGfx.fillStyle(shade, 1);
      this.bgGfx.fillRect(8 + i * plankW, 6, plankW - 1.5, tableH - 8);
    }

    // سێبەری گەرم لە ناوەڕاستی مێزەکە (وەک ڕووناکی فانۆسی چایخانە)
    this.bgGfx.fillStyle(0xd97706, 0.11);
    this.bgGfx.fillCircle(w / 2, tableH / 2, w * 0.44);

    // ٢. چوارچێوەی زێڕین و نەخشی جاجمی فۆلکلۆری لە دەوری مێزەکە
    this.bgGfx.lineStyle(3, 0xd97706, 0.85);
    this.bgGfx.strokeRoundedRect(8, 6, w - 16, tableH - 8, 18);

    // نەخشی فەرشی کوردی لە سەرەوە و خوارەوەی مێزەکە
    const rugColors = [0xdc2626, 0xfacc15, 0x059669, 0xf8fafc];
    const segW = 14;
    for (let x = 18; x < w - 26; x += segW) {
      const col = rugColors[Math.floor(x / segW) % rugColors.length];
      this.bgGfx.fillStyle(col, 0.75);
      this.bgGfx.fillRect(x, 9, segW - 2, 4);
      this.bgGfx.fillRect(x, tableH - 9, segW - 2, 4);
    }

    // ٣. ئاڵای کوردستان و خۆرە زێڕینەکە لە ناوەڕاستی مێزی چایخانەکە (بە شێوەیەکی شاهانە)
    const flagW = Math.min(w * 0.56, 210);
    const flagH = flagW * 0.62;
    const fx = (w - flagW) / 2;
    const fy = (tableH - flagH) / 2;

    const flagGfx = this.add.graphics();
    // سێبەری ئاڵاکە
    flagGfx.fillStyle(0x000000, 0.25);
    flagGfx.fillRoundedRect(fx - 3, fy - 3, flagW + 6, flagH + 6, 10);

    // سوور، سپی، سەوز
    flagGfx.fillStyle(0xed2939, 0.24);
    flagGfx.fillRect(fx, fy, flagW, flagH / 3);
    flagGfx.fillStyle(0xffffff, 0.22);
    flagGfx.fillRect(fx, fy + flagH / 3, flagW, flagH / 3);
    flagGfx.fillStyle(0x278e43, 0.24);
    flagGfx.fillRect(fx, fy + (flagH * 2) / 3, flagW, flagH / 3);

    // چوارچێوەی زێڕینی ناسک بۆ ئاڵاکە
    flagGfx.lineStyle(1.5, 0xfacc15, 0.35);
    flagGfx.strokeRect(fx, fy, flagW, flagH);

    // خۆری کوردستان (٢١ تیشک) لە ناوەڕاستی ئاڵاکە
    const cx = w / 2;
    const cy = tableH / 2;
    const innerR = flagH * 0.14;
    const outerR = flagH * 0.28;
    flagGfx.fillStyle(0xfebd11, 0.42);
    flagGfx.beginPath();
    const rays = 21;
    for (let i = 0; i < rays * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / rays - Math.PI / 2;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) flagGfx.moveTo(px, py);
      else flagGfx.lineTo(px, py);
    }
    flagGfx.closePath();
    flagGfx.fillPath();
    flagGfx.fillCircle(cx, cy, innerR * 0.92);

    this.folkloreLayer.add(flagGfx);

    // ٤. وردەکاریی فۆلکلۆری چایخانە لە گۆشەکانی مێزەکە (ئیستکانە چای کەمەرباریک و قەندان)
    const teaLeft = this.add.text(22, 18, '🫖', { fontSize: '20px' }).setAlpha(0.55);
    const teaRight = this.add.text(w - 44, tableH - 36, '☕', { fontSize: '19px' }).setAlpha(0.55);
    this.folkloreLayer.add([teaLeft, teaRight]);

    // ٥. پانێڵی خوارەوە بۆ دەستی یاریزان (تەختەی دارگوێزی شاهانە)
    this.bgGfx.fillStyle(0x120904, 0.92);
    this.bgGfx.fillRoundedRect(8, h - 116, w - 16, 110, 18);
    this.bgGfx.lineStyle(2, 0xf59e0b, 0.55);
    this.bgGfx.strokeRoundedRect(8, h - 116, w - 16, 110, 18);
  }

  // دروستکردنی کاشیی عاجی ٣ ڕەهەندی بە دیقەی بەرز
  createDominoTileContainer(a, b, orientation = 'vertical', scale = 1, playable = false) {
    const container = this.add.container(0, 0);
    const isHoriz = orientation === 'horizontal';
    const tileW = (isHoriz ? 70 : 38) * scale;
    const tileH = (isHoriz ? 38 : 70) * scale;
    const rad = 8 * scale;

    const gfx = this.add.graphics();

    // سێبەری قووڵ و بنکەی کاشییەکە (3D Thickness)
    gfx.fillStyle(0x000000, 0.55);
    gfx.fillRoundedRect(-tileW / 2 + 2.5, -tileH / 2 + 5, tileW, tileH, rad);

    gfx.fillStyle(0xb8a382, 1);
    gfx.fillRoundedRect(-tileW / 2, -tileH / 2 + 2.5, tileW, tileH, rad);

    // ڕووی سەرەوەی عاجی (Ivory Surface)
    gfx.fillStyle(0xfffdf7, 1);
    gfx.fillRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

    // بریقەی سپی لە لێواری سەرەوە
    gfx.fillStyle(0xffffff, 0.75);
    gfx.fillRoundedRect(-tileW / 2 + 2, -tileH / 2 + 1.5, tileW - 4, tileH * 0.22, rad * 0.7);

    // چوارچێوەی زێڕین بۆ ئەو کاشییانەی دەجوڵێن
    if (playable) {
      gfx.lineStyle(2.5, 0xfacc15, 1);
    } else {
      gfx.lineStyle(1.4, 0xd6c5a9, 1);
    }
    gfx.strokeRoundedRect(-tileW / 2, -tileH / 2, tileW, tileH, rad);

    // هێڵ و بزماری زێڕینی ناوەڕاست
    gfx.lineStyle(1.8, 0xb45309, 0.9);
    if (isHoriz) {
      gfx.beginPath();
      gfx.moveTo(0, -tileH * 0.36);
      gfx.lineTo(0, tileH * 0.36);
      gfx.strokePath();
    } else {
      gfx.beginPath();
      gfx.moveTo(-tileW * 0.36, 0);
      gfx.lineTo(tileW * 0.36, 0);
      gfx.strokePath();
    }
    gfx.fillStyle(0xf59e0b, 1);
    gfx.fillCircle(0, 0, 2.8 * scale);
    gfx.fillStyle(0xfef08a, 1);
    gfx.fillCircle(-0.6 * scale, -0.6 * scale, 1.1 * scale);

    // خاڵە ڕەنگاوڕەنگەکان بە قووڵییەوە
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
      const colorMap = {
        1: 0xdc2626,
        6: 0xdc2626,
        4: 0x0284c7,
        5: 0x0284c7,
        2: 0x059669,
        3: 0x059669
      };
      const pts = pipMap[val] || [];
      const col = colorMap[val] || 0x1e293b;
      const spread = halfSize * 0.56;
      const r = (val === 1 ? 3.8 : 2.8) * scale;

      pts.forEach(([ox, oy]) => {
        const px = cx + ox * spread;
        const py = cy + oy * spread;
        gfx.fillStyle(0x000000, 0.22);
        gfx.fillCircle(px, py + 0.8 * scale, r);
        gfx.fillStyle(col, 1);
        gfx.fillCircle(px, py, r);
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
    this.boardLayer.removeAll(true);
    this.slotsLayer.removeAll(true);
    this.handLayer.removeAll(true);
    this.overlayLayer.removeAll(true);
    this.leftSlotZone = null;
    this.rightSlotZone = null;
    this.centerSlotZone = null;

    const w = this.scale.width;
    const h = this.scale.height;
    const boardCenterY = (h - 126) / 2;

    if (teahouseDom.chain.length === 0) {
      const hint = teahouseDom.firstMoveRule && teahouseDom.requiredOpeningDouble !== null
        ? `گەورەترین جووت (${teahouseDom.requiredOpeningDouble}-${teahouseDom.requiredOpeningDouble}) ڕابکێشە سەر مێزەکە`
        : 'یەکەم پوول ڕابکێشە سەر مێزەکە 🁣';

      const txt = this.add.text(w / 2, boardCenterY, hint, {
        fontFamily: 'Noto Kufi Arabic, sans-serif',
        fontSize: '13px',
        fontStyle: 'bold',
        color: '#fef3c7',
        backgroundColor: 'rgba(15, 23, 42, 0.88)',
        padding: { x: 14, y: 10 },
        align: 'center',
        wordWrap: { width: w - 64 }
      }).setOrigin(0.5);
      this.boardLayer.add(txt);

      this.centerSlotZone = { x: w / 2, y: boardCenterY, w: 125, h: 90 };
    } else {
      const count = teahouseDom.chain.length;
      const tileScale = count > 14 ? 0.66 : (count > 8 ? 0.78 : 0.9);
      const maxRowWidth = w - 84;

      const rows = [[]];
      let curRowW = 0;

      teahouseDom.chain.forEach((t, idx) => {
        const isDbl = t.a === t.b;
        const tw = (isDbl ? 38 : 70) * tileScale + 4;
        if (curRowW + tw > maxRowWidth && rows[rows.length - 1].length > 0) {
          rows.push([]);
          curRowW = 0;
        }
        rows[rows.length - 1].push({ t, idx, isDbl, tw });
        curRowW += tw;
      });

      const rowHeight = 64 * tileScale;
      const totalH = rows.length * rowHeight;
      const startY = Math.max(46, boardCenterY - totalH / 2 + rowHeight / 2);

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
        this.leftSlotZone = { x: Math.max(38, firstTilePos.x - 32), y: firstTilePos.y, w: 62, h: 56 };
      }
      if (lastTilePos) {
        const targetX = lastTilePos.isRev ? Math.max(38, lastTilePos.x - 75) : Math.min(w - 38, lastTilePos.x + 32);
        this.rightSlotZone = { x: targetX, y: lastTilePos.y, w: 62, h: 56 };
      }
    }

    // خانە درەوشاوەکانی سەر مێز کاتێک کاشییەک بە پەنجە ڕادەکێشرێت
    if (teahouseDom.activeDragIdx !== null && teahouseDom.turn === 'player' && !teahouseDom.roundOver) {
      const draggedTile = teahouseDom.myHand[teahouseDom.activeDragIdx];
      if (draggedTile) {
        const fit = checkTeahouseTileFit(draggedTile);
        const drawDropTarget = (zone, label) => {
          if (!zone) return;
          const g = this.add.graphics();
          g.fillStyle(0x10b981, 0.34);
          g.fillRoundedRect(zone.x - zone.w / 2, zone.y - zone.h / 2, zone.w, zone.h, 12);
          g.lineStyle(2.5, 0xfacc15, 0.95);
          g.strokeRoundedRect(zone.x - zone.w / 2, zone.y - zone.h / 2, zone.w, zone.h, 12);
          this.slotsLayer.add(g);

          const lbl = this.add.text(zone.x, zone.y, label, {
            fontFamily: 'Noto Kufi Arabic, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#fef08a'
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
      const maxHandWidth = w - 26;
      const handScale = handCount > 8 ? Math.max(0.68, maxHandWidth / (handCount * 42)) : 0.96;
      const stepX = Math.min(45 * handScale, maxHandWidth / handCount);
      const totalHandW = stepX * handCount;
      const startHandX = (w - totalHandW) / 2 + stepX / 2;
      const baseHandY = h - 62;

      teahouseDom.myHand.forEach((tile, idx) => {
        const fit = (teahouseDom.turn === 'player' && !teahouseDom.roundOver)
          ? checkTeahouseTileFit(tile)
          : { left: false, right: false };
        const canPlay = fit.left || fit.right;
        const yPos = canPlay ? baseHandY - 10 : baseHandY;

        const card = this.createDominoTileContainer(tile.a, tile.b, 'vertical', handScale, canPlay);
        card.setPosition(startHandX + idx * stepX, yPos);
        if (!canPlay) card.setAlpha(0.76);

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
              if (dropY < h - 115) {
                executePlayerTeahouseMove(idx, 'right');
                return;
              }
            } else {
              const distLeft = (fit.left && this.leftSlotZone)
                ? Phaser.Math.Distance.Between(dropX, dropY, this.leftSlotZone.x, this.leftSlotZone.y)
                : 9999;
              const distRight = (fit.right && this.rightSlotZone)
                ? Phaser.Math.Distance.Between(dropX, dropY, this.rightSlotZone.x, this.rightSlotZone.y)
                : 9999;

              if (dropY < h - 110) {
                if (fit.left && fit.right) {
                  executePlayerTeahouseMove(idx, distLeft <= distRight ? 'left' : 'right');
                  return;
                } else if (fit.left) {
                  executePlayerTeahouseMove(idx, 'left');
                  return;
                } else if (fit.right) {
                  executePlayerTeahouseMove(idx, 'right');
                  return;
                }
              }
            }

            this.renderAll();
          });

          card.on('pointerup', (pointer) => {
            if (Phaser.Math.Distance.Between(pointer.downX, pointer.downY, pointer.upX, pointer.upY) < 8) {
              if (teahouseDom.chain.length === 0) {
                executePlayerTeahouseMove(idx, 'right');
              } else if (fit.left && !fit.right) {
                executePlayerTeahouseMove(idx, 'left');
              } else if (fit.right && !fit.left) {
                executePlayerTeahouseMove(idx, 'right');
              } else if (fit.left && fit.right && teahouseDom.leftEnd === teahouseDom.rightEnd) {
                executePlayerTeahouseMove(idx, 'right');
              }
            }
          });
        }

        this.handLayer.add(card);
      });
    }

    if (teahouseDom.roundBannerText) {
      const box = this.add.text(w / 2, boardCenterY, teahouseDom.roundBannerText, {
        fontFamily: 'Noto Kufi Arabic, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#fef08a',
        backgroundColor: '#0f172a',
        padding: { x: 16, y: 12 },
        align: 'center',
        wordWrap: { width: w - 44 }
      }).setOrigin(0.5);
      this.overlayLayer.add(box);
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
    const w = stage.clientWidth || 390;
    const h = Math.max(stage.clientHeight || 430, 420);

    dominoPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: w,
      height: h,
      resolution: Math.max(window.devicePixelRatio || 2, 2),
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
    setTimeout(startTeahouseDominoRound, 2300);
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