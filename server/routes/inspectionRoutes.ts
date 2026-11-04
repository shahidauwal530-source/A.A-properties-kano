import { Router } from 'express';
import {
  createInspection,
  getMyInspections,
  getAllInspections,
  updateInspectionStatus,
} from '../controllers/inspectionController.ts';
import { authMiddleware, adminMiddleware, optionalAuthMiddleware } from '../middleware/auth.ts';

const router = Router();

router.post('/', optionalAuthMiddleware, createInspection);
router.get('/my', authMiddleware, getMyInspections);
router.get('/', authMiddleware, adminMiddleware, getAllInspections);
router.put('/:id/status', authMiddleware, adminMiddleware, updateInspectionStatus);

export default router;
