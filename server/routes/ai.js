import express from 'express';
import { config } from '../config.js';

const router = express.Router();

router.post('/improve', async (req, res) => {
  const { service, idea } = req.body;

  if (!idea?.trim()) {
    return res.status(400).json({ error: 'Campo idea é obrigatório' });
  }

  if (!config.anthropicApiKey) {
    return res.status(503).json({ error: 'IA não configurada' });
  }

  try {
    const response = await fetch(`${config.aiApiUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.anthropicApiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: `Você é um assistente especialista em briefings digitais. Reescreva a ideia do cliente de forma mais clara, objetiva e detalhada para o serviço "${service}". Mantenha a intenção original, mas torne o texto mais profissional e fácil de entender para uma agência de desenvolvimento. Responda SOMENTE com o texto reescrito, sem explicações ou prefácios.\n\nIdeia original: "${idea}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error('Anthropic API error:', response.status, err);
      return res.status(502).json({ error: 'Serviço de IA indisponível' });
    }

    const data = await response.json();
    const improved = data.content?.find((c) => c.type === 'text')?.text?.trim() || idea;

    res.json({ improved });
  } catch (err) {
    console.error('AI improve error:', err);
    res.status(500).json({ error: 'Erro interno ao processar IA' });
  }
});

export default router;
