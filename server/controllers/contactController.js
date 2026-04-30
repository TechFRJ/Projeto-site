import nodemailer from 'nodemailer';
import { config } from '../config.js';
import { createContact } from '../models/db.js';

let transporter = null;

export function initializeMailer() {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  });
}

export async function submitContact(req, res) {
  try {
    const { nome, email, mensagem } = req.body;

    // Validate inputs
    if (!nome || !email || !mensagem) {
      return res.status(400).json({
        status: 400,
        message: 'Nome, email e mensagem são obrigatórios',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: 'Email inválido',
      });
    }

    // Sanitize inputs (remove potential XSS)
    const sanitized = {
      nome: String(nome).trim().slice(0, 200),
      email: String(email).trim().toLowerCase(),
      mensagem: String(mensagem).trim().slice(0, 5000),
    };

    // Save to database
    await createContact(sanitized.nome, sanitized.email, sanitized.mensagem);

    // Send email
    if (transporter) {
      const htmlContent = `
        <h2>Nova Mensagem de Contato</h2>
        <p><strong>Nome:</strong> ${sanitized.nome}</p>
        <p><strong>Email:</strong> ${sanitized.email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${sanitized.mensagem.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Enviado via formulário de contato do site FARJ Digital</small></p>
      `;

      await transporter.sendMail({
        from: config.emailUser,
        to: config.contactEmail,
        replyTo: sanitized.email,
        subject: `Novo contato: ${sanitized.nome}`,
        html: htmlContent,
      });
    }

    return res.status(200).json({
      status: 200,
      message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      status: 500,
      message: 'Erro ao enviar mensagem. Tente novamente mais tarde.',
    });
  }
}
