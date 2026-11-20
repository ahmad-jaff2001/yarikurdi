/* === تابی سەرەوەی نوێ و سادە (وەک دیزاینی پرۆفیشناڵ) === */
(function buildCleanRoyalTopBar() {
  function injectTopBarCss() {
    if (document.getElementById('ykCleanTopBarCss')) return;
    const st = document.createElement('style');
    st.id = 'ykCleanTopBarCss';
    st.textContent = `
      header, .top-navbar, #mainTopHeader {
        display: none !important;
      }
      #ykCleanTopBar {
        position: sticky;
        top: 0;
        z-index: 9000;
        width: 100%;
        background: linear-gradient(180deg, #0b4a36 0%, #073224 100%);
        border-bottom: 2px solid rgba(52, 211, 153, 0.35);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
        padding: 10px 12px;
      }
      .yk-tb-inner {
        max-width: 640px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .yk-tb-avatar-btn {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 9999px;
        padding: 2px;
        background: linear-gradient(135deg, #4ade80, #10b981);
        box-shadow: 0 0 14px rgba(74, 222, 128, 0.45);
        cursor: pointer;
        flex-shrink: 0;
        transition: transform 0.18s ease;
      }
      .yk-tb-avatar-btn:active { transform: scale(0.92); }
      .yk-tb-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        object-fit: cover;
        background: #062820;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #fff;
        font-size: 18px;
      }
      .yk-tb-dot {
        position: absolute;
        top: -1px;
        right: -1px;
        width: 13px;
        height: 13px;
        border-radius: 9999px;
        background: radial-gradient(circle at 30% 30%, #ff6b6b, #dc2626);
        border: 2px solid #fff;
      }
      .yk-tb-lvl {
        position: absolute;
        bottom: -3px;
        right: -4px;
        min-width: 22px;
        height: 22px;
        padding: 0 4px;
        border-radius: 6px;
        background: linear-gradient(180deg, #16a34a, #14532d);
        border: 1.5px solid #facc15;
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      }
      .yk-tb-pills {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        justify-content: center;
      }
      .yk-tb-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        min-width: 106px;
        max-width: 135px;
        flex: 1;
        height: 34px;
        padding: 0 4px 0 6px;
        border-radius: 9999px;
        background: rgba(2, 22, 16, 0.72);
        border: 1.5px solid rgba(52, 211, 153, 0.35);
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.55);
      }
      .yk-tb-val {
        color: #ffffff;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 13px;
        font-weight: 900;
        letter-spacing: 0.3px;
      }
      .yk-tb-plus {
        width: 26px;
        height: 26px;
        border-radius: 9999px;
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #422006;
        font-size: 18px;
        font-weight: 900;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        cursor: pointer;
        border: none;
        flex-shrink: 0;
      }
      .yk-tb-plus:active { transform: scale(0.9); }
      .yk-tb-actions {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
      }
      .yk-tb-icon-btn {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.14);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        cursor: pointer;
        transition: transform 0.16s ease, background 0.16s ease;
      }
      .yk-tb-icon-btn:active { transform: scale(0.9); }
    `;
    document.head.appendChild(st);
  }

  function triggerProfileClick() {
    if (typeof openProfileModal === 'function') return openProfileModal();
    if (typeof openEditProfileModal === 'function') return openEditProfileModal();
    const editBtn = Array.from(document.querySelectorAll('button, div, span')).find(el =>
      (el.textContent || '').includes('دەستکاری')
    );
    if (editBtn) editBtn.click();
  }

  function syncTopBarData() {
    const coinsEl = document.getElementById('ykTbCoins');
    const gemsEl = document.getElementById('ykTbGems');
    const lvlEl = document.getElementById('ykTbLvl');
    const avatarWrap = document.getElementById('ykTbAvatarWrap');

    if (coinsEl) {
      const c = typeof myUserCoins !== 'undefined' ? Number(myUserCoins) || 0 : 0;
      coinsEl.textContent = c.toLocaleString();
    }
    if (gemsEl) {
      const g = typeof myUserGems !== 'undefined' ? Number(myUserGems) || 0 : 0;
      gemsEl.textContent = g.toLocaleString();
    }
    if (lvlEl && typeof myUserLevel !== 'undefined') {
      lvlEl.textContent = myUserLevel || 1;
    }
    if (avatarWrap && typeof playerAvatarData !== 'undefined' && playerAvatarData) {
      avatarWrap.innerHTML = `<img src="${playerAvatarData}" class="yk-tb-avatar-img" alt="profile" />`;
    }
  }

  function mountTopBar() {
    injectTopBarCss();
    if (document.getElementById('ykCleanTopBar')) {
      syncTopBarData();
      return;
    }

    const bar = document.createElement('div');
    bar.id = 'ykCleanTopBar';
    bar.setAttribute('dir', 'ltr');
    bar.innerHTML = `
      <div class="yk-tb-inner">
        <button type="button" id="ykTbProfileBtn" class="yk-tb-avatar-btn" title="پرۆفایل">
          <div id="ykTbAvatarWrap" class="yk-tb-avatar-img">👤</div>
          <span class="yk-tb-dot"></span>
          <span id="ykTbLvl" class="yk-tb-lvl">1</span>
        </button>

        <div class="yk-tb-pills">
          <div class="yk-tb-pill">
            <span style="font-size:20px; line-height:1;">🪙</span>
            <span id="ykTbCoins" class="yk-tb-val">0</span>
            <button type="button" class="yk-tb-plus" onclick="if(typeof openCoinStoreModal==='function'){openCoinStoreModal();}">+</button>
          </div>

          <div class="yk-tb-pill">
            <span style="font-size:19px; line-height:1;">💎</span>
            <span id="ykTbGems" class="yk-tb-val">0</span>
            <button type="button" class="yk-tb-plus" onclick="if(typeof openCoinStoreModal==='function'){openCoinStoreModal();}">+</button>
          </div>
        </div>

        <div class="yk-tb-actions">
          <button type="button" class="yk-tb-icon-btn" title="بازاڕ" onclick="window.openBazaarModal()">🛒</button>
          <button type="button" id="ykTbSettingsBtn" class="yk-tb-icon-btn" title="ڕێکخستنەکان">⚙️</button>
        </div>
      </div>
    `;

    document.body.prepend(bar);
    document.getElementById('ykTbProfileBtn').onclick = triggerProfileClick;
    document.getElementById('ykTbSettingsBtn').onclick = triggerProfileClick;

    syncTopBarData();
    setInterval(syncTopBarData, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountTopBar);
  } else {
    mountTopBar();
  }
})();