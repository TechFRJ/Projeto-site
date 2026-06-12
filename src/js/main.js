// Particle constellation animation in hero canvas
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const hero = document.getElementById('inicio');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');

  const STAR_COUNT = window.innerWidth < 768 ? 40 : 100;
  const LINK_DIST = 110;
  let stars = [];
  let dpr = Math.max(1, window.devicePixelRatio || 1);

  function resize() {
    const r = hero.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn() {
    const r = hero.getBoundingClientRect();
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * r.width,
      y: Math.random() * r.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.4,
      tw: Math.random() * Math.PI * 2,           // fase do twinkle
    }));
  }

  function drawFrame() {
    const r = hero.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.strokeStyle = `rgba(96,170,255,${0.18 * (1 - d / LINK_DIST)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
        }
      }
    }
    for (const s of stars) {
      const alpha = 0.55 + Math.sin(s.tw) * 0.35;
      ctx.fillStyle = `rgba(180,210,255,${alpha})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
  }

  function tick() {
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy; s.tw += 0.03;
      const r = hero.getBoundingClientRect();
      if (s.x < 0 || s.x > r.width)  s.vx *= -1;
      if (s.y < 0 || s.y > r.height) s.vy *= -1;
    }
    drawFrame();
    raf = requestAnimationFrame(tick);
  }

  let raf;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  resize(); spawn();
  if (reduced) drawFrame(); else tick();

  addEventListener('resize', () => {
    resize();
    const r = hero.getBoundingClientRect();
    for (const s of stars) {
      s.x = Math.min(s.x, r.width);
      s.y = Math.min(s.y, r.height);
    }
  });
}

// Scroll-based reveal with IntersectionObserver
function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
}

// Nav scroll effect and active link tracking
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);

    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });

    document.querySelectorAll('.nav-links a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });

  hamburger.addEventListener('click', () => {
    const isOpen = !mobileMenu.hidden;
    mobileMenu.hidden = isOpen;
    hamburger.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.getElementById('hero-cta')?.addEventListener('click', () => {
    document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Load WhatsApp number from backend
async function loadWhatsApp() {
  try {
    const res = await fetch('/api/whatsapp');
    const { number } = await res.json();
    const link = `https://wa.me/${number}?text=${encodeURIComponent('Olá, gostaria de saber mais sobre seus serviços.')}`;
    const formatted = number.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, '+$1 ($2) $3-$4');

    document.getElementById('whatsapp-btn')?.setAttribute('href', link);
    document.getElementById('contact-whatsapp-link')?.setAttribute('href', link);

    const footerEl = document.getElementById('footer-whatsapp');
    if (footerEl) footerEl.textContent = formatted;
  } catch {
    // silently ignore — buttons remain as-is
  }
}

// Lucide icon SVGs (stroke-based, inherit currentColor). Sized via CSS.
const ICON_MAP = {
  globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  server: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>',
  code: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  rocket: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
  megaphone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
  bot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
  layout: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="18" height="7" x="3" y="3" rx="1"/><rect width="9" height="7" x="3" y="14" rx="1"/><rect width="5" height="7" x="16" y="14" rx="1"/></svg>',
  star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  loader: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon lucide-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></svg>',
  check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M20 6 9 17l-5-5"/></svg>',
  alert: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
};

// Load services from API and render cards
async function loadServices() {
  const container = document.getElementById('servicos-container');
  if (!container) return;

  try {
    const res = await fetch('/api/services');
    const services = await res.json();

    container.innerHTML = '';

    if (services.length === 0) {
      container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">Nenhum serviço disponível</p>';
      return;
    }

    services.forEach((service, i) => {
      const icon = ICON_MAP[service.icone] || ICON_MAP.star;
      const card = document.createElement('div');
      card.className = 'service-card reveal';
      card.style.setProperty('--delay', `${i * 80}ms`);
      card.innerHTML = `
        <div class="service-icon-wrap">${icon}</div>
        <div class="service-name">${service.nome}</div>
        <div class="service-desc">${service.descricao}</div>
        <span class="service-cta">Solicitar orçamento ${ICON_MAP.arrowRight}</span>
      `;
      card.addEventListener('click', () => openModal(service.id, service.nome, icon));
      container.appendChild(card);
    });

    setupReveal();
  } catch {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--text-muted)">Erro ao carregar serviços. Tente novamente.</p>';
  }
}

// Modal state
let currentService = null;

function openModal(id, nome, icon) {
  currentService = { id, nome, icon };
  document.getElementById('modal-service-icon').innerHTML = icon;
  document.getElementById('modal-service-name').textContent = nome;
  document.getElementById('quote-service-id').value = id;
  document.getElementById('quote-status').hidden = true;
  document.getElementById('quote-form').reset();

  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('open');
  overlay.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';

  setTimeout(() => document.getElementById('quote-nome')?.focus(), 50);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentService = null;
}

function initModal() {
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// AI improve button
function initAiImprove() {
  const btn = document.getElementById('ai-improve-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const ideaEl = document.getElementById('quote-ideia');
    const idea = ideaEl.value.trim();
    if (!idea) { ideaEl.focus(); return; }

    btn.disabled = true;
    btn.innerHTML = `${ICON_MAP.loader} Melhorando...`;

    try {
      const res = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: currentService?.nome || '', idea }),
      });

      if (res.ok) {
        const { improved } = await res.json();
        if (improved) ideaEl.value = improved;
      }
    } catch {
      // silently ignore AI errors
    } finally {
      btn.disabled = false;
      btn.innerHTML = `${ICON_MAP.sparkles} Melhorar com IA`;
    }
  });
}

// Quote form submission
function initQuoteForm() {
  document.getElementById('quote-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const statusDiv = document.getElementById('quote-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const numero = form.numero.value.replace(/\D/g, '');
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.value,
          email: `${numero}@whatsapp.farjdigital`,
          mensagem: `[${currentService?.nome || 'Serviço'}] ${form.ideia.value}`,
        }),
      });

      const data = await res.json();
      statusDiv.hidden = false;
      statusDiv.className = 'form-status';

      if (res.ok) {
        statusDiv.classList.add('success');
        statusDiv.innerHTML = `${ICON_MAP.check} Solicitação enviada! Entraremos em contato em breve.`;
        form.reset();
      } else {
        statusDiv.classList.add('error');
        statusDiv.innerHTML = `${ICON_MAP.alert} ${data.message || 'Erro ao enviar'}`;
      }
    } catch {
      statusDiv.hidden = false;
      statusDiv.className = 'form-status error';
      statusDiv.innerHTML = `${ICON_MAP.alert} Erro de conexão. Tente novamente.`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Solicitação';
    }
  });
}

// Contact form submission
function initContactForm() {
  document.getElementById('contact-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const statusDiv = document.getElementById('form-status');
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome.value,
          email: form.email.value,
          mensagem: form.mensagem.value,
        }),
      });

      const data = await res.json();
      statusDiv.hidden = false;
      statusDiv.className = 'form-status';

      if (res.ok) {
        statusDiv.classList.add('success');
        statusDiv.innerHTML = `${ICON_MAP.check} ${data.message}`;
        form.reset();
      } else {
        statusDiv.classList.add('error');
        statusDiv.innerHTML = `${ICON_MAP.alert} ${data.message || 'Erro ao enviar mensagem'}`;
      }
    } catch {
      statusDiv.hidden = false;
      statusDiv.className = 'form-status error';
      statusDiv.innerHTML = `${ICON_MAP.alert} Erro ao enviar mensagem. Tente novamente.`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNav();
  initSmoothScroll();
  initModal();
  initAiImprove();
  initQuoteForm();
  initContactForm();
  setupReveal();

  loadWhatsApp();
  loadServices();
});
