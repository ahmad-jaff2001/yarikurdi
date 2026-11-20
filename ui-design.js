/* === دیزاینی سحراوی و شاهانەی YariKurdi (Emerald, Gold & Royal Crimson Edition) === */
(function buildYariKurdiMagicalUI() {
  let magicAnimId = null;

  function injectMagicCss() {
    ['ykCleanTopBarCss', 'ykMasterpieceCss', 'ykMagicalRoyalCss'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const st = document.createElement('style');
    st.id = 'ykMagicalRoyalCss';
    st.textContent = `
      @keyframes ykGoldShimmer {
        0%   { transform: translateX(160%) skewX(-24deg); }
        100% { transform: translateX(-160%) skewX(-24deg); }
      }
      @keyframes ykSunRaysSpin {
        0%   { transform: translate(-50%, -18%) rotate(0deg); }
        100% { transform: translate(-50%, -18%) rotate(360deg); }
      }
      @keyframes ykPulseAura {
        0%, 100% { opacity: 0.55; transform: scale(1); }
        50%      { opacity: 0.85; transform: scale(1.06); }
      }

      /* ١. پاشبنەمای سحراویی سەوزی زمروودی + تیشکی زێڕین و سووری شاهانە */
      html, body {
        background-color: #03140b !important;
        background-image:
          radial-gradient(ellipse 80% 45% at 50% 0%, rgba(16, 185, 129, 0.34) 0%, rgba(6, 78, 59, 0.22) 45%, transparent 75%),
          radial-gradient(circle at 12% 28%, rgba(220, 38, 38, 0.24) 0%, transparent 38%),
          radial-gradient(circle at 88% 28%, rgba(220, 38, 38, 0.24) 0%, transparent 38%),
          radial-gradient(ellipse 70% 35% at 50% 100%, rgba(250, 204, 21, 0.22) 0%, transparent 70%),
          linear-gradient(180deg, #041d10 0%, #021109 55%, #06180d 100%) !important;
        background-attachment: fixed !important;
        color: #fefce8 !important;
        overflow-x: hidden !important;
      }

      /* تیشکی سحراویی سەرەوە + زەمینەی تەختەی شەتڕەنجی زێڕین لە خوارەوە */
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
        width: 140vmax;
        height: 140vmax;
        background: repeating-conic-gradient(
          from 0deg,
          rgba(250, 204, 21, 0.05) 0deg 8deg,
          transparent 8deg 22deg,
          rgba(16, 185, 129, 0.06) 22deg 30deg,
          transparent 30deg 45deg
        );
        animation: ykSunRaysSpin 75s linear infinite;
        mask-image: radial-gradient(circle at center, #000 0%, rgba(0,0,0,0.4) 35%, transparent 65%);
        -webkit-mask-image: radial-gradient(circle at center, #000 0%, rgba(0,0,0,0.4) 35%, transparent 65%);
      }
      .yk-magic-chess-floor {
        position: absolute;
        left: -15%;
        right: -15%;
        bottom: -24px;
        height: 190px;
        background-image:
          linear-gradient(45deg, rgba(250, 204, 21, 0.16) 25%, transparent 25%),
          linear-gradient(-45deg, rgba(250, 204, 21, 0.16) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, rgba(250, 204, 21, 0.16) 75%),
          linear-gradient(-45deg, transparent 75%, rgba(250, 204, 21, 0.16) 75%);
        background-size: 56px 56px;
        background-position: 0 0, 0 28px, 28px -28px, -28px 0;
        transform: perspective(360px) rotateX(64deg);
        transform-origin: bottom center;
        mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 55%, #000 100%);
        -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.65) 55%, #000 100%);
        opacity: 0.72;
      }
      #ykMagicCanvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }

      /* بەرزکردنەوەی ناوەڕۆک بۆ سەروو باگراوندە سحراوییەکە */
      #view-hub, main, section {
        position: relative;
        z-index: 2;
      }

      /* ٢. تابی سەرەوەی شاهانە (سەوز و زێڕ و ئاڵای کوردستان) */
      #ykCleanTopBar {
        position: sticky;
        top: 0;
        z-index: 9000;
        width: 100%;
        background: linear-gradient(180deg, rgba(5, 36, 20, 0.94) 0%, rgba(3, 18, 10, 0.96) 100%);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        box-shadow: 0 10px 32px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(253, 224, 71, 0.25);
        padding: 8px 12px 11px 12px;
      }
      #ykCleanTopBar::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, #dc2626 0%, #dc2626 32%, #ffffff 44%, #facc15 50%, #ffffff 56%, #16a34a 68%, #16a34a 100%);
        box-shadow: 0 0 16px rgba(250, 204, 21, 0.75);
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
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(0, 0, 0, 0.52));
        border: 1.5px solid rgba(250, 204, 21, 0.55);
        padding: 3px 11px 3px 4px;
        border-radius: 9999px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(254, 240, 138, 0.25);
        transition: all 0.2s ease;
        min-width: 0;
      }
      .yk-tb-profile-group:hover {
        border-color: #fde047;
        box-shadow: 0 0 18px rgba(250, 204, 21, 0.4);
      }
      .yk-tb-profile-group:active { transform: scale(0.96); }
      .yk-tb-avatar-box {
        position: relative;
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        padding: 2px;
        background: conic-gradient(from 0deg, #fef08a, #d97706, #dc2626, #22c55e, #fef08a);
        box-shadow: 0 0 14px rgba(250, 204, 21, 0.65);
        flex-shrink: 0;
      }
      .yk-tb-avatar-img {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        object-fit: cover;
        background: #062112;
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
        background: linear-gradient(180deg, #ef4444, #991b1b);
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
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85);
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
        background: linear-gradient(180deg, rgba(2, 16, 9, 0.88), rgba(6, 36, 20, 0.85));
        border: 1.5px solid rgba(250, 204, 21, 0.5);
        box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.4);
      }
      .yk-tb-val {
        color: #fef9c3;
        font-family: ui-monospace, SFMono-Regular, monospace;
        font-size: 12px;
        font-weight: 900;
        text-shadow: 0 0 8px rgba(250, 204, 21, 0.45);
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
        box-shadow: 0 2px 10px rgba(245, 158, 11, 0.65);
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
        background: linear-gradient(180deg, rgba(16, 185, 129, 0.18), rgba(4, 24, 14, 0.88));
        border: 1.5px solid rgba(250, 204, 21, 0.48);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 17px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
        transition: all 0.2s ease;
      }
      .yk-tb-icon-btn:hover {
        border-color: #fde047;
        box-shadow: 0 0 16px rgba(250, 204, 21, 0.45);
        transform: translateY(-1px);
      }

      /* ٣. پاککردنەوەی بۆکسی سادەی دەرەوەی Hub و کردنی بە مەیدانی شاهانە */
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

      /* بەنەری ئاڵای کوردستان بە چوارچێوەی زێڕینی ٣ ڕەهەندی و بریقەی جووڵاو */
      #view-hub .yk-banner-clean {
        position: relative !important;
        overflow: hidden !important;
        border-radius: 22px !important;
        border: 2px solid #facc15 !important;
        box-shadow:
          0 14px 36px rgba(0, 0, 0, 0.72),
          0 0 28px rgba(250, 204, 21, 0.26),
          inset 0 1px 0 rgba(254, 249, 195, 0.6) !important;
        padding: 15px 18px !important;
      }
      #view-hub .yk-banner-clean::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 38%;
        background: linear-gradient(90deg, transparent, rgba(254, 249, 195, 0.26), transparent);
        animation: ykGoldShimmer 4.8s ease-in-out infinite;
        pointer-events: none;
      }
      #view-hub .yk-banner-clean button {
        background: linear-gradient(180deg, #fef08a 0%, #f59e0b 65%, #b45309 100%) !important;
        color: #261002 !important;
        border: 1.5px solid #fef9c3 !important;
        font-weight: 900 !important;
        box-shadow: 0 4px 18px rgba(250, 204, 21, 0.65) !important;
      }

      /* شریتی وەرزی شاهانە (سەوزی زمروودی + زێڕ) */
      #view-hub .yk-season-clean {
        background: linear-gradient(135deg, rgba(6, 46, 26, 0.88) 0%, rgba(16, 20, 12, 0.9) 55%, rgba(69, 10, 10, 0.75) 100%) !important;
        backdrop-filter: blur(14px) !important;
        border: 1.5px solid rgba(250, 204, 21, 0.55) !important;
        border-radius: 18px !important;
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(254, 240, 138, 0.28) !important;
        margin-bottom: 16px !important;
      }

      /* ٤. تۆڕی کارتی یارییەکان: ٣ ستوون لە مۆبایل، ٤ ستوونی تەواو پڕ و هاوسەنگ لە کۆمپیوتەر */
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

      /* ٥. کارتی یارییەکان بە ستایلی قەڵغانی زێڕینی سحراوی (لۆگۆکەت) */
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
        background: #041b0f !important;
        border: 2px solid rgba(250, 204, 21, 0.62) !important;
        box-shadow:
          0 14px 30px rgba(0, 0, 0, 0.72),
          0 0 18px rgba(16, 185, 129, 0.22),
          inset 0 0 0 1px rgba(254, 249, 195, 0.28) !important;
        transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.26s ease, box-shadow 0.26s ease !important;
      }
      #view-hub .pito-game-card::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 20px;
        box-shadow: inset 0 0 22px rgba(250, 204, 21, 0.22);
        pointer-events: none;
        z-index: 10;
      }
      #view-hub .pito-game-card::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 45%;
        background: linear-gradient(90deg, transparent, rgba(254, 249, 195, 0.34), transparent);
        transform: translateX(180%) skewX(-24deg);
        pointer-events: none;
        z-index: 11;
      }
      #view-hub .pito-game-card:hover {
        transform: translateY(-6px) scale(1.03) !important;
        border-color: #fef08a !important;
        box-shadow:
          0 20px 40px rgba(0, 0, 0, 0.82),
          0 0 32px rgba(250, 204, 21, 0.55),
          0 0 18px rgba(16, 185, 129, 0.45) !important;
      }
      #view-hub .pito-game-card:hover::after {
        animation: ykGoldShimmer 0.9s ease-out forwards;
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

      /* باجە بریقەدارەکانی ئامادەیە و بەم زووانە */
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
        background: linear-gradient(135deg, #22c55e, #047857) !important;
        color: #ffffff !important;
        border: 1px solid #bbf7d0 !important;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.65), 0 0 10px rgba(34, 197, 94, 0.55) !important;
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
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.65), 0 0 10px rgba(250, 204, 21, 0.55) !important;
        z-index: 15 !important;
      }

      /* ناوی یارییەکە بە فۆنتی زێڕینی درەوشاوە لە خوارەوەی کارت */
      #view-hub .pito-card-overlay {
        position: absolute !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        top: auto !important;
        width: 100% !important;
        padding: 34px 6px 10px 6px !important;
        background: linear-gradient(180deg, rgba(2, 18, 9, 0) 0%, rgba(2, 18, 9, 0.82) 52%, rgba(2, 14, 7, 0.98) 100%) !important;
        border-top: 1px solid rgba(250, 204, 21, 0.16) !important;
        display: flex !important;
        align-items: flex-end !important;
        justify-content: center !important;
        text-align: center !important;
        z-index: 12 !important;
      }
      #view-hub .pito-card-title {
        background: linear-gradient(180deg, #ffffff 10%, #fef08a 65%, #f59e0b 100%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        font-size: 14px !important;
        font-weight: 900 !important;
        filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.95)) !important;
        line-height: 1.25 !important;
      }
      @media (min-width: 768px) {
        #view-hub .pito-card-title {
          font-size: 16px !important;
        }
      }

      /* ٦. نەڤباری خوارەوە (Dock) بە شووشەی زمروودی و چوارچێوەی زێڕینی گەش */
      .floating-bottom-dock {
        background: linear-gradient(180deg, rgba(5, 34, 19, 0.92), rgba(2, 16, 9, 0.96)) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 2px solid rgba(250, 204, 21, 0.65) !important;
        box-shadow:
          0 16px 40px rgba(0, 0, 0, 0.85),
          0 0 28px rgba(250, 204, 21, 0.25),
          inset 0 1px 0 rgba(254, 249, 195, 0.35) !important;
      }
      .floating-bottom-dock .dock-item.active {
        background: linear-gradient(180deg, #fef08a 0%, #f59e0b 70%, #b45309 100%) !important;
        box-shadow: 0 0 22px rgba(250, 204, 21, 0.85) !important;
        border: 1.5px solid #fef9c3 !important;
      }
    `;
    document.head.appendChild(st);
  }

  function mountMagicBackdrop() {
    if (document.getElementById('ykMagicBackdrop')) return;
    const bg = document.createElement('div');
    bg.id = 'ykMagicBackdrop';
    bg.innerHTML = `
      <div class="yk-magic-sunburst"></div>
      <div class="yk-magic-chess-floor"></div>
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

    const orbs = Array.from({ length: 34 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 2.6 + 0.9,
      vy: -(Math.random() * 0.00055 + 0.00018),
      ph: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '52, 211, 153' : (i % 5 === 0 ? '248, 113, 113' : '253, 224, 71')
    }));

    function animate() {
      if (!document.getElementById('ykMagicCanvas')) return;
      ctx.clearRect(0, 0, w, h);
      for (const o of orbs) {
        o.y += o.vy;
        o.ph += 0.022;
        if (o.y < -0.03) { o.y = 1.03; o.x = Math.random(); }
        const ox = (o.x + Math.sin(o.ph) * 0.015) * w;
        const oy = o.y * h;
        const alpha = 0.25 + 0.65 * Math.abs(Math.sin(o.ph * 1.1));
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${o.color}, ${alpha.toFixed(2)})`;
        ctx.fillStyle = `rgba(${o.color}, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
        ctx.fill();
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
    injectMagicCss();
    mountMagicBackdrop();
    polishHubElements();

    if (document.getElementById('ykCleanTopBar')) {
      syncTopBarData();
      return;
    }

    const coinSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="#FEF08A" opacity="0.65"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#854D0E">Y</text></svg>`;
    const gemSvg = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 2L21 9L12 22L3 9L12 2Z" fill="#34D399" stroke="#059669" stroke-width="1.8"/><path d="M12 2L16.5 9L12 22L7.5 9L12 2Z" fill="#A7F3D0" opacity="0.65"/></svg>`;

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