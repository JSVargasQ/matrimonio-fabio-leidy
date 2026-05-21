/* =============================================
   main.js — Fabio & Leidy Wedding Invitation
   ============================================= */

/* ---------- CAPACIDAD DEL DEVICE ---------- */
const IS_MOBILE      = window.matchMedia('(max-width: 640px)').matches;
const IS_LOW_END     = navigator.hardwareConcurrency != null && navigator.hardwareConcurrency <= 4;
const REDUCE_FX      = IS_MOBILE || IS_LOW_END;

/* ---------- INVITADOS ----------
   La lista vive en guests.js (cargado antes de main.js)
   GUEST_LIST[codigo] = { family: '...', guests: ['Nombre 1', ...] }
   ---------------------------------------- */
function resolveGuest() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return null;
  const entry = (typeof GUEST_LIST !== 'undefined') ? GUEST_LIST[code.toUpperCase()] : null;
  if (!entry) return null;
  return {
    name:   entry.family,
    guests: entry.guests || [],
    seats:  entry.seats || (entry.guests || []).length,
  };
}

function guestSeatsMessage(seats) {
  if (seats === 1) return 'Te esperamos 💛';
  return `Te esperamos a ti y tu familia · <strong>${seats} personas</strong> 💛`;
}

function createWelcomeFireflies() {
  const container = document.getElementById('welcome-fireflies');
  if (!container) return;
  const colors = ['#E8A838', '#E84C7D', '#7B2FBE'];
  const ffCount = REDUCE_FX ? 6 : 14;
  for (let i = 0; i < ffCount; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (color === '#E84C7D') ff.classList.add('firefly--pink');
    else if (color === '#7B2FBE') ff.classList.add('firefly--purple');
    const dx  = (Math.random() - 0.5) * 100;
    const dy  = -(Math.random() * 80 + 20);
    const dx2 = (Math.random() - 0.5) * 70;
    const dy2 = -(Math.random() * 100 + 40);
    ff.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 90 + 5}%;
      --dur:${(Math.random() * 5 + 4).toFixed(1)}s;
      --delay:${(Math.random() * 5).toFixed(1)}s;
      --dx:${dx.toFixed(0)}px; --dy:${dy.toFixed(0)}px;
      --dx2:${dx2.toFixed(0)}px; --dy2:${dy2.toFixed(0)}px;
    `;
    container.appendChild(ff);
  }
}

function showGate() {
  const gate = document.getElementById('guest-gate');
  if (!gate) return;
  gate.hidden = false;
  document.body.style.overflow = 'hidden';

  /* Luciérnagas en el gate */
  const container = document.getElementById('gate-fireflies');
  if (container) {
    const colors = ['', 'firefly--pink', 'firefly--purple'];
    const gateCount = REDUCE_FX ? 5 : 12;
    for (let i = 0; i < gateCount; i++) {
      const ff = document.createElement('div');
      ff.className = 'firefly';
      const c = colors[Math.floor(Math.random() * colors.length)];
      if (c) ff.classList.add(c);
      const dx = (Math.random() - 0.5) * 90, dy = -(Math.random() * 70 + 20);
      const dx2 = (Math.random() - 0.5) * 60, dy2 = -(Math.random() * 90 + 40);
      ff.style.cssText = `
        left:${Math.random()*100}%; top:${Math.random()*90+5}%;
        --dur:${(Math.random()*5+4).toFixed(1)}s; --delay:${(Math.random()*5).toFixed(1)}s;
        --dx:${dx.toFixed(0)}px; --dy:${dy.toFixed(0)}px;
        --dx2:${dx2.toFixed(0)}px; --dy2:${dy2.toFixed(0)}px;
      `;
      container.appendChild(ff);
    }
  }
}

function applyGuest() {
  const code  = new URLSearchParams(window.location.search).get('code');
  const guest = resolveGuest();

  if (!code || !guest) {
    showGate();
    return;
  }

  const welcome   = document.getElementById('guest-welcome');
  const nameEl    = document.getElementById('guest-name');
  const messageEl = document.getElementById('guest-message');
  const openBtn   = document.getElementById('guest-open-btn');
  if (!welcome || !nameEl || !messageEl) return;

  nameEl.textContent  = guest.name;
  messageEl.innerHTML = guestSeatsMessage(guest.seats);

  /* Poblar lista de invitados individuales */
  const listEl = document.getElementById('guest-list');
  if (listEl) {
    const allGuests = [...guest.guests];
    /* Completar puestos sin nombre (hijos, acompañantes sin identificar) */
    const unnamed = guest.seats - allGuests.length;
    for (let i = 0; i < unnamed; i++) {
      allGuests.push('Acompañante');
    }
    listEl.innerHTML = allGuests.map(n => `<li>${n}</li>`).join('');
  }

  welcome.hidden = false;
  document.body.style.overflow = 'hidden';

  createWelcomeFireflies();

  /* Animación de entrada con GSAP (si está disponible) o CSS fallback */
  function animateWelcomeIn() {
    if (typeof gsap !== 'undefined') {
      gsap.to('.guest-welcome__card', {
        opacity: 1, scale: 1, y: 0,
        duration: 1, ease: 'power3.out', delay: 0.2,
      });
    } else {
      const card = document.querySelector('.guest-welcome__card');
      if (card) { card.style.opacity = '1'; card.style.transform = 'none'; }
    }
  }

  /* Cerrar la bienvenida al hacer click en el botón */
  function dismissWelcome() {
    if (typeof gsap !== 'undefined') {
      gsap.to('.guest-welcome__card', {
        opacity: 0, scale: 0.92, y: -30,
        duration: 0.55, ease: 'power2.in',
      });
      gsap.to('.guest-welcome', {
        opacity: 0, duration: 0.7, delay: 0.25, ease: 'power2.in',
        onComplete: () => {
          welcome.hidden = true;
          document.body.style.overflow = '';
        },
      });
    } else {
      welcome.hidden = true;
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', dismissWelcome);

  /* Cerrar con ESC */
  const escHandler = (e) => {
    if (e.key === 'Escape') { dismissWelcome(); document.removeEventListener('keydown', escHandler); }
  };
  document.addEventListener('keydown', escHandler);

  /* Intentar animar de inmediato; si GSAP no cargó aún, esperar window.load */
  if (typeof gsap !== 'undefined') {
    animateWelcomeIn();
  } else {
    window.addEventListener('load', animateWelcomeIn, { once: true });
  }
}

/* ---------- MUSIC PLAYER ---------- */
function initMusicPlayer() {
  const audio = document.getElementById('bg-music');
  const btn   = document.getElementById('music-toggle');
  if (!audio || !btn) return;

  audio.volume = 0;

  const PREF_KEY  = 'lf-music-pref'; // 'off' = usuario pausó manualmente
  const userPaused = sessionStorage.getItem(PREF_KEY) === 'off';

  function setPlaying(playing) {
    btn.classList.toggle('is-playing', playing);
    btn.classList.remove('wants-play');
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label',
      playing ? 'Pausar música de fondo' : 'Reproducir música de fondo');
  }

  function play() {
    audio.play()
      .then(() => {
        setPlaying(true);
        fadeVolume(audio, 0, 0.30, 1400);
        sessionStorage.removeItem(PREF_KEY);
      })
      .catch(() => {
        /* Navegador bloqueó autoplay: esperamos primera interacción */
        setPlaying(false);
        if (!userPaused) scheduleAutoplayOnInteraction();
      });
  }

  function pause() {
    fadeVolume(audio, audio.volume, 0, 600, () => {
      audio.pause();
      audio.volume = 0;
    });
    setPlaying(false);
    sessionStorage.setItem(PREF_KEY, 'off');
  }

  /* Intenta reproducir al primer gesto del usuario (scroll / toque / click) */
  function scheduleAutoplayOnInteraction() {
    btn.classList.add('wants-play'); // botón pulsa dorado suavemente
    const events = ['scroll', 'touchstart', 'click', 'keydown'];
    function onFirstInteraction() {
      events.forEach(e => window.removeEventListener(e, onFirstInteraction));
      if (audio.paused && !userPaused) play();
    }
    events.forEach(e => window.addEventListener(e, onFirstInteraction, { once: true, passive: true }));
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // no activa onFirstInteraction
    if (audio.paused) play(); else pause();
  });

  /* Intentar autoplay directo en carga */
  if (!userPaused) play();

  /* Toast suave si el navegador bloqueó el autoplay y el usuario no interactuó */
  setTimeout(() => {
    if (audio.paused && !userPaused && btn.classList.contains('wants-play')) {
      showMusicToast();
    }
  }, 4000);
}

function showMusicToast() {
  const existing = document.getElementById('music-toast');
  if (existing) return;
  const toast = document.createElement('div');
  toast.id = 'music-toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = '♪ Toca para activar la música';
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('music-toast--visible'), 50);
  setTimeout(() => {
    toast.classList.remove('music-toast--visible');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function fadeVolume(audioEl, from, to, durationMs, onDone) {
  audioEl.volume = from;
  const steps    = 40;
  const stepTime = durationMs / steps;
  const delta    = (to - from) / steps;
  let   current  = from;
  const timer = setInterval(() => {
    current = Math.min(Math.max(current + delta, 0), 1);
    audioEl.volume = parseFloat(current.toFixed(3));
    if ((delta > 0 && current >= to) || (delta < 0 && current <= to)) {
      clearInterval(timer);
      if (onDone) onDone();
    }
  }, stepTime);
}

/* ---------- COUNTDOWN ---------- */
function startCountdown() {
  const weddingDate = new Date('2026-11-02T11:00:00-05:00');
  const daysEl  = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl  = document.getElementById('cd-mins');
  if (!daysEl) return;

  function tick() {
    const diff = weddingDate - Date.now();
    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    daysEl.textContent  = d;
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent  = String(m).padStart(2, '0');
  }

  tick();
  setInterval(tick, 60000);
}

/* ---------- STARS BACKGROUND ---------- */
function createStars() {
  const container = document.getElementById('stars-bg');
  if (!container) return;
  const count = REDUCE_FX ? 35 : 70;
  const colorClasses = ['', '', '', '', 'star--pink', 'star--purple', 'star--gold'];
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    if (colorClass) star.classList.add(colorClass);
    const size = Math.random() * 2.5 + 0.8;
    star.style.cssText = `
      width:${size}px;
      height:${size}px;
      top:${Math.random() * 100}%;
      left:${Math.random() * 100}%;
      --t:${(Math.random() * 3 + 2).toFixed(1)}s;
      --d:${(Math.random() * 4).toFixed(1)}s;
    `;
    container.appendChild(star);
  }
}

/* ---------- FIREFLIES ---------- */
function createFireflies() {
  const container = document.getElementById('fireflies');
  if (!container) return;
  const count = REDUCE_FX ? 10 : 22;
  const colorClasses = ['', '', '', 'firefly--pink', 'firefly--purple'];
  for (let i = 0; i < count; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
    const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
    if (colorClass) ff.classList.add(colorClass);
    const dx  = (Math.random() - 0.5) * 80;
    const dy  = -(Math.random() * 60 + 20);
    const dx2 = (Math.random() - 0.5) * 60;
    const dy2 = -(Math.random() * 80 + 40);
    ff.style.cssText = `
      left:${Math.random() * 100}%;
      top:${Math.random() * 70 + 20}%;
      --dur:${(Math.random() * 5 + 4).toFixed(1)}s;
      --delay:${(Math.random() * 6).toFixed(1)}s;
      --dx:${dx.toFixed(0)}px;
      --dy:${dy.toFixed(0)}px;
      --dx2:${dx2.toFixed(0)}px;
      --dy2:${dy2.toFixed(0)}px;
    `;
    container.appendChild(ff);
  }
}

/* ---------- FALLING PETALS (ring section) ---------- */
function createPetals() {
  const container = document.getElementById('ring-petals');
  if (!container) return;
  const colors = ['#E84C7D', '#D4623A', '#E8A838', '#7B2FBE'];
  const count  = 10;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = Math.random() * 10 + 6;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      opacity:0.7;
      --pd:${(Math.random() * 3 + 3).toFixed(1)}s;
      --delay:${(Math.random() * 5).toFixed(1)}s;
      --px:${((Math.random() - 0.5) * 40).toFixed(0)}px;
    `;
    container.appendChild(p);
  }
}

/* ---------- STAR BURST CANVAS ---------- */
function createStarBurst() {
  const canvas = document.getElementById('star-burst');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function burst(x, y) {
    const colors = ['#E8A838', '#E84C7D', '#7B2FBE', '#FFF8F0', '#D4623A'];
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i) / 50;
      const speed = 3 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        decay: 0.012 + Math.random() * 0.01,
        size: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      const s = p.size * p.life;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - s);
      ctx.quadraticCurveTo(p.x + s*0.2, p.y - s*0.2, p.x + s, p.y);
      ctx.quadraticCurveTo(p.x + s*0.2, p.y + s*0.2, p.x, p.y + s);
      ctx.quadraticCurveTo(p.x - s*0.2, p.y + s*0.2, p.x - s, p.y);
      ctx.quadraticCurveTo(p.x - s*0.2, p.y - s*0.2, p.x, p.y - s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  requestAnimationFrame(loop);
  window.triggerStarBurst = function(x, y) { burst(x, y); };
}

/* ---------- ENVELOPE PARTICLES ---------- */
function createEnvelopeParticles() {
  const container = document.getElementById('envelopes-particles');
  if (!container) return;
  const colors = ['#E8A838', '#E84C7D', '#7B2FBE', '#D4623A', '#FFF8F0'];
  const count = REDUCE_FX ? 10 : 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'envelope-particle';
    const size = Math.random() * 5 + 3;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      --ep-dur:${(Math.random() * 4 + 4).toFixed(1)}s;
      --ep-del:${(Math.random() * 6).toFixed(1)}s;
      --ep-x:${((Math.random() - 0.5) * 55).toFixed(0)}px;
    `;
    container.appendChild(p);
  }
}

/* ---------- CONFETTI (RSVP) ---------- */
function createConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#E8A838', '#E84C7D', '#7B2FBE', '#2D6A4F', '#FFF8F0', '#D4623A'];
  const count  = REDUCE_FX ? 14 : 28;
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    const size = Math.random() * 6 + 4;
    c.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      --cf-dur:${(Math.random() * 3 + 3.5).toFixed(1)}s;
      --cf-del:${(Math.random() * 5).toFixed(1)}s;
      --cf-x:${((Math.random() - 0.5) * 60).toFixed(0)}px;
    `;
    container.appendChild(c);
  }
}

/* ---------- FAMILY FIREFLIES ---------- */
function createFamilyFireflies() {
  const wrapper = document.querySelector('.family__img-wrap');
  if (!wrapper) return;
  const colors = ['#E8A838', '#E84C7D', '#D4623A'];
  const famFfCount = REDUCE_FX ? 3 : 7;
  for (let i = 0; i < famFfCount; i++) {
    const ff = document.createElement('div');
    ff.className = 'family__firefly';
    const size = Math.random() * 4 + 2;
    ff.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 88 + 6}%;
      top:${Math.random() * 75 + 10}%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      box-shadow: 0 0 6px 2px ${colors[Math.floor(Math.random() * colors.length)]}99;
      --ff-dur:${(Math.random() * 3 + 3).toFixed(1)}s;
      --ff-delay:${(Math.random() * 5).toFixed(1)}s;
      --ff-x:${((Math.random()-0.5)*50).toFixed(0)}px;
      --ff-y:${(-(Math.random()*40+15)).toFixed(0)}px;
      --ff-x2:${((Math.random()-0.5)*35).toFixed(0)}px;
      --ff-y2:${(-(Math.random()*60+25)).toFixed(0)}px;
    `;
    wrapper.appendChild(ff);
  }
}

/* ---------- SCROLL HINT ---------- */
function initScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');
  if (!scrollHint) return;
  const hideHint = () => {
    if (window.scrollY > 60) {
      scrollHint.classList.add('hidden');
      window.removeEventListener('scroll', hideHint);
    }
  };
  window.addEventListener('scroll', hideHint, { passive: true });
}

/* ---------- FAIRY DUST CANVAS ---------- */
(function fairyDust() {
  const canvas = document.getElementById('fairy-canvas');
  if (!canvas) return;
  /* Solo omitir en hardware muy limitado */
  if (IS_LOW_END) { canvas.style.display = 'none'; return; }
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let mouseX = -999, mouseY = -999;
  let lastSpawn = 0;
  let paused = false;
  const MAX_PARTICLES  = IS_MOBILE ? 35 : 120;
  const SPAWN_INTERVAL = IS_MOBILE ? 50 : 30;

  /* Pausa el loop cuando la pestaña está en background — ahorra batería */
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (!paused) requestAnimationFrame(loop);
  });

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function spawnParticle(x, y) {
    const hue = Math.random() > 0.6 ? 40 : Math.random() > 0.5 ? 320 : 270;
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 1.5 + 0.5),
      life: 1,
      decay: Math.random() * 0.015 + 0.01,
      size: Math.random() * 4 + 2,
      hue,
    });
  }

  function loop(ts) {
    if (paused) return;
    requestAnimationFrame(loop);
    /* Saltar frame si no hay partículas ni cursor activo — ahorra GPU */
    if (particles.length === 0 && mouseX < 0) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ts - lastSpawn > SPAWN_INTERVAL && mouseX > 0) {
      spawnParticle(mouseX + (Math.random()-0.5)*8, mouseY + (Math.random()-0.5)*8);
      if (particles.length < MAX_PARTICLES) {
        spawnParticle(mouseX + (Math.random()-0.5)*16, mouseY + (Math.random()-0.5)*16);
      }
      lastSpawn = ts;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x   += p.vx;
      p.y   += p.vy;
      p.vy  += 0.02;
      p.life -= p.decay;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = `hsl(${p.hue}, 100%, 70%)`;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 80%)`;
      ctx.shadowBlur  = 8;

      ctx.beginPath();
      const s = p.size * p.life;
      ctx.moveTo(p.x, p.y - s);
      ctx.quadraticCurveTo(p.x + s * 0.2, p.y - s * 0.2, p.x + s, p.y);
      ctx.quadraticCurveTo(p.x + s * 0.2, p.y + s * 0.2, p.x, p.y + s);
      ctx.quadraticCurveTo(p.x - s * 0.2, p.y + s * 0.2, p.x - s, p.y);
      ctx.quadraticCurveTo(p.x - s * 0.2, p.y - s * 0.2, p.x, p.y - s);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouseX = t.clientX;
    mouseY = t.clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouseX = -999;
  }, { passive: true });

  requestAnimationFrame(loop);
})();

/* ---------- HELPER: split text into word spans ---------- */
function splitWords(el) {
  if (!el) return [];
  const text = el.textContent.trim();
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
  const words = text.split(/\s+/);
  el.innerHTML = '';
  const spans = [];
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.textContent = word;
    span.style.display = 'inline-block';
    el.appendChild(span);
    /* Espacio real entre palabras — texto normal, no span */
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    spans.push(span);
  });
  return spans;
}

/* ---------- GSAP ANIMATIONS ---------- */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* Respeta prefers-reduced-motion — acorta todas las duraciones a 0 */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(100);
    ScrollTrigger.config({ limitCallbacks: true });
  }

  /* --- Helper: split text into char spans --- */
  function splitChars(el) {
    if (!el) return [];
    const text = el.textContent;
    if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', text);
    el.innerHTML = '';
    return [...text].map(ch => {
      if (ch === ' ') {
        /* Espacio real como nodo de texto — no colapsa */
        el.appendChild(document.createTextNode(' '));
        return null;
      }
      const span = document.createElement('span');
      span.textContent = ch;
      span.style.display = 'inline-block';
      el.appendChild(span);
      return span;
    }).filter(Boolean);
  }

  /* ---------- 1. HERO entrance (no scroll trigger — fires on load) ---------- */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
    .to('.hero__names',   { opacity: 1, y: 0, duration: 1 }, '-=0.4')
    .to('.hero__divider', { opacity: 0.7, duration: 0.6 }, '-=0.5')
    .to('.hero__date',    { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero__time',    { opacity: 0.8, duration: 0.6 }, '-=0.4')
    .to('.scroll-hint',   { opacity: 1, duration: 0.6 }, '-=0.2');

  /* --- Hero parallax --- */
  gsap.to('.hero__img', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* --- Hero: fade out content al scroll (suave) --- */
  gsap.to('.hero__content', {
    opacity: 0,
    y: -40,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '50% top',
      scrub: 1.5,
    },
  });

  /* ---------- 2. QUOTE ---------- */
  /* Flores: entrada + rotación scrub combinadas */
  gsap.to('.quote__flower-top', {
    opacity: 1, scale: 1, rotation: 180,
    ease: 'none',
    scrollTrigger: { trigger: '#quote', start: 'top 80%', end: 'bottom 20%', scrub: 2 },
  });

  gsap.to('.quote__flower-bottom', {
    opacity: 1, scale: 1, rotation: -180,
    ease: 'none',
    scrollTrigger: { trigger: '#quote', start: 'top 80%', end: 'bottom 20%', scrub: 2 },
  });

  const quoteMainEl = document.getElementById('quote-main');
  const quoteMainWords = splitWords(quoteMainEl);
  if (quoteMainWords.length) {
    gsap.from(quoteMainWords, {
      opacity: 0, y: 20, stagger: 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: '#quote', start: 'top 70%' },
    });
    gsap.to(quoteMainEl, { opacity: 1, y: 0, duration: 0.01 });
    ScrollTrigger.create({
      trigger: '#quote', start: 'top 70%',
      onEnter: () => quoteMainEl && quoteMainEl.classList.add('glow-active'),
    });
  }

  gsap.to('.quote__cite', {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#quote', start: 'top 60%' },
  });

  const quoteSecEl = document.getElementById('quote-secondary');
  const quoteSecChars = splitChars(quoteSecEl);
  if (quoteSecChars.length) {
    gsap.from(quoteSecChars, {
      opacity: 0, y: 20, stagger: 0.018, ease: 'power2.out',
      scrollTrigger: { trigger: '#quote', start: 'top 50%' },
    });
    gsap.to(quoteSecEl, { opacity: 1, y: 0, duration: 0.01 });
    ScrollTrigger.create({
      trigger: '#quote', start: 'top 50%',
      onEnter: () => quoteSecEl && quoteSecEl.classList.add('glow-active'),
    });
  }

  /* ---------- 3. DATE ---------- */
  gsap.set('.date__countdown-label', { opacity: 0 });
  gsap.to('.date__label', {
    opacity: 1, duration: 0.7,
    scrollTrigger: { trigger: '#date', start: 'top 75%' },
  });
  gsap.to('.date__countdown-label', {
    opacity: 0.65, duration: 0.6,
    scrollTrigger: { trigger: '#date', start: 'top 45%' },
  });

  /* Número "2" con efecto visual de construcción */
  gsap.to('.date__number-wrap', {
    opacity: 1, scale: 1, duration: 0.6,
    scrollTrigger: {
      trigger: '#date', start: 'top 65%',
      onEnter: () => {
        const dayEl = document.querySelector('.date__day');
        if (dayEl) {
          gsap.fromTo(dayEl,
            { opacity: 0, scale: 0.3, filter: 'blur(15px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'back.out(1.5)',
              onComplete: () => {
                if (window.triggerStarBurst) {
                  const rect = dayEl.getBoundingClientRect();
                  window.triggerStarBurst(rect.left + rect.width/2, rect.top + rect.height/2);
                }
              }
            }
          );
        }
      }
    },
  });

  gsap.to('.date__month', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#date', start: 'top 55%' },
  });

  gsap.to('.date__year', {
    opacity: 0.7, duration: 0.6,
    scrollTrigger: { trigger: '#date', start: 'top 50%' },
  });

  /* Countdown: entrada stagger secuencial por unidad */
  gsap.to('.countdown', {
    opacity: 1, duration: 0.01,
    scrollTrigger: { trigger: '#date', start: 'top 45%' },
  });

  const countdownUnits = gsap.utils.toArray('.countdown__unit');
  countdownUnits.forEach((unit, idx) => {
    gsap.fromTo(unit,
      { opacity: 0, scale: 0, y: 30 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.6, delay: idx * 0.18,
        ease: 'elastic.out(1, 0.6)',
        scrollTrigger: { trigger: '#date', start: 'top 45%' },
      }
    );
  });

  gsap.utils.toArray('.countdown__sep').forEach((sep, idx) => {
    gsap.fromTo(sep,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, delay: (idx + 1) * 0.18,
        scrollTrigger: { trigger: '#date', start: 'top 45%' } }
    );
  });

  /* ---------- 4. ITINERARY ---------- */
  gsap.to('#timeline-line', {
    height: '100%', ease: 'none',
    scrollTrigger: {
      trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: 0.5,
    },
  });

  gsap.utils.toArray('.timeline__item').forEach((item) => {
    const isLeft = item.classList.contains('timeline__item--left');
    gsap.fromTo(item,
      { opacity: 0, x: isLeft ? -40 : 40 },
      {
        opacity: 1, x: 0,
        ease: 'power1.inOut',
        scrollTrigger: { trigger: item, start: 'top 82%', end: 'center 55%', scrub: 1 },
      }
    );
  });

  /* Dot pulse cuando la línea pasa por cada punto */
  ScrollTrigger.create({
    trigger: '.timeline', start: 'top 70%', end: 'bottom 60%',
    onUpdate: (self) => {
      const dots = gsap.utils.toArray('.timeline__dot');
      dots.forEach((dot, idx) => {
        const threshold = (idx + 0.5) / dots.length;
        if (Math.abs(self.progress - threshold) < 0.18) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    },
  });

  /* ---------- 5. VENUE ---------- */
  gsap.to('.venue__icon', {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '#venue', start: 'top 70%' },
  });

  /* Title reveal char by char */
  const venueTitleEl = document.querySelector('#venue .section-title');
  if (venueTitleEl) {
    gsap.set(venueTitleEl, { opacity: 1 });
    const chars = splitChars(venueTitleEl);
    gsap.from(chars, {
      opacity: 0, y: 10, stagger: 0.035, duration: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: '#venue', start: 'top 65%' },
    });
  }

  /* Address fade-in — preserva <br> y <strong> del HTML */
  const venueAddrEl = document.querySelector('.venue__address');
  if (venueAddrEl) {
    gsap.to(venueAddrEl, {
      opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '#venue', start: 'top 60%' },
    });
  }

  /* Venue name reveal */
  const venueNameEl = document.querySelector('.venue__name');
  if (venueNameEl) gsap.from(venueNameEl, {
    opacity: 0, y: 8, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '#venue', start: 'top 63%' },
  });

  /* Parking note */
  gsap.to('.venue__parking', {
    opacity: 0.75, y: 0, duration: 0.5, ease: 'power2.out',
    scrollTrigger: { trigger: '#venue', start: 'top 55%' },
  });

  gsap.to('#venue .btn', {
    opacity: 1, y: 0, duration: 0.6,
    scrollTrigger: { trigger: '#venue', start: 'top 50%' },
  });

  gsap.to('.venue__img', {
    yPercent: -15, ease: 'none',
    scrollTrigger: { trigger: '#venue', start: 'top bottom', end: 'bottom top', scrub: true },
  });

  /* ---------- 6. FAMILY ---------- */
  createFamilyFireflies();

  /* Title word reveal */
  const familyTitleEl = document.querySelector('.family__phrase');
  if (familyTitleEl) {
    gsap.set(familyTitleEl, { opacity: 1 });
    const fWords = splitWords(familyTitleEl);
    gsap.from(fWords, {
      opacity: 0, y: 12, stagger: 0.1, duration: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: '#family', start: 'top 72%' },
    });
  }

  gsap.to('.family__content', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#family', start: 'top 70%' },
  });

  /* Photo parallax: zoom out while scrolling toward it */
  gsap.fromTo('.family__img',
    { scale: 1.12 },
    {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.family__img-wrap', start: 'top 85%', end: 'center 50%', scrub: 1.5 },
    }
  );

  /* Flowers scroll scrub: solo rotation, sin y (la entrada ya controla y) */
  gsap.to('.family__flower-left', {
    rotation: 25, ease: 'none',
    scrollTrigger: { trigger: '#family', start: 'top 70%', end: 'bottom 30%', scrub: true },
  });

  gsap.to('.family__flower-right', {
    rotation: -25, ease: 'none',
    scrollTrigger: { trigger: '#family', start: 'top 70%', end: 'bottom 30%', scrub: true },
  });

  gsap.to('.family__flower-left, .family__flower-right', {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '#family', start: 'top 65%' },
  });

  /* ---------- 7. DRESSCODE (nueva posición) ---------- */
  gsap.to('.dresscode__group', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#dresscode', start: 'top 70%' },
  });

  gsap.fromTo('.swatch',
    { opacity: 0, y: 18 },
    {
      opacity: 1, y: 0,
      duration: 0.45, stagger: 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: '#dresscode', start: 'top 65%' },
    }
  );

  /* ---------- 8. RING ---------- */
  gsap.to('.ring__content', {
    opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#ring', start: 'top 72%' },
  });

  /* Reveal vertical: clip-path de arriba a abajo con scrub */
  gsap.to('.ring__img', {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    ease: 'power1.inOut',
    scrollTrigger: { trigger: '#ring', start: 'top 60%', end: 'center 40%', scrub: 1.2 },
  });

  /* Quote reveal word by word */
  const ringQuoteEl = document.getElementById('ring-quote');
  if (ringQuoteEl) {
    gsap.set(ringQuoteEl, { opacity: 1 });
    const qWords = splitWords(ringQuoteEl);
    gsap.from(qWords, {
      opacity: 0, y: 8, stagger: 0.1, duration: 0.5, ease: 'power2.out',
      scrollTrigger: { trigger: '#ring', start: 'center 55%' },
    });
  }

  /* ---------- 9. LLUVIA DE SOBRES ---------- */

  /* Contenedor principal: fade + slide up */
  gsap.to('.envelopes__content', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#envelopes', start: 'top 72%' },
  });

  /* Icono del sobre: entrada con scale + bounce */
  gsap.to('.envelopes__icon', {
    opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '#envelopes', start: 'top 70%' },
  });

  /* Flotación suave del sobre una vez que entra */
  ScrollTrigger.create({
    trigger: '#envelopes',
    start: 'top 70%',
    onEnter: () => {
      gsap.to('.envelope-svg', {
        y: -6, yoyo: true, repeat: -1, duration: 2.8, ease: 'sine.inOut', delay: 0.9,
      });
    },
  });

  /* Título: reveal char by char */
  const envTitleEl = document.querySelector('.envelopes__title');
  if (envTitleEl) {
    gsap.set(envTitleEl, { opacity: 1 });
    const envChars = splitChars(envTitleEl);
    gsap.from(envChars, {
      opacity: 0, y: 12, stagger: 0.038, duration: 0.45, ease: 'power2.out',
      scrollTrigger: { trigger: '#envelopes', start: 'top 65%' },
    });
  }

  /* Texto lead: palabras en cascada */
  const envLeadEl = document.querySelector('.envelopes__lead');
  if (envLeadEl) {
    gsap.set(envLeadEl, { opacity: 1 });
    const envLeadWords = splitWords(envLeadEl);
    gsap.from(envLeadWords, {
      opacity: 0, y: 14, stagger: 0.06, duration: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: '#envelopes', start: 'top 62%' },
    });
  }

  /* Texto cuerpo: fade in simple */
  gsap.fromTo('.envelopes__body',
    { opacity: 0, y: 16 },
    {
      opacity: 0.75, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '#envelopes', start: 'top 58%' },
    }
  );

  /* Card bancaria: entrada con luz y slide */
  gsap.to('#envelopes-card', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '#envelopes', start: 'top 50%' },
  });

  /* Filas de la card: stagger sutil */
  gsap.fromTo('.envelopes__bank-row',
    { opacity: 0, x: -12 },
    {
      opacity: 1, x: 0,
      duration: 0.4, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '#envelopes', start: 'top 46%' },
    }
  );

  /* Partículas: inicio al entrar en viewport */
  const envObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.utils.toArray('.envelope-particle').forEach(piece => {
        const dur  = parseFloat(piece.style.getPropertyValue('--ep-dur'))  || 5;
        const del  = parseFloat(piece.style.getPropertyValue('--ep-del'))  || 0;
        const xOff = parseFloat(piece.style.getPropertyValue('--ep-x'))    || 20;
        gsap.fromTo(piece,
          { opacity: 0, y: 0 },
          { opacity: 0.65, y: '100vh', rotation: 540, x: xOff,
            duration: dur, delay: del, repeat: -1, repeatDelay: 2, ease: 'none' }
        );
      });
      envObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  const envSection = document.getElementById('envelopes');
  if (envSection) envObserver.observe(envSection);

  /* ---------- 10. RSVP ---------- */

  /* Castle reveal: clip-path circular */
  let castleFloating = false;
  gsap.to('.rsvp__castle', {
    opacity: 1,
    clipPath: 'circle(100% at 50% 50%)',
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '#rsvp', start: 'top 60%', end: 'top 20%', scrub: 0.8,
      onLeave: () => {
        if (!castleFloating) {
          castleFloating = true;
          gsap.to('.rsvp__castle', { y: -8, yoyo: true, repeat: -1, duration: 4, ease: 'sine.inOut' });
        }
      },
    },
  });

  /* Confetti: iniciar solo al entrar en viewport */
  const rsvpObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      gsap.utils.toArray('.confetti-piece').forEach(piece => {
        const dur  = parseFloat(piece.style.getPropertyValue('--cf-dur'))  || 4;
        const del  = parseFloat(piece.style.getPropertyValue('--cf-del'))  || 0;
        const xOff = parseFloat(piece.style.getPropertyValue('--cf-x'))    || 20;
        gsap.fromTo(piece,
          { opacity: 0, y: 0 },
          { opacity: 1, y: '100vh', rotation: 720, x: xOff,
            duration: dur, delay: del, repeat: -1, repeatDelay: 1.5, ease: 'none' }
        );
      });
      rsvpObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  const rsvpSection = document.getElementById('rsvp');
  if (rsvpSection) rsvpObserver.observe(rsvpSection);

  /* Contenido principal */
  gsap.to('.rsvp__content', {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#rsvp', start: 'top 70%' },
  });

  /* Botón WhatsApp: entrance con escala + glow */
  gsap.to('.btn--whatsapp', {
    opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)',
    scrollTrigger: { trigger: '#rsvp', start: 'top 60%' },
  });

  /* Footer names: char by char */
  const footerNamesEl = document.getElementById('rsvp-footer-names');
  if (footerNamesEl) {
    gsap.set(footerNamesEl, { opacity: 1 });
    const fChars = splitChars(footerNamesEl);
    gsap.from(fChars, {
      opacity: 0, y: 8, stagger: 0.05, duration: 0.4, ease: 'power2.out',
      scrollTrigger: { trigger: '.rsvp__footer', start: 'top 80%' },
    });
  }

  /* Sparkles en progress bar — un solo ScrollTrigger, sin tween conflictivo */
  const sparkleContainer = document.querySelector('.scroll-sparkles');
  if (sparkleContainer) {
    const sparkles = [];
    for (let i = 0; i < 4; i++) {
      const sp = document.createElement('div');
      sp.className = 'scroll-sparkle';
      sparkleContainer.appendChild(sp);
      sparkles.push(sp);
    }
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const pct = self.progress * 100;
        const visible = pct > 0.5 && pct < 99.5;
        sparkles.forEach((sp, i) => {
          sp.style.left    = `${Math.max(0, pct - i * 2)}%`;
          sp.style.opacity = visible ? String(0.9 - i * 0.18) : '0';
        });
      },
    });
  }
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyGuest();
  startCountdown();
  createStars();
  createFireflies();
  createPetals();
  createConfetti();
  createEnvelopeParticles();
  createStarBurst();
  initScrollHint();
  initMusicPlayer();
});

// GSAP loads deferred — wait for it
window.addEventListener('load', () => {
  initGSAP();
});
