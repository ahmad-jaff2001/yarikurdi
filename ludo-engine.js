// ==========================================
// YARI KURDI - PRO LUDO ENGINE (PHASER 3)
// ==========================================

let ludoPhaserGame = null;
let ludoSceneRef = null;

// سیستمی دەنگی ڕاستەقینەی Yalla Ludo
function playYallaSound(type = 'dice') {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    if (type === 'dice') {
      [0, 0.06, 0.13, 0.21, 0.29].forEach((d, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240 + i * 65, now + d);
        osc.frequency.exponentialRampToValueAtTime(85, now + d + 0.05);
        gain.gain.setValueAtTime(0.28, now + d);
        gain.gain.exponentialRampToValueAtTime(0.01, now + d + 0.05);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + d); osc.stop(now + d + 0.06);
      });
    } else if (type === 'step') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.07);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'kill') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.38);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 0.39);
    } else if (type === 'win' || type === 'six') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.28);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + idx * 0.08); osc.stop(now + idx * 0.08 + 0.29);
      });
    }
  } catch (e) {}
}

// ڕێڕەوی ٥٢ خانەکەی لودۆ (15x15 Grid)
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

const LUDO_STRETCH = {
  yellow: [[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]],
  red: [[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]]
};

const LUDO_BASES = {
  yellow: [[11,2],[11,3],[12,2],[12,3]],
  red: [[2,11],[2,12],[3,11],[3,12]]
};

const SAFE_CELLS = ['13,6','8,2','6,1','2,6','1,8','6,12','8,13','12,8'];

let ludoState = {
  turn: 'yellow',
  dice: 0,
  rolled: false,
  yellow: [-1, -1, -1, -1],
  red: [-1, -1, -1, -1]
};

class YallaLudoScene extends Phaser.Scene {
  constructor() {
    super({ key: 'YallaLudoScene' });
    this.tokens = { yellow: [], red: [] };
    this.glowRings = [];
  }

  create() {
    ludoSceneRef = this;
    const size = this.scale.width;
    const cell = size / 15;
    const g = this.add.graphics();

    // پاشبنەمای مەڕمەڕی کرێمی
    g.fillStyle(0xfefce8, 1);
    g.fillRect(0, 0, size, size);

    // کێشانی خانەکان و ڕێڕەو
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        const x = c * cell;
        const y = r * cell;
        let fill = 0xffffff;

        // ٤ سووچە سەرەکییەکە
        if (r < 6 && c < 6) fill = 0x1d4ed8; // شین
        else if (r < 6 && c > 8) fill = 0xdc2626; // سوور
        else if (r > 8 && c < 6) fill = 0xeab308; // زەرد
        else if (r > 8 && c > 8) fill = 0x16a34a; // سەوز

        // ڕێڕەوی چوونە ماڵەوە
        if (c === 7 && r >= 9 && r <= 13) fill = 0xfacc15;
        if (c === 7 && r >= 1 && r <= 5) fill = 0xef4444;
        if (r === 7 && c >= 1 && c <= 5) fill = 0x3b82f6;
        if (r === 7 && c >= 9 && c <= 13) fill = 0x22c55e;

        // خانەی دەستپێک و ئەستێرە پارێزراوەکان
        if (r === 13 && c === 6) fill = 0xfacc15;
        if (r === 1 && c === 8) fill = 0xef4444;
        if (r === 6 && c === 1) fill = 0x3b82f6;
        if (r === 8 && c === 13) fill = 0x22c55e;

        g.fillStyle(fill, 1);
        g.fillRect(x, y, cell, cell);

        if (!(r < 6 && c < 6) && !(r < 6 && c > 8) && !(r > 8 && c < 6) && !(r > 8 && c > 8) && !(r >= 6 && r <= 8 && c >= 6 && c <= 8)) {
          g.lineStyle(1, 0xcbd5e1, 0.9);
          g.strokeRect(x, y, cell, cell);
        }

        // نیشانەی ئەستێرە لەسەر خانە پارێزراوەکان
        if (SAFE_CELLS.includes(`${r},${c}`)) {
          this.add.text(x + cell / 2, y + cell / 2, '★', {
            fontSize: `${Math.floor(cell * 0.55)}px`,
            color: '#92400e'
          }).setOrigin(0.5);
        }
      }
    }

    // چوارگۆشە سپی ناوەکییەکانی ٤ ماڵەکە
    const drawHomeBox = (startR, startC, borderCol) => {
      const bx = startC * cell + cell * 0.85;
      const by = startR * cell + cell * 0.85;
      const bw = cell * 4.3;
      g.fillStyle(0xffffff, 0.96);
      g.fillRoundedRect(bx, by, bw, bw, 14);
      g.lineStyle(3, borderCol, 1);
      g.strokeRoundedRect(bx, by, bw, bw, 14);
    };
    drawHomeBox(0, 0, 0x1e3a8a);
    drawHomeBox(0, 9, 0x991b1b);
    drawHomeBox(9, 0, 0xa16207);
    drawHomeBox(9, 9, 0x14532d);

    // شوێنی دانیشتنی پولەکان (Sockets)
    const drawSockets = (coords, col) => {
      coords.forEach(([r, c]) => {
        g.fillStyle(col, 0.22);
        g.fillCircle(c * cell + cell / 2, r * cell + cell / 2, cell * 0.36);
        g.lineStyle(1.5, col, 0.7);
        g.strokeCircle(c * cell + cell / 2, r * cell + cell / 2, cell * 0.36);
      });
    };
    drawSockets(LUDO_BASES.yellow, 0xca8a04);
    drawSockets(LUDO_BASES.red, 0xdc2626);
    drawSockets([[2,2],[2,3],[3,2],[3,3]], 0x2563eb);
    drawSockets([[11,11],[11,12],[12,11],[12,12]], 0x16a34a);

    // سێگۆشە شاهانەکانی ناوەڕاست (Crown Center)
    const cx = 7.5 * cell, cy = 7.5 * cell;
    const x1 = 6 * cell, y1 = 6 * cell, x2 = 9 * cell, y2 = 9 * cell;
    const drawTri = (p1, p2, col) => {
      g.fillStyle(col, 1);
      g.beginPath();
      g.moveTo(cx, cy); g.lineTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]);
      g.closePath(); g.fillPath();
    };
    drawTri([x1, y2], [x2, y2], 0xfacc15); // زەرد
    drawTri([x1, y1], [x2, y1], 0xef4444); // سوور
    drawTri([x1, y1], [x1, y2], 0x3b82f6); // شین
    drawTri([x2, y1], [x2, y2], 0x22c55e); // سەوز

    this.add.text(cx, cy, '👑', { fontSize: `${Math.floor(cell * 0.9)}px` }).setOrigin(0.5);

    // دروستکردنی پولە ٣ ڕەهەندییەکان
    ['yellow', 'red'].forEach(color => {
      for (let i = 0; i < 4; i++) {
        const container = this.add.container(0, 0);
        const shadow = this.add.circle(0, 3, cell * 0.38, 0x000000, 0.45);
        const body = this.add.circle(0, 0, cell * 0.38, color === 'yellow' ? 0xfacc15 : 0xef4444);
        body.setStrokeStyle(2.5, 0xffffff);
        const inner = this.add.circle(-cell * 0.1, -cell * 0.1, cell * 0.14, 0xffffff, 0.55);

        container.add([shadow, body, inner]);
        container.setSize(cell * 0.85, cell * 0.85);
        container.setInteractive({ useHandCursor: true });
        container.on('pointerdown', () => {
          if (color === 'yellow' && ludoState.turn === 'yellow' && ludoState.rolled) {
            moveLudoToken('yellow', i);
          }
        });

        this.tokens[color].push(container);
      }
    });

    this.syncTokensVisual(false);
  }

  getCoord(color, pos, idx) {
    const size = this.scale.width;
    const cell = size / 15;
    let r, c;
    if (pos === -1) {
      [r, c] = LUDO_BASES[color][idx];
    } else if (pos >= 51) {
      const sIdx = Math.min(pos - 51, 5);
      [r, c] = LUDO_STRETCH[color][sIdx];
    } else {
      const offset = color === 'yellow' ? 0 : 26;
      [r, c] = LUDO_MAIN_PATH[(pos + offset) % 52];
    }
    return { x: c * cell + cell / 2, y: r * cell + cell / 2 };
  }

  syncTokensVisual(animate = true) {
    ['yellow', 'red'].forEach(color => {
      for (let i = 0; i < 4; i++) {
        const token = this.tokens[color][i];
        if (!token) continue;
        const pos = ludoState[color][i];
        const target = this.getCoord(color, pos, i);

        // ئەگەر دوو پول لەسەر یەک خانە بن کەمێک لایان دەدەین
        let offsetX = 0;
        for (let j = 0; j < i; j++) {
          if (ludoState[color][j] === pos && pos !== -1) offsetX += 5;
        }

        if (animate) {
          this.tweens.add({
            targets: token,
            x: target.x + offsetX,
            y: target.y,
            duration: 240,
            ease: 'Back.easeOut'
          });
        } else {
          token.setPosition(target.x + offsetX, target.y);
        }

        // درەوشانەوەی ئەو پولانەی دەتوانن بجوڵێن
        const movable = color === 'yellow' && ludoState.turn === 'yellow' && ludoState.rolled && canMoveLudoToken('yellow', i, ludoState.dice);
        token.setScale(movable ? 1.18 : 1.0);
        token.setDepth(movable ? 10 : 5);
      }
    });

    const yHomeEl = document.getElementById('ludoYellowHome');
    const rHomeEl = document.getElementById('ludoRedHome');
    if (yHomeEl) yHomeEl.textContent = `تاج: ${ludoState.yellow.filter(p => p === 56).length}/4`;
    if (rHomeEl) rHomeEl.textContent = `تاج: ${ludoState.red.filter(p => p === 56).length}/4`;
  }
}

function initLudoGame() {
  ludoState = { turn: 'yellow', dice: 0, rolled: false, yellow: [-1, -1, -1, -1], red: [-1, -1, -1, -1] };
  const boardContainer = document.getElementById('ludoBoard');
  if (!boardContainer) return;

  const yDice = document.getElementById('ludoDiceBox');
  const rDice = document.getElementById('ludoOppDiceBox');
  const turnBadge = document.getElementById('ludoTurnBadge');
  const statusTxt = document.getElementById('ludoStatusText');
  if (yDice) yDice.textContent = '🎲';
  if (rDice) rDice.textContent = '🎲';
  if (turnBadge) turnBadge.textContent = 'نۆرەی تۆیە (زەرد)';
  if (statusTxt) statusTxt.textContent = 'کلیک لە زارەکە بکە';

  if (!ludoPhaserGame) {
    boardContainer.innerHTML = '';
    const boxWidth = Math.min(boardContainer.parentElement.clientWidth - 22, 420) || 340;
    ludoPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: boxWidth,
      height: boxWidth,
      parent: 'ludoBoard',
      transparent: true,
      scene: [YallaLudoScene]
    });
  } else if (ludoSceneRef) {
    ludoSceneRef.syncTokensVisual(false);
  }
}

function canMoveLudoToken(color, idx, dice) {
  const pos = ludoState[color][idx];
  if (pos === 56) return false;
  if (pos === -1) return dice === 6;
  return pos + dice <= 56;
}

function rollLudoDice() {
  if (ludoState.turn !== 'yellow' || ludoState.rolled) return;
  const diceBox = document.getElementById('ludoDiceBox');
  playYallaSound('dice');

  const val = Math.floor(Math.random() * 6) + 1;
  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  // ئەنیمەیشنی سووڕانەوەی زار
  let ticks = 0;
  const spin = setInterval(() => {
    if (diceBox) diceBox.textContent = faces[Math.floor(Math.random() * 6) + 1];
    ticks++;
    if (ticks >= 6) {
      clearInterval(spin);
      if (diceBox) diceBox.textContent = faces[val];
      ludoState.dice = val;
      ludoState.rolled = true;
      if (val === 6) playYallaSound('six');

      const movable = [0, 1, 2, 3].filter(i => canMoveLudoToken('yellow', i, val));
      if (ludoSceneRef) ludoSceneRef.syncTokensVisual(false);

      if (movable.length === 0) {
        document.getElementById('ludoStatusText').textContent = 'هیچ پولێک ناجوڵێت!';
        setTimeout(() => switchLudoTurn('red'), 850);
      } else if (movable.length === 1) {
        setTimeout(() => moveLudoToken('yellow', movable[0]), 350);
      } else {
        document.getElementById('ludoStatusText').textContent = 'پولێک هەڵبژێرە';
      }
    }
  }, 55);
}

function moveLudoToken(color, idx) {
  if (!canMoveLudoToken(color, idx, ludoState.dice)) return;
  const dice = ludoState.dice;
  let pos = ludoState[color][idx];

  if (pos === -1 && dice === 6) {
    ludoState[color][idx] = 0;
  } else {
    ludoState[color][idx] += dice;
  }

  playYallaSound('step');
  const newPos = ludoState[color][idx];
  let extraTurn = (dice === 6 || newPos === 56);

  // پشکنینی کوشتنی پولی بەرامبەر
  if (newPos >= 0 && newPos < 51) {
    const offset = color === 'yellow' ? 0 : 26;
    const [r, c] = LUDO_MAIN_PATH[(newPos + offset) % 52];
    if (!SAFE_CELLS.includes(`${r},${c}`)) {
      const opp = color === 'yellow' ? 'red' : 'yellow';
      const oppOffset = opp === 'yellow' ? 0 : 26;
      for (let j = 0; j < 4; j++) {
        const oppPos = ludoState[opp][j];
        if (oppPos >= 0 && oppPos < 51) {
          const [or, oc] = LUDO_MAIN_PATH[(oppPos + oppOffset) % 52];
          if (or === r && oc === c) {
            ludoState[opp][j] = -1;
            playYallaSound('kill');
            extraTurn = true;
          }
        }
      }
    }
  }

  if (ludoSceneRef) ludoSceneRef.syncTokensVisual(true);

  if (ludoState[color].every(p => p === 56)) {
    playYallaSound('win');
    alert(color === 'yellow' ? 'پیرۆزە! تۆ یارییەکەت بردەوە 👑' : 'بۆتی YariKurdi یارییەکەی بردەوە!');
    initLudoGame();
    return;
  }

  ludoState.rolled = false;
  if (extraTurn) {
    document.getElementById('ludoStatusText').textContent = 'نۆرەیەکی ترت پێدرا!';
    if (color === 'red') setTimeout(playLudoBotTurn, 750);
  } else {
    switchLudoTurn(color === 'yellow' ? 'red' : 'yellow');
  }
}

function switchLudoTurn(next) {
  ludoState.turn = next;
  ludoState.rolled = false;
  const badge = document.getElementById('ludoTurnBadge');
  const status = document.getElementById('ludoStatusText');
  if (next === 'yellow') {
    if (badge) badge.textContent = 'نۆرەی تۆیە (زەرد)';
    if (status) status.textContent = 'کلیک لە زارەکە بکە';
  } else {
    if (badge) badge.textContent = 'نۆرەی بۆتە (سوور)';
    if (status) status.textContent = 'بۆت زار هەڵدەدات...';
    setTimeout(playLudoBotTurn, 800);
  }
  if (ludoSceneRef) ludoSceneRef.syncTokensVisual(false);
}

function playLudoBotTurn() {
  if (ludoState.turn !== 'red') return;
  const oppBox = document.getElementById('ludoOppDiceBox');
  playYallaSound('dice');
  const val = Math.floor(Math.random() * 6) + 1;
  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  if (oppBox) oppBox.textContent = faces[val];
  ludoState.dice = val;
  ludoState.rolled = true;

  const movable = [0, 1, 2, 3].filter(i => canMoveLudoToken('red', i, val));
  setTimeout(() => {
    if (movable.length === 0) {
      switchLudoTurn('yellow');
    } else {
      const chosen = movable.sort((a, b) => ludoState.red[b] - ludoState.red[a])[0];
      moveLudoToken('red', chosen);
    }
  }, 750);
}

function sendLudoQuickReaction(txt) {
  const status = document.getElementById('ludoStatusText');
  if (status) status.textContent = txt;
  playYallaSound('step');
}

function leaveLudoRoom() {
  if (typeof stopLiveVoiceMic === 'function') stopLiveVoiceMic();
  if (typeof switchView === 'function') switchView('hub');
}

// خۆکارانە کردنەوەی تەختەکە هەر کە چوویتە ناو لودۆ
document.addEventListener('DOMContentLoaded', () => {
  const _origSwitch = window.switchView;
  if (typeof _origSwitch === 'function') {
    window.switchView = function(v) {
      _origSwitch(v);
      if (v === 'ludo') setTimeout(initLudoGame, 80);
    };
  }
});