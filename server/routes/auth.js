import express from 'express';
import passport from 'passport';
import { checkAuth } from '../middleware/auth.js';

const router = express.Router();

// Check authentication status
router.get('/check', checkAuth);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/admin' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/admin');
  }
);

// GitHub OAuth (optional)
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/admin' }),
  (req, res) => {
    res.redirect('/admin');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }
    res.redirect('/');
  });
});

export default router;
