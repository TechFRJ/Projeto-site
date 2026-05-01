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

const ICON_MAP = {
  globe: '🌐',
  server: '🖥️',
  code: '💻',
  rocket: '🚀',
  megaphone: '📣',
  bot: '🤖',
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
      const icon = ICON_MAP[service.icone] || '⭐';
      const card = document.createElement('div');
      card.className = 'service-card reveal';
      card.style.setProperty('--delay', `${i * 80}ms`);
      card.innerHTML = `
        <div class="service-icon-wrap">${icon}</div>
        <div class="service-name">${service.nome}</div>
        <div class="service-desc">${service.descricao}</div>
        <span class="service-cta">Solicitar orçamento →</span>
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
  document.getElementById('modal-service-icon').textContent = icon;
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
    btn.textContent = '⏳ Melhorando...';

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
      btn.textContent = '✨ Melhorar com IA';
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
        statusDiv.textContent = '✓ Solicitação enviada! Entraremos em contato em breve.';
        form.reset();
      } else {
        statusDiv.classList.add('error');
        statusDiv.textContent = '✗ ' + (data.message || 'Erro ao enviar');
      }
    } catch {
      statusDiv.hidden = false;
      statusDiv.className = 'form-status error';
      statusDiv.textContent = '✗ Erro de conexão. Tente novamente.';
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
        statusDiv.textContent = '✓ ' + data.message;
        form.reset();
      } else {
        statusDiv.classList.add('error');
        statusDiv.textContent = '✗ ' + (data.message || 'Erro ao enviar mensagem');
      }
    } catch {
      statusDiv.hidden = false;
      statusDiv.className = 'form-status error';
      statusDiv.textContent = '✗ Erro ao enviar mensagem. Tente novamente.';
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
