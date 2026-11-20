// ========================================================
// YARI KURDI - PRO CHESS ENGINE (PHASER 3 + DRAG + PREMOVE)
// ========================================================

const CHESS_PIECE_SVGS = {
  wK: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
  wQ: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  wR: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  wB: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  wN: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  wP: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  bK: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
  bQ: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  bR: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  bB: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  bN: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  bP: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
};

let selectedBaseTime = 180, selectedIncrement = 0;
function selectTime(base, inc, btn) {
  selectedBaseTime = base;
  selectedIncrement = inc;
  document.querySelectorAll('.time-btn').forEach(b => {
    b.classList.remove('bg-yellow-500', 'text-[#050b18]');
    b.classList.add('bg-[#0d1933]', 'text-slate-300');
  });
  if (btn) {
    btn.classList.add('bg-yellow-500', 'text-[#050b18]');
    btn.classList.remove('bg-[#0d1933]', 'text-slate-300');
  }
}

let board = [], turn = 'w', myColor = 'w', isOnlineGame = false, gameActive = false;
let selectedSq = null, legalMoves = [], lastMove = null, premove = null;
let castling = { wK: true, wQ: true, bK: true, bQ: true }, epTarget = null;
let whiteTime = 180, blackTime = 180, clockInterval = null, moveList = [];
let opponentInfo = { id: null, name: 'بۆتی YariKurdi', elo: 1200, avatar: '' };
let queueRef = null, roomRef = null;
let chessPhaserGame = null, chessSceneRef = null;

class RoyalChessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'RoyalChessScene' });
    this.arrows = [];
    this.rightStart = null;
    this.dragInfo = null;
    this.dragGhostSprite = null;
    this.pieceGridSprites = {};
  }

  preload() {
    Object.entries(CHESS_PIECE_SVGS).forEach(([key, url]) => {
      this.load.svg(key, url, { width: 96, height: 96 });
    });
  }

  create() {
    chessSceneRef = this;
    this.boardGfx = this.add.graphics();
    this.highlightGfx = this.add.graphics();
    this.piecesLayer = this.add.container(0, 0);
    this.arrowGfx = this.add.graphics();

    this.input.mouse.disableContextMenu();

    // Pointer Down: هەڵگرتن یان دەستپێکردنی ڕاکێشان (Drag)
    this.input.on('pointerdown', (pointer) => {
      if (!gameActive) return;
      const sq = this.xyToSq(pointer.x, pointer.y);
      if (!sq) return;

      if (pointer.rightButtonDown()) {
        this.rightStart = sq;
        return;
      }

      if (this.arrows.length > 0) {
        this.arrows = [];
        this.drawArrows();
      }

      const p = board[sq.r][sq.c];

      // ئەگەر داشێکی خۆمان بێت -> ئامادەکردن بۆ کلیک یان ڕاکێشان (هەم لە نۆرەی خۆمان هەم بۆ Premove)
      if (p && p[0] === myColor) {
        if (premove) premove = null;
        selectedSq = sq;
        legalMoves = (turn === myColor) ? getLegalMovesForPiece(sq.r, sq.c) : getPremoveHintSquares(sq.r, sq.c);

        this.dragInfo = {
          fromR: sq.r,
          fromC: sq.c,
          piece: p,
          startX: pointer.x,
          startY: pointer.y,
          isDragging: false
        };

        this.syncBoardVisual();
        return;
      }

      // ئەگەر پێشتر داشێک دیاریکرابێت و کلیک لە خانەی دووەم بکرێت
      if (selectedSq) {
        this.handleDestinationAction(selectedSq.r, selectedSq.c, sq.r, sq.c);
      }
    });

    // Pointer Move: جووڵاندنی داشەکە لەگەڵ ماوس یان پەنجە
    this.input.on('pointermove', (pointer) => {
      if (!this.dragInfo || !gameActive) return;
      const dist = Phaser.Math.Distance.Between(this.dragInfo.startX, this.dragInfo.startY, pointer.x, pointer.y);

      if (dist > 6 && !this.dragInfo.isDragging) {
        this.dragInfo.isDragging = true;
        const origKey = `${this.dragInfo.fromR}_${this.dragInfo.fromC}`;
        if (this.pieceGridSprites[origKey]) {
          this.pieceGridSprites[origKey].setAlpha(0.28);
        }
        const sqSize = this.scale.width / 8;
        this.dragGhostSprite = this.add.image(pointer.x, pointer.y, this.dragInfo.piece);
        this.dragGhostSprite.setDisplaySize(sqSize * 1.02, sqSize * 1.02);
        this.dragGhostSprite.setDepth(50);
      }

      if (this.dragInfo.isDragging && this.dragGhostSprite) {
        this.dragGhostSprite.setPosition(pointer.x, pointer.y);
      }
    });

    // Pointer Up: دانانی داشە ڕاکێشراوەکە یان کێشانی سەهم
    this.input.on('pointerup', (pointer) => {
      if (this.rightStart) {
        const endSq = this.xyToSq(pointer.x, pointer.y);
        if (endSq && (endSq.r !== this.rightStart.r || endSq.c !== this.rightStart.c)) {
          this.arrows.push({ from: this.rightStart, to: endSq });
          this.drawArrows();
        }
        this.rightStart = null;
        return;
      }

      if (this.dragInfo) {
        const info = this.dragInfo;
        this.dragInfo = null;

        if (this.dragGhostSprite) {
          this.dragGhostSprite.destroy();
          this.dragGhostSprite = null;
        }

        const origKey = `${info.fromR}_${info.fromC}`;
        if (this.pieceGridSprites[origKey]) {
          this.pieceGridSprites[origKey].setAlpha(1);
        }

        if (info.isDragging) {
          const dropSq = this.xyToSq(pointer.x, pointer.y);
          if (dropSq && (dropSq.r !== info.fromR || dropSq.c !== info.fromC)) {
            this.handleDestinationAction(info.fromR, info.fromC, dropSq.r, dropSq.c);
          } else {
            this.syncBoardVisual();
          }
        }
      }
    });

    this.drawBaseBoard();
    this.syncBoardVisual();
  }

  handleDestinationAction(fromR, fromC, toR, toC) {
    // ئەگەر نۆرەی بەرامبەرە -> Premove دابنێ
    if (turn !== myColor) {
      if (fromR !== toR || fromC !== toC) {
        premove = { fromR, fromC, toR, toC };
        playChessSound('move');
      }
      selectedSq = null;
      legalMoves = [];
      this.syncBoardVisual();
      return;
    }

    // ئەگەر نۆرەی خۆمانە -> جووڵەی یاسایی جێبەجێ بکە
    const valid = getLegalMovesForPiece(fromR, fromC).some(m => m.toR === toR && m.toC === toC);
    if (valid) {
      executeMove(fromR, fromC, toR, toC, false);
    } else {
      selectedSq = null;
      legalMoves = [];
      this.syncBoardVisual();
    }
  }

  xyToSq(x, y) {
    const size = this.scale.width;
    const sqSize = size / 8;
    const col = Math.floor(x / sqSize);
    const row = Math.floor(y / sqSize);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    return {
      r: myColor === 'w' ? row : 7 - row,
      c: myColor === 'w' ? col : 7 - col
    };
  }

  sqToCenter(r, c) {
    const sqSize = this.scale.width / 8;
    const dispR = myColor === 'w' ? r : 7 - r;
    const dispC = myColor === 'w' ? c : 7 - c;
    return { x: dispC * sqSize + sqSize / 2, y: dispR * sqSize + sqSize / 2, sqSize };
  }

  drawBaseBoard() {
    const size = this.scale.width;
    const sqSize = size / 8;
    this.boardGfx.clear();

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const r = myColor === 'w' ? i : 7 - i;
        const c = myColor === 'w' ? j : 7 - j;
        const isLight = (r + c) % 2 === 0;
        this.boardGfx.fillStyle(isLight ? 0xe2e8f0 : 0x2c4c6e, 1);
        this.boardGfx.fillRect(j * sqSize, i * sqSize, sqSize, sqSize);
      }
    }
  }

  syncBoardVisual() {
    this.drawBaseBoard();
    const size = this.scale.width;
    const sqSize = size / 8;
    this.highlightGfx.clear();

    // دوا جووڵە
    if (lastMove) {
      [{ r: lastMove.fromR, c: lastMove.fromC }, { r: lastMove.toR, c: lastMove.toC }].forEach(pos => {
        const dr = myColor === 'w' ? pos.r : 7 - pos.r;
        const dc = myColor === 'w' ? pos.c : 7 - pos.c;
        this.highlightGfx.fillStyle(0xfacc15, 0.36);
        this.highlightGfx.fillRect(dc * sqSize, dr * sqSize, sqSize, sqSize);
      });
    }

    // خانەی هەڵبژێردراو
    if (selectedSq) {
      const dr = myColor === 'w' ? selectedSq.r : 7 - selectedSq.r;
      const dc = myColor === 'w' ? selectedSq.c : 7 - selectedSq.c;
      this.highlightGfx.fillStyle(0xd4af37, 0.62);
      this.highlightGfx.fillRect(dc * sqSize, dr * sqSize, sqSize, sqSize);
    }

    // خانەکانی Premove (ڕەنگی سووری Chess.com)
    if (premove) {
      [{ r: premove.fromR, c: premove.fromC, a: 0.55 }, { r: premove.toR, c: premove.toC, a: 0.72 }].forEach(pos => {
        const dr = myColor === 'w' ? pos.r : 7 - pos.r;
        const dc = myColor === 'w' ? pos.c : 7 - pos.c;
        this.highlightGfx.fillStyle(0xef4444, pos.a);
        this.highlightGfx.fillRect(dc * sqSize, dr * sqSize, sqSize, sqSize);
      });
    }

    // کش (Check)
    const kingCheck = isKingInCheck(turn) ? findKing(turn) : null;
    if (kingCheck) {
      const dr = myColor === 'w' ? kingCheck.r : 7 - kingCheck.r;
      const dc = myColor === 'w' ? kingCheck.c : 7 - kingCheck.c;
      this.highlightGfx.fillStyle(0xdc2626, 0.8);
      this.highlightGfx.fillRect(dc * sqSize, dr * sqSize, sqSize, sqSize);
    }

    // خاڵی جووڵە یاساییەکان (یان خانه چاوەڕوانکراوەکانی Premove)
    const isPremoveMode = (turn !== myColor);
    legalMoves.forEach(m => {
      const { x, y } = this.sqToCenter(m.toR, m.toC);
      if (isPremoveMode) {
        this.highlightGfx.fillStyle(0xf87171, 0.55);
        this.highlightGfx.fillCircle(x, y, sqSize * 0.14);
      } else if (board[m.toR][m.toC]) {
        this.highlightGfx.lineStyle(4, 0xef4444, 0.85);
        this.highlightGfx.strokeCircle(x, y, sqSize * 0.42);
      } else {
        this.highlightGfx.fillStyle(0x10b981, 0.8);
        this.highlightGfx.fillCircle(x, y, sqSize * 0.16);
      }
    });

    // کێشانەوەی داشەکان
    this.piecesLayer.removeAll(true);
    this.pieceGridSprites = {};
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p) continue;
        const { x, y } = this.sqToCenter(r, c);
        const sprite = this.add.image(x, y, p);
        sprite.setDisplaySize(sqSize * 0.84, sqSize * 0.84);
        this.piecesLayer.add(sprite);
        this.pieceGridSprites[`${r}_${c}`] = sprite;
      }
    }

    const baseTurnText = turn === 'w' ? 'نۆرەی سپییە' : 'نۆرەی ڕەشە';
    const turnEl = document.getElementById('turnIndicator');
    if (turnEl) {
      if (kingCheck) {
        turnEl.textContent = `⚠️ کش! (${baseTurnText})`;
        turnEl.className = 'text-xs font-extrabold text-red-400 animate-pulse';
      } else if (premove) {
        turnEl.textContent = `⚡ Premove ئامادەیە`;
        turnEl.className = 'text-xs font-extrabold text-rose-400';
      } else {
        turnEl.textContent = baseTurnText;
        turnEl.className = 'text-xs font-bold text-yellow-300';
      }
    }
    this.drawArrows();
  }

  drawArrows() {
    this.arrowGfx.clear();
    this.arrowGfx.lineStyle(7, 0x10b981, 0.85);
    this.arrows.forEach(a => {
      const p1 = this.sqToCenter(a.from.r, a.from.c);
      const p2 = this.sqToCenter(a.to.r, a.to.c);
      this.arrowGfx.beginPath();
      this.arrowGfx.moveTo(p1.x, p1.y);
      this.arrowGfx.lineTo(p2.x, p2.y);
      this.arrowGfx.strokePath();
      this.arrowGfx.fillStyle(0x10b981, 0.95);
      this.arrowGfx.fillCircle(p2.x, p2.y, 8);
    });
  }
}

// پێدانی هەموو جووڵە ئەگەرییەکان بۆ Premove کاتێک نۆرەی بەرامبەرە
function getPremoveHintSquares(r, c) {
  const p = board[r][c];
  if (!p) return [];
  const color = p[0], type = p[1], moves = [];
  const inBounds = (nr, nc) => nr >= 0 && nr < 8 && nc >= 0 && nc < 8;

  if (type === 'P') {
    const dir = color === 'w' ? -1 : 1, startRow = color === 'w' ? 6 : 1;
    if (inBounds(r + dir, c)) moves.push({ fromR: r, fromC: c, toR: r + dir, toC: c });
    if (r === startRow && inBounds(r + dir * 2, c)) moves.push({ fromR: r, fromC: c, toR: r + dir * 2, toC: c });
    [-1, 1].forEach(dc => { if (inBounds(r + dir, c + dc)) moves.push({ fromR: r, fromC: c, toR: r + dir, toC: c + dc }); });
  } else if (type === 'N') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
      if (inBounds(r + dr, c + dc)) moves.push({ fromR: r, fromC: c, toR: r + dr, toC: c + dc });
    });
  } else if (type === 'K') {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if ((dr !== 0 || dc !== 0) && inBounds(r + dr, c + dc)) moves.push({ fromR: r, fromC: c, toR: r + dr, toC: c + dc });
    }
    const row = color === 'w' ? 7 : 0;
    if (r === row && c === 4) {
      moves.push({ fromR: row, fromC: 4, toR: row, toC: 6 });
      moves.push({ fromR: row, fromC: 4, toR: row, toC: 2 });
    }
  } else {
    const dirs = [];
    if (type === 'R' || type === 'Q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    if (type === 'B' || type === 'Q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    dirs.forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        nr += dr; nc += dc;
      }
    });
  }
  return moves;
}

function initChessPhaser() {
  const boardContainer = document.getElementById('chessBoard');
  if (!boardContainer) return;
  if (!chessPhaserGame) {
    boardContainer.innerHTML = '';
    const wrapper = document.getElementById('boardWrapper');
    const dim = (wrapper && wrapper.clientWidth > 100) ? wrapper.clientWidth : Math.min(window.innerWidth * 0.9, 480);
    chessPhaserGame = new Phaser.Game({
      type: Phaser.AUTO,
      width: dim,
      height: dim,
      parent: 'chessBoard',
      transparent: true,
      scene: [RoyalChessScene]
    });
  } else if (chessSceneRef) {
    chessSceneRef.syncBoardVisual();
  }
}

function initBoardArray() {
  board = [
    ['bR','bN','bB','bQ','bK','bB','bN','bR'],
    ['bP','bP','bP','bP','bP','bP','bP','bP'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['wP','wP','wP','wP','wP','wP','wP','wP'],
    ['wR','wN','wB','wQ','wK','wB','wN','wR']
  ];
  turn = 'w'; selectedSq = null; legalMoves = []; lastMove = null; premove = null;
  castling = { wK: true, wQ: true, bK: true, bQ: true }; epTarget = null; moveList = [];
  const mh = document.getElementById('moveHistoryBox');
  const cm = document.getElementById('inGameChatMessages');
  if (mh) mh.innerHTML = '';
  if (cm) cm.innerHTML = '';
  setTimeout(initChessPhaser, 60);
}

function renderBoard() {
  if (chessSceneRef) chessSceneRef.syncBoardVisual();
  else initChessPhaser();
}

function clearArrows() {
  if (chessSceneRef) {
    chessSceneRef.arrows = [];
    chessSceneRef.drawArrows();
  }
}

function startOnlineMatchmaking() {
  const tcKey = `${selectedBaseTime}_${selectedIncrement}`;
  document.getElementById('chessSetupPanel').classList.add('hidden');
  document.getElementById('matchmakingPanel').classList.remove('hidden');
  const tcQueueRef = db.ref('matchmaking/' + tcKey);
  queueRef = tcQueueRef.child(playerId);
  queueRef.onDisconnect().remove();

  tcQueueRef.once('value', snap => {
    let opp = null;
    snap.forEach(c => { if (c.key !== playerId && !c.val().roomId) opp = { id: c.key, ...c.val() }; });
    if (opp) {
      const rId = 'room_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      db.ref('rooms/' + rId).set({
        white: { id: opp.id, name: opp.name, elo: opp.elo, avatar: opp.avatar || '' },
        black: { id: playerId, name: playerName, elo: playerProfile.elo.chess, avatar: playerAvatarData },
        baseTime: selectedBaseTime, inc: selectedIncrement, status: 'playing', lastMove: null, winner: null
      });
      tcQueueRef.child(opp.id).update({ roomId: rId });
      startOnlineGameSession(rId, 'b', { id: opp.id, name: opp.name, elo: opp.elo, avatar: opp.avatar || '' });
    } else {
      queueRef.set({ name: playerName, elo: playerProfile.elo.chess, avatar: playerAvatarData, roomId: null, ts: firebase.database.ServerValue.TIMESTAMP });
      queueRef.on('value', qSnap => {
        const val = qSnap.val();
        if (val && val.roomId) {
          const rId = val.roomId; queueRef.off(); queueRef.remove();
          db.ref('rooms/' + rId).once('value', rSnap => {
            const rData = rSnap.val();
            if (rData) startOnlineGameSession(rId, 'w', { id: rData.black.id, name: rData.black.name, elo: rData.black.elo, avatar: rData.black.avatar || '' });
          });
        }
      });
    }
  });
}

function cancelMatchmaking() {
  if (queueRef) { queueRef.off(); queueRef.remove(); queueRef = null; }
  document.getElementById('matchmakingPanel').classList.add('hidden');
  document.getElementById('chessSetupPanel').classList.remove('hidden');
}

function startOnlineGameSession(roomId, color, opp) {
  document.getElementById('matchmakingPanel').classList.add('hidden');
  document.getElementById('activeGameArea').classList.remove('hidden');
  isOnlineGame = true; myColor = color; opponentInfo = opp;
  whiteTime = selectedBaseTime; blackTime = selectedBaseTime; gameActive = true;

  document.getElementById('oppName').textContent = opp.name;
  renderAvatarContent('oppAvatar', opp.avatar, opp.name);
  document.getElementById('oppEloBadge').textContent = `(${opp.elo})`;

  const addBtn = document.getElementById('inGameAddFriendBtn');
  if (opp.id && !myFriendsMap[opp.id]) { addBtn.classList.remove('hidden'); addBtn.disabled = false; addBtn.textContent = '+ هاوڕێیەتی'; }
  else addBtn.classList.add('hidden');

  initBoardArray(); startClock();

  roomRef = db.ref('rooms/' + roomId);
  roomRef.on('value', snap => {
    const data = snap.val();
    if (!data) return;
    if (data.lastMove && data.lastMove.by !== myColor) {
      const m = data.lastMove;
      if (!lastMove || lastMove.moveNum !== m.moveNum) executeMove(m.fromR, m.fromC, m.toR, m.toC, true);
    }
    if (data.winner && gameActive) {
      if (data.winner === myColor) endGame(true, 'بەرامبەر خۆی بەدەستەوە دا');
      else if (data.winner === 'draw') endGame('draw', 'یاری یەکسان بوو');
    }
  });

  roomRef.child('chat').limitToLast(30).on('value', cSnap => {
    const box = document.getElementById('inGameChatMessages'), items = [];
    cSnap.forEach(c => items.push(c.val()));
    box.innerHTML = items.map(m => `<div class="flex ${m.from === playerId ? 'justify-start' : 'justify-end'}"><span class="px-2.5 py-1 rounded-xl text-[11px] ${m.from === playerId ? 'bg-yellow-500 text-[#050b18] font-bold' : 'bg-[#15284d] text-white'}">${escapeHtml(m.text)}</span></div>`).join('');
    box.scrollTop = box.scrollHeight;
  });
}

function submitInGameChat(e) {
  e.preventDefault();
  const input = document.getElementById('matchChatInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  sendQuickChat(text);
  input.value = '';
}

function sendMatchChat() {
  const input = document.getElementById('matchChatInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  sendQuickChat(text);
  input.value = '';
}

function sendQuickChat(text) {
  if (isOnlineGame && roomRef) roomRef.child('chat').push({ from: playerId, text: text.slice(0, 150) });
  else {
    const box = document.getElementById('inGameChatMessages');
    if (box) {
      box.innerHTML += `<div class="flex justify-start"><span class="px-2.5 py-1 rounded-xl text-[11px] bg-yellow-500 text-[#050b18] font-bold">${escapeHtml(text)}</span></div>`;
      box.scrollTop = box.scrollHeight;
    }
  }
  playChessSound('msg');
}

function startBotGame() {
  document.getElementById('chessSetupPanel').classList.add('hidden');
  document.getElementById('activeGameArea').classList.remove('hidden');
  document.getElementById('inGameAddFriendBtn').classList.add('hidden');
  isOnlineGame = false; myColor = 'w';
  opponentInfo = { id: null, name: 'بۆتی YariKurdi', elo: 1300, avatar: '' };
  whiteTime = selectedBaseTime; blackTime = selectedBaseTime; gameActive = true;
  document.getElementById('oppName').textContent = opponentInfo.name;
  document.getElementById('oppAvatar').textContent = '🤖';
  document.getElementById('oppEloBadge').textContent = '(1300)';
  initBoardArray(); startClock();
}

function executeMove(fromR, fromC, toR, toC, isRemote = false) {
  if (!gameActive) return;
  const piece = board[fromR][fromC];
  if (!piece) return;
  const targetPiece = board[toR][toC];
  let isCapture = !!targetPiece;

  if (piece[1] === 'P' && epTarget && toR === epTarget.r && toC === epTarget.c) {
    board[fromR][toC] = null;
    isCapture = true;
  }

  if (piece[1] === 'P' && Math.abs(toR - fromR) === 2) {
    epTarget = { r: (fromR + toR) / 2, c: fromC };
  } else {
    epTarget = null;
  }

  if (piece[1] === 'K' && Math.abs(toC - fromC) === 2) {
    if (toC === 6) { board[fromR][5] = board[fromR][7]; board[fromR][7] = null; }
    if (toC === 2) { board[fromR][3] = board[fromR][0]; board[fromR][0] = null; }
  }

  if (piece === 'wK') { castling.wK = false; castling.wQ = false; }
  if (piece === 'bK') { castling.bK = false; castling.bQ = false; }
  if (fromR === 7 && fromC === 0) castling.wQ = false;
  if (fromR === 7 && fromC === 7) castling.wK = false;
  if (fromR === 0 && fromC === 0) castling.bQ = false;
  if (fromR === 0 && fromC === 7) castling.bK = false;

  board[toR][toC] = piece;
  board[fromR][fromC] = null;
  if (piece === 'wP' && toR === 0) board[toR][toC] = 'wQ';
  if (piece === 'bP' && toR === 7) board[toR][toC] = 'bQ';

  if (!isRemote && turn === 'w') whiteTime += selectedIncrement;
  if (!isRemote && turn === 'b') blackTime += selectedIncrement;

  moveList.push({ fromR, fromC, toR, toC, piece });
  const files = ['a','b','c','d','e','f','g','h'];
  const notation = `${piece[1] === 'P' ? '' : piece[1]}${isCapture ? 'x' : ''}${files[toC]}${8 - toR}`;
  const histBox = document.getElementById('moveHistoryBox');
  if (histBox) {
    histBox.innerHTML += `<span class="inline-block bg-white/5 px-1.5 py-0.5 rounded ml-1 text-slate-200">${moveList.length}. ${notation}</span>`;
    histBox.scrollTop = histBox.scrollHeight;
  }

  const currentMoveNum = moveList.length;
  lastMove = { fromR, fromC, toR, toC, moveNum: currentMoveNum };
  selectedSq = null;
  legalMoves = [];
  clearArrows();

  turn = (turn === 'w') ? 'b' : 'w';

  const inCheck = isKingInCheck(turn);
  if (inCheck) playChessSound('check');
  else if (isCapture) playChessSound('capture');
  else playChessSound('move');

  renderBoard();

  if (isOnlineGame && !isRemote && roomRef) {
    roomRef.child('lastMove').set({ fromR, fromC, toR, toC, by: myColor, moveNum: currentMoveNum });
  }

  let hasAnyLegalMove = false;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && board[r][c][0] === turn && getLegalMovesForPiece(r, c).length > 0) {
        hasAnyLegalMove = true;
        break;
      }
    }
    if (hasAnyLegalMove) break;
  }

  if (!hasAnyLegalMove) {
    if (inCheck) {
      const playerWon = (turn !== myColor);
      if (isOnlineGame && roomRef && playerWon) roomRef.child('winner').set(myColor);
      endGame(playerWon, playerWon ? 'کش و مات! تۆ یارییەکەت بردەوە' : 'کش و مات! بەرامبەر یارییەکەی بردەوە');
    } else {
      if (isOnlineGame && roomRef) roomRef.child('winner').set('draw');
      endGame('draw', 'یارییەکە بە یەکسانی (Stalemate) کۆتایی هات');
    }
    return;
  }

  // جێبەجێکردنی خێرای Premove هەر کە نۆرەی خۆمان هات
  if (turn === myColor && premove) {
    const pm = premove;
    premove = null;
    if (board[pm.fromR][pm.fromC] && board[pm.fromR][pm.fromC][0] === myColor &&
        getLegalMovesForPiece(pm.fromR, pm.fromC).some(m => m.toR === pm.toR && m.toC === pm.toC)) {
      setTimeout(() => executeMove(pm.fromR, pm.fromC, pm.toR, pm.toC, false), 55);
      return;
    } else {
      renderBoard();
    }
  }

  if (!isOnlineGame && turn !== myColor && gameActive) {
    setTimeout(makeBotMove, 450);
  }
}

function makeBotMove() {
  if (!gameActive || isOnlineGame || turn === myColor) return;
  const allMoves = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] && board[r][c][0] === turn) {
        getLegalMovesForPiece(r, c).forEach(m => allMoves.push({ fromR: r, fromC: c, toR: m.toR, toC: m.toC }));
      }
    }
  }
  if (allMoves.length === 0) return;

  const pieceVals = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
  allMoves.sort((a, b) => {
    const capA = board[a.toR][a.toC] ? pieceVals[board[a.toR][a.toC][1]] || 0 : 0;
    const capB = board[b.toR][b.toC] ? pieceVals[board[b.toR][b.toC][1]] || 0 : 0;
    return capB - capA;
  });

  const level = Number(document.getElementById('botLevelSelect')?.value || 2);
  const poolSize = level === 3 ? 1 : (level === 2 ? 3 : 6);
  const topPool = allMoves.slice(0, Math.min(poolSize, allMoves.length));
  const chosen = topPool[Math.floor(Math.random() * topPool.length)];
  executeMove(chosen.fromR, chosen.fromC, chosen.toR, chosen.toC, false);
}

function findKing(color) {
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 8; c++)
      if (board[r][c] === color + 'K') return { r, c };
  return null;
}

function isSquareAttacked(r, c, byColor) {
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++) {
      const p = board[i][j];
      if (p && p[0] === byColor && getPseudoMoves(i, j, true).some(m => m.toR === r && m.toC === c)) return true;
    }
  return false;
}

function isKingInCheck(color) {
  const k = findKing(color);
  return k ? isSquareAttacked(k.r, k.c, color === 'w' ? 'b' : 'w') : false;
}

function getPseudoMoves(r, c, attackOnly = false) {
  const p = board[r][c];
  if (!p) return [];
  const color = p[0], type = p[1], moves = [];
  const inBounds = (nr, nc) => nr >= 0 && nr < 8 && nc >= 0 && nc < 8;

  if (type === 'P') {
    const dir = color === 'w' ? -1 : 1, startRow = color === 'w' ? 6 : 1;
    if (!attackOnly && inBounds(r + dir, c) && !board[r + dir][c]) {
      moves.push({ fromR: r, fromC: c, toR: r + dir, toC: c });
      if (r === startRow && !board[r + dir * 2][c]) moves.push({ fromR: r, fromC: c, toR: r + dir * 2, toC: c });
    }
    [-1, 1].forEach(dc => {
      const nr = r + dir, nc = c + dc;
      if (inBounds(nr, nc)) {
        if (board[nr][nc] && board[nr][nc][0] !== color) moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        else if (!attackOnly && epTarget && epTarget.r === nr && epTarget.c === nc) moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
      }
    });
  } else if (type === 'N') {
    [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc][0] !== color)) moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
    });
  } else if (type === 'K') {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && (!board[nr][nc] || board[nr][nc][0] !== color)) moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
    }
    if (!attackOnly && !isKingInCheck(color)) {
      const opp = color === 'w' ? 'b' : 'w';
      const row = color === 'w' ? 7 : 0;
      if (r === row && c === 4) {
        if (castling[color + 'K'] && board[row][7] === color + 'R' && !board[row][5] && !board[row][6]) {
          if (!isSquareAttacked(row, 5, opp) && !isSquareAttacked(row, 6, opp)) moves.push({ fromR: row, fromC: 4, toR: row, toC: 6 });
        }
        if (castling[color + 'Q'] && board[row][0] === color + 'R' && !board[row][1] && !board[row][2] && !board[row][3]) {
          if (!isSquareAttacked(row, 3, opp) && !isSquareAttacked(row, 2, opp)) moves.push({ fromR: row, fromC: 4, toR: row, toC: 2 });
        }
      }
    }
  } else {
    const dirs = [];
    if (type === 'R' || type === 'Q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
    if (type === 'B' || type === 'Q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
    dirs.forEach(([dr, dc]) => {
      let nr = r + dr, nc = c + dc;
      while (inBounds(nr, nc)) {
        if (!board[nr][nc]) moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        else { if (board[nr][nc][0] !== color) moves.push({ fromR: r, fromC: c, toR: nr, toC: nc }); break; }
        nr += dr; nc += dc;
      }
    });
  }
  return moves;
}

function getLegalMovesForPiece(r, c) {
  const p = board[r][c];
  if (!p) return [];
  const color = p[0];
  return getPseudoMoves(r, c, false).filter(m => {
    const sf = board[m.fromR][m.fromC], st = board[m.toR][m.toC];
    board[m.toR][m.toC] = sf; board[m.fromR][m.fromC] = null;
    const chk = isKingInCheck(color);
    board[m.fromR][m.fromC] = sf; board[m.toR][m.toC] = st;
    return !chk;
  });
}

function formatClock(sec) {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function startClock() {
  clearInterval(clockInterval);
  clockInterval = setInterval(() => {
    if (!gameActive) return;
    if (turn === 'w') whiteTime--; else blackTime--;
    document.getElementById('selfClock').textContent = formatClock(myColor === 'w' ? whiteTime : blackTime);
    document.getElementById('oppClock').textContent = formatClock(myColor === 'w' ? blackTime : whiteTime);
    if (whiteTime <= 0) endGame(myColor === 'b', 'کاتی سپی تەواو بوو!');
    else if (blackTime <= 0) endGame(myColor === 'w', 'کاتی ڕەش تەواو بوو!');
  }, 1000);
}

function resignGame() {
  if (isOnlineGame && roomRef) roomRef.child('winner').set(myColor === 'w' ? 'b' : 'w');
  endGame(false, 'خۆت بەدەستەوە دا');
}

function endGame(result, reason) {
  gameActive = false;
  clearInterval(clockInterval);
  playChessSound('end');
  if (roomRef) { roomRef.off(); roomRef = null; }
  document.getElementById('modalIcon').textContent = result === true ? '🏆' : '⚔️';
  document.getElementById('modalTitle').textContent = result === true ? 'سەرکەوتن!' : 'کۆتایی یاری';
  document.getElementById('modalSubtitle').textContent = reason;
  if (isOnlineGame) {
    document.getElementById('eloChangeBox').classList.remove('hidden');
    const res = calculateAndSaveElo('chess', opponentInfo.elo, result === true ? 1 : (result === 'draw' ? 0.5 : 0));
    document.getElementById('eloChangeText').textContent = `${res.oldElo} ➔ ${res.newElo} (${res.delta >= 0 ? '+' : ''}${res.delta})`;
  } else {
    document.getElementById('eloChangeBox').classList.add('hidden');
  }
  document.getElementById('gameOverModal').classList.remove('hidden');
}

function closeGameOverModal() {
  document.getElementById('gameOverModal').classList.add('hidden');
  document.getElementById('activeGameArea').classList.add('hidden');
  document.getElementById('chessSetupPanel').classList.remove('hidden');
}