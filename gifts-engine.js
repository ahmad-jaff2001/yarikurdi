const YK_GIFT_OWNER_EMAIL = 'ah6753038@gmail.com';
const YK_GIFT_OWNER_FALLBACK_UID = 'u_ahmadhassan';

(function loadLottieRuntime() {
  if (window.lottie || document.getElementById('ykLottieLib')) return;
  const s = document.createElement('script');
  s.id = 'ykLottieLib';
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
  s.async = true;
  document.head.appendChild(s);
})();

window.ROYAL_GIFTS_CATALOG = [
  { id: 'teapot', name: 'قۆری چا', icon: '🫖', videoUrl: 'gifts/teapot.webm', lottieUrl: 'gifts/teapot.json', thumb: 'gifts/teapot.jfif', soundUrl: 'gifts/teapot.mp3', cost: 6, xp: 15, cat: 'cheap', tier: 'classic', accent: '#f59e0b', vfx: 'steam' },
  { id: 'rose', name: 'گوڵی سوور', icon: '🌹', videoUrl: 'gifts/rose.webm', lottieUrl: 'gifts/rose.json', thumb: 'gifts/rose.jfif', soundUrl: 'gifts/rose.mp3', cost: 10, xp: 25, cat: 'cheap', tier: 'classic', accent: '#f43f5e', vfx: 'petals' },
  { id: 'lantern', name: 'فانۆسی زێڕین', icon: '🏮', videoUrl: 'gifts/lantern.webm', lottieUrl: 'gifts/lantern.json', thumb: 'gifts/lantern.jfif', soundUrl: 'gifts/lantern.mp3', cost: 16, xp: 35, cat: 'cheap', tier: 'classic', accent: '#fb923c', vfx: 'embers' },
  { id: 'crown', name: 'تاجی شاهانە', icon: '👑', videoUrl: 'gifts/crown.webm', lottieUrl: 'gifts/crown.json', thumb: 'gifts/crown.jfif', soundUrl: 'gifts/crown.mp3', cost: 50, xp: 90, cat: 'cheap', tier: 'royal', accent: '#facc15', vfx: 'diamonds' },
  { id: 'wolf', name: 'گورگ', icon: '🐺', videoUrl: 'gifts/wolf.webm', lottieUrl: 'gifts/wolf.json', thumb: 'gifts/wolf.jfif', soundUrl: 'gifts/wolf.mp3', cost: 250, xp: 400, cat: 'beasts', tier: 'royal', accent: '#38bdf8', vfx: 'frost' },
  { id: 'leopard', name: 'پڵنگ', icon: '🐆', videoUrl: 'gifts/leopard.webm', lottieUrl: 'gifts/leopard.json', thumb: 'gifts/leopard.jfif', soundUrl: 'gifts/leopard.mp3', cost: 400, xp: 650, cat: 'beasts', tier: 'royal', accent: '#fbbf24', vfx: 'slash' },
  { id: 'lion', name: 'شێری زێڕین', icon: '🦁', videoUrl: 'gifts/lion.webm', lottieUrl: 'gifts/lion.json', thumb: 'gifts/lion.jfif', soundUrl: 'gifts/lion.mp3', cost: 600, xp: 950, cat: 'beasts', tier: 'mythic', accent: '#f59e0b', vfx: 'solar' },
  { id: 'dragon', name: 'ئەژدیها', icon: '🐉', videoUrl: 'gifts/dragon.webm', lottieUrl: 'gifts/dragon.json', thumb: 'gifts/dragon.jfif', soundUrl: 'gifts/dragon.mp3', cost: 1500, xp: 2300, cat: 'beasts', tier: 'mythic', accent: '#ef4444', vfx: 'inferno' }
];

const YK_TIER_META = {
  classic: { label: 'کلاسیک', badge: 'bg-white/10 text-slate-200 border-white/20', glow: 'rgba(255,255,255,0.2)' },
  royal: { label: 'شاهانە', badge: 'bg-sky-500/20 text-sky-200 border-sky-400/45', glow: 'rgba(56,189,248,0.45)' },
  mythic: { label: 'ئەفسانەیی', badge: 'bg-amber-500/20 text-amber-200 border-amber-400/55', glow: 'rgba(251,191,36,0.65)' },
  legend: { label: 'VIP', badge: 'bg-fuchsia-500/25 text-fuchsia-200 border-fuchsia-400/65', glow: 'rgba(232,121,249,0.75)' }
};

let ykActiveLottieInstance = null;
let ykGiftOverlayTimer = null;
let ykGiftCanvasFrame = null;
let ykGiftAudioCtx = null;
const ykGiftQueue = [];
let ykIsPlayingGiftQueue = false;
const ykAssetProbeCache = new Map();
const ykActiveComboBanners = new Map();

function escapeGiftHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hexToRgba(hex, alpha) {
  const clean = (hex || '#facc15').replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const num = parseInt(full, 16);
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
}

function injectUltraGiftStyles() {
  if (document.getElementById('ykUltraGiftCss')) return;
  const st = document.createElement('style');
  st.id = 'ykUltraGiftCss';
  st.textContent = `
    @keyframes ykBannerSlideIn {
      0% { opacity: 0; transform: translateX(42px) scale(0.92); }
      100% { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes ykBannerFadeOut {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(-16px) scale(0.94); }
    }
    @keyframes ykComboPop {
      0% { transform: scale(1.65) rotate(-6deg); filter: brightness(1.5); }
      50% { transform: scale(0.92) rotate(2deg); }
      100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
    }
    @keyframes ykSheenSweep {
      0% { transform: translateX(150%) skewX(-24deg); }
      100% { transform: translateX(-180%) skewX(-24deg); }
    }
    @keyframes ykCinemaIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    @keyframes ykCinemaOut {
      0% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(1.06); filter: blur(6px); }
    }
    @keyframes ykCinemaShake {
      0%, 100% { transform: translate3d(0,0,0); }
      12% { transform: translate3d(-6px, 4px, 0); }
      24% { transform: translate3d(6px, -4px, 0); }
      36% { transform: translate3d(-4px, -3px, 0); }
      48% { transform: translate3d(4px, 3px, 0); }
      60% { transform: translate3d(-2px, 1px, 0); }
    }
    @keyframes ykHero3DEntrance {
      0% { opacity: 0; transform: perspective(900px) translateY(36px) scale(0.55) rotateX(18deg); filter: brightness(0.7); }
      24% { opacity: 1; transform: perspective(900px) translateY(-10px) scale(1.16) rotateX(-4deg); filter: brightness(1.3); }
      38% { transform: perspective(900px) translateY(0px) scale(1.04) rotateY(-6deg); filter: brightness(1.15); }
      54% { transform: perspective(900px) translateY(-6px) scale(1.1) rotateY(6deg); filter: brightness(1.22); }
      78% { transform: perspective(900px) translateY(-3px) scale(1.03) rotateY(0deg); filter: brightness(1.08); }
      100% { opacity: 1; transform: perspective(900px) translateY(0) scale(1) rotateX(0deg); filter: brightness(1); }
    }
    @keyframes ykPlateRise {
      0% { opacity: 0; transform: translate(-50%, 30px) scale(0.92); }
      100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
    }
    .yk-blend-screen {
      mix-blend-mode: screen;
    }
    .yk-gift-card {
      position: relative;
      overflow: hidden;
      background: linear-gradient(165deg, rgba(255,255,255,0.07) 0%, rgba(10,12,24,0.82) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), border-color 0.22s ease, box-shadow 0.22s ease;
    }
    .yk-gift-card:hover {
      transform: translateY(-2px);
    }
    .yk-gift-card:active {
      transform: scale(0.95);
    }
    .yk-gift-card-selected {
      background: linear-gradient(165deg, rgba(251,191,36,0.24) 0%, rgba(20,14,8,0.92) 100%);
      border-color: rgba(253,224,71,0.95) !important;
      box-shadow: 0 0 26px rgba(250,204,21,0.38), inset 0 1px 0 rgba(255,255,255,0.3);
    }
    .yk-gift-card-selected::after {
      content: '';
      position: absolute;
      inset: 0;
      width: 45%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
      animation: ykSheenSweep 2.2s ease-in-out infinite;
      pointer-events: none;
    }
    .yk-gift-banner-item {
      position: relative;
      overflow: hidden;
      background: linear-gradient(115deg, rgba(12,14,26,0.92) 0%, rgba(30,18,44,0.86) 55%, rgba(12,14,26,0.78) 100%);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      animation: ykBannerSlideIn 0.34s cubic-bezier(0.16,1,0.3,1) forwards;
    }
    .yk-gift-banner-item::before {
      content: '';
      position: absolute;
      inset: 0;
      width: 36%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
      animation: ykSheenSweep 2.6s ease-in-out infinite;
      pointer-events: none;
    }
    .yk-gift-banner-leaving {
      animation: ykBannerFadeOut 0.32s ease forwards;
    }
    .yk-gift-combo-num {
      display: inline-block;
      animation: ykComboPop 0.36s cubic-bezier(0.22,1,0.36,1);
    }
    .yk-cinema-in {
      animation: ykCinemaIn 0.35s ease forwards;
    }
    .yk-cinema-out {
      animation: ykCinemaOut 0.42s ease forwards;
    }
    .yk-cinema-shake {
      animation: ykCinemaShake 0.65s cubic-bezier(0.36,0.07,0.19,0.97) 0.12s;
    }
    .yk-hero-3d-art {
      animation: ykHero3DEntrance 2.8s cubic-bezier(0.22,1,0.36,1) forwards;
      will-change: transform, filter;
    }
    .yk-vip-plate {
      animation: ykPlateRise 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
      background: linear-gradient(135deg, rgba(8,10,20,0.92) 0%, rgba(28,18,44,0.88) 100%);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  `;
  document.head.appendChild(st);
}

async function playUltraGiftAudio(giftId, tier, soundUrl) {
  const hasCustomMp3 = await probeAssetExists(soundUrl);
  if (hasCustomMp3) {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.9;
      await audio.play();
      return;
    } catch (e) {}
  }

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!ykGiftAudioCtx) ykGiftAudioCtx = new AudioCtx();
    if (ykGiftAudioCtx.state === 'suspended') ykGiftAudioCtx.resume();
    const ctx = ykGiftAudioCtx;
    const now = ctx.currentTime;

    if (giftId === 'lion' || giftId === 'dragon' || giftId === 'leopard') {
      const bufferSize = ctx.sampleRate * 1.6;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(giftId === 'dragon' ? 420 : 280, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(110, now + 1.5);
      noiseFilter.Q.value = 1.8;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.26, now + 0.16);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lowpass = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(giftId === 'dragon' ? 88 : 132, now);
      osc1.frequency.linearRampToValueAtTime(giftId === 'dragon' ? 148 : 184, now + 0.22);
      osc1.frequency.exponentialRampToValueAtTime(42, now + 1.5);

      osc2.frequency.setValueAtTime(64, now);
      osc2.frequency.exponentialRampToValueAtTime(30, now + 1.5);

      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(560, now);
      lowpass.frequency.exponentialRampToValueAtTime(140, now + 1.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.55);

      osc1.connect(lowpass);
      osc2.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.6);
      osc2.stop(now + 1.6);
      return;
    }

    if (giftId === 'wolf') {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(495, now + 0.48);
      osc.frequency.exponentialRampToValueAtTime(295, now + 1.55);

      lfo.frequency.value = 6.5;
      lfoGain.gain.value = 12;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      lfo.start(now);
      osc.stop(now + 1.65);
      lfo.stop(now + 1.65);
      return;
    }

    const chords = {
      classic: [523.25, 659.25, 783.99, 1046.5],
      royal: [392.0, 493.88, 587.33, 783.99, 987.77],
      mythic: [261.63, 329.63, 392.0, 523.25, 659.25]
    };
    const notes = chords[tier] || chords.classic;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      const t = now + idx * 0.068;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.075, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + 0.95);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 1.0);
    });
  } catch (e) {}
}

function startSignatureVfxCanvas(canvas, accentHex, vfxType) {
  stopGiftCinemaCanvas();
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  ctx.scale(dpr, dpr);

  const cx = w / 2;
  const cy = h * 0.44;
  const startTs = performance.now();
  const count = (vfxType === 'inferno' || vfxType === 'solar') ? 95 : 58;

  const particles = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (vfxType === 'slash' ? 4.2 : 2.2) * Math.random() + 0.5;
    return {
      x: (vfxType === 'petals' || vfxType === 'frost') ? Math.random() * w : cx + (Math.random() - 0.5) * 44,
      y: (vfxType === 'petals' || vfxType === 'frost') ? Math.random() * h * 0.5 : (vfxType === 'inferno' || vfxType === 'embers' || vfxType === 'steam' ? cy + 80 + Math.random() * 120 : cy + (Math.random() - 0.5) * 44),
      vx: (vfxType === 'petals' || vfxType === 'frost') ? (Math.random() - 0.5) * 1.4 : Math.cos(angle) * speed,
      vy: (vfxType === 'inferno' || vfxType === 'embers' || vfxType === 'steam') ? -(Math.random() * 2.8 + 0.9) : (vfxType === 'petals' || vfxType === 'frost' ? Math.random() * 1.6 + 0.6 : Math.sin(angle) * speed),
      r: Math.random() * 3.2 + 1.1,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.08,
      life: Math.random() * 0.55 + 0.55,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.38
    };
  });

  function drawStar(x, y, rad, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(255, 250, 210, ${alpha})`;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(0, -rad * 2.4);
      ctx.lineTo(rad * 0.45, -rad * 0.45);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function draw(now) {
    const elapsed = now - startTs;
    ctx.clearRect(0, 0, w, h);

    const pulse = 0.24 + 0.09 * Math.sin(elapsed * 0.006);
    const auraR = Math.min(w, h) * ((vfxType === 'inferno' || vfxType === 'solar') ? 0.48 : 0.38);
    const aura = ctx.createRadialGradient(cx, cy, 12, cx, cy, auraR);
    aura.addColorStop(0, hexToRgba(accentHex, pulse));
    aura.addColorStop(0.55, hexToRgba(accentHex, pulse * 0.25));
    aura.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
    ctx.fill();

    if (vfxType === 'solar' || vfxType === 'inferno' || vfxType === 'diamonds') {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 0.00045);
      const rays = vfxType === 'solar' ? 14 : 10;
      for (let i = 0; i < rays; i++) {
        ctx.rotate((Math.PI * 2) / rays);
        const rayGrad = ctx.createLinearGradient(0, 0, 0, -auraR * 1.15);
        rayGrad.addColorStop(0, hexToRgba(accentHex, 0.16));
        rayGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(-4, 0);
        ctx.lineTo(4, 0);
        ctx.lineTo(26, -auraR * 1.15);
        ctx.lineTo(-26, -auraR * 1.15);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    if (vfxType === 'solar' || vfxType === 'inferno' || vfxType === 'slash') {
      [0, 260].forEach(delay => {
        const t = (elapsed - delay) / 1100;
        if (t > 0 && t < 1) {
          const eased = 1 - Math.pow(1 - t, 3);
          const rad = 28 + Math.min(w, h) * 0.46 * eased;
          ctx.strokeStyle = hexToRgba(accentHex, (1 - t) * 0.65);
          ctx.lineWidth = 3 * (1 - t * 0.6);
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.phase += 0.08;
      if (vfxType === 'steam') p.vx += Math.sin(p.phase) * 0.04;
      const fade = Math.max(0, 1 - elapsed / (3200 * p.life));
      const flicker = 0.45 + 0.55 * Math.abs(Math.sin(p.phase));
      const alpha = fade * flicker;
      if (alpha <= 0.02) continue;

      if (vfxType === 'diamonds') {
        drawStar(p.x, p.y, p.r, alpha);
      } else if (vfxType === 'petals') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `rgba(244, 63, 94, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r * 2.4, p.r * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        const col = p.gold ? `rgba(254, 240, 138, ${alpha})` : hexToRgba(accentHex, alpha);
        const glow = ctx.createRadialGradient(p.x, p.y, 0.2, p.x, p.y, p.r * 3.8);
        glow.addColorStop(0, col);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ykGiftCanvasFrame = requestAnimationFrame(draw);
  }

  ykGiftCanvasFrame = requestAnimationFrame(draw);
}

function stopGiftCinemaCanvas() {
  if (ykGiftCanvasFrame) {
    cancelAnimationFrame(ykGiftCanvasFrame);
    ykGiftCanvasFrame = null;
  }
}

async function probeAssetExists(url) {
  if (!url) return false;
  if (ykAssetProbeCache.has(url)) return ykAssetProbeCache.get(url);
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const ok = res.ok;
    ykAssetProbeCache.set(url, ok);
    return ok;
  } catch (e) {
    ykAssetProbeCache.set(url, false);
    return false;
  }
}

function showStackingGiftBanner(g, catalogItem) {
  const hostBox = document.getElementById('ykVip_FloatingGiftBanner');
  if (!hostBox) return;

  let stackWrap = document.getElementById('ykProGiftBannerStack');
  if (!stackWrap) {
    hostBox.innerHTML = '';
    stackWrap = document.createElement('div');
    stackWrap.id = 'ykProGiftBannerStack';
    stackWrap.className = 'flex flex-col gap-1.5 w-full max-w-[295px] pointer-events-none';
    hostBox.appendChild(stackWrap);
  }

  const accent = catalogItem.accent || '#facc15';
  const key = `${g.senderId || g.senderName}_${g.giftId}_${g.targetName}`;
  const existing = ykActiveComboBanners.get(key);

  if (existing && existing.el && existing.el.isConnected) {
    clearTimeout(existing.timer);
    existing.totalQty += Number(g.qty) || 1;
    const numEl = existing.el.querySelector('.yk-gift-combo-num');
    if (numEl) {
      numEl.classList.remove('yk-gift-combo-num');
      void numEl.offsetWidth;
      numEl.textContent = `x${existing.totalQty}`;
      numEl.classList.add('yk-gift-combo-num');
    }
    existing.timer = setTimeout(() => removeComboBanner(key), 4200);
    return;
  }

  if (stackWrap.children.length >= 2) {
    const oldestKey = ykActiveComboBanners.keys().next().value;
    if (oldestKey) removeComboBanner(oldestKey);
  }

  const card = document.createElement('div');
  card.className = 'yk-gift-banner-item inline-flex items-center justify-between gap-2 pl-3 pr-1.5 py-1.5 rounded-full shadow-2xl';
  card.style.border = `1px solid ${hexToRgba(accent, 0.72)}`;
  card.style.boxShadow = `0 10px 28px rgba(0,0,0,0.52), 0 0 22px ${hexToRgba(accent, 0.32)}`;

  const safeSender = escapeGiftHtml(g.senderName || 'میوان');
  const safeTarget = escapeGiftHtml(g.targetName || 'دیوەخان');
  const safeGift = escapeGiftHtml(g.giftName || catalogItem.name || 'دیاری');
  const thumbHtml = catalogItem.thumb
    ? `<img src="${catalogItem.thumb}" class="w-9 h-9 object-contain yk-blend-screen" onerror="this.style.display='none';this.nextElementSibling.style.display='inline';" /><span style="display:none;" class="text-2xl leading-none">${catalogItem.icon || '🎁'}</span>`
    : `<span class="text-2xl leading-none">${catalogItem.icon || '🎁'}</span>`;

  card.innerHTML = `
    <div class="flex items-center gap-2 min-w-0">
      <div class="w-8 h-8 rounded-full bg-slate-900 overflow-hidden flex items-center justify-center text-xs font-black text-white shrink-0" style="border: 1.5px solid ${accent};">
        ${g.senderAvatar ? `<img src="${g.senderAvatar}" class="w-full h-full object-cover" />` : safeSender[0]}
      </div>
      <div class="text-right leading-tight min-w-0">
        <div class="text-[11px] font-black text-white truncate max-w-[115px]">${safeSender}</div>
        <div class="text-[9px] font-bold text-slate-300 truncate max-w-[128px]">${safeGift} ➔ <span style="color:${accent};">@${safeTarget}</span></div>
      </div>
    </div>
    <div class="flex items-center gap-1.5 shrink-0">
      ${thumbHtml}
      <span class="yk-gift-combo-num text-base font-black italic tracking-tight" style="color:${accent}; text-shadow: 0 2px 12px ${hexToRgba(accent, 0.8)};">x${Number(g.qty) || 1}</span>
    </div>
  `;

  stackWrap.appendChild(card);
  const timer = setTimeout(() => removeComboBanner(key), 4200);
  ykActiveComboBanners.set(key, { el: card, totalQty: Number(g.qty) || 1, timer });
}

function removeComboBanner(key) {
  const entry = ykActiveComboBanners.get(key);
  if (!entry) return;
  clearTimeout(entry.timer);
  ykActiveComboBanners.delete(key);
  if (entry.el && entry.el.isConnected) {
    entry.el.classList.add('yk-gift-banner-leaving');
    setTimeout(() => {
      if (entry.el && entry.el.isConnected) entry.el.remove();
    }, 320);
  }
}

window.renderGiftsCatalogGrid = function () {
  injectUltraGiftStyles();
  const grid = document.getElementById('ykVip_GiftsGrid');
  if (!grid) return;

  const cat = typeof selectedGiftCat !== 'undefined' ? selectedGiftCat : 'all';
  const curId = typeof selectedGiftId !== 'undefined' ? selectedGiftId : 'teapot';
  const list = cat === 'all'
    ? window.ROYAL_GIFTS_CATALOG
    : window.ROYAL_GIFTS_CATALOG.filter(g => g.cat === cat);

  grid.innerHTML = list.map(g => {
    const isSel = g.id === curId;
    const tierInfo = YK_TIER_META[g.tier] || YK_TIER_META.classic;
    return `
      <div onclick="selectGiftItem('${g.id}')"
        class="yk-gift-card cursor-pointer rounded-2xl p-2 flex flex-col items-center justify-between text-center gap-1 border ${isSel ? 'yk-gift-card-selected' : 'border-white/10 hover:border-white/25'}">
        <div class="absolute top-0 inset-x-4 h-[2px] rounded-full opacity-75" style="background: linear-gradient(90deg, transparent, ${g.accent}, transparent);"></div>
        <div class="w-full flex items-center justify-between px-0.5">
          <span class="px-1.5 py-[1px] rounded-full text-[8px] font-black border ${tierInfo.badge}">${tierInfo.label}</span>
          <span class="text-[8px] font-mono text-slate-400">+${g.xp}xp</span>
        </div>
        <div class="relative w-full aspect-[4/3] rounded-xl flex items-center justify-center overflow-hidden"
          style="background: radial-gradient(circle, ${hexToRgba(g.accent, 0.14)} 0%, rgba(0,0,0,0) 70%);">
          ${g.thumb ? `<img src="${g.thumb}" alt="${escapeGiftHtml(g.name)}" class="w-16 h-16 object-contain yk-blend-screen" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />` : ''}
          <div style="${g.thumb ? 'display:none;' : 'display:flex;'}" class="w-full h-full items-center justify-center text-3xl">${g.icon}</div>
        </div>
        <div class="text-[10px] font-black text-white truncate w-full leading-tight">${escapeGiftHtml(g.name)}</div>
        <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/50 border border-white/10 text-[10px] font-black text-yellow-300">
          <span>🪙</span>
          <span>${g.cost.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');

  if (typeof updateSelectedGiftCostHint === 'function') updateSelectedGiftCostHint();
};

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
    videoUrl: gift.videoUrl || '',
    lottieUrl: gift.lottieUrl || '',
    soundUrl: gift.soundUrl || '',
    vfx: gift.vfx || 'embers',
    qty,
    coins: totalCost,
    recipientShare: recipientHalf,
    tier: gift.tier || 'classic',
    accent: gift.accent || '#facc15',
    ts: Date.now()
  };

  db.ref(`voiceRooms/${currentVoiceRoomId}/chat`).push(giftPayload);
  db.ref(`voiceRooms/${currentVoiceRoomId}/liveGifts`).push(giftPayload);

  if (typeof closeGiftDrawerModal === 'function') closeGiftDrawerModal();
  if (typeof showComboButton === 'function') showComboButton(gift.id, qty);
};

window.triggerFullScreenGiftAnimation = function (g) {
  injectUltraGiftStyles();
  const catalogMatch = window.ROYAL_GIFTS_CATALOG.find(item => item.id === g.giftId) || {
    id: g.giftId || 'gift',
    name: g.giftName || 'دیاری',
    icon: g.giftIcon || '🎁',
    thumb: g.giftId ? `gifts/${g.giftId}.jfif` : '',
    soundUrl: g.giftId ? `gifts/${g.giftId}.mp3` : '',
    vfx: g.vfx || 'embers',
    tier: g.tier || 'classic',
    accent: g.accent || '#facc15',
    cost: Number(g.coins) || 10
  };

  showStackingGiftBanner(g, catalogMatch);
  ykGiftQueue.push({ payload: g, item: catalogMatch });
  processGiftAnimationQueue();
};

async function processGiftAnimationQueue() {
  if (ykIsPlayingGiftQueue || ykGiftQueue.length === 0) return;
  ykIsPlayingGiftQueue = true;

  const { payload: g, item } = ykGiftQueue.shift();
  const overlay = document.getElementById('ykVip_FullGiftOverlay');
  if (!overlay) {
    ykIsPlayingGiftQueue = false;
    return;
  }

  const videoUrl = g.videoUrl || item.videoUrl || '';
  const lottieUrl = g.lottieUrl || item.lottieUrl || '';
  const soundUrl = g.soundUrl || item.soundUrl || '';
  const tier = g.tier || item.tier || 'classic';
  const accent = g.accent || item.accent || '#facc15';
  const vfx = g.vfx || item.vfx || 'embers';
  const tierInfo = YK_TIER_META[tier] || YK_TIER_META.classic;
  const icon = g.giftIcon || item.icon || '🎁';
  const thumb = item.thumb || '';

  const hasVideo = await probeAssetExists(videoUrl);
  const hasLottie = !hasVideo && window.lottie ? await probeAssetExists(lottieUrl) : false;

  playUltraGiftAudio(item.id || g.giftId, tier, soundUrl);

  await playUltraCinemaStage(overlay, {
    g,
    item,
    tier,
    tierInfo,
    accent,
    vfx,
    icon,
    thumb,
    videoUrl: hasVideo ? videoUrl : '',
    lottieUrl: hasLottie ? lottieUrl : ''
  });

  ykIsPlayingGiftQueue = false;
  processGiftAnimationQueue();
}

function playUltraCinemaStage(overlay, cfg) {
  return new Promise(async resolve => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      if (ykGiftOverlayTimer) {
        clearTimeout(ykGiftOverlayTimer);
        ykGiftOverlayTimer = null;
      }
      const rootStage = overlay.querySelector('#ykUltraCinemaWrap');
      if (rootStage) rootStage.classList.add('yk-cinema-out');

      setTimeout(() => {
        stopGiftCinemaCanvas();
        if (ykActiveLottieInstance) {
          try { ykActiveLottieInstance.destroy(); } catch (e) {}
          ykActiveLottieInstance = null;
        }
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        overlay.innerHTML = '';
        resolve();
      }, 400);
    };

    const safeSender = escapeGiftHtml(cfg.g.senderName || 'میوان');
    const safeTarget = escapeGiftHtml(cfg.g.targetName || 'دیوەخان');
    const safeGift = escapeGiftHtml(cfg.g.giftName || cfg.item.name || 'دیاری');
    const isHeavyBeast = cfg.tier === 'mythic' || cfg.item.id === 'leopard' || cfg.item.id === 'wolf';

    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    overlay.innerHTML = `
      <div id="ykUltraCinemaWrap" class="yk-cinema-in ${isHeavyBeast ? 'yk-cinema-shake' : ''} fixed inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none"
        style="background: radial-gradient(circle at center, rgba(0,0,0,0) 32%, rgba(0,0,0,${isHeavyBeast ? '0.68' : '0.35'}) 100%);">
        <canvas id="ykGiftCinemaCanvas" class="fixed inset-0 w-full h-full pointer-events-none"></canvas>
        <div id="ykRealAnimStage" class="relative z-10 w-full h-full flex items-center justify-center pointer-events-none px-4"></div>
        <div class="yk-vip-plate fixed bottom-28 left-1/2 z-20 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-2xl whitespace-nowrap"
          style="border: 1.5px solid ${hexToRgba(cfg.accent, 0.78)}; box-shadow: 0 14px 38px rgba(0,0,0,0.65), 0 0 28px ${hexToRgba(cfg.accent, 0.4)};">
          <span class="px-2 py-0.5 rounded-full text-[9px] font-black border ${cfg.tierInfo.badge}">${cfg.tierInfo.label}</span>
          <span class="text-xs sm:text-sm font-black" style="color:${cfg.accent};">${safeGift} x${Number(cfg.g.qty) || 1}</span>
          <span class="text-[11px] font-bold text-slate-200">${safeSender} ➔ <strong class="text-white">@${safeTarget}</strong></span>
        </div>
      </div>
    `;

    startSignatureVfxCanvas(document.getElementById('ykGiftCinemaCanvas'), cfg.accent, cfg.vfx);
    const stage = document.getElementById('ykRealAnimStage');

    if (cfg.videoUrl) {
      stage.innerHTML = `<video id="ykGiftAlphaVideo" src="${cfg.videoUrl}" autoplay playsinline class="w-full h-full max-w-lg max-h-[78dvh] object-contain yk-blend-screen pointer-events-none"></video>`;
      const vid = document.getElementById('ykGiftAlphaVideo');
      vid.onended = finish;
      vid.onerror = finish;
      vid.play().catch(() => {
        vid.muted = true;
        vid.play().catch(finish);
      });
      ykGiftOverlayTimer = setTimeout(finish, 8500);
      return;
    }

    if (cfg.lottieUrl && window.lottie) {
      try {
        const res = await fetch(cfg.lottieUrl);
        if (res.ok) {
          const animData = await res.json();
          stage.innerHTML = `<div id="ykLottieBox" class="w-[88vw] max-w-[420px] h-[64dvh]"></div>`;
          ykActiveLottieInstance = window.lottie.loadAnimation({
            container: document.getElementById('ykLottieBox'),
            renderer: 'svg',
            loop: false,
            autoplay: true,
            animationData: animData
          });
          ykActiveLottieInstance.addEventListener('complete', finish);
          ykGiftOverlayTimer = setTimeout(finish, 7000);
          return;
        }
      } catch (e) {}
    }

    stage.innerHTML = `
      <div class="yk-hero-3d-art relative flex items-center justify-center">
        ${cfg.thumb
          ? `<img src="${cfg.thumb}" class="w-72 h-72 sm:w-96 sm:h-96 object-contain yk-blend-screen" style="filter: drop-shadow(0 0 32px ${hexToRgba(cfg.accent, 0.55)});" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" /><span style="display:none;" class="text-8xl">${cfg.icon}</span>`
          : `<span class="text-8xl">${cfg.icon}</span>`
        }
      </div>
    `;
    const duration = cfg.tier === 'mythic' ? 3400 : (cfg.tier === 'royal' ? 2800 : 2100);
    ykGiftOverlayTimer = setTimeout(finish, duration);
  });
}

(function initUltraGiftEngine() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectUltraGiftStyles);
  } else {
    injectUltraGiftStyles();
  }
})();