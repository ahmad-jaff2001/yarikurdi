// ============================================================================
// YARI KURDI - UNIFIED PAYMENT GATEWAY, VOUCHER REDEEM & ADMIN GENERATOR
// Supports Qi Card, FIB, FastPay, International Visa/MC & Instant Voucher Codes
// ============================================================================

const YK_PAYMENT_CONFIG = {
  ownerEmail: 'ah6753038@gmail.com',
  qiCardNumber: '07715712742',
  fibPhoneOrAccount: '07715712742',
  whatsappSupport: '9647715712742',
  waylSeasonLink3Usd: '',
  waylCoinsLink: ''
};

function isCurrentUserPlatformOwner() {
  try {
    if (typeof auth !== 'undefined' && auth.currentUser && auth.currentUser.email) {
      return auth.currentUser.email.trim().toLowerCase() === YK_PAYMENT_CONFIG.ownerEmail;
    }
  } catch (e) {}
  return false;
}

function injectPaymentEngineStyles() {
  if (document.getElementById('ykPaymentStyles')) return;
  const st = document.createElement('style');
  st.id = 'ykPaymentStyles';
  st.textContent = `
    .yk-pay-overlay {
      position: fixed;
      inset: 0;
      z-index: 10050;
      background: rgba(5, 3, 10, 0.86);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      overflow-y: auto;
    }
    .yk-pay-card {
      background: linear-gradient(160deg, #241108 0%, #140905 55%, #0c0604 100%);
      border: 2px solid rgba(250, 204, 21, 0.65);
      border-radius: 26px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.22);
      width: 100%;
      max-width: 440px;
      color: #ffffff;
    }
  `;
  document.head.appendChild(st);
}

// ==================== ١. مۆداڵی پارەدان و بەکارهێنانی کۆدی باڵانس ====================
function openUnifiedCheckoutModal(options = {}) {
  injectPaymentEngineStyles();
  closeUnifiedCheckoutModal();

  const itemType = options.type || 'coins';
  const title = options.title || (itemType === 'season_gold' ? 'ڕێڕەوی زێڕینی وەرز 👑' : 'کڕینی دراوی خۆری زێڕین ☀️');
  const priceLabel = options.priceLabel || (itemType === 'season_gold' ? '$3 (4,500 دینار)' : '1,500 دینار ($1)');
  const coinsAmount = options.coins || 0;
  const targetFriendUid = options.targetFriendUid || '';

  const pUser = (typeof playerProfile !== 'undefined' && playerProfile.username) ? playerProfile.username : (typeof playerId !== 'undefined' ? playerId : '---');
  const pName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'یاریزان';

  const modal = document.createElement('div');
  modal.id = 'ykUnifiedCheckoutModal';
  modal.className = 'yk-pay-overlay';
  modal.setAttribute('dir', 'rtl');
  modal.onclick = (e) => { if (e.target === modal) closeUnifiedCheckoutModal(); };

  modal.innerHTML = `
    <div class="yk-pay-card p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-amber-400/25 pb-3">
        <div>
          <h3 class="text-base sm:text-lg font-black gold-text">${title}</h3>
          <p class="text-[11px] text-amber-200/85">نرخ: <strong class="text-yellow-300">${priceLabel}</strong></p>
        </div>
        <button onclick="closeUnifiedCheckoutModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-black">✕</button>
      </div>

      <!-- بەشی ١: چالاککردنی خێرا بە کۆدی باڵانس (Voucher Code) -->
      <div class="rounded-2xl p-3.5 bg-emerald-500/10 border border-emerald-400/45 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-black text-emerald-300">🎟️ کۆدی کارتی یاری کوردیت هەیە؟</span>
          <span class="text-[10px] text-emerald-200/80">چالاککردنی دەستبەجێ</span>
        </div>
        <div class="flex gap-2">
          <input id="ykVoucherCodeInput" type="text" placeholder="کۆدەکە بنووسە (نموونە: YK-XXXX-XXXX)"
            class="flex-1 px-3 py-2.5 rounded-xl bg-black/60 border border-emerald-400/40 text-xs font-mono text-yellow-300 uppercase focus:outline-none focus:border-yellow-300" style="direction:ltr;" />
          <button onclick="redeemYariKurdiVoucher('${targetFriendUid}')"
            class="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050b18] text-xs font-black shrink-0 shadow">
            چالاککردن ✓
          </button>
        </div>
      </div>

      <!-- بەشی ٢: شێوازەکانی پارەدان (کوردستان و عێراق + دەرەوەی وڵات) -->
      <div class="space-y-2.5">
        <div class="text-xs font-black text-amber-300">💳 چۆن کۆدەکە بکڕم یان پارە بدەم؟</div>

        <!-- Qi Card & FIB (ناوخۆی کوردستان و عێراق) -->
        <div class="rounded-2xl p-3 bg-white/5 border border-amber-400/35 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-white">🇮🇶 ناوخۆی کوردستان و عێراق</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">Qi Card • FIB • FastPay</span>
          </div>
          <div class="text-[11px] text-slate-200 space-y-1 bg-black/45 p-2.5 rounded-xl border border-white/10">
            <div>• <strong>Qi Card:</strong> <span class="font-mono text-yellow-300 select-all">${YK_PAYMENT_CONFIG.qiCardNumber}</span></div>
            <div>• <strong>FIB:</strong> <span class="font-mono text-yellow-300 select-all">${YK_PAYMENT_CONFIG.fibPhoneOrAccount}</span></div>
          </div>
          <button onclick="sendPaymentReceiptToWhatsApp('${encodeURIComponent(title)}', '${encodeURIComponent(priceLabel)}', '${pName}', '${pUser}')"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-[#1a0d06] text-xs font-black shadow-lg flex items-center justify-center gap-1.5">
            <span>📲 ناردنی وێنەی حەواڵە و وەرگرتنی کۆد</span>
          </button>
        </div>

        <!-- دەرەوەی وڵات (Visa / Mastercard) -->
        <div class="rounded-2xl p-3 bg-white/5 border border-sky-400/35 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-white">🌍 دەرەوەی وڵات (ئەورووپا و ئەمریکا)</span>
            <span class="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold">Visa • Mastercard</span>
          </div>
          <button onclick="openInternationalCardGateway('${itemType}', ${coinsAmount})"
            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-black shadow flex items-center justify-center gap-1.5">
            <span>💳 پارەدان بە Visa / Mastercard</span>
          </button>
        </div>
      </div>

      <div class="text-[10px] text-center text-slate-400">
        ناسنامەی هەژمارەکەت: <strong class="text-amber-200 font-mono">@${pUser}</strong>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function closeUnifiedCheckoutModal() {
  const m = document.getElementById('ykUnifiedCheckoutModal');
  if (m) m.remove();
}

function sendPaymentReceiptToWhatsApp(encodedTitle, encodedPrice, pName, pUser) {
  const title = decodeURIComponent(encodedTitle);
  const price = decodeURIComponent(encodedPrice);
  const text = `سڵاو بەڕێز، دەمەوێت بەشداری بکەم لە YariKurdi:\n• داواکاری: ${title}\n• نرخ: ${price}\n• ناو: ${pName}\n• یوزەر: @${pUser}\nئێستا وێنەی حەواڵەی Qi Card / FIB دەنێرم بۆ وەرگرتنی کۆد.`;
  const url = `https://wa.me/${YK_PAYMENT_CONFIG.whatsappSupport}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function openInternationalCardGateway(itemType, coinsAmount) {
  const link = itemType === 'season_gold' ? YK_PAYMENT_CONFIG.waylSeasonLink3Usd : YK_PAYMENT_CONFIG.waylCoinsLink;
  if (link && link.startsWith('http')) {
    window.open(link, '_blank');
  } else {
    alert('دەروازەی پارەدانی ئۆتۆماتیکی بە Visa/Mastercard لە قۆناغی بەستنەوەدایە؛ بۆ کڕینی خێرا دەتوانیت لە ڕێگەی دوگمەی سەرەوە پەیوەندی بکەیت و کۆدی چالاککردن وەربگریت.');
  }
}

// ==================== ٢. پشکنین و بەکارهێنانی کۆدی باڵانس لە Firebase ====================
async function redeemYariKurdiVoucher(targetFriendUid = '') {
  if (typeof db === 'undefined' || typeof playerId === 'undefined' || !playerId) {
    alert('سەرەتا بچۆرە ناو ئەکاونتەکەت!');
    return;
  }
  const inp = document.getElementById('ykVoucherCodeInput');
  const rawCode = (inp && inp.value || '').trim().toUpperCase().replace(/[^A-Z0-9\-]/g, '');
  if (rawCode.length < 5) {
    alert('تکایە کۆدەکە بە دروستی بنووسە!');
    return;
  }

  const ref = db.ref('vouchers/' + rawCode);
  const snap = await ref.once('value');
  if (!snap.exists()) {
    alert('❌ ئەم کۆدە هەڵەیە یان بوونی نییە!');
    return;
  }

  const v = snap.val();
  if (v.used) {
    alert('⚠️ ئەم کۆدە پێشتر بەکارهاتووە!');
    return;
  }

  await ref.update({
    used: true,
    usedBy: playerId,
    usedByName: (typeof playerName !== 'undefined' ? playerName : playerId),
    usedAt: firebase.database.ServerValue.TIMESTAMP
  });

  if (v.rewardType === 'season_gold') {
    const recipientUid = targetFriendUid || playerId;
    const cycle = typeof getCurrentSeasonCycle === 'function'
      ? getCurrentSeasonCycle()
      : { seasonKey: 'season_1', seasonNum: 1 };
    await db.ref(`players/${recipientUid}/seasons/${cycle.seasonKey}/goldenUnlocked`).set(true);
    if (typeof playChessSound === 'function') playChessSound('end');
    alert(targetFriendUid
      ? '🎁 پیرۆزە! ڕێڕەوی زێڕینی وەرز بە دیاری بۆ هاوڕێکەت چالاک کرا!'
      : '👑 پیرۆزە! ڕێڕەوی زێڕینی وەرز بۆ تۆ چالاک کرا — ئێستا هەموو خەڵاتە زێڕینەکان وەربگرە!');
  } else {
    const coins = Number(v.coins) || 1000;
    if (typeof addUserCoins === 'function') {
      addUserCoins(coins);
    } else {
      const curSnap = await db.ref(`players/${playerId}/coins`).once('value');
      const cur = Number(curSnap.val()) || 0;
      await db.ref(`players/${playerId}/coins`).set(cur + coins);
    }
    if (typeof playChessSound === 'function') playChessSound('end');
    alert(`🎉 پیرۆزە! ${coins.toLocaleString()} دراوی خۆری زێڕین (YK) زیاد کرا بۆ باڵانسەکەت!`);
  }

  closeUnifiedCheckoutModal();
}

// ==================== ٣. پانێڵی ئەدمین بۆ دروستکردنی کۆد (تەنها بۆ خاوەنی پلاتفۆرم) ====================
function openAdminVoucherGeneratorModal() {
  if (!isCurrentUserPlatformOwner()) {
    alert('ئەم بەشە تەنها بۆ خاوەنی پلاتفۆرم بەردەستە!');
    return;
  }
  injectPaymentEngineStyles();
  closeAdminVoucherGeneratorModal();

  const modal = document.createElement('div');
  modal.id = 'ykAdminVoucherModal';
  modal.className = 'yk-pay-overlay';
  modal.setAttribute('dir', 'rtl');
  modal.onclick = (e) => { if (e.target === modal) closeAdminVoucherGeneratorModal(); };

  modal.innerHTML = `
    <div class="yk-pay-card p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-amber-400/30 pb-3">
        <div>
          <h3 class="text-base font-black gold-text">👑 پانێڵی دروستکردنی کارتی باڵانس</h3>
          <p class="text-[11px] text-amber-200/80">کۆدی یەکجار بەکارهاتوو دروست بکە بۆ فرۆشتن بە یاریزانان</p>
        </div>
        <button onclick="closeAdminVoucherGeneratorModal()" class="w-8 h-8 rounded-full bg-white/10 text-white font-black">✕</button>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-amber-200 mb-1">جۆری کارتەکە هەڵبژێرە:</label>
          <select id="adminVoucherTypeSelect" class="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-xs text-white font-bold">
            <option value="season_gold">👑 ڕێڕەوی زێڕینی وەرز ($3 • 4,500 دینار)</option>
            <option value="coins_1150">☀️ 1,150 کۆینی YK ($1 • 1,500 دینار)</option>
            <option value="coins_5800">☀️ 5,800 کۆینی YK ($4 • 6,000 دینار)</option>
            <option value="coins_18000">☀️ 18,000 کۆینی YK ($10 • 15,000 دینار)</option>
            <option value="coins_62000">💎 62,000 کۆینی YK ($25 • 37,500 دینار)</option>
          </select>
        </div>

        <button onclick="generateNewVoucherCode()" class="gold-btn w-full py-3 rounded-xl text-xs font-black">
          ✨ دروستکردنی کۆدی نوێ
        </button>

        <div id="adminGeneratedCodeBox" class="hidden rounded-2xl p-3.5 bg-emerald-500/15 border border-emerald-400/50 text-center space-y-2">
          <div class="text-[11px] text-emerald-200 font-bold">کۆدەکە دروست کرا و پاشەکەوت بوو:</div>
          <div id="adminGeneratedCodeText" class="text-lg font-mono font-black text-yellow-300 tracking-wider select-all">YK-XXXX-XXXX</div>
          <button onclick="copyGeneratedVoucherCode()" class="px-4 py-1.5 rounded-full bg-emerald-500 text-[#050b18] text-xs font-black">
            📋 کۆپیکردنی کۆد
          </button>
        </div>
      </div>

      <div class="border-t border-white/10 pt-3 space-y-2">
        <div class="text-xs font-black text-amber-300">📜 دوایین کۆدە دروستکراوەکان:</div>
        <div id="adminRecentVouchersList" class="max-h-40 overflow-y-auto space-y-1.5 text-[11px]"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  loadRecentAdminVouchers();
}

function closeAdminVoucherGeneratorModal() {
  const m = document.getElementById('ykAdminVoucherModal');
  if (m) m.remove();
}

async function generateNewVoucherCode() {
  if (!isCurrentUserPlatformOwner() || typeof db === 'undefined') return;
  const sel = document.getElementById('adminVoucherTypeSelect');
  const val = sel ? sel.value : 'season_gold';

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const randPart = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const code = `YK-${randPart()}-${randPart()}`;

  const payload = {
    code,
    used: false,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  };

  if (val === 'season_gold') {
    payload.rewardType = 'season_gold';
    payload.label = 'ڕێڕەوی زێڕینی وەرز ($3)';
  } else {
    const coins = Number(val.replace('coins_', '')) || 1150;
    payload.rewardType = 'coins';
    payload.coins = coins;
    payload.label = `${coins.toLocaleString()} کۆینی YK`;
  }

  await db.ref('vouchers/' + code).set(payload);

  const box = document.getElementById('adminGeneratedCodeBox');
  const txt = document.getElementById('adminGeneratedCodeText');
  if (box && txt) {
    txt.textContent = code;
    box.classList.remove('hidden');
  }
  loadRecentAdminVouchers();
}

function copyGeneratedVoucherCode() {
  const txt = document.getElementById('adminGeneratedCodeText');
  if (!txt) return;
  navigator.clipboard.writeText(txt.textContent);
  alert('کۆدەکە کۆپی کرا: ' + txt.textContent);
}

function loadRecentAdminVouchers() {
  const list = document.getElementById('adminRecentVouchersList');
  if (!list || typeof db === 'undefined') return;
  db.ref('vouchers').limitToLast(15).once('value', snap => {
    const rows = [];
    snap.forEach(c => rows.push(c.val()));
    rows.reverse();
    if (rows.length === 0) {
      list.innerHTML = '<div class="text-slate-400 text-center py-2">هێشتا هیچ کۆدێک دروست نەکراوە</div>';
      return;
    }
    list.innerHTML = rows.map(r => `
      <div class="flex items-center justify-between bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
        <div>
          <span class="font-mono font-black text-yellow-300">${r.code}</span>
          <span class="text-slate-300 mr-1.5">(${r.label || ''})</span>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[9px] font-black ${r.used ? 'bg-rose-500/25 text-rose-300' : 'bg-emerald-500/25 text-emerald-300'}">
          ${r.used ? 'بەکارهاتووە' : 'ئامادەیە'}
        </span>
      </div>
    `).join('');
  });
}

// ==================== ٤. بەستنەوەی خۆکار بە وەرز ($3)، بازاڕ و دیوەخان ====================
function wirePaymentEngineHooks() {
  window.purchaseGoldenSeasonTrack = function () {
    const cycle = typeof getCurrentSeasonCycle === 'function' ? getCurrentSeasonCycle() : { seasonNum: 1 };
    if (typeof ykSeasonState !== 'undefined' && ykSeasonState.goldenUnlocked) {
      alert('تۆ پێشتر بەشداریت لە ڕێڕەوی زێڕینی ئەم وەرزەدا کردووە! 👑');
      return;
    }
    openUnifiedCheckoutModal({
      type: 'season_gold',
      title: `ڕێڕەوی زێڕینی وەرزی ${cycle.seasonNum} 👑`,
      priceLabel: '$3 (4,500 دینار)'
    });
  };

  window.buyBazaarCoinPack = function (packId) {
    const pk = (typeof YK_COIN_PACKS !== 'undefined' ? YK_COIN_PACKS : []).find(p => p.id === packId);
    if (!pk) return;
    const total = pk.coins + pk.bonus;
    openUnifiedCheckoutModal({
      type: 'coins',
      title: `${total.toLocaleString()} دراوی خۆری زێڕین (YK) ☀️`,
      priceLabel: `${pk.usd} (${pk.iqd})`,
      coins: total
    });
  };

  window.openCoinStoreModal = function () {
    openUnifiedCheckoutModal({
      type: 'coins',
      title: 'کڕینی دراوی خۆری زێڕین (YK) ☀️',
      priceLabel: 'لە 1,500 دینارەوە ($1)'
    });
  };

  if (isCurrentUserPlatformOwner()) {
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn && soundBtn.parentElement && !document.getElementById('adminVoucherHeaderBtn')) {
      const btn = document.createElement('button');
      btn.id = 'adminVoucherHeaderBtn';
      btn.onclick = openAdminVoucherGeneratorModal;
      btn.title = 'دروستکردنی کارتی باڵانس (Admin)';
      btn.className = 'px-2.5 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-black hover:bg-emerald-500/30 transition';
      btn.textContent = '🎟️ کارت';
      soundBtn.parentElement.insertBefore(btn, soundBtn);
    }
  }
}

window.openUnifiedCheckoutModal = openUnifiedCheckoutModal;
window.closeUnifiedCheckoutModal = closeUnifiedCheckoutModal;
window.redeemYariKurdiVoucher = redeemYariKurdiVoucher;
window.openAdminVoucherGeneratorModal = openAdminVoucherGeneratorModal;

(function initPaymentEngine() {
  const boot = () => wirePaymentEngineHooks();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(wirePaymentEngineHooks, 1800);
})();