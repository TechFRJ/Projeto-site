let services = [];
let currentEditId = null;

// Load services from API
async function loadServices() {
  try {
    const response = await fetch('/api/admin/services');

    if (response.status === 401) {
      window.location.href = '/auth/google';
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to load services');
    }

    services = await response.json();
    renderServices();
  } catch (error) {
    console.error('Error loading services:', error);
    document.getElementById('services-tbody').innerHTML =
      '<tr><td colspan="4" class="px-6 py-4 text-center text-red-500">Erro ao carregar serviços</td></tr>';
  }
}

// Render services in table
function renderServices() {
  const tbody = document.getElementById('services-tbody');
  tbody.innerHTML = '';

  if (services.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Nenhum serviço encontrado</td></tr>';
    return;
  }

  services.forEach((service) => {
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-200 hover:bg-gray-50';
    row.innerHTML = `
      <td class="px-6 py-4 font-semibold">${service.nome}</td>
      <td class="px-6 py-4 text-gray-600 text-sm">${service.descricao || '-'}</td>
      <td class="px-6 py-4 text-right font-bold text-blue-600">${formatPrice(service.preco)}</td>
      <td class="px-6 py-4 text-center">
        <button
          type="button"
          onclick="openEditModal('${service.id}')"
          class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
        >
          Editar
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Format price for display
function formatPrice(price) {
  return Number(price).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Open edit modal
function openEditModal(serviceId) {
  const service = services.find((s) => s.id === serviceId);
  if (!service) return;

  currentEditId = serviceId;

  document.getElementById('edit-service-id').value = serviceId;
  document.getElementById('edit-nome').value = service.nome;
  document.getElementById('edit-preco').value = service.preco;
  document.getElementById('edit-descricao').value = service.descricao || '';
  document.getElementById('edit-detalhes').value = service.detalhes || '';

  // Clear status message
  const statusDiv = document.getElementById('edit-status');
  statusDiv.classList.add('hidden');

  // Show modal
  document.getElementById('edit-modal').classList.remove('hidden');
}

// Close edit modal
function closeEditModal() {
  document.getElementById('edit-modal').classList.add('hidden');
  currentEditId = null;
}

// Modal button handlers
document.getElementById('modal-close').addEventListener('click', closeEditModal);
document.getElementById('modal-cancel').addEventListener('click', closeEditModal);

// Close modal when clicking outside
document.getElementById('edit-modal').addEventListener('click', (e) => {
  if (e.target.id === 'edit-modal') {
    closeEditModal();
  }
});

// Handle form submission
document.getElementById('edit-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const serviceId = document.getElementById('edit-service-id').value;
  const preco = parseFloat(document.getElementById('edit-preco').value);
  const descricao = document.getElementById('edit-descricao').value;
  const detalhes = document.getElementById('edit-detalhes').value;

  if (isNaN(preco) || preco < 0) {
    showEditStatus('Preço deve ser um número positivo', 'error');
    return;
  }

  try {
    const submitBtn = document.getElementById('edit-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    const response = await fetch(`/api/admin/services/${serviceId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        preco,
        descricao,
        detalhes,
      }),
    });

    if (response.status === 401) {
      window.location.href = '/auth/google';
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      showEditStatus(data.message || 'Erro ao atualizar serviço', 'error');
    } else {
      showEditStatus('✓ Serviço atualizado com sucesso!', 'success');

      // Update local services array
      const index = services.findIndex((s) => s.id === serviceId);
      if (index !== -1) {
        services[index] = data.service;
      }

      // Close modal after 1.5 seconds
      setTimeout(() => {
        closeEditModal();
        renderServices();
      }, 1500);
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar';
  } catch (error) {
    console.error('Error updating service:', error);
    showEditStatus('Erro ao salvar serviço', 'error');
  }
});

// Show status message in edit form
function showEditStatus(message, type) {
  const statusDiv = document.getElementById('edit-status');
  statusDiv.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

  if (type === 'success') {
    statusDiv.classList.add('bg-green-100', 'text-green-800');
  } else {
    statusDiv.classList.add('bg-red-100', 'text-red-800');
  }

  statusDiv.textContent = message;
}

// Load services on page load
document.addEventListener('DOMContentLoaded', () => {
  // Give auth-check time to complete
  setTimeout(loadServices, 500);
});

// Refresh services periodically (optional)
setInterval(loadServices, 60000); // Every minute
