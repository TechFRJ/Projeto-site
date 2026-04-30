import { getAllServices, getServiceById, updateService } from '../models/db.js';

export async function getServices(req, res) {
  try {
    const services = await getAllServices();
    return res.status(200).json(services);
  } catch (error) {
    console.error('Get services error:', error);
    return res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
}

export async function getService(req, res) {
  try {
    const { id } = req.params;
    const service = await getServiceById(id);

    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    return res.status(200).json(service);
  } catch (error) {
    console.error('Get service error:', error);
    return res.status(500).json({ message: 'Erro ao buscar serviço' });
  }
}

export async function updateServicePrice(req, res) {
  try {
    const { id } = req.params;
    const { preco, descricao, detalhes } = req.body;

    // Verify service exists
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }

    // Validate price if provided
    if (preco !== undefined) {
      const price = parseFloat(preco);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({ message: 'Preço deve ser um número positivo' });
      }
    }

    // Update service
    const updateData = {};
    if (preco !== undefined) updateData.preco = parseFloat(preco);
    if (descricao) updateData.descricao = String(descricao).trim().slice(0, 500);
    if (detalhes) updateData.detalhes = String(detalhes).trim().slice(0, 5000);

    await updateService(id, updateData);

    // Return updated service
    const updated = await getServiceById(id);
    return res.status(200).json({
      message: 'Serviço atualizado com sucesso',
      service: updated,
    });
  } catch (error) {
    console.error('Update service error:', error);
    return res.status(500).json({ message: 'Erro ao atualizar serviço' });
  }
}
