/* ============================================================================
   YariKurdi — Live Royal Leaderboard & Persistent Elo/Daily Stats Engine (v1.0)
   • Real-Time Sync (no stuck loading) • Atomic Firebase Transactions (no reset)
   • Daily Auto-Reset at Midnight + All-Time • Top-3 Royal Podium • All Games
   ============================================================================ */

(function () {
  'use strict';

  const OWNER_UID = 'u_ahmadhassan';
  const OWNER_EMAIL = 'ah6753038@gmail.com';

  let activePeriod = 'alltime'; // 'daily' | 'alltime'
  let activeCategory = 'overall'; // 'overall' | 'chess' | 'domino' | 'ludo' | 'konkan' | 'coins'
  let playersListenerRef = null;
  let dailyListenerRef = null;
  let mySyncRef = null;
  let countdownInterval = null;

  let cachedPlayersMap = {};
  let cachedDailyMap = {};
  let lastPermissionError = false;

  const CATEGORIES = [
    { id: 'overall', label: '🏆 گشتی', unit: 'Elo' },
    { id: 'chess',   label: '♟️ شەتڕەنج', unit: 'Elo' },
    { id: 'domino',  label: '🁢 دۆمینە', unit: 'Elo' },
    { id: 'ludo',    label: '🎲 لودۆ', unit: 'Elo' },
    { id: 'konkan',  label: '🃏 کۆنکان', unit: 'Elo' },
    { id: 'coins',   label: '🪙 دەوڵەمەندان', unit: 'سکە' }
  ];

  /* --------------------------------------------------------------------------
     ١. یاریدەدەرەکان (Database, Date, Safe HTML)
     -------------------------------------------------------------------------- */
  function getDB() {
    if (typeof db !== 'undefined' && db && typeof db.ref === 'function') return db;
    if (window.db && typeof window.db.ref === 'function') return window.db;
    if (window.firebase && typeof firebase.database === 'function') return firebase.database();
    return null;
  }

  function getMyUid() {
    if (typeof playerId !== 'undefined' && playerId) return String(playerId);
    try {
      if (window.firebase && firebase.auth && firebase.auth().currentUser) {
        return String(firebase.auth().currentUser.uid);
      }
    } catch (e) {}
    return '';
  }

  function getMyName() {
    if (typeof playerName !== 'undefined' && playerName) return String(playerName);
    return 'یاریزان';
  }

  function getMyAvatar() {
    if (typeof playerAvatarData !== 'undefined' && playerAvatarData) return String(playerAvatarData);
    return '';
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function fallbackAvatar(name) {
    const ch = (String(name || 'ی').trim() || 'ی').charAt(0);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(ch)}&background=f59e0b&color=19092b&bold=true&size=128`;
  }

  // بەرواری ئەمڕۆ بە کاتی کوردستان (تا نیوەشەو خۆی نوێ ببێتەوە، نەک بە ڕیفرێش)
  function getTodayDateKey() {
    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Baghdad',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(now);
      if (/^\d{4}-\d{2}-\d{2}$/.test(parts)) return parts;
    } catch (e) {}
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getMidnightCountdown() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(24, 0, 0, 0);
    const diff = Math.max(0, Math.floor((end - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
    const s = String(diff % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  /* --------------------------------------------------------------------------
     ٢. ستایلی شاهانەی ڕیزبەندی (مۆر و زێڕین - 60 FPS)
     -------------------------------------------------------------------------- */
  function injectLeaderboardStyles() {
    if (document.getElementById('yk-lb-royal-styles')) return;
    const st = document.createElement('style');
    st.id = 'yk-lb-royal-styles';
    st.textContent = `
      .yk-lb-wrap {
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
        color: #fff;
        padding: 12px 10px 18px;
      }
      .yk-lb-period-bar {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        background: rgba(16, 6, 30, 0.85);
        border: 1px solid rgba(250, 204, 21, 0.35);
        border-radius: 16px;
        padding: 5px;
        margin-bottom: 10px;
      }
      .yk-lb-period-btn {
        padding: 9px 10px;
        border-radius: 12px;
        border: none;
        background: transparent;
        color: #c4b5fd;
        font-size: 12.5px;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.16s ease;
      }
      .yk-lb-period-btn.active {
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #19092b;
        box-shadow: 0 5px 16px rgba(234, 179, 8, 0.38);
      }
      .yk-lb-cat-scroll {
        display: flex;
        gap: 7px;
        overflow-x: auto;
        padding-bottom: 8px;
        margin-bottom: 8px;
        scrollbar-width: none;
      }
      .yk-lb-cat-scroll::-webkit-scrollbar { display: none; }
      .yk-lb-cat-chip {
        flex-shrink: 0;
        padding: 7px 13px;
        border-radius: 999px;
        border: 1px solid rgba(250, 204, 21, 0.3);
        background: rgba(34, 12, 58, 0.72);
        color: #e9d5ff;
        font-size: 11.5px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .yk-lb-cat-chip.active {
        background: linear-gradient(90deg, #f59e0b, #fde047);
        color: #19092b;
        border-color: #fef08a;
        box-shadow: 0 4px 12px rgba(250, 204, 21, 0.35);
      }
      .yk-lb-daily-banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: linear-gradient(90deg, rgba(244, 63, 94, 0.22), rgba(234, 179, 8, 0.2));
        border: 1px solid rgba(250, 204, 21, 0.45);
        border-radius: 14px;
        padding: 8px 12px;
        margin-bottom: 12px;
        font-size: 11.5px;
        font-weight: 800;
      }

      /* سەکۆی ٣ یەکەمەکان (Top 3 Podium) */
      .yk-lb-podium {
        display: grid;
        grid-template-columns: 1fr 1.16fr 1fr;
        align-items: end;
        gap: 8px;
        margin: 14px 0 16px;
        padding: 6px 2px 0;
      }
      .yk-pod-card {
        position: relative;
        text-align: center;
        border-radius: 20px;
        padding: 14px 6px 10px;
        cursor: pointer;
        transition: transform 0.16s ease;
        background: linear-gradient(180deg, rgba(58, 20, 102, 0.85) 0%, rgba(22, 7, 38, 0.94) 100%);
        border: 1.5px solid rgba(250, 204, 21, 0.35);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
      }
      .yk-pod-card:active { transform: scale(0.95); }
      .yk-pod-card.rank-1 {
        padding-top: 20px;
        background: linear-gradient(180deg, rgba(120, 53, 15, 0.65) 0%, rgba(46, 16, 101, 0.92) 55%, rgba(20, 6, 36, 0.96) 100%);
        border-color: #fde047;
        box-shadow: 0 0 26px rgba(250, 204, 21, 0.35), 0 12px 28px rgba(0, 0, 0, 0.6);
      }
      .yk-pod-crown {
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 24px;
        filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.7));
      }
      .yk-pod-av {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        margin: 0 auto 6px;
        padding: 2.5px;
        position: relative;
      }
      .yk-pod-card.rank-1 .yk-pod-av {
        width: 66px;
        height: 66px;
        background: linear-gradient(135deg, #fef08a, #f59e0b);
      }
      .yk-pod-card.rank-2 .yk-pod-av {
        background: linear-gradient(135deg, #f8fafc, #94a3b8);
      }
      .yk-pod-card.rank-3 .yk-pod-av {
        background: linear-gradient(135deg, #fdba74, #b45309);
      }
      .yk-pod-av img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background: #160726;
      }
      .yk-pod-rank-num {
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1px 7px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 900;
        color: #19092b;
        background: #fde047;
        border: 1.5px solid #19092b;
      }
      .yk-pod-name {
        font-size: 11.5px;
        font-weight: 900;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 4px;
      }
      .yk-pod-score {
        font-size: 13px;
        font-weight: 900;
        color: #fde047;
        margin-top: 2px;
      }
      .yk-pod-sub {
        font-size: 9.5px;
        color: #c4b5fd;
        margin-top: 1px;
      }

      /* ڕیزەکانی تر (#4 بەرەو خوارەوە) */
      .yk-lb-rows {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .yk-lb-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 16px;
        background: rgba(34, 12, 58, 0.72);
        border: 1px solid rgba(250, 204, 21, 0.22);
        cursor: pointer;
        transition: transform 0.14s ease, border-color 0.16s ease;
      }
      .yk-lb-row:hover { border-color: rgba(250, 204, 21, 0.6); }
      .yk-lb-row:active { transform: scale(0.98); }
      .yk-lb-row.is-me {
        background: linear-gradient(90deg, rgba(250, 204, 21, 0.22), rgba(76, 29, 149, 0.75));
        border: 1.5px solid #fde047;
      }
      .yk-lb-rank-pill {
        width: 30px;
        height: 30px;
        border-radius: 10px;
        background: rgba(16, 6, 30, 0.8);
        border: 1px solid rgba(250, 204, 21, 0.35);
        color: #fde047;
        font-size: 12px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .yk-lb-my-sticky {
        margin-top: 12px;
        padding: 11px 14px;
        border-radius: 18px;
        background: linear-gradient(90deg, #4c1d95 0%, #240b42 100%);
        border: 1.5px solid #fde047;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
      }
      .yk-lb-empty {
        text-align: center;
        padding: 28px 14px;
        background: rgba(22, 7, 38, 0.65);
        border: 1px dashed rgba(250, 204, 21, 0.35);
        border-radius: 18px;
        color: #d8b4fe;
        font-size: 12.5px;
      }
    `;
    document.head.appendChild(st);
  }

  /* --------------------------------------------------------------------------
     ٣. چارەسەری یەکجاریی سفرنەبوونەوەی خاڵەکان (Atomic Firebase Transactions)
     -------------------------------------------------------------------------- */
  function syncMyProfileFromServer(database, uid) {
    if (mySyncRef) mySyncRef.off();
    mySyncRef = database.ref(`players/${uid}`);
    mySyncRef.on('value', snap => {
      if (!snap.exists()) return;
      const d = snap.val() || {};
      if (typeof window.playerProfile === 'object' && window.playerProfile) {
        if (d.elo && typeof d.elo === 'object') {
          window.playerProfile.elo = Object.assign({ chess: 1200, domino: 1200, ludo: 1200, konkan: 1200 }, d.elo);
        }
        if (d.wins && typeof d.wins === 'object') {
          window.playerProfile.wins = Object.assign({}, d.wins);
        }
        if (d.games && typeof d.games === 'object') {
          window.playerProfile.games = Object.assign({}, d.games);
        }
        if (typeof d.xp !== 'undefined') window.playerProfile.xp = Number(d.xp) || 0;
        if (typeof d.coins !== 'undefined') window.playerProfile.coins = Number(d.coins) || 0;
        if (typeof window.updateProfileUI === 'function') {
          try { window.updateProfileUI(); } catch (e) {}
        }
      }
    });
  }

  // فەنکشنی گشتیی تۆمارکردنی هەر یارییەک (شەتڕەنج، دۆمینە، لودۆ، کۆنکان...) بەبێ سفربوونەوە
  window.recordYariGameResult = async function (gameKey, resultScore, opponentElo) {
    const database = getDB();
    const uid = getMyUid();
    if (!database || !uid) return null;

    const gKey = String(gameKey || 'chess').toLowerCase();
    const oppElo = Number(opponentElo) || 1200;
    const scoreVal = Number(resultScore); // 1 = win, 0.5 = draw, 0 = loss
    const todayKey = getTodayDateKey();

    // ١. نوێکردنەوەی Elo بە شێوەی سەلامەت لەسەر سێرڤەر (Transaction)
    let oldElo = 1200;
    let newElo = 1200;
    let delta = 0;

    await database.ref(`players/${uid}/elo/${gKey}`).transaction(cur => {
      oldElo = Number(cur) || 1200;
      const expected = 1 / (1 + Math.pow(10, (oppElo - oldElo) / 400));
      delta = Math.round(32 * (scoreVal - expected));
      if (scoreVal === 1 && delta < 8) delta = 8;
      newElo = Math.max(400, oldElo + delta);
      return newElo;
    });

    // ٢. زیادکردنی ژمارەی یاری و بردنەوە بەبێ سڕینەوەی کۆنەکان
    await database.ref(`players/${uid}/games/${gKey}`).transaction(c => (Number(c) || 0) + 1);
    if (scoreVal === 1) {
      await database.ref(`players/${uid}/wins/${gKey}`).transaction(c => (Number(c) || 0) + 1);
    }

    // ٣. پاراستنی ناو و وێنە لەناو تۆماری یاریزانەکەدا تا لە ڕیزبەندی دەربکەوێت
    const xpGain = scoreVal === 1 ? 25 : (scoreVal === 0.5 ? 12 : 5);
    await database.ref(`players/${uid}/xp`).transaction(c => (Number(c) || 0) + xpGain);
    await database.ref(`players/${uid}`).update({
      name: getMyName(),
      avatar: getMyAvatar() || '',
      lastPlayedAt: Date.now()
    });

    // ٤. تۆمارکردن لە ڕیزبەندیی ڕۆژانەی ئەمڕۆدا (leaderboards/daily/YYYY-MM-DD)
    const dailyPts = scoreVal === 1 ? 30 : (scoreVal === 0.5 ? 15 : 5);
    await database.ref(`leaderboards/daily/${todayKey}/${uid}`).transaction(cur => {
      const obj = (cur && typeof cur === 'object') ? cur : {};
      const byGame = (obj.byGame && typeof obj.byGame === 'object') ? obj.byGame : {};
      byGame[gKey] = (Number(byGame[gKey]) || 0) + dailyPts;
      return {
        name: getMyName(),
        avatar: getMyAvatar() || obj.avatar || '',
        points: (Number(obj.points) || 0) + dailyPts,
        wins: (Number(obj.wins) || 0) + (scoreVal === 1 ? 1 : 0),
        games: (Number(obj.games) || 0) + 1,
        byGame: byGame,
        updatedAt: Date.now()
      };
    });

    if (typeof window.awardGameXp === 'function') {
      try {
        window.awardGameXp(scoreVal === 1 ? 'win' : (scoreVal === 0.5 ? 'draw' : 'loss'));
      } catch (e) {}
    }

    return { oldElo, newElo, delta };
  };

  // جێگرتنەوەی فەنکشنی کۆنی calculateAndSaveElo تا هەموو یارییەکان خۆکارانە سیستەمە نوێیەکە بەکاربهێنن
  function overrideEloSaver() {
    window.calculateAndSaveElo = function (gameKey, opponentElo, resultScore) {
      const currentLocal = (window.playerProfile && window.playerProfile.elo && window.playerProfile.elo[gameKey]) || 1200;
      const expected = 1 / (1 + Math.pow(10, ((Number(opponentElo) || 1200) - currentLocal) / 400));
      let delta = Math.round(32 * (resultScore - expected));
      if (resultScore === 1 && delta < 8) delta = 8;
      const newElo = Math.max(400, currentLocal + delta);

      window.recordYariGameResult(gameKey, resultScore, opponentElo);
      return { oldElo: currentLocal, newElo, delta };
    };
  }

  /* --------------------------------------------------------------------------
     ٤. هێنانی داتا بە شێوەی زیندوو (Real-Time) لە Firebase
     -------------------------------------------------------------------------- */
  function attachLiveListeners() {
    const database = getDB();
    if (!database) return;

    if (!playersListenerRef) {
      playersListenerRef = database.ref('players');
      playersListenerRef.on(
        'value',
        snap => {
          lastPermissionError = false;
          cachedPlayersMap = (snap.exists() && snap.val()) ? snap.val() : {};
          renderRoyalLeaderboard();
        },
        err => {
          console.warn('Leaderboard players read error:', err);
          lastPermissionError = true;
          renderRoyalLeaderboard();
        }
      );
    }

    const todayKey = getTodayDateKey();
    if (!dailyListenerRef || dailyListenerRef._dateKey !== todayKey) {
      if (dailyListenerRef) dailyListenerRef.off();
      dailyListenerRef = database.ref(`leaderboards/daily/${todayKey}`);
      dailyListenerRef._dateKey = todayKey;
      dailyListenerRef.on(
        'value',
        snap => {
          cachedDailyMap = (snap.exists() && snap.val()) ? snap.val() : {};
          renderRoyalLeaderboard();
        },
        () => {
          cachedDailyMap = {};
        }
      );
    }
  }

  /* --------------------------------------------------------------------------
     ٥. هەژمارکردن و ڕیزکردنی یاریزانان
     -------------------------------------------------------------------------- */
  function buildRankedEntries() {
    const entries = [];

    if (activePeriod === 'daily') {
      Object.entries(cachedDailyMap || {}).forEach(([uid, d]) => {
        if (!d || typeof d !== 'object') return;
        const pInfo = cachedPlayersMap[uid] || {};
        const byGame = (d.byGame && typeof d.byGame === 'object') ? d.byGame : {};
        let score = 0;
        if (activeCategory === 'overall' || activeCategory === 'coins') {
          score = Number(d.points) || 0;
        } else {
          score = Number(byGame[activeCategory]) || 0;
        }
        if (score <= 0) return;

        entries.push({
          uid,
          name: d.name || pInfo.name || 'یاریزان',
          avatar: d.avatar || pInfo.avatar || pInfo.photo || '',
          score,
          wins: Number(d.wins) || 0,
          games: Number(d.games) || 0,
          isOwner: uid === OWNER_UID || String(pInfo.email || '').toLowerCase() === OWNER_EMAIL
        });
      });
    } else {
      Object.entries(cachedPlayersMap || {}).forEach(([uid, d]) => {
        if (!d || typeof d !== 'object') return;
        const name = d.name || d.username;
        if (!name) return;

        const eloObj = (d.elo && typeof d.elo === 'object') ? d.elo : {};
        const winsObj = (d.wins && typeof d.wins === 'object') ? d.wins : {};
        const gamesObj = (d.games && typeof d.games === 'object') ? d.games : {};

        const chessElo = Number(eloObj.chess) || 1200;
        const dominoElo = Number(eloObj.domino) || 1200;
        const ludoElo = Number(eloObj.ludo) || 1200;
        const konkanElo = Number(eloObj.konkan) || 1200;

        let score = 1200;
        let wins = 0;
        let games = 0;

        if (activeCategory === 'coins') {
          score = Number(d.coins) || 0;
          wins = Object.values(winsObj).reduce((s, v) => s + (Number(v) || 0), 0);
          games = Object.values(gamesObj).reduce((s, v) => s + (Number(v) || 0), 0);
        } else if (activeCategory === 'overall') {
          const activeElos = [chessElo, dominoElo];
          if (eloObj.ludo) activeElos.push(ludoElo);
          if (eloObj.konkan) activeElos.push(konkanElo);
          score = Math.round(activeElos.reduce((a, b) => a + b, 0) / activeElos.length);
          wins = Object.values(winsObj).reduce((s, v) => s + (Number(v) || 0), 0);
          games = Object.values(gamesObj).reduce((s, v) => s + (Number(v) || 0), 0);
        } else {
          score = Number(eloObj[activeCategory]) || 1200;
          wins = Number(winsObj[activeCategory]) || 0;
          games = Number(gamesObj[activeCategory]) || 0;
        }

        entries.push({
          uid,
          name: String(name),
          avatar: d.avatar || d.photo || '',
          score,
          wins,
          games,
          isOwner: uid === OWNER_UID || String(d.email || '').toLowerCase() === OWNER_EMAIL
        });
      });
    }

    entries.sort((a, b) => (b.score - a.score) || (b.wins - a.wins));
    return entries;
  }

  /* --------------------------------------------------------------------------
     ٦. نەخشاندنی ڕووکاری ڕیزبەندی لەناو #leaderboardList
     -------------------------------------------------------------------------- */
  function openPlayerFromLb(uid) {
    if (typeof window.openUserProfile === 'function') {
      window.openUserProfile(uid);
    }
  }
  window._ykLbOpenProfile = openPlayerFromLb;

  window.setLeaderboardPeriod = function (period) {
    activePeriod = period === 'daily' ? 'daily' : 'alltime';
    renderRoyalLeaderboard();
  };

  window.setLeaderboardCategory = function (cat) {
    activeCategory = cat || 'overall';
    syncLegacyTabHighlight(activeCategory);
    renderRoyalLeaderboard();
  };

  function syncLegacyTabHighlight(gameKey) {
    document.querySelectorAll('.lb-tab').forEach(btn => {
      btn.classList.remove('bg-yellow-500', 'text-[#050b18]');
      btn.classList.add('text-slate-300');
    });
    const tabBtn = document.getElementById('lb-tab-' + gameKey);
    if (tabBtn) {
      tabBtn.classList.remove('text-slate-300');
      tabBtn.classList.add('bg-yellow-500', 'text-[#050b18]');
    }
  }

  function renderPodiumCard(entry, rank, unit) {
    if (!entry) {
      return `
        <div class="yk-pod-card rank-${rank}" style="opacity:0.45;cursor:default;">
          <div class="yk-pod-av"><img src="${fallbackAvatar('؟')}" /></div>
          <div class="yk-pod-name">بەتاڵە</div>
          <div class="yk-pod-score">—</div>
        </div>
      `;
    }
    const crown = rank === 1 ? '<div class="yk-pod-crown">👑</div>' : '';
    const medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉');
    return `
      <div class="yk-pod-card rank-${rank}" onclick="_ykLbOpenProfile('${esc(entry.uid)}')">
        ${crown}
        <div class="yk-pod-av">
          <img src="${esc(entry.avatar || fallbackAvatar(entry.name))}" onerror="this.src='${fallbackAvatar(entry.name)}'" />
          <span class="yk-pod-rank-num">${medal} #${rank}</span>
        </div>
        <div class="yk-pod-name">${esc(entry.name)}</div>
        <div class="yk-pod-score">${entry.score.toLocaleString()} <span style="font-size:9.5px;color:#fef08a;">${unit}</span></div>
        <div class="yk-pod-sub">⚔️ ${entry.wins} بردنەوە</div>
      </div>
    `;
  }

  function renderRoyalLeaderboard() {
    const listEl = document.getElementById('leaderboardList');
    if (!listEl) return;

    injectLeaderboardStyles();
    const myUid = getMyUid();
    const catObj = CATEGORIES.find(c => c.id === activeCategory) || CATEGORIES[0];
    const unit = activePeriod === 'daily' ? 'خاڵ' : catObj.unit;

    const headerControls = `
      <div class="yk-lb-period-bar">
        <button class="yk-lb-period-btn ${activePeriod === 'alltime' ? 'active' : ''}" onclick="setLeaderboardPeriod('alltime')">
          👑 ڕیزبەندیی گشتی (هەمیشەیی)
        </button>
        <button class="yk-lb-period-btn ${activePeriod === 'daily' ? 'active' : ''}" onclick="setLeaderboardPeriod('daily')">
          🔥 پاڵەوانانی ئەمڕۆ (ڕۆژانە)
        </button>
      </div>
      <div class="yk-lb-cat-scroll">
        ${CATEGORIES.map(c => `
          <button class="yk-lb-cat-chip ${activeCategory === c.id ? 'active' : ''}" onclick="setLeaderboardCategory('${c.id}')">
            ${c.label}
          </button>
        `).join('')}
      </div>
      ${activePeriod === 'daily' ? `
        <div class="yk-lb-daily-banner">
          <span>🔥 خاڵەکانی ئەمڕۆت تۆمار دەبن و بە ڕیفرێش ناسڕێنەوە!</span>
          <span style="color:#fde047;white-space:nowrap;">⏳ <span id="yk-lb-countdown">${getMidnightCountdown()}</span></span>
        </div>
      ` : ''}
    `;

    if (lastPermissionError) {
      listEl.innerHTML = `
        <div class="yk-lb-wrap">
          ${headerControls}
          <div class="yk-lb-empty">
            <div style="font-size:28px;margin-bottom:6px;">🔒</div>
            <div style="font-weight:900;color:#fde047;margin-bottom:4px;">یاسای خوێندنەوەی Firebase داخراوە (Permission Denied)</div>
            <div>لە Firebase Realtime Database Rules ڕێگەی <code>".read": true</code> بۆ بەشی <code>players</code> و <code>leaderboards</code> بکەرەوە تا ڕیزبەندی یەکسەر دەربکەوێت.</div>
          </div>
        </div>
      `;
      return;
    }

    const entries = buildRankedEntries();

    if (entries.length === 0) {
      listEl.innerHTML = `
        <div class="yk-lb-wrap">
          ${headerControls}
          <div class="yk-lb-empty">
            <div style="font-size:32px;margin-bottom:6px;">🏆</div>
            <div style="font-weight:900;color:#fde047;margin-bottom:4px;">
              ${activePeriod === 'daily' ? 'هێشتا ئەمڕۆ کەس یاری نەکردووە!' : 'هێشتا هیچ یاریزانێک تۆمار نەکراوە'}
            </div>
            <div>یەکەم یاری بکە تا ناوت بچێتە سەرەوەی ڕیزبەندیی پاڵەوانان!</div>
          </div>
        </div>
      `;
      return;
    }

    // سەکۆی ٣ یەکەمەکان (ڕاست: #٢ ، ناوەڕاست: #١ ، چەپ: #٣)
    const podiumHtml = `
      <div class="yk-lb-podium">
        ${renderPodiumCard(entries[1], 2, unit)}
        ${renderPodiumCard(entries[0], 1, unit)}
        ${renderPodiumCard(entries[2], 3, unit)}
      </div>
    `;

    // ڕیزەکانی #4 تا #50
    const restHtml = entries.slice(3, 50).map((e, i) => {
      const rank = i + 4;
      const isMe = e.uid === myUid;
      const wr = e.games > 0 ? Math.round((e.wins / e.games) * 100) : 0;
      return `
        <div class="yk-lb-row ${isMe ? 'is-me' : ''}" onclick="_ykLbOpenProfile('${esc(e.uid)}')">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <span class="yk-lb-rank-pill">#${rank}</span>
            <img src="${esc(e.avatar || fallbackAvatar(e.name))}" onerror="this.src='${fallbackAvatar(e.name)}'"
              style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #fde047;flex-shrink:0;background:#160726;" />
            <div style="min-width:0;">
              <div style="font-size:13px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${esc(e.name)} ${e.isOwner ? '<span style="color:#fde047;font-size:11px;">👑</span>' : ''}
              </div>
              <div style="font-size:10.5px;color:#c4b5fd;">
                ⚔️ ${e.wins} بردنەوە ${e.games > 0 ? `• 📊 ${wr}%` : ''}
              </div>
            </div>
          </div>
          <div style="text-align:left;flex-shrink:0;">
            <div style="font-size:14px;font-weight:900;color:#fde047;">${e.score.toLocaleString()}</div>
            <div style="font-size:9.5px;color:#d8b4fe;">${unit}</div>
          </div>
        </div>
      `;
    }).join('');

    // کارتی پلەی خۆت لە خوارەوە
    const myIndex = entries.findIndex(e => e.uid === myUid);
    let myBarHtml = '';
    if (myIndex !== -1) {
      const meRow = entries[myIndex];
      const aboveRow = myIndex > 0 ? entries[myIndex - 1] : null;
      const gapText = aboveRow
        ? `تەنها ${(aboveRow.score - meRow.score + 1).toLocaleString()} ${unit} ماوە بۆ پلەی #${myIndex}!`
        : '👑 تۆ یەکەمی ڕیزبەندیت!';
      myBarHtml = `
        <div class="yk-lb-my-sticky" onclick="_ykLbOpenProfile('${esc(meRow.uid)}')" style="cursor:pointer;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="yk-lb-rank-pill" style="background:#fde047;color:#19092b;">#${myIndex + 1}</span>
            <div>
              <div style="font-size:12.5px;font-weight:900;color:#fde047;">پلەی ئێستای تۆ (${esc(meRow.name)})</div>
              <div style="font-size:10.5px;color:#e9d5ff;">${gapText}</div>
            </div>
          </div>
          <div style="font-size:15px;font-weight:900;color:#fde047;">${meRow.score.toLocaleString()}</div>
        </div>
      `;
    }

    listEl.innerHTML = `
      <div class="yk-lb-wrap">
        ${headerControls}
        ${podiumHtml}
        <div class="yk-lb-rows">${restHtml}</div>
        ${myBarHtml}
      </div>
    `;

    startDailyCountdownTimer();
  }

  function startDailyCountdownTimer() {
    if (countdownInterval) clearInterval(countdownInterval);
    if (activePeriod !== 'daily') return;
    countdownInterval = setInterval(() => {
      const el = document.getElementById('yk-lb-countdown');
      if (el) el.textContent = getMidnightCountdown();
    }, 1000);
  }

  /* --------------------------------------------------------------------------
     ٧. بەستنەوەی ئۆتۆماتیکی بە loadLeaderboard و پەڕەی سەرەکی
     -------------------------------------------------------------------------- */
  function overrideLoadLeaderboard() {
    window.loadLeaderboard = function (gameKey) {
      if (gameKey) activeCategory = gameKey;
      syncLegacyTabHighlight(activeCategory);
      attachLiveListeners();
      renderRoyalLeaderboard();
    };
  }

  function bootstrapLeaderboard() {
    injectLeaderboardStyles();
    overrideLoadLeaderboard();
    overrideEloSaver();

    const boot = setInterval(() => {
      overrideLoadLeaderboard();
      overrideEloSaver();
      const database = getDB();
      const uid = getMyUid();
      if (database) {
        attachLiveListeners();
        if (uid) {
          syncMyProfileFromServer(database, uid);
          clearInterval(boot);
        }
      }
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapLeaderboard);
  } else {
    bootstrapLeaderboard();
  }
})();