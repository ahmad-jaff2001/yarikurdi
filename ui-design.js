/* ============================================================================
   YariKurdi — Clean Royal Red & Velvet UI Engine (bê tîşk û bê qursayî)
   ============================================================================ */
(function initCleanRoyalUI() {
  'use strict';

  function injectCleanRoyalStyles() {
    if (document.getElementById('ykCleanRoyalCss')) return;
    const style = document.createElement('style');
    style.id = 'ykCleanRoyalCss';
    style.textContent = `
      /* پاشبنەمای سووری مەخمەلیی تێر و ساف بەبێ هیچ تیشکێکی خولاوە */
      html, body {
        background-color: #120204 !important;
        background-image:
          linear-gradient(180deg, rgba(58, 8, 15, 0.78) 0%, rgba(24, 3, 7, 0.90) 48%, rgba(12, 2, 4, 0.98) 100%),
          url('bg-royal.jpg') !important;
        background-size: cover !important;
        background-position: center top !important;
        background-attachment: fixed !important;
        color: #ffffff !important;
      }

      /* کوژاندنەوەی تەواوی تیشکە خولاوەکان و پڕیشکە پرتەقاڵییەکان */
      #ykMasterpieceBg,
      .yk-splash-sunburst,
      [class*="sunburst" i] {
        display: none !important;
      }

      /* شریتی سەرەوە (Header) بە سووری مەخمەلی و زێڕیی ماتی شامپانیا */
      #ykCleanTopBar {
        position: sticky;
        top: 0;
        z-index: 40;
        width: 100%;
        background: linear-gradient(180deg, rgba(52, 7, 14, 0.96) 0%, rgba(26, 3, 7, 0.94) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(212, 180, 117, 0.32);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.72);
        padding: 10px 14px;
      }

      .yk-top-inner {
        max-width: 1024px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .yk-profile-pill {
        display: flex;
        align-items: center;
        gap: 9px;
        background: rgba(20, 2, 5, 0.75);
        border: 1px solid rgba(212, 180, 117, 0.42);
        padding: 4px 12px 4px 5px;
        border-radius: 9999px;
        cursor: pointer;
        transition: border-color 0.2s ease, transform 0.15s ease;
      }
      .yk-profile-pill:active { transform: scale(0.96); }

      .yk-top-avatar {
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #e5c687, #b8924a);
        color: #1a0406;
        font-weight: 900;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border: 1.5px solid #fef3c7;
        flex-shrink: 0;
      }
      .yk-top-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .yk-coin-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(20, 2, 5, 0.82);
        border: 1px solid rgba(212, 180, 117, 0.42);
        padding: 4px 8px 4px 10px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 900;
        color: #fef08a;
        cursor: pointer;
      }

      .yk-top-icon-btn {
        width: 36px;
        height: 36px;
        border-radius: 9999px;
        background: rgba(36, 5, 10, 0.9);
        border: 1px solid rgba(212, 180, 117, 0.38);
        color: #f3d999;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.15s ease, border-color 0.2s ease;
      }
      .yk-top-icon-btn:hover { border-color: #fde047; }
      .yk-top-icon-btn:active { transform: scale(0.92); }

      /* ناوی یارییەکان بە سپیی ساف و ڕوون */
      .pito-game-card {
        background: #180306 !important;
        border: 1px solid rgba(212, 180, 117, 0.38) !important;
        border-radius: 18px !important;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.85) !important;
      }
      .pito-game-card::after { display: none !important; }
      .pito-card-overlay {
        background: linear-gradient(to top, rgba(12, 2, 4, 0.96) 10%, rgba(18, 3, 5, 0.32) 52%, transparent 100%) !important;
      }
      .pito-card-title,
      .pito-card-overlay span {
        color: #ffffff !important;
        -webkit-text-fill-color: #ffffff !important;
        background: none !important;
        font-size: 16.5px !important;
        font-weight: 800 !important;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.98) !important;
      }

      /* شریتی خوارەوە بە تاریکی شاهانە و بێ بازنەی زەرد */
      .floating-bottom-dock {
        background: rgba(18, 3, 5, 0.96) !important;
        background-image: none !important;
        border: 1px solid rgba(212, 180, 117, 0.3) !important;
        border-radius: 22px !important;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.92) !important;
      }
      .dock-item {
        background: transparent !important;
        box-shadow: none !important;
        color: #e2e8f0 !important;
      }
      .dock-item.active {
        background: rgba(212, 180, 117, 0.18) !important;
        border: 1px solid rgba(212, 180, 117, 0.45) !important;
        color: #f3d999 !important;
        transform: translateY(-2px) !important;
      }
    `;
    document.head.appendChild(style);
  }

  function buildTopHeader() {
    if (document.getElementById('ykCleanTopBar')) return;
    const header = document.createElement('header');
    header.id = 'ykCleanTopBar';
    header.setAttribute('dir', 'rtl');
    header.innerHTML = `
      <div class="yk-top-inner">
        <!-- بەشی پڕۆفایل -->
        <div class="yk-profile-pill" onclick="if(typeof openUserProfile==='function'){openUserProfile();}else if(typeof openEditProfileModal==='function'){openEditProfileModal();}">
          <div id="headerAvatar" class="yk-top-avatar">ی</div>
          <div class="leading-tight text-right">
            <div id="headerPlayerName" class="text-xs font-black text-white truncate max-w-[115px]">یاریزان</div>
            <span id="headerLevelBadge" class="text-[9.5px] font-bold text-amber-300">Lvl 1 • سەرەتایی</span>
          </div>
        </div>

        <!-- سکە و دوگمە خێراکان -->
        <div class="flex items-center gap-2">
          <div class="yk-coin-pill" onclick="if(typeof openCoinStoreModal==='function'){openCoinStoreModal();}">
            <span>🪙</span>
            <span id="headerCoinsCount" class="yk-user-coin-balance font-mono">250</span>
            <span class="w-4 h-4 rounded-full bg-amber-400 text-[#1a0406] font-black text-xs flex items-center justify-center">+</span>
          </div>

          <button type="button" onclick="if(typeof openBazaarModal==='function'){openBazaarModal();}" class="yk-top-icon-btn" title="بازاڕ">🏪</button>
          <button type="button" id="soundBtn" onclick="if(typeof toggleSound==='function'){toggleSound();}" class="yk-top-icon-btn" title="دەنگ">🔊</button>
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  function boot() {
    injectCleanRoyalStyles();
    buildTopHeader();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();