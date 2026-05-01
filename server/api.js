import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { config, validateConfig } from './config.js';
import { initDatabase, getAdminUserByEmail, createOrUpdateAdminUser, getAllServices } from './models/db.js';
import { initializeMailer } from './controllers/contactController.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize app
const app = express();

// Validate configuration
validateConfig();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.nodeEnv === 'production', // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
if (config.googleClientId && config.googleClientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.googleClientId,
        clientSecret: config.googleClientSecret,
        callbackURL: config.googleCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await createOrUpdateAdminUser({
            email: profile.emails[0].value,
            displayName: profile.displayName,
            googleId: profile.id,
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

// Passport GitHub Strategy (optional)
if (config.githubClientId && config.githubClientSecret) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: config.githubClientId,
        clientSecret: config.githubClientSecret,
        callbackURL: config.githubCallbackUrl,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
          const user = await createOrUpdateAdminUser({
            email,
            displayName: profile.displayName || profile.username,
            githubId: profile.id,
          });
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

// Serialize/deserialize user for sessions
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  try {
    const user = await getAdminUserByEmail(email);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Lazy DB initialization — safe for both serverless and long-running processes
let _initPromise = null;
function ensureReady() {
  if (!_initPromise) {
    _initPromise = initDatabase()
      .then(() => {
        if (config.emailUser && config.emailPass) {
          initializeMailer();
          console.log('✓ Email configured');
        }
      })
      .catch((err) => {
        console.error('Initialization error:', err);
        _initPromise = null; // allow retry on next request
        throw err;
      });
  }
  return _initPromise;
}

app.use(async (req, res, next) => {
  try {
    await ensureReady();
    next();
  } catch {
    res.status(503).json({ message: 'Service initializing, try again shortly' });
  }
});

// Static files
app.use(express.static(config.publicDir));
app.use('/admin', express.static(config.adminDir));
app.use('/assets', express.static(path.join(config.publicDir, 'assets')));
app.use('/src', express.static(config.srcDir));

// API Routes
app.use('/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Public API: WhatsApp number
app.get('/api/whatsapp', (req, res) => {
  res.json({ number: config.whatsappNumber });
});

// Public API: GET services
app.get('/api/services', async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ message: 'Erro ao buscar serviços' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(config.publicDir, 'index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(config.adminDir, 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    message: 'Erro interno do servidor',
    error: config.nodeEnv === 'development' ? error.message : undefined,
  });
});

// Start HTTP server
ensureReady()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`\n✓ Server running on http://localhost:${config.port}`);
      console.log(`  Landing page: http://localhost:${config.port}`);
      console.log(`  Admin: http://localhost:${config.port}/admin`);
      console.log(`\n${config.nodeEnv === 'development' ? '🔄 Dev mode' : '🚀 Production mode'}\n`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

export default app;
