import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

export const config = {
  // Application
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,

  // Database
  dbType: process.env.DB_TYPE || 'sqlite',
  dbPath: process.env.DB_PATH || path.join(rootDir, 'database.sqlite3'),
  mongodbUri: process.env.MONGODB_URI,

  // AI (Anthropic)
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  aiApiUrl: process.env.AI_API_URL || 'https://api.anthropic.com',

  // OAuth - Google
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',

  // OAuth - GitHub
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',

  // Email
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  contactEmail: process.env.CONTACT_EMAIL,

  // Session
  sessionSecret: process.env.SESSION_SECRET || 'dev-secret-key-change-in-production',

  // WhatsApp
  whatsappNumber: process.env.WHATSAPP_NUMBER || '55XXXXXXXXXXX',

  // Admin
  authorizedAdmins: (process.env.AUTHORIZED_ADMINS || '').split(',').filter(Boolean),

  // Paths
  rootDir,
  publicDir: path.join(rootDir, 'public'),
  adminDir: path.join(rootDir, 'admin'),
  srcDir: path.join(rootDir, 'src'),
};

// Validate critical config — warns but never throws (allows partial deploys)
export function validateConfig() {
  if (!config.googleClientId || !config.googleClientSecret) {
    console.warn('⚠ Google OAuth not configured — admin login unavailable');
  }
  if (!config.emailUser || !config.emailPass) {
    console.warn('⚠ Email not configured — contact form will not send emails');
  }
  console.log(`✓ Configuration loaded (${config.nodeEnv})`);
  console.log(`  Database: ${config.dbType} → ${config.dbPath}`);
  console.log(`  Port: ${config.port}`);
}
