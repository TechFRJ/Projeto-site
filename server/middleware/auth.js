import { config } from '../config.js';

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // For API calls, return JSON
  if (req.path.startsWith('/api/')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // For page requests, redirect to login
  return res.redirect('/auth/google');
}

export function isAuthorizedAdmin(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.redirect('/auth/google');
  }

  const userEmail = req.user?.email;

  // Check if user is in authorized admins list
  if (config.authorizedAdmins.length > 0) {
    if (!config.authorizedAdmins.includes(userEmail)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
  }

  return next();
}

export function checkAuth(req, res) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: true,
      user: {
        email: req.user?.email,
        name: req.user?.displayName,
      },
    });
  }

  return res.status(401).json({
    authenticated: false,
  });
}
