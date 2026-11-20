/* === دیزاینی شاهانەی نەوەی نوێ بۆ YariKurdi (Obsidian Ruby-Gold + تۆڕی PITO) === */
(function buildYariKurdiMasterpieceUI() {
  function injectMasterCss() {
    const oldCss = document.getElementById('ykCleanTopBarCss');
    if (oldCss) oldCss.remove();
    if (document.getElementById('ykMasterpieceCss')) return;

    const st = document.createElement('style');
    st.id = 'ykMasterpieceCss';
    st.textContent = `
      /* ١. پاشبنەمای شۆکهێنەری Midnight Obsidian + ڕووناکیی یاقووتی و زێڕین */
      html, body {
        background-color: #060914 !important;
        background-image:
          radial-gradient(circle at 15% 8%, rgba(225, 29, 72, 0.22) 0%, transparent 38%),
          radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16) 0%, transparent 36%),
          radial-gradient(circle at 50% 90%, rgba(56, 189, 248, 0.14) 0%, transparent 45%),
          linear-gradient(180deg, #090d1e 0%, #050711 100%) !important;
        background-attachment: fixed !important;
        color: #f8fafc !important;
      }

      /* ٢. تابی سەرەوەی شووشەیی یاقووتی + هێڵی ئاڵای کوردستان */
      #ykCleanTopBar {
        position: sticky;
        top: 0;
        z-index: 9000;
        width: 100%;
        background: linear-gradient(180deg, rgba(88, 12, 31, 0.92) 0%, rgba(28, 7, 18, 0.94) 100%);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
        padding: 8px 12px 11px 12px;
      }
      #ykCleanTopBar::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, #ef4444 0%, #ef4444 33%, #ffffff 45%, #facc15 50%, #ffffff 55%, #22c55e 67%, #22c55e 100%);
        box-shadow: 0 0 14px rgba(250, 204, 21, 0.55);
      }
      .yk-tb-inner {
        max-width: 960px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .yk-tb-profile-group {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(251, 191, 36, 0.35);
        padding: 3px 11px 3px 4px;
        border-radius: 9999px;
        transition: all 0.2s ease;
        min-width: 0;
      }
      .yk-tb-profile-group:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(251, 191, 36, 0.75);
      }
      .yk-tb-profile-group:active { transform: scale(0.96); }
      .yk-tb-avatar-box {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        padding: 2px;
        background: linear-gradient(135deg, #fde047, #f43f5e);
        box-shadow: 0 0 12px rgba(251, 191, 36, 0.4);
        flex-shrink: 0;
      }
      .yk-tb-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        object-fit: cover;
        background: #140812;
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
        border-radius: 6px;
        background: linear-gradient(180deg, #f43f5e, #9f1239);
        border: 1.5px solid #fde047;
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
        font-size: 12px;
        font-weight: 900;
        max-width: 96px;
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
        gap: 7px;
        flex: 1;
        justify-content: center;
      }
      .yk-tb-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
        min-width: 82px;
        max-width: 126px;
        flex: 1;
        height: 32px;
        padding: 0 4px 0 7px;
        border-radius: 9999px;
        background: rgba(6, 9, 20, 0.72);
        border: 1px solid rgba(251, 191, 36, 0.35);
        box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.65);
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
        background: linear-gradient(180deg, #fde047 0%, #f59e0b 100%);
        color: #451a03;
        font-size: 16px;
        font-weight: 900;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.45);
        flex-shrink: 0;
      }
      .yk-tb-plus:active { transform: scale(0.9); }
      .yk-tb-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .yk-tb-icon-btn {
        width: 34px;
        height: 34px;
        border-radius: 11px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(251, 191, 36, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .yk-tb-icon-btn:hover {
        background: rgba(251, 191, 36, 0.2);
        transform: translateY(-1px);
      }

      /* ٣. ڕێکخستنی پەڕەی سەرەکی (Hub) و بەنەرەکان بە ستایلی شووشەیی پڕۆفیشناڵ */
      #view-hub {
        max-width: 960px !important;
        padding-top: 14px !important;
      }
      #view-hub .yk-banner-clean {
        border-radius: 20px !important;
        border: 1.5px solid rgba(251, 191, 36, 0.45) !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55) !important;
        padding: 14px 18px !important;
      }
      #view-hub .yk-season-clean {
        background: linear-gradient(135deg, rgba(17, 24, 47, 0.88) 0%, rgba(45, 12, 30, 0.85) 100%) !important;
        backdrop-filter: blur(14px) !important;
        border: 1px solid rgba(251, 191, 36, 0.32) !important;
        border-radius: 18px !important;
        box-shadow: 0 10px 26px rgba(0, 0, 0, 0.45) !important;
        margin-bottom: 14px !important;
      }

      /* ٤. تۆڕی کارتی یارییەکان هاوشێوەی PITO (٣ ستوون لە مۆبایل، ٥ ستوون لە کۆمپیوتەر) */
      #view-hub .grid {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 10px !important;
      }
      @media (min-width: 640px) {
        #view-hub .grid {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 13px !important;
        }
      }
      @media (min-width: 900px) {
        #view-hub .grid {
          grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
          gap: 14px !important;
        }
      }

      /* ٥. کارتی یارییەکانی PITO: بچووک، شووشەیی، وێنەی ١٠٠٪ فوول و بێ هیچ هەڵەیەک */
      #view-hub .pito-game-card {
        position: relative !important;
        display: block !important;
        width: 100% !important;
        aspect-ratio: 4 / 4.7 !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        border-radius: 20px !important;
        background: #0f172a !important;
        border: 1.5px solid rgba(255, 255, 255, 0.14) !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
        transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s ease, box-shadow 0.22s ease !important;
      }
      #view-hub .pito-game-card:hover {
        transform: translateY(-4px) scale(1.02) !important;
        border-color: rgba(251, 191, 36, 0.78) !important;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.7), 0 0 22px rgba(251, 191, 36, 0.28) !important;
      }
      #view-hub .pito-game-card:active {
        transform: scale(0.95) !important;
      }

      /* وێنە و گرافیک و دۆمینە ١٠٠٪ ناو کارتەکە پڕ دەکەنەوە */
      #view-hub .pito-game-card > img,
      #view-hub .pito-game-card > svg {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
        z-index: 1 !important;
        transition: transform 0.45s ease !important;
      }
      #view-hub .pito-game-card:hover > img,
      #view-hub .pito-game-card:hover > svg {
        transform: scale(1.08) !important;
      }
      #view-hub .pito-game-card > div:first-child:not(.pito-card-overlay):not(.pito-badge-ready) {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        z-index: 1 !important;
      }
      @media (max-width: 639px) {
        #view-hub .pito-game-card .w-16.h-28 {
          width: 42px !important;
          height: 74px !important;
        }
      }

      /* چاککردنی تەواوەتی باجی "ئامادەیە" و "بەم زووانە" (بچووک و لە گۆشەی سەرەوە) */
      #view-hub .pito-game-card > span {
        position: absolute !important;
        top: 7px !important;
        right: 7px !important;
        left: auto !important;
        bottom: auto !important;
        width: auto !important;
        height: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 2px 7px !important;
        font-size: 9px !important;
        font-weight: 800 !important;
        line-height: 1.2 !important;
        border-radius: 9999px !important;
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: #ffffff !important;
        border: 1px solid rgba(167, 243, 208, 0.55) !important;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5) !important;
        z-index: 15 !important;
      }
      #view-hub .pito-game-card .pito-badge-ready {
        position: absolute !important;
        top: 7px !important;
        right: 7px !important;
        left: auto !important;
        bottom: auto !important;
        width: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        padding: 2px 7px !important;
        font-size: 9px !important;
        font-weight: 900 !important;
        border-radius: 9999px !important;
        background: linear-gradient(135deg, #fbbf24, #d97706) !important;
        color: #1c1003 !important;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.55) !important;
        z-index: 15 !important;
      }

      /* شریتی ناوی یارییەکە لە خوارەوەی کارتەکە (سپی و زۆر ڕوون) */
      #view-hub .pito-card-overlay {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        top: auto !important;
        width: 100% !important;
        padding: 28px 6px 9px 6px !important;
        background: linear-gradient(180deg, rgba(6, 9, 20, 0) 0%, rgba(6, 9, 20, 0.78) 52%, rgba(6, 9, 20, 0.96) 100%) !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: center !important;
        text-align: center !important;
        z-index: 12 !important;
      }
      #view-hub .pito-card-title {
        color: #ffffff !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        letter-spacing: 0.2px !important;
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95) !important;
        line-height: 1.2 !important;
      }
      @media (min-width: 768px) {
        #view-hub .pito-card-title {
          font-size: 14px !important;
        }
      }

      /* ٦. نەڤباری خوارەوە (Dock) بە ستایلی شووشەیی مۆدێرن و شیک */
      .floating-bottom-dock {
        background: rgba(11, 16, 33, 0.86) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 1.5px solid rgba(251, 191, 36, 0.38) !important;
        box-shadow: 0 14px 36px rgba(0, 0, 0, 0.72), 0 0 20px rgba(225, 29, 72, 0.16) !important;
      }
      .floating-bottom-dock .dock-item.active {
        background: linear-gradient(135deg, #fde047 0%, #f59e0b 100%) !important;
        box-shadow: 0 0 18px rgba(251, 191, 36, 0.65) !important;
      }
    `;
    document.head.appendChild(st);
  }

  function polishHubElements() {
    const hub = document.getElementById('view-hub');
    if (!hub) return;

    // پاککردنەوەی هەر کڵاسێکی کۆن کە خۆری دووبارەی دروست دەکرد
    hub.querySelectorAll('.yk-kurdistan-banner-fix').forEach(el => {
      el.classList.remove('yk-kurdistan-banner-fix');
      el.classList.add('yk-banner-clean');
    });

    const flagBanner = Array.from(hub.querySelectorAll('div')).find(el =>
      (el.textContent || '').includes('دەستمان بگرە') && el.querySelector('svg')
    );
    if (flagBanner) flagBanner.classList.add('yk-banner-clean');

    const seasonBar = document.getElementById('hubSeasonBar');
    if (seasonBar) {
      const seasonCard = seasonBar.closest('.rounded-2xl');
      if (seasonCard) seasonCard.classList.add('yk-season-clean');
    }

    // پڕکردنەوەی تەواوەتی SVGـی یارییەکانی داهاتوو بێ هیچ بۆشاییەکی ڕەش
    hub.querySelectorAll('.pito-game-card > svg').forEach(svg => {
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    });
  }

  function triggerProfileClick() {
    if (typeof openEditProfileModal === 'function') return openEditProfileModal();
    if (typeof openProfileModal === 'function') return openProfileModal();
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

  function mountMasterUI() {
    injectMasterCss();
    polishHubElements();

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
    setTimeout(polishHubElements, 400);
    setTimeout(polishHubElements, 1200);
    setInterval(syncTopBarData, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountMasterUI);
  } else {
    mountMasterUI();
  }
})();