const YK_GIFT_OWNER_EMAIL = 'ah6753038@gmail.com';
const YK_GIFT_OWNER_FALLBACK_UID = 'u_ahmadhassan';

// لێرەدا دەتوانیت وێنەکانی ناو فۆڵدەری gifts/ دابنێیت (بۆ نموونە: 'gifts/lion.png')
// ئەگەر هێشتا وێنەکەت دانەنابێت، خۆکارانە وێنەی ئۆنلاین بەکاردەهێنێت
window.ROYAL_GIFTS_CATALOG = [
  { id: 'teapot', name: 'قۆری چا', icon: '🫖', localImg: 'gifts/teapot.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Iranian_Samovar_and_Teapot.jpg?width=600', cost: 6, xp: 15, cat: 'cheap', anim: 'romance' },
  { id: 'rose', name: 'گوڵ', icon: '🌹', localImg: 'gifts/rose.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Red_rose.jpg?width=600', cost: 10, xp: 25, cat: 'cheap', anim: 'romance' },
  { id: 'lantern', name: 'فانۆس', icon: '🏮', localImg: 'gifts/lantern.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fanous_Ramadan.jpg?width=600', cost: 16, xp: 35, cat: 'cheap', anim: 'romance' },
  { id: 'cat', name: 'پشیلە', icon: '🐱', localImg: 'gifts/cat.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/3D_animation_cat.png?width=600', cost: 30, xp: 55, cat: 'cheap', anim: 'beast' },
  { id: 'flower_garden', name: 'باخچەیەکی پڕ لە گوڵ', icon: '🌺', localImg: 'gifts/garden.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Keukenhof_Garden_(33).JPG?width=640', cost: 80, xp: 140, cat: 'cheap', anim: 'romance' },

  { id: 'wolf', name: 'گورگی دڕندە', icon: '🐺', localImg: 'gifts/wolf.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gray_Wolf_(Canis_lupus)_(119671562).jpg?width=640', cost: 250, xp: 400, cat: 'beasts', anim: 'beast' },
  { id: 'leopard', name: 'پڵنگ', icon: '🐆', localImg: 'gifts/leopard.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/African_leopard,_Panthera_pardus_pardus,_near_Lake_Panic,_Kruger_National_Park,_South_Africa_(19448654130).jpg?width=640', cost: 400, xp: 650, cat: 'beasts', anim: 'beast' },
  { id: 'lion', name: 'شێر', icon: '🦁', localImg: 'gifts/lion.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lion_waiting_in_Namibia.jpg?width=640', cost: 600, xp: 950, cat: 'beasts', anim: 'beast' },
  { id: 'big_bear', name: 'ورچی گەورە', icon: '🐻', localImg: 'gifts/bear.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/2010-kodiak-bear-1.jpg?width=640', cost: 850, xp: 1300, cat: 'beasts', anim: 'beast' },
  { id: 'big_whale', name: 'نەهەنگی گەورە', icon: '🐋', localImg: 'gifts/whale.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Humpback_Whale_underwater_shot.jpg?width=640', cost: 1200, xp: 1850, cat: 'beasts', anim: 'ocean' },
  { id: 'winged_lion', name: 'شێری باڵدار', icon: '🪽', localImg: 'gifts/winged_lion.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Winged_Lion_-_Getty_Museum_(79.AC.140).jpg?width=640', cost: 2200, xp: 3400, cat: 'beasts', anim: 'royal' },
  { id: 'pegasus', name: 'ئەسپی باڵدار', icon: '🦄', localImg: 'gifts/pegasus.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pegasus_bronze_sculpture.jpg?width=640', cost: 2800, xp: 4200, cat: 'beasts', anim: 'royal' },

  { id: 'bmw', name: 'سەیارەی BMW', icon: '🚘', localImg: 'gifts/bmw.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/BMW_M4_(G82)_IMG_5391.jpg?width=640', cost: 1000, xp: 1550, cat: 'cars', anim: 'car' },
  { id: 'land_cruiser', name: 'لاند کرۆزەر', icon: '🚙', localImg: 'gifts/land_cruiser.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/2021_Toyota_Land_Cruiser_300_Sahara.jpg?width=640', cost: 1400, xp: 2100, cat: 'cars', anim: 'car' },
  { id: 'range_rover', name: 'ڕەنج ڕۆڤەر', icon: '🚙', localImg: 'gifts/range_rover.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Range_Rover_2013.jpg?width=640', cost: 1800, xp: 2800, cat: 'cars', anim: 'car' },
  { id: 'mercedes', name: 'مارسیدس', icon: '🚘', localImg: 'gifts/mercedes.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/2019_Mercedes-AMG_G_63.jpg?width=640', cost: 2400, xp: 3600, cat: 'cars', anim: 'car' },
  { id: 'race_car', name: 'سەیارەی پێشبڕکێ', icon: '🏎️', localImg: 'gifts/race_car.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ferrari_SF90_Stradale_IMG_4242.jpg?width=640', cost: 3500, xp: 5200, cat: 'cars', anim: 'car' },
  { id: 'rolls_royce', name: 'ڕۆڵس ڕۆیس', icon: '💎', localImg: 'gifts/rolls_royce.png', img: 'https://commons.wikimedia.org/wiki/Special:FilePath/2020_Rolls-Royce_Ghost_V12_4X4_Automatic_6.75.jpg?width=640', cost: 5000, xp: 7800, cat: 'cars', anim: 'car' }
];

let ykGiftOverlayTimer = null;
let ykGiftParticleLoop = null;

function resolveGiftImageTag(g, className = '', styleStr = '', fallbackHtml = '') {
  const primary = g.localImg || g.img;
  const backup = g.img || '';
  return `<img src="${primary}" alt="${g.name}" class="${className}" style="${styleStr}"
    onerror="if(this.dataset.triedBackup!=='1' && '${backup}'){this.dataset.triedBackup='1';this.src='${backup}';}else{this.style.display='none';${fallbackHtml ? 'if(this.nextElementSibling)this.nextElementSibling.style.display=\'flex\';' : ''}}" />`;
}

// ١. پشاندانی لیستی دیارییەکان لەناو پەنجەرەی دیوەخان
window.renderGiftsCatalogGrid = function () {
  const grid = document.getElementById('ykVip_GiftsGrid');
  if (!grid) return;
  const cat = typeof selectedGiftCat !== 'undefined' ? selectedGiftCat : 'all';
  const curId = typeof selectedGiftId !== 'undefined' ? selectedGiftId : 'teapot';
  const list = cat === 'all' ? window.ROYAL_GIFTS_CATALOG : window.ROYAL_GIFTS_CATALOG.filter(g => g.cat === cat);

  grid.innerHTML = list.map(g => {
    const isSel = g.id === curId;
    return `
      <div onclick="selectGiftItem('${g.id}')"
        class="cursor-pointer rounded-2xl p-1.5 flex flex-col items-center justify-between text-center gap-1 border transition ${isSel ? 'bg-amber-400/25 border-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.55)] scale-[1.02]' : 'bg-white/5 border-white/10 hover:border-amber-400/40'}">
        <div class="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-amber-950 to-slate-900 border border-white/15 flex items-center justify-center">
          ${resolveGiftImageTag(g, 'w-full h-full object-cover', '', true)}
          <div style="display:none;" class="w-full h-full items-center justify-center text-3xl">${g.icon}</div>
        </div>
        <div class="text-[10px] font-black text-white truncate w-full leading-tight">${g.name}</div>
        <div class="text-[10px] font-black text-yellow-300">🪙 ${g.cost.toLocaleString()}</div>
      </div>
    `;
  }).join('');
  if (typeof updateSelectedGiftCostHint === 'function') updateSelectedGiftCostHint();
};

// ٢. ناردنی دیاری + دابەشکردنی ٥٠٪ بۆ ئەدمین و ٥٠٪ بۆ وەرگر
window.sendSelectedRoyalGift = async function () {
  if (typeof currentVoiceRoomId === 'undefined' || !currentVoiceRoomId) return;
  const curId = typeof selectedGiftId !== 'undefined' ? selectedGiftId : 'teapot';
  const gift = window.ROYAL_GIFTS_CATALOG.find(g => g.id === curId) || window.ROYAL_GIFTS_CATALOG[0];
  const qty = (typeof selectedGiftQty !== 'undefined' && selectedGiftQty) || 1;
  const totalCost = gift.cost * qty;

  if (myUserCoins < totalCost) {
    if (confirm(`سکەکانت بەش ناکەن! (پێویستت بە ${totalCost.toLocaleString()} سکەیە).\nدەتەوێت ئێستا سکە بکڕیت؟`)) {
      if (typeof openCoinStoreModal === 'function') openCoinStoreModal();
    }
    return;
  }

  myUserCoins -= totalCost;
  if (typeof updateRoomCoinDisplays === 'function') updateRoomCoinDisplays();
  if (typeof db !== 'undefined' && playerId) db.ref(`players/${playerId}/coins`).set(myUserCoins);

  const ownerHalf = Math.ceil(totalCost / 2);
  const recipientHalf = Math.floor(totalCost / 2);

  let recipientUid = null;
  let targetName = 'هەموو دیوەخان';

  if (selectedGiftRecipient !== 'ALL' && currentRoomMembers[selectedGiftRecipient]) {
    recipientUid = selectedGiftRecipient;
    targetName = currentRoomMembers[selectedGiftRecipient].name;
  } else {
    const hId = currentRoomMeta && currentRoomMeta.hostId;
    if (hId && currentRoomMembers[hId]) {
      recipientUid = hId;
      targetName = currentRoomMembers[hId].name;
    }
  }

  if (typeof db !== 'undefined') {
    const ownerSnap = await db.ref('platformConfig/ownerUid').once('value');
    const resolvedOwnerUid = (ownerSnap.exists() && ownerSnap.val()) ? ownerSnap.val() : YK_GIFT_OWNER_FALLBACK_UID;
    if (resolvedOwnerUid) {
      db.ref(`players/${resolvedOwnerUid}/coins`).transaction(c => (Number(c) || 0) + ownerHalf);
    }
    if (recipientUid) {
      db.ref(`voiceRooms/${currentVoiceRoomId}/members/${recipientUid}/supportCoins`).transaction(c => (c || 0) + totalCost);
      if (recipientHalf > 0) {
        db.ref(`players/${recipientUid}/coins`).transaction(c => (Number(c) || 0) + recipientHalf);
      }
    }
    db.ref(`voiceRooms/${currentVoiceRoomId}/roomXp`).transaction(cur => (cur || 0) + gift.xp * qty);
    db.ref(`voiceRooms/${currentVoiceRoomId}/totalGiftCoins`).transaction(cur => (cur || 0) + totalCost);
  }

  const giftPayload = {
    type: 'gift',
    senderId: playerId,
    senderName: playerName,
    senderAvatar: playerAvatarData || '',
    targetName,
    giftId: gift.id,
    giftName: gift.name,
    giftIcon: gift.icon,
    localImg: gift.localImg || '',
    giftImg: gift.img,
    anim: gift.anim || 'beast',
    qty,
    coins: totalCost,
    recipientShare: recipientHalf,
    ts: Date.now()
  };

  db.ref(`voiceRooms/${currentVoiceRoomId}/chat`).push(giftPayload);
  db.ref(`voiceRooms/${currentVoiceRoomId}/liveGifts`).push(giftPayload);

  if (typeof closeGiftDrawerModal === 'function') closeGiftDrawerModal();
  if (typeof showComboButton === 'function') showComboButton(gift.id, qty);
};

// ٣. تیشکی خێرایی و پارتیکڵی زیندووی پاشبنەما
function startGiftStageParticles(animType) {
  if (ykGiftParticleLoop) cancelAnimationFrame(ykGiftParticleLoop);
  const cvs = document.getElementById('ykVip_GiftFxCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const w = (cvs.width = window.innerWidth);
  const h = (cvs.height = window.innerHeight);

  const items = Array.from({ length: 48 }, () => ({
    x: Math.random() * w,
    y: animType === 'car' ? (h * 0.35 + Math.random() * h * 0.3) : (Math.random() * h),
    vx: animType === 'car' ? -(Math.random() * 14 + 8) : ((Math.random() - 0.5) * 2.5),
    vy: animType === 'car' ? ((Math.random() - 0.5) * 1.5) : (animType === 'beast' ? -(Math.random() * 3.5 + 1.5) : (Math.random() * 2.8 + 1.2)),
    size: Math.random() * 6 + 3,
    rot: Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.12,
    alpha: Math.random() * 0.65 + 0.35
  }));

  function loop() {
    if (!document.body.contains(cvs)) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of items) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      if (animType === 'car') {
        if (p.x < -40) { p.x = w + 30; p.y = h * 0.35 + Math.random() * h * 0.3; }
        ctx.strokeStyle = `rgba(253, 224, 71, ${p.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.size * 7, p.y);
        ctx.stroke();
      } else if (animType === 'romance') {
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(244, 63, 94, ${p.alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.3, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ykGiftParticleLoop = requestAnimationFrame(loop);
  }
  loop();
}

// ٤. ئەنیمەیشنی گەورەی سەر شاشە (بێ چوارچێوە و بێ پاشبنەمای چوارگۆشە)
window.triggerFullScreenGiftAnimation = function (g) {
  const catalogMatch = window.ROYAL_GIFTS_CATALOG.find(item => item.id === g.giftId) || {};
  const giftObj = {
    name: g.giftName || catalogMatch.name || 'دیاری',
    localImg: g.localImg || catalogMatch.localImg || '',
    img: g.giftImg || catalogMatch.img || ''
  };
  const animType = g.anim || catalogMatch.anim || 'beast';

  const bannerBox = document.getElementById('ykVip_FloatingGiftBanner');
  if (bannerBox) {
    bannerBox.innerHTML = `
      <div style="animation: ykGiftSlideIn 0.35s ease-out;"
        class="inline-flex items-center gap-2 pl-3.5 pr-1 py-1 rounded-full bg-gradient-to-l from-amber-500 via-orange-500 to-rose-600 border-2 border-yellow-200 shadow-[0_6px_22px_rgba(245,158,11,0.8)]">
        <div class="w-7 h-7 rounded-full bg-black/40 overflow-hidden flex items-center justify-center text-xs font-black text-white border border-white">
          ${g.senderAvatar ? `<img src="${g.senderAvatar}" class="w-full h-full object-cover"/>` : (g.senderName || 'ی')[0]}
        </div>
        <div class="text-right leading-tight">
          <div class="text-[10px] font-black text-white">${g.senderName}</div>
          <div class="text-[9px] font-bold text-yellow-100">بۆ @${g.targetName}</div>
        </div>
        ${resolveGiftImageTag(giftObj, 'w-9 h-9 rounded-full object-cover border-2 border-yellow-200 shadow')}
        <span class="text-base font-black text-yellow-200 italic">x${g.qty}</span>
      </div>
    `;
  }

  if (typeof sendFloatingHeart === 'function') {
    const icons = animType === 'car' ? ['✨', '⚡', '🔥'] : animType === 'romance' ? ['🌹', '❤️', '✨'] : ['👑', '🔥', '✨'];
    for (let i = 0; i < 12; i++) setTimeout(() => sendFloatingHeart(icons[i % icons.length]), i * 110);
  }

  const overlay = document.getElementById('ykVip_FullGiftOverlay');
  if (!overlay || (!giftObj.localImg && !giftObj.img)) return;

  const animMap = {
    car: 'ykCarDriftStage 4.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
    beast: 'ykBeastSwoopStage 4.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
    ocean: 'ykBeastSwoopStage 4.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
    romance: 'ykRomanceBloomStage 4.0s ease-out forwards',
    royal: 'ykRoyalDescentStage 4.3s cubic-bezier(0.22, 1, 0.36, 1) forwards'
  };
  const chosenAnim = animMap[animType] || animMap.beast;
  const imgFilter = (animType === 'beast' || animType === 'royal' || animType === 'ocean')
    ? 'drop-shadow(0 0 28px rgba(168,85,247,0.95)) drop-shadow(0 0 18px rgba(250,204,21,0.9)) contrast(1.24) saturate(1.55) brightness(1.06)'
    : 'drop-shadow(0 18px 28px rgba(0,0,0,0.9)) drop-shadow(0 0 22px rgba(250,204,21,0.75)) contrast(1.12) saturate(1.22)';

  if (ykGiftOverlayTimer) clearTimeout(ykGiftOverlayTimer);

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  overlay.innerHTML = `
    <canvas id="ykVip_GiftFxCanvas" style="position:fixed; inset:0; width:100vw; height:100dvh; pointer-events:none; z-index:1;"></canvas>
    <div style="animation: ${chosenAnim};" class="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-md pointer-events-none">
      <div style="position:absolute; width:340px; height:220px; border-radius:9999px; background:radial-gradient(circle, rgba(250,204,21,0.5) 0%, rgba(245,158,11,0.16) 55%, transparent 75%); filter:blur(28px);"></div>

      <div class="relative z-10 w-[86vw] max-w-[360px] h-56 sm:h-64 flex items-center justify-center">
        ${resolveGiftImageTag(giftObj, 'w-full h-full object-contain', `animation: ykKenBurnsLive 4.1s ease-in-out forwards; -webkit-mask-image: radial-gradient(ellipse 48% 46% at 50% 50%, #000 62%, rgba(0,0,0,0.5) 82%, transparent 100%); mask-image: radial-gradient(ellipse 48% 46% at 50% 50%, #000 62%, rgba(0,0,0,0.5) 82%, transparent 100%); filter: ${imgFilter};`)}
      </div>

      <div class="relative z-10 -mt-4 px-5 py-1.5 rounded-full bg-gradient-to-r from-transparent via-black/80 to-transparent border-y border-yellow-300/60">
        <span class="text-sm sm:text-base font-black gold-text drop-shadow">${g.giftName} x${g.qty}</span>
        <span class="text-[11px] font-bold text-amber-100 mr-2">(${g.senderName} ➔ @${g.targetName})</span>
      </div>
    </div>
  `;

  startGiftStageParticles(animType);
  if (typeof playChessSound === 'function') playChessSound('end');

  ykGiftOverlayTimer = setTimeout(() => {
    if (ykGiftParticleLoop) { cancelAnimationFrame(ykGiftParticleLoop); ykGiftParticleLoop = null; }
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    overlay.innerHTML = '';
  }, 4300);
};