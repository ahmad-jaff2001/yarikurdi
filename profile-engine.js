/* ==========================================================================
   YariKurdi - Universal Player Profile, Friend Requests & Live Notifications
   ========================================================================== */

(function () {
  const OWNER_EMAIL = 'ah6753038@gmail.com';
  const OWNER_UID = 'u_ahmadhassan';

  let currentProfileUid = null;
  let incomingRequests = {};
  let myFriends = {};
  let initialLoadDone = false;
  let originalSelectGiftFn = null;

  function getRTDB() {
    if (typeof db !== 'undefined' && db && typeof db.ref === 'function') return db;
    if (window.db && typeof window.db.ref === 'function') return window.db;
    if (window.firebase && typeof firebase.database === 'function') return firebase.database();
    return null;
  }

  function getMe() {
    if (typeof playerId !== 'undefined' && playerId) {
      return {
        uid: playerId,
        name: (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزان',
        photo: (typeof playerAvatarData !== 'undefined' && playerAvatarData) ? playerAvatarData : ''
      };
    }
    if (window.firebase && typeof firebase.auth === 'function' && firebase.auth().currentUser) {
      const u = firebase.auth().currentUser;
      return {
        uid: u.uid,
        name: u.displayName || 'یاریزان',
        photo: u.photoURL || ''
      };
    }
    return null;
  }

  function defaultAvatar(name) {
    const letter = (name || 'ی').trim().charAt(0);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=f59e0b&color=0f172a&bold=true&size=128`;
  }

  function injectUI() {
    if (document.getElementById('yk-profile-styles')) return;

    const style = document.createElement('style');
    style.id = 'yk-profile-styles';
    style.textContent = `
      .yk-social-fab {
        position: fixed;
        top: 14px;
        left: 14px;
        z-index: 9985;
        background: rgba(15, 23, 42, 0.88);
        backdrop-filter: blur(10px);
        border: 1.5px solid rgba(250, 204, 21, 0.5);
        color: #facc15;
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
        transition: transform 0.15s ease;
      }
      .yk-social-fab:active { transform: scale(0.92); }
      .yk-badge-count {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #ef4444;
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        min-width: 20px;
        height: 20px;
        padding: 0 5px;
        border-radius: 999px;
        display: none;
        align-items: center;
        justify-content: center;
        border: 2px solid #0f172a;
      }
      .yk-toast {
        position: fixed;
        top: -110px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10050;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border: 1.5px solid #facc15;
        color: #fff;
        padding: 10px 16px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.75);
        transition: top 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        max-width: 92vw;
        direction: rtl;
      }
      .yk-toast.show { top: 16px; }
      .yk-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(5, 8, 20, 0.82);
        backdrop-filter: blur(8px);
        z-index: 10040;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        direction: rtl;
      }
      .yk-modal-backdrop.open { display: flex; }
      .yk-card {
        background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
        border: 1.5px solid rgba(250, 204, 21, 0.45);
        border-radius: 26px;
        width: 100%;
        max-width: 370px;
        padding: 22px;
        color: #fff;
        position: relative;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85);
        text-align: center;
      }
      .yk-close-btn {
        position: absolute;
        top: 14px;
        left: 14px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        border: none;
        color: #cbd5e1;
        font-size: 15px;
        cursor: pointer;
      }
      .yk-avatar-ring {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        padding: 3px;
        background: linear-gradient(135deg, #facc15, #f97316);
        margin: 0 auto 10px;
        box-shadow: 0 8px 25px rgba(250, 204, 21, 0.35);
      }
      .yk-avatar-ring img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background: #0f172a;
      }
      .yk-owner-tag {
        display: inline-block;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #fff;
        font-size: 11px;
        font-weight: 800;
        padding: 3px 12px;
        border-radius: 999px;
        margin-bottom: 6px;
      }
      .yk-stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin: 14px 0;
      }
      .yk-stat-box {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 14px;
        padding: 9px 6px;
      }
      .yk-stat-val { font-size: 16px; font-weight: 900; color: #facc15; }
      .yk-stat-lbl { font-size: 11px; color: #94a3b8; margin-top: 2px; }
      .yk-btn-primary {
        width: 100%;
        padding: 11px;
        border-radius: 14px;
        border: none;
        font-weight: 800;
        font-size: 14px;
        cursor: pointer;
        background: linear-gradient(135deg, #facc15, #eab308);
        color: #0f172a;
        box-shadow: 0 6px 20px rgba(250, 204, 21, 0.3);
      }
      .yk-btn-secondary {
        width: 100%;
        padding: 10px;
        border-radius: 14px;
        border: 1px solid rgba(251, 113, 133, 0.45);
        background: linear-gradient(135deg, rgba(244, 63, 94, 0.25), rgba(190, 18, 60, 0.35));
        color: #fecdd3;
        font-weight: 800;
        font-size: 13px;
        cursor: pointer;
        margin-top: 8px;
      }
      .yk-tabs {
        display: flex;
        gap: 8px;
        background: rgba(0, 0, 0, 0.35);
        padding: 5px;
        border-radius: 14px;
        margin: 12px 0;
      }
      .yk-tab {
        flex: 1;
        padding: 8px;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #94a3b8;
        font-weight: 800;
        font-size: 12.5px;
        cursor: pointer;
      }
      .yk-tab.active { background: #facc15; color: #0f172a; }
      .yk-list {
        max-height: 280px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        text-align: right;
      }
      .yk-list-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.06);
        padding: 9px 12px;
        border-radius: 14px;
      }
      .yk-mini-btn {
        padding: 6px 11px;
        border-radius: 10px;
        border: none;
        font-weight: 800;
        font-size: 12px;
        cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <button id="yk-social-fab" class="yk-social-fab" title="هاوڕێیان و داواکاری ئەد" onclick="openSocialInbox()">
        👥
        <span id="yk-req-badge" class="yk-badge-count">0</span>
      </button>

      <div id="yk-live-toast" class="yk-toast">
        <img id="yk-toast-img" src="" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:1.5px solid #facc15;" />
        <div style="text-align:right;flex:1;">
          <div style="font-weight:800;font-size:12.5px;color:#facc15;">داواکاری هاوڕێیەتی نوێ</div>
          <div id="yk-toast-msg" style="font-size:11.5px;color:#e2e8f0;"></div>
        </div>
        <button onclick="openSocialInbox(); document.getElementById('yk-live-toast').classList.remove('show');" class="yk-mini-btn" style="background:#facc15;color:#0f172a;">بینین</button>
      </div>

      <div id="yk-profile-modal" class="yk-modal-backdrop" onclick="if(event.target===this) closeUserProfile()">
        <div class="yk-card">
          <button class="yk-close-btn" onclick="closeUserProfile()">✕</button>
          <div class="yk-avatar-ring"><img id="yk-prof-img" src="" /></div>
          <div id="yk-prof-owner" class="yk-owner-tag" style="display:none;">خاوەنی پلاتفۆرم 👑</div>
          <h3 id="yk-prof-name" style="font-size:19px;font-weight:900;margin-bottom:3px;">...</h3>
          <div id="yk-prof-id" style="font-size:11px;color:#94a3b8;">ID: ...</div>

          <div class="yk-stats-grid">
            <div class="yk-stat-box">
              <div id="yk-prof-elo" class="yk-stat-val">1200</div>
              <div class="yk-stat-lbl">خاڵی ئێلۆ</div>
            </div>
            <div class="yk-stat-box">
              <div id="yk-prof-wins" class="yk-stat-val">0</div>
              <div class="yk-stat-lbl">بردنەوە</div>
            </div>
            <div class="yk-stat-box">
              <div id="yk-prof-level" class="yk-stat-val">1</div>
              <div class="yk-stat-lbl">ئاست</div>
            </div>
          </div>

          <div id="yk-prof-actions"></div>
        </div>
      </div>

      <div id="yk-inbox-modal" class="yk-modal-backdrop" onclick="if(event.target===this) closeSocialInbox()">
        <div class="yk-card">
          <button class="yk-close-btn" onclick="closeSocialInbox()">✕</button>
          <h3 style="font-size:17px;font-weight:900;color:#facc15;">هاوڕێیان و داواکارییەکان</h3>
          <div class="yk-tabs">
            <button id="yk-tab-req" class="yk-tab active" onclick="switchSocialTab('requests')">داواکارییەکان (<span id="yk-tab-req-count">0</span>)</button>
            <button id="yk-tab-fr" class="yk-tab" onclick="switchSocialTab('friends')">هاوڕێکانم (<span id="yk-tab-fr-count">0</span>)</button>
          </div>
          <div id="yk-inbox-list" class="yk-list"></div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper);
  }

  // بەستنەوەی ئۆتۆماتیکی بە کورسی و خانەخوێی ناو ژوورەکان بەبێ دەستکاریکردنی rooms-engine.js
  function hookRoomAndGameClicks() {
    if (typeof window.selectGiftRecipientAndOpen === 'function' && !window.selectGiftRecipientAndOpen._ykHooked) {
      originalSelectGiftFn = window.selectGiftRecipientAndOpen;
      window.selectGiftRecipientAndOpen = function (uid) {
        if (uid && uid !== 'ALL') {
          openUserProfile(uid);
        } else if (originalSelectGiftFn) {
          originalSelectGiftFn(uid);
        }
      };
      window.selectGiftRecipientAndOpen._ykHooked = true;
    }
  }

  // کلیککردن لەسەر ناوی یاریزانان لە چاتی ناو ژوور یان ڕیزبەندی
  document.addEventListener('click', async function (e) {
    const targetWithUid = e.target.closest('[data-uid]');
    if (targetWithUid) {
      const uid = targetWithUid.getAttribute('data-uid');
      if (uid) return openUserProfile(uid);
    }

    // چاتی ناو دیوەخان
    const chatBox = e.target.closest('#ykVip_ChatMessages');
    if (chatBox) {
      const msgRow = e.target.closest('#ykVip_ChatMessages > div');
      if (msgRow && typeof currentRoomMembers !== 'undefined' && currentRoomMembers) {
        const nameEl = msgRow.querySelector('.text-amber-300, strong');
        const clickedName = nameEl ? nameEl.textContent.trim() : '';
        if (clickedName) {
          const found = Object.entries(currentRoomMembers).find(([, m]) => m && m.name && m.name.trim() === clickedName);
          if (found) return openUserProfile(found[0]);
        }
      }
    }

    // لیستی ڕیزبەندی (Leaderboard)
    const lbRow = e.target.closest('#leaderboardList > div');
    if (lbRow) {
      const nameSpan = lbRow.querySelector('.text-white.font-bold');
      const clickedName = nameSpan ? nameSpan.textContent.trim() : '';
      const database = getRTDB();
      if (clickedName && database) {
        const snap = await database.ref('players').orderByChild('name').equalTo(clickedName).limitToFirst(1).once('value');
        if (snap.exists()) {
          const uid = Object.keys(snap.val())[0];
          if (uid) openUserProfile(uid);
        }
      }
    }
  });

  window.openUserProfile = async function (uid) {
    if (!uid) return;
    injectUI();
    currentProfileUid = uid;

    const modal = document.getElementById('yk-profile-modal');
    modal.classList.add('open');

    document.getElementById('yk-prof-name').textContent = 'چاوەڕوان بە...';
    document.getElementById('yk-prof-id').textContent = `ID: ${String(uid).slice(0, 12)}`;
    document.getElementById('yk-prof-img').src = defaultAvatar('?');
    document.getElementById('yk-prof-owner').style.display = 'none';
    document.getElementById('yk-prof-actions').innerHTML = '';

    const database = getRTDB();
    let userData = null;

    if (database) {
      try {
        const snap = await database.ref(`players/${uid}`).once('value');
        if (snap.exists()) userData = snap.val();
      } catch (e) {}
    }

    const roomMember = (typeof currentRoomMembers !== 'undefined' && currentRoomMembers) ? currentRoomMembers[uid] : null;
    const name = (userData && userData.name) || (roomMember && roomMember.name) || 'یاریزانی یاری کوردی';
    const photo = (userData && (userData.avatar || userData.photo)) || (roomMember && roomMember.avatar) || defaultAvatar(name);

    let eloVal = 1200;
    if (userData && userData.elo) {
      if (typeof userData.elo === 'object') {
        const vals = Object.values(userData.elo).map(Number).filter(n => !isNaN(n));
        if (vals.length) eloVal = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      } else {
        eloVal = Number(userData.elo) || 1200;
      }
    }

    let winsVal = 0;
    if (userData && userData.wins) {
      if (typeof userData.wins === 'object') {
        winsVal = Object.values(userData.wins).reduce((a, b) => a + (Number(b) || 0), 0);
      } else {
        winsVal = Number(userData.wins) || 0;
      }
    }

    const level = Math.max(1, Math.floor(winsVal / 5) + 1);
    const email = (userData && userData.email) || '';

    document.getElementById('yk-prof-name').textContent = name;
    document.getElementById('yk-prof-img').src = photo;
    document.getElementById('yk-prof-elo').textContent = eloVal;
    document.getElementById('yk-prof-wins').textContent = winsVal;
    document.getElementById('yk-prof-level').textContent = level;

    if (uid === OWNER_UID || email === OWNER_EMAIL) {
      document.getElementById('yk-prof-owner').style.display = 'inline-block';
    }

    renderProfileButtons(uid, name, photo);
  };

  window.closeUserProfile = function () {
    const modal = document.getElementById('yk-profile-modal');
    if (modal) modal.classList.remove('open');
  };

  window.openGiftForUserFromProfile = function (uid) {
    closeUserProfile();
    if (originalSelectGiftFn) originalSelectGiftFn(uid);
    else if (typeof openGiftDrawerModal === 'function') openGiftDrawerModal();
  };

  async function renderProfileButtons(targetUid, targetName, targetPhoto) {
    const actionsEl = document.getElementById('yk-prof-actions');
    const me = getMe();

    if (!me) {
      actionsEl.innerHTML = `<div style="font-size:12px;color:#94a3b8;">بۆ ناردنی ئەد سەرەتا ناوت تۆمار بکە</div>`;
      return;
    }
    if (me.uid === targetUid) {
      actionsEl.innerHTML = `<div style="font-size:13px;color:#facc15;font-weight:700;">ئەمە پڕۆفایلی خۆتە ✨</div>`;
      return;
    }

    const database = getRTDB();
    let status = 'none';

    if (myFriends[targetUid]) {
      status = 'friends';
    } else if (incomingRequests[targetUid]) {
      status = 'incoming';
    } else if (database) {
      const sentSnap = await database.ref(`friendRequests/${targetUid}/${me.uid}`).once('value');
      if (sentSnap.exists()) status = 'sent';
    }

    const safeName = targetName.replace(/'/g, '');
    let html = '';
    if (status === 'friends') {
      html = `<button class="yk-btn-primary" style="background:#10b981;color:#fff;" disabled>هاوڕێن ✓</button>`;
    } else if (status === 'sent') {
      html = `<button class="yk-btn-primary" style="background:#475569;color:#cbd5e1;" disabled>داواکاری نێردراوە ⏳</button>`;
    } else if (status === 'incoming') {
      html = `<button class="yk-btn-primary" onclick="acceptFriendRequest('${targetUid}', '${safeName}', '${targetPhoto}')">وەرگرتنی ئەد ✓</button>`;
    } else {
      html = `<button class="yk-btn-primary" onclick="sendFriendRequest('${targetUid}', '${safeName}', '${targetPhoto}')">ناردنی ئەد ➕</button>`;
    }

    if (typeof currentVoiceRoomId !== 'undefined' && currentVoiceRoomId) {
      html += `<button class="yk-btn-secondary" onclick="openGiftForUserFromProfile('${targetUid}')">ناردنی شاباش و دیاری ☕</button>`;
    }

    actionsEl.innerHTML = html;
  }

  window.sendFriendRequest = async function (targetUid, targetName, targetPhoto) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || me.uid === targetUid) return;

    await database.ref(`friendRequests/${targetUid}/${me.uid}`).set({
      uid: me.uid,
      name: me.name,
      photo: me.photo || defaultAvatar(me.name),
      timestamp: Date.now()
    });

    if (currentProfileUid === targetUid) {
      renderProfileButtons(targetUid, targetName, targetPhoto);
    }
  };

  window.acceptFriendRequest = async function (senderUid, senderName, senderPhoto) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database) return;

    const now = Date.now();
    await database.ref(`friends/${me.uid}/${senderUid}`).set({
      uid: senderUid,
      name: senderName,
      photo: senderPhoto || defaultAvatar(senderName),
      since: now
    });
    await database.ref(`friends/${senderUid}/${me.uid}`).set({
      uid: me.uid,
      name: me.name,
      photo: me.photo || defaultAvatar(me.name),
      since: now
    });
    await database.ref(`friendRequests/${me.uid}/${senderUid}`).remove();

    if (currentProfileUid === senderUid) {
      renderProfileButtons(senderUid, senderName, senderPhoto);
    }
    renderInboxList('requests');
  };

  window.declineFriendRequest = async function (senderUid) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database) return;
    await database.ref(`friendRequests/${me.uid}/${senderUid}`).remove();
    renderInboxList('requests');
  };

  let activeTab = 'requests';
  window.openSocialInbox = function () {
    injectUI();
    document.getElementById('yk-inbox-modal').classList.add('open');
    renderInboxList(activeTab);
  };

  window.closeSocialInbox = function () {
    document.getElementById('yk-inbox-modal').classList.remove('open');
  };

  window.switchSocialTab = function (tab) {
    activeTab = tab;
    document.getElementById('yk-tab-req').classList.toggle('active', tab === 'requests');
    document.getElementById('yk-tab-fr').classList.toggle('active', tab === 'friends');
    renderInboxList(tab);
  };

  function renderInboxList(tab) {
    const listEl = document.getElementById('yk-inbox-list');
    if (!listEl) return;

    if (tab === 'requests') {
      const reqs = Object.values(incomingRequests);
      if (reqs.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px;">هیچ داواکارییەکی نوێ نییە</div>`;
        return;
      }
      listEl.innerHTML = reqs.map(r => `
        <div class="yk-list-item">
          <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="closeSocialInbox(); openUserProfile('${r.uid}')">
            <img src="${r.photo || defaultAvatar(r.name)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
            <div>
              <div style="font-weight:800;font-size:13.5px;">${r.name}</div>
              <div style="font-size:11px;color:#94a3b8;">داوای هاوڕێیەتی دەکات</div>
            </div>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="yk-mini-btn" style="background:#10b981;color:#fff;" onclick="acceptFriendRequest('${r.uid}','${(r.name||'').replace(/'/g,'')}','${r.photo||''}')">✓</button>
            <button class="yk-mini-btn" style="background:#ef4444;color:#fff;" onclick="declineFriendRequest('${r.uid}')">✕</button>
          </div>
        </div>
      `).join('');
    } else {
      const frs = Object.values(myFriends);
      if (frs.length === 0) {
        listEl.innerHTML = `<div style="text-align:center;padding:24px;color:#94a3b8;font-size:13px;">هێشتا هیچ هاوڕێیەکت نییە</div>`;
        return;
      }
      listEl.innerHTML = frs.map(f => `
        <div class="yk-list-item" style="cursor:pointer;" onclick="closeSocialInbox(); openUserProfile('${f.uid}')">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${f.photo || defaultAvatar(f.name)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" />
            <div style="font-weight:800;font-size:13.5px;">${f.name}</div>
          </div>
          <span style="font-size:11px;color:#facc15;font-weight:700;">پڕۆفایل ←</span>
        </div>
      `).join('');
    }
  }

  function showLiveToast(req) {
    const toast = document.getElementById('yk-live-toast');
    if (!toast) return;
    document.getElementById('yk-toast-img').src = req.photo || defaultAvatar(req.name);
    document.getElementById('yk-toast-msg').textContent = `${req.name} داواکاری هاوڕێیەتی بۆ ناردیت!`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
  }

  function startRealtimeSync(myUid, database) {
    database.ref(`friendRequests/${myUid}`).on('value', snap => {
      const data = snap.val() || {};
      const prevKeys = Object.keys(incomingRequests);
      incomingRequests = data;

      const count = Object.keys(data).length;
      const badge = document.getElementById('yk-req-badge');
      const tabCount = document.getElementById('yk-tab-req-count');
      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      }
      if (tabCount) tabCount.textContent = count;

      if (initialLoadDone) {
        for (const key of Object.keys(data)) {
          if (!prevKeys.includes(key)) showLiveToast(data[key]);
        }
      }
      initialLoadDone = true;
      if (activeTab === 'requests') renderInboxList('requests');
    });

    database.ref(`friends/${myUid}`).on('value', snap => {
      myFriends = snap.val() || {};
      const tabFrCount = document.getElementById('yk-tab-fr-count');
      if (tabFrCount) tabFrCount.textContent = Object.keys(myFriends).length;
      if (activeTab === 'friends') renderInboxList('friends');
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    injectUI();
    hookRoomAndGameClicks();
  });

  const bootInterval = setInterval(() => {
    hookRoomAndGameClicks();
    const database = getRTDB();
    const me = getMe();
    if (database && me && me.uid) {
      injectUI();
      startRealtimeSync(me.uid, database);
      clearInterval(bootInterval);
    }
  }, 800);
})();