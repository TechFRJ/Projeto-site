// Load services and render them
async function loadServices() {
  try {
    const response = await fetch('/api/services');
    const services = await response.json();

    const container = document.getElementById('servicos-container');
    container.innerHTML = '';

    if (services.length === 0) {
      container.innerHTML = '<p class="col-span-full text-center text-gray-500">Nenhum serviço disponível</p>';
      return;
    }

    services.forEach((service) => {
      const card = document.createElement('div');
      card.className = 'bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer';
      card.innerHTML = `
        <div class="text-3xl mb-4">${getServiceIcon(service.icone)}</div>
        <h3 class="text-xl font-bold mb-2">${service.nome}</h3>
        <p class="text-gray-600 text-sm mb-4">${service.descricao}</p>
        <div class="text-2xl font-bold text-blue-600">R$ ${formatPrice(service.preco)}</div>
      `;
      card.addEventListener('click', () => {
        document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
      });
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading services:', error);
    const container = document.getElementById('servicos-container');
    container.innerHTML = '<p class="col-span-full text-center text-red-500">Erro ao carregar serviços</p>';
  }
}

function getServiceIcon(iconName) {
  const icons = {
    globe: '🌐',
    server: '🖥️',
    code: '💻',
    rocket: '🚀',
  };
  return icons[iconName] || '⭐';
}

function formatPrice(price) {
  return Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Load WhatsApp number
async function loadWhatsAppNumber() {
  try {
    const response = await fetch('/src/data/whatsapp.json');
    const data = await response.json();
    const number = data.number || '55XXXXXXXXXXX';

    const whatsappLink = `https://wa.me/${number}?text=Olá,%20gostaria%20de%20saber%20mais%20sobre%20seus%20serviços.`;

    document.getElementById('whatsapp-btn').href = whatsappLink;
    const footerWhatsapp = document.getElementById('footer-whatsapp');
    if (footerWhatsapp) {
      footerWhatsapp.href = whatsappLink;
      // Format phone for display
      const formatted = number.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      footerWhatsapp.textContent = formatted;
    }
  } catch (error) {
    console.warn('Could not load WhatsApp number:', error);
  }
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const statusDiv = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: form.nome.value,
        email: form.email.value,
        mensagem: form.mensagem.value,
      }),
    });

    const data = await response.json();

    statusDiv.classList.remove('hidden', 'bg-red-100', 'text-red-800', 'bg-green-100', 'text-green-800');

    if (response.ok) {
      statusDiv.classList.add('bg-green-100', 'text-green-800');
      statusDiv.textContent = '✓ ' + data.message;
      form.reset();
    } else {
      statusDiv.classList.add('bg-red-100', 'text-red-800');
      statusDiv.textContent = '✗ ' + (data.message || 'Erro ao enviar mensagem');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    statusDiv.classList.remove('hidden', 'bg-green-100', 'text-green-800');
    statusDiv.classList.add('bg-red-100', 'text-red-800');
    statusDiv.textContent = '✗ Erro ao enviar mensagem. Tente novamente.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensagem';
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadServices();
  loadWhatsAppNumber();

  // Update active nav link on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
      link.classList.remove('text-blue-600', 'font-semibold');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('text-blue-600', 'font-semibold');
      }
    });
  });
});
