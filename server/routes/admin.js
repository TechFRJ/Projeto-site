import express from 'express';
import { isAuthorizedAdmin } from '../middleware/auth.js';
import { getServices, getService, updateServicePrice } from '../controllers/adminController.js';

const router = express.Router();

// All routes protected by authorization
router.get('/services', isAuthorizedAdmin, getServices);

router.get('/services/:id', isAuthorizedAdmin, getService);

router.patch('/services/:id', isAuthorizedAdmin, updateServicePrice);

export default router;
