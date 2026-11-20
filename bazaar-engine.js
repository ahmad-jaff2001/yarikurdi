window.YK_BAZAAR_CATEGORIES = [
  { id: 'ludo_skin', name: 'ستایلی لودۆ', icon: '🎲', glow: '#34d399', accent: '#6ee7b7' },
  { id: 'domino_skin', name: 'ستایلی دۆمینە', icon: '🀱', glow: '#38bdf8', accent: '#7dd3fc' },
  { id: 'chess_skin', name: 'ستایلی شەتڕەنج', icon: '♟️', glow: '#fbbf24', accent: '#fef08a' },
  { id: 'sticker', name: 'ستیکەر', icon: '😜', glow: '#facc15', accent: '#fde047' },
  { id: 'profile_card', name: 'کارتی پرۆفایل', icon: '🪪', glow: '#f59e0b', accent: '#fcd34d' },
  { id: 'ornament', name: 'ڕازاندنەوە', icon: '✨', glow: '#e879f9', accent: '#f5d0fe' },
  { id: 'unique_id', name: 'ئایدی تایبەت', icon: '🆔', glow: '#60a5fa', accent: '#93c5fd' },
  { id: 'theme', name: 'ڕووکار و تێم', icon: '🎨', glow: '#c084fc', accent: '#e9d5ff' },
  { id: 'pin_top', name: 'پینکردن لە سەرەوە', icon: '⬆️', glow: '#2dd4bf', accent: '#99f6e4' },
  { id: 'royal_vehicle', name: 'سەیارەی شاهانە', icon: '🏎️', glow: '#f87171', accent: '#fca5a5' },
  { id: 'entry_effects', name: 'ئیفێکتی هاتنەژوورەوە', icon: '👑', glow: '#facc15', accent: '#fef08a' }
];

window.YK_BAZAAR_ITEMS = {};

let ykBazaarActiveCat = null;

function injectRoyalBazaarStyles() {
  const old = document.getElementById('ykRoyalBazaarCss');
  if (old) old.remove();

  const st = document.createElement('style');
  st.id = 'ykRoyalBazaarCss';
  st.textContent = `
    @keyframes ykBazaarTwinkle {
      0%, 100% { opacity: 0.45; transform: scale(0.85); }
      50% { opacity: 1; transform: scale(1.3); }
    }
    @keyframes ykBazaarFloat {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-5px) scale(1.04); }
    }
    @keyframes ykBazaarPopIn {
      0% { opacity: 0; transform: scale(0.95) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes ykBazaarShimmer {
      0% { transform: translateX(170%) skewX(-24deg); }
      100% { transform: translateX(-170%) skewX(-24deg); }
    }

    /* پاشبنەمای مۆری شاهانەی تێر و قووڵ */
    .yk-bazaar-backdrop {
      background:
        radial-gradient(ellipse 80% 45% at 50% 0%, rgba(168, 85, 247, 0.42) 0%, rgba(88, 28, 135, 0.28) 45%, transparent 75%),
        radial-gradient(circle at 12% 35%, rgba(217, 70, 239, 0.28) 0%, transparent 40%),
        radial-gradient(circle at 88% 65%, rgba(250, 204, 21, 0.16) 0%, transparent 42%),
        linear-gradient(180deg, #16032e 0%, #0b0118 55%, #190433 100%);
    }

    /* هێدەری سەرەوەی بازاڕ */
    .yk-bazaar-header {
      position: relative;
      background: linear-gradient(180deg, rgba(42, 6, 80, 0.96) 0%, rgba(18, 2, 36, 0.94) 100%);
      border-bottom: 2px solid rgba(250, 204, 21, 0.65);
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.72), 0 0 22px rgba(192, 38, 211, 0.35);
    }

    /* کابینەی سحراویی بازاڕ */
    .yk-bazaar-cabinet {
      background:
        radial-gradient(circle at 50% 10%, rgba(168, 85, 247, 0.22) 0%, transparent 55%),
        linear-gradient(180deg, rgba(34, 6, 66, 0.82) 0%, rgba(15, 2, 30, 0.96) 100%);
      border-left: 3px solid rgba(250, 204, 21, 0.42);
      border-right: 3px solid rgba(250, 204, 21, 0.42);
      box-shadow:
        inset 0 22px 42px rgba(0, 0, 0, 0.62),
        inset 0 -22px 34px rgba(0, 0, 0, 0.62),
        0 0 40px rgba(147, 51, 234, 0.35);
    }

    /* گڵۆپە زێڕین و مۆرە بریقەدارەکانی سەرەوە */
    .yk-bazaar-bulb {
      width: 7px;
      height: 7px;
      border-radius: 9999px;
      background: #fef9c3;
      box-shadow: 0 0 12px 3px rgba(250, 204, 21, 0.92), 0 0 20px rgba(217, 70, 239, 0.78);
      animation: ykBazaarTwinkle 2.1s ease-in-out infinite;
    }

    .yk-shelf-row {
      position: relative;
      padding: 16px 12px 0 12px;
      margin-bottom: 16px;
    }

    /* ڕەفەی زێڕین و مۆری ٣ ڕەهەندی */
    .yk-shelf-ledge {
      height: 14px;
      margin: 0 -12px;
      background: linear-gradient(180deg, #fef08a 0%, #f59e0b 24%, #6b21a8 58%, #2e074f 100%);
      border-top: 1.5px solid #fef9c3;
      border-bottom: 3px solid #140226;
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.78), 0 0 16px rgba(250, 204, 21, 0.38);
      border-radius: 4px;
    }

    /* کارتی هەر بەشێک لەسەر ڕەفەکە (زۆر ڕوون و سحراوی) */
    .yk-shelf-slot {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
      padding: 12px 5px 10px 5px;
      border-radius: 16px 16px 5px 5px;
      background: linear-gradient(180deg, rgba(147, 51, 234, 0.22) 0%, rgba(30, 5, 58, 0.84) 100%);
      border: 1.5px solid rgba(250, 204, 21, 0.38);
      border-bottom: none;
      box-shadow: inset 0 1px 0 rgba(254, 249, 195, 0.25), 0 6px 18px rgba(0, 0, 0, 0.45);
      transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
    }
    .yk-shelf-slot::after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
      background: linear-gradient(90deg, transparent, rgba(254, 249, 195, 0.32), transparent);
      transform: translateX(180%) skewX(-24deg);
      pointer-events: none;
    }
    .yk-shelf-slot:hover {
      transform: translateY(-4px) scale(1.03);
      border-color: #fef08a;
      background: linear-gradient(180deg, rgba(192, 38, 211, 0.34) 0%, rgba(44, 7, 84, 0.92) 100%);
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.65), 0 0 22px rgba(250, 204, 21, 0.42), 0 0 16px rgba(217, 70, 239, 0.45);
    }
    .yk-shelf-slot:hover::after {
      animation: ykBazaarShimmer 0.8s ease-out forwards;
    }
    .yk-shelf-slot:active {
      transform: scale(0.95);
    }

    /* ستەیجی ئایکۆنەکە تا زۆر بە ڕوونی و گەشی دەربکەوێت */
    .yk-shelf-pedestal {
      position: relative;
      width: 72px;
      height: 66px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 7px;
      border-radius: 9999px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(168, 85, 247, 0.08) 55%, transparent 75%);
    }
    .yk-shelf-icon {
      font-size: 42px;
      line-height: 1;
      z-index: 2;
      animation: ykBazaarFloat 3.1s ease-in-out infinite;
    }

    /* ناوی بەشەکە بە زێڕین و ڕوونی تەواو */
    .yk-shelf-pill {
      position: relative;
      z-index: 3;
      width: 98%;
      text-align: center;
      padding: 4px 6px;
      border-radius: 9999px;
      background: linear-gradient(180deg, #4c1d95 0%, #1e0538 100%);
      border: 1px solid rgba(250, 204, 21, 0.62);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(254, 249, 195, 0.3);
      color: #fef9c3;
      font-size: 10.5px;
      font-weight: 900;
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.95);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .yk-bazaar-subview {
      animation: ykBazaarPopIn 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* کارتی کاڵاکان لەناو بەشەکاندا */
    .yk-bazaar-item-card {
      background: linear-gradient(180deg, rgba(88, 28, 135, 0.45) 0%, rgba(20, 3, 40, 0.92) 100%);
      border: 1.5px solid rgba(250, 204, 21, 0.5);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.55), 0 0 14px rgba(168, 85, 247, 0.25);
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .yk-bazaar-item-card:hover {
      transform: translateY(-3px);
      border-color: #fef08a;
      box-shadow: 0 12px 26px rgba(0, 0, 0, 0.7), 0 0 22px rgba(250, 204, 21, 0.45);
    }
  `;
  document.head.appendChild(st);
}

function injectBazaarNavButtons() {
  if (!document.getElementById('ykTopNavBazaarBtn')) {
    const candidates = Array.from(document.querySelectorAll('button, a'));
    const refBtn = candidates.find(el => {
      const txt = (el.textContent || '').trim();
      return txt.includes('ڕیزبەندی') || txt.includes('هاوڕێ و چات');
    });
    if (refBtn && refBtn.parentElement) {
      const btn = document.createElement('button');
      btn.id = 'ykTopNavBazaarBtn';
      btn.type = 'button';
      btn.onclick = () => window.openBazaarModal();
      btn.className = refBtn.className || 'px-3 py-1.5 rounded-full text-xs font-black text-amber-300 hover:text-yellow-200 transition flex items-center gap-1.5';
      btn.innerHTML = '<span>🏪</span><span>بازاڕ</span>';
      refBtn.parentElement.appendChild(btn);
    }
  }

  if (!document.getElementById('ykBottomNavBazaarBtn')) {
    const bottomBars = Array.from(document.querySelectorAll('nav, div')).filter(el => {
      const cls = typeof el.className === 'string' ? el.className : '';
      return (cls.includes('bottom-') || cls.includes('fixed')) && el.querySelectorAll('button').length >= 4 && el.getBoundingClientRect().top > window.innerHeight * 0.65;
    });
    const bar = bottomBars[bottomBars.length - 1];
    if (bar) {
      const sampleBtn = bar.querySelector('button');
      const bBtn = document.createElement('button');
      bBtn.id = 'ykBottomNavBazaarBtn';
      bBtn.type = 'button';
      bBtn.onclick = () => window.openBazaarModal();
      bBtn.className = sampleBtn ? sampleBtn.className.replace(/bg-yellow-\d+|text-slate-\d+/g, '') : 'flex items-center justify-center p-2 text-amber-300 hover:text-yellow-200 transition';
      bBtn.title = 'بازاڕ';
      bBtn.innerHTML = '<span class="text-lg leading-none">🏪</span>';
      bar.appendChild(bBtn);
    }
  }
}

function getBazaarCoinsBalance() {
  if (typeof myUserCoins !== 'undefined') return Number(myUserCoins) || 0;
  const el = document.getElementById('userCoinsDisplay') || document.getElementById('headerCoinsCount');
  if (el) {
    const n = parseInt((el.textContent || '').replace(/[^\d]/g, ''), 10);
    if (!isNaN(n)) return n;
  }
  return 0;
}

function ensureBazaarModalRoot() {
  let root = document.getElementById('ykRoyalBazaarModal');
  if (!root) {
    root = document.createElement('div');
    root.id = 'ykRoyalBazaarModal';
    root.className = 'fixed inset-0 z-[9990] hidden flex-col yk-bazaar-backdrop text-white select-none';
    root.setAttribute('dir', 'rtl');
    document.body.appendChild(root);
  }
  return root;
}

function buildFairyLightsHtml() {
  const bulbs = Array.from({ length: 15 }, (_, i) => {
    const drop = Math.round(Math.sin((i / 14) * Math.PI) * 10);
    const delay = (i * 0.16).toFixed(2);
    return `<span class="yk-bazaar-bulb" style="margin-top:${drop}px; animation-delay:${delay}s;"></span>`;
  }).join('');
  return `
    <div class="relative w-full px-4 pt-2.5 pb-1 flex items-start justify-between pointer-events-none">
      <div class="absolute inset-x-4 top-2.5 h-4 border-b border-yellow-300/40 rounded-b-full"></div>
      ${bulbs}
    </div>
  `;
}

function renderBazaarShelvesHtml() {
  const rows = [];
  for (let i = 0; i < window.YK_BAZAAR_CATEGORIES.length; i += 3) {
    rows.push(window.YK_BAZAAR_CATEGORIES.slice(i, i + 3));
  }

  return `
    <div class="yk-bazaar-cabinet flex-1 overflow-y-auto px-2 pb-10">
      ${buildFairyLightsHtml()}
      ${rows.map(row => `
        <div class="yk-shelf-row">
          <div class="grid grid-cols-3 gap-2.5 items-end">
            ${row.map((cat, idx) => `
              <button type="button" onclick="openBazaarCategory('${cat.id}')" class="yk-shelf-slot">
                <div class="yk-shelf-pedestal">
                  <div class="absolute inset-0 rounded-full blur-md opacity-75" style="background: radial-gradient(circle, ${cat.glow} 0%, transparent 70%);"></div>
                  <span class="yk-shelf-icon" style="animation-delay:${(idx * 0.32).toFixed(2)}s; filter: drop-shadow(0 0 12px ${cat.glow}) drop-shadow(0 6px 10px rgba(0,0,0,0.8));">${cat.icon}</span>
                </div>
                <div class="yk-shelf-pill">${cat.name}</div>
              </button>
            `).join('')}
          </div>
          <div class="yk-shelf-ledge"></div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderBazaarCategoryDetailHtml(catId) {
  const cat = window.YK_BAZAAR_CATEGORIES.find(c => c.id === catId);
  if (!cat) return renderBazaarShelvesHtml();
  const items = window.YK_BAZAAR_ITEMS[catId] || [];

  return `
    <div class="yk-bazaar-cabinet yk-bazaar-subview flex-1 overflow-y-auto px-4 py-4 flex flex-col">
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-yellow-400/30">
        <div class="flex items-center gap-2.5">
          <span class="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl bg-purple-950/90 border border-yellow-400/60" style="box-shadow: 0 0 22px ${cat.glow}66;">${cat.icon}</span>
          <div>
            <div class="text-sm font-black text-yellow-200 drop-shadow">${cat.name}</div>
            <div class="text-[11px] text-fuchsia-200/85 font-bold">بازاڕی شاهانەی YariKurdi</div>
          </div>
        </div>
        <button type="button" onclick="backToBazaarShelves()"
          class="px-3.5 py-1.5 rounded-full bg-purple-900/80 hover:bg-purple-800/90 border border-yellow-400/55 text-xs font-black text-yellow-100 shadow transition">
          گەڕانەوە ➔
        </button>
      </div>

      ${items.length === 0 ? `
        <div class="flex-1 flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl bg-purple-950/45 border border-yellow-400/30 shadow-inner">
          <div class="w-22 h-22 p-5 rounded-full flex items-center justify-center text-5xl mb-4 bg-purple-900/70 border-2 border-yellow-300/60" style="box-shadow: 0 0 36px ${cat.glow}66;">
            ${cat.icon}
          </div>
          <div class="text-base font-black text-yellow-200 mb-1.5">${cat.name}</div>
          <div class="text-xs font-bold text-purple-100/85 max-w-[250px] leading-relaxed">
            ئەم بەشە ئامادەیە و بەم زووانە دیزاین و کاڵا شاهانەکانی تێدا زیاد دەکرێت.
          </div>
        </div>
      ` : `
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${items.map(item => `
            <div class="yk-bazaar-item-card rounded-2xl p-3 flex flex-col items-center gap-2">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-purple-950/80 border border-yellow-300/35" style="filter: drop-shadow(0 0 10px ${cat.glow}88);">
                ${item.icon || cat.icon}
              </div>
              <div class="text-xs font-black text-white truncate w-full text-center">${item.name}</div>
              <div class="px-2.5 py-0.5 rounded-full bg-black/50 border border-yellow-400/45 text-[11px] font-black text-yellow-300">
                🪙 ${Number(item.cost || 0).toLocaleString()}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

window.renderRoyalBazaar = function () {
  injectRoyalBazaarStyles();
  const root = ensureBazaarModalRoot();
  const coins = getBazaarCoinsBalance();
  const coinSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#FACC15" stroke="#CA8A04" stroke-width="2"/><circle cx="12" cy="12" r="6.5" fill="#FEF08A" opacity="0.72"/><text x="12" y="16" text-anchor="middle" font-size="11" font-weight="900" fill="#78350F">Y</text></svg>`;

  root.innerHTML = `
    <div class="w-full max-w-md mx-auto h-full flex flex-col shadow-2xl overflow-hidden">
      <div class="yk-bazaar-header px-4 py-3 flex items-center justify-between">
        <div class="text-xs font-black text-yellow-200 tracking-wide">🏪 بازاڕ</div>
        <div class="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-[#130226]/90 border border-yellow-400/65 shadow-inner">
          ${coinSvg}
          <span id="ykBazaarCoinsVal" class="yk-bazaar-coin-val text-sm font-black font-mono text-yellow-100 min-w-[36px] text-center">${coins.toLocaleString()}</span>
          <button type="button" onclick="if(typeof openCoinStoreModal==='function'){openCoinStoreModal();}"
            class="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 text-[#261002] font-black text-base flex items-center justify-center shadow hover:brightness-110 active:scale-95 transition">
            +
          </button>
        </div>
        <button type="button" onclick="closeBazaarModal()"
          class="w-9 h-9 rounded-full bg-purple-950/90 hover:bg-purple-800 border border-yellow-400/55 flex items-center justify-center text-yellow-200 font-black text-lg shadow transition active:scale-90">
          ✕
        </button>
      </div>
      ${ykBazaarActiveCat ? renderBazaarCategoryDetailHtml(ykBazaarActiveCat) : renderBazaarShelvesHtml()}
    </div>
  `;
};

window.openBazaarCategory = function (catId) {
  ykBazaarActiveCat = catId;
  window.renderRoyalBazaar();
};

window.backToBazaarShelves = function () {
  ykBazaarActiveCat = null;
  window.renderRoyalBazaar();
};

window.openBazaarModal = function () {
  ykBazaarActiveCat = null;
  window.renderRoyalBazaar();
  const root = ensureBazaarModalRoot();
  root.classList.remove('hidden');
  root.classList.add('flex');
};

window.openRoyalBazaar = window.openBazaarModal;
window.openBazaar = window.openBazaarModal;

window.closeBazaarModal = function () {
  const root = document.getElementById('ykRoyalBazaarModal');
  if (!root) return;
  root.classList.add('hidden');
  root.classList.remove('flex');
  ykBazaarActiveCat = null;
};

(function initRoyalBazaarEngine() {
  const boot = () => {
    injectRoyalBazaarStyles();
    injectBazaarNavButtons();
    setTimeout(injectBazaarNavButtons, 500);
    setTimeout(injectBazaarNavButtons, 1500);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();