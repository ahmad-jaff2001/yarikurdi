/* === تابی سەرەوەی شاهانە + ئاڵای کوردستان + بچووککردنەوەی هەموو کارتی یارییەکان === */
(function buildKurdishRoyalUI() {
  function injectTopBarCss() {
    if (document.getElementById('ykCleanTopBarCss')) return;
    const st = document.createElement('style');
    st.id = 'ykCleanTopBarCss';
    st.textContent = `
      #ykCleanTopBar {
        position: sticky;
        top: 0;
        z-index: 9000;
        width: 100%;
        background: linear-gradient(180deg, #6b0f1a 0%, #3a070d 100%);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
        padding: 8px 10px 11px 10px;
      }
      #ykCleanTopBar::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        background: linear-gradient(90deg, #dc2626 0%, #dc2626 32%, #ffffff 44%, #facc15 50%, #ffffff 56%, #16a34a 68%, #16a34a 100%);
        box-shadow: 0 0 12px rgba(250, 204, 21, 0.55);
      }
      .yk-tb-inner {
        max-width: 720px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
      }
      .yk-tb-profile-group {
        display: flex;
        align-items: center;
        gap: 7px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(250, 204, 21, 0.3);
        padding: 3px 9px 3px 4px;
        border-radius: 9999px;
        transition: transform 0.18s ease, border-color 0.18s ease;
        min-width: 0;
      }
      .yk-tb-profile-group:active { transform: scale(0.95); }
      .yk-tb-avatar-box {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        padding: 2px;
        background: linear-gradient(135deg, #facc15, #dc2626);
        box-shadow: 0 0 10px rgba(250, 204, 21, 0.4);
        flex-shrink: 0;
      }
      .yk-tb-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        object-fit: cover;
        background: #2b060a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        color: #fff;
        font-size: 15px;
      }
      .yk-tb-lvl {
        position: absolute;
        bottom: -2px;
        right: -3px;
        min-width: 18px;
        height: 18px;
        padding: 0 3px;
        border-radius: 5px;
        background: linear-gradient(180deg, #dc2626, #7f1d1d);
        border: 1.5px solid #facc15;
        color: #fff;
        font-size: 10px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .yk-tb-user-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-width: 0;
        line-height: 1.15;
      }
      .yk-tb-username {
        color: #ffffff;
        font-size: 12px;
        font-weight: 900;
        max-width: 92px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
      }
      .yk-tb-user-sub {
        color: #fde047;
        font-size: 9px;
        font-weight: 700;
      }
      .yk-tb-pills {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
        justify-content: center;
      }
      .yk-tb-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        min-width: 84px;
        max-width: 120px;
        flex: 1;
        height: 32px;
        padding: 0 3px 0 6px;
        border-radius: 9999px;
        background: rgba(20, 4, 7, 0.78);
        border: 1.5px solid rgba(250, 204, 21, 0.32);
      }
      .yk-tb-val {
        color: #ffffff;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 12px;
        font-weight: 900;
      }
      .yk-tb-plus {
        width: 22px;
        height: 22px;
        border-radius: 9999px;
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #422006;
        font-size: 16px;
        font-weight: 900;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        flex-shrink: 0;
      }
      .yk-tb-actions {
        display: flex;
        align-items: center;
        gap: 5px;
        flex-shrink: 0;
      }
      .yk-tb-icon-btn {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.09);
        border: 1px solid rgba(250, 204, 21, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
      }

      /* ڕوونکردنەوەی بەنەری ئاڵای کوردستان */
      .yk-kurdistan-banner-fix {
        position: relative !important;
        overflow: hidden !important;
        background:
          radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.96) 0%, rgba(250, 204, 21, 0.78) 12%, rgba(250, 204, 21, 0) 25%),
          linear-gradient(180deg,
            rgba(220, 38, 38, 0.9) 0%,
            rgba(220, 38, 38, 0.9) 33%,
            rgba(255, 255, 255, 0.88) 33.5%,
            rgba(255, 255, 255, 0.88) 66.5%,
            rgba(22, 163, 74, 0.9) 67%,
            rgba(22, 163, 74, 0.9) 100%
          ) !important;
        border: 1.5px solid rgba(250, 204, 21, 0.7) !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45) !important;
      }
      .yk-kurdistan-banner-fix::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.38) 100%);
        pointer-events: none;
        z-index: 0;
      }
      .yk-kurdistan-banner-fix > * {
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.92) !important;
      }

      /* بچووککردنەوە و ڕێکخستنی هەموو کارتی یارییەکان (سەرەکی و داهاتوو) */
      .yk-compact-game-card {
        height: 135px !important;
        min-height: 135px !important;
        max-height: 145px !important;
        aspect-ratio: auto !important;
        overflow: hidden !important;
      }
      .yk-compact-game-card img,
      .yk-compact-game-card svg {
        max-height: 92px !important;
        object-fit: cover !important;
      }
      @media (min-width: 768px) {
        .yk-compact-game-card {
          height: 205px !important;
          max-height: 215px !important;
        }
        .yk-compact-game-card img,
        .yk-compact-game-card svg {
          max-height: 155px !important;
        }
      }
    `;
    document.head.appendChild(st);
  }

  function enhanceFlagAndGameCards() {
    const allDivs = Array.from(document.querySelectorAll('div, section'));
    const flagBanner = allDivs.find(el => {
      const t = (el.textContent || '');
      return t.includes('دەستمان بگرە') && t.includes('دیوەخان') && el.offsetHeight > 40 && el.offsetHeight < 260;
    });
    if (flagBanner && !flagBanner.classList.contains('yk-kurdistan-banner-fix')) {
      flagBanner.classList.add('yk-kurdistan-banner-fix');
    }

    const gameKeywords = ['شەتڕەنج', 'لودۆ', 'دۆمینە', 'کۆنکان', 'تاوڵە', 'دامە', 'مار'];
    const cards = Array.from(document.querySelectorAll('div, button, a')).filter(el => {
      const t = (el.textContent || '').trim();
      const hasGame = gameKeywords.some(k => t.includes(k));
      const hasVisual = el.querySelector('img, svg, canvas');
      const isCardSize = el.offsetHeight > 140 && el.offsetWidth > 100 && el.offsetWidth < 420;
      const isNotGridContainer = el.children.length <= 6;
      return hasGame && hasVisual && isCardSize && isNotGridContainer;
    });
    cards.forEach(card => card.classList.add('yk-compact-game-card'));
  }

  function hideOnlyOldTopNav() {
    const oldHeader = document.querySelector('header');
    if (oldHeader) {
      const hasFlagBanner = (oldHeader.textContent || '').includes('دەستمان بگرە');
      if (!hasFlagBanner) {
        oldHeader.style.display = 'none';
      } else {
        const navEl = oldHeader.querySelector('nav');
        if (navEl) navEl.style.display = 'none';
      }
    }
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
    const nameEl = document.getElementById('ykTbUserName');
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
    if (nameEl) {
      const uName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'میوان';
      nameEl.textContent = uName;
    }
    if (avatarWrap && typeof playerAvatarData !== 'undefined' && playerAvatarData) {
      avatarWrap.innerHTML = `<img src="${playerAvatarData}" class="yk-tb-avatar-img" alt="profile" />`;
    }
  }

  function mountTopBar() {
    injectTopBarCss();
    hideOnlyOldTopNav();
    enhanceFlagAndGameCards();
    if (document.getElementById('ykCleanTopBar')) {
      syncTopBarData();
      return;
    }

    const coinSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="#FEF08A" opacity="0.55"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#854D0E">$</text></svg>`;
    const gemSvg = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M12 2L21 9L12 22L3 9L12 2Z" fill="#38BDF8" stroke="#0284C7" stroke-width="1.8"/><path d="M12 2L16.5 9L12 22L7.5 9L12 2Z" fill="#BAE6FD" opacity="0.6"/></svg>`;

    const bar = document.createElement('div');
    bar.id = 'ykCleanTopBar';
    bar.setAttribute('dir', 'ltr');
    bar.innerHTML = `
      <div class="yk-tb-inner">
        <div id="ykTbProfileBtn" class="yk-tb-profile-group" title="پرۆفایل">
          <div class="yk-tb-avatar-box">
            <div id="ykTbAvatarWrap" class="yk-tb-avatar-img">👤</div>
            <span id="ykTbLvl" class="yk-tb-lvl">1</span>
          </div>
          <div class="yk-tb-user-meta">
            <span id="ykTbUserName" class="yk-tb-username">میوان</span>
            <span class="yk-tb-user-sub">پرۆفایل</span>
          </div>
        </div>

        <div class="yk-tb-pills">
          <div class="yk-tb-pill">
            ${coinSvg}
            <span id="ykTbCoins" class="yk-tb-val">0</span>
            <button type="button" class="yk-tb-plus" onclick="if(typeof openCoinStoreModal==='function'){openCoinStoreModal();}">+</button>
          </div>

          <div class="yk-tb-pill">
            ${gemSvg}
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
    setTimeout(enhanceFlagAndGameCards, 600);
    setTimeout(enhanceFlagAndGameCards, 1500);
    setInterval(syncTopBarData, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountTopBar);
  } else {
    mountTopBar();
  }
})();