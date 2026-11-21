/* ============================================================================
   YariKurdi — Royal Profile Engine, VIP Owner Identity & Social Hub (v4.0)
   60 FPS Canvas Embers • Sherwana Castle VIP Cover • Multi-Game Stats
   Profile Likes • Bio Editor • Friend Requests • Player Search • Room Sync
   ============================================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     ١. ڕێکخستنە سەرەکییەکان و ناسنامەی خاوەنی پلاتفۆرم
     -------------------------------------------------------------------------- */
  const OWNER_EMAIL = 'ah6753038@gmail.com';
  const OWNER_FALLBACK_UIDS = ['u_ahmadhassan'];
  const OWNER_USERNAME_KEYWORD = 'ah6753038';

  // کاتێک دواتر وێنەی تایبەتی خۆت بۆ کەڤەر یان چوارچێوە زیاد کرد، تەنها لێرە ناوەکەی دابنێ:
  const VIP_CUSTOM_ASSETS = {
    sherwanaCoverUrl: '', // نموونە: 'sherwana-cover.jpg'
    vipFrameUrl: ''       // نموونە: 'vip-frame.png'
  };

  // کەتەلۆگی کەڤەر و چوارچێوەکان (ئامادە بۆ بەستنەوە بە بازاڕی سکە)
  const PROFILE_COVERS_CATALOG = [
    {
      id: 'default',
      name: 'شەوی مۆری شاهانە',
      desc: 'کەڤەری بنەڕەتیی هەموو یاریزانان',
      price: 0,
      rarity: 'ئاسایی',
      ownerOnlyDefault: false
    },
    {
      id: 'sherwana',
      name: 'قەڵای شێروانە • کەلار',
      desc: 'کەڤەری ئەفسانەیی قەڵای شێروانە لەگەڵ فەرشی کوردی و ئاڵای کوردستان',
      price: 3999,
      rarity: 'ئەفسانەیی 👑',
      ownerOnlyDefault: true
    },
    {
      id: 'diwexan_red',
      name: 'دیوەخانی فەرشی سوور',
      desc: 'پاشبنەمای دیوەخانی شاهانەی کوردی',
      price: 1999,
      rarity: 'نایاب ✨',
      ownerOnlyDefault: false
    },
    {
      id: 'zagros_night',
      name: 'ئاسمانی چیاکانی زاگرۆس',
      desc: 'شەوی ئەستێرەبارانی کوردستان بە تیشکی زێڕین',
      price: 2499,
      rarity: 'VIP 💎',
      ownerOnlyDefault: false
    }
  ];

  const PROFILE_FRAMES_CATALOG = [
    {
      id: 'default',
      name: 'ئەڵقەی زێڕینی سادە',
      price: 0,
      rarity: 'ئاسایی'
    },
    {
      id: 'vip_eagle',
      name: 'باڵی هەڵۆی زێڕینی VIP',
      price: 4999,
      rarity: 'ئەفسانەیی 👑'
    },
    {
      id: 'nowruz_fire',
      name: 'ئاگری نەورۆز',
      price: 2200,
      rarity: 'نایاب 🔥'
    },
    {
      id: 'emerald_royal',
      name: 'زمڕووتی بادینان',
      price: 1800,
      rarity: 'تایبەت 💎'
    }
  ];

  const LEAGUES = [
    { name: 'سەرەتایی', minElo: 0, icon: '🥉', color: '#cbd5e1' },
    { name: 'جەنگاوەر', minElo: 1250, icon: '⚔️', color: '#38bdf8' },
    { name: 'سوارچاک', minElo: 1400, icon: '🛡️', color: '#34d399' },
    { name: 'میری دیوەخان', minElo: 1600, icon: '👑', color: '#facc15' },
    { name: 'پاشای کوردی', minElo: 1850, icon: '🦅', color: '#f97316' },
    { name: 'ئەفسانەیی VIP', minElo: 2100, icon: '💎', color: '#e879f9' }
  ];

  /* --------------------------------------------------------------------------
     ٢. دۆخ و گۆڕاوە ناوخۆییەکان (State)
     -------------------------------------------------------------------------- */
  let currentProfileUid = null;
  let currentProfileTab = 'stats';
  let currentSocialTab = 'requests';
  let incomingRequests = {};
  let myFriends = {};
  let cachedOwnerUid = OWNER_FALLBACK_UIDS[0];
  let initialRequestsLoaded = false;
  let originalSelectGiftFn = null;
  let originalOpenProfileFn = null;
  let allowLegacyEditModal = false;
  let embersAnimId = null;
  let likesUnsubscribeRef = null;
  let activeProfileCache = null;

  /* --------------------------------------------------------------------------
     ٣. یاریدەدەرە بنەڕەتییەکان (Database, Auth, Security, Audio)
     -------------------------------------------------------------------------- */
  function getRTDB() {
    if (typeof db !== 'undefined' && db && typeof db.ref === 'function') return db;
    if (window.db && typeof window.db.ref === 'function') return window.db;
    if (window.firebase && typeof firebase.database === 'function') return firebase.database();
    return null;
  }

  function getAuthUser() {
    try {
      if (typeof auth !== 'undefined' && auth && auth.currentUser) return auth.currentUser;
      if (window.firebase && typeof firebase.auth === 'function' && firebase.auth().currentUser) {
        return firebase.auth().currentUser;
      }
    } catch (e) {}
    return null;
  }

  function getMe() {
    const authUser = getAuthUser();
    if (typeof playerId !== 'undefined' && playerId) {
      return {
        uid: String(playerId),
        name: (typeof playerName !== 'undefined' && playerName) ? String(playerName) : (authUser && authUser.displayName) || 'یاریزان',
        photo: (typeof playerAvatarData !== 'undefined' && playerAvatarData) ? String(playerAvatarData) : (authUser && authUser.photoURL) || '',
        email: (authUser && authUser.email) || ''
      };
    }
    if (authUser && authUser.uid) {
      return {
        uid: String(authUser.uid),
        name: authUser.displayName || 'یاریزان',
        photo: authUser.photoURL || '',
        email: authUser.email || ''
      };
    }
    return null;
  }

  function escHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function isPlatformOwner(uid, email, username) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanUid = String(uid || '').trim().toLowerCase();
    const cleanUser = String(username || '').trim().toLowerCase();

    if (cleanEmail === OWNER_EMAIL) return true;
    if (cleanUid && OWNER_FALLBACK_UIDS.includes(cleanUid)) return true;
    if (cleanUid && cachedOwnerUid && cleanUid === String(cachedOwnerUid).toLowerCase()) return true;
    if (cleanUid.includes(OWNER_USERNAME_KEYWORD) || cleanUser.includes(OWNER_USERNAME_KEYWORD)) return true;

    // ئەگەر پڕۆفایلەکە هی بەکارهێنەری ئێستا بێت و بە ئیمەیڵی خاوەن چووبێتە ژوورەوە
    const me = getMe();
    if (me && cleanUid === String(me.uid).toLowerCase() && String(me.email || '').trim().toLowerCase() === OWNER_EMAIL) {
      return true;
    }
    return false;
  }

  function defaultAvatar(name) {
    const letter = (String(name || 'ی').trim() || 'ی').charAt(0);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(letter)}&background=f59e0b&color=19092b&bold=true&size=180`;
  }

  function getLeagueByElo(elo) {
    const val = Number(elo) || 1200;
    let matched = LEAGUES[0];
    for (let i = 0; i < LEAGUES.length; i++) {
      if (val >= LEAGUES[i].minElo) matched = LEAGUES[i];
    }
    return matched;
  }

  function playRoyalChime(kind) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (kind === 'like') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.09);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     ٤. گرافیکە شاهانەکان (قەڵای شێروانە، چوارچێوەی VIP، ئاڵای کوردستان)
     -------------------------------------------------------------------------- */
  function getKurdishFlagSVG(w, h) {
    const width = w || 26;
    const height = h || 17;
    return `
      <svg viewBox="0 0 36 24" style="width:${width}px;height:${height}px;border-radius:3px;box-shadow:0 2px 8px rgba(0,0,0,0.55);flex-shrink:0;display:inline-block;vertical-align:middle;">
        <rect width="36" height="8" y="0" fill="#ef4444"/>
        <rect width="36" height="8" y="8" fill="#ffffff"/>
        <rect width="36" height="8" y="16" fill="#16a34a"/>
        <g transform="translate(18,12)" fill="#facc15">
          <circle r="3.6"/>
          <polygon points="0,-6.2 0.9,-3.4 -0.9,-3.4"/>
          <polygon points="0,6.2 0.9,3.4 -0.9,3.4"/>
          <polygon points="6.2,0 3.4,0.9 3.4,-0.9"/>
          <polygon points="-6.2,0 -3.4,0.9 -3.4,-0.9"/>
          <polygon points="4.4,-4.4 2.8,-1.8 1.8,-2.8"/>
          <polygon points="-4.4,4.4 -2.8,1.8 -1.8,2.8"/>
          <polygon points="4.4,4.4 1.8,2.8 2.8,1.8"/>
          <polygon points="-4.4,-4.4 -1.8,-2.8 -2.8,-1.8"/>
        </g>
      </svg>
    `;
  }

  function getSherwanaCoverHTML() {
    if (VIP_CUSTOM_ASSETS.sherwanaCoverUrl) {
      return `
        <div class="yk-kilim-border yk-kilim-right"></div>
        <div class="yk-kilim-border yk-kilim-left"></div>
        <img src="${escHtml(VIP_CUSTOM_ASSETS.sherwanaCoverUrl)}" style="width:100%;height:100%;object-fit:cover;display:block;" />
        <div class="yk-cover-fade"></div>
      `;
    }
    return `
      <div class="yk-kilim-border yk-kilim-right"></div>
      <div class="yk-kilim-border yk-kilim-left"></div>
      <svg viewBox="0 0 640 280" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block;">
        <defs>
          <linearGradient id="ykSherSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#f59e0b"/>
            <stop offset="38%" stop-color="#fcd34d"/>
            <stop offset="76%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
          <radialGradient id="ykSherSun" cx="22%" cy="32%" r="36%">
            <stop offset="0%" stop-color="#fffbeb" stop-opacity="0.98"/>
            <stop offset="45%" stop-color="#fde047" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="ykSherMound" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="55%" stop-color="#78350f"/>
            <stop offset="100%" stop-color="#2a0f05"/>
          </linearGradient>
          <linearGradient id="ykSherWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fde68a"/>
            <stop offset="45%" stop-color="#d97706"/>
            <stop offset="100%" stop-color="#92400e"/>
          </linearGradient>
          <linearGradient id="ykSherWallShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#b45309"/>
            <stop offset="50%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
        </defs>

        <!-- ئاسمانی ئاوابوونی خۆر و تیشک -->
        <rect width="640" height="280" fill="url(#ykSherSky)"/>
        <rect width="640" height="280" fill="url(#ykSherSun)"/>
        <circle cx="140" cy="88" r="36" fill="#fffbeb" opacity="0.9"/>

        <!-- باڵندەکان لە ئاسماندا -->
        <g stroke="#78350f" stroke-width="1.6" fill="none" opacity="0.7">
          <path d="M210 56 Q216 50 222 56 Q228 50 234 56"/>
          <path d="M242 44 Q246 40 250 44 Q254 40 258 44"/>
          <path d="M445 52 Q451 46 457 52 Q463 46 469 52"/>
          <path d="M475 68 Q480 63 485 68 Q490 63 495 68"/>
        </g>

        <!-- چیاکانی پشتەوەی گەرمیان -->
        <path d="M0 198 L95 128 L195 178 L315 112 L450 174 L560 116 L640 164 L640 280 L0 280 Z" fill="#9a3412" opacity="0.42"/>
        <path d="M0 215 L120 158 L240 202 L385 152 L530 198 L640 162 L640 280 L0 280 Z" fill="#7c2d12" opacity="0.55"/>

        <!-- تەپۆڵکەی بەرزی قەڵای شێروانە -->
        <path d="M72 280 L166 154 L474 154 L568 280 Z" fill="url(#ykSherMound)"/>
        <path d="M166 154 L132 280 L215 280 L225 154 Z" fill="#451a03" opacity="0.28"/>
        <path d="M474 154 L508 280 L425 280 L415 154 Z" fill="#451a03" opacity="0.34"/>

        <!-- بناغەی بەردینی قەڵا -->
        <rect x="176" y="148" width="288" height="12" rx="2" fill="#78350f"/>

        <!-- دیواری سەرەکیی دوو نهۆمیی قەڵای شێروانە -->
        <rect x="196" y="74" width="248" height="76" rx="2" fill="url(#ykSherWall)" stroke="#78350f" stroke-width="2"/>
        <!-- خەتی جیاکەرەوەی نهۆمی یەکەم و دووەم -->
        <rect x="194" y="110" width="252" height="5" fill="#92400e"/>

        <!-- ددانە شەڕکەرەکانی سەربانی قەڵا (Crenellations) -->
        <g fill="#f59e0b" stroke="#78350f" stroke-width="1.2">
          <rect x="200" y="66" width="12" height="9" rx="2"/>
          <rect x="218" y="66" width="12" height="9" rx="2"/>
          <rect x="236" y="66" width="12" height="9" rx="2"/>
          <rect x="254" y="66" width="12" height="9" rx="2"/>
          <rect x="374" y="66" width="12" height="9" rx="2"/>
          <rect x="392" y="66" width="12" height="9" rx="2"/>
          <rect x="410" y="66" width="12" height="9" rx="2"/>
          <rect x="428" y="66" width="12" height="9" rx="2"/>
        </g>

        <!-- قوللە خڕەکانی گۆشەی چەپ و ڕاست -->
        <rect x="174" y="60" width="32" height="92" rx="8" fill="url(#ykSherWallShade)" stroke="#78350f" stroke-width="2"/>
        <rect x="434" y="60" width="32" height="92" rx="8" fill="url(#ykSherWallShade)" stroke="#78350f" stroke-width="2"/>
        <rect x="172" y="54" width="36" height="8" rx="3" fill="#fde68a" stroke="#78350f" stroke-width="1.5"/>
        <rect x="432" y="54" width="36" height="8" rx="3" fill="#fde68a" stroke="#78350f" stroke-width="1.5"/>

        <!-- کۆشکی هەشتگۆشەیی سەربان (تایبەتمەندیی سەرەکیی قەڵای شێروانە) -->
        <rect x="276" y="42" width="88" height="34" rx="2" fill="url(#ykSherWall)" stroke="#78350f" stroke-width="2"/>
        <polygon points="266,44 320,18 374,44" fill="#92400e" stroke="#451a03" stroke-width="2"/>
        <polygon points="274,44 320,24 366,44" fill="#b45309"/>
        <circle cx="320" cy="17" r="3.5" fill="#fde047"/>

        <!-- پەنجەرە کەوانەییەکان -->
        <g fill="#451a03">
          <!-- سەربان -->
          <rect x="288" y="51" width="11" height="19" rx="5.5"/>
          <rect x="306" y="51" width="11" height="19" rx="5.5"/>
          <rect x="324" y="51" width="11" height="19" rx="5.5"/>
          <rect x="342" y="51" width="11" height="19" rx="5.5"/>
          <!-- نهۆمی دووەم -->
          <rect x="214" y="82" width="13" height="22" rx="6.5"/>
          <rect x="238" y="82" width="13" height="22" rx="6.5"/>
          <rect x="262" y="82" width="13" height="22" rx="6.5"/>
          <rect x="288" y="82" width="13" height="22" rx="6.5"/>
          <rect x="339" y="82" width="13" height="22" rx="6.5"/>
          <rect x="365" y="82" width="13" height="22" rx="6.5"/>
          <rect x="389" y="82" width="13" height="22" rx="6.5"/>
          <rect x="413" y="82" width="13" height="22" rx="6.5"/>
          <!-- نهۆمی یەکەم -->
          <rect x="214" y="121" width="13" height="22" rx="6.5"/>
          <rect x="238" y="121" width="13" height="22" rx="6.5"/>
          <rect x="262" y="121" width="13" height="22" rx="6.5"/>
          <rect x="365" y="121" width="13" height="22" rx="6.5"/>
          <rect x="389" y="121" width="13" height="22" rx="6.5"/>
          <rect x="413" y="121" width="13" height="22" rx="6.5"/>
          <!-- دەروازەی گەورەی ناوەڕاست -->
          <rect x="303" y="116" width="34" height="34" rx="17"/>
          <!-- پەنجەرەی قوللەکان -->
          <rect x="186" y="76" width="8" height="14" rx="4"/>
          <rect x="186" y="114" width="8" height="14" rx="4"/>
          <rect x="446" y="76" width="8" height="14" rx="4"/>
          <rect x="446" y="114" width="8" height="14" rx="4"/>
        </g>

        <!-- دوو پەرچەمی کوردستان لە سەرەوە -->
        <g transform="translate(182, 0)">
          <path d="M0,0 L24,0 L24,34 L12,42 L0,34 Z" fill="#fff" stroke="#fde047" stroke-width="1.5"/>
          <rect x="1" y="1" width="7.5" height="32" fill="#ef4444"/>
          <rect x="15.5" y="1" width="7.5" height="32" fill="#16a34a"/>
          <circle cx="12" cy="18" r="3.5" fill="#facc15"/>
        </g>
        <g transform="translate(434, 0)">
          <path d="M0,0 L24,0 L24,34 L12,42 L0,34 Z" fill="#fff" stroke="#fde047" stroke-width="1.5"/>
          <rect x="1" y="1" width="7.5" height="32" fill="#ef4444"/>
          <rect x="15.5" y="1" width="7.5" height="32" fill="#16a34a"/>
          <circle cx="12" cy="18" r="3.5" fill="#facc15"/>
        </g>
      </svg>
      <div class="yk-cover-fade"></div>
    `;
  }

  function getCoverHTMLById(coverId, isOwner) {
    if (coverId === 'sherwana' || (isOwner && (!coverId || coverId === 'default'))) {
      return getSherwanaCoverHTML();
    }
    if (coverId === 'diwexan_red') {
      return `
        <div style="width:100%;height:100%;background:linear-gradient(180deg, rgba(127,29,29,0.75) 0%, rgba(45,10,20,0.92) 100%), url('diwexan-bg.jpg') center/cover no-repeat;position:relative;">
          <div class="yk-cover-fade"></div>
        </div>
      `;
    }
    if (coverId === 'zagros_night') {
      return `
        <div style="width:100%;height:100%;background:radial-gradient(circle at 50% 20%, #1e3a8a 0%, #1e1b4b 55%, #160726 100%);position:relative;overflow:hidden;">
          <div style="position:absolute;inset:0;opacity:0.35;background-image:radial-gradient(#fde047 1.4px, transparent 1.4px);background-size:26px 26px;"></div>
          <div class="yk-cover-fade"></div>
        </div>
      `;
    }
    // کەڤەری ئاسایی و سادە بۆ یاریزانە ئاساییەکان
    return `
      <div style="width:100%;height:100%;background:radial-gradient(circle at 50% 20%, #4c1d95 0%, #2b0f54 58%, #160726 100%);position:relative;overflow:hidden;">
        <div style="position:absolute;inset:0;opacity:0.16;background-image:radial-gradient(#facc15 1.2px, transparent 1.2px);background-size:24px 24px;"></div>
        <div class="yk-cover-fade"></div>
      </div>
    `;
  }

  function getFrameOverlayHTML(frameId, isOwner) {
    const activeFrame = (isOwner && (!frameId || frameId === 'default')) ? 'vip_eagle' : (frameId || 'default');

    if (activeFrame === 'vip_eagle') {
      if (VIP_CUSTOM_ASSETS.vipFrameUrl) {
        return `<img src="${escHtml(VIP_CUSTOM_ASSETS.vipFrameUrl)}" style="position:absolute;inset:-24px;width:calc(100% + 48px);height:calc(100% + 48px);pointer-events:none;z-index:6;" />`;
      }
      return `
        <div class="yk-vip-aura-spin"></div>
        <svg viewBox="0 0 260 230" class="yk-vip-wings-svg">
          <defs>
            <linearGradient id="ykGoldMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#fef9c3"/>
              <stop offset="30%" stop-color="#fde047"/>
              <stop offset="68%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#92400e"/>
            </linearGradient>
            <linearGradient id="ykGoldBright" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#b45309"/>
              <stop offset="50%" stop-color="#fde047"/>
              <stop offset="100%" stop-color="#fffbeb"/>
            </linearGradient>
          </defs>
          <!-- باڵە گەورەکانی چەپ -->
          <path d="M72 126 C26 120, 6 84, 14 54 C30 76, 52 84, 76 86 C42 96, 36 108, 72 114 Z" fill="url(#ykGoldMetal)" stroke="#78350f" stroke-width="1.8"/>
          <path d="M74 142 C32 142, 16 118, 24 94 C38 110, 56 116, 78 118 Z" fill="url(#ykGoldBright)" stroke="#78350f" stroke-width="1.6"/>
          <path d="M84 156 C50 162, 34 146, 40 128 C54 138, 68 142, 86 144 Z" fill="url(#ykGoldMetal)" stroke="#78350f" stroke-width="1.4"/>
          <!-- باڵە گەورەکانی ڕاست -->
          <path d="M188 126 C234 120, 254 84, 246 54 C230 76, 208 84, 184 86 C218 96, 224 108, 188 114 Z" fill="url(#ykGoldMetal)" stroke="#78350f" stroke-width="1.8"/>
          <path d="M186 142 C228 142, 244 118, 236 94 C222 110, 204 116, 182 118 Z" fill="url(#ykGoldBright)" stroke="#78350f" stroke-width="1.6"/>
          <path d="M176 156 C210 162, 226 146, 220 128 C206 138, 192 142, 174 144 Z" fill="url(#ykGoldMetal)" stroke="#78350f" stroke-width="1.4"/>
          <!-- گەڵای زەیتوون لە خوارەوەی بازنەکە -->
          <path d="M76 164 Q102 192 130 190 Q158 192 184 164" fill="none" stroke="url(#ykGoldBright)" stroke-width="5" stroke-linecap="round"/>
          <!-- تاجی شاهانەی سەرەوە -->
          <polygon points="94,48 102,22 118,38 130,14 142,38 158,22 166,48" fill="url(#ykGoldBright)" stroke="#78350f" stroke-width="2"/>
          <circle cx="130" cy="14" r="4" fill="#fffbeb"/>
          <circle cx="102" cy="22" r="3" fill="#fffbeb"/>
          <circle cx="158" cy="22" r="3" fill="#fffbeb"/>
          <!-- پلاکی VIP -->
          <rect x="98" y="42" width="64" height="18" rx="9" fill="#240b42" stroke="#fde047" stroke-width="2"/>
          <text x="130" y="55" text-anchor="middle" fill="#fef08a" font-size="11.5" font-weight="900" font-family="sans-serif" letter-spacing="1">VIP</text>
          <!-- گەوهەری خوارەوە -->
          <polygon points="130,174 145,190 130,206 115,190" fill="url(#ykGoldBright)" stroke="#78350f" stroke-width="2"/>
          <polygon points="130,180 138,190 130,200 122,190" fill="#fffbeb" opacity="0.8"/>
        </svg>
      `;
    }

    if (activeFrame === 'nowruz_fire') {
      return `<div class="yk-frame-ring-fire"></div>`;
    }

    if (activeFrame === 'emerald_royal') {
      return `<div class="yk-frame-ring-emerald"></div>`;
    }

    return '';
  }

  /* --------------------------------------------------------------------------
     ٥. ستایلەکان و بنیاتنانی ڕووکاری پڕۆفایل و سندوقی هاوڕێیان
     -------------------------------------------------------------------------- */
  function injectRoyalStylesAndDOM() {
    if (document.getElementById('yk-royal-profile-styles')) return;

    const style = document.createElement('style');
    style.id = 'yk-royal-profile-styles';
    style.textContent = `
      @keyframes ykRotSlow {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      @keyframes ykShimmerText {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes ykHeartPop {
        0% { transform: translateY(0) scale(0.6); opacity: 1; }
        50% { transform: translateY(-48px) scale(1.25); opacity: 0.95; }
        100% { transform: translateY(-96px) scale(0.9); opacity: 0; }
      }
      @keyframes ykModalReveal {
        0% { opacity: 0; transform: scale(0.92) translateY(18px); }
        100% { opacity: 1; transform: scale(1) translateY(0); }
      }

      /* دوگمەی سندوقی هاوڕێیان */
      .yk-social-fab {
        position: fixed;
        top: 76px;
        left: 14px;
        z-index: 9975;
        width: 44px;
        height: 44px;
        border-radius: 15px;
        background: linear-gradient(145deg, #3b1169 0%, #19092b 100%);
        border: 1.5px solid rgba(250, 204, 21, 0.7);
        color: #fde047;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.16);
        transition: transform 0.15s ease;
      }
      .yk-social-fab:active { transform: scale(0.91); }
      .yk-fab-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        min-width: 21px;
        height: 21px;
        padding: 0 5px;
        border-radius: 999px;
        background: linear-gradient(135deg, #f43f5e, #dc2626);
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        display: none;
        align-items: center;
        justify-content: center;
        border: 2px solid #19092b;
        box-shadow: 0 3px 10px rgba(239, 68, 68, 0.6);
      }

      /* نۆتیفیکەیشنی ڕاستەوخۆ */
      .yk-royal-toast {
        position: fixed;
        top: -120px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10075;
        background: linear-gradient(135deg, #2e1065 0%, #140624 100%);
        border: 1.5px solid #facc15;
        color: #fff;
        padding: 10px 14px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.85), 0 0 22px rgba(250, 204, 21, 0.25);
        transition: top 0.36s cubic-bezier(0.22, 1, 0.36, 1);
        max-width: 92vw;
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      }
      .yk-royal-toast.show { top: 16px; }

      /* پەردەی پشتەوەی مۆداڵەکان */
      .yk-prof-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(8, 3, 18, 0.88);
        backdrop-filter: blur(11px);
        -webkit-backdrop-filter: blur(11px);
        z-index: 10050;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 8px;
        direction: rtl;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      }
      .yk-prof-backdrop.open { display: flex; }

      /* قاڵبی سەرەکیی پڕۆفایل */
      .yk-prof-shell {
        position: relative;
        width: 100%;
        max-width: 430px;
        max-height: 95dvh;
        overflow-y: auto;
        overflow-x: hidden;
        background: radial-gradient(circle at 50% 16%, #3a1466 0%, #1c0832 58%, #10041e 100%);
        border: 1.5px solid rgba(250, 204, 21, 0.62);
        border-radius: 30px;
        color: #fff;
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.92), 0 0 36px rgba(168, 85, 247, 0.28);
        animation: ykModalReveal 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        scrollbar-width: none;
      }
      .yk-prof-shell::-webkit-scrollbar { display: none; }

      #yk-prof-embers {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 4;
      }

      /* شریتی سەرەوەی پڕۆفایل */
      .yk-prof-header {
        position: absolute;
        top: 12px;
        inset-inline: 14px;
        z-index: 25;
        display: flex;
        align-items: center;
        justify-content: space-between;
        pointer-events: none;
      }
      .yk-prof-header-title {
        font-size: 20px;
        font-weight: 900;
        color: #fde047;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
        letter-spacing: 0.4px;
      }
      .yk-circle-icon-btn {
        pointer-events: auto;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(22, 7, 38, 0.82);
        border: 1.5px solid rgba(250, 204, 21, 0.58);
        color: #fde047;
        font-size: 16px;
        font-weight: 900;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.55);
        transition: transform 0.14s ease;
      }
      .yk-circle-icon-btn:active { transform: scale(0.9); }

      /* بەشی کەڤەر */
      .yk-cover-stage {
        position: relative;
        width: 100%;
        height: 196px;
        overflow: hidden;
        border-bottom: 1.5px solid rgba(250, 204, 21, 0.45);
        z-index: 2;
      }
      .yk-cover-fade {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: 55%;
        background: linear-gradient(to bottom, rgba(22, 7, 38, 0) 0%, rgba(22, 7, 38, 0.96) 100%);
        pointer-events: none;
        z-index: 3;
      }
      .yk-kilim-border {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 17px;
        z-index: 6;
        background: repeating-linear-gradient(
          45deg,
          #991b1b 0px,
          #991b1b 6px,
          #facc15 6px,
          #facc15 9px,
          #14532d 9px,
          #14532d 15px,
          #2e1065 15px,
          #2e1065 18px
        );
        border-inline: 1.5px solid #fde047;
        box-shadow: 0 0 12px rgba(0, 0, 0, 0.65);
      }
      .yk-kilim-right { right: 0; }
      .yk-kilim-left { left: 0; }

      /* وێنەی پڕۆفایل و چوارچێوەکان */
      .yk-avatar-hero {
        position: relative;
        width: 104px;
        height: 104px;
        margin: -60px auto 10px;
        z-index: 18;
      }
      .yk-avatar-inner {
        position: relative;
        width: 104px;
        height: 104px;
        border-radius: 50%;
        padding: 3.5px;
        background: linear-gradient(135deg, #fef08a 0%, #f59e0b 55%, #b45309 100%);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.8), 0 0 22px rgba(250, 204, 21, 0.35);
        z-index: 4;
      }
      .yk-avatar-inner img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        background: #160726;
        display: block;
      }
      .yk-vip-aura-spin {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 126px;
        height: 126px;
        border-radius: 50%;
        background: conic-gradient(from 0deg, transparent, #fde047, #f97316, transparent, #fde047, transparent);
        animation: ykRotSlow 5s linear infinite;
        filter: blur(4px);
        opacity: 0.75;
        z-index: 1;
        pointer-events: none;
      }
      .yk-vip-wings-svg {
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        width: 204px;
        height: 180px;
        pointer-events: none;
        z-index: 8;
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.82));
      }
      .yk-frame-ring-fire {
        position: absolute;
        inset: -7px;
        border-radius: 50%;
        border: 4px solid #f97316;
        box-shadow: 0 0 20px #ef4444, inset 0 0 12px #fde047;
        z-index: 6;
        pointer-events: none;
      }
      .yk-frame-ring-emerald {
        position: absolute;
        inset: -7px;
        border-radius: 50%;
        border: 4px solid #10b981;
        box-shadow: 0 0 20px #34d399, inset 0 0 12px #a7f3d0;
        z-index: 6;
        pointer-events: none;
      }

      /* دوگمە لایەکییەکانی سەر پڕۆفایل (وەک لایک و کۆگا) */
      .yk-side-action-row {
        position: relative;
        z-index: 16;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 18px;
        margin-top: -54px;
        margin-bottom: 14px;
        pointer-events: none;
      }
      .yk-side-pill {
        pointer-events: auto;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 6px 11px;
        border-radius: 999px;
        background: rgba(34, 12, 58, 0.88);
        border: 1.5px solid rgba(250, 204, 21, 0.48);
        color: #fde047;
        font-size: 11.5px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.55);
        transition: transform 0.14s ease;
      }
      .yk-side-pill:active { transform: scale(0.92); }
      .yk-side-pill.liked {
        background: linear-gradient(135deg, rgba(244, 63, 94, 0.35), rgba(159, 18, 57, 0.65));
        border-color: #fb7185;
        color: #ffe4e6;
      }

      /* ناوی یاریزان و نیشانەی خاوەن */
      .yk-name-gold {
        background: linear-gradient(90deg, #fef08a, #f59e0b, #fffbeb, #facc15);
        background-size: 220% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: ykShimmerText 4s linear infinite;
      }
      .yk-owner-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 14px;
        border-radius: 10px;
        background: linear-gradient(90deg, #fef08a 0%, #f59e0b 100%);
        color: #19092b;
        font-size: 12px;
        font-weight: 900;
        box-shadow: 0 4px 18px rgba(250, 204, 21, 0.48);
      }
      .yk-bio-box {
        margin: 8px 18px 4px;
        padding: 6px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px dashed rgba(250, 204, 21, 0.25);
        font-size: 11.5px;
        color: #e9d5ff;
        line-height: 1.55;
        text-align: center;
      }

      /* پانێڵە شووشەییە مۆرەکان */
      .yk-card-panel {
        position: relative;
        z-index: 10;
        background: rgba(34, 12, 58, 0.76);
        border: 1px solid rgba(250, 204, 21, 0.38);
        border-radius: 18px;
        padding: 12px 14px;
        margin: 10px 14px;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 8px 20px rgba(0, 0, 0, 0.35);
      }
      .yk-ribbon {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: linear-gradient(90deg, #4c1d95 0%, #240b42 100%);
        border: 1px solid rgba(250, 204, 21, 0.58);
        color: #fde047;
        font-size: 12px;
        font-weight: 900;
        padding: 3px 13px;
        border-radius: 8px 16px 16px 8px;
      }

      /* تابەکانی ناو پڕۆفایل */
      .yk-prof-tabs {
        position: relative;
        z-index: 10;
        display: flex;
        gap: 6px;
        margin: 10px 14px 4px;
        padding: 4px;
        border-radius: 15px;
        background: rgba(15, 5, 28, 0.78);
        border: 1px solid rgba(250, 204, 21, 0.25);
      }
      .yk-prof-tab {
        flex: 1;
        padding: 8px 6px;
        border-radius: 11px;
        border: none;
        background: transparent;
        color: #c4b5fd;
        font-size: 11.5px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.16s ease;
      }
      .yk-prof-tab.active {
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #19092b;
        box-shadow: 0 4px 12px rgba(234, 179, 8, 0.35);
      }

      /* تۆڕی یارییەکان (شەتڕەنج، دۆمینە، لودۆ، کۆنکان) */
      .yk-games-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-top: 10px;
      }
      .yk-game-stat-tile {
        background: rgba(18, 6, 33, 0.78);
        border: 1px solid rgba(250, 204, 21, 0.24);
        border-radius: 14px;
        padding: 9px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
      }

      /* خەڵاتەکان و کۆگا */
      .yk-badges-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 10px;
      }
      .yk-badge-card {
        background: rgba(18, 6, 33, 0.78);
        border: 1px solid rgba(250, 204, 21, 0.32);
        border-radius: 14px;
        padding: 10px 6px;
        text-align: center;
        cursor: pointer;
        transition: transform 0.14s ease;
      }
      .yk-badge-card:active { transform: scale(0.95); }
      .yk-badge-card.locked {
        opacity: 0.52;
        filter: grayscale(0.65);
        border-color: rgba(255, 255, 255, 0.12);
      }

      .yk-wardrobe-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        background: rgba(18, 6, 33, 0.8);
        border: 1px solid rgba(250, 204, 21, 0.28);
        border-radius: 14px;
        padding: 9px 11px;
        margin-top: 8px;
      }
      .yk-wardrobe-item.active-eq {
        border-color: #fde047;
        background: rgba(76, 29, 149, 0.55);
        box-shadow: 0 0 14px rgba(250, 204, 21, 0.25);
      }

      /* دوگمەکانی خوارەوە */
      .yk-prof-footer {
        position: relative;
        z-index: 12;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px 16px;
      }
      .yk-btn-gold {
        flex: 1;
        padding: 11px 12px;
        border-radius: 15px;
        border: 1.5px solid #fef08a;
        background: linear-gradient(180deg, #fde047 0%, #eab308 100%);
        color: #19092b;
        font-size: 13px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(234, 179, 8, 0.42);
        transition: transform 0.14s ease;
      }
      .yk-btn-gold:active { transform: scale(0.96); }
      .yk-btn-royal {
        padding: 11px 13px;
        border-radius: 15px;
        border: 1.5px solid rgba(250, 204, 21, 0.45);
        background: linear-gradient(145deg, #3b1169 0%, #1c0832 100%);
        color: #fde047;
        font-size: 12.5px;
        font-weight: 900;
        cursor: pointer;
        transition: transform 0.14s ease;
      }
      .yk-btn-royal:active { transform: scale(0.96); }

      /* سندوقی هاوڕێیان و گەڕان */
      .yk-social-list {
        max-height: 310px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
        text-align: right;
      }
      .yk-social-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: rgba(46, 16, 101, 0.58);
        border: 1px solid rgba(250, 204, 21, 0.24);
        padding: 9px 11px;
        border-radius: 15px;
      }
      .yk-mini-act {
        padding: 6px 11px;
        border-radius: 10px;
        border: none;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
      }
      .yk-search-input {
        width: 100%;
        padding: 10px 13px;
        border-radius: 14px;
        background: rgba(15, 5, 28, 0.85);
        border: 1.5px solid rgba(250, 204, 21, 0.4);
        color: #fff;
        font-size: 12.5px;
        outline: none;
        margin-top: 6px;
      }
      .yk-search-input:focus { border-color: #fde047; }
    `;
    document.head.appendChild(style);

    const mount = document.createElement('div');
    mount.id = 'yk-royal-profile-mount';
    mount.innerHTML = `
      <!-- دوگمەی سندوقی هاوڕێیان -->
      <button id="yk-social-fab" class="yk-social-fab" title="هاوڕێیان، داواکاری ئەد و گەڕان" onclick="openSocialInbox()">
        👥
        <span id="yk-fab-badge" class="yk-fab-badge">0</span>
      </button>

      <!-- نۆتیفیکەیشنی ڕاستەوخۆ -->
      <div id="yk-royal-toast" class="yk-royal-toast">
        <img id="yk-toast-avatar" src="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid #fde047;flex-shrink:0;" />
        <div style="flex:1;min-width:0;text-align:right;">
          <div style="font-size:12.5px;font-weight:900;color:#fde047;">داواکاری هاوڕێیەتی نوێ ✨</div>
          <div id="yk-toast-text" style="font-size:11.5px;color:#f3e8ff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
        </div>
        <button onclick="openSocialInbox(); document.getElementById('yk-royal-toast').classList.remove('show');" class="yk-mini-act" style="background:#fde047;color:#19092b;">بینین</button>
      </div>

      <!-- مۆداڵی پڕۆفایلی شاهانە -->
      <div id="yk-profile-modal" class="yk-prof-backdrop" onclick="if(event.target===this) closeUserProfile()">
        <div class="yk-prof-shell">
          <canvas id="yk-prof-embers"></canvas>

          <div class="yk-prof-header">
            <span style="width:36px;"></span>
            <span class="yk-prof-header-title">پڕۆفایل</span>
            <button class="yk-circle-icon-btn" onclick="closeUserProfile()" title="داخستن">✕</button>
          </div>

          <!-- کەڤەری پشتەوە -->
          <div id="yk-prof-cover-box" class="yk-cover-stage"></div>

          <!-- وێنەی پڕۆفایل + چوارچێوە -->
          <div class="yk-avatar-hero">
            <div id="yk-prof-frame-box"></div>
            <div class="yk-avatar-inner">
              <img id="yk-prof-avatar" src="" alt="avatar" />
            </div>
          </div>

          <!-- دوگمە لایەکییەکان: لایک و کۆگای ستایل -->
          <div class="yk-side-action-row">
            <button id="yk-prof-like-btn" class="yk-side-pill" onclick="toggleProfileLike()" title="لایککردنی پڕۆفایل">
              <span>❤️</span>
              <span id="yk-prof-likes-count">0</span>
            </button>
            <button id="yk-prof-style-shortcut" class="yk-side-pill" onclick="switchProfileTab('wardrobe')" title="کەڤەر و چوارچێوەکان">
              <span>🎨</span>
              <span>ستایل</span>
            </button>
          </div>

          <!-- ناو، ID، نیشانەی خاوەن و بایۆ -->
          <div style="position:relative;z-index:12;text-align:center;padding:0 16px;">
            <h3 id="yk-prof-name" style="font-size:21px;font-weight:900;margin:0 0 3px;">...</h3>
            <div onclick="copyCurrentProfileId()" style="display:inline-flex;align-items:center;gap:6px;font-size:11.5px;color:#d8b4fe;cursor:pointer;margin-bottom:8px;">
              <span id="yk-prof-id-text">ID: ...</span>
              <span title="کۆپیکردنی ئایدی">📋</span>
            </div>
            <div id="yk-prof-owner-row" style="display:none;align-items:center;justify-content:center;gap:8px;margin-bottom:6px;">
              <span class="yk-owner-badge">خاوەنی پلاتفۆرم 👑</span>
              ${getKurdishFlagSVG(26, 17)}
            </div>
            <div id="yk-prof-bio" class="yk-bio-box" style="display:none;"></div>
          </div>

          <!-- شریتی ئاست (Level & XP) -->
          <div class="yk-card-panel" style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
            <div style="display:flex;flex-direction:column;gap:1px;">
              <span style="font-size:12.5px;font-weight:900;color:#fde047;">ئاست Level</span>
              <span id="yk-prof-rank-label" style="font-size:10px;color:#c4b5fd;font-weight:700;">سەرەتایی</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex:1;">
              <span id="yk-prof-level-num" style="background:linear-gradient(135deg,#10b981,#047857);border:1.5px solid #fde047;color:#fff;font-size:12.5px;font-weight:900;padding:2px 10px;border-radius:9px;box-shadow:0 3px 10px rgba(16,185,129,0.4);">1</span>
              <div style="flex:1;height:19px;background:rgba(12,4,24,0.88);border:1px solid rgba(250,204,21,0.48);border-radius:999px;overflow:hidden;position:relative;">
                <div id="yk-prof-xp-fill" style="height:100%;width:15%;background:linear-gradient(90deg,#059669,#34d399,#fde047);transition:width 0.45s ease;"></div>
                <span id="yk-prof-xp-label" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10.5px;font-weight:900;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,0.8);">0/25 XP</span>
              </div>
            </div>
          </div>

          <!-- ٣ تابی سەرەکی -->
          <div class="yk-prof-tabs">
            <button id="yk-ptab-stats" class="yk-prof-tab active" onclick="switchProfileTab('stats')">🎮 یارییەکان</button>
            <button id="yk-ptab-badges" class="yk-prof-tab" onclick="switchProfileTab('badges')">🏆 دەستکەوتەکان</button>
            <button id="yk-ptab-wardrobe" class="yk-prof-tab" onclick="switchProfileTab('wardrobe')">👑 کەڤەر و ستایل</button>
          </div>

          <!-- ناوەڕۆکی تابەکان -->
          <div id="yk-prof-tab-body"></div>

          <!-- شریتی خوارەوە -->
          <div id="yk-prof-footer" class="yk-prof-footer"></div>
        </div>
      </div>

      <!-- مۆداڵی سندوقی هاوڕێیان، داواکاری ئەد و گەڕان -->
      <div id="yk-inbox-modal" class="yk-prof-backdrop" onclick="if(event.target===this) closeSocialInbox()">
        <div class="yk-prof-shell" style="padding:18px;max-width:395px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
            <h3 style="font-size:17px;font-weight:900;color:#fde047;margin:0;">👥 ناوەندی کۆمەڵایەتی</h3>
            <button class="yk-circle-icon-btn" style="width:32px;height:32px;font-size:14px;" onclick="closeSocialInbox()">✕</button>
          </div>
          <div class="yk-prof-tabs" style="margin:8px 0;">
            <button id="yk-stab-requests" class="yk-prof-tab active" onclick="switchSocialTab('requests')">داواکاری (<span id="yk-scount-req">0</span>)</button>
            <button id="yk-stab-friends" class="yk-prof-tab" onclick="switchSocialTab('friends')">هاوڕێکانم (<span id="yk-scount-fr">0</span>)</button>
            <button id="yk-stab-search" class="yk-prof-tab" onclick="switchSocialTab('search')">🔍 گەڕان</button>
          </div>
          <div id="yk-social-body"></div>
        </div>
      </div>
    `;
    document.body.appendChild(mount);
  }

  /* --------------------------------------------------------------------------
     ٦. ئەنیمەیشنی پڕیشکە زێڕینەکان بە 60 FPS (تەنها کاتی کرانەوەی پڕۆفایل)
     -------------------------------------------------------------------------- */
  function startProfileEmbers() {
    stopProfileEmbers();
    const cvs = document.getElementById('yk-prof-embers');
    const modal = document.getElementById('yk-profile-modal');
    if (!cvs || !modal || !modal.classList.contains('open')) return;

    const shell = cvs.parentElement;
    const ctx = cvs.getContext('2d');
    const w = (cvs.width = shell.clientWidth || 420);
    const h = (cvs.height = Math.max(shell.scrollHeight, shell.clientHeight, 640));

    const sparks = Array.from({ length: 22 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.8,
      vy: -(Math.random() * 0.45 + 0.18),
      ph: Math.random() * Math.PI * 2
    }));

    function frame() {
      if (!modal.classList.contains('open')) {
        stopProfileEmbers();
        return;
      }
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.y += s.vy;
        s.ph += 0.03;
        if (s.y < -6) {
          s.y = h + 6;
          s.x = Math.random() * w;
        }
        const alpha = 0.2 + 0.55 * Math.abs(Math.sin(s.ph));
        ctx.fillStyle = `rgba(253, 224, 71, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x + Math.sin(s.ph) * 5, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      embersAnimId = requestAnimationFrame(frame);
    }
    embersAnimId = requestAnimationFrame(frame);
  }

  function stopProfileEmbers() {
    if (embersAnimId) {
      cancelAnimationFrame(embersAnimId);
      embersAnimId = null;
    }
  }

  /* --------------------------------------------------------------------------
     ٧. پشکنین و گرتنی پەنجەرە کۆنەکەی «دەستکاریکردنی پڕۆفایل» لە index.html
     -------------------------------------------------------------------------- */
  function findLegacyEditModal() {
    const allDivs = document.querySelectorAll('div');
    for (let i = 0; i < allDivs.length; i++) {
      const el = allDivs[i];
      if (el.id === 'yk-profile-modal' || el.id === 'yk-inbox-modal' || el.closest('#yk-royal-profile-mount')) continue;
      if (el.childElementCount <= 6 && el.textContent && el.textContent.includes('دەستکاریکردنی پڕۆفایل')) {
        let overlay = el;
        while (overlay && overlay.parentElement && overlay.parentElement !== document.body) {
          const style = window.getComputedStyle(overlay);
          if (style.position === 'fixed') return overlay;
          overlay = overlay.parentElement;
        }
        return overlay;
      }
    }
    return null;
  }

  function interceptLegacyModalIfVisible() {
    if (allowLegacyEditModal) return;
    const legacy = findLegacyEditModal();
    if (!legacy) return;
    const style = window.getComputedStyle(legacy);
    const visible = style.display !== 'none' && style.visibility !== 'hidden' && !legacy.classList.contains('hidden');
    if (visible) {
      legacy.classList.add('hidden');
      legacy.style.display = 'none';
      openUserProfile();
    }
  }

  function startLegacyModalWatcher() {
    if (window._ykLegacyWatcherStarted) return;
    window._ykLegacyWatcherStarted = true;

    const observer = new MutationObserver(() => {
      interceptLegacyModalIfVisible();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  window.openLegacyProfileEditor = function () {
    allowLegacyEditModal = true;
    closeUserProfile();
    const legacy = findLegacyEditModal();
    if (legacy) {
      legacy.classList.remove('hidden');
      legacy.style.display = 'flex';
    } else if (typeof originalOpenProfileFn === 'function') {
      originalOpenProfileFn();
    }
    setTimeout(() => { allowLegacyEditModal = false; }, 1500);
  };

  function hookGlobalFunctions() {
    if (typeof window.selectGiftRecipientAndOpen === 'function' && !window.selectGiftRecipientAndOpen._ykHooked) {
      originalSelectGiftFn = window.selectGiftRecipientAndOpen;
      window.selectGiftRecipientAndOpen = function (uid) {
        if (uid && uid !== 'ALL') openUserProfile(uid);
        else if (originalSelectGiftFn) originalSelectGiftFn(uid);
      };
      window.selectGiftRecipientAndOpen._ykHooked = true;
    }

    const legacyFnNames = [
      'openProfileModal', 'showProfileModal', 'openEditProfileModal',
      'openProfileSettings', 'openAccountModal', 'toggleProfileModal', 'openProfile'
    ];
    for (let i = 0; i < legacyFnNames.length; i++) {
      const fnName = legacyFnNames[i];
      if (typeof window[fnName] === 'function' && !window[fnName]._ykHooked) {
        originalOpenProfileFn = window[fnName];
        window[fnName] = function () {
          if (allowLegacyEditModal) return originalOpenProfileFn.apply(this, arguments);
          openUserProfile();
        };
        window[fnName]._ykHooked = true;
      }
    }
  }

  // گرتنی کلیکی کارتی پڕۆفایل لە شریتی سەرەوەی index.html پێش ئەوەی کۆدە کۆنەکە جێبەجێ بێت
  document.addEventListener('click', function (e) {
    if (e.target.closest('#yk-royal-profile-mount')) return;
    let node = e.target;
    while (node && node !== document.body) {
      const rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
      const onclickStr = node.getAttribute ? (node.getAttribute('onclick') || '') : '';
      const txt = (node.textContent || '').trim();
      if (
        rect &&
        rect.top >= 0 &&
        rect.top < 95 &&
        rect.height >= 24 &&
        rect.height <= 90 &&
        rect.width >= 55 &&
        rect.width <= 300 &&
        (txt.includes('پڕۆفایل') || /profile/i.test(onclickStr))
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openUserProfile();
        return;
      }
      node = node.parentElement;
    }
  }, true);

  // گرتنی کلیک لەناو چاتی دیوەخان، ڕیزبەندی و هەر توخمێکی خاوەن data-uid
  document.addEventListener('click', async function (e) {
    if (e.target.closest('#yk-royal-profile-mount')) return;

    const uidNode = e.target.closest('[data-uid]');
    if (uidNode) {
      const u = uidNode.getAttribute('data-uid');
      if (u) return openUserProfile(u);
    }

    const chatBox = e.target.closest('#ykVip_ChatMessages');
    if (chatBox) {
      const row = e.target.closest('#ykVip_ChatMessages > div');
      if (row && typeof currentRoomMembers !== 'undefined' && currentRoomMembers) {
        const nameEl = row.querySelector('.text-amber-300, strong');
        const clickedName = nameEl ? nameEl.textContent.trim() : '';
        if (clickedName) {
          const entry = Object.entries(currentRoomMembers).find(([, m]) => m && m.name && m.name.trim() === clickedName);
          if (entry) return openUserProfile(entry[0]);
        }
      }
    }

    const lbRow = e.target.closest('#leaderboardList > div');
    if (lbRow) {
      const nameSpan = lbRow.querySelector('.text-white.font-bold');
      const clickedName = nameSpan ? nameSpan.textContent.trim() : '';
      const database = getRTDB();
      if (clickedName && database) {
        const snap = await database.ref('players').orderByChild('name').equalTo(clickedName).limitToFirst(1).once('value');
        if (snap.exists()) {
          const uid = Object.keys(snap.val())[0];
          if (uid) openUserProfile(uid);
        }
      }
    }
  });

  /* --------------------------------------------------------------------------
     ٨. کردنەوە و پیشاندانی پڕۆفایلی شاهانە
     -------------------------------------------------------------------------- */
  window.openUserProfile = async function (uid) {
    const me = getMe();
    const targetUid = uid || (me && me.uid);
    if (!targetUid) return;

    injectRoyalStylesAndDOM();
    currentProfileUid = String(targetUid);
    currentProfileTab = 'stats';

    const modal = document.getElementById('yk-profile-modal');
    modal.classList.add('open');
    startProfileEmbers();

    // دۆخی چاوەڕوانی
    document.getElementById('yk-prof-name').textContent = 'چاوەڕوان بە...';
    document.getElementById('yk-prof-name').className = '';
    document.getElementById('yk-prof-id-text').textContent = `ID: ${currentProfileUid.slice(0, 14)}`;
    document.getElementById('yk-prof-avatar').src = defaultAvatar('ی');
    document.getElementById('yk-prof-owner-row').style.display = 'none';
    document.getElementById('yk-prof-bio').style.display = 'none';
    document.getElementById('yk-prof-cover-box').innerHTML = getCoverHTMLById('default', false);
    document.getElementById('yk-prof-frame-box').innerHTML = '';

    const database = getRTDB();
    let userData = {};
    if (database) {
      try {
        const snap = await database.ref(`players/${currentProfileUid}`).once('value');
        if (snap.exists() && snap.val()) userData = snap.val();
      } catch (e) {}
    }

    const roomMember = (typeof currentRoomMembers !== 'undefined' && currentRoomMembers) ? currentRoomMembers[currentProfileUid] : null;
    const isMe = !!(me && me.uid === currentProfileUid);

    const name = userData.name || (roomMember && roomMember.name) || (isMe && me.name) || 'یاریزانی یاری کوردی';
    const photo = userData.avatar || userData.photo || (roomMember && roomMember.avatar) || (isMe && me.photo) || defaultAvatar(name);
    const email = userData.email || (isMe && me.email) || '';
    const username = userData.username || '';
    const bio = userData.bio || '';
    const ownerFlag = isPlatformOwner(currentProfileUid, email, username);

    // کۆکردنەوەی ئامارەکانی هەموو یارییەکان
    const eloObj = (userData.elo && typeof userData.elo === 'object') ? userData.elo : {};
    const winsObj = (userData.wins && typeof userData.wins === 'object') ? userData.wins : {};
    const gamesObj = (userData.games && typeof userData.games === 'object') ? userData.games : {};

    const chessElo = Number(eloObj.chess) || 1200;
    const dominoElo = Number(eloObj.domino) || 1200;
    const ludoElo = Number(eloObj.ludo) || 1200;
    const konkanElo = Number(eloObj.konkan) || 1200;

    const avgElo = Math.round((chessElo + dominoElo) / 2);
    const totalWins = typeof userData.wins === 'object'
      ? Object.values(winsObj).reduce((s, v) => s + (Number(v) || 0), 0)
      : (Number(userData.wins) || 0);
    const totalGames = typeof userData.games === 'object'
      ? Object.values(gamesObj).reduce((s, v) => s + (Number(v) || 0), 0)
      : (Number(userData.games) || 0);
    const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : '0.0';
    const coins = (typeof userData.coins !== 'undefined') ? Number(userData.coins) : (isMe && typeof myUserCoins !== 'undefined' ? myUserCoins : 250);
    const xpTotal = Number(userData.xp) || (totalWins * 15);
    const level = Math.max(1, Math.floor(xpTotal / 25) + 1);
    const xpInLevel = xpTotal % 25;
    const league = getLeagueByElo(Math.max(chessElo, dominoElo, avgElo));

    const equippedCover = userData.equippedCover || (ownerFlag ? 'sherwana' : 'default');
    const equippedFrame = userData.equippedFrame || (ownerFlag ? 'vip_eagle' : 'default');
    const ownedCovers = (userData.ownedCovers && typeof userData.ownedCovers === 'object') ? userData.ownedCovers : {};
    const ownedFrames = (userData.ownedFrames && typeof userData.ownedFrames === 'object') ? userData.ownedFrames : {};

    activeProfileCache = {
      uid: currentProfileUid,
      isMe,
      ownerFlag,
      name,
      photo,
      bio,
      coins,
      avgElo,
      chessElo,
      dominoElo,
      ludoElo,
      konkanElo,
      winsObj,
      gamesObj,
      totalWins,
      totalGames,
      winRate,
      level,
      xpInLevel,
      league,
      equippedCover,
      equippedFrame,
      ownedCovers,
      ownedFrames
    };

    // دانانی کەڤەر و چوارچێوە
    document.getElementById('yk-prof-cover-box').innerHTML = getCoverHTMLById(equippedCover, ownerFlag);
    document.getElementById('yk-prof-frame-box').innerHTML = getFrameOverlayHTML(equippedFrame, ownerFlag);

    // دانانی ناو، وێنە و نیشانە
    const nameEl = document.getElementById('yk-prof-name');
    nameEl.textContent = name;
    nameEl.className = ownerFlag ? 'yk-name-gold' : '';
    document.getElementById('yk-prof-avatar').src = photo;
    document.getElementById('yk-prof-owner-row').style.display = ownerFlag ? 'inline-flex' : 'none';

    const bioEl = document.getElementById('yk-prof-bio');
    if (bio) {
      bioEl.textContent = bio;
      bioEl.style.display = 'block';
    } else if (ownerFlag) {
      bioEl.textContent = 'دامەزرێنەر و خاوەنی پلاتفۆرمی یاری کوردی 👑';
      bioEl.style.display = 'block';
    } else {
      bioEl.style.display = 'none';
    }

    // شریتی ئاست
    document.getElementById('yk-prof-level-num').textContent = level;
    document.getElementById('yk-prof-rank-label').textContent = `${league.icon} ${league.name}`;
    document.getElementById('yk-prof-xp-fill').style.width = `${Math.max(12, Math.round((xpInLevel / 25) * 100))}%`;
    document.getElementById('yk-prof-xp-label').textContent = `${xpInLevel}/25 XP`;

    // بەستنەوەی ژمارەی لایکەکان بە شێوەی ڕاستەوخۆ
    bindProfileLikesListener(currentProfileUid);

    // پیشاندانی تابی یەکەم و دوگمەکانی خوارەوە
    switchProfileTab('stats');
    renderProfileFooter(activeProfileCache);
  };

  window.closeUserProfile = function () {
    stopProfileEmbers();
    if (likesUnsubscribeRef) {
      likesUnsubscribeRef.off();
      likesUnsubscribeRef = null;
    }
    const modal = document.getElementById('yk-profile-modal');
    if (modal) modal.classList.remove('open');
  };

  window.copyCurrentProfileId = function () {
    if (!currentProfileUid) return;
    if (navigator.clipboard) navigator.clipboard.writeText(currentProfileUid).catch(() => {});
    const idEl = document.getElementById('yk-prof-id-text');
    if (idEl) {
      const old = idEl.textContent;
      idEl.textContent = 'کۆپی کرا ✓';
      setTimeout(() => { idEl.textContent = old; }, 1300);
    }
  };

  /* --------------------------------------------------------------------------
     ٩. سیستەمی لایکی پڕۆفایل (❤️) و بایۆ (📝)
     -------------------------------------------------------------------------- */
  function bindProfileLikesListener(targetUid) {
    if (likesUnsubscribeRef) {
      likesUnsubscribeRef.off();
      likesUnsubscribeRef = null;
    }
    const database = getRTDB();
    const countEl = document.getElementById('yk-prof-likes-count');
    const btnEl = document.getElementById('yk-prof-like-btn');
    if (!database || !countEl || !btnEl) return;

    const me = getMe();
    likesUnsubscribeRef = database.ref(`profileLikes/${targetUid}`);
    likesUnsubscribeRef.on('value', snap => {
      const val = snap.val() || {};
      const total = Object.keys(val).length;
      countEl.textContent = total.toLocaleString();
      const iLiked = !!(me && val[me.uid]);
      btnEl.classList.toggle('liked', iLiked);
    });
  }

  window.toggleProfileLike = async function () {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || !currentProfileUid) return;
    if (me.uid === currentProfileUid) {
      alert('ناتوانیت لایکی پڕۆفایلی خۆت بکەیت ✨');
      return;
    }
    const ref = database.ref(`profileLikes/${currentProfileUid}/${me.uid}`);
    const snap = await ref.once('value');
    if (snap.exists()) {
      await ref.remove();
    } else {
      await ref.set(Date.now());
      playRoyalChime('like');
      spawnFloatingLikeHeart();
    }
  };

  function spawnFloatingLikeHeart() {
    const btn = document.getElementById('yk-prof-like-btn');
    if (!btn) return;
    const h = document.createElement('span');
    h.textContent = '❤️';
    h.style.cssText = 'position:fixed;z-index:10090;pointer-events:none;font-size:22px;animation:ykHeartPop 0.9s ease-out forwards;';
    const rect = btn.getBoundingClientRect();
    h.style.left = `${rect.left + rect.width / 2 - 10}px`;
    h.style.top = `${rect.top}px`;
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 950);
  }

  window.editMyProfileBio = async function () {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database) return;
    const currentBio = (activeProfileCache && activeProfileCache.bio) || '';
    const next = prompt('بایۆ یان وتەیەکی کورت بۆ پڕۆفایلەکەت بنووسە (ئەوپەڕی ٨٠ پیت):', currentBio);
    if (next === null) return;
    const trimmed = next.trim().slice(0, 80);
    await database.ref(`players/${me.uid}/bio`).set(trimmed);
    openUserProfile(me.uid);
  };

  /* --------------------------------------------------------------------------
     ١٠. ناوەڕۆکی ٣ تابەکەی پڕۆفایل (یارییەکان، دەستکەوتەکان، کەڤەر و ستایل)
     -------------------------------------------------------------------------- */
  window.switchProfileTab = function (tab) {
    currentProfileTab = tab;
    ['stats', 'badges', 'wardrobe'].forEach(t => {
      const b = document.getElementById('yk-ptab-' + t);
      if (b) b.classList.toggle('active', t === tab);
    });
    const body = document.getElementById('yk-prof-tab-body');
    if (!body || !activeProfileCache) return;

    const p = activeProfileCache;

    if (tab === 'stats') {
      body.innerHTML = `
        <div class="yk-card-panel">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <span class="yk-ribbon">یارییەکان</span>
            <span style="font-size:12.5px;font-weight:900;color:#c4b5fd;">YariKurdi</span>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12.5px;font-weight:900;padding-bottom:10px;border-bottom:1px dashed rgba(250,204,21,0.28);">
            <div>گشتی Total: <span style="color:#fde047;">🪙 ${p.coins.toLocaleString()}</span></div>
            <div>ڕێژەی بردنەوە: <span style="color:#34d399;">${p.winRate}%</span></div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-around;padding:10px 0 6px;font-size:11.5px;color:#e9d5ff;">
            <div style="text-align:center;">
              <div style="font-size:21px;">${p.league.icon}</div>
              <div style="color:${p.league.color};font-weight:900;">${p.league.name}</div>
              <div style="font-size:10px;color:#a78bfa;">خولی ئێستا</div>
            </div>
            <div style="width:1px;height:36px;background:rgba(250,204,21,0.2);"></div>
            <div style="text-align:center;">
              <div style="font-size:21px;">🏆</div>
              <div style="color:#fde047;font-weight:900;">${p.avgElo} Elo</div>
              <div style="font-size:10px;color:#a78bfa;">تێکڕای هێز</div>
            </div>
            <div style="width:1px;height:36px;background:rgba(250,204,21,0.2);"></div>
            <div style="text-align:center;">
              <div style="font-size:21px;">⚔️</div>
              <div style="color:#34d399;font-weight:900;">${p.totalWins} / ${p.totalGames}</div>
              <div style="font-size:10px;color:#a78bfa;">بردنەوە / یاری</div>
            </div>
          </div>

          <div class="yk-games-grid">
            <div class="yk-game-stat-tile">
              <div>
                <div style="font-size:12px;font-weight:900;color:#fff;">♟️ شەتڕەنج</div>
                <div style="font-size:10px;color:#c4b5fd;">بردنەوە: ${Number(p.winsObj.chess) || 0}</div>
              </div>
              <span style="font-size:12.5px;font-weight:900;color:#fde047;">${p.chessElo}</span>
            </div>
            <div class="yk-game-stat-tile">
              <div>
                <div style="font-size:12px;font-weight:900;color:#fff;">🁢 دۆمینە</div>
                <div style="font-size:10px;color:#c4b5fd;">بردنەوە: ${Number(p.winsObj.domino) || 0}</div>
              </div>
              <span style="font-size:12.5px;font-weight:900;color:#fde047;">${p.dominoElo}</span>
            </div>
            <div class="yk-game-stat-tile">
              <div>
                <div style="font-size:12px;font-weight:900;color:#fff;">🎲 لودۆ</div>
                <div style="font-size:10px;color:#c4b5fd;">بردنەوە: ${Number(p.winsObj.ludo) || 0}</div>
              </div>
              <span style="font-size:12.5px;font-weight:900;color:#fde047;">${p.ludoElo}</span>
            </div>
            <div class="yk-game-stat-tile">
              <div>
                <div style="font-size:12px;font-weight:900;color:#fff;">🃏 کۆنکان</div>
                <div style="font-size:10px;color:#c4b5fd;">بردنەوە: ${Number(p.winsObj.konkan) || 0}</div>
              </div>
              <span style="font-size:12.5px;font-weight:900;color:#fde047;">${p.konkanElo}</span>
            </div>
          </div>
        </div>
      `;
    } else if (tab === 'badges') {
      const achievements = [
        { icon: '👑', title: 'تاجی خاوەن', desc: 'تایبەت بە خاوەنی پلاتفۆرمی یاری کوردی', unlocked: p.ownerFlag },
        { icon: '🏆', title: 'یەکەم بردنەوە', desc: 'بەدەستهێنانی یەکەم بردنەوە لە یارییەکدا', unlocked: p.totalWins >= 1 || p.ownerFlag },
        { icon: '♟️', title: 'مامۆستای شەتڕەنج', desc: 'گەیشتن بە خاڵی 1400 Elo لە شەتڕەنجدا', unlocked: p.chessElo >= 1400 || p.ownerFlag },
        { icon: '💰', title: 'دەوڵەمەند', desc: 'کۆکردنەوەی 5,000 سکە یان زیاتر', unlocked: p.coins >= 5000 },
        { icon: '🔥', title: 'جەنگاوەری بەردەوام', desc: 'ئەنجامدانی 20 یاری لە پلاتفۆرمەکەدا', unlocked: p.totalGames >= 20 },
        { icon: '💎', title: 'ئاستی بەرز', desc: 'گەیشتن بە ئاستی Level 10', unlocked: p.level >= 10 }
      ];

      body.innerHTML = `
        <div class="yk-card-panel">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span class="yk-ribbon">دەستکەوت و مەدالیاکان</span>
            <span style="font-size:11px;color:#fde047;font-weight:800;">${achievements.filter(a => a.unlocked).length} / ${achievements.length} کراوە</span>
          </div>
          <div class="yk-badges-grid">
            ${achievements.map(a => `
              <div class="yk-badge-card ${a.unlocked ? '' : 'locked'}" onclick="alert('${escHtml(a.title)}\\n\\n${escHtml(a.desc)}')">
                <div style="font-size:24px;margin-bottom:4px;">${a.unlocked ? a.icon : '🔒'}</div>
                <div style="font-size:10.5px;font-weight:900;color:${a.unlocked ? '#fde047' : '#cbd5e1'};">${escHtml(a.title)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else if (tab === 'wardrobe') {
      const coversHtml = PROFILE_COVERS_CATALOG.map(c => {
        const isOwned = c.price === 0 || p.ownerFlag || !!p.ownedCovers[c.id];
        const isEquipped = p.equippedCover === c.id;
        let btnHtml = '';
        if (!p.isMe) {
          btnHtml = `<span style="font-size:11px;font-weight:800;color:${isEquipped ? '#34d399' : '#c4b5fd'};">${isEquipped ? 'چالاکە ✓' : (c.price > 0 ? '🪙 ' + c.price.toLocaleString() : 'بەخۆڕایی')}</span>`;
        } else if (isEquipped) {
          btnHtml = `<span style="padding:5px 10px;border-radius:10px;background:#10b981;color:#fff;font-size:11px;font-weight:900;">چالاکە ✓</span>`;
        } else if (isOwned) {
          btnHtml = `<button onclick="equipProfileCosmetic('cover','${c.id}')" class="yk-mini-act" style="background:#fde047;color:#19092b;">چالاککردن</button>`;
        } else {
          btnHtml = `<button onclick="showPremiumMarketNotice('${escHtml(c.name)}', ${c.price})" class="yk-mini-act" style="background:rgba(250,204,21,0.16);border:1px solid rgba(250,204,21,0.45);color:#fde047;">🔒 🪙 ${c.price.toLocaleString()}</button>`;
        }
        return `
          <div class="yk-wardrobe-item ${isEquipped ? 'active-eq' : ''}">
            <div style="min-width:0;">
              <div style="font-size:12px;font-weight:900;color:#fff;">${escHtml(c.name)} <span style="font-size:10px;color:#fde047;">• ${c.rarity}</span></div>
              <div style="font-size:10px;color:#c4b5fd;margin-top:2px;">${escHtml(c.desc)}</div>
            </div>
            <div style="flex-shrink:0;">${btnHtml}</div>
          </div>
        `;
      }).join('');

      const framesHtml = PROFILE_FRAMES_CATALOG.map(f => {
        const isOwned = f.price === 0 || p.ownerFlag || !!p.ownedFrames[f.id];
        const isEquipped = p.equippedFrame === f.id;
        let btnHtml = '';
        if (!p.isMe) {
          btnHtml = `<span style="font-size:11px;font-weight:800;color:${isEquipped ? '#34d399' : '#c4b5fd'};">${isEquipped ? 'چالاکە ✓' : (f.price > 0 ? '🪙 ' + f.price.toLocaleString() : 'بەخۆڕایی')}</span>`;
        } else if (isEquipped) {
          btnHtml = `<span style="padding:5px 10px;border-radius:10px;background:#10b981;color:#fff;font-size:11px;font-weight:900;">چالاکە ✓</span>`;
        } else if (isOwned) {
          btnHtml = `<button onclick="equipProfileCosmetic('frame','${f.id}')" class="yk-mini-act" style="background:#fde047;color:#19092b;">چالاککردن</button>`;
        } else {
          btnHtml = `<button onclick="showPremiumMarketNotice('${escHtml(f.name)}', ${f.price})" class="yk-mini-act" style="background:rgba(250,204,21,0.16);border:1px solid rgba(250,204,21,0.45);color:#fde047;">🔒 🪙 ${f.price.toLocaleString()}</button>`;
        }
        return `
          <div class="yk-wardrobe-item ${isEquipped ? 'active-eq' : ''}">
            <div style="font-size:12px;font-weight:900;color:#fff;">${escHtml(f.name)} <span style="font-size:10px;color:#fde047;">• ${f.rarity}</span></div>
            <div style="flex-shrink:0;">${btnHtml}</div>
          </div>
        `;
      }).join('');

      body.innerHTML = `
        <div class="yk-card-panel">
          <span class="yk-ribbon">🏰 کەڤەرەکانی پشتەوە</span>
          ${coversHtml}
        </div>
        <div class="yk-card-panel">
          <span class="yk-ribbon">👑 چوارچێوە شاهانەکان</span>
          ${framesHtml}
        </div>
      `;
    }
  };

  window.showPremiumMarketNotice = function (itemName, price) {
    alert(`🔒 ${itemName}\nنرخ: 🪙 ${Number(price).toLocaleString()} سکە\n\nئەم کەلوپەلە VIPـیە بەم زووانە لە بەشی بازاڕ بەردەست دەبێت بۆ کڕین بە سکە!`);
  };

  window.equipProfileCosmetic = async function (type, itemId) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || !activeProfileCache || !activeProfileCache.isMe) return;

    const field = type === 'cover' ? 'equippedCover' : 'equippedFrame';
    await database.ref(`players/${me.uid}/${field}`).set(itemId);
    playRoyalChime('like');
    openUserProfile(me.uid);
  };

  /* --------------------------------------------------------------------------
     ١١. دوگمەکانی خوارەوەی پڕۆفایل (ئەد، شاباش، دەستکاری، بایۆ)
     -------------------------------------------------------------------------- */
  async function renderProfileFooter(p) {
    const footer = document.getElementById('yk-prof-footer');
    if (!footer) return;
    const me = getMe();

    if (!me || p.isMe) {
      footer.innerHTML = `
        <button onclick="openLegacyProfileEditor()" class="yk-btn-gold">دەستکاری پڕۆفایل ✏️</button>
        <button onclick="editMyProfileBio()" class="yk-btn-royal">📝 بایۆ</button>
      `;
      return;
    }

    const database = getRTDB();
    let status = 'none';
    if (myFriends[p.uid]) status = 'friends';
    else if (incomingRequests[p.uid]) status = 'incoming';
    else if (database) {
      try {
        const sentSnap = await database.ref(`friendRequests/${p.uid}/${me.uid}`).once('value');
        if (sentSnap.exists()) status = 'sent';
      } catch (e) {}
    }

    let addBtn = '';
    if (status === 'friends') {
      addBtn = `<button class="yk-btn-gold" style="background:linear-gradient(180deg,#10b981,#059669);border-color:#6ee7b7;color:#fff;" disabled>هاوڕێن ✓</button>`;
    } else if (status === 'sent') {
      addBtn = `<button class="yk-btn-gold" style="background:#4c1d95;border-color:#a78bfa;color:#e9d5ff;" disabled>داواکاری نێردراوە ⏳</button>`;
    } else if (status === 'incoming') {
      addBtn = `<button class="yk-btn-gold" onclick="acceptFriendRequestByUid('${escHtml(p.uid)}')">وەرگرتنی ئەد ✓</button>`;
    } else {
      addBtn = `<button class="yk-btn-gold" onclick="sendFriendRequestToCurrent()">ناردنی ئەد ➕</button>`;
    }

    const inVoiceRoom = (typeof currentVoiceRoomId !== 'undefined' && currentVoiceRoomId);
    const giftBtn = inVoiceRoom
      ? `<button class="yk-btn-royal" onclick="openGiftForUserFromProfile('${escHtml(p.uid)}')">☕ شاباش</button>`
      : '';

    footer.innerHTML = `${addBtn}${giftBtn}`;
  }

  window.openGiftForUserFromProfile = function (uid) {
    closeUserProfile();
    if (originalSelectGiftFn) originalSelectGiftFn(uid);
    else if (typeof openGiftDrawerModal === 'function') openGiftDrawerModal();
  };

  /* --------------------------------------------------------------------------
     ١٢. سیستەمی هاوڕێیەتی، نۆتیفیکەیشنی زیندوو و گەڕان بەدوای یاریزاندا
     -------------------------------------------------------------------------- */
  window.sendFriendRequestToCurrent = async function () {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || !activeProfileCache || me.uid === activeProfileCache.uid) return;

    await database.ref(`friendRequests/${activeProfileCache.uid}/${me.uid}`).set({
      uid: me.uid,
      name: me.name,
      photo: me.photo || defaultAvatar(me.name),
      timestamp: Date.now()
    });
    playRoyalChime('notify');
    renderProfileFooter(activeProfileCache);
  };

  window.acceptFriendRequestByUid = async function (senderUid) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || !senderUid) return;

    const req = incomingRequests[senderUid] || (activeProfileCache && activeProfileCache.uid === senderUid ? activeProfileCache : null);
    const senderName = (req && req.name) || 'یاریزان';
    const senderPhoto = (req && req.photo) || defaultAvatar(senderName);
    const now = Date.now();

    await database.ref(`friends/${me.uid}/${senderUid}`).set({
      uid: senderUid,
      name: senderName,
      photo: senderPhoto,
      since: now
    });
    await database.ref(`friends/${senderUid}/${me.uid}`).set({
      uid: me.uid,
      name: me.name,
      photo: me.photo || defaultAvatar(me.name),
      since: now
    });
    await database.ref(`friendRequests/${me.uid}/${senderUid}`).remove();

    playRoyalChime('like');
    if (activeProfileCache && activeProfileCache.uid === senderUid) {
      renderProfileFooter(activeProfileCache);
    }
    renderSocialBody();
  };

  window.declineFriendRequestByUid = async function (senderUid) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || !senderUid) return;
    await database.ref(`friendRequests/${me.uid}/${senderUid}`).remove();
    renderSocialBody();
  };

  window.removeFriendByUid = async function (friendUid) {
    const me = getMe();
    const database = getRTDB();
    if (!me || !database || !friendUid) return;
    if (!confirm('دڵنیایت لە سڕینەوەی ئەم هاوڕێیە؟')) return;
    await database.ref(`friends/${me.uid}/${friendUid}`).remove();
    await database.ref(`friends/${friendUid}/${me.uid}`).remove();
    renderSocialBody();
  };

  window.openSocialInbox = function () {
    injectRoyalStylesAndDOM();
    document.getElementById('yk-inbox-modal').classList.add('open');
    renderSocialBody();
  };

  window.closeSocialInbox = function () {
    const modal = document.getElementById('yk-inbox-modal');
    if (modal) modal.classList.remove('open');
  };

  window.switchSocialTab = function (tab) {
    currentSocialTab = tab;
    ['requests', 'friends', 'search'].forEach(t => {
      const btn = document.getElementById('yk-stab-' + t);
      if (btn) btn.classList.toggle('active', t === tab);
    });
    renderSocialBody();
  };

  function renderSocialBody() {
    const body = document.getElementById('yk-social-body');
    if (!body) return;

    if (currentSocialTab === 'requests') {
      const list = Object.values(incomingRequests);
      if (list.length === 0) {
        body.innerHTML = `<div style="text-align:center;padding:30px 10px;color:#c4b5fd;font-size:13px;">هیچ داواکارییەکی نوێ نییە ✨</div>`;
        return;
      }
      body.innerHTML = `<div class="yk-social-list">${list.map(r => `
        <div class="yk-social-row">
          <div style="display:flex;align-items:center;gap:10px;cursor:pointer;min-width:0;" onclick="closeSocialInbox(); openUserProfile('${escHtml(r.uid)}')">
            <img src="${escHtml(r.photo || defaultAvatar(r.name))}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #fde047;flex-shrink:0;" />
            <div style="min-width:0;">
              <div style="font-size:13px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(r.name)}</div>
              <div style="font-size:10.5px;color:#d8b4fe;">داوای هاوڕێیەتی دەکات</div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button class="yk-mini-act" style="background:#10b981;color:#fff;" onclick="acceptFriendRequestByUid('${escHtml(r.uid)}')">✓</button>
            <button class="yk-mini-act" style="background:#ef4444;color:#fff;" onclick="declineFriendRequestByUid('${escHtml(r.uid)}')">✕</button>
          </div>
        </div>
      `).join('')}</div>`;
    } else if (currentSocialTab === 'friends') {
      const list = Object.values(myFriends);
      if (list.length === 0) {
        body.innerHTML = `<div style="text-align:center;padding:30px 10px;color:#c4b5fd;font-size:13px;">هێشتا هیچ هاوڕێیەکت نییە — دەتوانیت لە تابی گەڕان یان دیوەخان هاوڕێ زیاد بکەیت!</div>`;
        return;
      }
      body.innerHTML = `<div class="yk-social-list">${list.map(f => `
        <div class="yk-social-row">
          <div style="display:flex;align-items:center;gap:10px;cursor:pointer;flex:1;min-width:0;" onclick="closeSocialInbox(); openUserProfile('${escHtml(f.uid)}')">
            <img src="${escHtml(f.photo || defaultAvatar(f.name))}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1.5px solid #fde047;flex-shrink:0;" />
            <div style="font-size:13px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(f.name)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button class="yk-mini-act" style="background:#fde047;color:#19092b;" onclick="closeSocialInbox(); openUserProfile('${escHtml(f.uid)}')">پڕۆفایل</button>
            <button class="yk-mini-act" style="background:rgba(239,68,68,0.22);color:#fca5a5;" onclick="removeFriendByUid('${escHtml(f.uid)}')" title="سڕینەوە">✕</button>
          </div>
        </div>
      `).join('')}</div>`;
    } else if (currentSocialTab === 'search') {
      body.innerHTML = `
        <div style="display:flex;gap:6px;align-items:center;">
          <input id="yk-player-search-input" class="yk-search-input" placeholder="ناو یان ID یاریزان بنووسە..." onkeydown="if(event.key==='Enter') runPlayerSearch()" />
          <button onclick="runPlayerSearch()" class="yk-mini-act" style="background:#fde047;color:#19092b;height:40px;margin-top:6px;padding:0 14px;">گەڕان</button>
        </div>
        <div id="yk-search-results" class="yk-social-list">
          <div style="text-align:center;padding:24px 10px;color:#c4b5fd;font-size:12px;">بە ناو یان ID بگەڕێ بۆ دۆزینەوەی هاوڕێکانت 🔍</div>
        </div>
      `;
    }
  }

  window.runPlayerSearch = async function () {
    const inp = document.getElementById('yk-player-search-input');
    const out = document.getElementById('yk-search-results');
    const database = getRTDB();
    if (!inp || !out || !database) return;

    const q = inp.value.trim().toLowerCase();
    if (q.length < 2) {
      out.innerHTML = `<div style="text-align:center;padding:20px;color:#fde047;font-size:12px;">لانیکەم ٢ پیت بنووسە</div>`;
      return;
    }

    out.innerHTML = `<div style="text-align:center;padding:20px;color:#c4b5fd;font-size:12px;">خەریکی گەڕانین...</div>`;
    try {
      const snap = await database.ref('players').once('value');
      const matches = [];
      snap.forEach(c => {
        const d = c.val() || {};
        const uid = c.key;
        const nm = String(d.name || '').toLowerCase();
        if (nm.includes(q) || String(uid).toLowerCase().includes(q)) {
          matches.push({ uid, name: d.name || 'یاریزان', avatar: d.avatar || d.photo || '' });
        }
      });

      if (matches.length === 0) {
        out.innerHTML = `<div style="text-align:center;padding:20px;color:#fca5a5;font-size:12px;">هیچ یاریزانێک بەم ناوە نەدۆزرایەوە</div>`;
        return;
      }

      out.innerHTML = matches.slice(0, 15).map(m => `
        <div class="yk-social-row" style="cursor:pointer;" onclick="closeSocialInbox(); openUserProfile('${escHtml(m.uid)}')">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <img src="${escHtml(m.avatar || defaultAvatar(m.name))}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:1.5px solid #fde047;flex-shrink:0;" />
            <div style="min-width:0;">
              <div style="font-size:13px;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(m.name)}</div>
              <div style="font-size:10px;color:#a78bfa;">ID: ${escHtml(m.uid.slice(0, 12))}</div>
            </div>
          </div>
          <span style="font-size:11.5px;font-weight:900;color:#fde047;">پڕۆفایل ←</span>
        </div>
      `).join('');
    } catch (e) {
      out.innerHTML = `<div style="text-align:center;padding:20px;color:#fca5a5;font-size:12px;">هەڵەیەک لە گەڕاندا ڕوویدا</div>`;
    }
  };

  function showLiveFriendToast(req) {
    const toast = document.getElementById('yk-royal-toast');
    if (!toast) return;
    document.getElementById('yk-toast-avatar').src = req.photo || defaultAvatar(req.name);
    document.getElementById('yk-toast-text').textContent = `${req.name} داواکاری هاوڕێیەتی بۆ ناردیت!`;
    toast.classList.add('show');
    playRoyalChime('notify');
    setTimeout(() => toast.classList.remove('show'), 4800);
  }

  /* --------------------------------------------------------------------------
     ١٣. بەستنەوەی ڕاستەوخۆ بە Firebase و دەستپێکردن
     -------------------------------------------------------------------------- */
  function startRealtimeSocialSync(me, database) {
    // تۆمارکردنی خۆکار بۆ UIDی خاوەنی پلاتفۆرم تا هەموو کەس بە VIP بتبینن
    if (String(me.email || '').trim().toLowerCase() === OWNER_EMAIL) {
      cachedOwnerUid = me.uid;
      database.ref('platformConfig/ownerUid').set(me.uid).catch(() => {});
    } else {
      database.ref('platformConfig/ownerUid').once('value').then(s => {
        if (s.exists() && s.val()) cachedOwnerUid = s.val();
      }).catch(() => {});
    }

    database.ref(`friendRequests/${me.uid}`).on('value', snap => {
      const data = snap.val() || {};
      const prevKeys = Object.keys(incomingRequests);
      incomingRequests = data;

      const count = Object.keys(data).length;
      const fabBadge = document.getElementById('yk-fab-badge');
      const tabBadge = document.getElementById('yk-scount-req');
      if (fabBadge) {
        fabBadge.textContent = count;
        fabBadge.style.display = count > 0 ? 'flex' : 'none';
      }
      if (tabBadge) tabBadge.textContent = count;

      if (initialRequestsLoaded) {
        for (const k of Object.keys(data)) {
          if (!prevKeys.includes(k)) showLiveFriendToast(data[k]);
        }
      }
      initialRequestsLoaded = true;
      if (currentSocialTab === 'requests') renderSocialBody();
    });

    database.ref(`friends/${me.uid}`).on('value', snap => {
      myFriends = snap.val() || {};
      const tabFr = document.getElementById('yk-scount-fr');
      if (tabFr) tabFr.textContent = Object.keys(myFriends).length;
      if (currentSocialTab === 'friends') renderSocialBody();
    });
  }

  function bootstrap() {
    injectRoyalStylesAndDOM();
    hookGlobalFunctions();
    startLegacyModalWatcher();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  const syncTimer = setInterval(() => {
    hookGlobalFunctions();
    const database = getRTDB();
    const me = getMe();
    if (database && me && me.uid) {
      injectRoyalStylesAndDOM();
      startRealtimeSocialSync(me, database);
      clearInterval(syncTimer);
    }
  }, 500);
})();