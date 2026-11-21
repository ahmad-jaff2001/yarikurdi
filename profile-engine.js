/* ==========================================================================
   YariKurdi - Royal Purple & Gold Profile Engine (Main Lobby + Rooms)
   ========================================================================== */

(function () {
  const OWNER_EMAIL = 'ah6753038@gmail.com';
  const OWNER_UID = 'u_ahmadhassan';

  const VIP_ASSETS = {
    sherwanaCoverImg: '',
    vipFrameImg: ''
  };

  let currentProfileUid = null;
  let incomingRequests = {};
  let myFriends = {};
  let initialLoadDone = false;
  let originalSelectGiftFn = null;
  let originalOpenProfileFn = null;
  let cachedOwnerUid = OWNER_UID;
  let allowLegacyEdit = false;

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

  function isPlatformOwner(uid, email) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanUid = String(uid || '').trim().toLowerCase();
    if (cleanEmail === OWNER_EMAIL) return true;
    if (cleanUid === OWNER_UID || cleanUid === String(cachedOwnerUid || '').toLowerCase()) return true;
    if (cleanUid.includes('ah6753038')) return true;
    return false;
  }

  function defaultAvatar(name) {
    const letter = (name || 'ی').trim().charAt(0);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=f59e0b&color=19092b&bold=true&size=160`;
  }

  function getSherwanaCastleCoverSVG() {
    if (VIP_ASSETS.sherwanaCoverImg) {
      return `<img src="${VIP_ASSETS.sherwanaCoverImg}" style="width:100%;height:100%;object-fit:cover;" />`;
    }
    return `
      <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
        <defs>
          <linearGradient id="ykSunset" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="45%" stop-color="#fbbf24"/>
            <stop offset="100%" stop-color="#92400e"/>
          </linearGradient>
          <linearGradient id="ykHill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
          <linearGradient id="ykCastle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fde68a"/>
            <stop offset="50%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
          <linearGradient id="ykFadeBottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="65%" stop-color="#19092b" stop-opacity="0"/>
            <stop offset="100%" stop-color="#19092b" stop-opacity="0.98"/>
          </linearGradient>
        </defs>
        <rect width="600" height="260" fill="url(#ykSunset)"/>
        <circle cx="135" cy="95" r="52" fill="#fef9c3" opacity="0.75"/>
        <path d="M0 175 L110 105 L230 165 L370 95 L510 155 L600 115 L600 260 L0 260 Z" fill="#b45309" opacity="0.45"/>
        <path d="M95 260 L175 148 L425 148 L505 260 Z" fill="url(#ykHill)"/>
        <rect x="195" y="76" width="210" height="74" rx="3" fill="url(#ykCastle)" stroke="#78350f" stroke-width="2"/>
        <rect x="182" y="64" width="26" height="88" rx="6" fill="url(#ykCastle)" stroke="#78350f" stroke-width="2"/>
        <rect x="392" y="64" width="26" height="88" rx="6" fill="url(#ykCastle)" stroke="#78350f" stroke-width="2"/>
        <rect x="262" y="46" width="76" height="32" rx="3" fill="url(#ykCastle)" stroke="#78350f" stroke-width="2"/>
        <polygon points="256,46 300,26 344,46" fill="#92400e"/>
        <g fill="#451a03">
          <rect x="218" y="88" width="12" height="20" rx="6"/>
          <rect x="242" y="88" width="12" height="20" rx="6"/>
          <rect x="266" y="88" width="12" height="20" rx="6"/>
          <rect x="322" y="88" width="12" height="20" rx="6"/>
          <rect x="346" y="88" width="12" height="20" rx="6"/>
          <rect x="370" y="88" width="12" height="20" rx="6"/>
          <rect x="218" y="118" width="12" height="20" rx="6"/>
          <rect x="242" y="118" width="12" height="20" rx="6"/>
          <rect x="346" y="118" width="12" height="20" rx="6"/>
          <rect x="370" y="118" width="12" height="20" rx="6"/>
          <rect x="288" y="112" width="24" height="38" rx="12"/>
        </g>
        <rect width="600" height="260" fill="url(#ykFadeBottom)"/>
      </svg>
    `;
  }

  function getStandardCoverHTML() {
    return `
      <div style="width:100%;height:100%;background:radial-gradient(circle at 50% 25%, #4c1d95 0%, #2e1065 55%, #19092b 100%);position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;opacity:0.18;background-image:radial-gradient(#facc15 1.2px, transparent 1.2px);background-size:22px 22px;"></div>
        <div style="position:absolute;bottom:0;inset-inline:0;height:45%;background:linear-gradient(to bottom, transparent, #19092b);"></div>
      </div>
    `;
  }

  function getVipWingedFrameSVG() {
    if (VIP_ASSETS.vipFrameImg) {
      return `<img src="${VIP_ASSETS.vipFrameImg}" style="position:absolute;inset:-18px;width:calc(100% + 36px);height:calc(100% + 36px);pointer-events:none;z-index:5;" />`;
    }
    return `
      <svg viewBox="0 0 220 200" style="position:absolute;top:-26px;left:50%;transform:translateX(-50%);width:176px;height:160px;pointer-events:none;z-index:5;filter:drop-shadow(0 6px 14px rgba(0,0,0,0.75));">
        <defs>
          <linearGradient id="ykWingGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="45%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <path d="M58 112 C22 104, 6 76, 14 54 C28 70, 44 76, 62 76 C34 86, 26 96, 58 102 Z" fill="url(#ykWingGold)" stroke="#78350f" stroke-width="1.5"/>
        <path d="M62 126 C28 124, 14 104, 22 86 C34 98, 46 104, 64 106 Z" fill="url(#ykWingGold)" stroke="#78350f" stroke-width="1.5"/>
        <path d="M162 112 C198 104, 214 76, 206 54 C192 70, 176 76, 158 76 C186 86, 194 96, 162 102 Z" fill="url(#ykWingGold)" stroke="#78350f" stroke-width="1.5"/>
        <path d="M158 126 C192 124, 206 104, 198 86 C186 98, 174 104, 156 106 Z" fill="url(#ykWingGold)" stroke="#78350f" stroke-width="1.5"/>
        <polygon points="82,42 90,22 102,34 110,16 118,34 130,22 138,42" fill="url(#ykWingGold)" stroke="#78350f" stroke-width="1.5"/>
        <rect x="84" y="39" width="52" height="15" rx="7" fill="#2e1065" stroke="#facc15" stroke-width="1.8"/>
        <text x="110" y="50" text-anchor="middle" fill="#fde047" font-size="10" font-weight="900" font-family="sans-serif">VIP</text>
        <polygon points="110,148 122,160 110,172 98,160" fill="url(#ykWingGold)" stroke="#78350f" stroke-width="1.5"/>
      </svg>
    `;
  }

  function getKurdishFlagSVG() {
    return `
      <svg viewBox="0 0 36 24" style="width:24px;height:16px;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.5);flex-shrink:0;">
        <rect width="36" height="8" y="0" fill="#ef4444"/>
        <rect width="36" height="8" y="8" fill="#ffffff"/>
        <rect width="36" height="8" y="16" fill="#16a34a"/>
        <circle cx="18" cy="12" r="4.2" fill="#facc15"/>
      </svg>
    `;
  }

  function injectUI() {
    if (document.getElementById('yk-profile-styles')) return;

    const style = document.createElement('style');
    style.id = 'yk-profile-styles';
    style.textContent = `
      .yk-social-fab {
        position: fixed;
        top: 74px;
        left: 14px;
        z-index: 9980;
        background: linear-gradient(135deg, #2e1065, #19092b);
        border: 1.5px solid rgba(250, 204, 21, 0.65);
        color: #facc15;
        width: 42px;
        height: 42px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
        cursor: pointer;
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.55);
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
        border: 2px solid #19092b;
      }
      .yk-toast {
        position: fixed;
        top: -110px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10060;
        background: linear-gradient(135deg, #2e1065, #19092b);
        border: 1.5px solid #facc15;
        color: #fff;
        padding: 10px 16px;
        border-radius: 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 15px 40px rgba(0,0,0,0.8);
        transition: top 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        max-width: 92vw;
        direction: rtl;
      }
      .yk-toast.show { top: 16px; }

      .yk-prof-overlay {
        position: fixed;
        inset: 0;
        background: rgba(10, 4, 20, 0.88);
        backdrop-filter: blur(10px);
        z-index: 10045;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 10px;
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      }
      .yk-prof-overlay.open { display: flex; }

      .yk-prof-shell {
        width: 100%;
        max-width: 420px;
        max-height: 94dvh;
        overflow-y: auto;
        background: radial-gradient(circle at 50% 20%, #341356 0%, #19092b 65%, #11051f 100%);
        border: 1.5px solid rgba(250, 204, 21, 0.55);
        border-radius: 28px;
        color: #fff;
        position: relative;
        box-shadow: 0 25px 70px rgba(0, 0, 0, 0.9), 0 0 25px rgba(168, 85, 247, 0.25);
        scrollbar-width: none;
      }
      .yk-prof-shell::-webkit-scrollbar { display: none; }

      .yk-prof-topbar {
        position: absolute;
        top: 12px;
        inset-inline: 14px;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: space-between;
        pointer-events: none;
      }
      .yk-prof-title {
        font-size: 20px;
        font-weight: 900;
        color: #fde047;
        text-shadow: 0 2px 10px rgba(0,0,0,0.85);
      }
      .yk-prof-close {
        pointer-events: auto;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(25, 9, 43, 0.78);
        border: 1.5px solid rgba(250, 204, 21, 0.5);
        color: #fde047;
        font-size: 16px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .yk-cover-box {
        position: relative;
        width: 100%;
        height: 185px;
        overflow: hidden;
        border-bottom: 1.5px solid rgba(250, 204, 21, 0.4);
      }
      .yk-kilim-side {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 18px;
        z-index: 6;
        background: repeating-linear-gradient(
          45deg,
          #991b1b 0px,
          #991b1b 6px,
          #facc15 6px,
          #facc15 10px,
          #14532d 10px,
          #14532d 16px
        );
        border-inline: 1.5px solid #fde047;
        opacity: 0.92;
      }

      .yk-avatar-stage {
        position: relative;
        width: 96px;
        height: 96px;
        margin: -54px auto 8px;
        z-index: 15;
      }
      .yk-avatar-circle {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        padding: 3px;
        background: linear-gradient(135deg, #fde047, #d97706);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.75);
        position: relative;
        z-index: 2;
      }
      .yk-avatar-circle img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background: #19092b;
      }

      .yk-owner-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(90deg, #fde047, #f59e0b);
        color: #19092b;
        font-size: 12px;
        font-weight: 900;
        padding: 4px 14px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(250, 204, 21, 0.4);
      }

      .yk-royal-panel {
        background: rgba(36, 14, 62, 0.72);
        border: 1px solid rgba(250, 204, 21, 0.35);
        border-radius: 18px;
        padding: 12px 14px;
        margin: 10px 14px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }
      .yk-ribbon-tag {
        display: inline-block;
        background: linear-gradient(90deg, #4c1d95, #2e1065);
        border: 1px solid rgba(250, 204, 21, 0.55);
        color: #fde047;
        font-size: 12px;
        font-weight: 900;
        padding: 3px 14px;
        border-radius: 8px 16px 16px 8px;
      }

      .yk-badges-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-top: 10px;
      }
      .yk-badge-item {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(25, 9, 43, 0.85);
        border: 1.5px solid rgba(250, 204, 21, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
      .yk-badge-item.locked {
        opacity: 0.55;
        filter: grayscale(0.6);
      }

      .yk-bottom-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 14px 16px;
      }
      .yk-gold-action {
        flex: 1;
        padding: 11px 10px;
        border-radius: 14px;
        border: 1.5px solid #fef08a;
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #19092b;
        font-weight: 900;
        font-size: 13.5px;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(234, 179, 8, 0.4);
        transition: transform 0.15s;
      }
      .yk-gold-action:active { transform: scale(0.96); }
      .yk-dark-action {
        padding: 11px 13px;
        border-radius: 14px;
        border: 1px solid rgba(250, 204, 21, 0.45);
        background: rgba(46, 16, 101, 0.9);
        color: #fde047;
        font-weight: 800;
        font-size: 12.5px;
        cursor: pointer;
        text-align: center;
      }

      .yk-tabs {
        display: flex;
        gap: 8px;
        background: rgba(15, 5, 28, 0.65);
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
        color: #c4b5fd;
        font-weight: 800;
        font-size: 12.5px;
        cursor: pointer;
      }
      .yk-tab.active { background: #facc15; color: #19092b; }
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
        background: rgba(46, 16, 101, 0.65);
        border: 1px solid rgba(250, 204, 21, 0.2);
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
          <div id="yk-toast-msg" style="font-size:11.5px;color:#f3e8ff;"></div>
        </div>
        <button onclick="openSocialInbox(); document.getElementById('yk-live-toast').classList.remove('show');" class="yk-mini-btn" style="background:#facc15;color:#19092b;">بینین</button>
      </div>

      <div id="yk-profile-modal" class="yk-prof-overlay" onclick="if(event.target===this) closeUserProfile()">
        <div class="yk-prof-shell">
          <div class="yk-prof-topbar">
            <span style="width:34px;"></span>
            <span class="yk-prof-title">پڕۆفایل</span>
            <button class="yk-prof-close" onclick="closeUserProfile()">✕</button>
          </div>

          <div id="yk-prof-cover" class="yk-cover-box"></div>

          <div class="yk-avatar-stage">
            <div id="yk-prof-frame-layer"></div>
            <div class="yk-avatar-circle">
              <img id="yk-prof-img" src="" />
            </div>
          </div>

          <div style="text-align:center;padding:0 16px;">
            <h3 id="yk-prof-name" style="font-size:21px;font-weight:900;color:#fff;margin-bottom:2px;">...</h3>
            <div onclick="copyProfileId()" style="display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#d8b4fe;cursor:pointer;margin-bottom:8px;">
              <span id="yk-prof-id">ID: ...</span>
              <span title="کۆپیکردن">📋</span>
            </div>
            <div id="yk-prof-owner-row" style="display:none;align-items:center;justify-content:center;gap:8px;margin-bottom:6px;">
              <span class="yk-owner-pill">خاوەنی پلاتفۆرم 👑</span>
              ${getKurdishFlagSVG()}
            </div>
          </div>

          <div class="yk-royal-panel" style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <span style="font-size:13px;font-weight:900;color:#fde047;white-space:nowrap;">ئاست Level</span>
            <div style="display:flex;align-items:center;gap:8px;flex:1;">
              <span id="yk-prof-level-badge" style="background:linear-gradient(135deg,#10b981,#047857);border:1.5px solid #fde047;color:#fff;font-size:12px;font-weight:900;padding:2px 9px;border-radius:8px;">1</span>
              <div style="flex:1;height:18px;background:rgba(15,5,28,0.85);border:1px solid rgba(250,204,21,0.45);border-radius:999px;overflow:hidden;position:relative;">
                <div id="yk-prof-xp-bar" style="height:100%;width:45%;background:linear-gradient(90deg,#10b981,#34d399);"></div>
                <span id="yk-prof-xp-text" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:900;color:#fff;">5/25</span>
              </div>
            </div>
          </div>

          <div class="yk-royal-panel">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
              <span class="yk-ribbon-tag">یارییەکان</span>
              <span style="font-size:13px;font-weight:900;color:#c4b5fd;">YariKurdi</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;font-size:12.5px;font-weight:800;padding-bottom:10px;border-bottom:1px dashed rgba(250,204,21,0.25);">
              <div>گشتی Total: <span style="color:#fde047;">🪙 <span id="yk-prof-coins">250</span></span></div>
              <div>ڕێژەی بردنەوە: <span id="yk-prof-winrate" style="color:#34d399;">0%</span></div>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-around;padding-top:10px;font-size:11.5px;color:#e9d5ff;">
              <div style="text-align:center;">
                <div style="font-size:20px;">🏆</div>
                <div>ئێلۆ: <strong id="yk-prof-elo" style="color:#fde047;">1200</strong></div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:20px;">⚔️</div>
                <div>بردنەوە: <strong id="yk-prof-wins" style="color:#34d399;">0</strong></div>
              </div>
              <div style="text-align:center;">
                <div style="font-size:20px;">🎮</div>
                <div>یارییەکان: <strong id="yk-prof-games" style="color:#fde047;">0</strong></div>
              </div>
            </div>
          </div>

          <div class="yk-royal-panel">
            <span class="yk-ribbon-tag">دەستکەوتەکان</span>
            <div class="yk-badges-row">
              <div class="yk-badge-item" title="یاریزانی یاری کوردی">🏆</div>
              <div class="yk-badge-item" title="شەتڕەنجباز">♟️</div>
              <div class="yk-badge-item locked" title="قفڵکراوە">🔒</div>
              <div class="yk-badge-item locked" title="قفڵکراوە">🔒</div>
              <div class="yk-badge-item locked" title="قفڵکراوە">🔒</div>
            </div>
          </div>

          <div id="yk-prof-bottom" class="yk-bottom-bar"></div>
        </div>
      </div>

      <div id="yk-inbox-modal" class="yk-prof-overlay" onclick="if(event.target===this) closeSocialInbox()">
        <div class="yk-prof-shell" style="padding:20px;max-width:380px;">
          <button class="yk-prof-close" style="position:absolute;top:14px;left:14px;" onclick="closeSocialInbox()">✕</button>
          <h3 style="font-size:18px;font-weight:900;color:#fde047;text-align:center;">هاوڕێیان و داواکارییەکان</h3>
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

  window.copyProfileId = function () {
    if (!currentProfileUid) return;
    if (navigator.clipboard) navigator.clipboard.writeText(currentProfileUid).catch(() => {});
    alert('ئایدی یاریزان کۆپی کرا: ' + currentProfileUid);
  };

  window.showLockedCoverNotice = function () {
    alert('🔒 کەڤەری شاهانەی قەڵای شێروانە (🪙 3,999 سکە)\n\nئەم کەڤەرە تایبەتە و بەم زووانە لە بەشی بازاڕ بەردەست دەبێت بۆ کڕین!');
  };

  function findLegacyProfileModal() {
    const candidates = document.querySelectorAll('.fixed, [id*="profile" i], [id*="account" i]');
    for (const el of candidates) {
      if (el.id === 'yk-profile-modal' || el.id === 'yk-inbox-modal') continue;
      if (el.textContent && el.textContent.includes('دەستکاریکردنی پڕۆفایل')) {
        return el.closest('.fixed') || el;
      }
    }
    return null;
  }

  // چاودێریکردنی ڕاستەوخۆی پەنجەرە کۆنەکەی پڕۆفایل تا لەجێی ئەو پڕۆفایلە شاهانەکە بکرێتەوە
  function watchLegacyProfileModal() {
    const legacyModal = findLegacyProfileModal();
    if (!legacyModal || legacyModal._ykObserved) return;
    legacyModal._ykObserved = true;

    const obs = new MutationObserver(() => {
      const isVisible = !legacyModal.classList.contains('hidden') && legacyModal.style.display !== 'none';
      if (isVisible && !allowLegacyEdit) {
        legacyModal.classList.add('hidden');
        legacyModal.style.display = 'none';
        openUserProfile();
      }
    });
    obs.observe(legacyModal, { attributes: true, attributeFilter: ['class', 'style'] });
  }

  window.openLegacyProfileEditor = function () {
    allowLegacyEdit = true;
    closeUserProfile();
    const legacyModal = findLegacyProfileModal();
    if (legacyModal) {
      legacyModal.classList.remove('hidden');
      legacyModal.style.display = 'flex';
    } else if (typeof originalOpenProfileFn === 'function') {
      originalOpenProfileFn();
    }
    setTimeout(() => { allowLegacyEdit = false; }, 1000);
  };

  function hookRoomAndGameClicks() {
    watchLegacyProfileModal();

    if (typeof window.selectGiftRecipientAndOpen === 'function' && !window.selectGiftRecipientAndOpen._ykHooked) {
      originalSelectGiftFn = window.selectGiftRecipientAndOpen;
      window.selectGiftRecipientAndOpen = function (uid) {
        if (uid && uid !== 'ALL') openUserProfile(uid);
        else if (originalSelectGiftFn) originalSelectGiftFn(uid);
      };
      window.selectGiftRecipientAndOpen._ykHooked = true;
    }

    const fnNames = ['openProfileModal', 'showProfileModal', 'openUserEditModal', 'openAccountModal', 'toggleProfileModal'];
    for (const fn of fnNames) {
      if (typeof window[fn] === 'function' && !window[fn]._ykHooked) {
        originalOpenProfileFn = window[fn];
        window[fn] = function () {
          openUserProfile();
        };
        window[fn]._ykHooked = true;
      }
    }
  }

  document.addEventListener('click', async function (e) {
    const targetWithUid = e.target.closest('[data-uid]');
    if (targetWithUid) {
      const uid = targetWithUid.getAttribute('data-uid');
      if (uid) return openUserProfile(uid);
    }

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
    const me = getMe();
    const targetUid = uid || (me && me.uid);
    if (!targetUid) return;

    injectUI();
    currentProfileUid = targetUid;

    const modal = document.getElementById('yk-profile-modal');
    modal.classList.add('open');

    document.getElementById('yk-prof-name').textContent = 'چاوەڕوان بە...';
    document.getElementById('yk-prof-id').textContent = `ID: ${String(targetUid).slice(0, 14)}`;
    document.getElementById('yk-prof-img').src = defaultAvatar('?');
    document.getElementById('yk-prof-owner-row').style.display = 'none';
    document.getElementById('yk-prof-frame-layer').innerHTML = '';
    document.getElementById('yk-prof-cover').innerHTML = getStandardCoverHTML();

    const database = getRTDB();
    let userData = null;

    if (database) {
      try {
        const snap = await database.ref(`players/${targetUid}`).once('value');
        if (snap.exists()) userData = snap.val();
      } catch (e) {}
    }

    const roomMember = (typeof currentRoomMembers !== 'undefined' && currentRoomMembers) ? currentRoomMembers[targetUid] : null;
    const name = (userData && userData.name) || (roomMember && roomMember.name) || 'یاریزانی یاری کوردی';
    const photo = (userData && (userData.avatar || userData.photo)) || (roomMember && roomMember.avatar) || defaultAvatar(name);
    const email = (userData && userData.email) || ((me && me.uid === targetUid && window.auth && auth.currentUser) ? auth.currentUser.email : '');

    const ownerCheck = isPlatformOwner(targetUid, email);

    if (ownerCheck) {
      document.getElementById('yk-prof-cover').innerHTML = `
        <div class="yk-kilim-side" style="right:0;"></div>
        <div class="yk-kilim-side" style="left:0;"></div>
        ${getSherwanaCastleCoverSVG()}
      `;
      document.getElementById('yk-prof-frame-layer').innerHTML = getVipWingedFrameSVG();
      document.getElementById('yk-prof-owner-row').style.display = 'inline-flex';
    } else {
      const equippedCover = userData && userData.equippedCover;
      if (equippedCover === 'sherwana') {
        document.getElementById('yk-prof-cover').innerHTML = getSherwanaCastleCoverSVG();
      } else {
        document.getElementById('yk-prof-cover').innerHTML = getStandardCoverHTML();
      }
      document.getElementById('yk-prof-frame-layer').innerHTML = '';
      document.getElementById('yk-prof-owner-row').style.display = 'none';
    }

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

    let gamesVal = 0;
    if (userData && userData.games) {
      if (typeof userData.games === 'object') {
        gamesVal = Object.values(userData.games).reduce((a, b) => a + (Number(b) || 0), 0);
      } else {
        gamesVal = Number(userData.games) || 0;
      }
    }

    const winRate = gamesVal > 0 ? ((winsVal / gamesVal) * 100).toFixed(1) + '%' : '0%';
    const coinsVal = (userData && typeof userData.coins !== 'undefined') ? Number(userData.coins) : 250;
    const level = Math.max(1, Math.floor(winsVal / 5) + 1);
    const xpProgress = (winsVal % 5) * 5;

    document.getElementById('yk-prof-name').textContent = name;
    document.getElementById('yk-prof-img').src = photo;
    document.getElementById('yk-prof-elo').textContent = eloVal;
    document.getElementById('yk-prof-wins').textContent = winsVal;
    document.getElementById('yk-prof-games').textContent = gamesVal;
    document.getElementById('yk-prof-winrate').textContent = winRate;
    document.getElementById('yk-prof-coins').textContent = coinsVal.toLocaleString();
    document.getElementById('yk-prof-level-badge').textContent = level;
    document.getElementById('yk-prof-xp-bar').style.width = `${Math.max(12, (xpProgress / 25) * 100)}%`;
    document.getElementById('yk-prof-xp-text').textContent = `${xpProgress}/25`;

    renderProfileBottomButtons(targetUid, name, photo, ownerCheck);
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

  async function renderProfileBottomButtons(targetUid, targetName, targetPhoto, isTargetOwner) {
    const bottomEl = document.getElementById('yk-prof-bottom');
    const me = getMe();

    if (!me || me.uid === targetUid) {
      if (isTargetOwner) {
        bottomEl.innerHTML = `
          <button onclick="openLegacyProfileEditor()" class="yk-gold-action">دەستکاری پڕۆفایل ✏️</button>
        `;
      } else {
        bottomEl.innerHTML = `
          <button onclick="openLegacyProfileEditor()" class="yk-gold-action">دەستکاری ✏️</button>
          <button onclick="showLockedCoverNotice()" class="yk-dark-action" style="display:flex;align-items:center;gap:6px;">
            <span>🔒 قەڵای شێروانە</span>
            <span style="color:#fde047;">🪙 3,999</span>
          </button>
        `;
      }
      return;
    }

    const database = getRTDB();
    let status = 'none';

    if (myFriends[targetUid]) status = 'friends';
    else if (incomingRequests[targetUid]) status = 'incoming';
    else if (database) {
      const sentSnap = await database.ref(`friendRequests/${targetUid}/${me.uid}`).once('value');
      if (sentSnap.exists()) status = 'sent';
    }

    const safeName = targetName.replace(/'/g, '');
    let addBtnHtml = '';
    if (status === 'friends') {
      addBtnHtml = `<button class="yk-gold-action" style="background:#10b981;border-color:#6ee7b7;color:#fff;" disabled>هاوڕێن ✓</button>`;
    } else if (status === 'sent') {
      addBtnHtml = `<button class="yk-gold-action" style="background:#4c1d95;border-color:#a78bfa;color:#e9d5ff;" disabled>داواکاری نێردراوە ⏳</button>`;
    } else if (status === 'incoming') {
      addBtnHtml = `<button class="yk-gold-action" onclick="acceptFriendRequest('${targetUid}', '${safeName}', '${targetPhoto}')">وەرگرتنی ئەد ✓</button>`;
    } else {
      addBtnHtml = `<button class="yk-gold-action" onclick="sendFriendRequest('${targetUid}', '${safeName}', '${targetPhoto}')">ناردنی ئەد ➕</button>`;
    }

    let giftBtnHtml = '';
    if (typeof currentVoiceRoomId !== 'undefined' && currentVoiceRoomId) {
      giftBtnHtml = `<button class="yk-dark-action" onclick="openGiftForUserFromProfile('${targetUid}')">☕ شاباش</button>`;
    }

    bottomEl.innerHTML = `${addBtnHtml}${giftBtnHtml}`;
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
      renderProfileBottomButtons(targetUid, targetName, targetPhoto, isPlatformOwner(targetUid, ''));
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
      renderProfileBottomButtons(senderUid, senderName, senderPhoto, isPlatformOwner(senderUid, ''));
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
        listEl.innerHTML = `<div style="text-align:center;padding:24px;color:#c4b5fd;font-size:13px;">هیچ داواکارییەکی نوێ نییە</div>`;
        return;
      }
      listEl.innerHTML = reqs.map(r => `
        <div class="yk-list-item">
          <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="closeSocialInbox(); openUserProfile('${r.uid}')">
            <img src="${r.photo || defaultAvatar(r.name)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #facc15;" />
            <div>
              <div style="font-weight:800;font-size:13.5px;color:#fff;">${r.name}</div>
              <div style="font-size:11px;color:#d8b4fe;">داوای هاوڕێیەتی دەکات</div>
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
        listEl.innerHTML = `<div style="text-align:center;padding:24px;color:#c4b5fd;font-size:13px;">هێشتا هیچ هاوڕێیەکت نییە</div>`;
        return;
      }
      listEl.innerHTML = frs.map(f => `
        <div class="yk-list-item" style="cursor:pointer;" onclick="closeSocialInbox(); openUserProfile('${f.uid}')">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${f.photo || defaultAvatar(f.name)}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #facc15;" />
            <div style="font-weight:800;font-size:13.5px;color:#fff;">${f.name}</div>
          </div>
          <span style="font-size:11px;color:#fde047;font-weight:700;">پڕۆفایل ←</span>
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
    database.ref('platformConfig/ownerUid').once('value').then(s => {
      if (s.exists() && s.val()) cachedOwnerUid = s.val();
    }).catch(() => {});

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