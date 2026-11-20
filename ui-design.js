/* === تابی سەرەوەی شاهانە + ئاڵای کوردستان + کارتی لاکێشەیی و فوول بۆ یارییەکان === */
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
        min-width: 0;
      }
      .yk-tb-avatar-box {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        padding: 2px;
        background: linear-gradient(135deg, #facc15, #dc2626);
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
        font-size: 14px;
      }
      .yk-tb-lvl {
        position: absolute;
        bottom: -2px;
        right: -3px;
        min-width: 17px;
        height: 17px;
        padding: 0 3px;
        border-radius: 5px;
        background: linear-gradient(180deg, #dc2626, #7f1d1d);
        border: 1.5px solid #facc15;
        color: #fff;
        font-size: 9px;
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
        font-size: 11px;
        font-weight: 900;
        max-width: 82px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .yk-tb-user-sub {
        color: #fde047;
        font-size: 9px;
        font-weight: 700;
      }
      .yk-tb-pills {
        display: flex;
        align-items: center;
        gap: 5px;
        flex: 1;
        justify-content: center;
      }
      .yk-tb-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        min-width: 76px;
        max-width: 115px;
        flex: 1;
        height: 30px;
        padding: 0 3px 0 5px;
        border-radius: 9999px;
        background: rgba(20, 4, 7, 0.78);
        border: 1.5px solid rgba(250, 204, 21, 0.32);
      }
      .yk-tb-val {
        color: #ffffff;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 11px;
        font-weight: 900;
      }
      .yk-tb-plus {
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #422006;
        font-size: 15px;
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
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.09);
        border: 1px solid rgba(250, 204, 21, 0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        cursor: pointer;
      }

      /* بەنەری ئاڵای کوردستان */
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

      /* کارتی یارییەکان: لاکێشەیی پان، بچووک، و وێنەی ١٠٠٪ فوول بێ بۆشایی ڕەش */
      .yk-plato-card {
        position: relative !important;
        aspect-ratio: 16 / 10 !important;
        height: auto !important;
        min-height: 105px !important;
        max-height: 155px !important;
        padding: 0 !important;
        overflow: hidden !important;
        border-radius: 16px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
      }
      .yk-plato-card img {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        z-index: 0 !important;
      }
      .yk-plato-card::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.78) 100%);
        pointer-events: none;
        z-index: 1;
      }
      .yk-plato-card > *:not(img) {
        position: relative !important;
        z-index: 2 !important;
      }
      .yk-plato-card h3,
      .yk-plato-card h4,
      .yk-plato-card p,
      .yk-plato-card span {
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95) !important;
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
    if (flagBanner) flagBanner.classList.add('yk-kurdistan-banner-fix');

    const gameKeywords = ['شەتڕەنج', 'لودۆ', 'دۆمینە', 'کۆنکان', 'تاوڵە', 'دامە', 'مار'];
    const candidates = Array.from(document.querySelectorAll('div, button, a')).filter(el => {
      const t = (el.textContent || '').trim();
      const matched = gameKeywords.filter(k => t.includes(k));
      // تەنها ئەو کارتە هەڵدەبژێرێت کە ناوی یەک یاری تێدایە (نەک چوارچێوەی هەموو پەڕەکە!)
      if (matched.length !== 1) return false;
      const imgs = el.querySelectorAll('img');
      return imgs.length === 1 && t.length < 45;
    });

    candidates.forEach(card => {
      if (card.parentElement && candidates.includes(card.parentElement)) return;
      card.classList.add('yk-plato-card');
    });
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

    const coinSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="#FEF08A" opacity="0.55"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#854D0E">$</text></svg>`;
    const gemSvg = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L21 9L12 22L3 9L12 2Z" fill="#38BDF8" stroke="#0284C7" stroke-width="1.8"/><path d="M12 2L16.5 9L12 22L7.5 9L12 2Z" fill="#BAE6FD" opacity="0.6"/></svg>`;

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