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

// Validate critical config
export function validateConfig() {
  const isDev = config.nodeEnv === 'development';

  if (!isDev) {
    if (!config.googleClientId || !config.googleClientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required in production');
    }
    if (!config.emailUser || !config.emailPass) {
      throw new Error('EMAIL_USER and EMAIL_PASS are required in production');
    }
  }

  console.log(`✓ Configuration loaded (${config.nodeEnv})`);
  console.log(`  Database: ${config.dbType}`);
  console.log(`  Port: ${config.port}`);
}
