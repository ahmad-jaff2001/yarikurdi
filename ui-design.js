/* === دیزاینی سحراوی و شاهانەی YariKurdi (Imperial Purple & Liquid Gold Edition) === */
(function buildYariKurdiImperialPurpleUI() {
  let magicAnimId = null;

  function injectImperialCss() {
    ['ykCleanTopBarCss', 'ykMasterpieceCss', 'ykMagicalRoyalCss', 'ykImperialPurpleCss'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const st = document.createElement('style');
    st.id = 'ykImperialPurpleCss';
    st.textContent = `
      @keyframes ykGoldShimmer {
        0%   { transform: translateX(170%) skewX(-24deg); }
        100% { transform: translateX(-170%) skewX(-24deg); }
      }
      @keyframes ykRoyalRaysSpin {
        0%   { transform: translate(-50%, -20%) rotate(0deg); }
        100% { transform: translate(-50%, -20%) rotate(360deg); }
      }
      @keyframes ykRibbonWaveLeft {
        0%, 100% { transform: rotate(-12deg) translateY(0px) scaleX(1); opacity: 0.72; }
        50%      { transform: rotate(-9deg) translateY(-14px) scaleX(1.06); opacity: 0.95; }
      }
      @keyframes ykRibbonWaveRight {
        0%, 100% { transform: rotate(12deg) translateY(0px) scaleX(1); opacity: 0.72; }
        50%      { transform: rotate(9deg) translateY(14px) scaleX(1.06); opacity: 0.95; }
      }
      @keyframes ykBorderGlowPulse {
        0%, 100% { box-shadow: 0 14px 36px rgba(0, 0, 0, 0.78), 0 0 26px rgba(192, 38, 211, 0.42), 0 0 14px rgba(250, 204, 21, 0.35); }
        50%      { box-shadow: 0 14px 38px rgba(0, 0, 0, 0.82), 0 0 38px rgba(168, 85, 247, 0.65), 0 0 22px rgba(250, 204, 21, 0.6); }
      }

      /* ١. پاشبنەمای مۆری شاهانەی تێر و قووڵ + ڕووناکیی ئەرخەوانی و زێڕین */
      html, body {
        background-color: #090114 !important;
        background-image:
          radial-gradient(ellipse 85% 48% at 50% 0%, rgba(168, 85, 247, 0.42) 0%, rgba(107, 33, 168, 0.28) 42%, transparent 74%),
          radial-gradient(circle at 8% 34%, rgba(192, 38, 211, 0.34) 0%, transparent 40%),
          radial-gradient(circle at 92% 34%, rgba(147, 51, 234, 0.36) 0%, transparent 40%),
          radial-gradient(ellipse 75% 36% at 50% 100%, rgba(250, 204, 21, 0.24) 0%, rgba(126, 34, 206, 0.22) 48%, transparent 78%),
          linear-gradient(180deg, #16032e 0%, #0b0118 52%, #18032e 100%) !important;
        background-attachment: fixed !important;
        color: #fefce8 !important;
        overflow-x: hidden !important;
      }

      /* پاشبنەمای سحراویی جووڵاو (تیشکی سەرەوە + شەپۆلی مۆر و زێڕ + ئەستێرەی بریقەدار) */
      #ykMagicBackdrop {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .yk-magic-sunburst {
        position: absolute;
        top: 0;
        left: 50%;
        width: 145vmax;
        height: 145vmax;
        background: repeating-conic-gradient(
          from 0deg,
          rgba(192, 38, 211, 0.08) 0deg 9deg,
          transparent 9deg 22deg,
          rgba(250, 204, 21, 0.065) 22deg 30deg,
          transparent 30deg 45deg
        );
        animation: ykRoyalRaysSpin 72s linear infinite;
        mask-image: radial-gradient(circle at center, #000 0%, rgba(0,0,0,0.45) 38%, transparent 68%);
        -webkit-mask-image: radial-gradient(circle at center, #000 0%, rgba(0,0,0,0.45) 38%, transparent 68%);
      }
      .yk-silk-ribbon-left {
        position: absolute;
        top: 22%;
        left: -18%;
        width: 68%;
        height: 150px;
        background: linear-gradient(90deg, rgba(168, 85, 247, 0.35), rgba(250, 204, 21, 0.28), rgba(192, 38, 211, 0.32), transparent);
        border-radius: 50%;
        filter: blur(42px);
        animation: ykRibbonWaveLeft 9s ease-in-out infinite;
      }
      .yk-silk-ribbon-right {
        position: absolute;
        top: 26%;
        right: -18%;
        width: 68%;
        height: 150px;
        background: linear-gradient(270deg, rgba(250, 204, 21, 0.3), rgba(147, 51, 234, 0.38), rgba(217, 70, 239, 0.3), transparent);
        border-radius: 50%;
        filter: blur(42px);
        animation: ykRibbonWaveRight 10s ease-in-out infinite;
      }
      #ykMagicCanvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }

      /* هێشتنەوەی ناوەڕۆک لە سەروو باگراوندە سحراوییەکە */
      #view-hub, main, section {
        position: relative;
        z-index: 2;
      }

      /* ٢. تابی سەرەوەی مۆری شاهانە بە قەراغی زێڕینی درەوشاوە */
      #ykCleanTopBar {
        position: sticky;
        top: 0;
        z-index: 9000;
        width: 100%;
        background: linear-gradient(180deg, rgba(35, 5, 68, 0.94) 0%, rgba(15, 2, 31, 0.96) 100%);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: 0 10px 34px rgba(0, 0, 0, 0.8), 0 2px 22px rgba(168, 85, 247, 0.35);
        padding: 8px 12px 11px 12px;
      }
      #ykCleanTopBar::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, #9333ea 0%, #d946ef 20%, #fef08a 50%, #f59e0b 65%, #d946ef 85%, #9333ea 100%);
        box-shadow: 0 0 18px rgba(250, 204, 21, 0.85), 0 0 12px rgba(217, 70, 239, 0.75);
      }
      .yk-tb-inner {
        max-width: 980px;
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
        background: linear-gradient(135deg, rgba(147, 51, 234, 0.32), rgba(15, 2, 31, 0.75));
        border: 1.5px solid rgba(250, 204, 21, 0.68);
        padding: 3px 11px 3px 4px;
        border-radius: 9999px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.55), 0 0 14px rgba(192, 38, 211, 0.32);
        transition: all 0.2s ease;
        min-width: 0;
      }
      .yk-tb-profile-group:hover {
        border-color: #fef08a;
        box-shadow: 0 0 22px rgba(250, 204, 21, 0.55), 0 0 16px rgba(217, 70, 239, 0.45);
      }
      .yk-tb-profile-group:active { transform: scale(0.96); }
      .yk-tb-avatar-box {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        padding: 2px;
        background: conic-gradient(from 0deg, #fef08a, #f59e0b, #d946ef, #9333ea, #fef08a);
        box-shadow: 0 0 16px rgba(250, 204, 21, 0.72);
        flex-shrink: 0;
      }
      .yk-tb-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        object-fit: cover;
        background: #17042e;
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
        background: linear-gradient(180deg, #d946ef, #7e22ce);
        border: 1.5px solid #fef08a;
        color: #fff;
        font-size: 9px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 8px rgba(217, 70, 239, 0.8);
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
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.9);
      }
      .yk-tb-user-sub {
        color: #fde047;
        font-size: 9px;
        font-weight: 800;
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
        max-width: 128px;
        flex: 1;
        height: 33px;
        padding: 0 4px 0 8px;
        border-radius: 9999px;
        background: linear-gradient(180deg, rgba(16, 2, 34, 0.92), rgba(42, 7, 78, 0.85));
        border: 1.5px solid rgba(250, 204, 21, 0.62);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.75), 0 0 12px rgba(168, 85, 247, 0.28);
      }
      .yk-tb-val {
        color: #fef9c3;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 12px;
        font-weight: 900;
        text-shadow: 0 0 10px rgba(250, 204, 21, 0.65);
      }
      .yk-tb-plus {
        width: 22px;
        height: 22px;
        border-radius: 9999px;
        background: linear-gradient(180deg, #fef08a 0%, #f59e0b 65%, #b45309 100%);
        color: #291202;
        font-size: 16px;
        font-weight: 900;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 1px solid #fef9c3;
        box-shadow: 0 2px 12px rgba(250, 204, 21, 0.75);
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
        width: 35px;
        height: 35px;
        border-radius: 12px;
        background: linear-gradient(180deg, rgba(147, 51, 234, 0.35), rgba(20, 3, 40, 0.92));
        border: 1.5px solid rgba(250, 204, 21, 0.58);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5), 0 0 10px rgba(192, 38, 211, 0.25);
        transition: all 0.2s ease;
      }
      .yk-tb-icon-btn:hover {
        border-color: #fef08a;
        box-shadow: 0 0 18px rgba(250, 204, 21, 0.6), 0 0 14px rgba(217, 70, 239, 0.5);
        transform: translateY(-1px);
      }

      /* ٣. ڕێکخستنی پەڕەی سەرەکی و بەنەرە سحراوییەکان */
      #view-hub {
        max-width: 980px !important;
        padding-top: 16px !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }
      #view-hub > div:first-child {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
      }

      #view-hub .yk-banner-clean {
        position: relative !important;
        overflow: hidden !important;
        border-radius: 22px !important;
        border: 2px solid #facc15 !important;
        animation: ykBorderGlowPulse 4s ease-in-out infinite !important;
        padding: 15px 18px !important;
      }
      #view-hub .yk-banner-clean::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 40%;
        background: linear-gradient(90deg, transparent, rgba(254, 249, 195, 0.32), transparent);
        animation: ykGoldShimmer 4.5s ease-in-out infinite;
        pointer-events: none;
      }
      #view-hub .yk-banner-clean button {
        background: linear-gradient(180deg, #fef08a 0%, #f59e0b 65%, #b45309 100%) !important;
        color: #261002 !important;
        border: 1.5px solid #fef9c3 !important;
        font-weight: 900 !important;
        box-shadow: 0 4px 20px rgba(250, 204, 21, 0.78) !important;
      }

      /* شریتی وەرزی شاهانە (مۆری تێر + ئەرخەوانی + زێڕ) */
      #view-hub .yk-season-clean {
        background: linear-gradient(135deg, rgba(59, 7, 100, 0.9) 0%, rgba(28, 4, 54, 0.92) 55%, rgba(112, 26, 117, 0.84) 100%) !important;
        backdrop-filter: blur(16px) !important;
        border: 1.5px solid rgba(250, 204, 21, 0.68) !important;
        border-radius: 18px !important;
        box-shadow:
          0 12px 30px rgba(0, 0, 0, 0.65),
          0 0 22px rgba(168, 85, 247, 0.35),
          inset 0 1px 0 rgba(254, 240, 138, 0.35) !important;
        margin-bottom: 16px !important;
      }

      /* ٤. تۆڕی کارتی یارییەکان: ٣ ستوون لە مۆبایل، ٤ ستوونی پڕ و هاوسەنگ لە کۆمپیوتەر */
      #view-hub .grid {
        display: grid !important;
        grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
        gap: 11px !important;
      }
      @media (min-width: 640px) {
        #view-hub .grid {
          grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          gap: 16px !important;
        }
      }

      /* ٥. کارتی یارییەکان: مۆری مەخمەڵی + چوارچێوەی زێڕینی ٣ ڕەهەندی + تیشکی نیۆن */
      #view-hub .pito-game-card {
        position: relative !important;
        display: block !important;
        width: 100% !important;
        aspect-ratio: 4 / 4.65 !important;
        height: auto !important;
        min-height: 0 !important;
        max-height: none !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        border-radius: 22px !important;
        background: #140326 !important;
        border: 2px solid rgba(250, 204, 21, 0.72) !important;
        box-shadow:
          0 16px 34px rgba(0, 0, 0, 0.8),
          0 0 22px rgba(168, 85, 247, 0.38),
          inset 0 0 0 1px rgba(254, 249, 195, 0.35) !important;
        transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.26s ease, box-shadow 0.26s ease !important;
      }
      #view-hub .pito-game-card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 20px;
        box-shadow: inset 0 0 24px rgba(217, 70, 239, 0.28), inset 0 1px 0 rgba(254, 249, 195, 0.45);
        pointer-events: none;
        z-index: 10;
      }
      #view-hub .pito-game-card::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 48%;
        background: linear-gradient(90deg, transparent, rgba(254, 249, 195, 0.42), transparent);
        transform: translateX(180%) skewX(-24deg);
        pointer-events: none;
        z-index: 11;
      }
      #view-hub .pito-game-card:hover {
        transform: translateY(-7px) scale(1.035) !important;
        border-color: #fef08a !important;
        box-shadow:
          0 22px 44px rgba(0, 0, 0, 0.88),
          0 0 36px rgba(250, 204, 21, 0.68),
          0 0 28px rgba(217, 70, 239, 0.72) !important;
      }
      #view-hub .pito-game-card:hover::after {
        animation: ykGoldShimmer 0.85s ease-out forwards;
      }
      #view-hub .pito-game-card:active {
        transform: scale(0.95) !important;
      }

      /* وێنە و گرافیک ١٠٠٪ ناو کارتەکە پڕ دەکەنەوە */
      #view-hub .pito-game-card > img,
      #view-hub .pito-game-card > svg {
        position: absolute !important;
        inset: 0 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        display: block !important;
        z-index: 1 !important;
        transition: transform 0.5s ease !important;
      }
      #view-hub .pito-game-card:hover > img,
      #view-hub .pito-game-card:hover > svg {
        transform: scale(1.1) !important;
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

      /* باجە بریقەدارەکانی سەر کارتەکان */
      #view-hub .pito-game-card > span {
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        left: auto !important;
        bottom: auto !important;
        width: auto !important;
        height: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 2px 8px !important;
        font-size: 9.5px !important;
        font-weight: 900 !important;
        line-height: 1.2 !important;
        border-radius: 9999px !important;
        background: linear-gradient(135deg, #d946ef, #7e22ce) !important;
        color: #ffffff !important;
        border: 1px solid #f5d0fe !important;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.7), 0 0 12px rgba(217, 70, 239, 0.7) !important;
        z-index: 15 !important;
      }
      #view-hub .pito-game-card .pito-badge-ready {
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        left: auto !important;
        bottom: auto !important;
        width: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        padding: 2px 8px !important;
        font-size: 9.5px !important;
        font-weight: 900 !important;
        border-radius: 9999px !important;
        background: linear-gradient(180deg, #fef08a 0%, #f59e0b 100%) !important;
        color: #291202 !important;
        border: 1px solid #fef9c3 !important;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.7), 0 0 12px rgba(250, 204, 21, 0.65) !important;
        z-index: 15 !important;
      }

      /* شریتی ناوی یارییەکە بە فۆنتی زێڕینی درەوشاوە لە خوارەوەی کارت */
      #view-hub .pito-card-overlay {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        top: auto !important;
        width: 100% !important;
        padding: 36px 6px 10px 6px !important;
        background: linear-gradient(180deg, rgba(16, 2, 34, 0) 0%, rgba(22, 3, 46, 0.85) 52%, rgba(12, 1, 26, 0.98) 100%) !important;
        border-top: 1px solid rgba(250, 204, 21, 0.22) !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: center !important;
        text-align: center !important;
        z-index: 12 !important;
      }
      #view-hub .pito-card-title {
        background: linear-gradient(180deg, #ffffff 8%, #fef08a 58%, #f59e0b 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.98)) drop-shadow(0 0 8px rgba(250, 204, 21, 0.45)) !important;
        line-height: 1.25 !important;
      }
      @media (min-width: 768px) {
        #view-hub .pito-card-title {
          font-size: 16px !important;
        }
      }

      /* ٦. نەڤباری خوارەوە (Dock) بە شووشەی مۆری شاهانە و هالەی زێڕین */
      .floating-bottom-dock {
        background: linear-gradient(180deg, rgba(44, 6, 82, 0.92), rgba(15, 2, 31, 0.96)) !important;
        backdrop-filter: blur(22px) !important;
        -webkit-backdrop-filter: blur(22px) !important;
        border: 2px solid rgba(250, 204, 21, 0.72) !important;
        box-shadow:
          0 16px 42px rgba(0, 0, 0, 0.88),
          0 0 32px rgba(192, 38, 211, 0.48),
          0 0 18px rgba(250, 204, 21, 0.3),
          inset 0 1px 0 rgba(254, 249, 195, 0.42) !important;
      }
      .floating-bottom-dock .dock-item.active {
        background: linear-gradient(180deg, #fef08a 0%, #f59e0b 70%, #b45309 100%) !important;
        box-shadow: 0 0 24px rgba(250, 204, 21, 0.92), 0 0 14px rgba(217, 70, 239, 0.55) !important;
        border: 1.5px solid #fef9c3 !important;
      }
    `;
    document.head.appendChild(st);
  }

  function mountImperialBackdrop() {
    const oldBg = document.getElementById('ykMagicBackdrop');
    if (oldBg) oldBg.remove();

    const bg = document.createElement('div');
    bg.id = 'ykMagicBackdrop';
    bg.innerHTML = `
      <div class="yk-magic-sunburst"></div>
      <div class="yk-silk-ribbon-left"></div>
      <div class="yk-silk-ribbon-right"></div>
      <canvas id="ykMagicCanvas"></canvas>
    `;
    document.body.prepend(bg);

    const cvs = document.getElementById('ykMagicCanvas');
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let w = 0, h = 0;

    function resize() {
      w = cvs.width = window.innerWidth;
      h = cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // تۆزی زێڕینی سحراوی و گەردیلەی ئەرخەوانی
    const motes = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.5 + 0.8,
      vy: -(Math.random() * 0.00055 + 0.00018),
      ph: Math.random() * Math.PI * 2,
      color: i % 4 === 0 ? '232, 121, 249' : (i % 6 === 0 ? '192, 132, 252' : '253, 224, 71')
    }));

    // ئەستێرەی بریقەداری چوارتیشک (ڕێک وەک لۆگۆکە)
    const stars = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.85,
      size: Math.random() * 7 + 5,
      ph: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.035 + 0.015
    }));

    function drawFourPointStar(cx, cy, size, alpha) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = `rgba(254, 249, 195, ${alpha.toFixed(2)})`;
      ctx.shadowBlur = 14;
      ctx.shadowColor = `rgba(250, 204, 21, ${alpha.toFixed(2)})`;
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const nextAngle = angle + Math.PI / 4;
        ctx.lineTo(Math.cos(angle) * size, Math.sin(angle) * size);
        ctx.lineTo(Math.cos(nextAngle) * (size * 0.18), Math.sin(nextAngle) * (size * 0.18));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function animate() {
      if (!document.getElementById('ykMagicCanvas')) return;
      ctx.clearRect(0, 0, w, h);

      for (const m of motes) {
        m.y += m.vy;
        m.ph += 0.022;
        if (m.y < -0.03) { m.y = 1.03; m.x = Math.random(); }
        const mx = (m.x + Math.sin(m.ph) * 0.014) * w;
        const my = m.y * h;
        const alpha = 0.28 + 0.68 * Math.abs(Math.sin(m.ph * 1.1));
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${m.color}, ${alpha.toFixed(2)})`;
        ctx.fillStyle = `rgba(${m.color}, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const s of stars) {
        s.ph += s.speed;
        const pulse = Math.pow(Math.abs(Math.sin(s.ph)), 2.2);
        if (pulse > 0.15) {
          drawFourPointStar(s.x * w, s.y * h, s.size * (0.55 + pulse * 0.7), pulse * 0.95);
        }
      }

      ctx.shadowBlur = 0;
      magicAnimId = requestAnimationFrame(animate);
    }

    if (magicAnimId) cancelAnimationFrame(magicAnimId);
    animate();
  }

  function polishHubElements() {
    const hub = document.getElementById('view-hub');
    if (!hub) return;

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
    injectImperialCss();
    mountImperialBackdrop();
    polishHubElements();

    const oldBar = document.getElementById('ykCleanTopBar');
    if (oldBar) oldBar.remove();

    const coinSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="#FEF08A" opacity="0.7"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#78350F">Y</text></svg>`;
    const gemSvg = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L21 9L12 22L3 9L12 2Z" fill="#E879F9" stroke="#A21CAF" stroke-width="1.8"/><path d="M12 2L16.5 9L12 22L7.5 9L12 2Z" fill="#FAE8FF" opacity="0.72"/></svg>`;

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