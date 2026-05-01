import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let db = null;

export async function initDatabase() {
  if (config.dbType === 'sqlite') {
    return await initSQLiteDatabase();
  } else if (config.dbType === 'mongodb') {
    // MongoDB setup would go here
    console.log('MongoDB not yet implemented, using SQLite fallback');
    return await initSQLiteDatabase();
  }
}

async function initSQLiteDatabase() {
  db = await open({
    filename: config.dbPath,
    driver: sqlite3.Database,
  });

  // Enable foreign keys
  await db.exec('PRAGMA foreign_keys = ON');

  // Create tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      descricao TEXT,
      detalhes TEXT,
      preco REAL NOT NULL,
      icone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      google_id TEXT UNIQUE,
      github_id TEXT UNIQUE,
      nome TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default services if table is empty
  const count = await db.get('SELECT COUNT(*) as count FROM services');
  if (count.count === 0) {
    await seedServices();
  }

  console.log('✓ SQLite Database initialized');
  return db;
}

async function seedServices() {
  const services = [
    {
      id: 'desenvolvimento-sites',
      nome: 'Desenvolvimento de Sites',
      descricao: 'Sites responsivos e otimizados para SEO',
      detalhes: 'Criamos sites modernos, rápidos e otimizados para buscadores. Incluindo design responsivo, integração com APIs e CMS.',
      preco: 3000,
      icone: 'globe',
    },
    {
      id: 'instalacao-servidores',
      nome: 'Instalação de Servidores',
      descricao: 'Setup e configuração profissional de servidores',
      detalhes: 'Configuração completa de servidores (Linux, Windows), segurança, backups e manutenção contínua.',
      preco: 1500,
      icone: 'server',
    },
    {
      id: 'desenvolvimento-sistemas',
      nome: 'Desenvolvimento de Sistemas',
      descricao: 'Sistemas customizados para sua empresa',
      detalhes: 'Desenvolvemos sistemas sob medida para resolver problemas específicos do seu negócio. Web, desktop ou mobile.',
      preco: 5000,
      icone: 'code',
    },
    {
      id: 'landing-pages',
      nome: 'Landing Pages',
      descricao: 'Landing pages otimizadas para conversão',
      detalhes: 'Páginas de captura de leads com design atrativo e alto potencial de conversão. A/B testing incluído.',
      preco: 2000,
      icone: 'rocket',
    },
    {
      id: 'marketing-digital',
      nome: 'Marketing Digital',
      descricao: 'Estratégias de tráfego pago, SEO e presença digital para atrair mais clientes.',
      detalhes: 'Gestão completa de tráfego pago (Google Ads, Meta Ads), SEO on-page e off-page, criação de conteúdo e relatórios mensais de performance.',
      preco: 1800,
      icone: 'megaphone',
    },
    {
      id: 'automacao',
      nome: 'Automação Instagram & WhatsApp',
      descricao: 'Bots e automações para atendimento, captação de leads e vendas 24h por dia.',
      detalhes: 'Desenvolvimento de chatbots inteligentes para Instagram e WhatsApp. Fluxos de atendimento automatizados, captação de leads e integração com CRM.',
      preco: 2500,
      icone: 'bot',
    },
  ];

  for (const service of services) {
    await db.run(
      'INSERT INTO services (id, nome, descricao, detalhes, preco, icone) VALUES (?, ?, ?, ?, ?, ?)',
      [service.id, service.nome, service.descricao, service.detalhes, service.preco, service.icone]
    );
  }

  console.log('✓ Seeded 6 default services');
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

// Service queries
export async function getAllServices() {
  return await db.all('SELECT * FROM services ORDER BY created_at');
}

export async function getServiceById(id) {
  return await db.get('SELECT * FROM services WHERE id = ?', [id]);
}

export async function updateService(id, data) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (['nome', 'descricao', 'detalhes', 'preco', 'icone'].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  values.push(id);
  fields.push('updated_at = CURRENT_TIMESTAMP');

  const query = `UPDATE services SET ${fields.join(', ')} WHERE id = ?`;
  return await db.run(query, [...values.slice(0, -1), id]);
}

// Contact queries
export async function createContact(nome, email, mensagem) {
  return await db.run('INSERT INTO contacts (nome, email, mensagem) VALUES (?, ?, ?)', [
    nome,
    email,
    mensagem,
  ]);
}

// Admin user queries
export async function createOrUpdateAdminUser(profile) {
  const existingUser = await db.get('SELECT * FROM admin_users WHERE email = ?', [profile.email]);

  if (existingUser) {
    await db.run('UPDATE admin_users SET nome = ? WHERE email = ?', [profile.displayName, profile.email]);
    return existingUser;
  } else {
    const result = await db.run(
      'INSERT INTO admin_users (email, google_id, github_id, nome) VALUES (?, ?, ?, ?)',
      [profile.email, profile.googleId, profile.githubId, profile.displayName]
    );
    return { id: result.lastID, email: profile.email };
  }
}

export async function getAdminUserByEmail(email) {
  return await db.get('SELECT * FROM admin_users WHERE email = ?', [email]);
}
