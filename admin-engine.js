/* ============================================================================
   YariKurdi — Owner Royal Admin Panel & Live Bazaar Engine (v1.0)
   • No-Code Image Upload & Auto-Compression (Covers, Frames, Room BGs, Banners)
   • Live Bazaar Publishing & Real Coin Purchasing + Instant Equip
   • Global Broadcast Alerts & Player Coin Manager (Visible ONLY to Owner)
   ============================================================================ */

(function () {
  'use strict';

  const OWNER_EMAIL = 'ah6753038@gmail.com';
  const OWNER_UIDS = ['u_ahmadhassan'];
  const OWNER_KEYWORD = 'ah6753038';

  let customBazaarItems = {};
  let activeAdminBanners = {};
  let activeAdminTab = 'market'; // 'market' | 'rooms' | 'banners' | 'coins'
  let pendingCompressedBase64 = '';
  let hooksInstalled = false;

  /* --------------------------------------------------------------------------
     ١. پشکنینی ناسنامەی خاوەنی پلاتفۆرم (تەنها بۆ ئەحمەد حەسەن)
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

  function getMyEmail() {
    try {
      if (typeof auth !== 'undefined' && auth && auth.currentUser && auth.currentUser.email) {
        return String(auth.currentUser.email);
      }
      if (window.firebase && firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.email) {
        return String(firebase.auth().currentUser.email);
      }
    } catch (e) {}
    return '';
  }

  function amIPlatformOwner() {
    const uid = getMyUid().trim().toLowerCase();
    const email = getMyEmail().trim().toLowerCase();
    if (email === OWNER_EMAIL) return true;
    if (uid && OWNER_UIDS.includes(uid)) return true;
    if (uid && uid.includes(OWNER_KEYWORD)) return true;
    return false;
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  /* --------------------------------------------------------------------------
     ٢. سووککردن و پاککردنەوەی خۆکاری وێنە لە مۆبایلەوە (Auto Image Compressor)
     -------------------------------------------------------------------------- */
  function compressImageFromInput(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('تکایە تەنها وێنە هەڵبژێرە'));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('نەتوانرا وێنەکە بخوێنرێتەوە'));
      reader.onload = ev => {
        const img = new Image();
        img.onerror = () => reject(new Error('فۆرماتی وێنەکە گونجاو نییە'));
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxWidth || h > maxHeight) {
            const ratio = Math.min(maxWidth / w, maxHeight / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);

          // ئەگەر PNG بێت بۆ چوارچێوە، شەفافیەتەکەی دەپارێزین؛ ئەگەرنا WebP/JPEG سووک
          const isPng = file.type === 'image/png';
          let dataUrl = canvas.toDataURL(isPng ? 'image/png' : 'image/webp', quality || 0.82);
          if (dataUrl.length > 260000) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          }
          resolve(dataUrl);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /* --------------------------------------------------------------------------
     ٣. ستایل و ڕووکاری پانێڵی کۆنترۆڵ + بەنەرەکانی پەڕەی سەرەکی
     -------------------------------------------------------------------------- */
  function injectAdminStylesAndDOM() {
    if (document.getElementById('yk-admin-styles')) return;

    const style = document.createElement('style');
    style.id = 'yk-admin-styles';
    style.textContent = `
      /* دوگمەی نهێنیی خاوەن (تەنها لای تۆ دەردەکەوێت) */
      .yk-owner-fab {
        position: fixed;
        top: 128px;
        left: 14px;
        z-index: 9985;
        height: 42px;
        padding: 0 12px;
        border-radius: 14px;
        background: linear-gradient(135deg, #fde047 0%, #d97706 100%);
        border: 2px solid #fffbeb;
        color: #19092b;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
        font-size: 12px;
        font-weight: 900;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(234, 179, 8, 0.55);
        transition: transform 0.15s ease;
      }
      .yk-owner-fab:active { transform: scale(0.92); }

      /* شریتی ئاگاداریی گشتی لە سەرەوەی شاشە */
      .yk-global-alert-bar {
        position: fixed;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10070;
        width: 92%;
        max-width: 480px;
        background: linear-gradient(90deg, #4c1d95 0%, #78350f 50%, #2e1065 100%);
        border: 1.5px solid #fde047;
        border-radius: 16px;
        padding: 10px 14px;
        color: #fff;
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.85);
      }

      /* بەنەرە زیندووەکانی پەڕەی سەرەکی */
      #yk-live-banners-slot {
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
        max-width: 960px;
        margin: 10px auto 6px;
        padding: 0 12px;
      }
      .yk-live-banner-card {
        position: relative;
        overflow: hidden;
        border-radius: 22px;
        border: 1.5px solid rgba(250, 204, 21, 0.55);
        background: linear-gradient(135deg, #2e1065, #160726);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.55);
        margin-bottom: 10px;
      }
      .yk-live-banner-card img {
        width: 100%;
        max-height: 185px;
        object-fit: cover;
        display: block;
      }
      .yk-live-banner-caption {
        padding: 10px 14px;
        background: linear-gradient(180deg, rgba(22, 7, 38, 0.88), rgba(16, 5, 28, 0.98));
      }

      /* مۆداڵی پانێڵی کۆنترۆڵی خاوەن */
      .yk-adm-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(8, 3, 18, 0.9);
        backdrop-filter: blur(10px);
        z-index: 10065;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 10px;
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      }
      .yk-adm-backdrop.open { display: flex; }
      .yk-adm-shell {
        width: 100%;
        max-width: 450px;
        max-height: 92dvh;
        overflow-y: auto;
        background: radial-gradient(circle at 50% 10%, #3b1169 0%, #19092b 65%, #10041e 100%);
        border: 1.5px solid #fde047;
        border-radius: 26px;
        padding: 18px;
        color: #fff;
        box-shadow: 0 25px 75px rgba(0, 0, 0, 0.92);
      }
      .yk-adm-tabs {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 5px;
        background: rgba(12, 4, 24, 0.85);
        padding: 4px;
        border-radius: 14px;
        border: 1px solid rgba(250, 204, 21, 0.3);
        margin: 12px 0;
      }
      .yk-adm-tab {
        padding: 8px 4px;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #d8b4fe;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
      }
      .yk-adm-tab.active {
        background: linear-gradient(180deg, #fde047, #eab308);
        color: #19092b;
      }
      .yk-adm-box {
        background: rgba(34, 12, 58, 0.72);
        border: 1px solid rgba(250, 204, 21, 0.32);
        border-radius: 18px;
        padding: 12px;
        margin-bottom: 12px;
      }
      .yk-adm-label {
        display: block;
        font-size: 11.5px;
        font-weight: 800;
        color: #fde047;
        margin-bottom: 5px;
      }
      .yk-adm-input, .yk-adm-select {
        width: 100%;
        padding: 9px 12px;
        border-radius: 12px;
        background: rgba(14, 5, 26, 0.9);
        border: 1px solid rgba(250, 204, 21, 0.4);
        color: #fff;
        font-size: 12.5px;
        margin-bottom: 10px;
        outline: none;
      }
      .yk-adm-input:focus, .yk-adm-select:focus { border-color: #fde047; }
      .yk-adm-file-drop {
        border: 1.5px dashed #fde047;
        background: rgba(250, 204, 21, 0.08);
        border-radius: 14px;
        padding: 12px;
        text-align: center;
        cursor: pointer;
        margin-bottom: 10px;
        font-size: 12px;
        color: #fef08a;
        font-weight: 800;
      }
      .yk-adm-gold-btn {
        width: 100%;
        padding: 11px;
        border-radius: 14px;
        border: 1.5px solid #fef08a;
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #19092b;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(234, 179, 8, 0.4);
      }
      .yk-adm-item-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: rgba(16, 6, 30, 0.8);
        border: 1px solid rgba(250, 204, 21, 0.25);
        border-radius: 13px;
        padding: 8px 10px;
        margin-top: 7px;
      }
    `;
    document.head.appendChild(style);

    const mount = document.createElement('div');
    mount.id = 'yk-admin-mount';
    mount.innerHTML = `
      <div id="yk-owner-fab-slot"></div>
      <div id="yk-global-alert-slot"></div>

      <div id="yk-admin-modal" class="yk-adm-backdrop" onclick="if(event.target===this) closeOwnerAdminPanel()">
        <div class="yk-adm-shell">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:22px;">👑</span>
              <div>
                <h3 style="margin:0;font-size:16px;font-weight:900;color:#fde047;">پانێڵی دەسەڵاتی خاوەن</h3>
                <div style="font-size:10.5px;color:#d8b4fe;">گۆڕانکاریی ڕاستەوخۆ بەبێ نووسینی کۆد</div>
              </div>
            </div>
            <button onclick="closeOwnerAdminPanel()" style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,0.1);border:1px solid #fde047;color:#fde047;font-weight:900;cursor:pointer;">✕</button>
          </div>

          <div class="yk-adm-tabs">
            <button id="yk-atab-market" class="yk-adm-tab active" onclick="switchOwnerAdminTab('market')">👑 کەڤەر و بازاڕ</button>
            <button id="yk-atab-rooms" class="yk-adm-tab" onclick="switchOwnerAdminTab('rooms')">🎙️ دیوەخانەکان</button>
            <button id="yk-atab-banners" class="yk-adm-tab" onclick="switchOwnerAdminTab('banners')">📢 بەنەر و ئاگاداری</button>
            <button id="yk-atab-coins" class="yk-adm-tab" onclick="switchOwnerAdminTab('coins')">🪙 سکە</button>
          </div>

          <div id="yk-admin-body"></div>
        </div>
      </div>
    `;
    document.body.appendChild(mount);
  }

  function renderOwnerFloatingButton() {
    const slot = document.getElementById('yk-owner-fab-slot');
    if (!slot) return;
    if (amIPlatformOwner()) {
      if (!slot.innerHTML) {
        slot.innerHTML = `
          <button class="yk-owner-fab" onclick="openOwnerAdminPanel()" title="پانێڵی کۆنترۆڵی خاوەنی پلاتفۆرم">
            <span>👑</span>
            <span>کۆنترۆڵ</span>
          </button>
        `;
      }
    } else {
      slot.innerHTML = '';
    }
  }

  /* --------------------------------------------------------------------------
     ٤. بەستنەوەی کاڵاکانی بازاڕ بە پڕۆفایل و کڕینی ڕاستەقینە بە سکە
     -------------------------------------------------------------------------- */
  window.buyCustomBazaarItem = async function (itemId) {
    const database = getDB();
    const uid = getMyUid();
    const item = customBazaarItems[itemId];
    if (!database || !uid || !item) return;

    const price = Math.max(0, Number(item.price) || 0);
    const ownedField = item.kind === 'frame' ? 'ownedFrames' : 'ownedCovers';
    const equipField = item.kind === 'frame' ? 'equippedFrame' : 'equippedCover';

    if (price === 0 || amIPlatformOwner()) {
      await database.ref(`players/${uid}/${ownedField}/${itemId}`).set(true);
      await database.ref(`players/${uid}/${equipField}`).set(itemId);
      alert(`✅ «${item.title}» بە سەرکەوتوویی لەسەر پڕۆفایلەکەت چالاک کرا!`);
      if (typeof window.openUserProfile === 'function') window.openUserProfile(uid);
      return;
    }

    if (!confirm(`ئایا دڵنیایت لە کڕینی «${item.title}» بە 🪙 ${price.toLocaleString()} سکە؟`)) return;

    let notEnough = false;
    await database.ref(`players/${uid}/coins`).transaction(cur => {
      const bal = Number(cur) || 0;
      if (bal < price) {
        notEnough = true;
        return; // هەڵوەشاندنەوە
      }
      return bal - price;
    });

    if (notEnough) {
      alert('❌ سکەی پێویستت نییە بۆ کڕینی ئەم کاڵایە!');
      return;
    }

    await database.ref(`players/${uid}/${ownedField}/${itemId}`).set(true);
    await database.ref(`players/${uid}/${equipField}`).set(itemId);
    alert(`🎉 پیرۆزە! «${item.title}» کڕدرا و لەسەر پڕۆفایلەکەت چالاک کرا.`);
    if (typeof window.openUserProfile === 'function') window.openUserProfile(uid);
  };

  window.equipCustomBazaarItem = async function (itemId) {
    const database = getDB();
    const uid = getMyUid();
    const item = customBazaarItems[itemId];
    if (!database || !uid || !item) return;

    const equipField = item.kind === 'frame' ? 'equippedFrame' : 'equippedCover';
    await database.ref(`players/${uid}/${equipField}`).set(itemId);
    if (typeof window.openUserProfile === 'function') window.openUserProfile(uid);
  };

  // بەستنەوەی ڕاستەوخۆ بە پڕۆفایلە شاهانەکە تا وێنە نوێیەکان لە کەڤەر، چوارچێوە و تابی ستایل دەربکەون
  function installProfileBazaarHooks() {
    if (hooksInstalled) return;
    if (typeof window.openUserProfile !== 'function' || typeof window.switchProfileTab !== 'function') return;
    hooksInstalled = true;

    const origOpenProfile = window.openUserProfile;
    window.openUserProfile = async function (uid) {
      await origOpenProfile.apply(this, arguments);
      const targetUid = String(uid || getMyUid() || '');
      const database = getDB();
      if (!database || !targetUid) return;

      try {
        const snap = await database.ref(`players/${targetUid}`).once('value');
        const pData = snap.val() || {};
        const eqCover = pData.equippedCover;
        const eqFrame = pData.equippedFrame;

        if (eqCover && customBazaarItems[eqCover] && customBazaarItems[eqCover].imageUrl) {
          const coverBox = document.getElementById('yk-prof-cover-box');
          if (coverBox) {
            coverBox.innerHTML = `
              <img src="${customBazaarItems[eqCover].imageUrl}" style="width:100%;height:100%;object-fit:cover;display:block;" />
              <div class="yk-cover-fade"></div>
            `;
          }
        }
        if (eqFrame && customBazaarItems[eqFrame] && customBazaarItems[eqFrame].imageUrl) {
          const frameBox = document.getElementById('yk-prof-frame-box');
          if (frameBox) {
            frameBox.innerHTML = `
              <img src="${customBazaarItems[eqFrame].imageUrl}" style="position:absolute;inset:-22px;width:calc(100% + 44px);height:calc(100% + 44px);object-fit:contain;pointer-events:none;z-index:8;" />
            `;
          }
        }
      } catch (e) {}
    };

    const origSwitchTab = window.switchProfileTab;
    window.switchProfileTab = async function (tab) {
      origSwitchTab.apply(this, arguments);
      if (tab !== 'wardrobe') return;

      const body = document.getElementById('yk-prof-tab-body');
      const items = Object.entries(customBazaarItems);
      if (!body || items.length === 0) return;

      const meUid = getMyUid();
      const idEl = document.getElementById('yk-prof-id-text');
      const viewedIdSnippet = idEl ? idEl.textContent.replace('ID:', '').trim() : '';
      const isViewingMe = !viewedIdSnippet || (meUid && meUid.startsWith(viewedIdSnippet));

      let myPlayerData = {};
      const database = getDB();
      if (database && meUid) {
        try {
          const s = await database.ref(`players/${meUid}`).once('value');
          if (s.exists()) myPlayerData = s.val() || {};
        } catch (e) {}
      }

      const customCardsHtml = items.map(([id, item]) => {
        const ownedMap = item.kind === 'frame' ? (myPlayerData.ownedFrames || {}) : (myPlayerData.ownedCovers || {});
        const eqId = item.kind === 'frame' ? myPlayerData.equippedFrame : myPlayerData.equippedCover;
        const isOwned = amIPlatformOwner() || Number(item.price) === 0 || !!ownedMap[id];
        const isEquipped = eqId === id;

        let actionHtml = '';
        if (!isViewingMe) {
          actionHtml = `<span style="font-size:11px;color:#fde047;font-weight:800;">🪙 ${Number(item.price).toLocaleString()}</span>`;
        } else if (isEquipped) {
          actionHtml = `<span style="padding:5px 10px;border-radius:10px;background:#10b981;color:#fff;font-size:11px;font-weight:900;">چالاکە ✓</span>`;
        } else if (isOwned) {
          actionHtml = `<button onclick="equipCustomBazaarItem('${esc(id)}')" class="yk-mini-act" style="background:#fde047;color:#19092b;">چالاککردن</button>`;
        } else {
          actionHtml = `<button onclick="buyCustomBazaarItem('${esc(id)}')" class="yk-mini-act" style="background:linear-gradient(180deg,#fde047,#eab308);color:#19092b;">کڕین 🪙 ${Number(item.price).toLocaleString()}</button>`;
        }

        return `
          <div class="yk-wardrobe-item ${isEquipped ? 'active-eq' : ''}">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;">
              <img src="${item.imageUrl}" style="width:46px;height:46px;border-radius:12px;object-fit:cover;border:1.5px solid #fde047;flex-shrink:0;background:#120520;" />
              <div style="min-width:0;">
                <div style="font-size:12px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                  ${esc(item.title)}
                </div>
                <div style="font-size:10px;color:#fde047;font-weight:800;">
                  ${item.kind === 'frame' ? '👑 چوارچێوەی پڕۆفایل' : '🏰 کەڤەری پڕۆفایل'}
                </div>
              </div>
            </div>
            <div style="flex-shrink:0;">${actionHtml}</div>
          </div>
        `;
      }).join('');

      const extraPanel = document.createElement('div');
      extraPanel.className = 'yk-card-panel';
      extraPanel.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span class="yk-ribbon">🏪 بازاڕی کەڤەر و چوارچێوەکان</span>
          <span style="font-size:10.5px;color:#34d399;font-weight:800;">نوێ ✨</span>
        </div>
        ${customCardsHtml}
      `;
      body.prepend(extraPanel);
    };
  }

  /* --------------------------------------------------------------------------
     ٥. بەڕێوەبردنی UIـی پانێڵی کۆنترۆڵی خاوەن
     -------------------------------------------------------------------------- */
  window.openOwnerAdminPanel = function () {
    if (!amIPlatformOwner()) return;
    injectAdminStylesAndDOM();
    pendingCompressedBase64 = '';
    document.getElementById('yk-admin-modal').classList.add('open');
    renderOwnerAdminBody();
  };

  window.closeOwnerAdminPanel = function () {
    const m = document.getElementById('yk-admin-modal');
    if (m) m.classList.remove('open');
  };

  window.switchOwnerAdminTab = function (tab) {
    activeAdminTab = tab;
    pendingCompressedBase64 = '';
    ['market', 'rooms', 'banners', 'coins'].forEach(t => {
      const b = document.getElementById('yk-atab-' + t);
      if (b) b.classList.toggle('active', t === tab);
    });
    renderOwnerAdminBody();
  };

  window.handleAdminFileSelected = async function (inputEl, maxW, maxH) {
    const file = inputEl && inputEl.files && inputEl.files[0];
    if (!file) return;
    const previewBox = document.getElementById('yk-adm-preview-slot');
    if (previewBox) previewBox.innerHTML = `<div style="font-size:11.5px;color:#fde047;">خەریکی ئامادەکردن و سووککردنی وێنەکەین...</div>`;
    try {
      pendingCompressedBase64 = await compressImageFromInput(file, maxW || 640, maxH || 360, 0.84);
      if (previewBox) {
        previewBox.innerHTML = `<img src="${pendingCompressedBase64}" style="max-height:125px;border-radius:12px;margin:4px auto;display:block;border:1.5px solid #fde047;" />`;
      }
    } catch (err) {
      alert(err.message || 'هەڵە لە هەڵبژاردنی وێنە');
    }
  };

  async function renderOwnerAdminBody() {
    const body = document.getElementById('yk-admin-body');
    if (!body) return;

    if (activeAdminTab === 'market') {
      const existingList = Object.entries(customBazaarItems).map(([id, it]) => `
        <div class="yk-adm-item-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <img src="${it.imageUrl}" style="width:38px;height:38px;border-radius:10px;object-fit:cover;border:1px solid #fde047;" />
            <div style="min-width:0;">
              <div style="font-size:12px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(it.title)}</div>
              <div style="font-size:10px;color:#fde047;">${it.kind === 'frame' ? 'چوارچێوە' : 'کەڤەر'} • 🪙 ${Number(it.price).toLocaleString()}</div>
            </div>
          </div>
          <div style="display:flex;gap:5px;">
            <button onclick="equipCustomBazaarItem('${esc(id)}')" style="padding:5px 8px;border-radius:8px;border:none;background:#10b981;color:#fff;font-size:10.5px;font-weight:900;cursor:pointer;">بۆ خۆم</button>
            <button onclick="deleteCustomBazaarItem('${esc(id)}')" style="padding:5px 8px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:10.5px;font-weight:900;cursor:pointer;">🗑️</button>
          </div>
        </div>
      `).join('');

      body.innerHTML = `
        <div class="yk-adm-box">
          <label class="yk-adm-label">١. جۆری کاڵا هەڵبژێرە:</label>
          <select id="yk-adm-item-kind" class="yk-adm-select">
            <option value="cover">🏰 کەڤەری پشتەوەی پڕۆفایل (Cover)</option>
            <option value="frame">👑 چوارچێوەی دەوری وێنەی پڕۆفایل (Frame)</option>
          </select>

          <label class="yk-adm-label">٢. وێنە لە مۆبایل یان کۆمپیوتەر هەڵبژێرە:</label>
          <div class="yk-adm-file-drop" onclick="document.getElementById('yk-adm-file-inp').click()">
            📸 کلیک لێرە بکە بۆ هەڵبژاردنی وێنە لە گەلەری
            <input id="yk-adm-file-inp" type="file" accept="image/*" style="display:none;" onchange="handleAdminFileSelected(this, 640, 360)" />
            <div id="yk-adm-preview-slot"></div>
          </div>

          <label class="yk-adm-label">٣. ناوی کەڤەر یان چوارچێوەکە:</label>
          <input id="yk-adm-item-title" class="yk-adm-input" placeholder="بۆ نموونە: کەڤەری شەوی کەلار" />

          <label class="yk-adm-label">٤. نرخی فرۆشتن لە بازاڕ (بە سکە 🪙):</label>
          <input id="yk-adm-item-price" type="number" class="yk-adm-input" value="2500" min="0" />

          <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:#fef08a;font-weight:800;margin-bottom:12px;cursor:pointer;">
            <input id="yk-adm-equip-now" type="checkbox" checked style="width:16px;height:16px;accent-color:#fde047;" />
            ڕاستەوخۆ لەسەر پڕۆفایلەکەی خۆشم چالاکی بکە 👑
          </label>

          <button class="yk-adm-gold-btn" onclick="publishCustomBazaarItem()">بڵاوکردنەوە لە بازاڕ و پڕۆفایل ✨</button>
        </div>

        <div class="yk-adm-box">
          <div class="yk-adm-label">کاڵا زیادکراوەکانی ئێستا (${Object.keys(customBazaarItems).length}):</div>
          ${existingList || '<div style="font-size:11.5px;color:#c4b5fd;">هێشتا هیچ کەڤەر یان چوارچێوەیەکت زیاد نەکردووە.</div>'}
        </div>
      `;
    } else if (activeAdminTab === 'rooms') {
      const database = getDB();
      let roomsOptions = '<option value="">-- دیوەخانێک هەڵبژێرە --</option>';
      if (database) {
        try {
          const snap = await database.ref('voiceRooms').once('value');
          snap.forEach(c => {
            const r = c.val();
            if (r && r.title) {
              roomsOptions += `<option value="${esc(c.key)}">${esc(r.title)} (${esc(r.hostName || '')})</option>`;
            }
          });
        } catch (e) {}
      }

      body.innerHTML = `
        <div class="yk-adm-box">
          <label class="yk-adm-label">١. دیوەخانێک هەڵبژێرە بۆ گۆڕینی وێنەکەی:</label>
          <select id="yk-adm-room-select" class="yk-adm-select">${roomsOptions}</select>

          <label class="yk-adm-label">٢. وێنەی پاشبنەمای دیوەخان هەڵبژێرە:</label>
          <div class="yk-adm-file-drop" onclick="document.getElementById('yk-adm-room-file').click()">
            🖼️ هەڵبژاردنی وێنە بۆ ناو ژوورەکە
            <input id="yk-adm-room-file" type="file" accept="image/*" style="display:none;" onchange="handleAdminFileSelected(this, 720, 480)" />
            <div id="yk-adm-preview-slot"></div>
          </div>

          <button class="yk-adm-gold-btn" onclick="applyRoomCustomBackground()">دانانی وێنەکە لەسەر دیوەخانەکە 🎙️</button>
        </div>
      `;
    } else if (activeAdminTab === 'banners') {
      const bannersList = Object.entries(activeAdminBanners).map(([id, b]) => `
        <div class="yk-adm-item-row">
          <div style="min-width:0;">
            <div style="font-size:12px;font-weight:900;color:#fde047;">${esc(b.title || 'بەنەر')}</div>
            <div style="font-size:10.5px;color:#e9d5ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(b.text || '')}</div>
          </div>
          <button onclick="deleteAdminBanner('${esc(id)}')" style="padding:5px 9px;border-radius:8px;border:none;background:#ef4444;color:#fff;font-size:11px;font-weight:900;cursor:pointer;">🗑️</button>
        </div>
      `).join('');

      body.innerHTML = `
        <div class="yk-adm-box">
          <label class="yk-adm-label">📢 ئاگاداریی خێرا بۆ سەر شاشەی هەموو یاریزانان:</label>
          <input id="yk-adm-alert-inp" class="yk-adm-input" placeholder="بۆ نموونە: ئەمشەو کاتژمێر ١٠ جامی شەتڕەنج دەست پێ دەکات!" />
          <div style="display:flex;gap:6px;">
            <button class="yk-adm-gold-btn" onclick="sendGlobalAnnouncement()">ناردنی ئاگاداری ⚡</button>
            <button onclick="clearGlobalAnnouncement()" style="padding:0 12px;border-radius:14px;border:1px solid #ef4444;background:rgba(239,68,68,0.2);color:#fca5a5;font-size:11.5px;font-weight:900;cursor:pointer;">لابردن</button>
          </div>
        </div>

        <div class="yk-adm-box">
          <label class="yk-adm-label">🖼️ زیادکردنی بەنەر و نووسین بۆ پەڕەی سەرەکی:</label>
          <div class="yk-adm-file-drop" onclick="document.getElementById('yk-adm-banner-file').click()">
            📸 هەڵبژاردنی وێنەی بەنەر (ئارەزوومەندانە)
            <input id="yk-adm-banner-file" type="file" accept="image/*" style="display:none;" onchange="handleAdminFileSelected(this, 760, 320)" />
            <div id="yk-adm-preview-slot"></div>
          </div>
          <input id="yk-adm-banner-title" class="yk-adm-input" placeholder="ناونیشانی بەنەر..." />
          <input id="yk-adm-banner-text" class="yk-adm-input" placeholder="نووسین یان وردەکاری..." />
          <button class="yk-adm-gold-btn" onclick="publishHomeBanner()">بڵاوکردنەوە لە پەڕەی سەرەکی ✨</button>
          ${bannersList}
        </div>
      `;
    } else if (activeAdminTab === 'coins') {
      body.innerHTML = `
        <div class="yk-adm-box">
          <label class="yk-adm-label">ئایدی (ID) یان ناوی تەواوی یاریزان:</label>
          <input id="yk-adm-coin-target" class="yk-adm-input" value="${esc(getMyUid())}" placeholder="ID یاریزان بنووسە..." />

          <label class="yk-adm-label">بڕی سکە بۆ زیادکردن (🪙):</label>
          <input id="yk-adm-coin-amount" type="number" class="yk-adm-input" value="10000" />

          <button class="yk-adm-gold-btn" onclick="giftCoinsToPlayer()">زیادکردنی سکە بۆ هەژمارەکە 🪙</button>
        </div>
      `;
    }
  }

  /* --------------------------------------------------------------------------
     ٦. فەنکشنەکانی جێبەجێکردن لە Firebase
     -------------------------------------------------------------------------- */
  window.publishCustomBazaarItem = async function () {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    if (!database) return;

    const kind = document.getElementById('yk-adm-item-kind').value;
    const title = document.getElementById('yk-adm-item-title').value.trim();
    const price = Math.max(0, Number(document.getElementById('yk-adm-item-price').value) || 0);
    const equipNow = document.getElementById('yk-adm-equip-now').checked;

    if (!pendingCompressedBase64) {
      alert('تکایە سەرەتا وێنەیەک هەڵبژێرە!');
      return;
    }
    if (!title) {
      alert('تکایە ناوێک بۆ کەڤەر یان چوارچێوەکە بنووسە!');
      return;
    }

    const itemId = 'custom_' + kind + '_' + Date.now();
    await database.ref(`bazaarItems/${itemId}`).set({
      kind,
      title,
      price,
      imageUrl: pendingCompressedBase64,
      createdAt: Date.now()
    });

    if (equipNow) {
      const uid = getMyUid();
      const equipField = kind === 'frame' ? 'equippedFrame' : 'equippedCover';
      const ownedField = kind === 'frame' ? 'ownedFrames' : 'ownedCovers';
      if (uid) {
        await database.ref(`players/${uid}/${ownedField}/${itemId}`).set(true);
        await database.ref(`players/${uid}/${equipField}`).set(itemId);
      }
    }

    pendingCompressedBase64 = '';
    alert(`✅ «${title}» بە سەرکەوتوویی بڵاوکرایەوە!`);
    renderOwnerAdminBody();
  };

  window.deleteCustomBazaarItem = async function (itemId) {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    if (!database || !confirm('دڵنیایت لە سڕینەوەی ئەم کاڵایە لە بازاڕ؟')) return;
    await database.ref(`bazaarItems/${itemId}`).remove();
    renderOwnerAdminBody();
  };

  window.applyRoomCustomBackground = async function () {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    const roomId = document.getElementById('yk-adm-room-select').value;
    if (!database || !roomId) {
      alert('تکایە سەرەتا دیوەخانێک هەڵبژێرە!');
      return;
    }
    if (!pendingCompressedBase64) {
      alert('تکایە وێنەیەک هەڵبژێرە!');
      return;
    }
    await database.ref(`voiceRooms/${roomId}/customBg`).set(pendingCompressedBase64);
    pendingCompressedBase64 = '';
    alert('✅ وێنەی دیوەخانەکە بە سەرکەوتوویی گۆڕدرا!');
  };

  window.sendGlobalAnnouncement = async function () {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    const msg = document.getElementById('yk-adm-alert-inp').value.trim();
    if (!database || !msg) return;
    await database.ref('globalAnnouncements/current').set({
      text: msg,
      createdAt: Date.now()
    });
    alert('✅ ئاگادارییەکە نێردرا بۆ شاشەی هەموو یاریزانان!');
  };

  window.clearGlobalAnnouncement = async function () {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    if (!database) return;
    await database.ref('globalAnnouncements/current').remove();
    alert('ئاگادارییەکە لابرا.');
  };

  window.publishHomeBanner = async function () {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    const title = document.getElementById('yk-adm-banner-title').value.trim();
    const text = document.getElementById('yk-adm-banner-text').value.trim();
    if (!database || (!title && !text && !pendingCompressedBase64)) {
      alert('تکایە وێنەیەک یان نووسینێک دابنێ!');
      return;
    }
    const bId = 'bnr_' + Date.now();
    await database.ref(`adminBanners/${bId}`).set({
      title,
      text,
      imageUrl: pendingCompressedBase64 || '',
      createdAt: Date.now()
    });
    pendingCompressedBase64 = '';
    alert('✅ بەنەرەکە لە پەڕەی سەرەکی بڵاوکرایەوە!');
    renderOwnerAdminBody();
  };

  window.deleteAdminBanner = async function (bId) {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    if (!database) return;
    await database.ref(`adminBanners/${bId}`).remove();
    renderOwnerAdminBody();
  };

  window.giftCoinsToPlayer = async function () {
    if (!amIPlatformOwner()) return;
    const database = getDB();
    const query = document.getElementById('yk-adm-coin-target').value.trim();
    const amount = Number(document.getElementById('yk-adm-coin-amount').value) || 0;
    if (!database || !query || amount === 0) return;

    let targetUid = query;
    const directSnap = await database.ref(`players/${query}`).once('value');
    if (!directSnap.exists()) {
      const allSnap = await database.ref('players').once('value');
      allSnap.forEach(c => {
        const d = c.val() || {};
        if (String(d.name || '').trim().toLowerCase() === query.toLowerCase()) {
          targetUid = c.key;
        }
      });
    }

    await database.ref(`players/${targetUid}/coins`).transaction(cur => (Number(cur) || 0) + amount);
    alert(`✅ بڕی 🪙 ${amount.toLocaleString()} سکە زیادکرا بۆ هەژماری (${targetUid})`);
  };

  /* --------------------------------------------------------------------------
     ٧. پەخشکردنی ڕاستەوخۆی بەنەر و ئاگادارییەکان بۆ هەموو یاریزانان
     -------------------------------------------------------------------------- */
  function renderHomeBannersSlot() {
    let slot = document.getElementById('yk-live-banners-slot');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'yk-live-banners-slot';
      const header = document.querySelector('header, nav');
      if (header && header.parentElement) {
        header.insertAdjacentElement('afterend', slot);
      } else {
        document.body.prepend(slot);
      }
    }

    const list = Object.values(activeAdminBanners);
    if (list.length === 0) {
      slot.innerHTML = '';
      return;
    }

    slot.innerHTML = list.map(b => `
      <div class="yk-live-banner-card">
        ${b.imageUrl ? `<img src="${b.imageUrl}" alt="banner" />` : ''}
        ${(b.title || b.text) ? `
          <div class="yk-live-banner-caption">
            ${b.title ? `<div style="font-size:14px;font-weight:900;color:#fde047;">👑 ${esc(b.title)}</div>` : ''}
            ${b.text ? `<div style="font-size:12px;color:#f3e8ff;margin-top:2px;">${esc(b.text)}</div>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');
  }

  function startAdminListeners(database) {
    database.ref('bazaarItems').on('value', snap => {
      customBazaarItems = (snap.exists() && snap.val()) ? snap.val() : {};
    });

    database.ref('adminBanners').on('value', snap => {
      activeAdminBanners = (snap.exists() && snap.val()) ? snap.val() : {};
      renderHomeBannersSlot();
    });

    database.ref('globalAnnouncements/current').on('value', snap => {
      const slot = document.getElementById('yk-global-alert-slot');
      if (!slot) return;
      if (!snap.exists() || !snap.val() || !snap.val().text) {
        slot.innerHTML = '';
        return;
      }
      const msg = snap.val().text;
      slot.innerHTML = `
        <div class="yk-global-alert-bar">
          <div style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:900;">
            <span>👑</span>
            <span>${esc(msg)}</span>
          </div>
          <button onclick="document.getElementById('yk-global-alert-slot').innerHTML=''" style="background:none;border:none;color:#fde047;font-weight:900;cursor:pointer;">✕</button>
        </div>
      `;
    });
  }

  function bootstrapAdmin() {
    injectAdminStylesAndDOM();
    renderOwnerFloatingButton();
    installProfileBazaarHooks();

    let listenersStarted = false;
    const timer = setInterval(() => {
      renderOwnerFloatingButton();
      installProfileBazaarHooks();
      const database = getDB();
      if (database && !listenersStarted) {
        listenersStarted = true;
        startAdminListeners(database);
      }
      if (listenersStarted && getMyUid()) {
        renderOwnerFloatingButton();
        clearInterval(timer);
      }
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapAdmin);
  } else {
    bootstrapAdmin();
  }
})();