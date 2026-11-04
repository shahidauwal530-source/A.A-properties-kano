import { Router } from 'express';
import { adminLogin } from '../controllers/authController.ts';
import { getAdminDashboard } from '../controllers/propertyController.ts';
import { getAllInspections } from '../controllers/inspectionController.ts';
import { authMiddleware, adminMiddleware } from '../middleware/auth.ts';

const router = Router();

router.post('/login', adminLogin);
router.get('/dashboard', authMiddleware, adminMiddleware, getAdminDashboard);
router.get('/inspections', authMiddleware, adminMiddleware, getAllInspections);

export default router;
