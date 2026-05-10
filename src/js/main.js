// Particle constellation animation in hero canvas
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = 50;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 1.8 + 0.8,
    opacity: Math.random() * 0.5 + 0.25,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(96,170,255,${0.28 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(96,170,255,${p.opacity})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  draw();
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
