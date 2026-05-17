/* =============================================
   main.js — Leidy & Fabio Wedding Invitation
   ============================================= */

/* ---------- FASE 2: Guest personalization hook ---------- */
function resolveGuest() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) return null;
  // TODO Fase 2: lookup table or API call here
  // Example: return { name: 'Juan Pérez', seats: 2 };
  return null;
}

function applyGuest() {
  const guest = resolveGuest();
  if (!guest) return;
  const section = document.getElementById('guest-section');
  const nameEl  = document.getElementById('guest-name');
  const seatsEl = document.getElementById('guest-seats');
  if (section && nameEl && seatsEl) {
    nameEl.textContent  = guest.name;
    seatsEl.textContent = guest.seats;
    section.hidden = false;
  }
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
  const count = 60;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
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
  const count = 18;
  for (let i = 0; i < count; i++) {
    const ff = document.createElement('div');
    ff.className = 'firefly';
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

/* ---------- CONFETTI (RSVP) ---------- */
function createConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#E8A838', '#E84C7D', '#7B2FBE', '#2D6A4F', '#FFF8F0', '#D4623A'];
  const count  = 28;
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

/* ---------- FAIRY DUST CANVAS ---------- */
(function fairyDust() {
  const canvas = document.getElementById('fairy-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  let particles = [];
  let mouseX = -999, mouseY = -999;
  let lastSpawn = 0;

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
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ts - lastSpawn > 30 && mouseX > 0) {
      spawnParticle(mouseX + (Math.random()-0.5)*8, mouseY + (Math.random()-0.5)*8);
      if (particles.length < 120) {
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

      // 4-pointed star shape
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

  // Touch support
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

/* ---------- GSAP ANIMATIONS ---------- */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* --- Helper: split text into char spans --- */
  function splitChars(el) {
    if (!el) return [];
    const text   = el.textContent;
    el.innerHTML = '';
    el.setAttribute('aria-label', text);
    return [...text].map(ch => {
      const span = document.createElement('span');
      span.textContent = ch === ' ' ? ' ' : ch;
      span.style.display = 'inline-block';
      el.appendChild(span);
      return span;
    });
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

  /* ---------- 2. QUOTE ---------- */
  gsap.to('.quote__flower-top', {
    opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '#quote', start: 'top 80%' },
  });

  const quoteMainChars = splitChars(document.getElementById('quote-main'));
  if (quoteMainChars.length) {
    gsap.from(quoteMainChars, {
      opacity: 0, y: 20,
      stagger: 0.025,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#quote', start: 'top 70%' },
    });
    gsap.to(document.getElementById('quote-main'), { opacity: 1, y: 0, duration: 0.01 });
  }

  gsap.to('.quote__cite', {
    opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#quote', start: 'top 60%' },
  });

  const quoteSecChars = splitChars(document.getElementById('quote-secondary'));
  if (quoteSecChars.length) {
    gsap.from(quoteSecChars, {
      opacity: 0, y: 20,
      stagger: 0.018,
      ease: 'power2.out',
      scrollTrigger: { trigger: '#quote', start: 'top 50%' },
    });
    gsap.to(document.getElementById('quote-secondary'), { opacity: 1, y: 0, duration: 0.01 });
  }

  gsap.to('.quote__flower-bottom', {
    opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '#quote', start: 'bottom 80%' },
  });

  /* ---------- 3. DATE ---------- */
  gsap.to('.date__label', {
    opacity: 1, duration: 0.7,
    scrollTrigger: { trigger: '#date', start: 'top 75%' },
  });

  gsap.to('.date__number-wrap', {
    opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)',
    scrollTrigger: { trigger: '#date', start: 'top 65%' },
  });

  gsap.to('.date__month', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#date', start: 'top 55%' },
  });

  gsap.to('.date__year', {
    opacity: 0.7, duration: 0.6,
    scrollTrigger: { trigger: '#date', start: 'top 50%' },
  });

  gsap.to('.countdown', {
    opacity: 1, duration: 0.8,
    scrollTrigger: { trigger: '#date', start: 'top 45%' },
  });

  /* ---------- 4. ITINERARY — growing timeline line ---------- */
  gsap.to('#timeline-line', {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 0.5,
    },
  });

  gsap.utils.toArray('.timeline__item').forEach((item) => {
    const isLeft = item.classList.contains('timeline__item--left');
    gsap.to(item, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 78%',
      },
    });
  });

  /* ---------- 5. VENUE ---------- */
  gsap.to('.venue__icon', {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
    scrollTrigger: { trigger: '#venue', start: 'top 70%' },
  });

  gsap.to('.venue__address', {
    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '#venue', start: 'top 60%' },
  });

  gsap.to('#venue .section-title', {
    opacity: 1, y: 0, duration: 0.7,
    scrollTrigger: { trigger: '#venue', start: 'top 65%' },
  });

  gsap.to('#venue .btn', {
    opacity: 1, y: 0, duration: 0.6,
    scrollTrigger: { trigger: '#venue', start: 'top 55%' },
  });

  // Venue parallax
  gsap.to('.venue__img', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#venue',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* ---------- 6. FAMILY ---------- */
  gsap.to('.family__content', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#family', start: 'top 70%' },
  });

  gsap.to('.family__flower-left, .family__flower-right', {
    opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '#family', start: 'top 65%' },
  });

  /* ---------- 7. DRESSCODE ---------- */
  gsap.to('.dresscode__group', {
    opacity: 1, y: 0, duration: 0.7, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#dresscode', start: 'top 70%' },
  });

  gsap.to('.swatch', {
    opacity: 1, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)',
    scrollTrigger: { trigger: '#dresscode', start: 'top 65%' },
  });

  /* ---------- 8. RING ---------- */
  gsap.to('.ring__content', {
    opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#ring', start: 'top 72%' },
  });

  /* ---------- 9. RSVP ---------- */
  gsap.to('.rsvp__content', {
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '#rsvp', start: 'top 70%' },
  });

  /* --- Set initial states for elements that need opacity:1 to be visible on load fallback --- */
  document.querySelectorAll('.venue__address, #venue .section-title, #venue .btn').forEach(el => {
    if (!el.style.transform) el.style.transform = 'translateY(20px)';
    el.style.opacity = '0';
  });
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyGuest();
  startCountdown();
  createStars();
  createFireflies();
  createPetals();
  createConfetti();
});

// GSAP loads deferred — wait for it
window.addEventListener('load', () => {
  initGSAP();
});
