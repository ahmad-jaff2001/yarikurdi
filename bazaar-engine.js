window.YK_BAZAAR_CATEGORIES = [
  { id: 'ludo_skin', name: 'ستایلی لودۆ', icon: '🎲', glow: '#22c55e', accent: '#4ade80' },
  { id: 'domino_skin', name: 'ستایلی دۆمینە', icon: '🀱', glow: '#38bdf8', accent: '#7dd3fc' },
  { id: 'chess_skin', name: 'ستایلی شەتڕەنج', icon: '♟️', glow: '#f59e0b', accent: '#fbbf24' },
  { id: 'sticker', name: 'ستیکەر', icon: '😜', glow: '#facc15', accent: '#fde047' },
  { id: 'profile_card', name: 'کارتی پرۆفایل', icon: '🪪', glow: '#eab308', accent: '#facc15' },
  { id: 'ornament', name: 'ڕازاندنەوە', icon: '✨', glow: '#10b981', accent: '#34d399' },
  { id: 'unique_id', name: 'ئایدی تایبەت', icon: '🆔', glow: '#3b82f6', accent: '#60a5fa' },
  { id: 'theme', name: 'ڕووکار و تێم', icon: '🎨', glow: '#a855f7', accent: '#c084fc' },
  { id: 'pin_top', name: 'پینکردن لە سەرەوە', icon: '⬆️', glow: '#14b8a6', accent: '#2dd4bf' },
  { id: 'royal_vehicle', name: 'سەیارەی شاهانە', icon: '🏎️', glow: '#ef4444', accent: '#f87171' },
  { id: 'entry_effects', name: 'ئیفێکتی هاتنەژوورەوە', icon: '👑', glow: '#f59e0b', accent: '#fcd34d' }
];

window.YK_BAZAAR_ITEMS = {};

let ykBazaarActiveCat = null;

function injectRoyalBazaarStyles() {
  if (document.getElementById('ykRoyalBazaarCss')) return;
  const st = document.createElement('style');
  st.id = 'ykRoyalBazaarCss';
  st.textContent = `
    @keyframes ykBazaarTwinkle {
      0%, 100% { opacity: 0.45; transform: scale(0.85); }
      50% { opacity: 1; transform: scale(1.25); }
    }
    @keyframes ykBazaarFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-4px); }
    }
    @keyframes ykBazaarPopIn {
      0% { opacity: 0; transform: scale(0.95) translateY(10px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .yk-bazaar-backdrop {
      background: radial-gradient(circle at top, #0b3b2c 0%, #051c17 52%, #030e0c 100%);
    }
    .yk-bazaar-header {
      background: linear-gradient(180deg, rgba(6, 40, 31, 0.96) 0%, rgba(4, 24, 19, 0.9) 100%);
      border-bottom: 1px solid rgba(52, 211, 153, 0.2);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    }
    .yk-bazaar-cabinet {
      background: linear-gradient(180deg, rgba(7, 46, 36, 0.65) 0%, rgba(4, 22, 18, 0.92) 100%);
      border-left: 6px solid #062820;
      border-right: 6px solid #062820;
      box-shadow: inset 0 18px 36px rgba(0, 0, 0, 0.55), inset 0 -18px 30px rgba(0, 0, 0, 0.5);
    }
    .yk-bazaar-bulb {
      width: 6px;
      height: 6px;
      border-radius: 9999px;
      background: #fef08a;
      box-shadow: 0 0 10px 2px rgba(250, 204, 21, 0.85), 0 0 18px rgba(52, 211, 153, 0.6);
      animation: ykBazaarTwinkle 2.2s ease-in-out infinite;
    }
    .yk-shelf-row {
      position: relative;
      padding: 16px 12px 0 12px;
      margin-bottom: 14px;
    }
    .yk-shelf-ledge {
      height: 14px;
      margin: 0 -12px;
      background: linear-gradient(180deg, #10b981 0%, #059669 32%, #044e3b 100%);
      border-top: 1px solid rgba(167, 243, 208, 0.45);
      border-bottom: 3px solid #022c22;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.6);
      border-radius: 3px;
    }
    .yk-shelf-slot {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
      padding: 10px 4px 10px 4px;
      border-radius: 14px 14px 4px 4px;
      background: linear-gradient(180deg, rgba(16, 185, 129, 0.04) 0%, rgba(16, 185, 129, 0.16) 100%);
      border: 1px solid rgba(52, 211, 153, 0.14);
      border-bottom: none;
      transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.2s ease, background 0.2s ease;
    }
    .yk-shelf-slot:hover {
      transform: translateY(-3px);
      border-color: rgba(250, 204, 21, 0.45);
      background: linear-gradient(180deg, rgba(250, 204, 21, 0.06) 0%, rgba(16, 185, 129, 0.24) 100%);
    }
    .yk-shelf-slot:active {
      transform: scale(0.95);
    }
    .yk-shelf-pedestal {
      position: relative;
      width: 68px;
      height: 62px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
    }
    .yk-shelf-icon {
      font-size: 40px;
      line-height: 1;
      z-index: 2;
      animation: ykBazaarFloat 3.2s ease-in-out infinite;
    }
    .yk-shelf-pill {
      position: relative;
      z-index: 3;
      width: 96%;
      text-align: center;
      padding: 3px 6px;
      border-radius: 9999px;
      background: linear-gradient(180deg, #064e3b 0%, #022c22 100%);
      border: 1px solid rgba(110, 231, 183, 0.45);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.18);
      color: #ecfdf5;
      font-size: 10px;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .yk-bazaar-subview {
      animation: ykBazaarPopIn 0.26s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `;
  document.head.appendChild(st);
}

function injectBazaarNavButtons() {
  if (!document.getElementById('ykTopNavBazaarBtn')) {
    const navAnchors = Array.from(document.querySelectorAll('button, a, div')).filter(el => {
      const txt = (el.textContent || '').trim();
      return txt === 'ڕیزبەندی' || txt === 'هاوڕێ و چات' || txt === 'ژوورەکان';
    });
    const refBtn = navAnchors[0];
    if (refBtn && refBtn.parentElement) {
      const btn = document.createElement('button');
      btn.id = 'ykTopNavBazaarBtn';
      btn.type = 'button';
      btn.onclick = () => window.openBazaarModal();
      btn.className = refBtn.className || 'px-3 py-1.5 rounded-full text-xs font-black text-emerald-300 hover:text-yellow-300 transition flex items-center gap-1.5';
      btn.innerHTML = '<span>🏪</span><span>بازاڕ</span>';
      refBtn.parentElement.appendChild(btn);
    }
  }

  if (!document.getElementById('ykBottomNavBazaarBtn')) {
    const bottomBars = Array.from(document.querySelectorAll('nav, div')).filter(el => {
      const cls = el.className || '';
      return typeof cls === 'string' && (cls.includes('bottom-0') || cls.includes('fixed bottom')) && el.querySelectorAll('button').length >= 3;
    });
    const bar = bottomBars[0];
    if (bar) {
      const bBtn = document.createElement('button');
      bBtn.id = 'ykBottomNavBazaarBtn';
      bBtn.type = 'button';
      bBtn.onclick = () => window.openBazaarModal();
      bBtn.className = 'flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-emerald-300 hover:text-yellow-300 transition';
      bBtn.innerHTML = '<span class="text-lg leading-none">🏪</span><span class="text-[10px] font-black">بازاڕ</span>';
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
    const delay = (i * 0.18).toFixed(2);
    return `<span class="yk-bazaar-bulb" style="margin-top:${drop}px; animation-delay:${delay}s;"></span>`;
  }).join('');
  return `
    <div class="relative w-full px-4 pt-2 pb-1 flex items-start justify-between pointer-events-none">
      <div class="absolute inset-x-4 top-2 h-4 border-b border-emerald-300/25 rounded-b-full"></div>
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
                  <div class="absolute inset-1 rounded-full blur-lg opacity-55" style="background: radial-gradient(circle, ${cat.glow} 0%, transparent 72%);"></div>
                  <span class="yk-shelf-icon" style="animation-delay:${(idx * 0.35).toFixed(2)}s; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.65));">${cat.icon}</span>
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
      <div class="flex items-center justify-between mb-5 pb-3 border-b border-emerald-400/20">
        <div class="flex items-center gap-2.5">
          <span class="w-10 h-10 rounded-xl flex items-center justify-center text-2xl bg-emerald-950/80 border border-emerald-400/35" style="box-shadow: 0 0 18px ${cat.glow}44;">${cat.icon}</span>
          <div>
            <div class="text-sm font-black text-white">${cat.name}</div>
            <div class="text-[11px] text-emerald-300/80 font-bold">بەشی بازاڕی شاهانە</div>
          </div>
        </div>
        <button type="button" onclick="backToBazaarShelves()"
          class="px-3.5 py-1.5 rounded-full bg-emerald-900/70 hover:bg-emerald-800/80 border border-emerald-400/35 text-xs font-black text-emerald-100 transition">
          گەڕانەوە ➔
        </button>
      </div>

      ${items.length === 0 ? `
        <div class="flex-1 flex flex-col items-center justify-center text-center py-16 px-6 rounded-3xl bg-black/25 border border-emerald-400/15">
          <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 bg-emerald-950/70 border border-emerald-400/25" style="box-shadow: 0 0 32px ${cat.glow}33;">
            ${cat.icon}
          </div>
          <div class="text-base font-black text-white mb-1.5">${cat.name}</div>
          <div class="text-xs font-bold text-emerald-200/75 max-w-[240px] leading-relaxed">
            ئەم بەشە ئامادەیە و بەم زووانە دیزاین و کاڵا تایبەتەکانی تێدا زیاد دەکرێت.
          </div>
        </div>
      ` : `
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          ${items.map(item => `
            <div class="rounded-2xl p-3 bg-emerald-950/55 border border-emerald-400/25 flex flex-col items-center gap-2">
              <div class="text-3xl">${item.icon || cat.icon}</div>
              <div class="text-xs font-black text-white truncate w-full text-center">${item.name}</div>
              <div class="text-[11px] font-black text-yellow-300">🪙 ${Number(item.cost || 0).toLocaleString()}</div>
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

  root.innerHTML = `
    <div class="w-full max-w-md mx-auto h-full flex flex-col shadow-2xl overflow-hidden">
      <div class="yk-bazaar-header px-4 py-3 flex items-center justify-between">
        <div class="w-9"></div>
        <div class="inline-flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-black/50 border border-emerald-400/35 shadow-inner">
          <span class="text-lg leading-none">💎</span>
          <span id="ykBazaarCoinsVal" class="text-sm font-black font-mono text-white min-w-[36px] text-center">${coins.toLocaleString()}</span>
          <button type="button" onclick="if(typeof openCoinStoreModal==='function'){openCoinStoreModal();}"
            class="w-6 h-6 rounded-full bg-gradient-to-b from-yellow-300 to-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow hover:brightness-110 active:scale-95 transition">
            +
          </button>
        </div>
        <button type="button" onclick="closeBazaarModal()"
          class="w-9 h-9 rounded-full bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-400/25 flex items-center justify-center text-emerald-200 font-black text-lg transition active:scale-90">
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
    setTimeout(injectBazaarNavButtons, 700);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();