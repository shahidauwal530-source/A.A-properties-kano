import { Router } from 'express';
import {
  getProperties,
  getPropertyById,
  getFeaturedProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  recordWhatsAppClick,
} from '../controllers/propertyController.ts';
import { authMiddleware, adminMiddleware } from '../middleware/auth.ts';

const router = Router();

// Public routes
router.get('/featured', getFeaturedProperties);
router.get('/', getProperties);
router.get('/:id', getPropertyById);
router.post('/:id/whatsapp-click', recordWhatsAppClick);

// Admin-only upload, edit, status, and delete
router.post('/', authMiddleware, adminMiddleware, createProperty);
router.put('/:id', authMiddleware, adminMiddleware, updateProperty);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProperty);
router.put('/:id/status', authMiddleware, adminMiddleware, updatePropertyStatus);

export default router;
