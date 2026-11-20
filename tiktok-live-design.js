/* === دیزاینی شاهانەی دیوەخانی YariKurdi (وەشانی سەلامەت و بێ کێشە) === */
(function initRoyalDiwexanUI() {
  let isBuilt = false;
  let seatsObserver = null;
  let seenMembers = new Set();
  let entranceQueue = [];
  let isShowingEntrance = false;

  function injectDiwexanStyles() {
    if (document.getElementById('ykRoyalDiwexanCss')) return;
    const style = document.createElement('style');
    style.id = 'ykRoyalDiwexanCss';
    style.textContent = `
      body.yk-diwexan-fullscreen #ykCleanTopBar,
      body.yk-diwexan-fullscreen .floating-bottom-dock {
        display: none !important;
      }

      #insideRoomPanel.yk-diwexan-stage {
        position: fixed !important;
        inset: 0 !important;
        z-index: 9500 !important;
        width: 100% !important;
        height: 100dvh !important;
        margin: 0 !important;
        padding: 0 !important;
        display: flex !important;
        justify-content: center !important;
        background: radial-gradient(circle at center, #2a0812 0%, #05050a 100%) !important;
        overflow: hidden !important;
      }
      #insideRoomPanel.hidden {
        display: none !important;
      }

      .yk-dx-shell {
        position: relative;
        width: 100%;
        max-width: 480px;
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: #16060b;
        background-image:
          linear-gradient(180deg, rgba(16, 4, 8, 0.58) 0%, rgba(28, 6, 12, 0.28) 42%, rgba(12, 3, 7, 0.88) 100%),
          url('diwexan-bg.jpg');
        background-size: cover;
        background-position: center;
        box-shadow: 0 0 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(250, 204, 21, 0.25);
        overflow: hidden;
        font-family: 'Noto Kufi Arabic', system-ui, sans-serif;
      }

      .yk-dx-topbar {
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 12px 12px 8px 12px;
      }
      .yk-dx-circle-btn {
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        border: 1.5px solid rgba(254, 240, 138, 0.45);
        background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%);
        color: #ffffff;
        font-size: 16px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(225, 29, 72, 0.5);
        flex-shrink: 0;
        transition: transform 0.15s ease;
      }
      .yk-dx-circle-btn:active { transform: scale(0.92); }

      .yk-dx-title-pill {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 5px 10px;
        border-radius: 9999px;
        background: linear-gradient(180deg, rgba(16, 22, 42, 0.9) 0%, rgba(10, 14, 28, 0.92) 100%);
        border: 1.5px solid rgba(250, 204, 21, 0.55);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.55);
      }
      .yk-dx-shield {
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: linear-gradient(135deg, #f43f5e, #b91c1c);
        border: 1.5px solid #fde047;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 10px;
        font-weight: 900;
        line-height: 1;
        flex-shrink: 0;
      }
      .yk-dx-title-text {
        flex: 1;
        min-width: 0;
        text-align: center;
      }
      .yk-dx-title-text #currentRoomTitle {
        margin: 0 !important;
        font-size: 13px !important;
        font-weight: 900 !important;
        color: #fef08a !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .yk-dx-sub-meta {
        font-size: 10px;
        color: #e2e8f0;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      .yk-dx-mini-host-dot {
        width: 28px;
        height: 28px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border: 1.5px solid #fef08a;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }

      .yk-dx-citadel-banner {
        position: relative;
        z-index: 10;
        margin: 0 12px 8px 12px;
        height: 68px;
        border-radius: 18px;
        border: 1.5px solid rgba(251, 191, 36, 0.72);
        background-color: #3f1d0d;
        background-image:
          linear-gradient(90deg, rgba(18, 8, 4, 0.76) 0%, rgba(18, 8, 4, 0.18) 50%, rgba(18, 8, 4, 0.78) 100%),
          url('qala-banner.jpg');
        background-size: cover;
        background-position: center;
        box-shadow: 0 8px 22px rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 12px;
        overflow: hidden;
      }
      .yk-dx-host-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .yk-dx-host-avatar-ring {
        width: 48px;
        height: 48px;
        border-radius: 9999px;
        padding: 3px;
        background: conic-gradient(from 0deg, #fde047, #f59e0b, #f43f5e, #fde047);
        box-shadow: 0 0 16px rgba(250, 204, 21, 0.8);
        flex-shrink: 0;
      }
      .yk-dx-host-avatar {
        width: 100%;
        height: 100%;
        border-radius: 9999px;
        background: linear-gradient(135deg, #ec4899, #be185d);
        color: #fff;
        font-weight: 900;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .yk-dx-host-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .yk-dx-host-name {
        color: #fef08a;
        font-size: 13px;
        font-weight: 900;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.95);
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .yk-dx-host-tag {
        display: inline-block;
        margin-top: 2px;
        padding: 1px 8px;
        border-radius: 9999px;
        background: linear-gradient(90deg, #fde047, #f59e0b);
        color: #291202;
        font-size: 10px;
        font-weight: 900;
      }
      .yk-dx-points-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: 9999px;
        background: rgba(0, 0, 0, 0.62);
        border: 1px solid rgba(251, 191, 36, 0.45);
        color: #fff;
        font-size: 12px;
        font-weight: 900;
        font-family: ui-monospace, monospace;
      }
      .yk-dx-p-dot {
        width: 16px;
        height: 16px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #fb7185, #e11d48);
        color: #fff;
        font-size: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .yk-dx-seats-wrap {
        position: relative;
        z-index: 10;
        padding: 4px 10px 6px 10px;
      }
      #roomSeatsGrid.yk-dx-seats-grid {
        display: grid !important;
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
        gap: 7px !important;
      }
      #roomSeatsGrid.yk-dx-seats-grid > * {
        position: relative !important;
        background: rgba(16, 11, 16, 0.72) !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
        border: 1px solid rgba(251, 191, 36, 0.32) !important;
        border-radius: 14px !important;
        padding: 14px 4px 6px 4px !important;
        min-height: 92px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        text-align: center !important;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.45) !important;
        overflow: visible !important;
      }
      #roomSeatsGrid.yk-dx-seats-grid > * img {
        width: 42px !important;
        height: 42px !important;
        border-radius: 9999px !important;
        object-fit: cover !important;
        border: 2px solid #facc15 !important;
        box-shadow: 0 0 10px rgba(250, 204, 21, 0.45) !important;
      }
      .yk-dx-role-chip {
        position: absolute;
        top: -7px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1px 6px;
        border-radius: 9999px;
        font-size: 8.5px;
        font-weight: 900;
        white-space: nowrap;
        color: #fff;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        z-index: 4;
      }
      .yk-dx-role-cohost { background: linear-gradient(90deg, #f43f5e, #e11d48); }
      .yk-dx-role-elder  { background: linear-gradient(90deg, #38bdf8, #0284c7); }

      .yk-dx-empty-seat {
        cursor: pointer;
        border-color: rgba(251, 191, 36, 0.22) !important;
        transition: all 0.2s ease;
      }
      .yk-dx-empty-seat:hover {
        border-color: rgba(251, 191, 36, 0.7) !important;
        background: rgba(35, 20, 25, 0.8) !important;
      }
      .yk-dx-plus-circle {
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px dashed rgba(251, 191, 36, 0.45);
        color: #fde047;
        font-size: 18px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .yk-dx-entrance-stage {
        position: relative;
        z-index: 25;
        min-height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2px 14px;
        pointer-events: none;
      }
      .yk-dx-entrance-pill {
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 5px 14px 5px 8px;
        border-radius: 9999px;
        background: linear-gradient(90deg, rgba(16, 185, 129, 0.88) 0%, rgba(234, 179, 8, 0.92) 50%, rgba(16, 185, 129, 0.88) 100%);
        border: 1.5px solid #fef08a;
        box-shadow: 0 0 26px rgba(250, 204, 21, 0.75), 0 6px 18px rgba(0, 0, 0, 0.55);
        color: #ffffff;
        font-size: 13px;
        font-weight: 900;
        text-shadow: 0 2px 6px rgba(0, 0, 0, 0.85);
        animation: ykEntranceSlide 3.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      }
      .yk-dx-entrance-avatar {
        width: 30px;
        height: 30px;
        border-radius: 9999px;
        border: 2px solid #fef08a;
        background: #1e293b;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        overflow: hidden;
      }
      .yk-dx-entrance-avatar img { width: 100%; height: 100%; object-fit: cover; }

      @keyframes ykEntranceSlide {
        0%   { opacity: 0; transform: translateX(48px) scale(0.86); }
        14%  { opacity: 1; transform: translateX(0) scale(1.03); }
        22%  { transform: translateX(0) scale(1); }
        82%  { opacity: 1; transform: translateX(0) scale(1); }
        100% { opacity: 0; transform: translateX(-36px) scale(0.92); }
      }

      .yk-dx-chat-wrap {
        position: relative;
        z-index: 10;
        flex: 1;
        min-height: 0;
        display: flex;
        flex-direction: column;
        padding: 4px 12px 8px 12px;
      }
      #roomChatMessages.yk-dx-chat-list {
        flex: 1 !important;
        height: auto !important;
        overflow-y: auto !important;
        background: transparent !important;
        border: none !important;
        padding: 4px 2px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 7px !important;
        mask-image: linear-gradient(180deg, transparent 0%, #000 10%, #000 100%);
        -webkit-mask-image: linear-gradient(180deg, transparent 0%, #000 10%, #000 100%);
      }
      #roomChatMessages.yk-dx-chat-list > * {
        max-width: 88% !important;
        align-self: flex-start !important;
        background: rgba(14, 10, 18, 0.76) !important;
        backdrop-filter: blur(8px) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        border-radius: 16px !important;
        padding: 7px 12px !important;
        color: #f8fafc !important;
        font-size: 12px !important;
        line-height: 1.45 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
      }
      #roomChatMessages.yk-dx-chat-list > *.yk-dx-gift-msg {
        background: linear-gradient(90deg, rgba(16, 185, 129, 0.32), rgba(180, 83, 9, 0.45)) !important;
        border: 1.5px solid rgba(250, 204, 21, 0.72) !important;
        box-shadow: 0 0 18px rgba(250, 204, 21, 0.25) !important;
      }

      .yk-dx-bottombar {
        position: relative;
        z-index: 20;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px calc(10px + env(safe-area-inset-bottom, 0px)) 10px;
        background: linear-gradient(180deg, rgba(10, 4, 8, 0) 0%, rgba(10, 4, 8, 0.92) 35%);
      }
      .yk-dx-mic-wrap #roomMicToggleBtn {
        width: 44px !important;
        height: 44px !important;
        padding: 0 !important;
        border-radius: 14px !important;
        background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%) !important;
        border: 1.5px solid rgba(254, 240, 138, 0.5) !important;
        color: #ffffff !important;
        font-size: 18px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 4px 14px rgba(225, 29, 72, 0.5) !important;
        overflow: hidden !important;
        white-space: nowrap !important;
      }
      .yk-dx-input-box {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 6px;
        height: 44px;
        padding: 0 8px 0 10px;
        border-radius: 14px;
        background: rgba(18, 18, 26, 0.88);
        border: 1px solid rgba(255, 255, 255, 0.16);
      }
      .yk-dx-input-box #roomChatInput {
        flex: 1 !important;
        min-width: 0 !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        color: #ffffff !important;
        font-size: 12px !important;
        outline: none !important;
      }
      .yk-dx-send-mini {
        background: rgba(250, 204, 21, 0.18);
        border: 1px solid rgba(250, 204, 21, 0.45);
        color: #fde047;
        border-radius: 10px;
        padding: 5px 9px;
        font-size: 11px;
        font-weight: 900;
        cursor: pointer;
        flex-shrink: 0;
      }
      .yk-dx-shabash-btn {
        position: relative;
        height: 44px;
        padding: 0 14px;
        border-radius: 14px;
        border: 1.5px solid rgba(254, 240, 138, 0.6);
        background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%);
        color: #ffffff;
        font-size: 13px;
        font-weight: 900;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        box-shadow: 0 6px 18px rgba(225, 29, 72, 0.55);
        flex-shrink: 0;
      }
      .yk-dx-shabash-btn:active { transform: scale(0.94); }
      .yk-dx-shabash-badge {
        position: absolute;
        top: -6px;
        left: -5px;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        background: #22c55e;
        border: 1.5px solid #fff;
        color: #fff;
        font-size: 10px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .yk-dx-gift-drawer {
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 66px;
        z-index: 35;
        background: rgba(16, 8, 16, 0.95);
        backdrop-filter: blur(18px);
        border: 1.5px solid rgba(250, 204, 21, 0.55);
        border-radius: 20px;
        padding: 12px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85);
      }
      .yk-dx-gift-drawer.hidden { display: none !important; }
      .yk-dx-gift-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-top: 8px;
      }
      .yk-dx-gift-item {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(250, 204, 21, 0.25);
        border-radius: 14px;
        padding: 8px 4px;
        text-align: center;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .yk-dx-gift-item:hover {
        border-color: #facc15;
        background: rgba(250, 204, 21, 0.14);
        transform: translateY(-2px);
      }
    `;
    document.head.appendChild(style);
  }

  window.showDiwexanEntrance = function (name, avatarUrl) {
    if (!name) return;
    entranceQueue.push({ name: String(name).trim(), avatarUrl: avatarUrl || '' });
    processEntranceQueue();
  };

  function processEntranceQueue() {
    if (isShowingEntrance || entranceQueue.length === 0) return;
    const stage = document.getElementById('ykDxEntranceStage');
    if (!stage) return;

    isShowingEntrance = true;
    const item = entranceQueue.shift();
    const initial = item.name.charAt(0) || '👑';
    const avatarHtml = item.avatarUrl
      ? `<img src="${item.avatarUrl}" alt="" />`
      : `<span>${initial}</span>`;

    stage.innerHTML = `
      <div class="yk-dx-entrance-pill">
        <div class="yk-dx-entrance-avatar">${avatarHtml}</div>
        <span>✨ ${item.name} هاتە ژوورەوە! 👑</span>
      </div>
    `;

    setTimeout(() => {
      stage.innerHTML = '';
      isShowingEntrance = false;
      processEntranceQueue();
    }, 3900);
  }

  function handleShabashClick() {
    if (typeof window.openGiftsModal === 'function') return window.openGiftsModal();
    if (typeof window.openGiftModal === 'function') return window.openGiftModal();
    if (typeof window.showGiftModal === 'function') return window.showGiftModal();
    const drawer = document.getElementById('ykDxGiftDrawer');
    if (drawer) drawer.classList.toggle('hidden');
  }

  window.sendQuickDiwexanShabash = function (giftName, icon) {
    const drawer = document.getElementById('ykDxGiftDrawer');
    if (drawer) drawer.classList.add('hidden');

    const input = document.getElementById('roomChatInput');
    if (input && typeof window.sendRoomChatMessage === 'function') {
      input.value = `${icon} شاباشی ${giftName} بۆ دیوەخان! ✨`;
      window.sendRoomChatMessage();
    }
    const uName = (typeof playerName !== 'undefined' && playerName) ? playerName : 'میوان';
    window.showDiwexanEntrance(`${uName} • شاباشی ${giftName} ${icon}`);
  };

  function decorateSeatsGrid() {
    const grid = document.getElementById('roomSeatsGrid');
    const panel = document.getElementById('insideRoomPanel');
    if (!grid || !panel || panel.classList.contains('hidden')) return;

    // ڕاگرتنی کاتی چاودێرەکە پێش دەستکاریکردنی DOM تا هەرگیز لۆپ دروست نەبێت
    if (seatsObserver) seatsObserver.disconnect();
    try {
      grid.querySelectorAll('[data-yk-empty="1"]').forEach(el => el.remove());

      const realSeats = Array.from(grid.children);
      const countEl = document.getElementById('ykDxMemberCount');
      if (countEl) countEl.textContent = Math.max(1, realSeats.length);

      realSeats.forEach((seat, idx) => {
        const rawText = (seat.textContent || '').trim().split('\n')[0].trim();
        const img = seat.querySelector('img');
        const avatarSrc = img ? img.src : '';

        if (idx === 0 && rawText) {
          const hostNameEl = document.getElementById('ykDxHostName');
          const hostAvatarEl = document.getElementById('ykDxHostAvatar');
          if (hostNameEl) hostNameEl.innerHTML = `${rawText} <span style="color:#38bdf8;">✔</span>`;
          if (hostAvatarEl) {
            hostAvatarEl.innerHTML = avatarSrc ? `<img src="${avatarSrc}" alt="" />` : rawText.charAt(0);
          }
        }

        if (rawText && !seenMembers.has(rawText)) {
          seenMembers.add(rawText);
          window.showDiwexanEntrance(rawText, avatarSrc);
        }

        if (!seat.querySelector('.yk-dx-role-chip') && idx < 4) {
          const chip = document.createElement('span');
          chip.className = 'yk-dx-role-chip ' + (idx === 0 ? 'yk-dx-role-cohost' : 'yk-dx-role-elder');
          chip.textContent = idx === 0 ? 'هاوخاوەن' : 'ڕیش‌سپی';
          seat.prepend(chip);
        }
      });

      const needed = Math.max(0, 10 - realSeats.length);
      for (let i = 0; i < needed; i++) {
        const empty = document.createElement('div');
        empty.setAttribute('data-yk-empty', '1');
        empty.className = 'yk-dx-empty-seat';
        empty.innerHTML = `<div class="yk-dx-plus-circle">+</div><span style="font-size:9px;color:#cbd5e1;font-weight:700;">بۆش</span>`;
        empty.onclick = function () {
          if (typeof toggleRoomMicrophone === 'function') toggleRoomMicrophone();
        };
        grid.appendChild(empty);
      }
    } finally {
      if (seatsObserver) seatsObserver.observe(grid, { childList: true });
    }
  }

  function decorateChatMessages() {
    const chatBox = document.getElementById('roomChatMessages');
    if (!chatBox) return;
    Array.from(chatBox.children).forEach(msg => {
      const txt = msg.textContent || '';
      if (txt.includes('شاباش') || txt.includes('دیاری') || txt.includes('هەنار') || txt.includes('دەف')) {
        msg.classList.add('yk-dx-gift-msg');
      }
    });
  }

  function buildDiwexanShell() {
    if (isBuilt) return;
    const panel = document.getElementById('insideRoomPanel');
    const titleEl = document.getElementById('currentRoomTitle');
    const seatsGrid = document.getElementById('roomSeatsGrid');
    const chatMessages = document.getElementById('roomChatMessages');
    const chatInput = document.getElementById('roomChatInput');
    const micBtn = document.getElementById('roomMicToggleBtn');
    const speakerBtn = document.getElementById('roomSpeakerToggleBtn');
    if (!panel || !titleEl || !seatsGrid || !chatMessages || !chatInput) return;

    isBuilt = true;
    panel.classList.add('yk-diwexan-stage');

    const shell = document.createElement('div');
    shell.className = 'yk-dx-shell';
    shell.innerHTML = `
      <div class="yk-dx-topbar">
        <button type="button" class="yk-dx-circle-btn" title="دەرچوون" onclick="if(typeof leaveVoiceRoom==='function'){leaveVoiceRoom();}">➜</button>

        <div class="yk-dx-title-pill">
          <div class="yk-dx-shield">
            <span>👑</span>
            <span id="ykDxRoomLvl">44</span>
          </div>
          <div class="yk-dx-title-text" id="ykDxTitleSlot">
            <div class="yk-dx-sub-meta">
              <span>💎 ئەڵماس</span>
              <span>•</span>
              <span>🎧 <strong id="ykDxMemberCount">1</strong></span>
            </div>
          </div>
          <div id="ykDxMiniHost" class="yk-dx-mini-host-dot">ک</div>
        </div>

        <button type="button" id="ykDxSpeakerProxy" class="yk-dx-circle-btn" title="دەنگ">🔊</button>
      </div>

      <div class="yk-dx-citadel-banner">
        <div class="yk-dx-host-info">
          <div class="yk-dx-host-avatar-ring">
            <div id="ykDxHostAvatar" class="yk-dx-host-avatar">ک</div>
          </div>
          <div>
            <div id="ykDxHostName" class="yk-dx-host-name">خانەخوێ <span style="color:#38bdf8;">✔</span></div>
            <span class="yk-dx-host-tag">خانەخوێ</span>
          </div>
        </div>
        <div class="yk-dx-points-pill">
          <span id="ykDxRoomPoints">640</span>
          <span class="yk-dx-p-dot">P</span>
        </div>
      </div>

      <div id="ykDxSeatsSlot" class="yk-dx-seats-wrap"></div>
      <div id="ykDxEntranceStage" class="yk-dx-entrance-stage"></div>
      <div id="ykDxChatSlot" class="yk-dx-chat-wrap"></div>

      <div id="ykDxGiftDrawer" class="yk-dx-gift-drawer hidden">
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:900;color:#fde047;">
          <span>🎁 ناردنی شاباش بۆ دیوەخان</span>
          <button type="button" onclick="document.getElementById('ykDxGiftDrawer').classList.add('hidden')" style="background:none;border:none;color:#fff;font-size:15px;cursor:pointer;">✕</button>
        </div>
        <div class="yk-dx-gift-grid">
          <div class="yk-dx-gift-item" onclick="window.sendQuickDiwexanShabash('چای شاهانە', '☕')">
            <div style="font-size:24px;">☕</div>
            <div style="font-size:10px;color:#fff;font-weight:800;">چای شاهانە</div>
          </div>
          <div class="yk-dx-gift-item" onclick="window.sendQuickDiwexanShabash('هەنار', '🍎')">
            <div style="font-size:24px;">🍎</div>
            <div style="font-size:10px;color:#fff;font-weight:800;">هەنار</div>
          </div>
          <div class="yk-dx-gift-item" onclick="window.sendQuickDiwexanShabash('دەف', '🪘')">
            <div style="font-size:24px;">🪘</div>
            <div style="font-size:10px;color:#fff;font-weight:800;">دەف</div>
          </div>
          <div class="yk-dx-gift-item" onclick="window.sendQuickDiwexanShabash('تاجی زێڕین', '👑')">
            <div style="font-size:24px;">👑</div>
            <div style="font-size:10px;color:#fff;font-weight:800;">تاجی زێڕین</div>
          </div>
        </div>
      </div>

      <div class="yk-dx-bottombar">
        <div id="ykDxMicSlot" class="yk-dx-mic-wrap"></div>
        <div class="yk-dx-input-box" id="ykDxInputSlot">
          <button type="button" class="yk-dx-send-mini" onclick="if(typeof sendRoomChatMessage==='function'){sendRoomChatMessage();}">ناردن</button>
        </div>
        <button type="button" id="ykDxShabashBtn" class="yk-dx-shabash-btn">
          <span class="yk-dx-shabash-badge">5</span>
          <span>☕</span>
          <span>شاباش</span>
        </button>
      </div>
    `;

    shell.querySelector('#ykDxTitleSlot').prepend(titleEl);
    seatsGrid.className = 'yk-dx-seats-grid';
    shell.querySelector('#ykDxSeatsSlot').appendChild(seatsGrid);
    chatMessages.className = 'yk-dx-chat-list';
    shell.querySelector('#ykDxChatSlot').appendChild(chatMessages);
    chatInput.placeholder = 'بنووسە...';
    shell.querySelector('#ykDxInputSlot').prepend(chatInput);
    if (micBtn) shell.querySelector('#ykDxMicSlot').appendChild(micBtn);

    const speakerProxy = shell.querySelector('#ykDxSpeakerProxy');
    if (speakerProxy && speakerBtn) {
      speakerProxy.onclick = function () {
        speakerBtn.click();
        speakerProxy.textContent = speakerBtn.textContent.includes('🔇') ? '🔇' : '🔊';
      };
    }
    shell.querySelector('#ykDxShabashBtn').onclick = handleShabashClick;

    Array.from(panel.children).forEach(ch => { ch.style.display = 'none'; });
    panel.appendChild(shell);

    seatsObserver = new MutationObserver(decorateSeatsGrid);
    seatsObserver.observe(seatsGrid, { childList: true });
    new MutationObserver(decorateChatMessages).observe(chatMessages, { childList: true });

    const roomVisibilityObserver = new MutationObserver(() => {
      const isOpen = !panel.classList.contains('hidden');
      document.body.classList.toggle('yk-diwexan-fullscreen', isOpen);
      if (isOpen) {
        seenMembers.clear();
        const myName = (typeof playerName !== 'undefined' && playerName) ? playerName : '';
        const myAv = (typeof playerAvatarData !== 'undefined' && playerAvatarData) ? playerAvatarData : '';
        if (myName) {
          seenMembers.add(myName);
          setTimeout(() => window.showDiwexanEntrance(myName, myAv), 450);
        }
        setTimeout(decorateSeatsGrid, 350);
      }
    });
    roomVisibilityObserver.observe(panel, { attributes: true, attributeFilter: ['class'] });
  }

  function boot() {
    try {
      injectDiwexanStyles();
      buildDiwexanShell();
    } catch (err) {
      console.error('Diwexan UI error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();