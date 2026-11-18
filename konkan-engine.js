// ========================================================
// YARI KURDI - 4K PRO KONKAN ENGINE (PHASER 3 + ONLINE)
// ========================================================

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
  }

  create() {
    konkanSceneRef = this;
    this.bgGfx = this.add.graphics();
    this.tableLayer = this.add.container(0, 0);
    this.meldsLayer = this.add.container(0, 0);
    this.handLayer = this.add.container(0, 0);
    this.dragLayer = this.add.container(0, 0);

    this.drawRoyalTable();
    this.renderAll();
  }

  drawRoyalTable() {
    const S = KONK_DPR;
    const w = this.scale.width;
    const h = this.scale.height;
    this.bgGfx.clear();

    // پاشبنەمای مەخمەڵیی زمڕودی و چوارچێوەی دارگوێزی شاهانە
    this.bgGfx.fillStyle(0x180c05, 1);
    this.bgGfx.fillRect(0, 0, w, h);

    this.bgGfx.fillStyle(0x064e3b, 0.94);
    this.bgGfx.fillRoundedRect(8 * S, 6 * S, w - 16 * S, h - 12 * S, 20 * S);

    this.bgGfx.fillStyle(0x10b981, 0.12);
    this.bgGfx.fillCircle(w / 2, h * 0.42, w * 0.42);

    this.bgGfx.lineStyle(2.5 * S, 0xf59e0b, 0.85);
    this.bgGfx.strokeRoundedRect(8 * S, 6 * S, w - 16 * S, h - 12 * S, 20 * S);

    // نەخشی ئاڵای کوردستان لە ناوەڕاستی مێزەکە
    const flagW = Math.min(w * 0.36, 160 * S);
    const flagH = flagW * 0.6;
    const fx = (w - flagW) / 2;
    const fy = h * 0.44 - flagH / 2;

    this.bgGfx.fillStyle(0xed2939, 0.16);
    this.bgGfx.fillRect(fx, fy, flagW, flagH / 3);
    this.bgGfx.fillStyle(0xffffff, 0.14);
    this.bgGfx.fillRect(fx, fy + flagH / 3, flagW, flagH / 3);
    this.bgGfx.fillStyle(0x278e43, 0.16);
    this.bgGfx.fillRect(fx, fy + (flagH * 2) / 3, flagW, flagH / 3);

    this.bgGfx.fillStyle(0xfacc15, 0.28);
    this.bgGfx.fillCircle(w / 2, h * 0.44, flagH * 0.18);

    // هێڵی جیاکەرەوەی دەستی یاریزان لە خوارەوە
    this.bgGfx.fillStyle(0x03261d, 0.72);
    this.bgGfx.fillRoundedRect(12 * S, h - 134 * S, w - 24 * S, 124 * S, 16 * S);
    this.bgGfx.lineStyle(1.5 * S, 0xfacc15, 0.4);
    this.bgGfx.strokeRoundedRect(12 * S, h - 134 * S, w - 24 * S, 124 * S, 16 * S);
  }

  createPlayingCard(card, scale = 1, isSelected = false, isFaceDown = false) {
    const S = KONK_DPR * scale;
    const cw = 64 * S;
    const ch = 94 * S;
    const rad = 8 * S;
    const container = this.add.container(0, 0);
    const gfx = this.add.graphics();

    // سێبەر
    gfx.fillStyle(0x000000, 0.48);
    gfx.fillRoundedRect(-cw / 2 + 2.5 * S, -ch / 2 + 4.5 * S, cw, ch, rad);

    if (isFaceDown) {
      gfx.fillStyle(0x1e293b, 1);
      gfx.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);
      gfx.fillStyle(0x991b1b, 0.85);
      gfx.fillRoundedRect(-cw / 2 + 4 * S, -ch / 2 + 4 * S, cw - 8 * S, ch - 8 * S, rad * 0.7);
      gfx.lineStyle(1.8 * S, 0xfacc15, 0.9);
      gfx.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);
      container.add(gfx);
      container.setSize(cw, ch);
      return container;
    }

    // ڕووی سپی کاغەزی شاهانە
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);

    if (isSelected) {
      gfx.lineStyle(3 * S, 0xfacc15, 1);
    } else {
      gfx.lineStyle(1.4 * S, 0xcbd5e1, 1);
    }
    gfx.strokeRoundedRect(-cw / 2, -ch / 2, cw, ch, rad);
    container.add(gfx);

    const suitIcons = { S: '♠', H: '♥', D: '♦', C: '♣' };
    const rankLabels = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    const isRed = card.s === 'H' || card.s === 'D';
    const hexColor = isRed ? '#dc2626' : '#0f172a';
    const rTxt = rankLabels[card.r] || String(card.r);
    const sTxt = suitIcons[card.s];

    const topRank = this.add.text(-cw / 2 + 6 * S, -ch / 2 + 4 * S, rTxt, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(14 * S)}px`,
      fontStyle: 'bold',
      color: hexColor
    });
    const topSuit = this.add.text(-cw / 2 + 6 * S, -ch / 2 + 19 * S, sTxt, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(13 * S)}px`,
      color: hexColor
    });
    const centerSuit = this.add.text(0, 2 * S, sTxt, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(28 * S)}px`,
      color: hexColor
    }).setOrigin(0.5);

    const botRank = this.add.text(cw / 2 - 6 * S, ch / 2 - 4 * S, rTxt, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${Math.round(14 * S)}px`,
      fontStyle: 'bold',
      color: hexColor
    }).setOrigin(0, 0).setRotation(Math.PI);

    container.add([topRank, topSuit, centerSuit, botRank]);
    container.setSize(cw, ch);
    return container;
  }

  renderAll() {
    if (!konkState) return;
    const S = KONK_DPR;
    const w = this.scale.width;
    const h = this.scale.height;

    this.tableLayer.removeAll(true);
    this.meldsLayer.removeAll(true);
    this.handLayer.removeAll(true);
    this.dragLayer.removeAll(true);
    this.meldZones = [];

    const myHand = konkMyRole === 'p1' ? konkState.p1Hand : konkState.p2Hand;
    const isMyTurn = konkState.turn === konkMyRole;

    // ١. شوێنی Deck و Discard لە بەشی سەرەوەی مێزەکە
    const topRowY = 66 * S;
    const deckX = w / 2 - 58 * S;
    const discardX = w / 2 + 58 * S;

    const deckCard = this.createPlayingCard(null, 0.88, isMyTurn && konkState.phase === 'draw', true);
    deckCard.setPosition(deckX, topRowY);
    deckCard.setInteractive({ useHandCursor: true });
    deckCard.on('pointerup', () => konkanDrawFromDeck());

    const deckLbl = this.add.text(deckX, topRowY + 48 * S, `Deck (${konkState.deck.length})`, {
      fontFamily: 'Noto Kufi Arabic, sans-serif',
      fontSize: `${Math.round(10.5 * S)}px`,
      fontStyle: 'bold',
      color: '#fde68a'
    }).setOrigin(0.5);
    this.tableLayer.add([deckCard, deckLbl]);

    // شوێنی فڕێدان (Discard Pile)
    const dBox = this.add.graphics();
    dBox.lineStyle(2 * S, 0xfacc15, 0.65);
    dBox.strokeRoundedRect(discardX - 30 * S, topRowY - 43 * S, 60 * S, 86 * S, 8 * S);
    this.tableLayer.add(dBox);
    this.discardZone = { x: discardX, y: topRowY, w: 72 * S, h: 96 * S };

    if (konkState.discard.length > 0) {
      const topDiscard = konkState.discard[konkState.discard.length - 1];
      const dSprite = this.createPlayingCard(topDiscard, 0.88, isMyTurn && konkState.phase === 'draw', false);
      dSprite.setPosition(discardX, topRowY);
      dSprite.setInteractive({ useHandCursor: true });
      dSprite.on('pointerup', () => konkanTakeDiscard());
      this.tableLayer.add(dSprite);
    }

    const disLbl = this.add.text(discardX, topRowY + 48 * S, 'فڕێدراوەکان', {
      fontFamily: 'Noto Kufi Arabic, sans-serif',
      fontSize: `${Math.round(10.5 * S)}px`,
      fontStyle: 'bold',
      color: '#fde68a'
    }).setOrigin(0.5);
    this.tableLayer.add(disLbl);

    // ٢. سێتە داگیراوەکانی سەر مێز (Melds)
    const meldsStartY = 142 * S;
    if (konkState.melds.length === 0) {
      const emptyTxt = this.add.text(w / 2, meldsStartY + 55 * S, 'سێتە داگیراوەکان لێرە دەردەکەون', {
        fontFamily: 'Noto Kufi Arabic, sans-serif',
        fontSize: `${Math.round(11.5 * S)}px`,
        color: 'rgba(254, 243, 199, 0.5)'
      }).setOrigin(0.5);
      this.meldsLayer.add(emptyTxt);
    } else {
      let curX = 24 * S;
      let curY = meldsStartY + 26 * S;
      const mScale = 0.58;
      const cardStep = 22 * S;

      konkState.melds.forEach((m, mIdx) => {
        const groupW = (m.cards.length - 1) * cardStep + 40 * S;
        if (curX + groupW > w - 20 * S) {
          curX = 24 * S;
          curY += 64 * S;
        }

        const bg = this.add.graphics();
        bg.fillStyle(0x000000, 0.32);
        bg.fillRoundedRect(curX - 6 * S, curY - 30 * S, groupW + 12 * S, 60 * S, 8 * S);
        bg.lineStyle(1.2 * S, 0xfacc15, 0.45);
        bg.strokeRoundedRect(curX - 6 * S, curY - 30 * S, groupW + 12 * S, 60 * S, 8 * S);
        this.meldsLayer.add(bg);

        const zoneRect = new Phaser.Geom.Rectangle(curX - 6 * S, curY - 30 * S, groupW + 12 * S, 60 * S);
        this.meldZones.push({ idx: mIdx, rect: zoneRect });

        m.cards.forEach((c, cIdx) => {
          const cs = this.createPlayingCard(c, mScale, false, false);
          cs.setPosition(curX + 18 * S + cIdx * cardStep, curY);
          cs.setInteractive({ useHandCursor: true });
          cs.on('pointerup', () => konkanLayOffToMeld(mIdx));
          this.meldsLayer.add(cs);
        });

        curX += groupW + 18 * S;
      });
    }

    // ٣. دەستی یاریزان لە خوارەوە بە دیقەی 4K و هەڵبژاردن + ڕاکێشان بۆ فڕێدان
    const count = myHand.length;
    if (count > 0) {
      const availW = w - 34 * S;
      const cardScale = count > 9 ? 0.84 : 0.94;
      const cardW = 64 * S * cardScale;
      const stepX = count > 1 ? Math.min(cardW * 0.72, (availW - cardW) / (count - 1)) : 0;
      const totalSpan = cardW + stepX * (count - 1);
      const startX = (w - totalSpan) / 2 + cardW / 2;
      const baseY = h - 72 * S;

      myHand.forEach((c, idx) => {
        const isSel = konkSelectedIds.includes(c.id);
        const yPos = isSel ? baseY - 16 * S : baseY;
        const sprite = this.createPlayingCard(c, cardScale, isSel, false);
        sprite.setPosition(startX + idx * stepX, yPos);
        sprite.setInteractive({ draggable: true, useHandCursor: true });

        let moved = false;
        sprite.on('dragstart', () => {
          moved = false;
          sprite.setDepth(200);
          sprite.setScale(1.08);
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

          // ئەگەر کارتەکە ڕاکێشرایە سەر شوێنی فڕێدان (Discard) یەکسەر فڕێ بدرێت
          if (isMyTurn && konkState.phase === 'play' && this.discardZone) {
            const distDiscard = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.discardZone.x, this.discardZone.y);
            if (distDiscard < 55 * S) {
              konkSelectedIds = [c.id];
              konkanDiscardSelected();
              return;
            }
          }

          // ئەگەر کارتەکە ڕاکێشرایە سەر سێتێکی سەر مێز، یەکسەر بخرێتە سەری
          if (isMyTurn && konkState.phase === 'play') {
            for (const mz of this.meldZones) {
              if (mz.rect.contains(pointer.x, pointer.y)) {
                konkSelectedIds = [c.id];
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

  if (!konkanPhaserGame) {
    container.innerHTML = '';
    const cssW = container.clientWidth || 680;
    const cssH = 440;

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
      banner.className = 'px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-black';
    } else {
      banner.textContent = '⏳ چاوەڕێی جوڵەی بەرامبەرین...';
      banner.className = 'px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-bold';
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